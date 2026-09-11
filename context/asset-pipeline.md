<!-- ═══════════════════════════════════════════════════════════
     EDIT LEVEL: PROJECT — how footage and images become web assets. Discussed in
     the "Assets & Tools" chat; enforced by the asset-check skill and content:check.
     Numbers here mirror LIMITS in src/lib/constants.ts.
     ═══════════════════════════════════════════════════════════ -->

# Asset Pipeline

The site's weight is almost entirely video and imagery. Every asset goes through this
pipeline before it touches `public/`. Raw exports never get committed.

## Inventory (what the site needs)

| Asset                                | Count             | Location                                | Format                 | Limit                            |
| ------------------------------------ | ----------------- | --------------------------------------- | ---------------------- | -------------------------------- |
| Hero loop                            | 1                 | `public/video/hero/loop.{mp4,webm}`     | 1920×1080, 8–12 s      | ≤ 4 MB each                      |
| Hero poster                          | 1                 | `public/img/hero/poster.jpg`            | 1920×1080 JPG q82      | ≤ 250 KB                         |
| Project loop                         | 1 per project (5) | `public/video/<slug>/loop.{mp4,webm}`   | 1920×1080, 6–8 s       | ≤ 3 MB each; scene total ≤ 15 MB |
| Project poster                       | 1 per project     | `public/img/<slug>/poster.jpg`          | 1920×1080 JPG q82      | ≤ 250 KB                         |
| Project stills                       | 4–8 per project   | `public/img/<slug>/still-NN.jpg`        | ≤ 2400 px longest side, JPG q85 | ≤ 400 KB                         |
| Craft: storyboard                    | 1                 | `public/img/craft/storyboard.svg`       | SVG, strokes only      | ≤ 40 KB                          |
| Craft: direction still               | 1                 | `public/img/craft/direction.jpg`        | 1920 px                | ≤ 300 KB                         |
| Craft: contact sheet                 | 6                 | `public/img/craft/frames/f-01…06.webp`  | 640 px wide WebP       | ≤ 60 KB each                     |
| Craft: grade pair                    | 2                 | `public/img/craft/log.jpg`, `grade.jpg` | identical 1920×1080    | ≤ 300 KB each                    |
| Reel poster                          | 1                 | `public/img/reel/poster.jpg`            | 1920×1080              | ≤ 250 KB                         |
| Portrait                             | 1                 | `public/img/portrait.jpg`               | 1200×1500 (4:5), B&W   | ≤ 300 KB                         |
| OG default                           | 1                 | `public/og/default.jpg`                 | 1200×630               | ≤ 200 KB                         |
| Prologue plates                      | 9                 | `public/img/prologue/plate-01…09.jpg`   | 1200×675 JPG q85       | ≤ 150 KB each                    |
| Prologue sequence (Phase 5, desktop) | ~150              | `public/seq/prologue/d/f-001…150.webp`  | 1600×900 WebP q78      | ≤ 45 KB each; ≤ 6.5 MB total     |
| Prologue sequence (Phase 5, mobile)  | ~150              | `public/seq/prologue/m/f-001…150.webp`  | 900×1600 WebP q78      | ≤ 30 KB each; ≤ 4.5 MB total     |
| Fonts                                | 0                 | —                                       | via `next/font`        | —                                |

`next/image` re-encodes JPG sources to AVIF/WebP at request time on Vercel, so JPG is
the right _source_ format. Never commit AVIF/WebP posters by hand (except the small
contact-sheet frames, which are used as-is).

## Source handling

- Sources (ProRes, H.264 masters, RAW stills) live **outside the repo** in
  `~/reelframe-sources/<slug>/`. Add that path to nothing; it's personal.
- Keep a `SOURCES.md` there noting which timecode range each loop was cut from, so a
  re-encode is reproducible.
- `.gitignore` includes `*.mov`, `*.mxf`, `*.prores`, `*.braw`, `*.r3d`, `raw/`.

## Choosing a loop (editorial rules)

- 6–12 s. Cut on motion, not on stillness; the loop point should land mid-movement so
  the seam hides.
- No on-screen text, no faces at the bottom-left third (name/titles live there).
- Prefer shots with internal motion (people, wind, water, light) over camera moves;
  whip pans compress badly and fight the scroll.
- Grade it dark-safe: the site dims loops to 70% behind text; make sure the image
  survives that.
- Mute is permanent; never rely on sound for a loop.

## Export from the NLE (what to hand to ffmpeg)

Export a **clean master** of the loop, not a web file. The web encode is done by the
script so every loop matches.

**DaVinci Resolve:** Deliver → Custom → Format `QuickTime`, Codec `H.264`
(or `ProRes 422 LT` if the shot is grainy), Resolution `1920×1080`, Frame rate =
timeline (23.976/24/25), Quality `Restrict to` 40,000 kb/s (or ProRes default),
no audio. Data levels `Video`. Render in/out over the loop range only.

**Premiere Pro:** Export → H.264, preset `Match Source – High bitrate`, VBR 2-pass,
target 40 Mbps, uncheck audio. Or ProRes 422 LT via QuickTime.

Stills: export the exact frame (Resolve: right-click viewer → Grab Still → export
TIFF/PNG 16-bit; Premiere: Export Frame). Give the pipeline PNG/TIFF; it writes JPG.

**Grade pair for the Color beat:** export the _same_ frame twice from Resolve —
once with the node tree bypassed (Ctrl/Cmd+D on the node graph, or a LUT-less
Rec.709 conversion if the source is log), once graded. Identical resolution and
framing is mandatory; the wipe shows any misalignment.

## Encoding (the script — `pnpm asset:video <input> <slug> [--hero]`)

`scripts/encode-video.mjs` wraps these exact ffmpeg commands. Do not run ad-hoc
variants; change the script if the preset must change.

```bash
# MP4 — H.264, 1080p, no audio, faststart, tuned for repeat playback
ffmpeg -y -i "$IN" -an \
  -vf "scale=1920:-2:flags=lanczos,format=yuv420p" \
  -c:v libx264 -preset slow -crf 23 -profile:v high -level 4.1 \
  -g 48 -keyint_min 48 -sc_threshold 0 \
  -movflags +faststart \
  "public/video/$SLUG/loop.mp4"

# WebM — VP9, two-pass, same scaling
ffmpeg -y -i "$IN" -an -vf "scale=1920:-2:flags=lanczos" \
  -c:v libvpx-vp9 -b:v 0 -crf 33 -row-mt 1 -pass 1 -f null /dev/null && \
ffmpeg -y -i "$IN" -an -vf "scale=1920:-2:flags=lanczos" \
  -c:v libvpx-vp9 -b:v 0 -crf 33 -row-mt 1 -pass 2 \
  "public/video/$SLUG/loop.webm"

# Poster — first frame, JPG q82
ffmpeg -y -i "$IN" -vf "select=eq(n\,0),scale=1920:-2" -frames:v 1 -q:v 3 \
  "public/img/$SLUG/poster.jpg"
```

Script behavior: creates folders, runs the three commands, prints sizes, **fails**
(non-zero) if any output exceeds its limit, and suggests `--crf 26` / `--crf 36`
on failure. Hero uses `--hero` to apply the 4 MB limit. If a loop still won't fit,
shorten it — do not go below 1080p and do not exceed CRF 28 (H.264) / 38 (VP9);
the footage must look like the filmmaker's work.

## Prologue plates (feature 07)

Nine frames that will become the 3×3 tiles of the hero image. Rules for choosing them
(Script chat):

- Same grade family as the hero poster: the contact sheet must look like one film, not
  nine. Prefer frames from the same 4–6 projects shown in Selected Work.
- Mixed scale: some wide, some close. Avoid nine faces or nine landscapes.
- No text, no logos, nothing that reads as a thumbnail.
- The center plate (05) should be the strongest single frame; the eye lands there.
  Export 1920×1080 stills → pipeline resizes to 1200×675. `prologue.ts` records
  `{ src, alt, tile: 1..9 }` per plate.

## Prologue sequence (Phase 5 — Blender → WebP frames)

**What the render must be:** 150 frames (6.25 s at 24 fps) of the exact choreography in
`experience-script.md` §00, camera locked to one framing per aspect ratio, black world
background (`#0a0a0a`, not pure black — matches `--color-bg`), no fog, no vignette
(the site adds none either). **Frame 150 must equal the hero poster** pixel for pixel
at 1600×900: render the plates' final positions as a flat plane textured with
`hero-poster.jpg`, camera-aligned, so the last frame _is_ that image.

**Blender scene (owned by the Blender chat):**

- 9 planes with `Image Texture` (the plate JPGs), each with a second image slot (its
  hero tile, UV-cropped) mixed via a keyframed `Mix Shader` factor for the 85→100 % cross-fade.
- One camera per aspect (16:9, 9:16), same animation, different framing.
- Depth of field on, f/2.8-equivalent, focus tracked to the center plate.
- Motion blur on (shutter 0.5).
- One area light behind-above for a rim on plate edges; plates have a thin `Solidify`
  so edges catch light. Emission of the image texture ≈ 1.0 so frames look lit from within.
- Render: Cycles, 128–256 samples with denoise, PNG 8-bit, Filmic/AgX view transform
  matched to the grade of the stills (check the last frame against the poster).
- Export the two `.blend` cameras as two render jobs: `render/d/####.png`, `render/m/####.png`.

**Convert (`pnpm asset:seq <renderDir> <d|m>`):**

```bash
# resize + WebP, sequentially numbered f-001…f-150
for f in "$IN"/*.png; do
  n=$(printf "%03d" $i); i=$((i+1))
  cwebp -q 78 -resize $W $H -m 6 -mt "$f" -o "public/seq/prologue/$SET/f-$n.webp"
done
```

Script behavior: verifies count = 150, per-frame and total size within limits,
frame 150 vs `hero-poster.jpg` perceptual diff (uses `sharp` in the script only —
dev tooling, not runtime) below threshold, fails otherwise.

**Loading strategy (the sequencer relies on these files):**

- Priority order: frames 1, 9, 17… (every 8th), then every 4th, then the rest. The canvas
  draws the nearest loaded frame, so early scrolling is coarse but never blank.
- Frame 1 is also emitted as `public/img/prologue/first.jpg` for the LCP/poster path.
- Sequence downloads start after the hero poster's `load` event, never before LCP.

**Weight sanity:** 150 × 45 KB = 6.75 MB desktop worst case; target 6.5 MB. If over,
drop to 120 frames before dropping quality — the scrub is scroll-driven, so 120 frames
over 250 vh is still ~1 frame per 2 % of scroll.

## Stills (the script — `pnpm asset:still <input> <slug> <index> [--quality 3]`)

`scripts/encode-still.mjs` writes `public/img/<slug>/still-NN.jpg`: **longest side**
capped at 2400 px (never upscaled — a portrait still in the two-column gallery is never
shown wider than that, and capping only the width would leave a 9:16 frame at 10 MP),
metadata stripped, JPG via ffmpeg `-q:v` (3 ≈ q85; 5 for noisy frames such as water).
Over the limit? Drop the cap first (`--max 1600` — a still in the two-column gallery is
never shown larger), then quality. The script suggests the next step itself. Prints the final `width`/`height` for `projects.ts` and fails if the file
exceeds `LIMITS.stillMaxBytes`, suggesting a higher `--quality` number (lower quality).
Portrait and OG image are one-offs outside this script.

## Images

- JPG sources sized to the max display width × 1.25 (retina-honest, not 2×): posters 1920,
  stills 2400, portrait 1200.
- Strip metadata (`exiftool -all=` or ffmpeg `-map_metadata -1`).
- `alt` is written by a human in `projects.ts`, describing the frame (`"Woman on a
ferry deck at dusk, wind in her hair"`), never `"still 3"`.
- Width/height recorded in data so `next/image` reserves space (no CLS).

## Naming

`<slug>` = project slug from `projects.ts`, kebab-case, matches folder names exactly.
Files: `loop.mp4`, `loop.webm`, `poster.jpg`, `still-01.jpg`… Two-digit indices.

## Placeholders (while the client is unconfirmed)

Use footage you have rights to: your own shots, or CC0 clips (Pexels/Pixabay video,
check each license). Label them in `projects.ts` with `fictional: true` and mention
the source in `progress-tracker.md` → Notes so they're swapped, not shipped as the client's.

## Sequence checklist (Phase 5 — `asset-check` runs this too)

- [ ] `d/` and `m/` sets each have exactly 150 (or 120) frames, contiguous numbering
- [ ] Per-frame and total size within limits (`pnpm asset:seq` output)
- [ ] Frame 150 matches `hero-poster.jpg` (diff image reviewed by eye, not just the number)
- [ ] Frame 1 shows recognizable footage on the plates (5-second rule holds)
- [ ] No plate shows text, a logo or a face at the exact tile seam
- [ ] `prologue.ts` `sequence` block updated; `pnpm content:check` passes

## Checklist (the `asset-check` skill runs this)

- [ ] File in the right `<slug>` folder with the exact canonical name
- [ ] MP4 + WebM both present for every loop; poster present
- [ ] Sizes within limits (script output or `du -h`)
- [ ] Duration 6–12 s, 1080p, no audio track (`ffprobe -show_streams`)
- [ ] Poster is a frame from the same loop
- [ ] `projects.ts` entry updated (paths, `durationSec`, still dimensions, alt text)
- [ ] `pnpm content:check` passes
- [ ] Visually checked in the browser at 70% dim with text over it
