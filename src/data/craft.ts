import type { CraftBeat } from '@/types/content';

// The three beats of scene 04 (experience-script.md §04). Captions are fixed by the
// script; asset paths follow asset-pipeline.md → Inventory.

export const craft: CraftBeat[] = [
  {
    id: 'direction',
    caption: 'Blocking, coverage, performance.',
    assets: {
      still: '/img/craft/direction.jpg',
      storyboard: '/img/craft/storyboard.svg',
    },
  },
  {
    id: 'edit',
    caption: 'Rhythm is the message.',
    assets: {
      frame01: '/img/craft/frames/f-01.webp',
      frame02: '/img/craft/frames/f-02.webp',
      frame03: '/img/craft/frames/f-03.webp',
      frame04: '/img/craft/frames/f-04.webp',
      frame05: '/img/craft/frames/f-05.webp',
      frame06: '/img/craft/frames/f-06.webp',
    },
  },
  {
    id: 'color',
    caption: 'Grade for the story, not the LUT.',
    assets: {
      log: '/img/craft/log.jpg',
      grade: '/img/craft/grade.jpg',
    },
  },
];
