import { useState, useCallback } from 'react'
import { generateChallenge } from '@/utils/claude'
import { storageGet, storageSet, storageRemove } from '@/utils/storage'
import { STORAGE_KEYS } from '@/types'
import type { ChallengeCategory, ChallengeDifficulty, StoredChallenge } from '@/types'

type GenerationState = 'idle' | 'loading' | 'success' | 'error'

interface UseChallengeReturn {
  challenge: StoredChallenge | null
  state: GenerationState
  errorMessage: string | null
  generate: (apiKey: string, category: ChallengeCategory, difficulty: ChallengeDifficulty) => void
  clear: () => void
}

export function useChallenge(): UseChallengeReturn {
  const [challenge, setChallenge] = useState<StoredChallenge | null>(() =>
    storageGet<StoredChallenge>(STORAGE_KEYS.CURRENT_CHALLENGE),
  )
  const [state, setState] = useState<GenerationState>(() => (challenge ? 'success' : 'idle'))
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const generate = useCallback(
    async (apiKey: string, category: ChallengeCategory, difficulty: ChallengeDifficulty) => {
      setState('loading')
      setErrorMessage(null)
      try {
        const result = await generateChallenge(apiKey, category, difficulty)
        const stored: StoredChallenge = { ...result, generatedAt: new Date().toISOString() }
        storageSet(STORAGE_KEYS.CURRENT_CHALLENGE, stored)
        setChallenge(stored)
        setState('success')
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setErrorMessage(
          message.includes('401') || message.includes('auth')
            ? 'Invalid API key. Check your key in settings.'
            : message.includes('429') || message.includes('rate')
              ? 'Rate limit reached. Wait a moment and try again.'
              : 'Failed to generate challenge. Try again.',
        )
        setState('error')
      }
    },
    [],
  )

  const clear = useCallback(() => {
    storageRemove(STORAGE_KEYS.CURRENT_CHALLENGE)
    setChallenge(null)
    setState('idle')
    setErrorMessage(null)
  }, [])

  return { challenge, state, errorMessage, generate, clear }
}
