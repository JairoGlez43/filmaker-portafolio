// pnpm content:check [--allow-missing]
//
// Validates src/data/* against the rules in architecture.md, ui-rules.md and
// asset-pipeline.md, and tells the truth about assets:
//
//   ERRORS   structural problems (duplicate slug, broken order, a path that does not
//            follow the canonical pattern for its slug, a file that exists but exceeds
//            its size limit). Always exit 1.
//   MISSING  referenced files that do not exist yet. Listed grouped as the exact list of
//            ⏸ HUMAN deliverables. Exit 1 unless --allow-missing is passed.
//
// Data files are imported directly (Node strips the TypeScript types natively); limits
// come from src/lib/constants.ts so no number is duplicated here.

import { existsSync, statSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { clients } from '../src/data/clients.ts';
import { craft } from '../src/data/craft.ts';
import { projects } from '../src/data/projects.ts';
import { prologue } from '../src/data/prologue.ts';
import { site } from '../src/data/site.ts';
import { LIMITS } from '../src/lib/constants.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const PUBLIC_DIR = join(ROOT, 'public');
const allowMissing = process.argv.includes('--allow-missing');

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const RUNTIME_RE = /^\d{2}:\d{2}$/;
const ROLES = new Set(['director', 'editor', 'colorist', 'dop']);
const CURRENT_YEAR = new Date().getFullYear();

/** @type {{ where: string; message: string }[]} */
const errors = [];
/** @type {{ where: string; path: string; limit: number }[]} */
const assets = [];

function error(where, message) {
  errors.push({ where, message });
}

function asset(where, path, limit) {
  assets.push({ where, path, limit });
}

function pad(n) {
  return String(n).padStart(2, '0');
}

function formatBytes(bytes) {
  return bytes >= 1024 * 1024
    ? `${(bytes / (1024 * 1024)).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;
}

function expectPath(where, label, actual, expected) {
  if (actual !== expected) error(where, `${label} must be "${expected}", got "${actual}"`);
}

function expectText(where, label, value) {
  if (typeof value !== 'string' || value.trim() === '') error(where, `${label} is empty`);
}

function expectStill(where, still, expectedSrc) {
  if (expectedSrc) expectPath(where, 'still src', still.src, expectedSrc);
  expectText(where, `alt for ${still.src}`, still.alt);
  if (!Number.isInteger(still.width) || still.width <= 0) {
    error(where, `width for ${still.src} must be a positive integer`);
  }
  if (!Number.isInteger(still.height) || still.height <= 0) {
    error(where, `height for ${still.src} must be a positive integer`);
  }
}

// ── Projects ────────────────────────────────────────────────────────────────

function checkProjects() {
  const slugs = new Set();

  for (const p of projects) {
    const where = `projects/${p.slug}`;

    if (!SLUG_RE.test(p.slug)) error(where, `slug "${p.slug}" is not kebab-case`);
    if (slugs.has(p.slug)) error(where, `duplicate slug "${p.slug}"`);
    slugs.add(p.slug);

    expectText(where, 'title', p.title);
    expectText(where, 'client', p.client);
    expectText(where, 'summary', p.summary);

    if (!Number.isInteger(p.year) || p.year < 2000 || p.year > CURRENT_YEAR + 1) {
      error(where, `year ${p.year} is out of range`);
    }
    if (p.runtime !== undefined && !RUNTIME_RE.test(p.runtime)) {
      error(where, `runtime "${p.runtime}" must look like "01:48"`);
    }

    if (p.roles.length === 0) error(where, 'roles is empty');
    if (p.roles.length > LIMITS.maxRolesPerProject) {
      error(where, `${p.roles.length} roles; max ${LIMITS.maxRolesPerProject} badges per card`);
    }
    for (const role of p.roles) if (!ROLES.has(role)) error(where, `unknown role "${role}"`);

    expectPath(where, 'loop.mp4', p.loop.mp4, `/video/${p.slug}/loop.mp4`);
    expectPath(where, 'loop.webm', p.loop.webm, `/video/${p.slug}/loop.webm`);
    expectPath(where, 'loop.poster', p.loop.poster, `/img/${p.slug}/poster.jpg`);
    const { min, max } = LIMITS.loopDurationSec;
    if (p.loop.durationSec < min || p.loop.durationSec > max) {
      error(where, `loop.durationSec ${p.loop.durationSec} is outside ${min}–${max} s`);
    }
    asset(where, p.loop.mp4, LIMITS.loopMaxBytes);
    asset(where, p.loop.webm, LIMITS.loopMaxBytes);
    asset(where, p.loop.poster, LIMITS.posterMaxBytes);

    p.stills.forEach((still, i) => {
      expectStill(where, still, `/img/${p.slug}/still-${pad(i + 1)}.jpg`);
      asset(where, still.src, LIMITS.stillMaxBytes);
    });

    for (const credit of p.credits) {
      expectText(where, 'credit label', credit.label);
      expectText(where, `credit value for ${credit.label}`, credit.value);
    }
  }

  const orders = projects.map((p) => p.order).sort((a, b) => a - b);
  const contiguous = orders.every((order, i) => order === i + 1);
  if (!contiguous)
    error('projects', `order must be contiguous 1..${projects.length}, got [${orders}]`);
}

// ── Site ────────────────────────────────────────────────────────────────────

function checkSite() {
  const where = 'site';
  expectText(where, 'name', site.name);
  expectText(where, 'email', site.email);
  expectText(where, 'statement', site.statement);
  for (const social of site.socials) {
    expectText(where, 'social label', social.label);
    expectText(where, `social href for ${social.label}`, social.href);
  }

  const { heroLoop, reelPoster, portrait, ogDefault } = site.assets;
  expectPath(where, 'heroLoop.mp4', heroLoop.mp4, '/video/hero/loop.mp4');
  expectPath(where, 'heroLoop.webm', heroLoop.webm, '/video/hero/loop.webm');
  expectPath(where, 'heroLoop.poster', heroLoop.poster, '/img/hero/poster.jpg');
  const { min, max } = LIMITS.heroLoopDurationSec;
  if (heroLoop.durationSec < min || heroLoop.durationSec > max) {
    error(where, `heroLoop.durationSec ${heroLoop.durationSec} is outside ${min}–${max} s`);
  }
  asset(where, heroLoop.mp4, LIMITS.heroLoopMaxBytes);
  asset(where, heroLoop.webm, LIMITS.heroLoopMaxBytes);
  asset(where, heroLoop.poster, LIMITS.posterMaxBytes);

  expectPath(where, 'reelPoster', reelPoster, '/img/reel/poster.jpg');
  asset(where, reelPoster, LIMITS.posterMaxBytes);

  expectStill(where, portrait, '/img/portrait.jpg');
  asset(where, portrait.src, LIMITS.portraitMaxBytes);

  expectPath(where, 'ogDefault', ogDefault, '/og/default.jpg');
  asset(where, ogDefault, LIMITS.ogMaxBytes);

  if (clients.length === 0) error('clients', 'clients is empty');
  for (const client of clients) expectText('clients', 'client name', client);
}

// ── Prologue ────────────────────────────────────────────────────────────────

function checkPrologue() {
  const where = 'prologue';
  if (prologue.plates.length !== 9)
    error(where, `expected 9 plates, got ${prologue.plates.length}`);

  const tiles = new Set();
  for (const plate of prologue.plates) {
    if (tiles.has(plate.tile)) error(where, `duplicate tile ${plate.tile}`);
    tiles.add(plate.tile);
    expectPath(
      where,
      `plate ${plate.tile} src`,
      plate.src,
      `/img/prologue/plate-${pad(plate.tile)}.jpg`,
    );
    expectText(where, `alt for plate ${plate.tile}`, plate.alt);
    asset(where, plate.src, LIMITS.plateMaxBytes);
  }
}

// ── Craft ───────────────────────────────────────────────────────────────────

const CRAFT_ASSETS = {
  direction: {
    still: ['/img/craft/direction.jpg', LIMITS.craftDirectionMaxBytes],
    storyboard: ['/img/craft/storyboard.svg', LIMITS.craftStoryboardMaxBytes],
  },
  edit: Object.fromEntries(
    [1, 2, 3, 4, 5, 6].map((n) => [
      `frame${pad(n)}`,
      [`/img/craft/frames/f-${pad(n)}.webp`, LIMITS.craftFrameMaxBytes],
    ]),
  ),
  color: {
    log: ['/img/craft/log.jpg', LIMITS.craftGradeMaxBytes],
    grade: ['/img/craft/grade.jpg', LIMITS.craftGradeMaxBytes],
  },
};

function checkCraft() {
  const seen = new Set();
  for (const beat of craft) {
    const where = `craft/${beat.id}`;
    if (seen.has(beat.id)) error(where, `duplicate beat "${beat.id}"`);
    seen.add(beat.id);
    expectText(where, 'caption', beat.caption);

    const expected = CRAFT_ASSETS[beat.id];
    if (!expected) {
      error(where, `unknown beat id "${beat.id}"`);
      continue;
    }
    for (const [key, [path, limit]] of Object.entries(expected)) {
      const actual = beat.assets[key];
      if (actual === undefined) {
        error(where, `assets.${key} is missing (expected "${path}")`);
        continue;
      }
      expectPath(where, `assets.${key}`, actual, path);
      asset(where, actual, limit);
    }
    for (const key of Object.keys(beat.assets)) {
      if (!(key in expected)) error(where, `assets.${key} is not a known asset of this beat`);
    }
  }
  for (const id of Object.keys(CRAFT_ASSETS)) {
    if (!seen.has(id)) error('craft', `beat "${id}" is missing`);
  }
}

// ── Files on disk ───────────────────────────────────────────────────────────

function checkFiles() {
  const missing = [];
  const sceneVideoBytes = { mp4: 0, webm: 0 };

  for (const { where, path, limit } of assets) {
    const file = join(PUBLIC_DIR, path);
    if (!existsSync(file)) {
      missing.push({ where, path, limit });
      continue;
    }
    const { size } = statSync(file);
    if (size > limit) {
      error(where, `${path} is ${formatBytes(size)}, limit ${formatBytes(limit)}`);
    }
    if (where.startsWith('projects/')) {
      if (path.endsWith('.mp4')) sceneVideoBytes.mp4 += size;
      if (path.endsWith('.webm')) sceneVideoBytes.webm += size;
    }
  }

  const sceneTotal = Math.max(sceneVideoBytes.mp4, sceneVideoBytes.webm);
  if (sceneTotal > LIMITS.sceneVideoMaxBytes) {
    error(
      'projects',
      `Selected Work video totals ${formatBytes(sceneTotal)}, limit ${formatBytes(LIMITS.sceneVideoMaxBytes)}`,
    );
  }

  return missing;
}

// ── Run ─────────────────────────────────────────────────────────────────────

checkProjects();
checkSite();
checkPrologue();
checkCraft();
const missing = checkFiles();

console.log(
  `content:check — ${projects.length} projects · ${prologue.plates.length} plates · ${craft.length} craft beats · ${assets.length} asset paths`,
);

if (errors.length > 0) {
  console.log(`\n✗ ERRORS (${errors.length})`);
  for (const { where, message } of errors) console.log(`  [${where}] ${message}`);
}

if (missing.length > 0) {
  console.log(`\n⏸ MISSING (${missing.length}) — deliverables for the Assets chat`);
  let lastWhere = '';
  for (const { where, path, limit } of missing) {
    if (where !== lastWhere) {
      console.log(`  ${where}`);
      lastWhere = where;
    }
    console.log(`    ${path}  (≤ ${formatBytes(limit)})`);
  }
}

if (errors.length === 0 && missing.length === 0) {
  console.log('\n✓ data valid, every asset present and within limits');
} else if (errors.length === 0 && allowMissing) {
  console.log('\n✓ data valid (missing assets allowed by --allow-missing)');
}

const failed = errors.length > 0 || (missing.length > 0 && !allowMissing);
process.exitCode = failed ? 1 : 0;
