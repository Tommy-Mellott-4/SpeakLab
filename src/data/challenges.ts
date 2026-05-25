import type { ChallengeCategory, ChallengeDifficulty, Challenge } from '@/types'

type ChallengeTemplate = Omit<Challenge, 'id'>

const BANK: ChallengeTemplate[] = [
  // ── Formal Presentation · Foundation ────────────────────────────────────────
  {
    category: 'formal-presentation',
    difficulty: 'foundation',
    context:
      'You are a new product manager at a 40-person startup. Introduce yourself and your background to the full company at the weekly all-hands. You have 90 seconds.',
    timeConstraintSeconds: 90,
    successCriteria: [
      'State your name, role, and one concrete thing you will own in the first 30 days',
      'Include one specific detail about your background that is relevant to this team',
      'Close with an invitation — a question or open-door offer',
    ],
  },
  {
    category: 'formal-presentation',
    difficulty: 'foundation',
    context:
      'You are presenting a project status update to your team of eight. The project is on schedule. Your goal is a crisp 2-minute briefing that leaves no ambiguity about where things stand.',
    timeConstraintSeconds: 120,
    successCriteria: [
      'Open with a single headline sentence on status (on track / at risk / delayed)',
      'Cover what was completed, what is next, and any blockers',
      'Close with the one thing you need from the audience, if anything',
    ],
  },
  // ── Formal Presentation · Competency ────────────────────────────────────────
  {
    category: 'formal-presentation',
    difficulty: 'competency',
    context:
      'You are pitching a €120k budget increase for your engineering team to a finance director who has already rejected one request this quarter. You have 2 minutes to make the case.',
    timeConstraintSeconds: 120,
    successCriteria: [
      'Lead with business impact, not team needs',
      'Anticipate the objection — acknowledge the previous rejection explicitly',
      'Close with a specific ask and a concrete ROI or risk-reduction number',
    ],
  },
  {
    category: 'formal-presentation',
    difficulty: 'competency',
    context:
      'You are presenting Q3 revenue results to your company\'s board. Revenue missed target by 8%. You need to explain what happened, own the miss, and present a credible path to Q4 recovery.',
    timeConstraintSeconds: 150,
    successCriteria: [
      'State the miss and root cause in the first 20 seconds — no burying the lead',
      'Separate factors within your control from external factors',
      'Present 2–3 specific Q4 actions with measurable milestones',
    ],
  },
  // ── Formal Presentation · Mastery ───────────────────────────────────────────
  {
    category: 'formal-presentation',
    difficulty: 'mastery',
    context:
      'You are the CTO of a Series B startup. You have 3 minutes to pitch your technical vision to a room of 50 potential enterprise customers at an industry conference. Most attendees are not technical.',
    timeConstraintSeconds: 180,
    successCriteria: [
      'Use one clear analogy to explain your core technical approach to a non-technical audience',
      'Articulate the specific pain point your architecture solves — not the features, the pain',
      'End with a call to action that moves prospects to the next stage of your sales funnel',
    ],
  },
  {
    category: 'formal-presentation',
    difficulty: 'mastery',
    context:
      'You are the VP of Product presenting a controversial roadmap pivot to 30 senior stakeholders. You are killing a beloved feature and redirecting 6 months of engineering effort. Dissent is expected.',
    timeConstraintSeconds: 210,
    successCriteria: [
      'Acknowledge the emotional weight of the decision before making the case for it',
      'Present the data or signals that drove the decision — not just the decision itself',
      'Close with the process for raising objections, so debate happens on your terms',
    ],
  },

  // ── Interpersonal Influence · Foundation ────────────────────────────────────
  {
    category: 'interpersonal-influence',
    difficulty: 'foundation',
    context:
      'Your manager has assigned you a project that duplicates work another team is already doing. You want to flag this overlap in your next 1:1 without sounding like you are avoiding work.',
    timeConstraintSeconds: 90,
    successCriteria: [
      'Frame the issue as a risk to the company, not an inconvenience to you',
      'Come with a proposed resolution, not just the problem',
      'Ask for a decision or next step before the conversation ends',
    ],
  },
  {
    category: 'interpersonal-influence',
    difficulty: 'foundation',
    context:
      'A peer on your team consistently misses the 5pm daily standup update in Slack, which blocks your work. You need to address it directly without damaging the relationship.',
    timeConstraintSeconds: 90,
    successCriteria: [
      'Be specific about the impact — not "it\'s frustrating" but "it delayed X by Y"',
      'Give them a chance to explain before proposing a fix',
      'Agree on a concrete change before the conversation ends',
    ],
  },
  // ── Interpersonal Influence · Competency ────────────────────────────────────
  {
    category: 'interpersonal-influence',
    difficulty: 'competency',
    context:
      'You want a promotion but your manager has told you twice that you are "not quite ready." You have prepared a specific case based on your last 6 months of work. This is your third attempt.',
    timeConstraintSeconds: 150,
    successCriteria: [
      'Reference the feedback from the previous two conversations — show you heard it',
      'Present 3 specific achievements with measurable outcomes from the past 6 months',
      'Ask directly what the remaining gap is, and what a concrete 90-day plan to close it looks like',
    ],
  },
  {
    category: 'interpersonal-influence',
    difficulty: 'competency',
    context:
      'A key stakeholder in another department has been passively blocking your team\'s work — slow approvals, missed meetings, non-committal responses. You are meeting with them to reset the relationship.',
    timeConstraintSeconds: 120,
    successCriteria: [
      'Open by naming the dynamic directly, without accusation',
      'Explore what is driving their behavior before proposing a fix',
      'Leave with a specific commitment — a date, an action, or a shared agreement',
    ],
  },
  // ── Interpersonal Influence · Mastery ───────────────────────────────────────
  {
    category: 'interpersonal-influence',
    difficulty: 'mastery',
    context:
      'You need to tell a high-performing direct report that their behavior in meetings — interrupting, dismissing junior voices — is damaging team morale. Two other team members have already raised it to you privately.',
    timeConstraintSeconds: 180,
    successCriteria: [
      'Separate the behavior from the person — critique the pattern, not the character',
      'Use at least one specific observed example, not a general accusation',
      'Give them space to respond and reflect before moving to expectations',
    ],
  },
  {
    category: 'interpersonal-influence',
    difficulty: 'mastery',
    context:
      'You are negotiating your compensation for a new role. The offer is 15% below your target. The recruiter says the band is fixed. You do not believe them, and you have a competing offer.',
    timeConstraintSeconds: 150,
    successCriteria: [
      'Name your number first and anchor it — do not let them anchor you',
      'Use the competing offer as leverage without making it a threat',
      'Expand the negotiation beyond base salary if they hold firm on the number',
    ],
  },

  // ── Meeting Leadership · Foundation ─────────────────────────────────────────
  {
    category: 'meeting-leadership',
    difficulty: 'foundation',
    context:
      'You are running a 30-minute team retrospective after a sprint that went poorly. Two team members are visibly frustrated with each other. Your goal is a productive debrief, not a blame session.',
    timeConstraintSeconds: 90,
    successCriteria: [
      'Open by setting the norm: observations and actions, not blame',
      'Redirect any personal attacks to process language in the moment',
      'Close with 1–2 specific action items owned by named people',
    ],
  },
  {
    category: 'meeting-leadership',
    difficulty: 'foundation',
    context:
      'You are chairing a weekly project sync that has grown to 12 people and now consistently runs 20 minutes over. You are opening today\'s meeting with a plan to fix this.',
    timeConstraintSeconds: 90,
    successCriteria: [
      'Name the problem explicitly at the top — do not dance around it',
      'Propose a specific structural change (agenda, roles, time-boxing)',
      'Get verbal buy-in from the group before proceeding',
    ],
  },
  // ── Meeting Leadership · Competency ─────────────────────────────────────────
  {
    category: 'meeting-leadership',
    difficulty: 'competency',
    context:
      'You are facilitating a cross-functional meeting to decide whether to delay a product launch by 3 weeks. Engineering says yes, Sales says no. The CEO is in the room and has not spoken.',
    timeConstraintSeconds: 150,
    successCriteria: [
      'Summarize both positions neutrally before opening the floor',
      'Surface the decision criteria explicitly — what does a "right" decision depend on?',
      'Drive toward a decision or a clear next step before the meeting ends',
    ],
  },
  {
    category: 'meeting-leadership',
    difficulty: 'competency',
    context:
      'Halfway through a strategy session, the conversation has gone completely off-agenda. The team is energized but you are 45 minutes behind. You need to redirect without killing the energy.',
    timeConstraintSeconds: 90,
    successCriteria: [
      'Acknowledge the value of the tangent before redirecting',
      'Create a visible "parking lot" for the off-agenda ideas so they are not lost',
      'Re-anchor the group to the original objective and get commitment to proceed',
    ],
  },
  // ── Meeting Leadership · Mastery ────────────────────────────────────────────
  {
    category: 'meeting-leadership',
    difficulty: 'mastery',
    context:
      'You are facilitating a leadership team meeting where two senior leaders disagree on a strategic direction. The tension has been building for weeks. Others in the room are staying quiet to avoid taking sides.',
    timeConstraintSeconds: 210,
    successCriteria: [
      'Name the tension in the room explicitly — avoiding it makes it worse',
      'Give each leader structured airtime — equal, uninterrupted, and time-boxed',
      'Move the group from positions to interests: what does each side actually need?',
    ],
  },
  {
    category: 'meeting-leadership',
    difficulty: 'mastery',
    context:
      'You are running a 90-minute workshop to align 15 stakeholders on a company OKR for next quarter. Four different teams have submitted conflicting priorities. You need one objective by the end.',
    timeConstraintSeconds: 240,
    successCriteria: [
      'Open by making the stakes clear — why alignment matters more than any single team\'s priority',
      'Use a structured decision method (dot vote, criteria matrix, or equivalent) to avoid chaos',
      'Close with a single agreed objective and each stakeholder\'s named commitment to it',
    ],
  },
]

export function pickChallenge(
  category?: ChallengeCategory | null,
  difficulty?: ChallengeDifficulty | null,
): Challenge {
  const pool = BANK.filter(
    (c) =>
      (!category || c.category === category) &&
      (!difficulty || c.difficulty === difficulty),
  )
  const source = pool.length > 0 ? pool : BANK
  const template = source[Math.floor(Math.random() * source.length)]
  return { ...template, id: crypto.randomUUID() }
}
