import type { PlateTile, ProloguePlate, PrologueConfig } from '@/types/content';

// The nine frames of scene 00 (experience-script.md §00). Chosen by the human in the
// Script chat, exported per asset-pipeline.md → Prologue plates. Tile 5 is the center.
// No `sequence` block yet: the DOM version renders until Phase 5.

const TILES: PlateTile[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];

const plates: ProloguePlate[] = TILES.map((tile) => {
  const n = String(tile).padStart(2, '0');
  return { src: `/img/prologue/plate-${n}.jpg`, alt: `Prologue frame ${n}`, tile };
});

export const prologue: PrologueConfig = {
  plates,
  grid: { cols: 3, rows: 3 },
};
