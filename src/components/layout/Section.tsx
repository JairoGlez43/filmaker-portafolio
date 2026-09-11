import type { ReactNode } from 'react';

type SectionProps = {
  /** Anchor target (`#work`, `#reel`, `#contact`) and the heading id prefix. */
  id: string;
  /** The scene's one `<h2>` (ui-rules → Accessibility). */
  label: string;
  /** How the h2 shows: the mono eyebrow, or visually hidden when the scene has no heading. */
  heading?: 'eyebrow' | 'hidden';
  /** Only About and Credits are contained; everything else is full-bleed (ui-rules → Layout). */
  contained?: boolean;
  className?: string;
  children: ReactNode;
};

export function Section({
  id,
  label,
  heading = 'hidden',
  contained = false,
  className = '',
  children,
}: SectionProps) {
  const headingId = `${id}-heading`;
  return (
    <section id={id} aria-labelledby={headingId} className={`px-gutter ${className}`}>
      <h2
        id={headingId}
        className={
          heading === 'eyebrow'
            ? 'text-mono-sm text-text-faint font-mono tracking-[0.12em] uppercase'
            : 'sr-only'
        }
      >
        {label}
      </h2>
      {contained ? <div className="mx-auto max-w-(--container-max)">{children}</div> : children}
    </section>
  );
}
