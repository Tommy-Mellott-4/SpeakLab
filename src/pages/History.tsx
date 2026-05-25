import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { storageGet, storageSet } from '@/utils/storage'
import { STORAGE_KEYS } from '@/types'
import type { SessionRecord, SessionScore } from '@/types'

const CATEGORY_LABELS: Record<string, string> = {
  'formal-presentation': 'Formal Presentation',
  'interpersonal-influence': 'Interpersonal Influence',
  'meeting-leadership': 'Meeting Leadership',
}

const DIFFICULTY_LABELS: Record<string, string> = {
  foundation: 'Foundation',
  competency: 'Competency',
  mastery: 'Mastery',
}

const SCORE_DIMS: { key: keyof Omit<SessionScore, 'rationale' | 'priorityGaps'>; label: string }[] =
  [
    { key: 'structure', label: 'Structure' },
    { key: 'clarity', label: 'Clarity' },
    { key: 'economy', label: 'Economy' },
    { key: 'confidenceSignals', label: 'Confidence' },
    { key: 'engagement', label: 'Engagement' },
  ]

function avgScore(score: SessionScore): number {
  const { structure, clarity, economy, confidenceSignals, engagement } = score
  return Math.round(((structure + clarity + economy + confidenceSignals + engagement) / 5) * 10) / 10
}

function formatDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function formatDuration(seconds?: number): string {
  if (!seconds) return '—'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return m > 0 ? `${m}m ${s}s` : `${s}s`
}

function ScoreBar({ value }: { value: number }) {
  const pct = Math.round((value / 10) * 100)
  const color =
    value >= 8
      ? 'var(--color-accent)'
      : value >= 5
        ? 'oklch(70% 0.15 200)'
        : 'oklch(60% 0.18 25)'
  return (
    <div
      className="h-1.5 rounded-full w-full overflow-hidden"
      style={{ backgroundColor: 'var(--color-border-subtle)' }}
    >
      <div
        className="h-full rounded-full"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  )
}

function ScoreBadge({ value }: { value: number }) {
  const color =
    value >= 8
      ? { bg: 'oklch(20% 0.06 120)', text: 'oklch(70% 0.2 140)' }
      : value >= 5
        ? { bg: 'oklch(18% 0.04 200)', text: 'oklch(70% 0.15 200)' }
        : { bg: 'oklch(20% 0.05 25)', text: 'oklch(65% 0.18 25)' }
  return (
    <span
      className="text-xs font-semibold px-2 py-0.5 rounded-full tabular-nums"
      style={{ backgroundColor: color.bg, color: color.text }}
    >
      {value}/10
    </span>
  )
}

function SessionCard({
  record,
  onDelete,
}: {
  record: SessionRecord
  onDelete: (id: string) => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const avg = record.score ? avgScore(record.score) : null
  const challenge = record.challengeSnapshot
  const fillerTotal = record.fillerCounts
    ? Object.values(record.fillerCounts).reduce((s, c) => s + c, 0)
    : null
  const activeFillers = record.fillerCounts
    ? Object.entries(record.fillerCounts).filter(([, c]) => c > 0).sort(([, a], [, b]) => b - a)
    : []

  function handleDelete() {
    if (!confirmDelete) {
      setConfirmDelete(true)
      return
    }
    onDelete(record.id)
  }

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor: 'var(--color-surface-raised)',
        border: '1px solid var(--color-border-subtle)',
      }}
    >
      {/* Card header — always visible */}
      <button
        type="button"
        className="w-full text-left p-5 flex flex-col gap-3"
        onClick={() => { setExpanded((e) => !e); setConfirmDelete(false) }}
      >
        {/* Top row: date + score badge */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {formatDate(record.createdAt)}
          </span>
          <div className="flex items-center gap-2">
            {avg !== null && <ScoreBadge value={avg} />}
            <span
              className="text-xs"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {expanded ? '▲' : '▼'}
            </span>
          </div>
        </div>

        {/* Challenge pills */}
        {challenge && (
          <div className="flex gap-2 flex-wrap">
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: 'var(--color-border-subtle)',
                color: 'var(--color-text-muted)',
              }}
            >
              {CATEGORY_LABELS[challenge.category] ?? challenge.category}
            </span>
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: 'var(--color-border-subtle)',
                color: 'var(--color-text-muted)',
              }}
            >
              {DIFFICULTY_LABELS[challenge.difficulty] ?? challenge.difficulty}
            </span>
          </div>
        )}

        {/* Challenge context snippet */}
        {challenge?.context && (
          <p
            className="text-sm leading-snug line-clamp-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {challenge.context}
          </p>
        )}

        {/* Stat chips */}
        <div className="flex gap-3 flex-wrap">
          {record.wpm != null && (
            <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              <span className="font-semibold tabular-nums" style={{ color: 'var(--color-text-primary)' }}>
                {record.wpm}
              </span>{' '}
              WPM
            </span>
          )}
          {record.wordCount != null && (
            <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              <span className="font-semibold tabular-nums" style={{ color: 'var(--color-text-primary)' }}>
                {record.wordCount}
              </span>{' '}
              words
            </span>
          )}
          {fillerTotal !== null && (
            <span className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              <span className="font-semibold tabular-nums" style={{ color: 'var(--color-text-primary)' }}>
                {fillerTotal}
              </span>{' '}
              filler{fillerTotal !== 1 ? 's' : ''}
            </span>
          )}
          {record.durationSeconds != null && (
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {formatDuration(record.durationSeconds)}
            </span>
          )}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div
          className="px-5 pb-5 flex flex-col gap-5"
          style={{ borderTop: '1px solid var(--color-border-subtle)' }}
        >
          {/* Filler word chips */}
          {activeFillers.length > 0 && (
            <div className="pt-4 flex flex-wrap gap-2">
              {activeFillers.map(([word, count]) => (
                <span
                  key={word}
                  className="text-xs font-medium px-3 py-1 rounded-full"
                  style={{
                    backgroundColor: 'oklch(18% 0.04 270)',
                    color: 'var(--color-accent)',
                    border: '1px solid oklch(30% 0.06 270)',
                  }}
                >
                  {word} × {count}
                </span>
              ))}
            </div>
          )}

          {/* Score breakdown */}
          {record.score && (
            <div className="flex flex-col gap-4">
              <span
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}
              >
                AI Score
              </span>
              {SCORE_DIMS.map(({ key, label }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                      {label}
                    </span>
                    <span
                      className="text-sm font-semibold tabular-nums"
                      style={{ color: 'var(--color-text-primary)' }}
                    >
                      {record.score[key]}/10
                    </span>
                  </div>
                  <ScoreBar value={record.score[key]} />
                  {record.score.rationale[key] && (
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-text-secondary)' }}>
                      {record.score.rationale[key]}
                    </p>
                  )}
                </div>
              ))}

              {record.score.priorityGaps.length > 0 && (
                <div className="flex flex-col gap-2">
                  <span
                    className="text-xs font-medium uppercase tracking-wider"
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    Priority gaps
                  </span>
                  <ul className="flex flex-col gap-1.5">
                    {record.score.priorityGaps.map((gap, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-sm"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        <span style={{ color: 'oklch(60% 0.18 25)' }}>↑</span>
                        {gap}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Transcript */}
          {record.transcript && (
            <div className="flex flex-col gap-2">
              <span
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Transcript
              </span>
              <p
                className="text-sm leading-relaxed max-h-48 overflow-y-auto"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {record.transcript}
              </p>
            </div>
          )}

          {/* Challenge success criteria */}
          {challenge?.successCriteria && challenge.successCriteria.length > 0 && (
            <div className="flex flex-col gap-2">
              <span
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Success criteria
              </span>
              <ul className="flex flex-col gap-1">
                {challenge.successCriteria.map((c, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-xs"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    <span style={{ color: 'var(--color-accent)' }}>✓</span>
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Delete */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleDelete}
              className="text-xs font-medium transition-colors duration-150"
              style={{ color: confirmDelete ? 'oklch(60% 0.18 25)' : 'var(--color-text-muted)' }}
            >
              {confirmDelete ? 'Tap again to delete' : 'Delete session'}
            </button>
            {confirmDelete && (
              <button
                type="button"
                onClick={() => setConfirmDelete(false)}
                className="text-xs"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function History() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState<SessionRecord[]>(() => {
    const stored = storageGet<SessionRecord[]>(STORAGE_KEYS.SESSIONS) ?? []
    return [...stored].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
  })

  const handleDelete = useCallback((id: string) => {
    setSessions((prev) => {
      const next = prev.filter((s) => s.id !== id)
      storageSet(STORAGE_KEYS.SESSIONS, next)
      return next
    })
  }, [])

  const scored = sessions.filter((s) => s.score)
  const avgOverall =
    scored.length > 0
      ? Math.round((scored.reduce((sum, s) => sum + avgScore(s.score!), 0) / scored.length) * 10) / 10
      : null

  return (
    <div className="animate-page-enter py-4 flex flex-col gap-6 max-w-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-semibold tracking-tight mb-1"
            style={{ color: 'var(--color-text-primary)' }}
          >
            History
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {sessions.length === 0
              ? 'Your completed sessions will appear here.'
              : `${sessions.length} session${sessions.length !== 1 ? 's' : ''}${avgOverall !== null ? ` · avg score ${avgOverall}/10` : ''}`}
          </p>
        </div>
      </div>

      {sessions.length === 0 ? (
        <div className="flex flex-col gap-4 pt-4">
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Complete a session to start building your history.
          </p>
          <button
            type="button"
            onClick={() => navigate('/challenge')}
            className="self-start px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-[0.97]"
            style={{ backgroundColor: 'var(--color-accent)', color: 'oklch(10% 0.01 270)' }}
          >
            Get a challenge
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sessions.map((session) => (
            <SessionCard key={session.id} record={session} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  )
}
