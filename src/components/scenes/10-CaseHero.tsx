import Image from 'next/image';
import { Section } from '@/components/layout/Section';
import { LazyVimeo } from '@/components/media/LazyVimeo';
import { ScaleIn } from '@/components/motion/ScaleIn';
import type { Project } from '@/types/content';

/**
 * Scene 10 · Hero video (experience-script §10). 16:9 inside the gutters: a lazy Vimeo
 * embed (poster → click, autoplays muted, native controls for sound) when the project has
 * a `vimeoId`; the poster alone when it does not — the data model makes the id optional.
 * ⏸ HUMAN per project: the Vimeo upload.
 */
export function CaseHero({ project }: { project: Project }) {
  return (
    <Section id="hero" label="Film" className="pb-section">
      <ScaleIn>
        {project.vimeoId ? (
          <LazyVimeo
            vimeoId={project.vimeoId}
            title={project.title}
            source="work"
            slug={project.slug}
            poster={project.loop.poster}
            sizes="100vw"
            muted
            label={project.runtime ? `${project.title} · ${project.runtime}` : project.title}
          />
        ) : (
          <div className="bg-surface relative aspect-video w-full overflow-hidden">
            <Image
              src={project.loop.poster}
              alt=""
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          </div>
        )}
      </ScaleIn>
    </Section>
  );
}
