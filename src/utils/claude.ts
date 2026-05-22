import Anthropic from '@anthropic-ai/sdk'
import type { ChallengeCategory, ChallengeDifficulty, Challenge } from '@/types'

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
