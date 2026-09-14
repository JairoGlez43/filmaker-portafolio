import { track as vercelTrack } from '@vercel/analytics';

// The ONLY place event names live (architecture.md → Invariants). Add an event to
// code-standards.md → Tracked events first, then here. Client components only.

type Events = {
  reel_play: { source: 'home' | 'work'; slug?: string };
  work_open: { slug: string; from: 'home' | 'next' };
  contact_click: { target: 'email' | 'instagram' | 'vimeo' | 'linkedin' };
};

export type EventName = keyof Events;
export type EventProps<K extends EventName> = Events[K];

/**
 * Typed wrapper around Vercel Web Analytics custom events. Outside production the event
 * is also logged, so the dev server shows what would be sent. Property values must be
 * primitives; undefined keys are dropped before sending.
 */
export function track<K extends EventName>(name: K, props: Events[K]): void {
  const payload = Object.fromEntries(
    Object.entries(props).filter(([, value]) => value !== undefined),
  ) as Record<string, string | number | boolean | null>;

  if (process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production') {
    console.info('[analytics/track]', name, payload);
  }
  vercelTrack(name, payload);
}
