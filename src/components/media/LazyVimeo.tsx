'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { track } from '@/lib/analytics';

type LazyVimeoProps = {
  /** Vimeo id; unlisted videos carry their hash as `123456789?h=abcdef`. */
  vimeoId: string;
  /** iframe title (ui-rules → Accessibility). */
  title: string;
  /** Where the player lives — sent with the `reel_play` event. */
  source: 'home' | 'work';
  /** Case-study slug, for `reel_play` on /work/[slug]. */
  slug?: string;
  /** Poster path, or null when it does not exist yet — a `bg-surface` block stands in. */
  poster: string | null;
  sizes?: string;
  /** Case-study heroes autoplay muted; the showreel plays with sound after the click. */
  muted?: boolean;
  /** Mono label under the play button, e.g. `SHOWREEL 2026 · 09:57`. */
  label?: string;
  className?: string;
};

/** architecture.md → Integration patterns → Vimeo (lazy). `dnt=1` always. */
function embedUrl(vimeoId: string, muted: boolean): string {
  const [id, hash] = vimeoId.split('?h=');
  const params = new URLSearchParams({
    autoplay: '1',
    muted: muted ? '1' : '0',
    title: '0',
    byline: '0',
    portrait: '0',
    dnt: '1',
  });
  if (hash) params.set('h', hash);
  return `https://player.vimeo.com/video/${id}?${params.toString()}`;
}

/**
 * Poster + play button; the Vimeo iframe exists in the DOM only after the click (the
 * click is the autoplay gesture, so sound is allowed). `Escape` or the close label unmount
 * it and return focus to the play button. No third-party script, no SDK. The click also
 * fires `reel_play` (code-standards.md → Tracked events).
 */
export function LazyVimeo({
  vimeoId,
  title,
  source,
  slug,
  poster,
  sizes = '100vw',
  muted = false,
  label,
  className = '',
}: LazyVimeoProps) {
  const [open, setOpen] = useState(false);
  const playRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  const play = () => {
    track('reel_play', { source, slug });
    setOpen(true);
  };

  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      closeRef.current?.focus();
      const onKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') setOpen(false);
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
    // Closed again: the play button has just re-rendered, give it the focus back.
    if (wasOpen.current) {
      wasOpen.current = false;
      playRef.current?.focus();
    }
  }, [open]);

  return (
    <div className={`bg-surface relative aspect-video overflow-hidden ${className}`}>
      {open ? (
        <>
          <iframe
            src={embedUrl(vimeoId, muted)}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full border-0"
          />
          <button
            ref={closeRef}
            type="button"
            onClick={() => setOpen(false)}
            className="top-band right-gutter bg-bg/80 text-mono text-text-primary hover:text-text-muted absolute px-3 py-2 font-mono tracking-[0.06em] uppercase transition-colors duration-(--dur-fast) ease-out motion-reduce:transition-none"
          >
            Close ×
          </button>
        </>
      ) : (
        <>
          {poster && (
            <>
              <Image src={poster} alt="" fill sizes={sizes} className="object-cover" />
              {/* Soft scrim so the play button and label read over a bright frame. */}
              <div aria-hidden="true" className="bg-scrim-soft absolute inset-0" />
            </>
          )}
          <button
            ref={playRef}
            type="button"
            onClick={play}
            aria-label={`Play ${title}`}
            className="group absolute inset-0 flex items-center justify-center"
          >
            <span className="border-text-primary group-hover:border-accent group-hover:bg-accent-soft group-focus-visible:border-accent flex size-16 items-center justify-center rounded-full border transition-colors duration-(--dur-fast) ease-out motion-reduce:transition-none">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="fill-text-primary ml-1 size-6">
                <path d="M7 4v16l13-8z" />
              </svg>
            </span>
          </button>
          {label && (
            <p className="bottom-band left-gutter text-mono text-text-muted absolute font-mono tracking-[0.06em] uppercase">
              {label}
            </p>
          )}
        </>
      )}
    </div>
  );
}
