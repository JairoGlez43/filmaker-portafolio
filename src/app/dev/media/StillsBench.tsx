'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Lightbox } from '@/components/media/Lightbox';
import type { Still } from '@/types/content';

/**
 * Dev harness for the Lightbox: a two-column grid of stills as buttons. The real gallery
 * (scene 12, feature 18) will own this state in `media/StillsGallery`.
 */
export function StillsBench({ stills }: { stills: Still[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {stills.map((still, i) => (
          <li key={still.src}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className="bg-surface relative block aspect-[4/5] w-full overflow-hidden transition-transform duration-(--dur-fast) ease-out hover:-translate-y-1 motion-reduce:transition-none"
            >
              <Image
                src={still.src}
                alt={still.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
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
