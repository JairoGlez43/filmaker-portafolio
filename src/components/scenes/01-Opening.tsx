import { VideoLoop } from '@/components/media/VideoLoop';
import { OpeningExit } from '@/components/motion/OpeningExit';
import { Reveal } from '@/components/motion/Reveal';
import { ScrollCue } from '@/components/ui/ScrollCue';
import { getSite } from '@/lib/content';
import { DUR } from '@/lib/motion';

/**
 * Scene 01 · Opening (experience-script §01). Full-bleed hero loop whose poster is the
 * LCP (real footage within the first frame — the 5-second rule), the name revealing by
 * a wipe, the meta line after it, a breathing scroll cue, and the push-in/dim/parallax
 * exit as the visitor scrolls. Sits under the sticky Nav (negative top margin).
 * The Prologue (feature 07) will un-pin straight into this section's first frame.
 */
export function Opening() {
  const site = getSite();

  return (
    <section
      id="opening"
      aria-label="Opening"
      className="relative -mt-(--nav-h) min-h-svh overflow-hidden"
    >
      <OpeningExit className="absolute inset-0">
        <div data-opening-media className="absolute inset-0">
          <VideoLoop
            loop={site.assets.heroLoop}
            slug="hero"
            priority
            sizes="100vw"
            className="h-full w-full"
          />
        </div>

        <div
          data-opening-text
          className="from-scrim px-gutter pt-section pb-band absolute inset-x-0 bottom-0 flex flex-col gap-5 bg-linear-to-t to-transparent"
        >
          <Reveal variant="wipe">
            <h1 className="font-display text-display-xl text-text-primary max-w-[12ch] leading-[0.9] font-semibold tracking-[-0.02em] text-balance">
              {site.name}
            </h1>
          </Reveal>
          <Reveal variant="soft" delay={DUR.base}>
            <p className="text-mono text-text-muted font-mono tracking-[0.06em] uppercase">
              {site.roleLine} — {site.city}
            </p>
          </Reveal>
        </div>

        <ScrollCue className="right-gutter bottom-band absolute" />
      </OpeningExit>
    </section>
  );
}
