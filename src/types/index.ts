// ─── Storage Keys ─────────────────────────────────────────────────────────────

/** All localStorage keys used by SpeakLab. Centralized to prevent key collisions. */
export const STORAGE_KEYS = {
  API_KEY: 'speaklab.apiKey',
  SESSIONS: 'speaklab.sessions',
  PREFERENCES: 'speaklab.preferences',
  CURRENT_CHALLENGE: 'speaklab.currentChallenge',
  CURRENT_SESSION_DRAFT: 'speaklab.currentSessionDraft',
} as const

export type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS]

// ─── API Key ──────────────────────────────────────────────────────────────────

export interface ApiKeyState {
  key: string | null
  isValid: boolean
}

// ─── Navigation ───────────────────────────────────────────────────────────────

export interface NavItem {
  label: string
  path: string
}

// ─── Challenges (Phase 2 stubs) ───────────────────────────────────────────────

export type ChallengeCategory =
  | 'formal-presentation'
  | 'interpersonal-influence'
  | 'meeting-leadership'

export type ChallengeDifficulty = 'foundation' | 'competency' | 'mastery'

export interface Challenge {
  id: string
  category: ChallengeCategory
  difficulty: ChallengeDifficulty
  context: string
  timeConstraintSeconds: number
  successCriteria: string[]
}

/** Challenge with generation metadata — persisted to localStorage for Phase 3 */
export interface StoredChallenge extends Challenge {
  generatedAt: string
}

// ─── Sessions (Phase 3+) ─────────────────────────────────────────────────────

/** In-progress session state persisted between page reloads */
export interface SessionDraft {
  challengeId: string
  startedAt: string
  transcript: string
  fillerCounts: Record<string, number>
  wordCount: number
  durationSeconds: number
}

/** Completed session record saved to history */
export interface SessionRecord {
  id: string
  createdAt: string
  challengeId: string
  transcript: string
  score?: SessionScore
}

/** Stub: fully defined in Phase 4 */
export interface SessionScore {
  structure: number
  clarity: number
  economy: number
  confidenceSignals: number
  engagement: number
  rationale: Record<string, string>
  priorityGaps: string[]
}
