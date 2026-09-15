'use client';

import Link from 'next/link';
import { useEffect, useRef, useState, type MouseEvent } from 'react';
import { readCssPx } from '@/components/motion/cssVars';
import { useLenis } from '@/components/motion/MotionProvider';

const LINKS = [
  { label: 'Work', href: '/#work' },
  { label: 'Reel', href: '/#reel' },
  { label: 'Contact', href: '/#contact' },
] as const;

/**
 * One sticky nav for the whole site. Over the hero (the first 100 svh) it reads as an
 * absolute bar at the top, floating on a top scrim — a `from-scrim` gradient 2.5 × the bar's
 * height, the mirror of the Opening's bottom band — so the mono text stays legible over a
 * bright sky as much as over a night shot. Once the hero has scrolled away it becomes
 * "stuck": the scrim fades out, a bottom rule and a solid background appear.
 *
 * The stuck state comes from an IntersectionObserver on a 100 svh sentinel — no scroll
 * listener, no GSAP (motion-rules → Scroll rules). On the home page with Lenis active the
 * anchors scroll through Lenis (native anchor jumps break its sync); everywhere else, and
 * under reduced motion, they are plain links.
 */
export function Nav({ name }: { name: string }) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry) setStuck(!entry.isIntersecting);
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const onAnchorClick = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (!lenis || window.location.pathname !== '/') return;
    const hash = href.slice(href.indexOf('#'));
    const target = document.querySelector<HTMLElement>(hash);
    if (!target) return;
    event.preventDefault();
    lenis.scrollTo(target, { offset: -readCssPx('--nav-h') });
    window.history.pushState(null, '', hash);
  };

  // Over footage every word is `text-primary` (the links at 70 %); stuck on `bg-bg` the
  // links return to the muted → primary hover of every other mono link (ui-rules → Nav).
  const linkBase =
    'flex h-full items-center px-3 font-mono text-mono tracking-[0.06em] uppercase transition-colors duration-(--dur-fast) ease-out hover:text-text-primary focus-visible:text-text-primary motion-reduce:transition-none';
  const linkTone = stuck ? 'text-text-muted' : 'text-text-primary/70';
  const linkClass = `${linkBase} ${linkTone}`;

  // The scrim is a pseudo-element so it can be taller than the bar without affecting layout.
  const scrim =
    'before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:-z-10 before:h-[calc(var(--nav-h)*2.5)] before:bg-linear-to-b before:from-scrim before:to-transparent before:transition-opacity before:duration-(--dur-fast) before:ease-out motion-reduce:before:transition-none';

  return (
    <>
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-svh w-px"
      />
      <header
        className={`sticky top-0 z-40 h-(--nav-h) border-b transition-colors duration-(--dur-fast) ease-out motion-reduce:transition-none ${scrim} ${
          stuck
            ? 'border-line bg-bg before:opacity-0'
            : 'border-transparent bg-transparent before:opacity-100'
        }`}
      >
        <nav aria-label="Primary" className="px-gutter flex h-full items-center justify-between">
          <Link href="/" className={`${linkBase} text-text-primary -ml-3`}>
            {name}
          </Link>
          <ul className="flex h-full items-center">
            {LINKS.map((link) => (
              <li key={link.href} className="h-full last:-mr-3">
                <Link
                  href={link.href}
                  className={linkClass}
                  onClick={(event) => onAnchorClick(event, link.href)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
}
