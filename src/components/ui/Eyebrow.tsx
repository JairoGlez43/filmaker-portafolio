import type { ReactNode } from 'react';

type EyebrowProps = {
  as?: 'p' | 'span' | 'h2' | 'h3' | 'li' | 'figcaption';
  id?: string;
  className?: string;
  children: ReactNode;
};

/** Index / eyebrow / `LOADING REEL` type (ui-tokens → Typography, last row). Decorative color: never the only carrier of information. */
export function Eyebrow({ as: Tag = 'p', id, className = '', children }: EyebrowProps) {
  return (
    <Tag
      id={id}
      className={`text-mono-sm text-text-faint font-mono tracking-[0.12em] uppercase ${className}`}
    >
      {children}
    </Tag>
  );
}
