'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { EASE } from '@/lib/motion';
import { usePin } from './Pin';

type ScrubWordsProps = {
  /** One sentence, ≤ 20 words (motion-rules → Patterns). */
  text: string;
  className?: string;
};

/** Share of the pin during which words light up; the rest turns the last word accent. */
const LIT_SHARE = 0.9;

/**
 * Words start faint and light up one by one as the parent <Pin> scrubs; the last word
 * turns `accent` in the final 10 % (experience-script §02). Must live inside <Pin>.
 * The dim start state is CSS (`html[data-js] [data-scrub-word]`), so there is no flash;
 * under reduced motion the CSS lights every word and Pin jumps the timeline to the end.
 */
export function ScrubWords({ text, className = '' }: ScrubWordsProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const timeline = usePin();
  const words = text.trim().split(/\s+/);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || !timeline) return;
      const spans = gsap.utils.toArray<HTMLElement>('[data-scrub-word]', el);
      const last = spans.at(-1);
      if (spans.length === 0 || !last) return;

      // Durations are relative: a scrubbed timeline is normalised to the pin's length.
      const each = LIT_SHARE / spans.length;
      timeline
        .to(spans, { opacity: 1, duration: each, stagger: each, ease: EASE.none }, 0)
        .to(last, { color: 'var(--color-accent)', duration: 1 - LIT_SHARE, ease: EASE.none });
    },
    { scope: ref, dependencies: [timeline, text] },
  );

  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((word, i) => (
        <span key={`${i}-${word}`} data-scrub-word aria-hidden="true" className="inline-block">
          {word}
          {i < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </p>
  );
}
