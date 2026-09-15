import { Section } from '@/components/layout/Section';
import { LazyVimeo } from '@/components/media/LazyVimeo';
import { ScaleIn } from '@/components/motion/ScaleIn';
import { getSite } from '@/lib/content';

/**
 * Scene 05 · Showreel (experience-script §05). The payoff and the only place sound
 * exists: full-bleed poster (or the honest surface block while the frame is missing),
 * one 64 px play button, mono label, Vimeo iframe only after the click. `ScaleIn`
 * settles the poster from 1.1 to 1 on entry.
 * ⏸ HUMAN: reel poster frame + the developer's own reel id (demo: Big Buck Bunny).
 */
export function Showreel() {
  const site = getSite();
  const year = new Date().getFullYear();

  return (
    <Section id="reel" label="Showreel" bleed className="pt-section">
      <ScaleIn>
        <LazyVimeo
          vimeoId={site.vimeoReelId}
          title="Showreel"
          source="home"
          poster={site.assets.reelPoster}
          sizes="100vw"
          label={`Showreel ${year} · ${site.reelRuntime}`}
          className="w-full"
        />
      </ScaleIn>
    </Section>
  );
}
