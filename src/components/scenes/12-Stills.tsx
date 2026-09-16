import { Section } from '@/components/layout/Section';
import { StillsGallery } from '@/components/media/StillsGallery';
import type { Project } from '@/types/content';

/**
 * Scene 12 · Stills (experience-script §12). 4–8 frames in a two-column grid with the
 * native lightbox. Omitted entirely when the project has no stills (ui-rules → States →
 * Empty) — today only northern-light has them.
 */
export function Stills({ project }: { project: Project }) {
  if (project.stills.length === 0) return null;

  return (
    <Section id="stills" label="Stills" heading="eyebrow" className="pb-section">
      <StillsGallery stills={project.stills} className="mt-6" />
    </Section>
  );
}
