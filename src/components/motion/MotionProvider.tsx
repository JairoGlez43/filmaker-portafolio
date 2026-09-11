'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { useEffect, useSyncExternalStore, type ReactNode } from 'react';
import { REDUCED_MOTION_QUERY } from '@/lib/motion';

// Registered once for the whole app; every other motion component relies on this.
gsap.registerPlugin(ScrollTrigger, useGSAP);

// ── External stores ─────────────────────────────────────────────────────────
// Lenis is an external system, not React state, so it is published through
// useSyncExternalStore instead of setState-in-effect (react-hooks/set-state-in-effect).

const lenisListeners = new Set<() => void>();
let currentLenis: Lenis | null = null;

function publishLenis(instance: Lenis | null) {
  currentLenis = instance;
  lenisListeners.forEach((notify) => notify());
}

function subscribeLenis(notify: () => void) {
  lenisListeners.add(notify);
  return () => lenisListeners.delete(notify);
}

/** The single Lenis instance, or null under reduced motion (native scroll), on the server, and before mount. */
export function useLenis(): Lenis | null {
  return useSyncExternalStore(
    subscribeLenis,
    () => currentLenis,
    () => null,
  );
}

function subscribeReducedMotion(notify: () => void) {
  const query = window.matchMedia(REDUCED_MOTION_QUERY);
  query.addEventListener('change', notify);
  return () => query.removeEventListener('change', notify);
}

/** Live OS setting; null on the server. Toggling it in DevTools re-renders consumers. */
function useReducedMotion(): boolean | null {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia(REDUCED_MOTION_QUERY).matches,
    () => null,
  );
}

// ── Provider ────────────────────────────────────────────────────────────────

/**
 * Owns the three things that must exist exactly once: GSAP plugin registration, the Lenis
 * smooth-scroll instance, and the ticker that drives both. Lenis is never created under
 * prefers-reduced-motion — the page scrolls natively — and is torn down if the setting
 * changes while the page is open. Wrapped around the whole body in layout.tsx.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced !== false) return;

    const instance = new Lenis({ lerp: 0.1, smoothWheel: true });
    // Lenis owns wheel/touch; ScrollTrigger reads scroll position from it. One raf: GSAP's.
    instance.on('scroll', () => ScrollTrigger.update());
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    publishLenis(instance);

    return () => {
      publishLenis(null);
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33); // GSAP defaults
      instance.destroy();
    };
  }, [reduced]);

  // Pins jump if refresh runs before fonts load (memory.md). Once, here, nowhere else.
  useEffect(() => {
    let cancelled = false;
    document.fonts.ready
      .then(() => {
        if (!cancelled) ScrollTrigger.refresh();
      })
      .catch((error: unknown) => {
        console.warn('[motion/MotionProvider] fonts.ready rejected; skipping refresh', error);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return <>{children}</>;
}
