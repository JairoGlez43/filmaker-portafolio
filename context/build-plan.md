<!-- ═══════════════════════════════════════════════════════════
     EDIT LEVEL: PROJECT — Core Principle and the feature template are ENGINE
     (keep them). Phases/features are this project's. Work top to bottom.
     ═══════════════════════════════════════════════════════════ -->

# Build Plan

## Core principle (ENGINE — do not edit)

Build the full UI of a feature with mock data FIRST — verify it visually — then wire
real logic to it step by step. Every feature must be visible and testable before the
next one starts. No invisible backend-only phases. Ship the smallest thing that works.

## Feature template (ENGINE — copy this shape for each feature)

```
### NN Feature name
UI:    what the screen shows
Logic: what it does behind the screen
Done:  the concrete check that proves it works
Notes: events / assets / gotchas
```

## Project-specific rules

- A scene is not done until its **reduced-motion** variant is also done and checked.
  Both are part of the same feature, not a follow-up.
- **⏸ HUMAN gates.** A feature marked `⏸ HUMAN: <deliverable>` depends on something
  only the person can produce (footage, a Blender render, copy, a Vimeo upload). The
  agent builds the feature fully with the placeholder asset, verifies it, then writes
  the exact deliverable + spec reference into `progress-tracker.md` → Asset status
  and **stops**. It does not fabricate the asset or move past the gate silently. The
  person produces it in the Assets or Blender chat and returns; `asset-check` validates.
- **The 5-second rule** (`experience-script.md`) is a Done criterion for 07 and 08.

---

## Phase 1 — Foundation (nothing pretty yet, everything wired)

### 01 Scaffold, tokens, fonts

UI: A page rendering `{{FILMMAKER_NAME}}` in Inter Tight 600 on black, a mono
label, a body paragraph — proving the three fonts and base tokens.
Logic: `create-next-app` (TS, App Router, Tailwind v4, pnpm, `src/`), Prettier +
tailwind plugin, ESLint, `@theme` block from `ui-tokens.md` in `globals.css`,
`next/font` for the three families, `tsconfig` paths `@/*`, scripts
`typecheck`, `lint`, `format`.
Done: `pnpm typecheck && pnpm lint && pnpm build` green; Lighthouse fonts show no
layout shift; no Tailwind default palette class anywhere (`grep -r "text-gray"` = 0).
Notes: Record exact installed versions in `library-docs.md`. A `package.json` script
is declared in the feature that creates the file it runs — `content:check` in 02,
`asset:video` with the encoder script — never earlier, so no script in the repo ever
points at a file that does not exist.

### 02 Content model + data files

UI: A temporary `/dev/content` page (deleted in 21) listing every project, its
roles, and asset paths; broken paths in `error` color.
Logic: `src/types/content.ts`, `src/data/*.ts` with 5 fictional placeholder
projects, `src/lib/content.ts` accessors, `scripts/content-check.mjs`
(unique slugs, contiguous order, referenced files exist).
Done: `pnpm content:check` fails when a path is wrong and passes when fixed. The check
has two severities: structural errors (slug, order, non-canonical path, oversized file)
always fail; referenced files that do not exist yet are listed as the ⏸ HUMAN
deliverable list and fail unless `--allow-missing` is passed — the flag phases 1–2 run
with, since no asset exists before the Assets chat produces it.
Notes: Placeholder project titles must sound like working titles, not brands
(`Northern Light`, `Salt Roads`, `Interval`, `Ninety Seconds`, `Undertow`).

### 03 Layout shell

UI: `Nav` (name left, `WORK` / `REEL` / `CONTACT` anchors right, mono), `Footer`
(colophon), `Gutter`/`Section` primitives, 404 page as "missing reel" card.
Logic: `layout.tsx` with metadata defaults, `not-found.tsx`, `sitemap.ts`, `robots.ts`.
Done: Nav anchors scroll to the right sections; 404 renders for `/nope`; sitemap
lists `/` and every `/work/[slug]`.
Notes: Nav is one `sticky` bar from the top, transparent over the hero, `border-line` +
`bg-bg` once past 100 vh (not `fixed`, see ui-rules). `Gutter` was not built: `Section`
applies the gutter; add a `Gutter` primitive only when a non-section element needs it.

### 04 Motion foundation

UI: A dev-only test block: a box that reveals on scroll, a pinned box that scrubs
color, both switching correctly with the OS reduced-motion setting.
Logic: `MotionProvider` (GSAP plugin registration, Lenis, ticker sync, reduced-motion
bypass), `src/lib/motion.ts` (EASE/DUR), `Reveal`, `ScrubWords`, `Pin` wrappers.
Done: Toggle reduced motion in DevTools → Lenis off, scrubs become fades; no console
warnings; unmount/remount (navigate away and back) leaves zero ScrollTriggers
(`ScrollTrigger.getAll().length === 0`).
Notes: This is the riskiest foundation item. Read `library-docs.md` GSAP + Lenis sections first.

### 05 Media primitives

UI: `VideoLoop` (poster → loop, plays in view, pauses out), `LazyVimeo` (poster +
play → iframe), `Lightbox` (`<dialog>`), each on the dev page.
Logic: IntersectionObserver-driven `src` assignment, playing-count registry (max from
`constants.ts`), `Escape`/click-outside for dialog, `track()` on reel play.
Done: With 6 loops on the dev page, Network tab shows only near-viewport ones
loading; never > 2 playing; Vimeo iframe absent from DOM until click.
Notes: Test on real iOS Safari (autoplay policies) before marking done.

### 06 Analytics

UI: None visible; a dev console log in development.
Logic: `@vercel/analytics` in layout; `src/lib/analytics.ts` with the three events
from `code-standards.md`.
Done: Events appear in Vercel Analytics preview deployment.

## Phase 2 — The film (`/`)

### 07 Scene 00 Prologue — DOM version (v1)

UI: Nine `<img>` plates in a `perspective` container scattered in depth, each
showing a portfolio frame; they converge to a 3×3 contact sheet, pause, one
gets the `accent` outline, all close into the hero poster mosaic.
Logic: `Prologue` (client) with `Pin` 250 vh + one scrubbed timeline driving per-plate
`translate3d/rotateY/scale/opacity`; final state = 3×3 tiles of the hero poster
(`object-position` per tile, sizes from `src/data/prologue.ts`); cross-fade of
each plate's image to its tile in the last 15 %; sessionStorage skip flag;
not mounted under reduced motion; hands off to `Opening` on un-pin.
Done: Real footage visible at 0 % (screenshot); 100 % mosaic pixel-matches the hero
poster (overlay diff in DevTools); ≤ 4 s at normal wheel speed; skip and
reduced-motion paths open on scene 01; no horizontal overflow at 320 px.
Notes: ⏸ HUMAN: 9 plate frames per asset-pipeline §Prologue plates (agent uses
9 crops of the placeholder poster until then). This version stays in the repo
as the fallback when the Phase 5 sequence hasn't loaded.

### 08 Scene 01 Opening

UI: Hero loop, name reveal, meta line, scroll cue, parallax exit.
Logic: `VideoLoop` + `Reveal` + scrub timeline for exit.
Done: LCP element = poster ≤ 2.5 s mobile; loop plays without tap on iOS; text never overlaps a face in the chosen loop.
Notes: ⏸ HUMAN: hero loop + poster per asset-pipeline §Hero. Run `asset-check`.
Done also requires: prologue→loop hand-off shows no frame jump.

### 09 Scene 02 Statement

UI: Pinned sentence, words light up, last word turns `accent`.
Logic: `ScrubWords` splitting on spaces (no SplitText needed), pin 150 vh.
Done: ≤ 4 lines at 320 px; pin/unpin has no jump; reduced-motion shows lit sentence.
Notes: ⏸ HUMAN: the sentence itself (Script chat). Build with the placeholder.

### 10 Scene 03 Selected Work

UI: Sticky stack-and-cover cards, index, title, badges, hover un-dim.
Logic: Cards from `getProjects()`, `VideoLoop` per card, links to `/work/[slug]`.
Done: Scene video ≤ 15 MB total; only in-view loops load; keyboard focus visible on every card; `work_open` fires on click.
Notes: ⏸ HUMAN: 4–6 project loops + posters + titles/clients/years/roles.

### 11 Scene 04 Craft — Direction & Edit beats

UI: Storyboard overlay strokes; timeline strip with scrubbing playhead + contact sheet.
Logic: Two pinned scrub timelines; SVG stroke `drawSVG`-like via `strokeDashoffset`.
Done: Both beats scrub smoothly at 60 fps; captions legible; reduced motion = static columns.
Notes: ⏸ HUMAN: direction still, storyboard.svg, 6 contact-sheet frames.

### 12 Scene 04 Craft — Color beat (grade wipe)

UI: Ungraded/graded matched stills, moving wipe line, `LOG`/`GRADE` labels.
Logic: `GradeWipe` component: `clip-path: inset(0 X% 0 0)` scrubbed; both images
`next/image` `fill`, identical dimensions from data.
Done: No visible seam or misalignment at any wipe position; reduced motion = 50/50 split.
Notes: If the filmmaker can't supply the pair, produce one in Resolve (Assets & Tools chat).

### 13 Scene 05 Showreel

UI: Full-bleed poster, play button, label, Vimeo on click, close.
Logic: `LazyVimeo`, `track('reel_play')`, `Escape` closes.
Done: No iframe before click; sound plays after click; keyboard operable end to end.
Notes: ⏸ HUMAN: Vimeo upload (unlisted) + reel poster frame.

### 14 Scene 06 Clients marquee

UI: Infinite text marquee, hover pause.
Logic: Duplicated track, GSAP `xPercent` loop, `timeScale` nudged by Lenis velocity.
Done: No seam; no CLS when fonts load; reduced motion = static wrapped row.

### 15 Scene 07 About

UI: Portrait + three lines + mono list.
Logic: `Reveal` variants.
Done: Descriptive alt; zero CLS; stacks correctly at 320 px.
Notes: ⏸ HUMAN: portrait (B&W) + bio lines.

### 16 Scene 08 Contact + footer

UI: Giant email, socials, colophon.
Logic: `mailto:`, `track('contact_click')`, fluid type via `clamp()` token.
Done: Email fits one line ≥ 768 px, wraps cleanly below; event fires once per click.

## Phase 3 — Case study (`/work/[slug]`)

### 17 Case-study page skeleton (scenes 09–11)

UI: Title card, lazy hero video, credits table, back link.
Logic: `generateStaticParams`, `generateMetadata` from project data, `getProject(slug)`.
Done: All 5 placeholder projects build statically; unknown slug → 404; metadata title/description correct.
Notes: ⏸ HUMAN per project: Vimeo id, credits, 4–8 stills with alt text.

### 18 Stills gallery + lightbox (scene 12)

UI: Two-column grid, hover lift, lightbox.
Logic: `Lightbox` from 05; images sized from data (no CLS).
Done: `Escape`, click-outside and close button all work; focus returns to the clicked still.

### 19 Next project hand-off (scene 13)

UI: Bottom strip with next project poster and title.
Logic: `getNextProject(slug)` wraps around; fade transition on navigate.
Done: Last project links to first; `work_open` fires with `from: slug`.

### 20 Per-project OG image

UI: 1200×630 card: title, client · year, roles, on black with the poster dimmed.
Logic: `opengraph-image.tsx` with `ImageResponse`, fonts loaded from `public/fonts` or fetched at build.
Done: Sharing `/work/[slug]` in a validator shows the right image for each project.

## Phase 4 — Polish & ship

### 21 Performance pass

UI: None (dev page and dev blocks removed here).
Logic: Lighthouse mobile ≥ 90 across the board; `preload` hero poster; check `will-change` usage; audit bundle (`@next/bundle-analyzer` dev-only, remove after).
Done: Lighthouse report committed to `docs/lighthouse/` with the numbers.

### 22 Accessibility pass

UI: Visible focus rings everywhere, skip link, correct heading order.
Logic: axe DevTools = 0 critical; `aria-hidden` on decorative video; reduced-motion QA of every scene in one sitting.
Done: Full keyboard walkthrough from Nav to Contact recorded in `progress-tracker.md` Notes.

### 23 Deploy + README

UI: Live URL; repo README with a GIF/short clip of the site, the stack, and a pointer to `context/`.
Logic: Vercel project, `main` → production, PRs → previews, `NEXT_PUBLIC_SITE_URL` set.
Done: Production URL returns the site; README renders on GitHub; `context/` linked from README as "how this was built with an agent".

## Phase 5 — Prologue, rendered (Blender → frame sequence)

Same script as feature 07, different renderer. Starts only when Phases 1–4 are shipped
and the person has the Blender scene working (Blender chat). Nothing in scenes 01+
changes.

### 24 Frame sequencer

UI: A dev page: a `<canvas>` scrubbed by scroll through a test sequence of 150
numbered placeholder frames (generated by a script), progress readout.
Logic: `FrameSequence` (client): sizes canvas to viewport × DPR (cap 1.5), preloads
frames in priority order (every 8th, then every 4th, then all), draws the
nearest loaded frame with `drawImage` (cover-fit), scrubbed via ScrollTrigger;
chooses `desktop`/`mobile` set by `gsap.matchMedia`; falls back to the DOM
prologue (07) if the first frame isn't ready within `LIMITS.seqFirstFrameMs`.
Done: No dropped frames while scrubbing at 60 fps on a mid-range phone; memory stable
(frames decoded once, held as `ImageBitmap`); reduced motion = not mounted.
Notes: Pure canvas API, no library. Read `asset-pipeline.md` §Prologue sequence.

### 25 Blender sequence integration

UI: The real render replaces the test frames; the last frame equals the hero poster.
Logic: `src/data/prologue.ts` gains `sequence: { count, pattern, sizes }`; `Prologue`
mounts `FrameSequence` when the sequence assets exist and DOM plates otherwise.
Done: Overlay diff of frame 150 vs hero poster shows no visible difference; total
sequence weight within limits; hand-off to the loop shows no jump; Lighthouse
mobile performance still ≥ 90 (sequence loads lazily after LCP).
Notes: ⏸ HUMAN: Blender scene (9 textured planes, convergence + close animation,
DOF, rim light), rendered as PNG sequence at both aspect ratios, converted with
`pnpm asset:seq`. The Blender chat owns the tutorial; `asset-check` validates.

### 26 Prologue polish

UI: Motion blur and depth of field tuned; the accent outline decision from the
Script chat applied; loading behavior invisible on good connections.
Logic: `preload` hints for the first 8 frames after LCP; sessionStorage skip kept.
Done: A/B screenshot set (DOM v1 vs rendered v2) committed to `docs/prologue/` with
a short note on what the render adds — README material.

---

## Feature count

| Phase                | Features                            | Range |
| -------------------- | ----------------------------------- | ----- |
| 1 Foundation         | 6                                   | 01–06 |
| 2 The film           | 10                                  | 07–16 |
| 3 Case study         | 4                                   | 17–20 |
| 4 Polish & ship      | 3                                   | 21–23 |
| 5 Prologue, rendered | 3                                   | 24–26 |
| **Total**            | **26** (23 to first public release) |       |

## Sequencing notes

- 04 and 05 gate everything in Phase 2. Do not start 07 with a half-working motion foundation.
- 12 (grade wipe) depends on an asset that may not exist yet; if blocked, build 13–16 first and return.
- 20 can run in parallel with Phase 3 if a second session is available.
- Phase 5 never blocks a release: the DOM prologue (07) is a complete, shippable scene.
  Blender work happens in parallel with Phases 3–4, in the Blender chat.
