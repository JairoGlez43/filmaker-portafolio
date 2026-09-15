import Link from 'next/link';
import { Reveal } from '@/components/motion/Reveal';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { DUR } from '@/lib/motion';
import type { Project } from '@/types/content';

/**
 * Scene 09 · Title card (experience-script §09). Black viewport, the title in display,
 * client · year · roles in mono, centered — the one place text is centered, by the
 * script's own exception. `← WORK` sits top-left under the nav. The script's "holds
 * 0.8 s, fades into the hero" is done by scroll, not a timer (motion-rules → Principles):
 * this is the first viewport, the hero is the next one.
 */
export function TitleCard({ project }: { project: Project }) {
  const meta = [project.client, String(project.year), project.roles.join(' · ')].join(' · ');

  return (
    <section
      aria-label="Title card"
      className="px-gutter relative -mt-(--nav-h) flex min-h-svh flex-col items-center justify-center gap-6 text-center"
    >
      <Link
        href="/#work"
        className="left-gutter text-mono text-text-muted hover:text-text-primary focus-visible:text-text-primary absolute top-[calc(var(--nav-h)+var(--spacing-band))] font-mono tracking-[0.06em] uppercase transition-colors duration-(--dur-fast) ease-out motion-reduce:transition-none"
      >
        ← Work
      </Link>

      <Reveal variant="wipe">
        <h1 className="font-display text-display text-text-primary max-w-[16ch] leading-[1] tracking-[-0.01em] text-balance">
          {project.title}
        </h1>
      </Reveal>
      <Reveal variant="soft" delay={DUR.base}>
        <MonoLabel>{meta}</MonoLabel>
      </Reveal>
    </section>
  );
}
