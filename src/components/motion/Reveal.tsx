'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, type ReactNode } from 'react';
import { DUR, EASE, FULL_MOTION_QUERY, REDUCED_MOTION_QUERY, REVEAL_START } from '@/lib/motion';

type RevealProps = {
  /** `wipe`: clip-path from the bottom, for headings and images. `soft`: fade + 16 px, for body copy and labels. */
  variant?: 'wipe' | 'soft';
  className?: string;
  children: ReactNode;
};

const WIPE_FROM = 'inset(100% 0% 0% 0%)';
const WIPE_TO = 'inset(0% 0% 0% 0%)';

/**
 * Triggered reveal, plays once when the element reaches 85 % of the viewport.
 *
 * No flash on hydration: the hidden start state is CSS (`html[data-js] [data-reveal]` in
 * globals.css), applied before first paint by the inline script in layout.tsx. GSAP only
 * animates TO the final state. Without JS nothing is hidden.
 */
export function Reveal({ variant = 'wipe', className = '', children }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      const scrollTrigger = { trigger: el, start: REVEAL_START, once: true };

      mm.add(FULL_MOTION_QUERY, () => {
        if (variant === 'wipe') {
          gsap.fromTo(
            el,
            { clipPath: WIPE_FROM },
            { clipPath: WIPE_TO, duration: DUR.slow, ease: EASE.out, scrollTrigger },
          );
        } else {
          gsap.fromTo(
            el,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: DUR.base, ease: EASE.out, scrollTrigger },
          );
        }
      });

      mm.add(REDUCED_MOTION_QUERY, () => {
        gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: DUR.fast, scrollTrigger });
      });
    },
    { scope: ref, dependencies: [variant] },
  );

  return (
    <div ref={ref} data-reveal={variant} className={className}>
      {children}
    </div>
  );
}
