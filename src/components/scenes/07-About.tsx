import Image from 'next/image';
import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/motion/Reveal';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { getSite } from '@/lib/content';
import { STAGGER } from '@/lib/motion';

/**
 * Scene 07 · About (experience-script §07). A face and three lines: 4:5 B&W portrait on
 * the left (a surface block while it is not shot — the aspect box is always there, so no
 * CLS either way), bio lines staggering up on the right, then the mono facts. One of the
 * two contained scenes (ui-rules → Layout).
 * ⏸ HUMAN: the portrait (1200×1500, B&W) and the three bio lines.
 */
export function About() {
  const site = getSite();
  const { portrait } = site.assets;

  return (
    <Section id="about" label="About" heading="eyebrow" contained className="py-section">
      <div className="mt-8 grid gap-12 md:grid-cols-2 md:gap-16">
        <Reveal variant="wipe">
          <div className="bg-surface relative aspect-[4/5] w-full overflow-hidden">
            {portrait ? (
              <Image
                src={portrait.src}
                alt={portrait.alt}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            ) : (
              <div role="img" aria-label="Portrait, pending" className="flex h-full items-end p-6">
                <Eyebrow>Portrait — pending</Eyebrow>
              </div>
            )}
          </div>
        </Reveal>

        <div className="flex flex-col justify-center gap-10">
          <div className="flex flex-col gap-5">
            {site.bio.map((line, i) => (
              <Reveal key={line} variant="soft" delay={STAGGER.text * i}>
                <p className="text-body text-text-muted max-w-[65ch] font-sans leading-[1.55]">
                  {line}
                </p>
              </Reveal>
            ))}
          </div>

          <Reveal variant="soft" delay={STAGGER.text * site.bio.length}>
            <ul className="flex flex-col gap-3">
              <MonoLabel as="li">Based in {site.city}</MonoLabel>
              <MonoLabel as="li">Available for {site.availability}</MonoLabel>
              <MonoLabel as="li">Tools: {site.tools.join(' · ')}</MonoLabel>
            </ul>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
