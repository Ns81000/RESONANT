# RESONANT

## Complete Project Documentation

### _Be heard. Be understood. Be remembered._

---

> **Version:** 1.0 — Final Planning Documentation  
> **Stack:** Next.js 15 · TypeScript · pnpm · Tailwind CSS v4 · GSAP · Gemini 3.1 Flash-Lite  
> **Deployment:** Vercel (Fluid Compute)  
> **Package Manager:** pnpm

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Brand Identity](#2-brand-identity)
3. [Design System](#3-design-system)
4. [Technology Stack](#4-technology-stack)
5. [User Journey — Complete Flow](#5-user-journey--complete-flow)
6. [Page Architecture](#6-page-architecture)
7. [Feature Specifications](#7-feature-specifications)
8. [AI Architecture — Gemini Multi-Key Engine](#8-ai-architecture--gemini-multi-key-engine)
9. [Audio Pipeline](#9-audio-pipeline)
10. [System Prompt Engineering](#10-system-prompt-engineering)
11. [GSAP Animation System](#11-gsap-animation-system)
12. [Data Architecture — Browser Storage](#12-data-architecture--browser-storage)
13. [Question Bank](#13-question-bank)
14. [Component Architecture](#14-component-architecture)
15. [Folder Structure](#15-folder-structure)
16. [Environment Variables](#16-environment-variables)
17. [Vercel Configuration](#17-vercel-configuration)
18. [Error Handling — Every Scenario](#18-error-handling--every-scenario)
19. [Performance Strategy](#19-performance-strategy)
20. [Development Phases](#20-development-phases)

---

## 1. Project Overview

**Resonant** is a zero-login, browser-native professional English communication training platform. It guides non-native English speakers through a structured, AI-evaluated speaking journey across three levels — Beginner, Intermediate, and Advanced — covering corporate communication contexts including job interviews, business meetings, client presentations, negotiations, and networking.

The product is designed as a **seamless experience**, not a utility app. Every screen, transition, and interaction flows as one continuous journey. The user never feels like they are navigating a website — they feel like they are in a session with a world-class communication coach.

### Core Philosophy

- **No login, no friction.** The user opens the site, enters their name, picks their level, and begins. Everything is stored in the browser.
- **Name everywhere.** The user's name is used in every question, every piece of feedback, every UI label. This creates a personal coaching relationship.
- **Experience over interface.** Low text, high visuals, full GSAP animation. The product breathes and moves.
- **AI that respects tokens.** Every Gemini call is engineered to deliver maximum coaching quality with minimum token cost via dynamic time limits, structured JSON output, and cached system prompts.
- **No dead ends.** Every error state, network failure, and edge case has a graceful, on-brand recovery path.

### What Resonant Is Not

- Not a quiz app
- Not a grammar checker
- Not a flashcard tool
- Not a video course

It is a **speaking coach that lives in the browser**.

---

## 2. Brand Identity

| Property               | Value                                                                                                                                                                                                  |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Name**               | Resonant                                                                                                                                                                                               |
| **Tagline**            | Be heard. Be understood. Be remembered.                                                                                                                                                                |
| **Domain suggestions** | `resonant.app` / `tryresonant.com` / `speakresonant.com`                                                                                                                                               |
| **Brand voice**        | Warm, precise, encouraging. Never clinical. Never generic. Feels like a senior communication coach — confident but never cold.                                                                         |
| **Brand metaphor**     | A voice traveling outward, reaching, landing, staying. The ripple of a tuning fork.                                                                                                                    |
| **Logo concept**       | The wordmark "Resonant" in Tiempos Headline (serif), paired with a 3-arc signal glyph in coral `#cc785c`. The glyph represents voice traveling outward. Rendered as inline SVG — no image file needed. |

### What Makes Resonant Feel Resonant

The warm cream canvas `#faf9f5` combined with coral `#cc785c` accents creates a sensation of warmth and human presence that no cold blue AI tool can replicate. Non-native speakers already feel vulnerable about their English — Resonant's palette says "you are safe here." The GSAP animations reinforce this: nothing is abrupt, nothing is harsh. Everything breathes.

---

## 3. Design System

Resonant's design system is derived directly from `DESIGN-claude.md`. All tokens are mapped as CSS custom properties in `styles/tokens.css` and consumed via Tailwind v4 configuration. **No inline hex values anywhere in components — all references use token names.**

### 3.1 Color Tokens

```css
/* styles/tokens.css */
:root {
  /* Brand */
  --color-primary: #cc785c;
  --color-primary-active: #a9583e;
  --color-primary-disabled: #e6dfd8;

  /* Text */
  --color-ink: #141413;
  --color-body: #3d3d3a;
  --color-body-strong: #252523;
  --color-muted: #6c6a64;
  --color-muted-soft: #8e8b82;

  /* Borders */
  --color-hairline: #e6dfd8;
  --color-hairline-soft: #ebe6df;

  /* Surfaces — Light */
  --color-canvas: #faf9f5;
  --color-surface-soft: #f5f0e8;
  --color-surface-card: #efe9de;
  --color-surface-cream-strong: #e8e0d2;

  /* Surfaces — Dark */
  --color-surface-dark: #181715;
  --color-surface-dark-elevated: #252320;
  --color-surface-dark-soft: #1f1e1b;

  /* On-surface text */
  --color-on-primary: #ffffff;
  --color-on-dark: #faf9f5;
  --color-on-dark-soft: #a09d96;

  /* Accents */
  --color-accent-teal: #5db8a6;
  --color-accent-amber: #e8a55a;
  --color-success: #5db872;
  --color-warning: #d4a017;
  --color-error: #c64545;
}
```

### 3.2 Typography Tokens

All display text uses **Tiempos Headline** (serif, 400 weight — never bold). All UI text, labels, body, and buttons use **Inter** (sans-serif). Both fonts are self-hosted under `/public/fonts/`.

| Token               | Family           | Size | Weight | Line Height | Letter Spacing |
| ------------------- | ---------------- | ---- | ------ | ----------- | -------------- |
| `display-xl`        | Tiempos Headline | 64px | 400    | 1.05        | -1.5px         |
| `display-lg`        | Tiempos Headline | 48px | 400    | 1.1         | -1px           |
| `display-md`        | Tiempos Headline | 36px | 400    | 1.15        | -0.5px         |
| `display-sm`        | Tiempos Headline | 28px | 400    | 1.2         | -0.3px         |
| `title-lg`          | Inter            | 22px | 500    | 1.3         | 0              |
| `title-md`          | Inter            | 18px | 500    | 1.4         | 0              |
| `title-sm`          | Inter            | 16px | 500    | 1.4         | 0              |
| `body-md`           | Inter            | 16px | 400    | 1.55        | 0              |
| `body-sm`           | Inter            | 14px | 400    | 1.55        | 0              |
| `caption`           | Inter            | 13px | 500    | 1.4         | 0              |
| `caption-uppercase` | Inter            | 12px | 500    | 1.4         | 1.5px          |
| `button`            | Inter            | 14px | 500    | 1           | 0              |

**Rule:** Display headlines (`display-xl` through `display-sm`) use Tiempos Headline 400 with negative letter-spacing always applied. This is non-negotiable. Never use Inter for display text. Never bold a display headline.

### 3.3 Spacing Tokens

| Token             | Value |
| ----------------- | ----- |
| `spacing-xxs`     | 4px   |
| `spacing-xs`      | 8px   |
| `spacing-sm`      | 12px  |
| `spacing-md`      | 16px  |
| `spacing-lg`      | 24px  |
| `spacing-xl`      | 32px  |
| `spacing-xxl`     | 48px  |
| `spacing-section` | 96px  |

### 3.4 Border Radius Tokens

| Token          | Value  |
| -------------- | ------ |
| `rounded-xs`   | 4px    |
| `rounded-sm`   | 6px    |
| `rounded-md`   | 8px    |
| `rounded-lg`   | 12px   |
| `rounded-xl`   | 16px   |
| `rounded-pill` | 9999px |

### 3.5 Surface Rhythm Rule

Resonant's pages alternate surfaces to create visual rhythm and prevent monotony. The pattern is:

```
canvas (cream) → surface-card (warm cream) → surface-dark (navy) → canvas → coral callout
```

**Never place the same surface mode in two consecutive full-screen sections.** This is the pacing mechanism of the brand.

### 3.6 Component Specifications

#### Button — Primary

- Background: `var(--color-primary)` coral
- Text: `var(--color-on-primary)` white
- Font: Inter 14px / 500
- Padding: 12px × 20px, height 40px
- Border radius: `rounded-md` (8px)
- Active state: background shifts to `var(--color-primary-active)`
- Touch target minimum: 44 × 44px

#### Button — Secondary

- Background: `var(--color-canvas)`
- Border: 1px solid `var(--color-hairline)`
- Text: `var(--color-ink)`
- Same sizing as primary

#### Button — Secondary on Dark

- Background: `var(--color-surface-dark-elevated)`
- Text: `var(--color-on-dark)`
- Used whenever a secondary action appears on a dark surface

#### Feature Card

- Background: `var(--color-surface-card)`
- Border radius: `rounded-lg` (12px)
- Padding: `spacing-xl` (32px)
- Used for: feedback breakdown panels, score cards

#### Dark Card

- Background: `var(--color-surface-dark)`
- Border radius: `rounded-lg`
- Padding: `spacing-xl`
- Text: `var(--color-on-dark)`
- Used for: AI coach sections, transcript views, result overlays

#### Input Field

- Background: `var(--color-canvas)`
- Border: 1px solid `var(--color-hairline)`
- Border radius: `rounded-md` (8px)
- Padding: 10px × 14px, height 40px
- Focus state: border shifts to `var(--color-primary)` with a 3px coral ring at 15% opacity

#### Badge — Coral

- Background: `var(--color-primary)`
- Text: white
- Font: `caption-uppercase` (Inter 12px / 500 / 1.5px tracking)
- Border radius: `rounded-pill`
- Padding: 4px × 12px

#### Badge — Neutral

- Background: `var(--color-surface-card)`
- Text: `var(--color-ink)`
- Font: `caption` (13px / 500)
- Border radius: `rounded-pill`
- Padding: 4px × 12px

### 3.7 Responsive Breakpoints

| Name    | Width       | Key Behavior                                                         |
| ------- | ----------- | -------------------------------------------------------------------- |
| Mobile  | < 768px     | Single column, bottom-anchored controls, display font scales to 32px |
| Tablet  | 768–1024px  | Two-column layouts, side-by-side panels                              |
| Desktop | 1024–1440px | Full layouts, max content width 1200px                               |
| Wide    | > 1440px    | Same as desktop with more breathing room                             |

**Mobile-first rule:** All components are built at 375px first, then expanded. No exceptions.

**Touch targets:** All interactive elements minimum 44 × 44px on mobile. The record button specifically must be minimum 72 × 72px as the most-used control in the product.

---

## 4. Technology Stack

### 4.1 Complete Stack Table

| Layer           | Technology    | Version                | Reason                                                       |
| --------------- | ------------- | ---------------------- | ------------------------------------------------------------ |
| Framework       | Next.js       | 15 (App Router)        | Full-stack, Vercel-native, streaming support                 |
| Language        | TypeScript    | 5.x                    | Type safety throughout, zero plain JS                        |
| Package Manager | pnpm          | Latest                 | As specified — faster installs, strict dependency resolution |
| Styling         | Tailwind CSS  | v4                     | Design token integration, utility-first                      |
| Animation       | GSAP          | 3.x (with all plugins) | Full GSAP capabilities as specified                          |
| State           | Zustand       | 4.x                    | Lightweight client state for session flow                    |
| Audio           | Web Audio API | Native browser         | No library needed for downsampling                           |
| Validation      | Zod           | 3.x                    | Schema validation for all Gemini responses                   |

| Icons | Lucide React | Latest | Clean, consistent icon set |
| Charts | Recharts | 2.x | Score breakdown charts |
| Deployment | Vercel | — | Fluid Compute for long AI routes |

### 4.2 GSAP Plugins Used

GSAP is used at full capability throughout Resonant. The following plugins are registered and used:

- **ScrollTrigger** — for any scroll-based reveals on landing page
- **ScrollSmoother** — silky smooth scroll on landing page
- **TextPlugin** — animated text reveals for question prompts and feedback
- **SplitText** — character/word-level text animations on headlines and scores
- **MorphSVG** — for the waveform and signal glyph morphing animations
- **DrawSVG** — for progress arcs and score reveal animations
- **Flip** — for layout transitions between states (e.g., feedback panel expanding)
- **MotionPath** — for any particle/path-following animations on celebration screen
- **CustomEase** — for Resonant's signature easing curves (warm, organic feel)
- **GSDevTools** (development only) — for animation debugging

**GSAP Performance Rules:**

1. All GSAP instances are created in `useEffect` and cleaned up with `gsap.context()` + `ctx.revert()` on unmount. No GSAP calls outside React effects.
2. `will-change: transform` applied only to elements being animated — never globally.
3. All GSAP timelines are paused by default and played on event — never autoplay on render unless intentional.
4. `gsap.ticker.lagSmoothing(0)` disabled on mobile to prevent animation catch-up lag.
5. `matchMedia` used for all GSAP animations to provide reduced-motion alternatives for accessibility.

### 4.3 Key Package Versions (pnpm)

```json
{
  "dependencies": {
    "next": "^15.0.0",
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^4.0.0",
    "gsap": "^3.12.0",
    "zustand": "^4.5.0",

    "zod": "^3.22.0",
    "lucide-react": "^0.400.0",
    "recharts": "^2.12.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0"
  }
}
```

---

## 5. User Journey — Complete Flow

This is the single most important section of this document. Every screen, state, and transition is documented here in order.

### 5.1 First Visit — New User

```
Browser opens resonant.app
        ↓
Landing Page loads (GSAP entrance animation plays)
        ↓
User clicks "Start" (CTA button)
        ↓
Name Screen — "What should we call you?"
User types name → clicks Continue
Name stored in localStorage: { "resonant_user_name": "Niranjan" }
        ↓
Level Selection Screen
"Welcome, Niranjan. Choose where you are today."
Three level cards shown:
  [Beginner]      [Intermediate]      [Advanced]
Each card shows description of what that level covers.
User selects a level.
Level stored in localStorage: { "resonant_level": "beginner" }
        ↓
Level Intro Screen (GSAP full-screen entrance)
"Beginner Level — 10 Questions"
Brief description of what to expect.
"Your journey begins now, Niranjan."
[Begin] button
        ↓
Question Screen — Question 1 of 10
(Full experience loop begins)
```

### 5.2 Return Visit — Existing User

```
Browser opens resonant.app
        ↓
Landing Page loads
App checks localStorage:
  - resonant_user_name → "Niranjan" ✓
  - resonant_level → "beginner" ✓
  - resonant_progress → { currentQuestion: 5, answers: [...] } ✓
        ↓
Landing page CTA becomes:
"Welcome back, Niranjan. Continue where you left off →"
        ↓
User clicks → instantly routed to Question 5
(No level selection, no name screen — straight back in)
```

### 5.3 Question Experience Loop (Core Loop)

This loop repeats for each of the 10 questions per level:

```
Question Screen Appears (GSAP full dissolve-rebuild transition)
        ↓
STAGE 1 — PROMPT DISPLAY
Question number shown: "03 / 10"
Progress bar: 3 filled dots, 7 empty
Question text animates in (GSAP TextPlugin character reveal)
Example: "Niranjan, tell us about a time you disagreed with your manager."
Time limit badge shown: "⏱ 45 seconds"
        ↓
STAGE 2 — INPUT MODE SELECTION
Two options displayed as cards:
  [🎤 Speak freely]   [📄 Read & speak this text]
If "Read & speak": a sample corporate response appears for user to read aloud.
If "Speak freely": no script shown.
        ↓
STAGE 3 — RECORDING
User taps the record button (72×72px minimum, coral, pulsing ring)
Microphone permission requested if not already granted.
Recording begins immediately.
Waveform bar visualizer animates in sync with voice input (real-time).
Countdown timer counts down from time limit (e.g., 45 → 0).
Recording auto-stops at time limit OR user taps stop button.
        ↓
STAGE 4 — PROCESSING
Full-screen transition: current content dissolves.
Fun fact about communication/language appears.
Example: "Did you know? Humans can process speech 3x faster than they can read."
Subtle GSAP breathing animation plays behind the fun fact.
Audio is downsampled client-side and sent to /api/analyze.
        ↓
STAGE 5 — FEEDBACK DISPLAY (GSAP sequence)
Results arrive via streaming. Display builds in sequence:
  a) Transcript appears (text streams in)
  b) Three score dials animate: Clarity, Grammar, Confidence (DrawSVG arcs)
  c) Specific feedback items slide up one by one
  d) If score qualifies as "passed" — subtle success state shown
  e) If improvement needed — specific items highlighted with suggestions
        ↓
STAGE 6 — RETRY OR CONTINUE
If feedback shows areas to improve:
  "Let's try that again, Niranjan." + [Retry] button
  Retry is unlimited — user can retry as many times as needed.
  Each retry saves the best score to localStorage.

If passed (or user satisfied with attempt):
  [Next Question →] button appears
  GSAP dissolve-rebuild transition to next question
        ↓
Repeat for questions 4 through 10
        ↓
LEVEL COMPLETION (after question 10)
Full-screen GSAP celebration sequence (see Section 7.6)
```

### 5.4 Session End (Hang Up)

At any point during the question flow, a persistent "end session" control is available. It is styled as a **phone hang-up button** — a small circular button with a coral-red phone-down icon, positioned bottom-right on desktop, bottom-center on mobile. It maintains the metaphor of being on a call with a coach.

When tapped:

1. A modal appears: _"Are you leaving, Niranjan? Your progress is saved."_
2. Two options: [Keep going] [End session]
3. If End session: progress is written to localStorage, GSAP exit animation plays, user is returned to landing page.
4. Landing page now shows their return prompt.

---

## 6. Page Architecture

### 6.1 Route Map

```
/                     → Landing page
/setup                → Name + level selection (first-time flow)
/level-intro          → Level introduction screen (after setup or level completion)
/practice             → Main question flow (questions 1–10)
/complete             → Level completion celebration screen
```

That's it. **Five routes total.** The entire product lives in these five pages. This is intentional — complexity lives in the experience, not the navigation.

### 6.2 Route Guards

Middleware (`middleware.ts`) enforces flow integrity:

- `/practice` — If no `resonant_user_name` or `resonant_level` in localStorage (checked via cookie mirror), redirect to `/setup`.
- `/level-intro` — If no level selected, redirect to `/setup`.
- `/complete` — If level not actually completed (question 10 not answered), redirect to `/practice`.
- `/setup` — If user already has name + level + in-progress session, redirect to `/practice` with resume state.

The cookie mirror: on the client, when localStorage values are set, a matching non-httpOnly cookie is set with 30-day expiry. Middleware reads the cookie to make routing decisions server-side without blocking on client JS.

### 6.3 Page — Landing (`/`)

**Purpose:** First impression, return entry point, brand experience.

**Sections (top to bottom):**

1. **Hero** — Full-viewport. Resonant wordmark + tagline. Cream canvas. GSAP entrance: tagline splits by word, each word fades up with stagger. CTA button slides up last.
   - New user: `[Start your journey]` (coral primary button)
   - Returning user: `[Continue, Niranjan →]` (coral primary, personalized)

2. **What is Resonant** — Brief visual explainer. Three steps shown as animated cards using GSAP ScrollTrigger. Low text. Icons or minimal illustrations.

3. **The Three Levels** — Visual preview of Beginner / Intermediate / Advanced. Dark surface cards. GSAP stagger reveal on scroll.

4. **CTA Footer band** — Full-width coral band. White text. "Your voice deserves to be heard." [Start now] button.

**Visual:** Cream canvas throughout. No images — illustration via CSS/SVG/GSAP only.

### 6.4 Page — Setup (`/setup`)

**Purpose:** Collect name and level. Maximum 2 steps, minimum friction.

**Step 1 — Name:**

- Full-screen, centered.
- Tiempos Headline display text: _"What should we call you?"_
- Single text input, large, auto-focused.
- [Continue →] button becomes active when name is 2+ characters.
- GSAP: input field rises from below on entrance. Button fades in when valid.

**Step 2 — Level:**

- Full-screen, centered.
- Personalized: _"Welcome, Niranjan. Choose your starting level."_
- Three level cards arranged horizontally (desktop) or vertically (mobile).
- Each card: level name in `display-sm` Tiempos, short descriptor in `body-sm` Inter, subtle icon.
- Selected card: scales up slightly (GSAP), coral border appears.
- [Begin →] button at bottom.
- GSAP: cards stagger in from below on mount.

**Level Card Content:**

| Level | Name         | Description                                                           |
| ----- | ------------ | --------------------------------------------------------------------- |
| 1     | Beginner     | Simple introductions, basic sentences, comfortable pace               |
| 2     | Intermediate | Business meetings, sharing opinions, professional tone                |
| 3     | Advanced     | High-stakes negotiations, executive presentations, complex persuasion |

### 6.5 Page — Level Intro (`/level-intro`)

**Purpose:** Prime the user emotionally before the session begins. One screen, full emotional impact.

- Full-viewport dark surface (`surface-dark`).
- Large Tiempos Headline: _"Beginner Level"_
- Subtitle: _"10 questions. Real scenarios. Honest feedback."_
- Personal line: _"You've got this, Niranjan."_
- Brief description of what the level covers (2 sentences max).
- GSAP: Elements fade and rise sequentially, each with a brief pause for reading. The sequence feels deliberate and calming.
- [Begin →] coral button, large, centered.

### 6.6 Page — Practice (`/practice`)

**Purpose:** The core experience. This is where the product lives.

This page is a **single-page state machine** — it does not navigate between routes for each question. It transitions between states using GSAP. The URL stays at `/practice` throughout. State machine:

```
IDLE → PROMPT_DISPLAY → MODE_SELECT → RECORDING → PROCESSING → FEEDBACK → (RETRY | NEXT)
```

Each state transition triggers a GSAP dissolve-rebuild animation (see Section 11 for full animation spec).

**Persistent elements (never animated away):**

- Progress bar (top of screen): `Question 3 of 10` with 10 dots
- Hang-up button (bottom right): always visible, always tappable

**State-specific content:** Everything else dissolves and rebuilds per question.

### 6.7 Page — Level Complete (`/complete`)

**Purpose:** Celebrate the user's achievement. Full GSAP celebration.

Full documentation in Section 7.6.

---

## 7. Feature Specifications

### 7.1 Name Personalization

The user's name (stored as `resonant_user_name` in localStorage) is injected into:

- Every question prompt: _"Niranjan, tell us about yourself in 30 seconds."_
- Feedback messages: _"Good work, Niranjan. Here's what to improve."_
- Level intro: _"You've got this, Niranjan."_
- Hang-up confirmation: _"Your progress is saved, Niranjan."_
- Level completion: _"You did it, Niranjan."_
- Return greeting: _"Welcome back, Niranjan."_

**Implementation:** A utility function `personalize(template: string, name: string)` replaces `{name}` placeholders in all question and feedback strings at render time. The name is trimmed to 20 characters max at input to prevent layout breaks. Title-cased on storage.

### 7.2 Dynamic Time Limits

Each question has an assigned `timeLimitSeconds` value in the question bank. This is not a fixed global timer — it is set per question to match the expected response length.

| Question Type                           | Time Limit |
| --------------------------------------- | ---------- |
| Brief introduction (10-second)          | 15 seconds |
| Short answer (opinion, preference)      | 30 seconds |
| Medium answer (explain a situation)     | 45 seconds |
| Long answer (negotiate, present, argue) | 60 seconds |
| Extended scenario (advanced, complex)   | 90 seconds |

The timer is displayed as a visible countdown with a GSAP-animated arc that depletes around the record button. At 5 seconds remaining, the arc turns coral. At 0, recording auto-stops. This dynamic limit saves tokens by constraining audio length and keeps assessments consistent.

### 7.3 Input Modes

Every question supports two input modes, selectable before recording begins:

**Mode A — Speak Freely**
User responds in their own words. No script provided. The AI evaluates authenticity, structure, vocabulary, and fluency. Most challenging, most valuable.

**Mode B — Read & Speak**
A professionally written sample response is displayed. The user reads it aloud. The AI evaluates pronunciation, fluency, and delivery — not content. This mode is gentler and useful for warming up or when the user is unsure what to say.

The `providedText` field in each question object contains the Mode B script. It is optional — not all questions have a provided text. If `providedText` is null, only Mode A is available.

### 7.4 Recording & Waveform

**Record Button:**

- 72×72px minimum (mobile), 88×88px (desktop)
- Coral fill with white microphone icon
- Idle state: static, subtle shadow
- Recording state: coral pulsing ring radiates outward (GSAP repeating tween), inner button pulses gently
- Processing state: spinner replaces mic icon, ring fades out

**Waveform Visualizer:**

- Appears only during recording
- Classic equalizer style: 24 vertical bars arranged symmetrically
- Driven by real-time `AnalyserNode` from Web Audio API (frequency data, 0–255 per bar)
- Bar heights normalized to 8px minimum, 48px maximum
- Bar color: coral `#cc785c` at full height, fading to `#e6dfd8` at minimum
- GSAP `gsap.to()` on each bar's scaleY, driven by `requestAnimationFrame` loop
- On mobile: 16 bars instead of 24 for performance

**Timer Arc:**

- SVG circle arc surrounding the record button
- GSAP `DrawSVG` animates the arc depleting clockwise
- Color: `--color-muted-soft` normally, transitions to `--color-primary` at ≤5 seconds remaining
- `duration` set to the question's `timeLimitSeconds` value

### 7.5 Processing State — Fun Fact Screen

While audio is being analyzed by Gemini (typically 5–12 seconds), the user sees a full-screen interlude:

**Layout:**

- Dark surface background (`surface-dark`)
- A subtle GSAP "breathing" animation: a large, very low-opacity coral circle slowly pulses scale 1.0 → 1.05 → 1.0, infinitely, with a 4-second period
- A small coral badge: `caption-uppercase` text: "ANALYZING YOUR RESPONSE"
- A communication fun fact in `display-sm` Tiempos Headline, centered
- Source attribution in `caption` Inter below

**Fun Facts Pool (25 minimum):**
These are stored in `/data/funFacts.json`. A random one is shown per analysis. Examples:

- _"The average person speaks around 16,000 words per day."_
- _"Humans can detect a smile in someone's voice without seeing their face."_
- _"In Japanese business culture, silence is considered a form of respect."_
- _"The word 'salary' comes from the Latin 'salarium' — payment in salt."_
- _"Eye contact during speaking increases perceived credibility by 43%."_
- _"Over 80% of communication is non-verbal — but voice tone alone accounts for 38%."_
- _"The most effective presentations use pauses, not filler words, for emphasis."_

When the Gemini response arrives, if the user is still on the fun fact screen, the results are held for a 500ms minimum display time (so the screen never flashes) before the transition to feedback begins.

### 7.6 Feedback Display

The feedback screen is the most important screen in the product. It must be beautiful, clear, and actionable.

**Layout (mobile-first):**

```
┌─────────────────────────────────────┐
│  Transcript (dark card)             │
│  What you said, verbatim            │
├─────────────────────────────────────┤
│  Score Row                          │
│  [Clarity 7.2] [Grammar 8.1] [Confidence 6.5] │
│  (Three animated score dials)       │
├─────────────────────────────────────┤
│  Feedback Items (cream cards)       │
│  One card per issue identified      │
│  - What was wrong                   │
│  - How to fix it                    │
├─────────────────────────────────────┤
│  Coach Note (coral accent card)     │
│  One warm, specific paragraph       │
│  from the AI coach persona          │
├─────────────────────────────────────┤
│  [Retry]  or  [Next Question →]     │
└─────────────────────────────────────┘
```

**Score Dials:**
Each of the three scores (Clarity, Grammar, Confidence) is displayed as a circular arc dial:

- SVG circle, `DrawSVG` animates the fill arc from 0 to the score value
- Score number counts up via GSAP from 0 to final value (1 decimal place)
- Color: green (`--color-success`) for 8+, amber (`--color-accent-amber`) for 5–7.9, coral/error (`--color-error`) for below 5
- Label below in `caption-uppercase`

**Feedback Items:**
Each item is a `feature-card` (cream surface). Contains:

- Issue type badge (coral pill): "Grammar" / "Clarity" / "Vocabulary" / "Filler Word"
- What happened: _"You said 'I am agree' — this is incorrect."_
- Fix: _"The correct form is 'I agree' — 'agree' is already a complete verb."_

GSAP: Items slide up sequentially with stagger (0.15s between each), after the scores finish animating.

**Retry Logic:**
If any score is below 6.0, the retry button is shown prominently. If all scores are 6.0+, only the "Next Question" button is shown (retry still available but secondary).

- Unlimited retries per question
- Best score across all retries is stored to localStorage
- A subtle "attempt 2 of 3" counter shown if user has retried, purely informational

**Pass Condition:**
A question is considered complete (user can move to next) when at least one of the following is true:

- All three scores ≥ 6.0
- User has attempted ≥ 3 retries (they can always advance after 3 attempts regardless of score — no one gets stuck forever)

### 7.7 Level Completion Celebration

After Question 10 is answered and feedback is shown, tapping "Complete Level" triggers the full celebration screen.

**GSAP Celebration Sequence:**

1. **Dissolve out** (0.6s): Current feedback screen dissolves away
2. **Dark canvas builds** (0.4s): `surface-dark` full-screen fade in
3. **Particle burst** (0.8s): GSAP `MotionPath` — 40 small coral dots burst outward from center, each following a unique curved path, decelerating with CustomEase
4. **Name reveal** (1.0s): `display-lg` Tiempos Headline: _"Niranjan"_ — SplitText, each character fades in from below with stagger
5. **Achievement line** (0.5s): _"Beginner Level Complete"_ fades in
6. **Score summary** (0.8s): Average scores for the level (three small dials, compressed version of feedback dials) animate in
7. **CTA** (0.5s): Two options animate in:
   - `[Continue to Intermediate →]` — coral primary button (if not on Advanced)
   - `[Practice again]` — secondary button

**If Advanced Level completed:**
The sequence is the same but the CTA becomes:

- `[You are Resonant →]` — full-width coral button
- A brief line: _"You've completed all three levels. Keep speaking, Niranjan."_

**Data stored on completion:**

```json
{
  "resonant_completed_levels": ["beginner"],
  "resonant_best_scores": {
    "beginner": { "clarity": 7.8, "grammar": 8.1, "confidence": 7.2 }
  }
}
```

---

## 8. AI Architecture — Gemini Multi-Key Engine

### 8.1 The Key Pool

Multiple API keys are collected from separate Google accounts, each representing a separate project in Google AI Studio. Each project has its own independent quota. Keys are stored exclusively in Vercel Environment Variables — never in code, never exposed to the client.

```
GEMINI_KEY_1=AIzaSy...
GEMINI_KEY_2=AIzaSy...
GEMINI_KEY_3=AIzaSy...
...
GEMINI_KEY_COUNT=N
```

**Free tier quota per key (Gemini 3.1 Flash-Lite):**

- 15 RPM (requests per minute)
- 1,500 RPD (requests per day)
- Per project, not per key — hence the multi-account strategy

With N keys from N separate Google accounts: effective capacity = `N × 15 RPM` and `N × 1,500 RPD`.

### 8.2 Key Manager — `/lib/gemini/keyManager.ts`

This is a server-side singleton service. It is the only place API keys are read from environment variables.

**Key State Object:**

```typescript
interface KeyState {
  key: string;
  index: number;
  requestsThisMinute: number;
  windowStartAt: number; // timestamp of current 1-min window
  isHealthy: boolean; // false if 403/auth error received
  cooldownUntil: number; // timestamp — key available again after this
}
```

**Selection Algorithm:**

1. Iterate all keys
2. Filter: `isHealthy === true` AND `Date.now() > cooldownUntil`
3. Among healthy available keys: reset any windows older than 60 seconds
4. Select the key with the lowest `requestsThisMinute`
5. Increment its `requestsThisMinute` counter
6. Return the key string

**On 429 (Rate Limited):**

- Set `cooldownUntil = Date.now() + 61000` (61 seconds)
- Do NOT mark `isHealthy = false` — this is a temporary state
- Immediately select next available key and retry the request transparently
- The calling API route receives the result — it never knows a retry happened

**On 403 (Auth Error):**

- Set `isHealthy = false` permanently until server restart
- Log to Vercel's built-in logging: `console.error('[KeyManager] Key ${index} auth failed — marking unhealthy')`
- Continue selection from remaining healthy keys

**On All Keys Exhausted:**

- Return a typed error: `{ error: 'CAPACITY_EXCEEDED', retryAfter: lowestCooldownMs }`
- The API route returns HTTP 503 with `Retry-After` header
- The client UI shows: _"High demand right now — ready in Xs"_ with live countdown

**Window Reset:**
A `setInterval` runs every 60 seconds on the server (Next.js server module-level effect) to reset all `requestsThisMinute` counters to 0. This ensures accurate rolling-window rate limiting.

### 8.3 Gemini Client — `/lib/gemini/client.ts`

The single wrapper for all Gemini API calls. Responsibilities:

- Gets a key from KeyManager
- Builds the request with correct headers
- Sets a 25-second timeout (hard ceiling for Gemini calls)
- Handles streaming response if requested
- On 429: calls KeyManager to mark cooldown, retries with next key (max 3 attempts)
- On other errors: returns typed error for the API route to handle
- Parses and Zod-validates the response before returning

```typescript
// Gemini API endpoint
const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const MODEL = 'gemini-3.1-flash-lite';

// Call structure
POST ${GEMINI_BASE}/${MODEL}:generateContent?key=${apiKey}
```

### 8.4 Three Gemini Use Cases

**Use Case A — Audio Analysis (main call)**

- Endpoint: `/api/analyze`
- Input: Audio blob (WAV, 16kHz mono, max 10MB) + question metadata
- Gemini feature: Multimodal audio input + JSON response mode
- Thinking level: `"low"` — enough for rubric-based evaluation, not wasteful
- Expected response time: 5–12 seconds
- Output: Full evaluation JSON (transcript + three scores + feedback items + coach note)

**Use Case B — Re-evaluation (retry path)**

- If Use Case A's JSON fails Zod validation, a simplified prompt fires
- Input: Transcript text only (no audio re-upload) + question
- Output: Scores + minimal feedback only (no coach note, fewer items)
- Thinking level: `"minimal"`
- This fallback ensures the user always gets at least a score

**Use Case C — Level Summary Generation (on level completion)**

- Input: All 10 question transcripts from the session (concatenated, trimmed to 600 tokens total)
- Output: A personalized 2-sentence summary of the user's performance across the level
- Used on the Level Completion screen: _"Niranjan, your clarity improved significantly across this level. Focus on reducing filler words in your next challenge."_
- Thinking level: `"minimal"`

### 8.5 Token Optimization Strategy

Every decision in the AI architecture is made with token efficiency in mind.

**1. Dynamic time limits = controlled transcript length.**
A 15-second question produces ~50 words of transcript. A 90-second question produces ~250 words. By enforcing per-question time limits, we prevent runaway transcripts and maintain consistent token usage per call.

**2. Structured JSON output only.**
All calls use `response_mime_type: "application/json"` with an explicit `response_schema`. This eliminates all markdown wrappers, preamble text, and explanatory prose that the model would otherwise generate around its response. Pure data, no decoration.

**3. Thinking level is tuned per task.**

- Audio evaluation: `"low"` — produces quality rubric-based scores
- Fallback re-evaluation: `"minimal"` — fastest possible
- Level summary: `"minimal"` — simple synthesis task
- Nothing uses `"medium"` or `"high"` — these are reserved for complex multi-step reasoning, not our use case

**4. System prompt is maximally compressed.**
The system prompt establishes persona, rubric, and output schema in under 500 tokens. No verbose explanations. Instruction-dense, not prose-dense. It is a constant — the same prompt for every call at a given level.

**5. Only first 40 word timestamps sent.**
The Gemini model does not need 200 word timestamps to evaluate a response. The first 40 words establish speaking pace and rhythm. After timestamp extraction, only the first 40 entries are included in the prompt.

**6. Audio is downsampled client-side before upload.**
16kHz mono WAV vs 48kHz stereo WebM: ~60% smaller file, faster upload, Gemini processes it faster, fewer tokens consumed for audio understanding.

**7. Coach note is one paragraph, hard-limited.**
The system prompt instructs: _"Your coachNote field must be exactly one paragraph, maximum 80 words. Be specific, warm, and actionable. Do not repeat the scores."_ This prevents the model from generating verbose feedback that would bloat the response.

---

## 9. Audio Pipeline

### 9.1 Complete Flow

```
User taps record
       ↓
Check mic permission (navigator.permissions.query)
       ↓
Request getUserMedia({ audio: { sampleRate: 48000, channelCount: 1, echoCancellation: true, noiseSuppression: true } })
       ↓
Pipe stream to:
  (a) MediaRecorder → collects audio chunks (audio/webm;codecs=opus)
  (b) AnalyserNode → feeds waveform visualizer in real-time
       ↓
Auto-stop at timeLimitSeconds OR manual stop
       ↓
Assemble chunks into Blob
       ↓
Client-side downsampling (Web Worker):
  - ArrayBuffer from Blob
  - OfflineAudioContext at 16000 Hz, 1 channel
  - Render to AudioBuffer
  - Export as WAV (PCM 16-bit)
       ↓
Validate:
  - Duration > 2 seconds (too short = show "Try a longer response")
  - Duration < (timeLimitSeconds + 5) (sanity check)
  - Blob size < 10MB
       ↓
Create FormData:
  - audio: WAV Blob
  - questionId: string
  - level: string
  - mode: "free" | "scripted"
  - timeLimitSeconds: number
       ↓
POST to /api/analyze
  - No auth header (no login system)
  - Session tracked via anonymous sessionId in localStorage
       ↓
Stream response back
       ↓
Zod parse incoming JSON
       ↓
Update Zustand store with result
       ↓
Trigger GSAP feedback reveal sequence
```

### 9.2 Web Worker — Downsampling

The downsampling computation runs in a dedicated Web Worker (`/lib/audio/worker.ts`) so the main thread (and GSAP animations) are never blocked.

```
Main thread → postMessage({ arrayBuffer, targetSampleRate: 16000 })
Worker → OfflineAudioContext render → PCM Int16Array → WAV header + data
Worker → postMessage({ wavBuffer }) back to main thread
Main thread → create Blob from wavBuffer → proceed to upload
```

Worker runs in approximately 100–300ms for a 60-second clip. The processing animation on the fun fact screen covers this latency seamlessly.

### 9.3 WAV Encoding

The Web Worker implements a minimal WAV encoder. No library needed. Structure:

- RIFF header (44 bytes)
- PCM 16-bit little-endian samples
- Single channel (mono)
- 16000 Hz sample rate

This produces the exact format Gemini's audio input expects.

### 9.4 Microphone Permission Handling

All error states have graceful UI:

| Error              | User-facing message                                                                 | Action available   |
| ------------------ | ----------------------------------------------------------------------------------- | ------------------ |
| `NotAllowedError`  | _"Microphone access was denied. Please allow microphone in your browser settings."_ | [Show me how] link |
| `NotFoundError`    | _"No microphone detected. Please connect a microphone and try again."_              | [Try again] button |
| `NotReadableError` | _"Your microphone is being used by another app. Please close it and try again."_    | [Try again] button |
| Generic error      | _"Something went wrong with your microphone."_                                      | [Try again] button |

Permission state is checked on page load (`/practice`). If permission is already `denied`, the record button shows a lock icon instead of a mic icon, with a tooltip explaining the issue.

### 9.5 Recording Format Fallbacks

| Browser       | Preferred format         | Fallback     |
| ------------- | ------------------------ | ------------ |
| Chrome / Edge | `audio/webm;codecs=opus` | `audio/webm` |
| Firefox       | `audio/ogg;codecs=opus`  | `audio/webm` |
| Safari        | `audio/mp4`              | `audio/mp4`  |

Format detection uses `MediaRecorder.isTypeSupported()`. The downsampler handles all these input formats via Web Audio API's `decodeAudioData()`, which is format-agnostic.

---

## 10. System Prompt Engineering

### 10.1 The Evaluation Prompt

The system prompt for Use Case A (audio evaluation) is the most important text in the product. It must be accurate, consistent, token-efficient, and produce warm, actionable feedback.

**Full System Prompt (as deployed):**

```
You are Resonant Coach — a professional communication trainer specializing in corporate English for non-native speakers. You are warm, specific, and precise.

The user is at the {LEVEL} level. They have just spoken for up to {TIME_LIMIT} seconds in response to this prompt:
"{QUESTION_TEXT}"

Their input mode was: {MODE} (free response / scripted reading)

Evaluate their speech across THREE dimensions:
1. CLARITY (0-10): How clear and easy to understand was the message? Consider sentence structure, logical flow, and absence of ambiguity.
2. GRAMMAR (0-10): How accurate was the English grammar? Count errors, assess severity, consider level-appropriate expectations.
3. CONFIDENCE (0-10): How confident and professional did the delivery sound? Consider filler words, hesitation, pace, and assertiveness of language choices.

Scoring rubric (apply per level):
- Beginner: Score generously. Expect errors. Reward attempts and communication success.
- Intermediate: Score accurately. Expect mostly correct grammar. Reward professional vocabulary.
- Advanced: Score strictly. Expect polished, professional-grade communication with minimal errors.

Return ONLY valid JSON matching this exact schema. No other text. No markdown.

{
  "transcript": "verbatim transcription of what was said",
  "scores": {
    "clarity": 7.2,
    "grammar": 8.0,
    "confidence": 6.5
  },
  "feedbackItems": [
    {
      "type": "grammar|clarity|vocabulary|filler",
      "issue": "what was wrong, in plain English",
      "fix": "how to correct it, specific and actionable"
    }
  ],
  "coachNote": "One paragraph, max 80 words, warm and specific. Use the name {USER_NAME}. Reference what they actually said. End with encouragement.",
  "passed": true
}

Rules:
- feedbackItems: minimum 1, maximum 4. Most important issues only.
- passed: true if clarity ≥ 6.0 AND grammar ≥ 6.0 AND confidence ≥ 6.0
- transcript: exactly what was said, verbatim
- coachNote: MUST reference something specific they said. Never generic.
- All fields required. Do not omit any field.
- Response under 600 tokens total.
```

### 10.2 Prompt Variables

Before sending to Gemini, these variables are interpolated into the prompt:

| Variable          | Source                                                                  |
| ----------------- | ----------------------------------------------------------------------- |
| `{LEVEL}`         | `resonant_level` from localStorage (Beginner/Intermediate/Advanced)     |
| `{TIME_LIMIT}`    | `timeLimitSeconds` from the question object                             |
| `{QUESTION_TEXT}` | `prompt` field from the question object, with `{name}` already replaced |
| `{MODE}`          | User's selected input mode (free/scripted)                              |
| `{USER_NAME}`     | `resonant_user_name` from localStorage                                  |

### 10.3 Level Summary Prompt (Use Case C)

```
You are Resonant Coach. Here are brief transcripts from {USER_NAME}'s {LEVEL} level session ({N} questions).

Transcripts (truncated): {CONCATENATED_TRANSCRIPTS}
Average scores: Clarity {AVG_CLARITY}, Grammar {AVG_GRAMMAR}, Confidence {AVG_CONFIDENCE}

Write exactly two sentences:
1. One specific observation about their strongest performance across this session.
2. One specific, actionable improvement for their next level.

Use their name. Be warm. Be precise. Return ONLY these two sentences as plain text, no JSON.
```

### 10.4 Response Validation (Zod Schema)

```typescript
// /lib/gemini/schemas.ts

const FeedbackItemSchema = z.object({
  type: z.enum(["grammar", "clarity", "vocabulary", "filler"]),
  issue: z.string().min(5).max(200),
  fix: z.string().min(5).max(200),
});

const EvaluationResponseSchema = z.object({
  transcript: z.string().min(1).max(2000),
  scores: z.object({
    clarity: z.number().min(0).max(10),
    grammar: z.number().min(0).max(10),
    confidence: z.number().min(0).max(10),
  }),
  feedbackItems: z.array(FeedbackItemSchema).min(1).max(4),
  coachNote: z.string().min(20).max(500),
  passed: z.boolean(),
});

export type EvaluationResponse = z.infer<typeof EvaluationResponseSchema>;
```

If Zod validation fails, the fallback prompt (Use Case B) fires with transcript text only. If that also fails Zod, a hardcoded minimal response is returned:

```typescript
{
  transcript: '[Unable to process audio clearly]',
  scores: { clarity: 5.0, grammar: 5.0, confidence: 5.0 },
  feedbackItems: [{ type: 'clarity', issue: 'Audio quality made analysis difficult', fix: 'Try recording in a quieter environment' }],
  coachNote: `${name}, we had trouble processing this response clearly. Try again in a quieter environment.`,
  passed: false
}
```

---

## 11. GSAP Animation System

### 11.1 Philosophy

GSAP animations in Resonant follow one principle: **every transition must feel inevitable, not surprising**. The animations should feel like the natural physics of a living, breathing product. Nothing snaps. Nothing stutters. Everything eases.

Resonant uses a custom ease registered as `"resonant.ease"`:

```javascript
CustomEase.create("resonant.ease", "M0,0 C0.16,1 0.3,1 1,1");
```

This is a slightly over-shooting ease that settles naturally, giving all transitions a sense of warmth and physicality.

### 11.2 Page Transition — Dissolve & Rebuild

This is the primary page transition between questions and between all major state changes. It is Resonant's most distinctive animation.

**The dissolve-rebuild sequence (total: ~1.2s):**

```javascript
// Phase 1: Dissolve current content (0.4s)
gsap.to(currentContent, {
  opacity: 0,
  y: -20,
  scale: 0.98,
  duration: 0.4,
  ease: "power2.in",
  onComplete: () => {
    // Swap content in DOM
    setCurrentState(nextState);
  },
});

// Phase 2: Rebuild new content (0.8s, starts immediately after swap)
gsap.fromTo(
  newContent.children,
  { opacity: 0, y: 30 },
  {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: "resonant.ease",
    stagger: 0.1,
  },
);
```

### 11.3 All Animation Definitions

| Animation                  | Trigger           | GSAP Feature                                | Duration                    |
| -------------------------- | ----------------- | ------------------------------------------- | --------------------------- |
| Landing page hero entrance | Page load         | SplitText + stagger                         | 1.4s total                  |
| Landing scroll reveals     | Scroll into view  | ScrollTrigger                               | 0.6s per item               |
| Level card selection       | Click             | `gsap.to(scale, border)`                    | 0.25s                       |
| Level intro headline       | Mount             | SplitText character stagger                 | 1.2s                        |
| Question dissolve-rebuild  | State change      | Opacity + Y + stagger                       | 1.2s                        |
| Question text reveal       | Question loads    | TextPlugin character feed                   | 0.8s                        |
| Record button pulse        | Recording active  | `gsap.to(scale)` repeat                     | Infinite, 1.5s period       |
| Waveform bars              | Recording active  | `requestAnimationFrame` + `gsap.to` per bar | Continuous                  |
| Timer arc depletion        | Recording start   | DrawSVG                                     | `timeLimitSeconds` duration |
| Fun fact entrance          | Processing start  | Opacity + Y                                 | 0.5s                        |
| Breathing circle           | Processing active | `gsap.to(scale)` yoyo                       | Infinite, 4s period         |
| Transcript stream          | Response arrives  | TextPlugin                                  | Progressive                 |
| Score dial fill            | Feedback display  | DrawSVG + counter                           | 1.0s                        |
| Score counter              | Feedback display  | Custom GSAP tween                           | 1.0s                        |
| Feedback items stagger     | After scores      | Y + opacity, stagger 0.15s                  | 0.6s each                   |
| Coach note fade            | After items       | Opacity                                     | 0.5s                        |
| Celebration particle burst | Level complete    | MotionPath, 40 particles                    | 0.8s                        |
| Name reveal on completion  | After particles   | SplitText character stagger                 | 1.0s                        |
| Celebration CTA buttons    | Final step        | Y + opacity stagger                         | 0.5s                        |

### 11.4 Reduced Motion

All GSAP animations are wrapped in a `prefers-reduced-motion` check via GSAP's `matchMedia`:

```javascript
const mm = gsap.matchMedia();

mm.add("(prefers-reduced-motion: no-preference)", () => {
  // Full animations
});

mm.add("(prefers-reduced-motion: reduce)", () => {
  // Instant transitions, no motion
  // Elements appear without animation
  // Score dials populate instantly
});
```

### 11.5 GSAP Context & Cleanup

Every component that uses GSAP follows this pattern:

```javascript
useEffect(() => {
  const ctx = gsap.context(() => {
    // All GSAP code here, scoped to this component
  }, containerRef);

  return () => ctx.revert(); // Cleanup on unmount
}, [dependencies]);
```

This prevents memory leaks and animation conflicts during React re-renders.

### 11.6 Mobile Performance Rules

- Waveform bars: 16 on mobile, 24 on desktop (reduced DOM elements)
- Particle burst on level completion: 20 particles on mobile, 40 on desktop
- `gsap.ticker.lagSmoothing(0)` — prevents animation catch-up on tab focus
- `force3D: true` on all transform animations — ensures GPU compositing
- No ScrollSmoother on mobile — native scroll only
- All animations use `transform` and `opacity` only — no layout-triggering properties (no width, height, margin, padding animations)

---

## 12. Data Architecture — Browser Storage

Resonant has no user authentication and no persistent server-side user data. All user state lives in `localStorage` and a lightweight cookie mirror for middleware routing.

### 12.1 localStorage Keys

| Key                         | Type                                         | Description                            |
| --------------------------- | -------------------------------------------- | -------------------------------------- |
| `resonant_user_name`        | `string`                                     | User's name, title-cased, max 20 chars |
| `resonant_level`            | `"beginner" \| "intermediate" \| "advanced"` | Currently active level                 |
| `resonant_progress`         | `ProgressState` (JSON)                       | Current level progress (see below)     |
| `resonant_completed_levels` | `string[]` (JSON)                            | Array of completed level slugs         |
| `resonant_best_scores`      | `BestScores` (JSON)                          | Best scores per level (see below)      |
| `resonant_setup_complete`   | `"true"`                                     | Whether name + level have been set     |

### 12.2 Progress State Schema

```typescript
interface ProgressState {
  level: "beginner" | "intermediate" | "advanced";
  currentQuestion: number; // 1-based, 1–10
  questionResults: QuestionResult[];
  sessionStartedAt: string; // ISO timestamp
  lastActiveAt: string; // ISO timestamp
}

interface QuestionResult {
  questionId: string;
  attempts: number;
  bestScores: {
    clarity: number;
    grammar: number;
    confidence: number;
  };
  passed: boolean;
  completedAt: string;
}
```

### 12.3 Best Scores Schema

```typescript
interface BestScores {
  beginner?: LevelScoreSummary;
  intermediate?: LevelScoreSummary;
  advanced?: LevelScoreSummary;
}

interface LevelScoreSummary {
  avgClarity: number;
  avgGrammar: number;
  avgConfidence: number;
  completedAt: string;
  levelSummary: string; // The AI-generated 2-sentence summary
}
```

### 12.4 Cookie Mirror

When `resonant_user_name`, `resonant_level`, and `resonant_setup_complete` are set in localStorage, matching cookies are set via JavaScript:

```javascript
document.cookie = `resonant_setup_complete=true; max-age=${30 * 24 * 60 * 60}; path=/; SameSite=Lax`;
```

These cookies are readable by Next.js middleware for server-side route protection. They carry no sensitive data — only routing signals.

### 12.5 Storage Utility — `/lib/storage.ts`

All localStorage reads and writes go through a single utility module. This prevents scattered direct `localStorage` calls and handles:

- JSON serialization/deserialization
- try/catch for storage quota errors (rare but possible)
- SSR safety (localStorage not available in Node.js — all calls are guarded with `typeof window !== 'undefined'`)
- Typed getters and setters for every key

---

## 13. Question Bank

### 13.1 Structure

All questions are stored in `/data/questions.json`. This is a static JSON file bundled at build time — zero database query to load a question. Fast, free, always available.

```typescript
interface Question {
  id: string; // e.g., "beg-001"
  level: "beginner" | "intermediate" | "advanced";
  category: string; // e.g., "introduction"
  prompt: string; // "{name}, tell us about yourself in 10 seconds."
  timeLimitSeconds: number; // Dynamic per question
  providedText: string | null; // Mode B script, or null if not available
  evaluationFocus: string[]; // Hints for the AI, e.g., ["fluency", "clarity"]
}
```

### 13.2 Beginner Level Questions (10)

| #   | Category        | Prompt                                                              | Time Limit |
| --- | --------------- | ------------------------------------------------------------------- | ---------- |
| 1   | Introduction    | _"{name}, let's start simple. Introduce yourself in 10 seconds."_   | 15s        |
| 2   | Introduction    | _"{name}, tell us one professional thing about yourself."_          | 20s        |
| 3   | Daily work      | _"{name}, describe what you do at work in one sentence."_           | 25s        |
| 4   | Opinion         | _"{name}, do you prefer working alone or in a team? Why?"_          | 30s        |
| 5   | Meeting         | _"{name}, how would you greet a new colleague on their first day?"_ | 30s        |
| 6   | Problem solving | _"{name}, tell us about a simple problem you solved at work."_      | 35s        |
| 7   | Communication   | _"{name}, how do you usually communicate with your team?"_          | 30s        |
| 8   | Goals           | _"{name}, what is one professional goal you have this year?"_       | 35s        |
| 9   | Opinion         | _"{name}, what makes a good manager, in your opinion?"_             | 35s        |
| 10  | Closing         | _"{name}, how would you close a short meeting professionally?"_     | 30s        |

### 13.3 Intermediate Level Questions (10)

| #   | Category      | Prompt                                                                               | Time Limit |
| --- | ------------- | ------------------------------------------------------------------------------------ | ---------- |
| 1   | Meeting       | _"{name}, you're leading a team meeting. Open it professionally."_                   | 40s        |
| 2   | Disagreement  | _"{name}, your manager has an idea you disagree with. How do you respond?"_          | 45s        |
| 3   | Presenting    | _"{name}, present a project update in under a minute."_                              | 60s        |
| 4   | Email verbal  | _"{name}, dictate a follow-up message after a productive meeting."_                  | 45s        |
| 5   | Client call   | _"{name}, a client is frustrated with a delay. How do you respond?"_                 | 50s        |
| 6   | Opinion       | _"{name}, your team is debating two approaches. Argue for one."_                     | 50s        |
| 7   | Feedback      | _"{name}, give constructive feedback to a colleague who missed a deadline."_         | 50s        |
| 8   | Networking    | _"{name}, you meet a senior executive at an event. Start the conversation."_         | 40s        |
| 9   | Clarification | _"{name}, a colleague gave confusing instructions. Ask for clarity professionally."_ | 40s        |
| 10  | Wrap-up       | _"{name}, close a project retrospective meeting with key takeaways."_                | 55s        |

### 13.4 Advanced Level Questions (10)

| #   | Category           | Prompt                                                                          | Time Limit |
| --- | ------------------ | ------------------------------------------------------------------------------- | ---------- |
| 1   | Negotiation        | _"{name}, open a salary negotiation with a clear ask and rationale."_           | 60s        |
| 2   | Presentation       | _"{name}, open a board presentation with a compelling hook."_                   | 60s        |
| 3   | Crisis             | _"{name}, your team made a costly mistake. Address the client directly."_       | 65s        |
| 4   | Persuasion         | _"{name}, convince reluctant stakeholders to approve your proposal."_           | 70s        |
| 5   | Executive presence | _"{name}, respond to a tough question you weren't prepared for in a meeting."_  | 60s        |
| 6   | Conflict           | _"{name}, two team members are in conflict. Mediate between them as a leader."_ | 70s        |
| 7   | Vision             | _"{name}, articulate a 90-day vision for your team."_                           | 75s        |
| 8   | Objection handling | _"{name}, a client says your price is too high. Handle it."_                    | 65s        |
| 9   | Closing            | _"{name}, close a high-stakes negotiation where both sides made concessions."_  | 75s        |
| 10  | Mastery            | _"{name}, summarize what makes you the right person for a C-suite role."_       | 90s        |

### 13.5 Question Ordering

Questions are served in fixed order (1–10) for consistency. This is intentional: the difficulty within each level escalates deliberately. Users are not randomized — they experience a structured learning curve.

---

## 14. Component Architecture

### 14.1 Component Map

```
components/
├── ui/                          Base design system components
│   ├── Button.tsx               Primary, Secondary, Secondary-on-dark variants
│   ├── Card.tsx                 Feature card + Dark card variants
│   ├── Badge.tsx                Coral + Neutral variants
│   ├── Input.tsx                Text input with focus state
│   ├── ProgressBar.tsx          10-dot progress indicator
│   └── Modal.tsx                Hang-up confirmation modal
│
├── layout/
│   ├── RootLayout.tsx           HTML shell, font loading, GSAP registration
│   └── PageWrapper.tsx          Handles page-level GSAP context
│
├── landing/
│   ├── Hero.tsx                 Full-viewport hero with GSAP entrance
│   ├── HowItWorks.tsx           3-step explainer with ScrollTrigger
│   └── LevelPreview.tsx         Three level cards with scroll animation
│
├── setup/
│   ├── NameStep.tsx             Name input step
│   └── LevelStep.tsx            Level selection step with animated cards
│
├── practice/
│   ├── PracticeStateMachine.tsx Master component — owns state, drives transitions
│   ├── QuestionPrompt.tsx       Question text + time limit badge
│   ├── ModeSelector.tsx         Free / Scripted input mode cards
│   ├── RecordButton.tsx         Coral record button with pulse animation
│   ├── WaveformVisualizer.tsx   Equalizer bars driven by AnalyserNode
│   ├── TimerArc.tsx             SVG countdown arc around record button
│   ├── ProcessingScreen.tsx     Fun fact display during AI analysis
│   └── HangUpButton.tsx         Session end control (phone icon)
│
├── feedback/
│   ├── FeedbackPanel.tsx        Full feedback layout orchestrator
│   ├── TranscriptCard.tsx       Dark card showing verbatim transcript
│   ├── ScoreDial.tsx            Animated circular score display
│   ├── ScoreRow.tsx             Three ScoreDials arranged in a row
│   ├── FeedbackItem.tsx         Single feedback item card
│   └── CoachNote.tsx            Coral-accented coach paragraph
│
└── completion/
    ├── LevelComplete.tsx        Celebration screen orchestrator
    └── ParticleBurst.tsx        GSAP MotionPath particle animation
```

### 14.2 State Machine — PracticeStateMachine.tsx

This is the core component of the product. It owns the practice session state and drives all transitions.

```typescript
type PracticeState =
  | "IDLE"
  | "PROMPT_DISPLAY"
  | "MODE_SELECT"
  | "RECORDING"
  | "PROCESSING"
  | "FEEDBACK"
  | "COMPLETE";

interface SessionState {
  currentState: PracticeState;
  currentQuestionIndex: number; // 0-based
  currentQuestion: Question | null;
  selectedMode: "free" | "scripted" | null;
  recordingBlob: Blob | null;
  evaluationResult: EvaluationResponse | null;
  attempts: number; // retries on current question
  funFact: string; // random fact shown during processing
}
```

State transitions are managed by a `dispatch` function (Zustand action). Every state change triggers the appropriate GSAP dissolve-rebuild animation before the state updates in React.

### 14.3 Zustand Store — `/store/session.ts`

```typescript
interface SessionStore {
  // State
  userName: string;
  level: Level;
  currentQuestion: number;
  practiceState: PracticeState;
  evaluationResult: EvaluationResponse | null;
  isProcessing: boolean;
  error: AppError | null;

  // Actions
  setUserName: (name: string) => void;
  setLevel: (level: Level) => void;
  nextQuestion: () => void;
  setEvaluationResult: (result: EvaluationResponse) => void;
  setProcessing: (state: boolean) => void;
  setError: (error: AppError | null) => void;
  resetSession: () => void;
  setPracticeState: (state: PracticeState) => void;
}
```

---

## 15. Folder Structure

```
resonant/
├── app/
│   ├── layout.tsx                    Root layout (fonts, GSAP plugins, providers)
│   ├── page.tsx                      Landing page /
│   ├── setup/
│   │   └── page.tsx                  /setup
│   ├── level-intro/
│   │   └── page.tsx                  /level-intro
│   ├── practice/
│   │   └── page.tsx                  /practice
│   ├── complete/
│   │   └── page.tsx                  /complete
│   └── api/
│       ├── analyze/
│       │   └── route.ts              POST /api/analyze — main audio analysis
│       └── summary/
│           └── route.ts              POST /api/summary — level completion summary
│
├── components/
│   ├── ui/                           (see Section 14.1)
│   ├── layout/
│   ├── landing/
│   ├── setup/
│   ├── practice/
│   ├── feedback/
│   └── completion/
│
├── lib/
│   ├── gemini/
│   │   ├── keyManager.ts             Multi-key rotation engine
│   │   ├── client.ts                 Gemini API wrapper
│   │   ├── prompts.ts                All system prompts
│   │   └── schemas.ts                Zod validation schemas
│   ├── audio/
│   │   ├── recorder.ts               MediaRecorder abstraction + permission handling
│   │   ├── downsampler.ts            Client-side 16kHz WAV conversion
│   │   └── worker.ts                 Web Worker for off-main-thread downsampling
│   ├── storage.ts                    localStorage utility (typed, SSR-safe)
│   ├── personalize.ts                Name injection utility
│   └── utils.ts                      Shared helpers (cn, formatScore, etc.)
│
├── store/
│   └── session.ts                    Zustand store
│
├── data/
│   ├── questions.json                All 30 questions (10 per level)
│   └── funFacts.json                 25 communication fun facts
│
├── styles/
│   ├── tokens.css                    CSS custom properties from DESIGN-claude.md
│   └── globals.css                   Base styles, font-face declarations
│
├── public/
│   └── fonts/
│       ├── tiempos-headline-regular.woff2
│       └── inter-variable.woff2
│
├── middleware.ts                     Route protection + flow enforcement
├── next.config.ts                    Next.js config
├── tailwind.config.ts                Tailwind v4 with token mapping
├── vercel.json                       Function timeouts + region
└── package.json                      pnpm workspace config
```

---

## 16. Environment Variables

All environment variables are set in Vercel Dashboard → Project Settings → Environment Variables. They are never committed to the repository.

```bash
# Gemini API Keys (one per Google account/project)
GEMINI_KEY_1=AIzaSy...
GEMINI_KEY_2=AIzaSy...
GEMINI_KEY_3=AIzaSy...
# ... add as many as you have
GEMINI_KEY_COUNT=3    # Must match the number of keys above

# App
NEXT_PUBLIC_APP_URL=https://resonant.app    # Public base URL
NODE_ENV=production
```

**Security rules:**

- Keys prefixed `NEXT_PUBLIC_` are exposed to the browser — only `NEXT_PUBLIC_APP_URL` is public
- All `GEMINI_KEY_*` variables are server-only — never prefixed with `NEXT_PUBLIC_`
- `.env.local` is used in development — never committed (in `.gitignore`)

**Local development `.env.local`:**

```bash
GEMINI_KEY_1=AIzaSy...    # Your personal development key
GEMINI_KEY_COUNT=1
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 17. Vercel Configuration

### 17.1 `vercel.json`

```json
{
  "functions": {
    "app/api/analyze/route.ts": {
      "maxDuration": 60
    },
    "app/api/summary/route.ts": {
      "maxDuration": 30
    }
  },
  "regions": ["iad1"]
}
```

**Notes:**

- `maxDuration: 60` on `/api/analyze` uses Vercel Fluid Compute — the free plan supports up to 60 seconds for functions. This covers the worst-case Gemini response time with margin.
- `regions: ["iad1"]` — US East 1. Google AI Studio's closest region. Minimizes round-trip latency for Gemini calls.
- Fluid Compute is enabled by default on Vercel free plans for functions with `maxDuration > 10`.

### 17.2 Next.js Config

```typescript
// next.config.ts
const nextConfig = {
  experimental: {
    ppr: true, // Partial Pre-rendering
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // GSAP requires this for SplitText / TextPlugin
  transpilePackages: ["gsap"],
};
```

### 17.3 Deployment Checklist

Before every deployment:

1. All `GEMINI_KEY_*` variables set in Vercel dashboard
2. `GEMINI_KEY_COUNT` matches actual number of keys
3. `NEXT_PUBLIC_APP_URL` set to production domain
4. GSAP license registered (Club GreenSock or Business Green license required for paid plugins like SplitText, MorphSVG, DrawSVG in commercial use)

---

## 18. Error Handling — Every Scenario

Every failure has a recovery path. No raw errors reach the user.

### 18.1 API Errors

| Error                | Cause                         | User Message                                                                             | Recovery                                  |
| -------------------- | ----------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------- |
| `CAPACITY_EXCEEDED`  | All Gemini keys rate-limited  | _"High demand right now — ready in {N} seconds"_                                         | Countdown timer, auto-retry               |
| `GEMINI_TIMEOUT`     | Gemini took >25s              | _"Taking longer than usual. Try again."_                                                 | [Retry] button, does not count as attempt |
| `AUDIO_TOO_SHORT`    | Audio <2s                     | _"That was a little short. Give it another go."_                                         | Returns to recording state                |
| `AUDIO_PARSE_FAILED` | Corrupt audio blob            | _"We couldn't read that recording. Try once more."_                                      | Returns to recording state                |
| `INVALID_RESPONSE`   | Gemini JSON failed validation | Fallback prompt fires silently. If fallback also fails: minimal hardcoded response shown | See Section 10.4                          |
| `NETWORK_ERROR`      | No internet during API call   | _"Connection lost. Check your internet and try again."_                                  | [Retry] button                            |

### 18.2 Audio Errors

| Error                   | Cause               | User Message                                                                | Recovery        |
| ----------------------- | ------------------- | --------------------------------------------------------------------------- | --------------- |
| `MIC_PERMISSION_DENIED` | User blocked mic    | _"Microphone access was denied. Please allow it in your browser settings."_ | [Show me how]   |
| `MIC_NOT_FOUND`         | No mic device       | _"No microphone detected."_                                                 | [Try again]     |
| `MIC_IN_USE`            | Mic busy            | _"Your microphone is in use by another app."_                               | [Try again]     |
| `RECORDING_FAILED`      | MediaRecorder error | _"Recording failed unexpectedly."_                                          | [Try again]     |
| `DOWNSAMPLE_FAILED`     | Web Worker crash    | Fallback: skip downsampling, send raw WebM                                  | Silent fallback |

### 18.3 Storage Errors

| Error                | Cause                             | Handling                                                                                                                             |
| -------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `QuotaExceededError` | localStorage full                 | Clear `resonant_progress` cache, keep name + level only. Show no-op to user.                                                         |
| `SecurityError`      | Private browsing, storage blocked | Detect on startup. Show banner: _"Enable storage access for the best experience."_ App still works in session-only mode via Zustand. |

### 18.4 Routing Errors

Middleware redirects cleanly. Users never see a 404. If a user lands on `/practice` with no session data, they are redirected to `/setup` with their URL preserved — after setup they return to where they tried to go.

---

## 19. Performance Strategy

### 19.1 Streaming Responses

The `/api/analyze` route streams its response using `ReadableStream`. The client starts rendering the transcript immediately as the first tokens arrive from Gemini — users see text appearing within 2–3 seconds of submitting audio, rather than waiting for the full response.

```typescript
// app/api/analyze/route.ts
return new Response(
  new ReadableStream({
    async start(controller) {
      // Stream transcript first
      controller.enqueue(encodeChunk({ type: "transcript", text: result.transcript }));
      // Then scores
      controller.enqueue(encodeChunk({ type: "scores", scores: result.scores }));
      // Then feedback items
      for (const item of result.feedbackItems) {
        controller.enqueue(encodeChunk({ type: "feedbackItem", item }));
      }
      // Finally coach note
      controller.enqueue(encodeChunk({ type: "coachNote", text: result.coachNote }));
      controller.close();
    },
  }),
  { headers: { "Content-Type": "text/event-stream" } },
);
```

### 19.2 Code Splitting

Every page is its own bundle (Next.js App Router default). Heavy components are dynamically imported:

```typescript
const WaveformVisualizer = dynamic(() => import("@/components/practice/WaveformVisualizer"), {
  ssr: false, // Web Audio API not available server-side
});

const ParticleBurst = dynamic(() => import("@/components/completion/ParticleBurst"), {
  ssr: false,
});
```

GSAP plugins are imported only in the files that use them — not globally registered at the root.

### 19.3 Static Data

Questions and fun facts are static JSON files. They are bundled at build time by Next.js and served from the CDN edge — zero API call, zero latency to load a question.

### 19.4 Font Loading

Tiempos Headline and Inter are self-hosted under `/public/fonts/`. Loaded via `@font-face` in `globals.css` with `font-display: swap`. This ensures text is always visible (swap) even before fonts load, with no FOIT (flash of invisible text).

### 19.5 Audio Processing Performance

The Web Worker for downsampling runs off the main thread. GSAP animations on the fun fact screen play uninterrupted while audio is being processed. The main thread is never blocked by audio computation.

---

## 20. Development Phases

### Phase 1 — Foundation (Week 1–2)

- [ ] Project scaffold: `pnpm create next-app resonant --typescript --tailwind --app`
- [ ] Install all dependencies (`pnpm add gsap zustand zod lucide-react recharts`)
- [ ] Set up `styles/tokens.css` with all DESIGN-claude.md tokens
- [ ] Configure Tailwind v4 with token mapping
- [ ] Self-host fonts (Tiempos Headline + Inter)
- [ ] Build all base `ui/` components (Button, Card, Badge, Input, ProgressBar, Modal)
- [ ] Register GSAP plugins in root layout
- [ ] Set up `lib/storage.ts` + `lib/personalize.ts`
- [ ] Build Zustand session store

### Phase 2 — Setup & Landing (Week 2–3)

- [ ] Build landing page with full GSAP entrance and ScrollTrigger reveals
- [ ] Build `/setup` page: NameStep + LevelStep with animations
- [ ] Build `/level-intro` page
- [ ] Implement middleware for route guards
- [ ] Implement cookie mirror for localStorage values
- [ ] Write all 30 questions to `data/questions.json`
- [ ] Write 25 fun facts to `data/funFacts.json`

### Phase 3 — Audio Pipeline (Week 3–4)

- [ ] Build `lib/audio/recorder.ts` with all permission error handling
- [ ] Build `lib/audio/worker.ts` (Web Worker downsampler)
- [ ] Build `lib/audio/downsampler.ts` (main thread coordinator)
- [ ] Build `WaveformVisualizer` component with real-time AnalyserNode
- [ ] Build `RecordButton` with GSAP pulse animations
- [ ] Build `TimerArc` with DrawSVG countdown
- [ ] Build `ModeSelector` component
- [ ] Test full recording → downsample → WAV export pipeline in isolation

### Phase 4 — AI Integration (Week 4–5)

- [ ] Build `lib/gemini/keyManager.ts` with full rotation logic
- [ ] Build `lib/gemini/client.ts` with timeout + retry
- [ ] Write evaluation system prompt in `lib/gemini/prompts.ts`
- [ ] Write Zod schemas in `lib/gemini/schemas.ts`
- [ ] Build `/api/analyze` route with streaming response
- [ ] Build `/api/summary` route
- [ ] Test with multiple API keys, verify rotation on 429
- [ ] Test Zod validation, verify fallback behavior

### Phase 5 — Practice Flow (Week 5–6)

- [ ] Build `PracticeStateMachine.tsx` with all states
- [ ] Build `ProcessingScreen.tsx` with fun fact display
- [ ] Build full feedback display: `TranscriptCard`, `ScoreDial`, `ScoreRow`, `FeedbackItem`, `CoachNote`
- [ ] Build `HangUpButton` + confirmation modal
- [ ] Implement GSAP dissolve-rebuild transition between questions
- [ ] Wire streaming API response to incremental feedback display
- [ ] Implement retry logic + best-score tracking
- [ ] Implement progress saving to localStorage

### Phase 6 — Completion & Polish (Week 6–7)

- [ ] Build `/complete` page with full GSAP celebration sequence
- [ ] Build `ParticleBurst` with MotionPath
- [ ] Build level summary with AI-generated text
- [ ] Implement return-user resume flow (landing → practice at correct question)
- [ ] Add `prefers-reduced-motion` GSAP alternatives
- [ ] Mobile-first QA pass: test every screen at 375px
- [ ] Performance pass: dynamic imports, font loading, bundle size analysis
- [ ] Test all error scenarios from Section 18

### Phase 7 — Launch Prep (Week 7–8)

- [ ] SEO: meta tags, OG image, favicon (`/r` logomark in coral on cream)
- [ ] Vercel Analytics enabled
- [ ] Rate limit stress test with simulated concurrent users
- [ ] Multi-key rotation test: verify all keys rotate correctly, verify 429 handling
- [ ] Cross-browser test: Chrome, Firefox, Safari, Mobile Safari
- [ ] Final content review: all 30 questions, all 25 fun facts, all error messages
- [ ] GSAP commercial license verified
- [ ] Production deployment

---

## Appendix A — Gemini API Request Structure

Complete request body structure for Use Case A (Audio Evaluation):

```typescript
{
  model: "gemini-3.1-flash-lite",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: { /* Zod-converted JSON Schema */ },
    temperature: 0.2,       // Low temperature for consistent scoring
    maxOutputTokens: 600,   // Hard cap on response length
    thinkingConfig: {
      thinkingBudget: "low" // Balanced quality vs speed
    }
  },
  contents: [
    {
      role: "user",
      parts: [
        {
          inlineData: {
            mimeType: "audio/wav",
            data: "<base64-encoded WAV>"
          }
        },
        {
          text: "<interpolated system prompt + question context>"
        }
      ]
    }
  ]
}
```

---

## Appendix B — Fun Facts Complete List

25 communication fun facts stored in `/data/funFacts.json`:

1. _The average person speaks around 16,000 words per day._
2. _Humans can detect a smile in someone's voice without seeing their face._
3. _In Japanese business culture, silence is considered a form of respect._
4. _The word 'salary' comes from the Latin 'salarium' — payment in salt._
5. _Eye contact during speaking increases perceived credibility by up to 43%._
6. _Over 80% of communication is non-verbal — but voice tone alone accounts for 38%._
7. _The most effective speakers use pauses, not filler words, for emphasis._
8. _Speaking at 130–150 words per minute is considered the ideal pace for clarity._
9. _The fear of public speaking (glossophobia) affects up to 75% of the population._
10. _Churchill, Lincoln, and Obama all practiced speeches aloud for hours before delivery._
11. _Using someone's name in conversation increases their trust in you by 30%._
12. _The human brain processes speech three times faster than it can read text._
13. _The word 'communicate' derives from the Latin 'communicare' — to share._
14. _Confident speakers tend to end sentences with falling intonation, not rising._
15. _Research shows that storytelling activates 5 areas of the brain simultaneously._
16. _'Um' and 'uh' are linguistically functional — they signal the brain is still speaking._
17. _Steve Jobs rehearsed every keynote presentation for hundreds of hours._
18. _The average attention span during a meeting drops by half after 30 minutes._
19. _A strong opening statement is remembered 70% more than the content that follows._
20. _Mirroring someone's speaking pace creates an unconscious sense of trust._
21. _The English word 'nice' originally meant 'foolish' in the 13th century._
22. _Breathing from the diaphragm (not the chest) produces a fuller, more confident voice._
23. _Active listening — nodding and paraphrasing — improves speaker confidence by 25%._
24. _Over 1 billion people are currently learning English as a second language._
25. _The most common filler word globally is 'um' — but its exact sound varies by language._

---

## Appendix C — Design Do's and Don'ts (from DESIGN-claude.md)

**Do:**

- Anchor every screen on the cream canvas `#faf9f5`. Pure white reads as generic. The warm tint is the brand.
- Use Tiempos Headline for every display headline. Negative letter-spacing is non-negotiable at display sizes.
- Reserve coral `#cc785c` for primary CTAs and full-bleed callout moments only.
- Alternate surfaces: cream → surface-card → dark. Never two consecutive dark screens.
- Use `spacing-section` (96px) between major sections on the landing page.

**Don't:**

- Don't use cool grays or pure white for any surface.
- Don't bold Tiempos Headline. 400 weight only. Bolding reads as bombastic.
- Don't put coral everywhere. Its scarcity is its power.
- Don't use Inter for display headlines.
- Don't introduce purple, blue, or green as a fourth surface or brand color. Cream + coral + dark navy is the complete system.
- Don't add hover animations beyond what the design system encodes. Only active/pressed states.

---

_This document is the single source of truth for Resonant. Every architectural decision, design token, AI prompt, data schema, animation specification, and user flow is documented here. A developer reading this document has everything needed to build the complete product without asking a single clarifying question._

_— Resonant Project Documentation v1.0_
