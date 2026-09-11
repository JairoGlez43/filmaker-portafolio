// pnpm asset:still <input> <slug> <index> [--quality 3]
//
// Turns a PNG/TIFF/JPG export into public/img/<slug>/still-NN.jpg per asset-pipeline.md →
// Images: max 2400 px on the longest side (never upscaled), JPG, metadata stripped. Prints the final
// width/height to paste into src/data/projects.ts and exits 1 if the file exceeds
// LIMITS.stillMaxBytes (a higher --quality number means lower quality: ffmpeg's -q:v scale).
// Project stills only; the portrait and OG image have their own paths and are one-offs.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { LIMITS } from '../src/lib/constants.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const option = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] !== undefined ? Number(args[i + 1]) : fallback;
};
const optionNames = new Set(['--quality', '--max']);
const positional = args.filter(
  (a, i) => !a.startsWith('--') && !optionNames.has(args[i - 1] ?? ''),
);
const quality = option('quality', 3);
// Longest-side cap. 2400 is the pipeline default; noisy frames (water, grain) that will
// never be displayed large may drop to 1600 before quality is sacrificed.
const max = option('max', 2400);

const [input, slug, indexArg] = positional;
const index = Number(indexArg);
if (!input || !slug || !Number.isInteger(index) || index < 1 || index > 99) {
  console.error('usage: pnpm asset:still <input> <slug> <index 1-99> [--quality 3] [--max 2400]');
  process.exit(2);
}
if (!existsSync(input)) {
  console.error(`[asset:still] input not found: ${input}`);
  process.exit(2);
}

const outDir = join(ROOT, 'public', 'img', slug);
mkdirSync(outDir, { recursive: true });
const out = join(outDir, `still-${String(index).padStart(2, '0')}.jpg`);

function run(bin, argv) {
  const result = spawnSync(bin, argv, { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' });
  if (result.error) {
    console.error(
      `[asset:still] could not start ${bin}: ${result.error.message} — is ffmpeg on PATH?`,
    );
    process.exit(2);
  }
  if (result.status !== 0) {
    console.error(result.stderr.trim().split('\n').slice(-8).join('\n'));
    console.error(`[asset:still] ${bin} failed (exit ${result.status})`);
    process.exit(1);
  }
  return result.stdout;
}

// Cap the LONGEST side at 2400 without ever upscaling (a portrait still in a two-column
// grid is never displayed wider than that; capping only the width would leave a 9:16
// frame at 10 MP and far over the size limit).
run('ffmpeg', [
  '-y',
  '-i',
  input,
  '-map_metadata',
  '-1',
  '-vf',
  `scale='min(${max},iw)':'min(${max},ih)':force_original_aspect_ratio=decrease`,
  '-frames:v',
  '1',
  '-q:v',
  String(quality),
  out,
]);

const dims = run('ffprobe', [
  '-v',
  'error',
  '-select_streams',
  'v:0',
  '-show_entries',
  'stream=width,height',
  '-of',
  'csv=p=0',
  out,
]).trim();
const [width, height] = dims.split(',').map(Number);
const size = statSync(out).size;

console.log(
  `[asset:still] ${out.replace(ROOT, '')} · ${width}×${height} · ${Math.round(size / 1024)} KB`,
);
if (size > LIMITS.stillMaxBytes) {
  const hint = max > 1600 ? `--max 1600` : `--quality ${quality + 2}`;
  console.log(`✗ over ${Math.round(LIMITS.stillMaxBytes / 1024)} KB → retry with ${hint}`);
  process.exit(1);
}
console.log(
  `✓ data: { src: '/img/${slug}/still-${String(index).padStart(2, '0')}.jpg', width: ${width}, height: ${height} }`,
);
