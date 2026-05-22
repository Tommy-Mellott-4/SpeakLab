# SpeakLab — Product & Architecture Plan

> AI-powered web speech coaching application. Personal development tool architected for future multi-user scale.

---

## Product Vision

A Yoodli-equivalent that delivers real-time speech analysis, AI-generated speaking challenges, and structured post-session scoring — built as a proprietary system that can eventually be distributed.

---

## V1 Non-Negotiables

### 1. Real-Time Speech Analysis
- Capture microphone input via browser (WebRTC / Web Speech API)
- Detect and display filler words in real time: `um`, `uh`, `like`, `you know`, `basically`, `literally`, `right`, `so`
- Measure and display speaking pace (words per minute)
- Visual feedback during active speech — live dashboard, not post-only

### 2. AI-Generated Scenario Prompts and Challenges
- Claude API (`claude-sonnet-4-20250514`) generates dynamic speaking scenarios across three categories:
  - **Formal Presentation** — structured, audience-facing
  - **Interpersonal Influence** — 1-on-1, persuasive conversation
  - **Meeting Leadership** — facilitating groups, driving decisions
- Each challenge includes: context setup, time constraint, success criteria
- Difficulty scales across three tiers: **Foundation**, **Competency**, **Mastery**
- User can request a random challenge or select by category and difficulty

### 3. Post-Session Scoring with Structured Feedback Rubric
After each session, Claude API evaluates the transcript against five dimensions:

| Dimension | Description |
|---|---|
| **Structure** | Clear opening, body, and close |
| **Clarity** | Core message identifiable and unambiguous |
| **Economy** | Concise language vs. padded language |
| **Confidence Signals** | Hedging, false starts, qualifiers |
| **Engagement** | Delivery variation, compelling framing |

- Each dimension scored **1–10** with one-sentence rationale
- Two priority gaps identified with a specific prescribed drill
- Session summary stored locally for progress reference

---

## Architecture

| Layer | Technology |
|---|---|
| Frontend | React (functional components, hooks) |
| Styling | Tailwind CSS |
| Speech-to-Text | Web Speech API (browser-native) |
| AI Layer | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| Storage | `localStorage` for V1 (architected for future DB migration) |
| Backend | None for V1 — all API calls client-side |

**Key constraints:**
- No hardcoded API keys — user supplies API key on first launch
- Full component modularity: Recorder, Analyzer, Scorer, Challenge Engine each isolated
- No backend required for V1

---

## Build Sequence

### Phase 1 — Shell and Navigation
App frame, routing, API key onboarding flow

### Phase 2 — Challenge Engine
Scenario generation via Claude API, category and difficulty selection UI

### Phase 3 — Speech Recorder and Real-Time Analyzer
Microphone capture, filler word detection, WPM display, live dashboard

### Phase 4 — Post-Session Scorer
Transcript submission to Claude API, rubric scoring, gap identification

### Phase 5 — Session History Dashboard
Stored sessions, scores over time, trend visibility

> **Process rule:** After each phase, pause and present — what was built, architectural decisions, what Phase N+1 requires, and any flags or tradeoffs requiring approval before proceeding. Do not advance phases without explicit confirmation.

---

## Standards and Constraints

- Clean, commented code — extended by the same developer over time
- Every component must have clear prop definitions
- No hardcoded API keys anywhere in the codebase
- Flag any browser compatibility limitations for Web Speech API immediately
- If a better technical approach exists than what is specified, recommend it before implementing — do not silently deviate from the spec
