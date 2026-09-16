<!-- ═══════════════════════════════════════════════════════════
     EDIT LEVEL: ENGINE structure — keep the layout. The checklist mirrors
     build-plan.md. The agent updates this file after every completed feature.
     ═══════════════════════════════════════════════════════════ -->

# Progress Tracker

Anyone (human or agent) reading this should instantly know what's done, in progress,
and next. Update after every completed feature. A feature is checked only after the
`review` skill passed and its reduced-motion variant is verified.

## Current status

- **Phase:** 2 — The film (`/`) — Phase 1 complete 2026-09-12
- **Last completed:** Demo-content pass (2026-09-15) — every `{{PLACEHOLDER}}` in `src/data/*` replaced by clearly fictional demo facts ("Adriana Villates", fictional clients/credits/summaries) so the site can be judged visually; Nav gets a top scrim + `text-primary` over the hero (was unreadable on a bright sky); reel id swapped to a Vimeo embed that plays (`22439234`), reel poster + OG image generated from the developer's footage; `pnpm asset:portrait` added for the About photo
- **In progress:** —
- **Next:** 20 Per-project OG image (`opengraph-image.tsx` with `ImageResponse`) · deferred until the developer's assets exist: 07 Prologue (9 plates), 11–12 Craft (direction still, storyboard SVG, 6 frames, log/grade pair), stills for 4 projects
- **19 done 2026-09-16:** Next-project strip on every case study (wraps undertow → northern-light), `work_open {from: 'next'}`, page dissolve via native View Transitions (`<ViewTransition>` + `::view-transition` CSS, opacity only). Browser check: the fade in Chromium/Safari/Firefox; instant elsewhere
- **18 done 2026-09-16:** `media/StillsGallery` + `scenes/12-Stills` on `/work/[slug]` (northern-light shows its 4 stills; the other four projects have `stills: []` and omit the gallery instead of rendering broken images)
- **Phase 3 started 2026-09-15:** 17 Case-study skeleton done — `/work/[slug]` prerendered for the 5 projects (`dynamicParams = false` → unknown slugs are a static 404), title card, poster hero (no demo project has a `vimeoId`), credits table; per-project metadata (title template, summary, poster as OG until 20). The Selected Work cards no longer land on the 404. Housekeeping: the portrait source photo moved out of `public/` into `reelframe-sources/portrait/`
- **Blockers:** `NEXT_PUBLIC_SITE_URL` not set in Vercel (production sitemap lists localhost) · iOS Safari autoplay check for 05 outstanding
- **⏸ HUMAN gates open:** 07 needs the 9 prologue plates (`public/img/prologue/plate-01…09.jpg`, same grade family as the hero poster) · demo hero loop/poster exist but are 576p — see Asset status

## Progress

### Phase 1 — Foundation

- [x] 01 Scaffold, tokens, fonts
- [x] 02 Content model + data files
- [x] 03 Layout shell
- [x] 04 Motion foundation
- [x] 05 Media primitives (iOS Safari check outstanding)
- [x] 06 Analytics (dashboard check pending: enable Web Analytics; custom events need Pro)

### Phase 2 — The film (`/`)

- [ ] 07 Scene 00 Prologue — DOM version (v1)
- [x] 08 Scene 01 Opening (built 2026-09-12 on the demo hero; LCP/iOS/hand-off checks open)
- [x] 09 Scene 02 Statement (placeholder sentence; 320 px line-count check in the browser)
- [x] 10 Scene 03 Selected Work (demo loops; cards 404 until 17)
- [ ] 11 Scene 04 Craft — Direction & Edit
- [ ] 12 Scene 04 Craft — Color (grade wipe)
- [x] 13 Scene 05 Showreel (demo reel id `22439234` + demo poster frame; own reel/poster pending)
- [x] 14 Scene 06 Clients marquee (fictional demo names)
- [x] 15 Scene 07 About (demo portrait + demo bio lines)
- [x] 16 Scene 08 Contact + footer (fictional demo email/URLs; Done "one line ≥ 768" revised, see build-plan)

### Phase 3 — Case study (`/work/[slug]`)

- [x] 17 Case-study page skeleton (5 static pages; demo projects are poster-only — no Vimeo ids)
- [x] 18 Stills gallery + lightbox (only northern-light has stills; others omit the gallery)
- [x] 19 Next project hand-off (View Transitions dissolve)
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
| OG default image                    | demo        | 2026-09-15: hero poster cropped to 1200×630 (60 KB) — replace with a designed card |
| Hero loop + poster                  | demo        | 2026-09-12: developer's clip, 576p upscaled (soft) — replace with a 1080p master; poster = frame 0 |
| Project loops ×5                    | demo        | 2026-09-12: the same clip trimmed to 7 s in all 5 slugs, to exercise VideoLoop; not five projects |
| Stills                              | demo (1/5)  | 2026-09-12: 4 stills on `northern-light` only; other projects still missing               |
| Craft: storyboard SVG               | missing     | draw in Figma/Illustrator, export strokes     |
| Craft: contact-sheet frames ×6      | missing     |                                               |
| Craft: log/grade pair               | missing     | needs Resolve session                         |
| Reel poster + Vimeo ID              | demo        | 2026-09-15: ID `22439234` ("The Mountain", public embed — `1084537` Big Buck Bunny never loads); poster = frame 3.5 s of the demo loop (124 KB) |
| Portrait                            | demo        | 2026-09-15: `public/profile_pic/adriana-pp.jpeg` → `pnpm asset:portrait` → 576×720 B&W, 39 KB (source is 1080×720, so under the 1200×1500 target; reshoot 4:5 for a sharper large render) |
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
- 2026-09-12 · Phase 2 starts with 08 (Opening), 07 (Prologue) deferred until the developer's own plates exist · 08 only needs the demo hero; 07 built on placeholder crops would be throwaway.
- 2026-09-12 · Scene 01 exit is one scene-specific wrapper (`OpeningExit`) rather than generic `Parallax` + `ScaleIn` · both layers ride the same scroll; one timeline, one ScrollTrigger. A generic `Parallax` is created the day a second scene (About, 0.85) needs it.
- 2026-09-16 · Page fade between case studies uses React's native `<ViewTransition>` + CSS, tagged per link · zero JS of ours, degrades to an instant navigation where unsupported; only the Next strip carries the `dissolve` type so back/forward and home links stay instant. Blur from the docs' recipe rejected (motion-rules).
- 2026-09-16 · Projects without shot stills carry `stills: []`, not placeholder paths · scenes cannot check the disk; placeholder paths rendered broken images on four case studies. Same principle as `reelPoster`/`portrait`: the data says "not yet", the gallery is omitted. The 4–8 stills per project stay listed as deliverables in Asset status.
- 2026-09-15 · `/work/[slug]` uses `dynamicParams = false` · every case study is prerendered from `getProjects()`; an unknown slug is a static 404 (the "missing reel" card) with nothing rendered at request time — consistent with "static only".
- 2026-09-15 · Title card's "holds 0.8 s, fades into the hero" (§09) is scroll-driven, not a timer · motion-rules allow timers only for the scroll cue and the marquee; the title card is the first viewport, the hero the next.
- 2026-09-15 · Source files never sit in `public/` · the demo pass had left `public/profile_pic/adriana-pp.jpeg` there (it would be served publicly); moved to `reelframe-sources/portrait/`. `public/` holds pipeline outputs only.
- 2026-09-15 · Social glyphs are inline Simple Icons paths (CC0), not an icon library · the developer asked for icons; Lucide's brand icons are deprecated and the spec bans icon libraries; three inline `<path>`s cost nothing. `ui-rules` updated.
- 2026-09-15 · Contact email stays `text-display-xl` although it cannot fit one line at 768 px · §08's "largest text on the page" outranks the Done's line count; it wraps with `overflow-wrap: anywhere`.
- 2026-09-15 · `StaggerChars` animates opacity, not color · "transform and opacity only" + contrast-not-hue accessibility rule; visually identical to muted → primary.
- 2026-09-15 · `SiteAssets.reelPoster` is `string | null`, null until the frame exists · a typed "not yet" beats a path to a missing file: `LazyVimeo` renders its surface block, `content:check` still lists the canonical path as a deliverable.
- 2026-09-15 · Marquee reduced-motion variant is CSS (`motion-reduce:` hides the duplicate track and wraps the first), not a markup switch · identical server/client markup, no hydration jump, no tween created.
- 2026-09-14 · `StickyStack` is pure CSS in `scenes/parts/`, not a GSAP wrapper in `motion/` · stack-and-cover is `position: sticky`; no JS, works under reduced motion, nothing to clean up.
- 2026-09-14 · `ui/TrackLink` is the one `'use client'` leaf in `ui/` · Server Component scenes cannot call `track()` on click; a stateless link wrapper is the smallest honest client boundary. Added to the allowed list in code-standards.
- 2026-09-14 · `Eyebrow`, `MonoLabel`, `Badge` promoted to `ui/` at the 4th use, as the registry rule said · `Nav`/`Footer`/`SkipLink` keep inline classes (link states).
- 2026-09-12 · Analytics built as specified although Vercel custom events require a Pro plan · the code is identical on every plan; page views work on Hobby; the three events are emitted and become visible the day the plan allows it. `track()` also logs to the console outside production so the wiring is verifiable locally.

## Notes

_Workarounds, patterns, anything that differs from the context files. Also: the
keyboard walkthrough log from feature 22 and the Lighthouse numbers from 21._

### Asset provenance (demo material — swap before any real client ships)

| Asset | Source | Rights | Note |
| --- | --- | --- | --- |
| `video/hero/loop.*`, all 5 project loops + posters | `~/Documents/WebDev projects/reelframe-sources/hero/vide-1.mp4` (developer's folder) | developer's own material; repo is private (2026-09-12) — to be replaced by footage he shoots himself | Source is 1024×576, upscaled to 1080p — looks soft; one clip reused for hero + 5 slugs (7 s trims) to exercise the machinery. Replace with 1080p masters. Encoded `--crf-h264 26`. |
| `site.vimeoReelId` = `1084537` | "Big Buck Bunny", Blender Foundation, public on Vimeo | CC-BY 3.0 (Blender Foundation) | Demo reel for `LazyVimeo`; the developer has no Vimeo account. Verified via Vimeo oEmbed 2026-09-12. |
| `img/northern-light/still-01…04.jpg` | `reelframe-sources/stills/1.PNG, 2.PNG, 3.JPG, 4.JPEG` | developer's material; repo private — demo only, to be replaced | Yacht / skyline frames from another of the developer's projects. 01–02 `--quality 5`; 03 `--max 1600 --quality 5`; 04 `--max 1400 --quality 7` (full-frame glittering water is the JPEG worst case). |
