'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createContext, useContext, useRef, useState, type ReactNode } from 'react';
import { FULL_MOTION_QUERY, REDUCED_MOTION_QUERY, SCRUB } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

const PinContext = createContext<gsap.core.Timeline | null>(null);

/**
 * The pinned scene's scrubbed timeline. Children in motion/ add their tweens to it with
 * `ease: 'none'` inside their own useGSAP (so they revert with the child). Null on the
 * server and outside <Pin>: guard with `if (!timeline) return`.
 */
export function usePin(): gsap.core.Timeline | null {
  return useContext(PinContext);
}

type PinProps = {
  /** Pin length as % of viewport height — always a `PIN.*` constant. */
  vh: number;
  className?: string;
  children: ReactNode;
};

/**
 * One pin, one timeline, one ScrollTrigger per scene (motion-rules → Patterns). Scenes
 * are Server Components and cannot pass animation callbacks, so Pin publishes its
 * timeline through context and the client children (ScrubWords, GradeWipe…) populate it.
 * React runs child effects before parent effects, so the tweens exist before the
 * ScrollTrigger is attached here.
 *
 * Reduced motion: no pin, no scrub — the timeline jumps to its final state and the
 * section flows at its natural height.
 */
export function Pin({ vh, className = '', children }: PinProps) {
  const ref = useRef<HTMLDivElement>(null);
  // Client-only: gsap must not tick on the server. Created once per mount.
  const [timeline] = useState(() =>
    typeof window === 'undefined' ? null : gsap.timeline({ paused: true }),
  );

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !timeline) return;
      const mm = gsap.matchMedia();

      mm.add(FULL_MOTION_QUERY, () => {
        ScrollTrigger.create({
          trigger: el,
          start: 'top top',
          end: `+=${vh}%`,
          pin: true,
          pinSpacing: true,
          scrub: SCRUB.base,
          animation: timeline,
        });
      });

      mm.add(REDUCED_MOTION_QUERY, () => {
        timeline.progress(1);
      });

      return () => {
        timeline.kill();
      };
    },
    { scope: ref, dependencies: [vh, timeline] },
  );

  return (
    <PinContext.Provider value={timeline}>
      <div ref={ref} className={className}>
        {children}
      </div>
    </PinContext.Provider>
  );
}
