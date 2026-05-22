interface PhaseCard {
  phase: number
  title: string
  description: string
  wide?: boolean
}

const PHASE_CARDS: PhaseCard[] = [
  {
    phase: 2,
    title: 'Challenge Engine',
    description: 'AI-generated speaking scenarios across three categories — formal presentation, interpersonal influence, and meeting leadership — with Foundation, Competency, and Mastery tiers.',
    wide: true,
  },
  {
    phase: 3,
    title: 'Live Session',
    description: 'Real-time filler word detection and WPM tracking as you speak, with a live dashboard showing your performance.',
  },
  {
    phase: 4,
    title: 'Post-Session Scoring',
    description: 'Claude evaluates your transcript across Structure, Clarity, Economy, Confidence, and Engagement — each scored 1–10 with a prescribed drill.',
  },
  {
    phase: 5,
    title: 'Session History',
    description: 'All past sessions stored locally with scores over time, trend visibility, and progress reference.',
  },
]

export default function Dashboard() {
  return (
    <div className="animate-page-enter py-4">
      <h1
        className="text-2xl font-semibold tracking-tight mb-1"
        style={{ color: 'var(--color-text-primary)' }}
      >
        Practice
      </h1>
      <p className="text-sm mb-10" style={{ color: 'var(--color-text-secondary)' }}>
        SpeakLab is being built in phases. Here's what's coming.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {PHASE_CARDS.map(({ phase, title, description, wide }) => (
          <div
            key={phase}
            className={`rounded-xl p-6 flex flex-col gap-3 ${wide ? 'md:col-span-2' : ''}`}
            style={{
              backgroundColor: 'var(--color-surface-raised)',
              border: '1px solid var(--color-border-subtle)',
            }}
          >
            <div className="flex items-center justify-between">
              <span
                className="text-xs font-medium uppercase tracking-wider"
                style={{ color: 'var(--color-text-muted)' }}
              >
                Phase {phase}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{
                  backgroundColor: 'var(--color-accent-muted)',
                  color: 'var(--color-accent)',
                }}
              >
                Coming soon
              </span>
            </div>
            <h2
              className="text-base font-semibold"
              style={{ color: 'var(--color-text-primary)' }}
            >
              {title}
            </h2>
            <p
              className="text-sm leading-relaxed"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              {description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
