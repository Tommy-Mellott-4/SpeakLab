import { useState, useRef, useCallback, useEffect } from 'react'
import { supportsWebSpeech } from '@/utils/browser'
import { storageGet, storageSet, storageRemove } from '@/utils/storage'
import { STORAGE_KEYS } from '@/types'
import type { SessionDraft, SessionScore } from '@/types'

const FILLERS = ['you know', 'um', 'uh', 'like', 'basically', 'literally', 'right', 'so']

function countFillers(text: string): Record<string, number> {
  const lower = text.toLowerCase()
  const counts: Record<string, number> = {}
  for (const filler of FILLERS) {
    // Word-boundary match; handle multi-word fillers with spaces
    const pattern = new RegExp(`(?<![a-z])${filler.replace(' ', '\\s+')}(?![a-z])`, 'gi')
    const matches = lower.match(pattern)
    if (matches && matches.length > 0) {
      counts[filler] = (counts[filler] ?? 0) + matches.length
    }
  }
  return counts
}

function mergeFillerCounts(
  base: Record<string, number>,
  delta: Record<string, number>,
): Record<string, number> {
  const result = { ...base }
  for (const [word, count] of Object.entries(delta)) {
    result[word] = (result[word] ?? 0) + count
  }
  return result
}

type SessionPhase = 'idle' | 'recording' | 'done'

interface UseSpeechSessionReturn {
  unsupported: boolean
  phase: SessionPhase
  transcript: string
  fillerCounts: Record<string, number>
  wordCount: number
  durationSeconds: number
  wpm: number
  start: (challengeId: string) => void
  stop: () => void
  reset: () => void
  saveAndExit: (score?: SessionScore) => void
}

export function useSpeechSession(): UseSpeechSessionReturn {
  const unsupported = !supportsWebSpeech()

  // Restore any in-progress draft on mount
  const savedDraft = storageGet<SessionDraft>(STORAGE_KEYS.CURRENT_SESSION_DRAFT)

  const [phase, setPhase] = useState<SessionPhase>(savedDraft ? 'done' : 'idle')
  const [transcript, setTranscript] = useState(savedDraft?.transcript ?? '')
  const [fillerCounts, setFillerCounts] = useState<Record<string, number>>(
    savedDraft?.fillerCounts ?? {},
  )
  const [wordCount, setWordCount] = useState(savedDraft?.wordCount ?? 0)
  const [durationSeconds, setDurationSeconds] = useState(savedDraft?.durationSeconds ?? 0)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const challengeIdRef = useRef<string>(savedDraft?.challengeId ?? '')
  const startedAtRef = useRef<string>(savedDraft?.startedAt ?? '')
  // Accumulate final transcript segments separately to avoid double-counting
  const finalTranscriptRef = useRef<string>(savedDraft?.transcript ?? '')
  const fillerCountsRef = useRef<Record<string, number>>(savedDraft?.fillerCounts ?? {})

  const wpm = durationSeconds > 0 ? Math.round((wordCount / durationSeconds) * 60) : 0

  function persistDraft(
    partial: Partial<Omit<SessionDraft, 'challengeId' | 'startedAt'>>,
    base?: {
      transcript: string
      fillerCounts: Record<string, number>
      wordCount: number
      durationSeconds: number
    },
  ) {
    const draft: SessionDraft = {
      challengeId: challengeIdRef.current,
      startedAt: startedAtRef.current,
      transcript: base?.transcript ?? finalTranscriptRef.current,
      fillerCounts: base?.fillerCounts ?? fillerCountsRef.current,
      wordCount: base?.wordCount ?? 0,
      durationSeconds: base?.durationSeconds ?? 0,
      ...partial,
    }
    storageSet(STORAGE_KEYS.CURRENT_SESSION_DRAFT, draft)
  }

  const stop = useCallback(() => {
    recognitionRef.current?.stop()
    recognitionRef.current = null
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setPhase('done')
  }, [])

  const start = useCallback(
    (challengeId: string) => {
      if (unsupported) return

      // Reset state
      finalTranscriptRef.current = ''
      fillerCountsRef.current = {}
      challengeIdRef.current = challengeId
      startedAtRef.current = new Date().toISOString()

      setTranscript('')
      setFillerCounts({})
      setWordCount(0)
      setDurationSeconds(0)
      setPhase('recording')

      // Build recognition instance
      const Ctor =
        (window as unknown as { SpeechRecognition?: typeof SpeechRecognition })
          .SpeechRecognition ??
        (
          window as unknown as {
            webkitSpeechRecognition?: typeof SpeechRecognition
          }
        ).webkitSpeechRecognition!
      const rec = new Ctor()
      rec.continuous = true
      rec.interimResults = true
      rec.lang = 'en-US'
      recognitionRef.current = rec

      let elapsed = 0

      timerRef.current = setInterval(() => {
        elapsed += 1
        setDurationSeconds(elapsed)
      }, 1000)

      rec.onresult = (event: SpeechRecognitionEvent) => {
        let interimText = ''
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          if (result.isFinal) {
            const text = result[0].transcript
            finalTranscriptRef.current += (finalTranscriptRef.current ? ' ' : '') + text.trim()
            const delta = countFillers(text)
            fillerCountsRef.current = mergeFillerCounts(fillerCountsRef.current, delta)
          } else {
            interimText += result[0].transcript
          }
        }

        const displayTranscript =
          finalTranscriptRef.current +
          (interimText ? (finalTranscriptRef.current ? ' ' : '') + interimText : '')
        const words = finalTranscriptRef.current
          .trim()
          .split(/\s+/)
          .filter((w) => w.length > 0).length

        setTranscript(displayTranscript)
        setFillerCounts({ ...fillerCountsRef.current })
        setWordCount(words)

        persistDraft({ wordCount: words, durationSeconds: elapsed }, {
          transcript: finalTranscriptRef.current,
          fillerCounts: fillerCountsRef.current,
          wordCount: words,
          durationSeconds: elapsed,
        })
      }

      rec.onerror = () => stop()
      rec.onend = () => {
        // Restart automatically if we're still in recording phase (e.g., silence timeout)
        if (recognitionRef.current === rec) {
          try {
            rec.start()
          } catch {
            stop()
          }
        }
      }

      rec.start()
    },
    [unsupported, stop],
  )

  const reset = useCallback(() => {
    recognitionRef.current?.stop()
    recognitionRef.current = null
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    finalTranscriptRef.current = ''
    fillerCountsRef.current = {}
    storageRemove(STORAGE_KEYS.CURRENT_SESSION_DRAFT)
    setPhase('idle')
    setTranscript('')
    setFillerCounts({})
    setWordCount(0)
    setDurationSeconds(0)
  }, [])

  const saveAndExit = useCallback((score?: SessionScore) => {
    const sessions = storageGet<import('@/types').SessionRecord[]>(STORAGE_KEYS.SESSIONS) ?? []
    const record: import('@/types').SessionRecord = {
      id: crypto.randomUUID(),
      createdAt: startedAtRef.current || new Date().toISOString(),
      challengeId: challengeIdRef.current,
      transcript: finalTranscriptRef.current,
      ...(score ? { score } : {}),
    }
    storageSet(STORAGE_KEYS.SESSIONS, [...sessions, record])
    storageRemove(STORAGE_KEYS.CURRENT_SESSION_DRAFT)
    reset()
  }, [reset])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.stop()
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  return {
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
  }
}
