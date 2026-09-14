import type { ReactNode } from 'react';

/**
 * Stack-and-cover (motion-rules → Patterns): each item is a full-viewport sticky card, so
 * the next card slides over the previous one as the page scrolls. Pure CSS — no GSAP, no
 * client code — which is why it lives here and not in motion/. Never for lists > 8.
 */
export function StickyStack({
  className = '',
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <ul className={`relative ${className}`}>{children}</ul>;
}

export function StickyStackItem({ children }: { children: ReactNode }) {
  return <li className="sticky top-0 h-svh">{children}</li>;
}
