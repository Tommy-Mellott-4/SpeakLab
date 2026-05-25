import { useState } from 'react'
import { storageGet, storageSet, storageRemove } from '@/utils/storage'
import { STORAGE_KEYS } from '@/types'
import { pickChallenge } from '@/data/challenges'
import CategorySelector from '@/components/CategorySelector'
import DifficultySelector from '@/components/DifficultySelector'
import ChallengeCard from '@/components/ChallengeCard'
import type { ChallengeCategory, ChallengeDifficulty, StoredChallenge } from '@/types'

export default function Challenge() {
  const [challenge, setChallenge] = useState<StoredChallenge | null>(() =>
    storageGet<StoredChallenge>(STORAGE_KEYS.CURRENT_CHALLENGE),
  )
  const [category, setCategory] = useState<ChallengeCategory | null>(
    challenge?.category ?? null,
  )
  const [difficulty, setDifficulty] = useState<ChallengeDifficulty | null>(
    challenge?.difficulty ?? null,
  )

  function handleGenerate() {
    const picked = pickChallenge(category, difficulty)
    const stored: StoredChallenge = { ...picked, generatedAt: new Date().toISOString() }
    storageSet(STORAGE_KEYS.CURRENT_CHALLENGE, stored)
    setChallenge(stored)
  }

  function handleClear() {
    storageRemove(STORAGE_KEYS.CURRENT_CHALLENGE)
    setChallenge(null)
  }

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

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <span
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Category
          </span>
          <CategorySelector selected={category} onChange={setCategory} />
        </div>

        <div className="flex flex-col gap-2">
          <span
            className="text-xs font-medium uppercase tracking-wider"
            style={{ color: 'var(--color-text-muted)' }}
          >
            Difficulty
          </span>
          <DifficultySelector selected={difficulty} onChange={setDifficulty} />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleGenerate}
            className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-150 active:scale-[0.97]"
            style={{
              backgroundColor: 'var(--color-accent)',
              color: 'oklch(10% 0.01 270)',
            }}
          >
            {challenge ? 'New challenge' : 'Get challenge'}
          </button>

          {!category && !difficulty && (
            <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              No selection = random
            </span>
          )}

          {challenge && (
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-medium transition-opacity duration-150 active:scale-[0.97]"
              style={{ color: 'var(--color-text-muted)' }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {challenge && (
        <ChallengeCard
          challenge={challenge}
          onRegenerate={handleGenerate}
          isLoading={false}
        />
      )}
    </div>
  )
}
