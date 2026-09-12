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
- **Last completed:** 05 Media primitives (2026-09-12) — VideoLoop + videoRegistry, LazyVimeo, Lightbox, bench at `/dev/media`; **iOS Safari autoplay check pending** (no device at hand)
- **In progress:** —
- **Next:** 06 Analytics
- **Blockers:** hero/project footage and the 9 prologue plates not yet sourced (see asset-pipeline.md → Placeholders / Prologue plates)
- **⏸ HUMAN gates open:** none yet (features 01–06 need no human asset)

## Progress

### Phase 1 — Foundation

- [x] 01 Scaffold, tokens, fonts
- [x] 02 Content model + data files
- [x] 03 Layout shell
- [x] 04 Motion foundation
- [x] 05 Media primitives (iOS Safari check outstanding)
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
| Hero loop + poster                  | demo        | 2026-09-12: developer's clip, 576p upscaled (soft) — replace with a 1080p master; poster = frame 0 |
| Project loops ×5                    | demo        | 2026-09-12: the same clip trimmed to 7 s in all 5 slugs, to exercise VideoLoop; not five projects |
| Stills                              | demo (1/5)  | 2026-09-12: 4 stills on `northern-light` only; other projects still missing               |
| Craft: storyboard SVG               | missing     | draw in Figma/Illustrator, export strokes     |
| Craft: contact-sheet frames ×6      | missing     |                                               |
| Craft: log/grade pair               | missing     | needs Resolve session                         |
| Reel poster + Vimeo ID              | ID demo / poster missing | Vimeo ID `1084537` (Big Buck Bunny, CC-BY) as demo; poster still missing |
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
- 2026-09-12 · Video lifecycle on IntersectionObservers, not ScrollTrigger; poster is a `next/image` under a transparent `<video>` · see architecture decisions. The `<video>` is not rendered under reduced motion or reduced data.
- 2026-09-12 · Demo assets: one 576p clip for hero + all 5 slugs, 4 stills on `northern-light`, Vimeo id `1084537` (Big Buck Bunny) · enough to exercise every media primitive; all to be replaced by footage the developer shoots.
- 2026-09-12 · Stills limit redefined as ≤ 2400 px on the longest side (`--max`), not width · a 9:16 frame capped by width alone is 10 MP and cannot meet 400 KB.

## Notes

_Workarounds, patterns, anything that differs from the context files. Also: the
keyboard walkthrough log from feature 22 and the Lighthouse numbers from 21._

### Asset provenance (demo material — swap before any real client ships)

| Asset | Source | Rights | Note |
| --- | --- | --- | --- |
| `video/hero/loop.*`, all 5 project loops + posters | `~/Documents/WebDev projects/reelframe-sources/hero/vide-1.mp4` (developer's folder) | developer's own material; repo is private (2026-09-12) — to be replaced by footage he shoots himself | Source is 1024×576, upscaled to 1080p — looks soft; one clip reused for hero + 5 slugs (7 s trims) to exercise the machinery. Replace with 1080p masters. Encoded `--crf-h264 26`. |
| `site.vimeoReelId` = `1084537` | "Big Buck Bunny", Blender Foundation, public on Vimeo | CC-BY 3.0 (Blender Foundation) | Demo reel for `LazyVimeo`; the developer has no Vimeo account. Verified via Vimeo oEmbed 2026-09-12. |
| `img/northern-light/still-01…04.jpg` | `reelframe-sources/stills/1.PNG, 2.PNG, 3.JPG, 4.JPEG` | developer's material; repo private — demo only, to be replaced | Yacht / skyline frames from another of the developer's projects. 01–02 `--quality 5`; 03 `--max 1600 --quality 5`; 04 `--max 1400 --quality 7` (full-frame glittering water is the JPEG worst case). |
