'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useRef, type ReactNode } from 'react';
import { EASE, FULL_MOTION_QUERY, OPENING_EXIT, SCRUB } from '@/lib/motion';

gsap.registerPlugin(ScrollTrigger);

/**
 * Scene 01 exit choreography (experience-script §01): as the hero scrolls away, the
 * media (`[data-opening-media]`) pushes in to 1.08 and dims to 40 % while the text block
 * (`[data-opening-text]`) drifts up 1.4× faster than the page. One scrubbed timeline, one
 * ScrollTrigger, no pin. Under reduced motion nothing moves — poster and text stay put.
 *
 * Scene-specific on purpose: both layers follow the same scroll, so one wrapper beats a
 * `Parallax` + a `ScaleIn` fighting over the same section.
 */
export function OpeningExit({
  className = '',
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const media = el.querySelector<HTMLElement>('[data-opening-media]');
      const text = el.querySelector<HTMLElement>('[data-opening-text]');
      if (!media || !text) return;

      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: SCRUB.base },
        });
        tl.to(media, { scale: OPENING_EXIT.scale, opacity: OPENING_EXIT.dim, ease: EASE.none }, 0)
          // Factor 1.4: over one viewport of scroll the text gains an extra 0.4 viewport.
          .to(
            text,
            { y: () => -(OPENING_EXIT.parallax - 1) * window.innerHeight, ease: EASE.none },
            0,
          );
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
