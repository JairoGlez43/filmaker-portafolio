'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { CHAR_DIM, DUR, EASE, FULL_MOTION_QUERY, REVEAL_START, STAGGER } from '@/lib/motion';

type StaggerCharsProps = {
  text: string;
  className?: string;
};

/**
 * Characters light up one by one on entry (experience-script §08, the contact email).
 * Opacity, not color — same look as muted → primary, but "transform and opacity only"
 * and a contrast change rather than a hue change (ui-rules → Accessibility). The dim start
 * is CSS (`html[data-js] [data-stagger-char]`), so there is no flash; under reduced motion
 * neither the CSS nor the tween applies. Screen readers get the whole text once.
 */
export function StaggerChars({ text, className = '' }: StaggerCharsProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        const chars = gsap.utils.toArray<HTMLElement>('[data-stagger-char]', el);
        gsap.fromTo(
          chars,
          { opacity: CHAR_DIM },
          {
            opacity: 1,
            duration: DUR.base,
            ease: EASE.out,
            stagger: STAGGER.chars,
            scrollTrigger: { trigger: el, start: REVEAL_START, once: true },
          },
        );
      });
    },
    { scope: ref, dependencies: [text] },
  );

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      {Array.from(text).map((char, i) => (
        <span key={`${i}-${char}`} data-stagger-char aria-hidden="true">
          {char === ' ' ? ' ' : char}
        </span>
      ))}
    </span>
  );
}
