import { useNavigate } from 'react-router-dom'
import { useSpeechSession } from '@/hooks/useSpeechSession'
import { storageGet } from '@/utils/storage'
import { STORAGE_KEYS } from '@/types'
import type { StoredChallenge } from '@/types'

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

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function Session() {
  const navigate = useNavigate()
  const challenge = storageGet<StoredChallenge>(STORAGE_KEYS.CURRENT_CHALLENGE)
  const {
    unsupported,
    phase,
    transcript,
    fillerCounts,
    wordCount,
    durationSeconds,
    wpm,
    start,
    stop,
    reset,
    saveAndExit,
  } = useSpeechSession()

  const activeFillers = Object.entries(fillerCounts).filter(([, count]) => count > 0)
  const totalFillers = activeFillers.reduce((sum, [, c]) => sum + c, 0)

  // ── State A: no active challenge ──────────────────────────────────────────
  if (!challenge) {
    return (
      <div className="animate-page-enter py-4 flex flex-col gap-6 max-w-2xl">
        <div>
          <h1
            className="text-2xl font-semibold tracking-tight mb-1"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Live Session
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            You need an active challenge before starting a session.
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/challenge')}
          className="self-start px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-[0.97]"
          style={{ backgroundColor: 'var(--color-accent)', color: 'oklch(10% 0.01 270)' }}
        >
          Go to Challenges
        </button>
      </div>
    )
  }

  // ── State B: ready to record ───────────────────────────────────────────────
  if (phase === 'idle') {
    return (
      <div className="animate-page-enter py-4 flex flex-col gap-6 max-w-2xl">
        <div>
          <h1
            className="text-2xl font-semibold tracking-tight mb-1"
            style={{ color: 'var(--color-text-primary)' }}
          >
            Live Session
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Review your challenge, then start when ready.
          </p>
        </div>

        <div
          className="rounded-xl p-5 flex flex-col gap-3"
          style={{
            backgroundColor: 'var(--color-surface-raised)',
            border: '1px solid var(--color-border-subtle)',
          }}
        >
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
          <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-primary)' }}>
            {challenge.context}
          </p>
          {challenge.successCriteria.length > 0 && (
            <ul className="flex flex-col gap-1 mt-1">
              {challenge.successCriteria.map((criterion, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-xs"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <span style={{ color: 'var(--color-accent)' }}>✓</span>
                  {criterion}
                </li>
              ))}
            </ul>
          )}
        </div>

        {unsupported && (
          <p
            className="text-sm px-4 py-3 rounded-lg"
            style={{
              backgroundColor: 'oklch(20% 0.05 25)',
              color: 'oklch(70% 0.15 25)',
              border: '1px solid oklch(30% 0.08 25)',
            }}
          >
            Your browser doesn&apos;t support the Web Speech API. Use Chrome or Edge to record.
          </p>
        )}

        <button
          type="button"
          disabled={unsupported}
          onClick={() => start(challenge)}
          className="self-start px-6 py-3 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: 'var(--color-accent)', color: 'oklch(10% 0.01 270)' }}
        >
          Start Recording
        </button>
      </div>
    )
  }

  // ── State C: recording or done ─────────────────────────────────────────────
  return (
    <div className="animate-page-enter py-4 flex flex-col gap-5 max-w-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-semibold tracking-tight mb-1"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {phase === 'recording' ? 'Recording…' : 'Session Complete'}
          </h1>
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {phase === 'recording'
              ? "Speak clearly. Stop when you're done."
              : "Here's your session summary."}
          </p>
        </div>

        {phase === 'recording' && (
          <div className="flex items-center gap-2 mt-1">
            <span
              className="w-2.5 h-2.5 rounded-full animate-pulse"
              style={{ backgroundColor: 'oklch(60% 0.22 25)' }}
            />
            <span className="text-xs font-mono" style={{ color: 'var(--color-text-muted)' }}>
              {formatTime(durationSeconds)}
            </span>
          </div>
        )}
        {phase === 'done' && (
          <span className="text-xs font-mono mt-1" style={{ color: 'var(--color-text-muted)' }}>
            {formatTime(durationSeconds)}
          </span>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'WPM', value: wpm },
          { label: 'Words', value: wordCount },
          { label: 'Filler words', value: totalFillers },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl p-4 flex flex-col gap-1"
            style={{
              backgroundColor: 'var(--color-surface-raised)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <span
              className="text-2xl font-semibold tabular-nums"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {value}
            </span>
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Filler word chips */}
      {activeFillers.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFillers
            .sort(([, a], [, b]) => b - a)
            .map(([word, count]) => (
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

      {/* Transcript */}
      <div
        className="rounded-xl p-4 flex flex-col gap-2"
        style={{
          backgroundColor: 'var(--color-surface-raised)',
          border: '1px solid var(--color-border-subtle)',
        }}
      >
        <span
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Transcript
        </span>
        <div
          className="text-sm leading-relaxed max-h-48 overflow-y-auto"
          style={{ color: transcript ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}
        >
          {transcript || 'Nothing recorded yet…'}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 flex-wrap">
        {phase === 'recording' && (
          <button
            type="button"
            onClick={stop}
            className="px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-[0.97]"
            style={{ backgroundColor: 'oklch(55% 0.2 25)', color: 'oklch(98% 0.01 0)' }}
          >
            Stop
          </button>
        )}

        {phase === 'done' && (
          <button
            type="button"
            onClick={() => saveAndExit()}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-[0.97]"
            style={{ backgroundColor: 'var(--color-accent)', color: 'oklch(10% 0.01 270)' }}
          >
            Save &amp; Exit
          </button>
        )}

        <button
          type="button"
          onClick={reset}
          className="text-xs font-medium transition-opacity duration-150 active:scale-[0.97]"
          style={{ color: 'var(--color-text-muted)' }}
        >
          {phase === 'recording' ? 'Cancel' : 'Start Over'}
        </button>
      </div>
    </div>
  )
}
