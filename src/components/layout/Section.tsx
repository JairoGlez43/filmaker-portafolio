import type { ReactNode } from 'react';
import { Eyebrow } from '@/components/ui/Eyebrow';

type SectionProps = {
  /** Anchor target (`#work`, `#reel`, `#contact`) and the heading id prefix. */
  id: string;
  /** The scene's one `<h2>` (ui-rules → Accessibility). */
  label: string;
  /** How the h2 shows: the mono eyebrow, or visually hidden when the scene has no heading. */
  heading?: 'eyebrow' | 'hidden';
  /** Only About and Credits are contained; everything else is full-bleed (ui-rules → Layout). */
  contained?: boolean;
  /** Full-bleed media scenes: no side gutter on the section — the children own it. */
  bleed?: boolean;
  className?: string;
  children: ReactNode;
};

export function Section({
  id,
  label,
  heading = 'hidden',
  contained = false,
  bleed = false,
  className = '',
  children,
}: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`${bleed ? '' : 'px-gutter'} ${className}`}
    >
      {heading === 'eyebrow' ? (
        <Eyebrow as="h2" id={headingId}>
          {label}
        </Eyebrow>
      ) : (
        <h2 id={headingId} className="sr-only">
          {label}
        </h2>
      )}
      {contained ? <div className="mx-auto max-w-(--container-max)">{children}</div> : children}
    </section>
  );
}
