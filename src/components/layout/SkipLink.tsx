import Link from 'next/link';

/** First focusable element on every page; visible only while focused (ui-rules → Accessibility). */
export function SkipLink() {
  return (
    <Link
      href="#work"
      className="text-mono text-text-primary focus-visible:left-gutter focus-visible:bg-bg sr-only font-mono tracking-[0.06em] uppercase focus-visible:not-sr-only focus-visible:absolute focus-visible:top-4 focus-visible:z-50 focus-visible:px-3 focus-visible:py-2"
    >
      Skip to work
    </Link>
  );
}
