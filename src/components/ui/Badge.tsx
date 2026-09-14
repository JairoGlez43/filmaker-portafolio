import type { ReactNode } from 'react';

/** Outline-only role badge (ui-tokens → Component tokens). Max 3 per card; never filled. */
export function Badge({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <span
      className={`border-line-strong text-mono-sm text-text-muted inline-block rounded-sm border px-2 py-1 font-mono tracking-[0.12em] uppercase ${className}`}
    >
      {children}
    </span>
  );
}
