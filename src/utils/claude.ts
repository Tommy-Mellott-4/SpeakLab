import Anthropic from '@anthropic-ai/sdk'
import type { ChallengeCategory, ChallengeDifficulty, Challenge, SessionScore, StoredChallenge } from '@/types'

const CATEGORY_LABELS: Record<ChallengeCategory, string> = {
  'formal-presentation': 'Formal Presentation',
  'interpersonal-influence': 'Interpersonal Influence',
  'meeting-leadership': 'Meeting Leadership',
}

const DIFFICULTY_RANGES: Record<ChallengeDifficulty, { min: number; max: number; label: string }> =
  {
    foundation: { min: 60, max: 90, label: 'Foundation (60–90 s)' },
    competency: { min: 90, max: 150, label: 'Competency (90–150 s)' },
    mastery: { min: 150, max: 240, label: 'Mastery (150–240 s)' },
  }

const SYSTEM_PROMPT = `You are SpeakLab's challenge generator. Your job is to create realistic, specific speaking scenarios that push professionals to practice high-stakes communication.

Rules:
- Make the scenario concrete: a named company, a real-feeling situation, a clear audience.
- Avoid generic scenarios ("present to stakeholders"). Prefer specific ("pitch a budget increase for your QA team to a skeptical CFO who just froze hiring").
- successCriteria must be observable behaviors the speaker can self-check, not vague goals.
- timeConstraintSeconds must fall within the difficulty range provided.
- Respond ONLY with valid JSON — no markdown, no commentary.

JSON schema:
{
  "context": "string — the full scenario description (2–4 sentences)",
  "timeConstraintSeconds": number,
  "successCriteria": ["string", "string", "string"]  // exactly 3 items
}`

const SCORING_SYSTEM_PROMPT = `You are SpeakLab's speech coach. Analyze the provided transcript and session data against the challenge context, then score the speaker across five dimensions.

Scoring dimensions (each 1–10):
- structure: logical flow, clear opening/body/close, signposting
- clarity: word choice precision, sentence simplicity, absence of vague language
- economy: ratio of meaningful content to total words; penalize padding and repetition
- confidenceSignals: assertive language, minimal hedging ("I think", "maybe"), steady pacing implied by transcript
- engagement: concrete examples, vivid language, audience awareness

Rules:
- Be honest and calibrated. A 7 should feel earned.
- rationale: one crisp sentence per dimension explaining the score.
- priorityGaps: exactly 2–3 specific, actionable things the speaker should work on next.
- Respond ONLY with valid JSON — no markdown, no commentary.

JSON schema:
{
  "structure": number,
  "clarity": number,
  "economy": number,
  "confidenceSignals": number,
  "engagement": number,
  "rationale": {
    "structure": "string",
    "clarity": "string",
    "economy": "string",
    "confidenceSignals": "string",
    "engagement": "string"
  },
  "priorityGaps": ["string", "string"]
}`

function makeClient(apiKey: string): Anthropic {
  return new Anthropic({ apiKey, dangerouslyAllowBrowser: true })
}

export async function generateChallenge(
  apiKey: string,
  category: ChallengeCategory,
  difficulty: ChallengeDifficulty,
): Promise<Challenge> {
  const client = makeClient(apiKey)
  const range = DIFFICULTY_RANGES[difficulty]
  const categoryLabel = CATEGORY_LABELS[category]

  const userPrompt = `Generate a ${categoryLabel} challenge at ${range.label} difficulty.
Time constraint must be between ${range.min} and ${range.max} seconds.
Category context:
- Formal Presentation: structured delivery to an audience (investors, executives, public)
- Interpersonal Influence: one-on-one or small-group persuasion, negotiation, or difficult conversations
- Meeting Leadership: running or redirecting a meeting, driving alignment, facilitating decisions`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 512,
    system: [
      {
        type: 'text',
        text: SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: userPrompt }],
  })

  const textBlock = response.content.find((b) => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text content in Claude response')
  }

  let parsed: { context: string; timeConstraintSeconds: number; successCriteria: string[] }
  try {
    parsed = JSON.parse(textBlock.text)
  } catch {
    throw new Error('Claude returned invalid JSON')
  }

  if (
    typeof parsed.context !== 'string' ||
    typeof parsed.timeConstraintSeconds !== 'number' ||
    !Array.isArray(parsed.successCriteria)
  ) {
    throw new Error('Claude response missing required fields')
  }

  return {
    id: crypto.randomUUID(),
    category,
    difficulty,
    context: parsed.context,
    timeConstraintSeconds: Math.min(Math.max(parsed.timeConstraintSeconds, range.min), range.max),
    successCriteria: parsed.successCriteria.slice(0, 3),
  }
}

interface SessionStats {
  wordCount: number
  durationSeconds: number
  wpm: number
  fillerCounts: Record<string, number>
}

export async function scoreSession(
  apiKey: string,
  challenge: StoredChallenge,
  transcript: string,
  stats: SessionStats,
): Promise<SessionScore> {
  const client = makeClient(apiKey)

  const fillerSummary = Object.entries(stats.fillerCounts)
    .filter(([, c]) => c > 0)
    .sort(([, a], [, b]) => b - a)
    .map(([w, c]) => `${w} (×${c})`)
    .join(', ')

  const userPrompt = `CHALLENGE
Category: ${CATEGORY_LABELS[challenge.category]}
Difficulty: ${challenge.difficulty}
Scenario: ${challenge.context}
Success criteria:
${challenge.successCriteria.map((c, i) => `${i + 1}. ${c}`).join('\n')}

SESSION STATS
Duration: ${Math.floor(stats.durationSeconds / 60)}m ${stats.durationSeconds % 60}s
Word count: ${stats.wordCount}
WPM: ${stats.wpm}
Filler words detected: ${fillerSummary || 'none'}

TRANSCRIPT
${transcript || '(no transcript recorded)'}

Score this session.`

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: [
      {
        type: 'text',
        text: SCORING_SYSTEM_PROMPT,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: userPrompt }],
  })

  const textBlock = response.content.find((b) => b.type === 'text')
  if (!textBlock || textBlock.type !== 'text') {
    throw new Error('No text content in Claude response')
  }

  let parsed: SessionScore
  try {
    parsed = JSON.parse(textBlock.text)
  } catch {
    throw new Error('Claude returned invalid JSON')
  }

  const dims = ['structure', 'clarity', 'economy', 'confidenceSignals', 'engagement'] as const
  for (const dim of dims) {
    if (typeof parsed[dim] !== 'number') throw new Error(`Missing score for ${dim}`)
  }

  return parsed
}
