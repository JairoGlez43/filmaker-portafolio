'use client';

import { useState } from 'react';
import { TriggerCount } from '@/components/motion/dev/TriggerCount';
import { Pin } from '@/components/motion/Pin';
import { Reveal } from '@/components/motion/Reveal';
import { ScrubWords } from '@/components/motion/ScrubWords';
import { PIN } from '@/lib/constants';

/**
 * Interactive part of /dev/motion. The mount toggle unmounts every motion block while
 * the trigger counter stays: after "Unmount" the count must read 0, after "Mount" it
 * must come back — that is the leak check from build-plan.md → 04 Done.
 */
export function TestBench({ statement }: { statement: string }) {
  const [mounted, setMounted] = useState(true);

  return (
    <>
      <div className="border-line flex flex-wrap items-center gap-6 border-t pt-6">
        <p className="text-mono text-text-muted font-mono tracking-[0.06em] uppercase">
          Active ScrollTriggers: <TriggerCount />
        </p>
        <button
          type="button"
          onClick={() => setMounted((m) => !m)}
          className="border-line-strong text-mono-sm text-text-primary hover:border-accent rounded-sm border px-3 py-2 font-mono tracking-[0.12em] uppercase transition-colors duration-(--dur-fast) ease-out motion-reduce:transition-none"
        >
          {mounted ? 'Unmount motion blocks' : 'Mount motion blocks'}
        </button>
      </div>

      {mounted && (
        <>
          <div className="flex min-h-svh flex-col justify-center gap-12">
            <p className="text-mono-sm text-text-faint font-mono tracking-[0.12em] uppercase">
              Reveal · wipe (headings) and soft (body) — trigger at 85 % of the viewport
            </p>
            <Reveal variant="wipe">
              <p className="font-display text-display text-text-primary leading-[1] tracking-[-0.01em]">
                Handgloves 0123456789 — a wipe from below
              </p>
            </Reveal>
            <Reveal variant="soft">
              <p className="text-body text-text-muted max-w-[65ch] font-sans leading-[1.55]">
                Body copy fades in with a 16 px rise. Under reduced motion both variants become a
                short fade, and nothing is ever hidden without JavaScript.
              </p>
            </Reveal>
          </div>

          <div className="border-line border-t pt-6">
            <p className="text-mono-sm text-text-faint font-mono tracking-[0.12em] uppercase">
              Pin {PIN.statementVh} vh + ScrubWords — the Statement pattern
            </p>
          </div>
          <Pin vh={PIN.statementVh} className="flex min-h-svh items-center">
            <ScrubWords
              text={statement}
              className="font-display text-display text-text-primary max-w-[20ch] leading-[1] tracking-[-0.01em]"
            />
          </Pin>

          <div className="border-line flex min-h-svh items-center border-t">
            <p className="text-mono-sm text-text-faint font-mono tracking-[0.12em] uppercase">
              End of bench — scroll back up to see the pin release
            </p>
          </div>
        </>
      )}
    </>
  );
}
