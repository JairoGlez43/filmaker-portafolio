'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef, type ReactNode } from 'react';
import { DUR, EASE, FULL_MOTION_QUERY, REVEAL_START, SCALE_IN } from '@/lib/motion';

/**
 * "Scale 1.1 → 1 on enter" for full-bleed posters (motion-rules → Patterns). The outer
 * box clips, the inner box scales, so the 1.1 start never leaks into the layout. The start
 * state is CSS (`html[data-js] [data-scale-in]`) — no flash on hydration; under reduced
 * motion the CSS does not apply and no tween is created.
 */
export function ScaleIn({ className = '', children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current?.firstElementChild;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        gsap.fromTo(
          el,
          { scale: SCALE_IN.from },
          {
            scale: 1,
            duration: DUR.slow,
            ease: EASE.out,
            scrollTrigger: { trigger: el, start: REVEAL_START, once: true },
          },
        );
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div data-scale-in>{children}</div>
    </div>
  );
}
