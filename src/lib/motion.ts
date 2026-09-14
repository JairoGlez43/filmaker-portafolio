// Motion vocabulary. Mirrors motion-rules.md → Vocabulary and the --ease/--dur tokens in
// globals.css. Never write these literals in a component.

export const EASE = {
  out: 'expo.out', // reveals, entrances
  inOut: 'expo.inOut', // curtain, page fades, anything symmetrical
  soft: 'power2.out', // small UI (hover, badges)
  none: 'none', // ALL scrubbed timelines
} as const;

export const DUR = {
  fast: 0.3, // hover, focus, small fades
  base: 0.6, // standard reveal
  slow: 1.1, // hero name, portrait, big clip-path reveals
  scene: 0.9, // curtain split, page transition
} as const;

export const STAGGER = { text: 0.08, list: 0.05 } as const;

/** ScrollTrigger `scrub` smoothing, in seconds. */
export const SCRUB = { tight: 0.3, base: 0.6, loose: 1.2 } as const;

/** Every motion component branches on exactly these two queries via gsap.matchMedia(). */
export const FULL_MOTION_QUERY = '(prefers-reduced-motion: no-preference)';
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/** Trigger reveals when the element's top reaches 85 % of the viewport (motion-rules → Scroll rules). */
export const REVEAL_START = 'top 85%';

/** Scene 01 exit (experience-script §01): loop pushes in and dims, text drifts up faster than the page. */
export const OPENING_EXIT = { scale: 1.08, dim: 0.4, parallax: 1.4 } as const;
