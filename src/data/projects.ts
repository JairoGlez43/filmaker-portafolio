import type { Project, Still } from '@/types/content';

// Five FICTIONAL placeholder projects. Titles read as working titles, never brands.
// Every client-specific fact is a {{PLACEHOLDER}} that renders literally until the
// real client replaces this file. Asset paths are canonical (asset-pipeline.md →
// Naming); the files arrive through the Assets chat and `pnpm content:check` reports
// which ones are still missing.

function stills(slug: string, count: number): Still[] {
  return Array.from({ length: count }, (_, i) => {
    const n = String(i + 1).padStart(2, '0');
    return {
      src: `/img/${slug}/still-${n}.jpg`,
      alt: `{{${slug.toUpperCase().replace(/-/g, '_')}_STILL_${n}_ALT}}`,
      width: 2400,
      height: 1350,
    };
  });
}

export const projects: Project[] = [
  {
    slug: 'northern-light',
    title: 'Northern Light',
    client: '{{CLIENT_01}}',
    year: 2026,
    roles: ['director', 'editor', 'colorist'],
    order: 1,
    runtime: '02:14',
    loop: {
      mp4: '/video/northern-light/loop.mp4',
      webm: '/video/northern-light/loop.webm',
      poster: '/img/northern-light/poster.jpg',
      durationSec: 7,
    },
    stills: stills('northern-light', 4),
    credits: [
      { label: 'Director', value: '{{FILMMAKER_NAME}}' },
      { label: 'Editor', value: '{{FILMMAKER_NAME}}' },
      { label: 'Colorist', value: '{{FILMMAKER_NAME}}' },
      { label: 'DOP', value: '{{DOP_01}}' },
    ],
    summary: '{{SUMMARY_01}}',
    fictional: true,
  },
  {
    slug: 'salt-roads',
    title: 'Salt Roads',
    client: '{{CLIENT_02}}',
    year: 2025,
    roles: ['editor', 'colorist'],
    order: 2,
    runtime: '01:48',
    loop: {
      mp4: '/video/salt-roads/loop.mp4',
      webm: '/video/salt-roads/loop.webm',
      poster: '/img/salt-roads/poster.jpg',
      durationSec: 6,
    },
    stills: stills('salt-roads', 4),
    credits: [
      { label: 'Director', value: '{{DIRECTOR_02}}' },
      { label: 'Editor', value: '{{FILMMAKER_NAME}}' },
      { label: 'Colorist', value: '{{FILMMAKER_NAME}}' },
    ],
    summary: '{{SUMMARY_02}}',
    fictional: true,
  },
  {
    slug: 'interval',
    title: 'Interval',
    client: '{{CLIENT_03}}',
    year: 2025,
    roles: ['director', 'dop'],
    order: 3,
    runtime: '03:02',
    loop: {
      mp4: '/video/interval/loop.mp4',
      webm: '/video/interval/loop.webm',
      poster: '/img/interval/poster.jpg',
      durationSec: 8,
    },
    stills: stills('interval', 4),
    credits: [
      { label: 'Director', value: '{{FILMMAKER_NAME}}' },
      { label: 'DOP', value: '{{FILMMAKER_NAME}}' },
      { label: 'Editor', value: '{{EDITOR_03}}' },
    ],
    summary: '{{SUMMARY_03}}',
    fictional: true,
  },
  {
    slug: 'ninety-seconds',
    title: 'Ninety Seconds',
    client: '{{CLIENT_04}}',
    year: 2024,
    roles: ['editor'],
    order: 4,
    runtime: '01:30',
    loop: {
      mp4: '/video/ninety-seconds/loop.mp4',
      webm: '/video/ninety-seconds/loop.webm',
      poster: '/img/ninety-seconds/poster.jpg',
      durationSec: 6,
    },
    stills: stills('ninety-seconds', 4),
    credits: [
      { label: 'Director', value: '{{DIRECTOR_04}}' },
      { label: 'Editor', value: '{{FILMMAKER_NAME}}' },
    ],
    summary: '{{SUMMARY_04}}',
    fictional: true,
  },
  {
    slug: 'undertow',
    title: 'Undertow',
    client: '{{CLIENT_05}}',
    year: 2023,
    roles: ['colorist', 'editor'],
    order: 5,
    runtime: '02:40',
    loop: {
      mp4: '/video/undertow/loop.mp4',
      webm: '/video/undertow/loop.webm',
      poster: '/img/undertow/poster.jpg',
      durationSec: 7,
    },
    stills: stills('undertow', 4),
    credits: [
      { label: 'Director', value: '{{DIRECTOR_05}}' },
      { label: 'Editor', value: '{{FILMMAKER_NAME}}' },
      { label: 'Colorist', value: '{{FILMMAKER_NAME}}' },
    ],
    summary: '{{SUMMARY_05}}',
    fictional: true,
  },
];
