---
name: review
description: >
  Rigorous self-review of recent work before marking a feature done, before a merge
  or demo, or whenever something "feels off". Use when the user says "review", "check
  this", "is this ready", or before ticking a box in context/progress-tracker.md.
  Always run a review before calling work finished — a fresh critical pass catches
  token leaks, missing reduced-motion variants, leaked ScrollTriggers and half-done
  states that are cheaper to fix now than later.
---

# Review — verify before you ship

Inspect the recent changes as a careful senior engineer seeing them for the first
time. Be honest; find real problems.

## When to use

- Before marking any feature done in `progress-tracker.md`.
- Before a merge to `main` or a demo.
- When output quality dropped or something feels wrong.

## Steps

1. **List what changed** this session (files and the feature number).

2. **Run the mechanical guards** and paste the results:

   ```bash
   pnpm typecheck && pnpm lint && pnpm build
   pnpm content:check
   grep -rnE "#[0-9a-fA-F]{3,8}|text-gray|bg-gray|text-white|bg-black|bg-white" src/components src/app --include=*.tsx
   grep -rn "position: fixed\|fixed " src/components --include=*.tsx | grep -v "sticky"
   grep -rln "from 'gsap'\|from 'lenis'" src --include=*.tsx --include=*.ts | grep -v "src/components/motion/"
   grep -rn "TODO\|FIXME\|console.log" src --include=*.ts --include=*.tsx
   ```

   Every grep must return nothing (except `console.info` in `analytics.ts`). Do not
   claim success without running them.

3. **Check against the project's own rules:**
   - Tokens: `ui-tokens.md` only; no arbitrary values (`bg-[...]`) unless a token doesn't exist — and then the token should have been added.
   - Registry: every new/changed component recorded (`imprint` skill).
   - Standards: naming, no `any`, Server/Client split, `@/` alias, result shape, events from `analytics.ts`, constants from `constants.ts`.
   - UI rules: focus-visible ring, states (loading/empty/error), `aria-hidden` on loops, `alt` on images, `100svh` not `100vh`.
   - Motion rules: pattern from the table, eases/durations from tokens, tweens inside `useGSAP`, `gsap.matchMedia` branch present, no timer-based sequencing.
   - Libraries: APIs match current official docs, not guessed (`params` awaited, `next/image sizes`, GSAP registration).

4. **Check the experience, in the browser:**
   - The scene matches its `experience-script.md` entry: purpose, on-screen, motion, Done.
   - **Reduced motion ON** (DevTools → Rendering → emulate): scene still reads; no pins; no autoplay.
   - Mobile 390 px and desktop 1440 px; then 320 px quickly.
   - Navigate away and back: `ScrollTrigger.getAll().length` returns to the expected count; no console warnings.
   - Video: only near-viewport loops loaded (Network), ≤ 2 playing, posters present.
   - Scroll the whole page once with the Performance panel recording: no long tasks > 100 ms.

5. **Check correctness & completeness:**
   - Does it meet the feature's Done line in `build-plan.md`?
   - Half-implemented paths, dead code, unhandled promise from `video.play()`?
   - Edge cases: empty `projects`, missing `vimeoId`, very long title, slow network (throttle), keyboard-only.

6. **Report findings** grouped: 🔴 must-fix · 🟡 should-fix · 🟢 nice-to-have. Fix the
   🔴 items now, each as a small step. Re-run step 2 after fixing.

7. **Update state:** tick the feature in `progress-tracker.md`, update Current status,
   add any decision or workaround to Decisions / Notes.

## Rules

- Do not rubber-stamp. If nothing is wrong, say specifically what you checked.
- If a fix fails once, switch to the `recover` skill. Do not try a second guess here.
- A feature without a verified reduced-motion variant is not done.
