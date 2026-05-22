import type { ChallengeCategory } from '@/types'

interface CategoryOption {
  id: ChallengeCategory
  label: string
  description: string
}

const CATEGORIES: CategoryOption[] = [
  {
    id: 'formal-presentation',
    label: 'Formal Presentation',
    description: 'Structured delivery to executives, investors, or public audiences',
  },
  {
    id: 'interpersonal-influence',
    label: 'Interpersonal Influence',
    description: 'One-on-one persuasion, negotiation, and difficult conversations',
  },
  {
    id: 'meeting-leadership',
    label: 'Meeting Leadership',
    description: 'Facilitating alignment, driving decisions, and redirecting discussion',
  },
]

interface CategorySelectorProps {
  selected: ChallengeCategory | null
  onChange: (category: ChallengeCategory) => void
  disabled?: boolean
}

export default function CategorySelector({ selected, onChange, disabled }: CategorySelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {CATEGORIES.map(({ id, label, description }) => {
        const isSelected = selected === id
        return (
          <button
            key={id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(id)}
            className="text-left rounded-xl p-4 flex flex-col gap-2 transition-all duration-150 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: isSelected
                ? 'var(--color-accent-muted)'
                : 'var(--color-surface-raised)',
              border: `1px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border-subtle)'}`,
              outline: 'none',
            }}
          >
            <span
              className="text-sm font-semibold leading-tight"
              style={{ color: isSelected ? 'var(--color-accent)' : 'var(--color-text-primary)' }}
            >
              {label}
            </span>
            <span
              className="text-xs leading-relaxed"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {description}
            </span>
          </button>
        )
      })}
    </div>
  )
}
