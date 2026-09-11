import Link from 'next/link';
import { getSite } from '@/lib/content';

/** Colophon. One mono line on desktop, stacked on mobile; links are `text-muted` by default here (ui-rules → Footer). */
export function Footer() {
  const site = getSite();
  const year = new Date().getFullYear();
  const linkClass =
    'transition-colors duration-(--dur-fast) ease-out hover:text-text-primary focus-visible:text-text-primary motion-reduce:transition-none';

  return (
    <footer className="border-line px-gutter border-t py-8">
      <ul className="text-mono text-text-muted flex flex-col gap-2 font-mono tracking-[0.06em] uppercase md:flex-row md:gap-8">
        <li>
          © {year} {site.name}
        </li>
        <li>
          Site by{' '}
          <Link
            href={site.developer.href}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
          >
            {site.developer.name}
          </Link>
        </li>
        <li>Set in Inter Tight &amp; JetBrains Mono</li>
      </ul>
    </footer>
  );
}
