import { useState } from 'react'
import { useApiKey } from '@/hooks/useApiKey'
import { useChallenge } from '@/hooks/useChallenge'
import CategorySelector from '@/components/CategorySelector'
import DifficultySelector from '@/components/DifficultySelector'
import ChallengeCard from '@/components/ChallengeCard'
import type { ChallengeCategory, ChallengeDifficulty } from '@/types'

const ALL_CATEGORIES: ChallengeCategory[] = [
  'formal-presentation',
  'interpersonal-influence',
  'meeting-leadership',
]
const ALL_DIFFICULTIES: ChallengeDifficulty[] = ['foundation', 'competency', 'mastery']

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

export default function Challenge() {
  const { apiKey: key } = useApiKey()
  const { challenge, state, errorMessage, generate, clear } = useChallenge()

  const [category, setCategory] = useState<ChallengeCategory | null>(
    challenge?.category ?? null,
  )
  const [difficulty, setDifficulty] = useState<ChallengeDifficulty | null>(
    challenge?.difficulty ?? null,
  )

  const isLoading = state === 'loading'

  function handleGenerate() {
    if (!key) return
    const cat = category ?? randomItem(ALL_CATEGORIES)
    const diff = difficulty ?? randomItem(ALL_DIFFICULTIES)
    generate(key, cat, diff)
  }

  function handleRegenerate() {
    if (!key) return
    const cat = challenge?.category ?? category ?? randomItem(ALL_CATEGORIES)
    const diff = challenge?.difficulty ?? difficulty ?? randomItem(ALL_DIFFICULTIES)
    generate(key, cat, diff)
  }

  function handleNewChallenge() {
    clear()
  }

  const canGenerate = !isLoading

  return (
    <div className="animate-page-enter py-4 flex flex-col gap-8 max-w-2xl">
      <div>
        <h1
          className="text-2xl font-semibold tracking-tight mb-1"
          style={{ color: 'var(--color-text-primary)' }}
        >
          Challenges
        </h1>
        <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
          Pick a category and difficulty, or let SpeakLab choose for you.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Category
          </span>
          <CategorySelector
            selected={category}
            onChange={setCategory}
            disabled={isLoading}
          />
        </div>

        <div className="flex flex-col gap-2">
          <span
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Difficulty
          </span>
          <DifficultySelector
            selected={difficulty}
            onChange={setDifficulty}
            disabled={isLoading}
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            disabled={!canGenerate}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: 'oklch(10% 0.01 270)',
            }}
          >
            {isLoading ? 'Generating…' : challenge ? 'New challenge' : 'Generate challenge'}
          </button>

          {!isLoading && !category && !difficulty && (
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              No selection = random
            </span>
          )}

          {challenge && !isLoading && (
            <button
              type="button"
              onClick={handleNewChallenge}
              className="text-xs font-medium transition-opacity duration-150 active:scale-[0.97]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Clear
            </button>
          )}
        </div>

        {state === 'error' && errorMessage && (
          <p className="text-sm" style={{ color: 'oklch(65% 0.2 25)' }}>
            {errorMessage}
          </p>
        )}
      </div>

      {/* Loading skeleton */}
      {isLoading && (
        <div
          className="rounded-xl p-6 flex flex-col gap-4"
          style={{
            backgroundColor: 'var(--color-surface-raised)',
            border: '1px solid var(--color-border-subtle)',
          }}
        >
          <div className="flex gap-2">
            {[80, 60, 48].map((w) => (
              <div
                key={w}
                className="h-5 rounded-full animate-pulse"
                style={{
                  width: `${w}px`,
                  backgroundColor: 'var(--color-border-subtle)',
                }}
              />
            ))}
          </div>
          <div className="flex flex-col gap-2">
            {[100, 92, 78].map((pct, i) => (
              <div
                key={i}
                className="h-3 rounded-full animate-pulse"
                style={{
                  width: `${pct}%`,
                  backgroundColor: 'var(--color-border-subtle)',
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Challenge result */}
      {!isLoading && challenge && (
        <ChallengeCard
          challenge={challenge}
          onRegenerate={handleRegenerate}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}
