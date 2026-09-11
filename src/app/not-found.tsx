import Link from 'next/link';

/** The "missing reel" card (ui-rules → States → Not found). Root not-found also catches every unmatched URL. */
export default function NotFound() {
  return (
    <main className="px-gutter py-section flex min-h-svh items-center">
      <div className="bg-surface flex w-full max-w-[65ch] flex-col gap-6 rounded-sm p-8 md:p-12">
        <p className="text-mono-sm text-text-faint font-mono tracking-[0.12em] uppercase">
          404 · Missing reel
        </p>
        <h1 className="font-display text-display text-text-primary leading-[1] tracking-[-0.01em]">
          This reel is not in the archive.
        </h1>
        <p className="text-body text-text-muted font-sans leading-[1.55]">
          The page does not exist, or the project was pulled. The work is one scroll away.
        </p>
        <Link
          href="/#work"
          className="text-mono text-text-primary hover:text-text-muted font-mono tracking-[0.06em] uppercase transition-colors duration-(--dur-fast) ease-out motion-reduce:transition-none"
        >
          ← Work
        </Link>
      </div>
    </main>
  );
}
