import type { ChallengeCategory, ChallengeDifficulty, Challenge } from '@/types'

type ChallengeTemplate = Omit<Challenge, 'id'>

const BANK: ChallengeTemplate[] = [
  // ── Formal Presentation · Foundation ─────────────────────────────────────────
  {
    category: 'formal-presentation',
    difficulty: 'foundation',
    context:
      "Your skip-level manager just asked you to do a 90-second intro at the company all-hands. You've been at the company 3 months and almost no one knows who you are. Make it memorable without overselling yourself.",
    timeConstraintSeconds: 90,
    successCriteria: [
      'State your name, role, and one concrete thing you are currently building or learning',
      'Include one specific detail that says something real about you — not a resume line',
      'Close with genuine curiosity about the company, not a platitude like "excited to be here"',
    ],
  },
  {
    category: 'formal-presentation',
    difficulty: 'foundation',
    context:
      "A close friend just bought their first bond ETF and calls you asking what \"duration\" actually means and why it matters. They're not financial — explain it clearly over the phone in under 2 minutes.",
    timeConstraintSeconds: 90,
    successCriteria: [
      'Use a concrete analogy — not a textbook definition involving "weighted average cash flows"',
      'Connect it to something they care about: what actually happens to their ETF when interest rates move',
      'Check for understanding at least once before moving on',
    ],
  },

  // ── Formal Presentation · Competency ─────────────────────────────────────────
  {
    category: 'formal-presentation',
    difficulty: 'competency',
    context:
      'You\'re at a dinner party and someone confidently says "AI just looks things up and summarizes them — it\'s basically a fancy search engine." You know this is wrong and want to correct it without being condescending. You have 2 minutes.',
    timeConstraintSeconds: 120,
    successCriteria: [
      'Start from what the person already understands — meet them where they are',
      'Use one clear analogy to explain how LLMs actually generate text (prediction, not retrieval)',
      'Name the hallucination risk honestly and land on one practical takeaway they can use',
    ],
  },
  {
    category: 'formal-presentation',
    difficulty: 'competency',
    context:
      "You're presenting your first real investment thesis at a 10-person investing club. You've done the research. Your audience is mixed — some know markets, some are beginners. You have 2 minutes.",
    timeConstraintSeconds: 120,
    successCriteria: [
      'Open with one clear headline on why this company or asset is interesting right now',
      'Frame it as price vs. value — not just "I think it will go up"',
      'Name one key risk you have actually thought through, not just acknowledged to sound balanced',
    ],
  },

  // ── Formal Presentation · Mastery ────────────────────────────────────────────
  {
    category: 'formal-presentation',
    difficulty: 'mastery',
    context:
      'Explain the Fama-French three-factor model to someone who understands CAPM but has never encountered it. They want to know why it matters for how they should actually build a portfolio. 3 minutes.',
    timeConstraintSeconds: 180,
    successCriteria: [
      'Build from CAPM as a foundation — name what it gets right before naming what it misses',
      'Define and intuitively explain all three factors (market, size, value) without losing the thread',
      'Land on a concrete portfolio implication: what does someone actually do differently because of this model',
    ],
  },
  {
    category: 'formal-presentation',
    difficulty: 'mastery',
    context:
      "You've been asked to give a 3-minute talk at a local finance meetup on one investing concept most retail investors consistently get wrong. Pick a concept you actually have a strong view on and make the case.",
    timeConstraintSeconds: 180,
    successCriteria: [
      'Open with a specific, counterintuitive claim — not a vague statement like "people misunderstand risk"',
      'Back it with reasoning or evidence, not just your opinion — cite something concrete',
      'Address the strongest objection to your view before closing',
    ],
  },

  // ── Interpersonal Influence · Foundation ─────────────────────────────────────
  {
    category: 'interpersonal-influence',
    difficulty: 'foundation',
    context:
      "You've been at your job for 4 months. You're drowning — too many tasks, unclear priorities, and you don't know what to deprioritize. You have a 1:1 with your manager tomorrow. Walk through what you'd actually say.",
    timeConstraintSeconds: 90,
    successCriteria: [
      'Frame it as a prioritization question, not a complaint or a sign you can\'t handle the load',
      'Be specific about what is blocked or at risk — not a general "I\'m overwhelmed"',
      'Ask for one concrete decision from your manager before the conversation ends',
    ],
  },
  {
    category: 'interpersonal-influence',
    difficulty: 'foundation',
    context:
      'A friend who knows you\'re into investing keeps saying "the market is rigged" and refuses to do anything with their savings. You want to gently move them toward just opening a basic index fund account. Casual conversation.',
    timeConstraintSeconds: 90,
    successCriteria: [
      'Don\'t lecture — acknowledge their skepticism with something real, not a dismissal',
      'Use one piece of evidence or reasoning they can verify themselves',
      'End with the smallest possible next step — not "just start investing," something specific and tiny',
    ],
  },

  // ── Interpersonal Influence · Competency ─────────────────────────────────────
  {
    category: 'interpersonal-influence',
    difficulty: 'competency',
    context:
      "There's a senior person at work you genuinely respect and want to learn from. You've talked twice informally. You want to make it a real mentorship relationship — ask directly without it feeling awkward or transactional.",
    timeConstraintSeconds: 120,
    successCriteria: [
      'Be specific about what you want from them — not "mentorship" in the abstract, but something concrete',
      'Make the first ask low-commitment — easy to say yes to, no obligation implied',
      'Give them a genuine out without being self-deprecating about why they might not want to',
    ],
  },
  {
    category: 'interpersonal-influence',
    difficulty: 'competency',
    context:
      "A teammate has been taking credit for collaborative work in front of your shared manager — subtly, not brazenly, but you've noticed it twice now. You need to address it directly with them, not go around them.",
    timeConstraintSeconds: 120,
    successCriteria: [
      'Name the behavior with a specific example — not a general accusation',
      'Describe the impact on you without making it a character attack',
      'Propose what you want to change and stay calm if they push back or get defensive',
    ],
  },

  // ── Interpersonal Influence · Mastery ────────────────────────────────────────
  {
    category: 'interpersonal-influence',
    difficulty: 'mastery',
    context:
      "Your manager gave you critical feedback that you believe is unfair — they missed important context and you think their read reflects a bias, not your actual performance. You want to push back without looking defensive or burning the relationship.",
    timeConstraintSeconds: 150,
    successCriteria: [
      'Acknowledge what is valid in the feedback before disagreeing with anything',
      'Present the missing context as new information, not as a rebuttal',
      'Ask a clarifying question before concluding they are wrong — give them a chance to update',
    ],
  },
  {
    category: 'interpersonal-influence',
    difficulty: 'mastery',
    context:
      'Explain your genuine view on free will — whether it exists in any meaningful sense and why — to someone who holds the opposite view and wants to actually debate it. Keep it a real conversation, not a lecture. 2 minutes.',
    timeConstraintSeconds: 120,
    successCriteria: [
      'State your position clearly in the first 20 seconds — do not hedge into ambiguity',
      'Acknowledge the strongest version of the opposing view, not a strawman',
      'Use one concrete example or thought experiment to make the abstract tangible',
    ],
  },

  // ── Meeting Leadership · Foundation ──────────────────────────────────────────
  {
    category: 'meeting-leadership',
    difficulty: 'foundation',
    context:
      "You're the most junior person in a cross-functional sync. The group is drifting toward a decision you think is wrong — and no one is saying it. You decide to speak up. Walk through how you'd do it.",
    timeConstraintSeconds: 90,
    successCriteria: [
      'Frame your concern as a question, not a declaration — junior people earn the right to declare later',
      'Be specific about what you\'re worried about, not vaguely "are we sure about this?"',
      'Give the senior people in the room an easy way to engage with your point without losing face',
    ],
  },
  {
    category: 'meeting-leadership',
    difficulty: 'foundation',
    context:
      "Run a 10-minute retrospective with your project pod after a deliverable that missed its deadline. Two team members are visibly annoyed with each other and the tension is obvious.",
    timeConstraintSeconds: 90,
    successCriteria: [
      'Open with one norm-setting sentence that redirects blame toward process, not people',
      'Give each person structured time to speak before opening free discussion',
      'Close with one owner, one action, one date — not a list of things to "think about"',
    ],
  },

  // ── Meeting Leadership · Competency ──────────────────────────────────────────
  {
    category: 'meeting-leadership',
    difficulty: 'competency',
    context:
      "Your team asks you to run a lunch-and-learn on football strategy — specifically zone vs. man coverage and why that decision matters in a game. Your audience has never played or studied it seriously. 20 minutes compressed into your opening 2-minute pitch to hook them.",
    timeConstraintSeconds: 120,
    successCriteria: [
      'Start with the problem the defense is trying to solve — not the solution itself',
      'Use one analogy that makes the trade-off immediately clear to someone who has never watched film',
      'Give a real example — a team, a game situation, a moment — that makes it click',
    ],
  },
  {
    category: 'meeting-leadership',
    difficulty: 'competency',
    context:
      "Two peers on your team have been going in circles on a technical approach for 20 minutes. The conversation has stalled. You've been asked to step in and help them reach a decision — you're the facilitator, not the decision-maker.",
    timeConstraintSeconds: 120,
    successCriteria: [
      'Summarize both positions neutrally before asking a single question — prove you heard both',
      'Surface the real disagreement: often it\'s a hidden assumption, not the surface-level debate',
      'Move the group from their positions to shared criteria for what a good decision looks like',
    ],
  },

  // ── Meeting Leadership · Mastery ─────────────────────────────────────────────
  {
    category: 'meeting-leadership',
    difficulty: 'mastery',
    context:
      "Explain the principles behind sensory motor training — how the nervous system actually learns movement, and why variability and challenge matter more than perfect repetition — to a group of athletes who just want to train harder. 3 minutes.",
    timeConstraintSeconds: 180,
    successCriteria: [
      'Open with something that challenges their current mental model — not a fact, a question or provocation',
      'Use one specific drill or scenario to make the theory concrete and real',
      'End with one thing they can change in their next session tomorrow, not just a mindset shift',
    ],
  },
  {
    category: 'meeting-leadership',
    difficulty: 'mastery',
    context:
      "You've been asked to lead a 15-minute session for your team on where AI is genuinely useful vs. where it's overhyped — for an audience that's split between \"it's a toy\" and \"it's going to take my job.\" Both camps are present.",
    timeConstraintSeconds: 180,
    successCriteria: [
      'Open by naming both fears explicitly so everyone feels heard before you say anything substantive',
      'Give one concrete, specific example of genuine usefulness in a context your audience relates to',
      'Give one honest limitation — do not be a cheerleader; your credibility depends on being balanced',
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
