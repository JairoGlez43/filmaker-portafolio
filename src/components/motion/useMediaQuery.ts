'use client';

import { useSyncExternalStore } from 'react';

/**
 * Live `matchMedia` result as an external store: `true`/`false` on the client, `null`
 * during SSR and hydration. Toggling the OS setting re-renders consumers. Used for
 * prefers-reduced-motion (MotionProvider, VideoLoop) and prefers-reduced-data (VideoLoop).
 */
export function useMediaQuery(query: string): boolean | null {
  return useSyncExternalStore(
    (notify) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', notify);
      return () => list.removeEventListener('change', notify);
    },
    () => window.matchMedia(query).matches,
    () => null,
  );
}
