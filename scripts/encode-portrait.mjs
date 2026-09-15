// pnpm asset:portrait <input> [--color] [--quality 3] [--alt "<describe the frame>"]
//
// One-off for the About portrait (asset-pipeline.md → Inventory): centre-crops the source to
// 4:5, converts to B&W (unless --color), caps the width at 1200 px (never upscaled), strips
// metadata and writes public/img/portrait.jpg. Prints the `portrait` object to paste into
// src/data/site.ts and exits 1 if the file exceeds LIMITS.portraitMaxBytes.

import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { LIMITS } from '../src/lib/constants.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const args = process.argv.slice(2);
const valueOf = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i !== -1 && args[i + 1] !== undefined ? args[i + 1] : fallback;
};
const flags = new Set(['--quality', '--alt']);
const positional = args.filter((a, i) => !a.startsWith('--') && !flags.has(args[i - 1] ?? ''));
const quality = Number(valueOf('quality', 3));
const keepColor = args.includes('--color');
const alt = valueOf('alt', '<describe the frame>');

const [input] = positional;
if (!input) {
  console.error('usage: pnpm asset:portrait <input> [--color] [--quality 3] [--alt "<text>"]');
  process.exit(2);
}
if (!existsSync(input)) {
  console.error(`[asset:portrait] input not found: ${input}`);
  process.exit(2);
}

const out = join(ROOT, 'public', 'img', 'portrait.jpg');
mkdirSync(dirname(out), { recursive: true });

function run(bin, argv) {
  const result = spawnSync(bin, argv, { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' });
  if (result.error) {
    console.error(
      `[asset:portrait] could not start ${bin}: ${result.error.message} — is ffmpeg on PATH?`,
    );
    process.exit(2);
  }
  if (result.status !== 0) {
    console.error(result.stderr.trim().split('\n').slice(-8).join('\n'));
    console.error(`[asset:portrait] ${bin} failed (exit ${result.status})`);
    process.exit(1);
  }
  return result.stdout;
}

// 4:5 centre crop, then cap the width at 1200 without ever scaling up.
const filters = [
  "crop='min(iw,ih*4/5)':'min(ih,iw*5/4)'",
  "scale='min(1200,iw)':-2",
  ...(keepColor ? [] : ['format=gray']),
];

run('ffmpeg', [
  '-v',
  'error',
  '-y',
  '-i',
  input,
  '-vf',
  filters.join(','),
  '-frames:v',
  '1',
  '-q:v',
  String(quality),
  '-map_metadata',
  '-1',
  out,
]);

const [width, height] = run('ffprobe', [
  '-v',
  'error',
  '-select_streams',
  'v:0',
  '-show_entries',
  'stream=width,height',
  '-of',
  'csv=p=0',
  out,
])
  .trim()
  .split(',')
  .map(Number);

const bytes = statSync(out).size;
const kb = Math.round(bytes / 1024);
console.log(`\n${out}\n  ${width}×${height} · ${kb} KB · ${keepColor ? 'color' : 'B&W'}`);
console.log(`\nPaste into src/data/site.ts → assets.portrait:\n`);
console.log(
  `    portrait: { src: '/img/portrait.jpg', alt: '${alt}', width: ${width}, height: ${height} },\n`,
);

if (bytes > LIMITS.portraitMaxBytes) {
  console.error(
    `[asset:portrait] ${kb} KB exceeds the ${Math.round(LIMITS.portraitMaxBytes / 1024)} KB limit — retry with --quality ${quality + 1}`,
  );
  process.exit(1);
}
