'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useMediaQuery } from '@/components/motion/useMediaQuery';
import { LIMITS } from '@/lib/constants';
import { REDUCED_MOTION_QUERY } from '@/lib/motion';
import type { Loop } from '@/types/content';
import { release, requestPlay } from './videoRegistry';

const REDUCED_DATA_QUERY = '(prefers-reduced-data: reduce)';

type VideoLoopProps = {
  loop: Loop;
  /** For logs and the registry only. */
  slug: string;
  /** `next/image` sizes for the poster; the poster is the loading state and the LCP candidate. */
  sizes?: string;
  /** Hero only: preload the poster. */
  priority?: boolean;
  /** Dim to 70 % behind text (ui-tokens → Color usage). Applied to poster and video alike so playback never changes brightness. */
  dim?: boolean;
  className?: string;
};

/**
 * Muted looping preview. The poster is a `next/image` (optimized, `sizes`, LCP-friendly)
 * and is what the visitor sees until the loop is ready; the <video> sits on top,
 * transparent until its first frame plays, so poster → loop is a cross-fade, never a jump.
 *
 * Lifecycle (architecture.md → Video loop lifecycle):
 *   near viewport (±LIMITS.videoLoadMarginPx)  → sources get their src, video.load()
 *   top reaches 80 % / bottom passes 20 %       → requestPlay / release (max 2 decoding)
 * Both via IntersectionObserver — video lifecycle is not an animation, so no GSAP here.
 * Under prefers-reduced-motion or prefers-reduced-data the <video> is not rendered at all.
 */
export function VideoLoop({
  loop,
  slug,
  sizes = '100vw',
  priority = false,
  dim = false,
  className = '',
}: VideoLoopProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  const reducedMotion = useMediaQuery(REDUCED_MOTION_QUERY);
  const reducedData = useMediaQuery(REDUCED_DATA_QUERY);
  // null during SSR/hydration → poster only, then the client decides.
  const enabled = reducedMotion === false && reducedData === false;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const video = videoRef.current;
    if (!enabled || !wrapper || !video) return;

    // 1. Attach sources only when the loop is within one viewport-ish of the screen.
    const loader = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        for (const source of video.querySelectorAll<HTMLSourceElement>('source[data-src]')) {
          source.src = source.dataset.src ?? '';
          delete source.dataset.src;
        }
        video.load();
        loader.disconnect();
      },
      { rootMargin: `${LIMITS.videoLoadMarginPx}px 0px` },
    );

    // 2. Play while the loop overlaps the central 60 % band of the viewport
    //    (enter when its top reaches 80 %, leave when its bottom passes 20 %).
    const player = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) requestPlay(video, slug);
        else release(video);
      },
      { rootMargin: '-20% 0px -20% 0px' },
    );

    const onPlaying = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    video.addEventListener('playing', onPlaying);
    video.addEventListener('pause', onPause);

    loader.observe(wrapper);
    player.observe(wrapper);

    return () => {
      loader.disconnect();
      player.disconnect();
      video.removeEventListener('playing', onPlaying);
      video.removeEventListener('pause', onPause);
      release(video);
    };
  }, [enabled, slug]);

  return (
    <div
      ref={wrapperRef}
      className={`bg-surface relative overflow-hidden ${dim ? 'opacity-70' : ''} ${className}`}
    >
      <Image
        src={loop.poster}
        alt=""
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
      {enabled && (
        <video
          ref={videoRef}
          muted
          playsInline
          loop
          preload="metadata"
          aria-hidden="true"
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-(--dur-base) ease-out motion-reduce:transition-none ${
            playing ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <source data-src={loop.webm} type="video/webm" />
          <source data-src={loop.mp4} type="video/mp4" />
        </video>
      )}
    </div>
  );
}
