import { Section } from '@/components/layout/Section';
import { getSite } from '@/lib/content';

/**
 * Temporary home. The hero block is the token proof from feature 01; the three sections
 * below exist only so the Nav anchors (#work, #reel, #contact) have somewhere to land.
 * Phase 2 replaces this file with the scene composition (build-plan.md → 07…16).
 */
const PLACEHOLDER_SCENES = [
  { id: 'work', label: 'Selected work', arrives: '10' },
  { id: 'reel', label: 'Showreel', arrives: '13' },
  { id: 'contact', label: 'Contact', arrives: '16' },
] as const;

export default function Home() {
  const site = getSite();

  return (
    <>
      <section
        aria-label="Opening"
        className="px-gutter pb-band -mt-(--nav-h) flex min-h-svh flex-col justify-end gap-6"
      >
        <h1 className="font-display text-display-xl text-text-primary leading-[0.9] font-semibold tracking-[-0.02em]">
          {site.name}
        </h1>
        <p className="text-mono text-text-muted font-mono tracking-[0.06em] uppercase">
          {site.roleLine} — {site.city}
        </p>
      </section>

      {PLACEHOLDER_SCENES.map((scene) => (
        <Section
          key={scene.id}
          id={scene.id}
          label={scene.label}
          heading="eyebrow"
          className="border-line flex min-h-svh flex-col justify-center gap-4 border-t"
        >
          <p className="text-mono-sm text-text-faint font-mono tracking-[0.12em] uppercase">
            Placeholder — scene arrives in feature {scene.arrives}
          </p>
        </Section>
      ))}
    </>
  );
}
