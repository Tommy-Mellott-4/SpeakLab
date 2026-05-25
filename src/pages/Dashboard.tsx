import { useNavigate } from 'react-router-dom'
import { storageGet } from '@/utils/storage'
import { STORAGE_KEYS } from '@/types'
import type { SessionRecord, StoredChallenge } from '@/types'

export default function Dashboard() {
  const navigate = useNavigate()
  const sessions = storageGet<SessionRecord[]>(STORAGE_KEYS.SESSIONS) ?? []
  const challenge = storageGet<StoredChallenge>(STORAGE_KEYS.CURRENT_CHALLENGE)

  const totalSessions = sessions.length
  const totalWords = sessions.reduce((sum, s) => sum + (s.wordCount ?? 0), 0)
  const avgWpm =
    sessions.filter((s) => s.wpm).length > 0
      ? Math.round(
          sessions.reduce((sum, s) => sum + (s.wpm ?? 0), 0) /
            sessions.filter((s) => s.wpm).length,
        )
      : null

  return (
    <div className="animate-page-enter py-4 flex flex-col gap-8 max-w-2xl">
      <div>
        <h1
          className="text-2xl font-semibold tracking-tight mb-1"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Practice
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          {totalSessions === 0
            ? 'Get a challenge and start your first session.'
            : `${totalSessions} session${totalSessions !== 1 ? 's' : ''} completed.`}
        </p>
      </div>

      {/* Stats — only show once there's data */}
      {totalSessions > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Sessions', value: totalSessions },
            { label: 'Avg WPM', value: avgWpm ?? '—' },
            { label: 'Words spoken', value: totalWords.toLocaleString() },
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
      )}

      {/* Active challenge preview */}
      {challenge && (
        <div
          className="rounded-xl p-5 flex flex-col gap-3"
          style={{
            backgroundColor: 'var(--color-surface-raised)',
            border: '1px solid var(--color-border-subtle)',
          }}
        >
          <span
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Current challenge
          </span>
          <p
            className="text-sm leading-snug line-clamp-2"
            style={{ color: 'var(--color-text-primary)' }}
          >
            {challenge.context}
          </p>
          <button
            type="button"
            onClick={() => navigate('/session')}
            className="self-start px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-[0.97]"
            style={{ backgroundColor: 'var(--color-accent)', color: 'oklch(10% 0.01 270)' }}
          >
            Start session
          </button>
        </div>
      )}

      {/* Quick actions */}
      <div className="flex gap-3 flex-wrap">
        <button
          type="button"
          onClick={() => navigate('/challenge')}
          className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-[0.97]"
          style={{
            backgroundColor: challenge ? 'var(--color-surface-raised)' : 'var(--color-accent)',
            color: challenge ? 'var(--color-text-primary)' : 'oklch(10% 0.01 270)',
            border: challenge ? '1px solid var(--color-border-subtle)' : 'none',
          }}
        >
          {challenge ? 'New challenge' : 'Get a challenge'}
        </button>

        {totalSessions > 0 && (
          <button
            type="button"
            onClick={() => navigate('/history')}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-[0.97]"
            style={{
              backgroundColor: 'var(--color-surface-raised)',
              color: 'var(--color-text-primary)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            View history
          </button>
        )}
      </div>
    </div>
  )
}
