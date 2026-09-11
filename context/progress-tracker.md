<!-- ═══════════════════════════════════════════════════════════
     EDIT LEVEL: ENGINE structure — keep the layout. The checklist mirrors
     build-plan.md. The agent updates this file after every completed feature.
     ═══════════════════════════════════════════════════════════ -->

# Progress Tracker

Anyone (human or agent) reading this should instantly know what's done, in progress,
and next. Update after every completed feature. A feature is checked only after the
`review` skill passed and its reduced-motion variant is verified.

## Current status

- **Phase:** 1 — Foundation
- **Last completed:** 04 Motion foundation (2026-09-12) — MotionProvider (GSAP + Lenis), Reveal, Pin/usePin, ScrubWords, bench at `/dev/motion`; browser checks (reduced motion toggle, trigger count 0 after unmount) pending the developer's pass
- **In progress:** —
- **Next:** 05 Media primitives
- **Blockers:** hero/project footage and the 9 prologue plates not yet sourced (see asset-pipeline.md → Placeholders / Prologue plates)
- **⏸ HUMAN gates open:** none yet (features 01–06 need no human asset)

## Progress

### Phase 1 — Foundation

- [x] 01 Scaffold, tokens, fonts
- [x] 02 Content model + data files
- [x] 03 Layout shell
- [x] 04 Motion foundation
- [ ] 05 Media primitives
- [ ] 06 Analytics

### Phase 2 — The film (`/`)

- [ ] 07 Scene 00 Prologue — DOM version (v1)
- [ ] 08 Scene 01 Opening
- [ ] 09 Scene 02 Statement
- [ ] 10 Scene 03 Selected Work
- [ ] 11 Scene 04 Craft — Direction & Edit
- [ ] 12 Scene 04 Craft — Color (grade wipe)
- [ ] 13 Scene 05 Showreel
- [ ] 14 Scene 06 Clients marquee
- [ ] 15 Scene 07 About
- [ ] 16 Scene 08 Contact + footer

### Phase 3 — Case study (`/work/[slug]`)

- [ ] 17 Case-study page skeleton
- [ ] 18 Stills gallery + lightbox
- [ ] 19 Next project hand-off
- [ ] 20 Per-project OG image

### Phase 4 — Polish & ship

- [ ] 21 Performance pass
- [ ] 22 Accessibility pass
- [ ] 23 Deploy + README ← first public release

### Phase 5 — Prologue, rendered (after release; Blender in parallel)

- [ ] 24 Frame sequencer
- [ ] 25 Blender sequence integration
- [ ] 26 Prologue polish

## Asset status

The exact, always-current deliverable list with canonical paths and size limits is the
output of `pnpm content:check` (60 files as of 2026-09-11). This table is the summary.

| Asset                               | Status      | Source / note                                 |
| ----------------------------------- | ----------- | --------------------------------------------- |
| Prologue plates ×9                  | missing     | choose with Script chat; same grade as hero   |
| OG default image                    | missing     | `public/og/default.jpg`, 1200×630             |
| Hero loop + poster                  | missing     | poster = loop frame 0 = prologue final mosaic |
| Project loops ×5                    | missing     | placeholders: own footage or CC0              |
| Stills                              | missing     |                                               |
| Craft: storyboard SVG               | missing     | draw in Figma/Illustrator, export strokes     |
| Craft: contact-sheet frames ×6      | missing     |                                               |
| Craft: log/grade pair               | missing     | needs Resolve session                         |
| Reel poster + Vimeo ID              | missing     |                                               |
| Portrait                            | missing     |                                               |
| Blender scene (Phase 5)             | not started | Blender chat; 9 planes, DOF, rim light        |
| Prologue sequence d/ + m/ (Phase 5) | missing     | 150 WebP each; `pnpm asset:seq`               |

## Decisions made during build

_Append: date · decision · why. Keeps them from being re-litigated._

- 2026-09-11 · `content:check` separates structural errors from missing files, with `--allow-missing` for phases 1–2 · a check that passed with an empty `public/` would lie; one that always failed would be ignored. Missing files print as the ⏸ HUMAN deliverable list.
- 2026-09-11 · `Site.assets` added to the data model (hero loop, reel poster, portrait, OG) · those assets belong to no project and needed a typed home for the check and the scenes.
- 2026-09-11 · `/dev/content` is the one `src/` file that touches `node:fs` · it is a dev inspector deleted in 21, not part of the site.
- 2026-09-11 · Nav is one sticky bar from the top, `stuck` state (border + `bg-bg`) after 100 svh via IntersectionObserver · CSS cannot switch absolute→sticky mid-scroll; `fixed` is banned and a duplicate nav hurts a11y. Approved by the developer in the 03 plan.
- 2026-09-11 · `Gutter` primitive not built · `Section` owns the gutter; nothing else needed it yet.
- 2026-09-11 · Eyebrow / Mono-label class strings are inlined 4–5× and recorded as Patterns in `ui-registry.md` · promote to `ui/Eyebrow` + `ui/MonoLabel` when scene 07/08 needs them again — not before, to keep 03 small.
- 2026-09-12 · Hydration flash solved with CSS start states under `html[data-js]`, not `dynamic({ ssr: false })` · the developer asked to fix the flash; removing content from the HTML would cost LCP/SEO/no-JS. See motion-rules → No flash.
- 2026-09-12 · `gsap-skills` vendor skill not installed · official docs read directly; an external installer is not worth adding until a scene needs an API the notes lack.

## Notes

_Workarounds, patterns, anything that differs from the context files. Also: the
keyboard walkthrough log from feature 22 and the Lighthouse numbers from 21._
