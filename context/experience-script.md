<!-- ═══════════════════════════════════════════════════════════
     EDIT LEVEL: PROJECT — this is the SCRIPT of the site. It is discussed and
     refined in the "Script" chat, then treated as the spec for every scene.
     Each scene has a "Hands" line: what the HUMAN must deliver vs what the AGENT
     builds. When the agent reaches a scene whose human deliverable is missing, it
     builds with the placeholder, marks ⏸ HUMAN in progress-tracker.md and stops.
     ═══════════════════════════════════════════════════════════ -->

# Experience Script

The homepage is a short film. Each section is a **scene** with a purpose, a feeling,
and a hand-off to the next one. If a scene does not serve the footage or the
filmmaker, cut it. When in doubt: slower, darker, fewer words.

## Guiding tone

- **Restraint.** The work is loud; the site is quiet. One accent color, one typeface
  pair, generous black.
- **Rhythm.** Scenes alternate: full-bleed image → text → image. Never two text scenes
  in a row.
- **Confidence.** No exclamation marks, no "welcome", no "I'm passionate about".
  Short declaratives. Credits, not adjectives.
- **The footage is never obstructed.** Text sits in the letterbox bands or on a
  darkened gradient, never across faces.

## The two hard rules of the opening

1. **Real footage is visible within 5 seconds of landing.** The prologue satisfies
   this by construction: its plates carry the filmmaker's own frames from 0 %.
2. **The prologue is skippable and never repeats within a session.** Scrolling fast
   through it is allowed; on return visits (sessionStorage flag) or with reduced
   motion the page opens directly on scene 01.

## Scene index

```
00 Prologue       nine plates of the filmmaker's frames assemble into the hero image
01 Opening        hero loop + name reveal (starts from the prologue's final image)
02 Statement      one pinned sentence, words light up
03 Selected Work  4–6 projects, one per viewport, loops play on entry
04 Craft          Direction · Edit · Color (grade wipe)
05 Showreel       full-bleed poster + play (sound)
06 Clients        marquee of names
07 About          portrait + 3 lines
08 Contact        big email, socials, colophon
── /work/[slug] ──
09 Title card · 10 Hero video · 11 Credits · 12 Stills · 13 Next project
```

---

## 00 · Prologue — "Of many frames, one image"

**Purpose:** say in one gesture what an editor does: choose, order, and make many
shots become one image. The visitor sees the work before understanding the metaphor.
**Story beat by beat (scroll progress inside a 250 vh pinned section):**

- **0 %** — Black. Nine thin rectangular plates float at different depths, scattered
  like rushes thrown on a table. Each plate shows one real frame from the portfolio
  (selected in `src/data/prologue.ts`). Far plates are smaller and darker. Slow drift.
- **25 %** — The plates converge toward center and align into a 3×3 contact sheet.
  Gaps remain. This is the editor looking at the material.
- **50 %** — Contact sheet complete and static for a beat (10 % of scroll). Nothing
  moves. The pause is the decision.
- **70 %** — One plate gets a 1 px `accent` outline for ~5 % of scroll (the chosen
  cut). Then the outline fades and all plates begin to grow.
- **85 %** — Gaps close. Each plate's image cross-fades to its tile of the hero
  image. The mosaic is seconds from being one picture; the eye starts to get it.
- **100 %** — Plates touch. Nine images are one. The mosaic is pixel-identical to
  the hero poster. Un-pin; the hero loop plays from that exact frame. No cut is felt.
  **Two implementations, same script:**
- **v1 (Phase 2, feature 07):** DOM. Nine `<img>` plates inside a `perspective`
  container, GSAP scrubs `translate3d/rotateY/scale/opacity` per plate. Final
  positions are the 3×3 tiles of the hero poster (`object-position` per tile).
- **v2 (Phase 5):** pre-rendered in Blender as a frame sequence (WebP, ~150 frames)
  drawn on a `<canvas>` and scrubbed by scroll. Adds depth of field, motion blur,
  rim light on plate edges, cinematic perspective. Replaces v1 behind the same
  `<Prologue />` boundary; scenes 01+ don't change.
  **Motion (both):** all scrubbed (`scrub: SCRUB.base`, `ease: none`). Convergence is
  slow; the final closing is fast (last 15 % of scroll covers the biggest movement).
  No bounce. Plates never overlap each other except by depth.
  **Assets:** 9 stills from the portfolio (`asset-pipeline.md` → Prologue plates), the
  hero poster (already exists for scene 01). v2 adds the rendered sequence.
  **Reduced motion / repeat visit:** prologue not mounted; page starts at scene 01
  with the hero poster visible, so the first image is the same.
  **Hands — Human:** choose the 9 frames (same palette as the hero; the Script chat
  helps), export them per pipeline. For v2: model/animate/render in Blender (Blender
  chat), export WebP sequence. **Agent:** `Prologue` component, plate math, pin,
  sessionStorage skip, canvas sequencer (v2), loading strategy.
  **Done:** a frame of real footage is visible at 0 % (screenshot at t=0 after load);
  the 100 % mosaic matches the hero poster with no visible seam; full prologue scrolls
  in ≤ 4 s at normal wheel speed; skipping works; reduced motion opens on scene 01;
  mobile 9:16 uses the 3×3 layout with vertical stacking of the outer columns' scale
  (no horizontal overflow).

## 01 · Opening

**Purpose:** in three seconds the visitor knows the name, the role, and that this
person can hold a shot.
**On screen:** full-bleed muted loop (8–12 s, mostly motion-in-frame). Its first
frame equals the hero poster equals the prologue's final mosaic. Bottom-left:
`{{FILMMAKER_NAME}}` in display type (Inter Tight 600), large. Below, mono: `DIRECTOR · EDITOR ·
COLORIST — {{CITY}}`. Bottom-right: thin vertical line with `SCROLL` that breathes.
**Motion:** the loop starts playing the instant the prologue un-pins (or on load if
skipped). Name reveals by lines (clip-path wipe up, `DUR.slow`, `EASE.out`, stagger
0.08). Meta line fades after. On scroll, the loop scales 1 → 1.08 and dims to 40 %
while text drifts up faster than the video (parallax 1.4).
**Assets:** `hero-loop.mp4/.webm` (≤ 4 MB), `hero-poster.jpg`.
**Reduced motion:** poster instead of loop; text fades; no parallax.
**Hands — Human:** cut and encode the hero loop; the poster is its frame 0.
**Agent:** `VideoLoop`, `Reveal`, exit timeline, hand-off from `Prologue`.
**Done:** loop plays without tap on iOS Safari; LCP = poster ≤ 2.5 s mobile; the
prologue→loop hand-off shows no flash or frame jump.

## 02 · Statement

**Purpose:** the filmmaker's point of view in one sentence. The only "voice" moment.
**On screen:** pinned viewport, black. One sentence, 12–18 words, display type,
`{{STATEMENT}}`. Placeholder: _"A cut is a decision about what the audience deserves
to feel next."_ Words start `text-faint`, light up to `text-primary` as you scroll.
**Motion:** pinned 150 vh; word opacity scrubbed; last word turns `accent` in the
final 10 %.
**Reduced motion:** no pin; sentence lit; normal scroll.
**Hands — Human:** write the sentence with the client (Script chat). **Agent:**
`ScrubWords`, `Pin`.
**Done:** ≤ 4 lines at 320 px; no jump on pin/unpin.

## 03 · Selected Work

**Purpose:** the argument. Four to six pieces that prove range. Each is a mini-trailer.
**On screen:** one project per viewport, stacked (`sticky`, stack-and-cover).
Full-bleed muted loop (6–8 s) dimmed 70 % with a bottom scrim. Bottom-left: index
`01 / 05`, title (display), client · year (mono). Bottom-right: role badges. Whole
card is a link to `/work/[slug]`.
**Motion:** loop `play()`s when the card's top hits 80 % viewport, `pause()`s when
its bottom passes 20 %; ≤ 2 playing. Title clip-wipes in at 60 % entry. Pointer
devices: hover un-dims 70 → 100 %.
**Assets per project:** `loop.mp4/.webm` (≤ 3 MB), `poster.jpg`, case-study assets.
**Reduced motion:** posters, no autoplay, normal scroll.
**Hands — Human:** choose 4–6 projects, cut + encode each loop, write title/client/
year/roles. **Agent:** `StickyStack`, `WorkCard`, video registry, links.
**Done:** scene video ≤ 15 MB; only near-viewport loops load; visible focus on every
card; `work_open` fires.

## 04 · Craft

**Purpose:** show _how_. Three pinned beats; the Color beat is the signature interaction.
**On screen:**

- **Direction** — a still with SVG storyboard strokes (`accent`, thin) drawing over it. Caption: `Blocking, coverage, performance.`
- **Edit** — a timeline strip (`surface-2` bars); a 1 px `accent` playhead scrubs left→right while a 6-frame contact sheet flips beneath. Caption: `Rhythm is the message.`
- **Color** — scroll-driven **wipe**: ungraded (log) frame left, graded right, wipe line 0 → 100 %. Labels `LOG` / `GRADE`. Caption: `Grade for the story, not the LUT.`
  Each beat pinned 120 vh, all scrubbed, captions fade at 30 %.
  **Assets:** direction still + `storyboard.svg`; 6 frames (640 px WebP); log/grade
  pair (identical 1920×1080).
  **Reduced motion:** three static columns; the wipe becomes a 50/50 split.
  **Hands — Human:** supply the stills; export the log/grade pair from Resolve (or
  create one — Assets chat); draw the storyboard strokes (Figma → SVG). **Agent:**
  `Pin` timelines, `GradeWipe`, `StrokeDraw`, contact-sheet flipper.
  **Done:** wipe shows no seam at any position; 60 fps while scrubbing; captions legible.
  **Note:** a disassembled camera (each part = a stage) is a candidate for a future
  Phase 6 version of this scene. Not v1.

## 05 · Showreel

**Purpose:** the payoff. The only place sound exists.
**On screen:** full-bleed poster, centered 64 px outline play button, mono label
`SHOWREEL {{YEAR}} · {{REEL_RUNTIME}}`.
**Motion:** poster scales 1.1 → 1 on entry. Click: poster fades, Vimeo iframe
mounts with sound and controls; `Escape`/close unmounts. Never autoplay with sound.
**Assets:** `reel-poster.jpg`; `vimeoReelId`.
**Reduced motion:** identical minus the scale.
**Hands — Human:** upload reel to Vimeo (unlisted), pick the poster frame.
**Agent:** `LazyVimeo`, `reel_play` event, keyboard handling.
**Done:** no iframe before click; keyboard operable; event fires.

## 06 · Clients

**Purpose:** credibility without a logo wall.
**On screen:** one mono uppercase row of client names separated by `·`, infinite
marquee. Text only.
**Motion:** continuous `xPercent`, 40 s/loop, pause on hover, `timeScale` nudged by
scroll velocity.
**Reduced motion:** static wrapped row.
**Hands — Human:** the list (or `{{CLIENT_NN}}`). **Agent:** `Marquee`.
**Done:** seamless loop; no CLS on font load.

## 07 · About

**Purpose:** a face and three lines.
**On screen:** two columns (stacked on mobile). Portrait 4:5 B&W. `{{BIO_LINE_1..3}}`,
then mono list: `BASED IN {{CITY}}` · `AVAILABLE FOR {{AVAILABILITY}}` · `TOOLS: …`.
**Motion:** portrait clip-path from bottom; lines stagger up.
**Reduced motion:** fade.
**Hands — Human:** portrait (shot or supplied, B&W treated), bio lines.
**Agent:** layout + `Reveal`.
**Done:** descriptive alt; zero CLS; correct at 320 px.

## 08 · Contact

**Purpose:** make hiring a one-tap act.
**On screen:** `{{EMAIL}}` as the largest text on the page (fluid display), `mailto:`.
Socials in mono. Footer colophon: `© {{YEAR}} {{FILMMAKER_NAME}}` · `Site by
{{DEVELOPER_NAME}}` · type credit.
**Motion:** email characters stagger from `text-muted` to `text-primary`; hover draws
an `accent` underline left→right.
**Hands — Human:** email + social URLs. **Agent:** layout, `contact_click` event.
**Done:** email copyable/clickable; event fires once; footer focus visible.

---

## /work/[slug]

## 09 · Title card

Black; title (display), client · year · role (mono), centered. Holds 0.8 s, fades into
the hero video. Back link top-left `← WORK`.

## 10 · Hero video

16:9 Vimeo embed, lazy (poster → click), full width inside gutters; autoplays muted
when loaded, native controls for sound.

## 11 · Credits

Two-column mono table from `project.credits`; empty fields omitted.

## 12 · Stills

4–8 frames, two-column grid (one on mobile), `next/image`, hover lift `-4px`, `<dialog>`
lightbox, `Escape` closes, focus returns to the still.

## 13 · Next project

Bottom strip: next project's poster dimmed, `NEXT — {{title}}`, wraps after the last.
Fade transition on navigate.

**Hands (case study) — Human:** per project: Vimeo upload, credits, 4–8 stills with
alt text. **Agent:** everything else.

---

## Copy placeholders (all in `src/data/site.ts`)

`{{FILMMAKER_NAME}}` · `{{CITY}}` · `{{STATEMENT}}` · `{{BIO_LINE_1..3}}` ·
`{{AVAILABILITY}}` · `{{EMAIL}}` · `{{CLIENT_01..08}}` · `{{DEVELOPER_NAME}}` ·
`{{YEAR}}` · `{{REEL_RUNTIME}}` · `vimeoReelId`. Placeholders render literally so
gaps are obvious.

## Decided (Script chat, 2026-09)

- Prologue object: **frames assembling** (not an abstract camera). Reason: tells the
  editor's story, shows real footage from 0 %, works in 9:16, seam-free hand-off.
- Technique: **pre-rendered** (Blender → WebP sequence → canvas) as Phase 5, with a
  DOM/GSAP version of the same choreography shipped first.
- The 5-second rule is binding for every future change to scenes 00–01.

## Open questions (resolve in the Script chat before building the scene)

- Statement: one sentence or two? (Leaning one.)
- Prologue 3×3 vs 4×3 plates? (3×3 chosen for v1; 12 plates only if the portfolio has 12 strong frames.)
- Does the "chosen cut" accent outline at 70 % stay, or is it one gesture too many?
