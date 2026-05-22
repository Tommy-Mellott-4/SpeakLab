import type { StoredChallenge } from '@/types'

const CATEGORY_LABELS: Record<StoredChallenge['category'], string> = {
  'formal-presentation': 'Formal Presentation',
  'interpersonal-influence': 'Interpersonal Influence',
  'meeting-leadership': 'Meeting Leadership',
}

const DIFFICULTY_LABELS: Record<StoredChallenge['difficulty'], string> = {
  foundation: 'Foundation',
  competency: 'Competency',
  mastery: 'Mastery',
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return s === 0 ? `${m} min` : `${m}:${String(s).padStart(2, '0')}`
}

interface ChallengeCardProps {
  challenge: StoredChallenge
  onRegenerate: () => void
  isLoading?: boolean
}

export default function ChallengeCard({ challenge, onRegenerate, isLoading }: ChallengeCardProps) {
  return (
    <div
      className="rounded-xl p-6 flex flex-col gap-5 animate-page-enter"
      style={{
        backgroundColor: 'var(--color-surface-raised)',
        border: '1px solid var(--color-border-subtle)',
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: 'var(--color-accent-muted)',
              color: 'var(--color-accent)',
            }}
          >
            {CATEGORY_LABELS[challenge.category]}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: 'var(--color-surface-overlay)',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            {DIFFICULTY_LABELS[challenge.difficulty]}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{
              backgroundColor: 'var(--color-surface-overlay)',
              color: 'var(--color-text-secondary)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            {formatTime(challenge.timeConstraintSeconds)}
          </span>
        </div>
        <button
          type="button"
          onClick={onRegenerate}
          disabled={isLoading}
          className="text-xs font-medium shrink-0 transition-opacity duration-150 disabled:opacity-40 active:scale-[0.97]"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Regenerate
        </button>
      </div>

      {/* Scenario */}
      <p
        className="text-sm leading-relaxed"
        style={{ color: 'var(--color-text-primary)' }}
      >
        {challenge.context}
      </p>

      {/* Success criteria */}
      <div className="flex flex-col gap-2">
        <span
          className="text-xs font-medium uppercase tracking-wider"
          style={{ color: 'var(--color-text-muted)' }}
        >
          Success criteria
        </span>
        <ul className="flex flex-col gap-1.5">
          {challenge.successCriteria.map((criterion, i) => (
            <li key={i} className="flex items-start gap-2 text-sm">
              <span
                className="mt-0.5 shrink-0 w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: 'var(--color-accent)' }}
              />
              <span style={{ color: 'var(--color-text-secondary)' }}>{criterion}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
