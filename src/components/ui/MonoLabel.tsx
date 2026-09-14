import type { ReactNode } from 'react';

type MonoLabelProps = {
  as?: 'p' | 'span' | 'h2' | 'h3' | 'li' | 'dt' | 'dd';
  id?: string;
  className?: string;
  children: ReactNode;
};

/** Mono labels, nav-style words, credits, meta lines (ui-tokens → Typography). Never for sentences longer than ~6 words. */
export function MonoLabel({ as: Tag = 'p', id, className = '', children }: MonoLabelProps) {
  return (
    <Tag
      id={id}
      className={`text-mono text-text-muted font-mono tracking-[0.06em] uppercase ${className}`}
    >
      {children}
    </Tag>
  );
}
