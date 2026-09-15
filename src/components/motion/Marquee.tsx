'use client';

import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import type Lenis from 'lenis';
import { useRef } from 'react';
import { DUR, EASE, FULL_MOTION_QUERY, MARQUEE } from '@/lib/motion';
import { useLenis } from './MotionProvider';

type MarqueeProps = {
  items: string[];
  className?: string;
};

function Track({ items, hidden }: { items: string[]; hidden: boolean }) {
  return (
    <ul
      aria-hidden={hidden || undefined}
      className={`text-mono text-text-muted flex shrink-0 items-center font-mono tracking-[0.06em] uppercase motion-reduce:flex-wrap ${
        hidden ? 'motion-reduce:hidden' : ''
      }`}
    >
      {items.map((item, i) => (
        <li key={`${i}-${item}`} className="flex items-center whitespace-nowrap">
          <span className="mx-6">{item}</span>
          <span aria-hidden="true" className="text-text-faint">
            ·
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Infinite text marquee (experience-script §06, motion-rules → Patterns). Two identical
 * tracks in one row; the row moves `xPercent: -50` per `MARQUEE.loopSec`, so the loop is
 * seamless by construction and independent of measured widths (no CLS). Pauses on hover;
 * Lenis velocity nudges `timeScale` and it eases back to 1 as the scroll settles.
 *
 * Reduced motion is CSS: the duplicate track is hidden and the first one wraps into a
 * static row — same markup on server and client, no tween created.
 */
export function Marquee({ items, className = '' }: MarqueeProps) {
  const ref = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  useGSAP(
    () => {
      const el = ref.current;
      const row = el?.querySelector<HTMLElement>('[data-marquee-row]');
      if (!el || !row) return;
      const mm = gsap.matchMedia();

      mm.add(FULL_MOTION_QUERY, () => {
        const tween = gsap.to(row, {
          xPercent: -50,
          duration: MARQUEE.loopSec,
          ease: EASE.none,
          repeat: -1,
        });

        const pause = () => tween.pause();
        const play = () => tween.play();
        el.addEventListener('mouseenter', pause);
        el.addEventListener('mouseleave', play);

        const onScroll = (instance: Lenis) => {
          const boost = Math.min(
            Math.abs(instance.velocity) * MARQUEE.boostPerPx,
            MARQUEE.maxBoost,
          );
          gsap.to(tween, { timeScale: 1 + boost, duration: DUR.fast, overwrite: true });
        };
        lenis?.on('scroll', onScroll);

        return () => {
          el.removeEventListener('mouseenter', pause);
          el.removeEventListener('mouseleave', play);
          lenis?.off('scroll', onScroll);
        };
      });
    },
    { scope: ref, dependencies: [lenis] },
  );

  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <div data-marquee-row className="flex w-max motion-reduce:w-auto motion-reduce:flex-wrap">
        <Track items={items} hidden={false} />
        <Track items={items} hidden />
      </div>
    </div>
  );
}
