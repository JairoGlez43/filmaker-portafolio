// pnpm asset:video <input> <slug> [--hero] [--seconds N] [--crf-h264 23] [--crf-vp9 33]
//
// Turns a clean master into the three web files every loop needs, with the exact ffmpeg
// presets from asset-pipeline.md → Encoding:
//   public/video/<slug>/loop.mp4   H.264, 1080p, no audio, faststart
//   public/video/<slug>/loop.webm  VP9 two-pass, same scaling
//   public/img/<slug>/poster.jpg   frame 0, JPG
// Then checks every output against LIMITS (src/lib/constants.ts) and exits 1 if any is
// over, suggesting the next CRF step. `--hero` applies the hero loop limit and duration
// range. `--seconds N` trims the loop to N seconds from the start (project loops are 6–8 s).
// Never run ad-hoc ffmpeg variants: change this script if the preset must change.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { LIMITS } from '../src/lib/constants.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// ── Arguments ───────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const positional = args.filter((a) => !a.startsWith('--'));
const flag = (name) => args.includes(`--${name}`);
const option = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] !== undefined ? args[i + 1] : fallback;
};

const [input, slug] = positional;
if (!input || !slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error(
    'usage: pnpm asset:video <input> <slug> [--hero] [--seconds N] [--crf-h264 23] [--crf-vp9 33]',
  );
  process.exit(2);
}
if (!existsSync(input)) {
  console.error(`[asset:video] input not found: ${input}`);
  process.exit(2);
}

const hero = flag('hero');
const seconds = option('seconds', null);
const crfH264 = Number(option('crf-h264', 23));
const crfVp9 = Number(option('crf-vp9', 33));
const maxBytes = hero ? LIMITS.heroLoopMaxBytes : LIMITS.loopMaxBytes;
const durationRange = hero ? LIMITS.heroLoopDurationSec : LIMITS.loopDurationSec;

const videoDir = join(ROOT, 'public', 'video', slug);
const imgDir = join(ROOT, 'public', 'img', slug);
mkdirSync(videoDir, { recursive: true });
mkdirSync(imgDir, { recursive: true });

const mp4 = join(videoDir, 'loop.mp4');
const webm = join(videoDir, 'loop.webm');
const poster = join(imgDir, 'poster.jpg');
const passLog = join(tmpdir(), `reelframe-vp9-${slug}-${process.pid}`);

// ── Helpers ─────────────────────────────────────────────────────────────────

function run(bin, argv) {
  const result = spawnSync(bin, argv, { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' });
  if (result.error) {
    console.error(
      `[asset:video] could not start ${bin}: ${result.error.message} — is ffmpeg on PATH?`,
    );
    process.exit(2);
  }
  if (result.status !== 0) {
    console.error(result.stderr.trim().split('\n').slice(-12).join('\n'));
    console.error(`[asset:video] ${bin} failed (exit ${result.status})`);
    process.exit(1);
  }
  return result.stdout;
}

function kb(bytes) {
  return `${Math.round(bytes / 1024)} KB`;
}

const trim = seconds ? ['-t', String(seconds)] : [];
const scale = 'scale=1920:-2:flags=lanczos';

// ── Probe ───────────────────────────────────────────────────────────────────

const probe = run('ffprobe', [
  '-v',
  'error',
  '-select_streams',
  'v:0',
  '-show_entries',
  'stream=width,height,r_frame_rate:format=duration',
  '-of',
  'json',
  input,
]);
const info = JSON.parse(probe);
const stream = info.streams?.[0] ?? {};
const sourceDuration = Number(info.format?.duration ?? 0);
const outDuration = seconds ? Math.min(Number(seconds), sourceDuration) : sourceDuration;

console.log(`[asset:video] ${slug}${hero ? ' (hero)' : ''}`);
console.log(
  `  source  ${stream.width}×${stream.height} @ ${stream.r_frame_rate} · ${sourceDuration.toFixed(2)} s`,
);
if (Number(stream.height) < 1080) {
  console.log(
    `  ⚠ source is below 1080p; it will be upscaled and look soft. Replace it with a 1080p master when you can.`,
  );
}

// ── Encode ──────────────────────────────────────────────────────────────────

run('ffmpeg', [
  '-y',
  '-i',
  input,
  ...trim,
  '-an',
  '-map_metadata',
  '-1',
  '-vf',
  `${scale},format=yuv420p`,
  '-c:v',
  'libx264',
  '-preset',
  'slow',
  '-crf',
  String(crfH264),
  '-profile:v',
  'high',
  '-level',
  '4.1',
  '-g',
  '48',
  '-keyint_min',
  '48',
  '-sc_threshold',
  '0',
  '-movflags',
  '+faststart',
  mp4,
]);
console.log(`  mp4     ${kb(statSync(mp4).size)}`);

// VP9 two-pass; the pass log goes to the OS temp dir so nothing lands in the repo.
run('ffmpeg', [
  '-y',
  '-i',
  input,
  ...trim,
  '-an',
  '-vf',
  scale,
  '-c:v',
  'libvpx-vp9',
  '-b:v',
  '0',
  '-crf',
  String(crfVp9),
  '-row-mt',
  '1',
  '-pass',
  '1',
  '-passlogfile',
  passLog,
  '-f',
  'null',
  '-',
]);
run('ffmpeg', [
  '-y',
  '-i',
  input,
  ...trim,
  '-an',
  '-map_metadata',
  '-1',
  '-vf',
  scale,
  '-c:v',
  'libvpx-vp9',
  '-b:v',
  '0',
  '-crf',
  String(crfVp9),
  '-row-mt',
  '1',
  '-pass',
  '2',
  '-passlogfile',
  passLog,
  webm,
]);
rmSync(`${passLog}-0.log`, { force: true });
console.log(`  webm    ${kb(statSync(webm).size)}`);

run('ffmpeg', [
  '-y',
  '-i',
  input,
  '-map_metadata',
  '-1',
  '-vf',
  `select=eq(n\\,0),${scale}`,
  '-frames:v',
  '1',
  '-q:v',
  '3',
  poster,
]);
console.log(`  poster  ${kb(statSync(poster).size)}`);

// ── Limits ──────────────────────────────────────────────────────────────────

const failures = [];
for (const [file, limit, hint] of [
  [mp4, maxBytes, `--crf-h264 ${crfH264 + 3}`],
  [webm, maxBytes, `--crf-vp9 ${crfVp9 + 3}`],
  [poster, LIMITS.posterMaxBytes, 'a darker or simpler frame 0'],
]) {
  const size = statSync(file).size;
  if (size > limit)
    failures.push(`${file.replace(ROOT, '')} is ${kb(size)}, limit ${kb(limit)} → try ${hint}`);
}
if (outDuration < durationRange.min || outDuration > durationRange.max) {
  failures.push(
    `duration ${outDuration.toFixed(2)} s is outside ${durationRange.min}–${durationRange.max} s → use --seconds ${durationRange.max}`,
  );
}

if (failures.length > 0) {
  console.log('\n✗ over limits:');
  for (const f of failures) console.log(`  ${f}`);
  process.exit(1);
}

console.log(`\n✓ within limits · data: durationSec: ${Math.round(outDuration)}`);
console.log(
  `  paths: /video/${slug}/loop.mp4 · /video/${slug}/loop.webm · /img/${slug}/poster.jpg`,
);
