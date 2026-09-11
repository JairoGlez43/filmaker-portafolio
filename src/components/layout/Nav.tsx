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
 * absolute bar at the top; once the hero has scrolled away it becomes "stuck": a bottom
 * rule and a solid background appear so the mono text never floats over footage.
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

  const linkClass =
    'flex h-full items-center px-3 font-mono text-mono tracking-[0.06em] text-text-muted uppercase transition-colors duration-(--dur-fast) ease-out hover:text-text-primary focus-visible:text-text-primary motion-reduce:transition-none';

  return (
    <>
      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-0 h-svh w-px"
      />
      <header
        className={`sticky top-0 z-40 h-(--nav-h) border-b transition-colors duration-(--dur-fast) ease-out motion-reduce:transition-none ${
          stuck ? 'border-line bg-bg' : 'border-transparent bg-transparent'
        }`}
      >
        <nav aria-label="Primary" className="px-gutter flex h-full items-center justify-between">
          <Link href="/" className={`${linkClass} -ml-3`}>
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
