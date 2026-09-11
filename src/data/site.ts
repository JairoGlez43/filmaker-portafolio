import type { Site } from '@/types/content';

// Every identity fact of the filmmaker lives here and ONLY here (project-overview.md →
// Client status). Placeholders render literally so gaps are obvious in review. The
// statement is the placeholder sentence fixed by experience-script.md §02.

export const site: Site = {
  name: '{{FILMMAKER_NAME}}',
  city: '{{CITY}}',
  roleLine: 'DIRECTOR · EDITOR · COLORIST',
  statement: 'A cut is a decision about what the audience deserves to feel next.',
  bio: ['{{BIO_LINE_1}}', '{{BIO_LINE_2}}', '{{BIO_LINE_3}}'],
  availability: '{{AVAILABILITY}}',
  email: '{{EMAIL}}',
  socials: [
    { label: 'Instagram', href: '{{INSTAGRAM_URL}}' },
    { label: 'Vimeo', href: '{{VIMEO_URL}}' },
    { label: 'LinkedIn', href: '{{LINKEDIN_URL}}' },
  ],
  vimeoReelId: '{{VIMEO_REEL_ID}}',
  reelRuntime: '{{REEL_RUNTIME}}',
  developer: { name: '{{DEVELOPER_NAME}}', href: '{{DEVELOPER_URL}}' },
  assets: {
    heroLoop: {
      mp4: '/video/hero/loop.mp4',
      webm: '/video/hero/loop.webm',
      poster: '/img/hero/poster.jpg',
      durationSec: 10,
    },
    reelPoster: '/img/reel/poster.jpg',
    portrait: {
      src: '/img/portrait.jpg',
      alt: '{{PORTRAIT_ALT}}',
      width: 1200,
      height: 1500,
    },
    ogDefault: '/og/default.jpg',
  },
};
