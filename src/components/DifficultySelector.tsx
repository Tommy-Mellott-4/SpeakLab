import type { ChallengeDifficulty } from '@/types'

interface DifficultyOption {
  id: ChallengeDifficulty
  label: string
  range: string
}

const DIFFICULTIES: DifficultyOption[] = [
  { id: 'foundation', label: 'Foundation', range: '60–90 s' },
  { id: 'competency', label: 'Competency', range: '90–150 s' },
  { id: 'mastery', label: 'Mastery', range: '150–240 s' },
]

interface DifficultySelectorProps {
  selected: ChallengeDifficulty | null
  onChange: (difficulty: ChallengeDifficulty) => void
  disabled?: boolean
}

export default function DifficultySelector({
  selected,
  onChange,
  disabled,
}: DifficultySelectorProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {DIFFICULTIES.map(({ id, label, range }) => {
        const isSelected = selected === id
        return (
          <button
            key={id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(id)}
            className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
            style={{
              backgroundColor: isSelected
                ? 'var(--color-accent-muted)'
                : 'var(--color-surface-raised)',
              border: `1px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border-subtle)'}`,
              color: isSelected ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            }}
          >
            {label}
            <span
              className="text-xs opacity-70"
              style={{ color: isSelected ? 'var(--color-accent)' : 'var(--color-text-muted)' }}
            >
              {range}
            </span>
          </button>
        )
      })}
    </div>
  )
}
