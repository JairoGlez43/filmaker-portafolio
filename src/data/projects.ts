import type { Project, Still } from '@/types/content';

// Five FICTIONAL placeholder projects. Titles read as working titles, never brands.
// DEMO CONTENT: clients, credits and summaries are invented so the site can be judged
// visually; `fictional: true` marks every one of them. The real client replaces this file.
// Asset paths are canonical (asset-pipeline.md → Naming); the files arrive through the
// Assets chat and `pnpm content:check` reports which ones are still missing.

// Projects without shot stills carry `stills: []` — the gallery is omitted (ui-rules → States →
// Empty) instead of rendering broken images. Add 4–8 entries per project once the frames exist
// (`pnpm asset:still`), each with a descriptive alt and its encoded width/height.

// Demo stills for northern-light: the developer's own frames, encoded with `pnpm asset:still`
// (dimensions are the encoded files'). Alt text describes the frame, never the client.
const NORTHERN_LIGHT_STILLS: Still[] = [
  {
    src: '/img/northern-light/still-01.jpg',
    alt: 'Motor yacht at anchor on calm water at sunset, a high-rise skyline along the shore behind it',
    width: 1451,
    height: 1084,
  },
  {
    src: '/img/northern-light/still-02.jpg',
    alt: 'Vertical frame of the same yacht at sunset, low sun flaring over the water and the skyline',
    width: 1122,
    height: 1402,
  },
  {
    src: '/img/northern-light/still-03.jpg',
    alt: 'Drone shot straight down on the bow of a yacht, two people lying on red sun pads over dark water',
    width: 1280,
    height: 1600,
  },
  {
    src: '/img/northern-light/still-04.jpg',
    alt: 'Drone shot straight down on a lone yacht on dark, glittering water, swim platform open at the stern',
    width: 787,
    height: 1400,
  },
];

const FILMMAKER = 'Adriana Villates';

export const projects: Project[] = [
  {
    slug: 'northern-light',
    title: 'Northern Light',
    client: 'Casa Marlow',
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
    stills: NORTHERN_LIGHT_STILLS,
    credits: [
      { label: 'Director', value: FILMMAKER },
      { label: 'Editor', value: FILMMAKER },
      { label: 'Colorist', value: FILMMAKER },
      { label: 'DOP', value: 'Pau Serra' },
    ],
    summary:
      'A brand film for a yacht charter shot over two evenings at anchor: one boat, one sunset, no dialogue.',
    fictional: true,
  },
  {
    slug: 'salt-roads',
    title: 'Salt Roads',
    client: 'Atelier Ondas',
    year: 2025,
    roles: ['editor', 'colorist'],
    order: 2,
    runtime: '01:48',
    loop: {
      mp4: '/video/salt-roads/loop.mp4',
      webm: '/video/salt-roads/loop.webm',
      poster: '/img/salt-roads/poster.jpg',
      durationSec: 7,
    },
    stills: [],
    credits: [
      { label: 'Director', value: 'Ana Vidal' },
      { label: 'Editor', value: FILMMAKER },
      { label: 'Colorist', value: FILMMAKER },
    ],
    summary:
      'A ceramics studio followed from clay to kiln, cut to the rhythm of the wheel and graded warm to match the glaze.',
    fictional: true,
  },
  {
    slug: 'interval',
    title: 'Interval',
    client: 'Lumen Records',
    year: 2025,
    roles: ['director', 'dop'],
    order: 3,
    runtime: '03:02',
    loop: {
      mp4: '/video/interval/loop.mp4',
      webm: '/video/interval/loop.webm',
      poster: '/img/interval/poster.jpg',
      durationSec: 7,
    },
    stills: [],
    credits: [
      { label: 'Director', value: FILMMAKER },
      { label: 'DOP', value: FILMMAKER },
      { label: 'Editor', value: 'Marc Oliva' },
    ],
    summary:
      'A single-take music video shot at dusk on the breakwater, the camera never more than an arm from the singer.',
    fictional: true,
  },
  {
    slug: 'ninety-seconds',
    title: 'Ninety Seconds',
    client: 'Fjord & Sons',
    year: 2024,
    roles: ['editor'],
    order: 4,
    runtime: '01:30',
    loop: {
      mp4: '/video/ninety-seconds/loop.mp4',
      webm: '/video/ninety-seconds/loop.webm',
      poster: '/img/ninety-seconds/poster.jpg',
      durationSec: 7,
    },
    stills: [],
    credits: [
      { label: 'Director', value: 'Sofía Ruano' },
      { label: 'Editor', value: FILMMAKER },
    ],
    summary:
      'A launch spot for a rainwear label, cut from six hours of footage to exactly ninety seconds of weather.',
    fictional: true,
  },
  {
    slug: 'undertow',
    title: 'Undertow',
    client: 'Bahía Films',
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
    stills: [],
    credits: [
      { label: 'Director', value: 'Tomás Ferrer' },
      { label: 'Editor', value: FILMMAKER },
      { label: 'Colorist', value: FILMMAKER },
    ],
    summary:
      'A short documentary on the last night swimmers of a closing lido, graded cold so the water reads as the character.',
    fictional: true,
  },
];
