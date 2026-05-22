import { useState, useCallback } from 'react'
import { STORAGE_KEYS } from '@/types/index'
import { storageGet, storageSet, storageRemove } from '@/utils/storage'

const ANTHROPIC_KEY_PREFIX = 'sk-ant-'

/** Validate key format without making a network request. */
export function isValidApiKeyFormat(key: string): boolean {
  return key.startsWith(ANTHROPIC_KEY_PREFIX) && key.length > 20
}

interface UseApiKeyReturn {
  apiKey: string | null
  hasValidKey: boolean
  /** Store a new key. Returns false if format validation fails. */
  saveKey: (key: string) => boolean
  clearKey: () => void
}

export function useApiKey(): UseApiKeyReturn {
  const [apiKey, setApiKey] = useState<string | null>(() =>
    storageGet<string>(STORAGE_KEYS.API_KEY)
  )

  const saveKey = useCallback((key: string): boolean => {
    const trimmed = key.trim()
    if (!isValidApiKeyFormat(trimmed)) return false
    storageSet(STORAGE_KEYS.API_KEY, trimmed)
    setApiKey(trimmed)
    return true
  }, [])

  const clearKey = useCallback(() => {
    storageRemove(STORAGE_KEYS.API_KEY)
    setApiKey(null)
  }, [])

  return {
    apiKey,
    hasValidKey: apiKey !== null && isValidApiKeyFormat(apiKey),
    saveKey,
    clearKey,
  }
}
