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
- **Last completed:** 01 Scaffold, tokens, fonts (2026-09-11) — typography confirmed by the developer on `/dev/type`: Inter Tight (display + body) + JetBrains Mono (provisional)
- **In progress:** —
- **Next:** 02 Content model + data files
- **Blockers:** hero/project footage and the 9 prologue plates not yet sourced (see asset-pipeline.md → Placeholders / Prologue plates)
- **⏸ HUMAN gates open:** none yet (features 01–06 need no human asset)

## Progress

### Phase 1 — Foundation

- [x] 01 Scaffold, tokens, fonts
- [ ] 02 Content model + data files
- [ ] 03 Layout shell
- [ ] 04 Motion foundation
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

| Asset                               | Status      | Source / note                                 |
| ----------------------------------- | ----------- | --------------------------------------------- |
| Prologue plates ×9                  | missing     | choose with Script chat; same grade as hero   |
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

## Notes

_Workarounds, patterns, anything that differs from the context files. Also: the
keyboard walkthrough log from feature 22 and the Lighthouse numbers from 21._
