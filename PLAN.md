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

---

## Developer Tools — AI Design Skills

Three skill packages are installed in this project under `.agents/skills/`. These extend the AI coding agent with design engineering intelligence and should be used actively during UI development phases.

### 1. Emil Kowalski's Design Engineering Skill

**Install:** `npx skills add emilkowalski/skill`
**Skill name:** `emil-design-eng`
**Source:** [emilkowal.ski/skill](https://emilkowal.ski/skill) — [github.com/emilkowalski/skill](https://github.com/emilkowalski/skill)
**Security audit:** Clean — no Bash access, no network calls, no hooks

Encodes Emil Kowalski's philosophy on UI polish, animation decisions, and the invisible details that make software feel right. Author of Sonner (13M+ weekly npm downloads) and Vaul.

**When to use:**
- Before writing any animation or transition code
- When reviewing component interaction states (hover, active, press)
- For any motion work: easing curves, spring physics, duration calibration
- When something feels "off" about a UI interaction but you can't name why

**Key rules it enforces:**
- Never animate from `scale(0)` — start at `scale(0.95)` with `opacity: 0`
- UI animations stay under 300ms; use `ease-out`, never `ease-in`
- Buttons require `transform: scale(0.97)` on `:active`
- Popovers must scale from their trigger, not from center
- Never animate `padding`, `margin`, `width`, or `height` — GPU properties only (`transform`, `opacity`)
- Keyboard-triggered actions get no animation, ever

---

### 2. Impeccable — Production-Grade Frontend Design

**Install:** `npx skills add pbakaus/impeccable`
**Skill name:** `impeccable`
**Source:** [impeccable.style](https://impeccable.style) — [github.com/pbakaus/impeccable](https://github.com/pbakaus/impeccable)
**Security audit:** Medium — grants `Bash(npx impeccable *)` permission; runs local `.mjs` scripts at session start; review before accepting prompts
**License:** Apache 2.0

23-command design system covering the full UI lifecycle from shaping features to shipping. Reads `PRODUCT.md` and `DESIGN.md` from the project root for brand-aware output.

**Commands:**

| Command | Use When |
|---|---|
| `/impeccable craft [feature]` | Building a new UI feature end-to-end |
| `/impeccable shape [feature]` | Planning UX/layout before writing code |
| `/impeccable polish [target]` | Final quality pass before shipping a phase |
| `/impeccable audit [target]` | Accessibility, performance, responsive checks |
| `/impeccable critique [target]` | Heuristic UX review with scoring |
| `/impeccable animate [target]` | Adding purposeful motion |
| `/impeccable colorize [target]` | Introducing strategic color |
| `/impeccable typeset [target]` | Improving typography hierarchy |
| `/impeccable layout [target]` | Fixing spacing, rhythm, visual hierarchy |
| `/impeccable harden [target]` | Error states, i18n, edge cases |
| `/impeccable bolder [target]` | Amplifying bland or safe designs |
| `/impeccable distill [target]` | Stripping to essence, removing complexity |

**Absolute bans it enforces:**
- No side-stripe `border-left` accent cards
- No gradient text (`background-clip: text`)
- No decorative glassmorphism
- No hero-metric template (big number + gradient accent)
- No identical card grids
- No em dashes in copy

**Recommended workflow for SpeakLab:** Run `/impeccable shape` before building each phase UI, then `/impeccable polish` before committing the phase.

---

### 3. Taste Skill — Anti-Slop Frontend Framework

**Install:** `npx skills add Leonxlnx/taste-skill`
**Primary skill name:** `design-taste-frontend`
**Source:** [tasteskill.dev](https://tasteskill.dev) — [github.com/Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)
**Security audit:** Clean — no Bash access, no network calls, no hooks

12 specialized skills installed. Corrects statistical LLM biases toward generic UI patterns. Operates on three tunable dials: `DESIGN_VARIANCE` (8), `MOTION_INTENSITY` (6), `VISUAL_DENSITY` (4).

**Installed sub-skills:**

| Skill | Purpose |
|---|---|
| `design-taste-frontend` | Default — high-agency frontend with bias correction |
| `high-end-visual-design` | Premium visual output, anti-generic patterns |
| `minimalist-ui` | Editorial, restrained product UI |
| `industrial-brutalist-ui` | Hard mechanical aesthetic, Swiss typography |
| `redesign-existing-projects` | Visual auditing and redesign |
| `full-output-enforcement` | Prevents placeholder/incomplete code |
| `image-to-code` | Design-reference-driven implementation |
| `stitch-design-taste` | Google Stitch-compatible design rules |
| `brandkit` | Brand identity assets and systems |
| `imagegen-frontend-web` | Website reference image generation |
| `imagegen-frontend-mobile` | Mobile screen concept generation |
| `gpt-taste` | Stricter variant optimized for GPT/Codex |

**Key rules it enforces:**
- Inter font is banned — use `Geist`, `Outfit`, `Cabinet Grotesk`, or `Satoshi`
- No AI Purple/Blue aesthetic — no purple glows, no neon gradients
- No centered hero sections when `DESIGN_VARIANCE > 4`
- No 3-column equal card layouts — use zig-zag or asymmetric grid
- No generic avatar SVGs, no fake round numbers, no startup slop names (`Acme`, `Nexus`)
- Hardware acceleration enforced: animate `transform` and `opacity` only
- `min-h-[100dvh]` mandatory for full-height sections (not `h-screen`)
- Dependency verification before any import — checks `package.json` first

**Recommended workflow for SpeakLab:** Use `design-taste-frontend` as the active context during Phase 1–3 UI work. Switch to `high-end-visual-design` for the session dashboard in Phase 5.

---

## Skills Usage Summary

| Phase | Recommended Skills |
|---|---|
| Phase 1 — Shell & Navigation | `impeccable shape`, `design-taste-frontend` |
| Phase 2 — Challenge Engine UI | `impeccable craft`, `emil-design-eng` |
| Phase 3 — Live Recorder Dashboard | `emil-design-eng`, `design-taste-frontend`, `impeccable animate` |
| Phase 4 — Scorer & Feedback UI | `impeccable craft`, `impeccable polish` |
| Phase 5 — History Dashboard | `high-end-visual-design`, `impeccable audit`, `impeccable polish` |
