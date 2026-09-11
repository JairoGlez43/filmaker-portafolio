import Link from 'next/link';
import { getSite } from '@/lib/content';
import { TestBench } from './TestBench';

/**
 * Temporary motion bench for feature 04 (deleted in feature 21). Proves Reveal, Pin and
 * ScrubWords in both motion modes and exposes the ScrollTrigger leak check.
 */
export default function MotionBench() {
  const site = getSite();

  return (
    <main className="px-gutter py-section flex flex-col gap-10">
      <header className="flex flex-col gap-3">
        <p className="text-mono-sm text-text-faint font-mono tracking-[0.12em] uppercase">
          04 / Motion foundation — temporary bench
        </p>
        <h1 className="font-display text-display text-text-primary leading-[1] tracking-[-0.01em]">
          Reveal · Pin · ScrubWords
        </h1>
        <p className="text-body text-text-muted max-w-[65ch] font-sans leading-[1.55]">
          Scroll normally, then emulate <em>prefers-reduced-motion: reduce</em> in DevTools →
          Rendering and reload: Lenis switches off, the pin disappears, reveals become short fades
          and every word is lit. Use the toggle to unmount the blocks and confirm the trigger count
          drops to zero.{' '}
          <Link href="/" className="text-text-primary">
            Leave to the home page
          </Link>{' '}
          and come back for the navigation variant of the same check.
        </p>
      </header>

      <TestBench statement={site.statement} />
    </main>
  );
}
