import type { Site } from '@/types/content';

// Every identity fact of the filmmaker lives here and ONLY here (project-overview.md →
// Client status). DEMO CONTENT: every name, handle and URL below is fictional and exists so
// the site can be judged visually without `{{PLACEHOLDER}}` braces on screen. Replace the
// whole object with the real filmmaker's facts before release.

export const site: Site = {
  name: 'Adriana Villates',
  city: 'Valencia',
  roleLine: 'DIRECTOR · EDITOR · COLORIST',
  statement: 'A cut is a decision about what the audience deserves to feel next.',
  bio: [
    'I direct, cut and grade short-form film for brands, musicians and the occasional stranger with a good story.',
    'Ten years between the set and the suite taught me that rhythm is built in the edit and trust is built on the shoot.',
    'Based in Valencia, working wherever the light is worth the flight.',
  ],
  availability: 'commissions from November 2026',
  tools: ['DaVinci Resolve', 'Premiere Pro', 'Blackmagic 6K'],
  email: 'hello@adrianavillates.film',
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/adrianavillates.film' },
    { label: 'Vimeo', href: 'https://vimeo.com/adrianavillates' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/adrianavillates' },
  ],
  // Demo reel: "The Mountain" by TSO Photography, a public Vimeo video with public embed
  // permission (the developer has no Vimeo account). Big Buck Bunny (1084537) was dropped:
  // its 2010 transcode never leaves the player's spinner. Swap for the filmmaker's unlisted
  // reel id (with `?h=` hash if unlisted).
  vimeoReelId: '22439234',
  reelRuntime: '03:05',
  developer: { name: 'Jairo Gonzalez', href: 'https://jairo-dev-portafolio.vercel.app' },
  assets: {
    heroLoop: {
      mp4: '/video/hero/loop.mp4',
      webm: '/video/hero/loop.webm',
      poster: '/img/hero/poster.jpg',
      durationSec: 8,
    },
    // A frame from the developer's own footage until the real reel has its own poster.
    reelPoster: '/img/reel/poster.jpg',
    // Encoded from ~/Documents/WebDev projects/reelframe-sources/portrait/adriana-pp.jpeg (sources
    // never live in public/ — asset-pipeline.md → Source handling) with `pnpm asset:portrait` (4:5 centre crop,
    // B&W, source is 1080×720 so the file is 576×720 — never upscaled).
    portrait: {
      src: '/img/portrait.jpg',
      alt: 'Adriana Villates photographing her reflection through a Canon EOS, face hidden behind the camera',
      width: 576,
      height: 720,
    },
    ogDefault: '/og/default.jpg',
  },
};
