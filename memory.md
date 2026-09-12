<!-- ═══════════════════════════════════════════════════════════
     EDIT LEVEL: ENGINE structure — keep the three sections. Written by the
     `recover` skill (lessons), the `architect`/`remember` skills (decisions) and
     the `remember` skill (snapshot). Read at the start of every session.
     ═══════════════════════════════════════════════════════════ -->

# Memory

## Hard-won lessons

_Cause → fix. Only things that cost real time. One line each, newest first._

- 2026-09-12 · Next 16 `next/image` only serves the qualities listed in `images.qualities` (default `[75]`) → never pass a `quality` prop unless the config allows it.
- 2026-09-12 · A pre-hydration inline script that sets an attribute on `<html>` (`data-js`) triggers "attributes of the server rendered HTML didn't match" → `suppressHydrationWarning` on `<html>` only (the next-themes pattern); never on children.
- 2026-09-12 · `eslint-config-next` 16 ships the React Compiler rule `react-hooks/set-state-in-effect`: a `setState` directly in an effect body fails lint → publish external instances (Lenis, observers) with `useSyncExternalStore`, keep effects for side effects only.
- 2026-09-12 · GSAP `from()` on an element whose start state is already set by CSS reads the hidden value as the *end* → always `fromTo()` with explicit start values when the CSS defines the start state.
- 2026-09-11 · Node warns `MODULE_TYPELESS_PACKAGE_JSON` when a `.mjs` script imports `.ts` data files → `"type": "module"` in `package.json`; Next 16, tsc and ESLint are all fine with it.
- 2026-09-11 · Moving the project folder or reinstalling deps leaves a stale Turbopack cache: `next/font` then fails with `Can't resolve '@vercel/turbopack-next/internal/font/google/font'` → stop the dev server, delete `.next` entirely, restart. Not a code or network problem.
- (seed) GSAP + Lenis: pins jump if `ScrollTrigger.refresh()` runs before fonts load → refresh once on `document.fonts.ready` in `MotionProvider`.
- (seed) iOS Safari refuses muted autoplay when the file has an audio track → always encode with `-an`.
- (seed) `next/image fill` without `sizes` downloads the largest candidate → `sizes` is mandatory on every `fill` image.

## Decisions log

_Durable choices that a future session must not re-open without a reason. Date · decision · why._

- 2026-09 · Stack: Next.js 16 static + Tailwind v4 + GSAP/ScrollTrigger + Lenis, on Vercel · chosen by the developer for portfolio relevance; static output covers all v1 needs.
- 2026-09 · No WebGL/3D in v1 · motion budget goes to video + scroll choreography; keeps mobile fast and scope shippable.
- 2026-09 · All docs and code in English · repo is a public portfolio piece.
- 2026-09 · Prologue = frames assembling into the hero image; DOM version first, Blender frame sequence as Phase 5 · editor's story, 5-second rule, 9:16-safe, seam-free; a release never waits on Blender.
- 2026-09 · The abstract-camera prologue was considered and rejected · it demonstrates Blender more than it tells the filmmaker's story; kept as a Phase 6 candidate for the Craft scene only.
- 2026-09 · Client is a placeholder until confirmed · every identity fact lives in `src/data/site.ts`; fictional projects flagged `fictional: true`.
- 2026-09-11 · Tooling as native as the framework ships it · the developer asked for nothing fragile; stock ESLint config, no type-checked lint layer, and a `package.json` script is only declared once the file it runs exists.
- 2026-09-11 · Typography: Inter Tight for display and body (600 hero / 400 rest, no italic), JetBrains Mono provisional for labels · developer's pick on `/dev/type` after two rounds (serif → sans); wanted one family, modern, cinematic, cheap on screen. Re-judge the mono against it before feature 03.

## Snapshot for resuming a multi-session feature

_Single slot. Overwritten on every `remember save`. Empty means: start from
`progress-tracker.md` → Next._

**Feature:** —
**Goal / approach:** —
**Done so far:** —
**In progress / very next step:** —
**Blockers / open questions:** —
**Branch / uncommitted work:** —
