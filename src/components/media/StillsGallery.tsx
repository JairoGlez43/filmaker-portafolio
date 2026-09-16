'use client';

import Image from 'next/image';
import { useState } from 'react';
import type { Still } from '@/types/content';
import { Lightbox } from './Lightbox';

type StillsGalleryProps = {
  stills: Still[];
  className?: string;
};

/**
 * Two-column grid of stills (one column below `md`) opening the native Lightbox
 * (experience-script §12). Images are sized from the data (`width`/`height`) so nothing
 * shifts while loading; pointer devices get a −4 px lift on hover. Focus returns to the
 * clicked still when the dialog closes (native <dialog> behavior).
 */
export function StillsGallery({ stills, className = '' }: StillsGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <ul className={`grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 ${className}`}>
        {stills.map((still, i) => (
          <li key={still.src}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`Open still: ${still.alt}`}
              className="bg-surface block w-full overflow-hidden transition-transform duration-(--dur-fast) ease-out hover:-translate-y-1 motion-reduce:transition-none"
            >
              <Image
                src={still.src}
                alt={still.alt}
                width={still.width}
                height={still.height}
                sizes="(min-width: 768px) 50vw, 100vw"
                className="h-auto w-full"
              />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox
        still={openIndex === null ? null : (stills[openIndex] ?? null)}
        onClose={() => setOpenIndex(null)}
      />
    </>
  );
}
