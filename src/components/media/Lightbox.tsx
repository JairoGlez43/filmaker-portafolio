'use client';

import Image from 'next/image';
import { useEffect, useRef, type MouseEvent } from 'react';
import { useLenis } from '@/components/motion/MotionProvider';
import type { Still } from '@/types/content';

type LightboxProps = {
  /** The still to show, or null when closed. State lives in the gallery that owns the triggers. */
  still: Still | null;
  onClose: () => void;
};

/**
 * Native <dialog> lightbox (ui-rules → Core components). `showModal()` traps focus and
 * makes Escape close it; the browser returns focus to the element that opened it. Backdrop
 * click closes. Lenis is stopped while open so the page behind does not scroll
 * (library-docs → Lenis gotchas).
 */
export function Lightbox({ still, onClose }: LightboxProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (still && !dialog.open) {
      dialog.showModal();
      lenis?.stop();
    }
    if (!still && dialog.open) dialog.close();
    return () => {
      lenis?.start();
    };
  }, [still, lenis]);

  const onBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) event.currentTarget.close();
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={onBackdropClick}
      aria-label={still?.alt ?? 'Still'}
      className="backdrop:bg-bg/95 m-auto max-h-none max-w-none bg-transparent p-0"
    >
      {still && (
        <figure className="p-gutter relative flex max-h-svh max-w-[100vw] flex-col items-end gap-3">
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="text-mono text-text-muted hover:text-text-primary font-mono tracking-[0.06em] uppercase transition-colors duration-(--dur-fast) ease-out motion-reduce:transition-none"
          >
            Close ×
          </button>
          <Image
            src={still.src}
            alt={still.alt}
            width={still.width}
            height={still.height}
            sizes="90vw"
            className="h-auto max-h-[85svh] w-auto max-w-[90vw] object-contain"
          />
        </figure>
      )}
    </dialog>
  );
}
