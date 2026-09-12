# REELFRAME — agent entry point

Cinematic portfolio site for a filmmaker / editor / colorist. Next.js 16 (App Router),
Tailwind v4, GSAP + ScrollTrigger, Lenis, deployed on Vercel. Content is typed data in
`src/data/`. No CMS, no database, no auth in v1.

This file is the authority on HOW to work in this repo. The `context/` folder is the
authority on WHAT to build and HOW it must look. Read before you write.

## Read order (every session)

1. `context/progress-tracker.md` — where we are, what's next.
2. `context/build-plan.md` — the feature you're about to build, its Done check.
3. `context/experience-script.md` — the scene you're building and what it must feel like.
4. `context/architecture.md` + `context/code-standards.md` — where code goes, how it's shaped.
5. `context/ui-tokens.md` + `context/ui-rules.md` + `context/motion-rules.md` — the visual and motion system.
6. `context/ui-registry.md` — reuse before you build.
7. `context/asset-pipeline.md` — only when a feature touches video/images.
8. `context/library-docs.md` — only when a feature touches a third-party library.
9. `memory.md` — hard-won lessons and the resume snapshot.

Skim, don't memorize. Re-open the specific file when the feature needs it.

## Session protocol

- **Start:** read `progress-tracker.md`. If a snapshot exists in `memory.md`, run the
  `remember` skill (restore). Say in one line what you're going to build.
- **Before any multi-file feature:** run the `architect` skill. Wait for approval.
- **Build:** UI with mock data first, verify visually in the browser, then wire logic.
  One feature at a time. Do not start the next feature until the current one passes
  its Done check.
- **⏸ HUMAN gates:** when a feature needs something only the person can make (footage,
  a Blender render, copy, a Vimeo upload), build it completely with the placeholder,
  verify it, write the exact deliverable into `progress-tracker.md` → Asset status,
  and stop. Say plainly: "Blocked on you: <deliverable> — see <file §section>." Never
  invent the asset, never skip the gate.
- **After UI work:** run the `imprint` skill (update `ui-registry.md`).
- **After adding a video/image asset:** run the `asset-check` skill.
- **Before calling anything done:** run the `review` skill. `pnpm typecheck`,
  `pnpm lint`, `pnpm build` must all pass. Never claim green without running them.
- **End:** update `progress-tracker.md`. If mid-feature, run `remember` (save).
- **Commits are the developer's.** The agent never runs `git commit` or `git push`. When a
  feature passes `review`, the agent ends its report with a ready-to-paste commit message
  in English (subject + bullets) and stops.

## The STOP rule

If a fix does not work on the **first** corrective attempt, STOP. Do not try a second
variation. Switch to the `recover` skill and diagnose from evidence. Blind retries
burn sessions and bury the real cause.

## Commands

| Task                | Command                                                   |
| ------------------- | --------------------------------------------------------- |
| Dev server          | `pnpm dev`                                                |
| Typecheck           | `pnpm typecheck` (`tsc --noEmit`)                         |
| Lint                | `pnpm lint`                                               |
| Production build    | `pnpm build`                                              |
| Encode a video loop | `pnpm asset:video <input> <slug>` (see asset-pipeline.md) |
| Deploy              | push to `main` → Vercel                                   |

Package manager is **pnpm** only.

## Absolute rules (short list; full versions live in the context files)

- Never hardcode a color, font, radius, easing or duration in a component. Tokens only.
- Never fetch data inside a component. Content comes from `src/data/*` via `src/lib/content.ts`.
- `'use client'` only in `src/components/motion/*`, `src/components/prologue/*` and interactive leaf components. Pages and sections stay Server Components.
- Every GSAP/Lenis instance is created inside `useGSAP` or a `useEffect` with cleanup. No global leaks.
- Every animation respects `prefers-reduced-motion` via `gsap.matchMedia()`.
- Every loop goes through `VideoLoop`: a `next/image` poster is always visible first, the `<video>` is `muted`, `playsInline`, `loop`, `preload="metadata"`, `aria-hidden`, registered for the ≤ 2 decode budget, and its files are ≤ the size limits in `asset-pipeline.md`. Never a bare `<video>`.
- Never install a package without checking `code-standards.md` → Approved dependencies. Ask first.
- Real footage must be visible within 5 s of landing (`experience-script.md`). No change to scenes 00–01 may break this.
- Never invent a placeholder client fact (name, awards, clients). Use the `{{PLACEHOLDER}}` values in `src/data/site.ts` and leave them visibly generic.
- Next.js 16 APIs are newer than your training data. Read `library-docs.md` and the official docs (`nextjs.org/docs/...` with `.md` appended) before using routing, caching, `next/image`, `next/font` or metadata APIs.

## Skills available

`architect` · `imprint` · `review` · `recover` · `remember` · `asset-check`
(all under `.claude/skills/`). Each one says when to trigger it in its description.

## Next.js 16 agent rules

Maintained by `next dev`, read alongside this file:

@AGENTS.md
