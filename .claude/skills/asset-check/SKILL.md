---
name: asset-check
description: >
  Verify a video loop, poster, still, prologue plate or rendered frame sequence against
  context/asset-pipeline.md before it is committed or referenced in src/data. Use
  IMMEDIATELY after adding or replacing anything under public/video, public/img or
  public/seq, after running pnpm asset:video or pnpm asset:seq,
  or when the user says "asset check", "check the loop", or "is this video ok".
  Always run it — an oversized or mis-encoded asset silently ruins the site's
  performance and iOS autoplay, and is hard to trace later.
---

# Asset check — footage becomes a web asset, verified

The site's weight is video. One bad file breaks the performance budget or autoplay.
This skill makes the `asset-pipeline.md` checklist mechanical.

## When to use

- After `pnpm asset:video <input> <slug>` finishes.
- After manually placing any file under `public/video/` or `public/img/`.
- Before editing `src/data/projects.ts` to reference a new asset.

## Steps

1. **Locate the asset(s)** and confirm the canonical path and name
   (`public/video/<slug>/loop.mp4|loop.webm`, `public/img/<slug>/poster.jpg`,
   `still-NN.jpg`…). Slug must match `projects.ts` exactly.

2. **Probe the files** and paste the output:

   ```bash
   du -h public/video/<slug>/* public/img/<slug>/*
   ffprobe -v error -show_entries stream=codec_type,codec_name,width,height,r_frame_rate,duration,profile \
     -show_entries format=duration,size -of default=nw=1 public/video/<slug>/loop.mp4
   ffprobe -v error -show_entries stream=codec_type,codec_name,width,height,duration -of default=nw=1 public/video/<slug>/loop.webm
   ```

3. **Check against limits** (mirror `src/lib/constants.ts` / `asset-pipeline.md`):
   - Loop ≤ 3 MB (hero ≤ 4 MB), each of MP4 and WebM.
   - **No audio stream** (`codec_type=audio` must not appear).
   - 1920 px wide (or 1080 tall for vertical, if ever allowed), `yuv420p`, H.264 `High` profile; VP9 for WebM.
   - Duration 6–12 s; MP4 has `faststart` (`ffprobe` shows `moov` before `mdat`, or check with `-v trace ... | grep -m2 "type:'m"`).
   - Poster ≤ 250 KB, same dimensions as the loop, is a frame from it.
   - Stills ≤ 400 KB, ≤ 2400 px wide, metadata stripped.
   - Selected Work total (`du -ch public/video/*/loop.mp4`) ≤ 15 MB.

4. **Editorial check** (open the file, or the poster + loop in the browser dev page):
   - Loop point lands mid-motion, no visible seam.
   - No on-screen text; bottom-left third is clear of faces.
   - Survives 70% dim with mono text over it.

4b. **Prologue assets (when relevant):**

- Plates: exactly 9 in `public/img/prologue/`, ≤ 150 KB, 1200×675, same grade family
  (open all nine side by side); `prologue.ts` has one entry per tile 1–9.
- Sequence (Phase 5): `ls public/seq/prologue/d | wc -l` and `m` both = `SEQ.count`;
  `du -sh` each set within `LIMITS.seqMaxBytes`; open the diff image produced by
  `pnpm asset:seq` (frame 150 vs hero poster) and judge it by eye; open f-001 and
  confirm real footage is recognizable on the plates.

5. **Data check:** the `projects.ts` entry has correct `loop` paths, `durationSec`,
   `poster`, each still's `width/height` and a real `alt`. Run `pnpm content:check`.

6. **Verdict:** PASS with the size table, or FAIL with the exact limit violated and the
   fix (`--crf` bump, shorten the range, re-export without audio, resize still).
   On FAIL, do not update `projects.ts` and do not commit the asset.

7. **Record:** update `progress-tracker.md` → Asset status row (status + source/license
   note for placeholder footage).

## Rules

- Never bypass a limit "just this once"; change the encode or the cut.
- Never commit raw exports (`.mov`, ProRes, RAW) — sources live outside the repo.
- Placeholder footage must have a known license (own footage or CC0) noted in the tracker.
