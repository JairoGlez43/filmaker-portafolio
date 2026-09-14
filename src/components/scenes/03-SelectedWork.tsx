import { Section } from '@/components/layout/Section';
import { StickyStack, StickyStackItem } from '@/components/scenes/parts/StickyStack';
import { WorkCard } from '@/components/scenes/parts/WorkCard';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { getProjects } from '@/lib/content';

/**
 * Scene 03 · Selected Work (experience-script §03). Four to six projects, one per
 * viewport, stacked and covered as the page scrolls; each loop plays on entry and pauses
 * on exit (VideoLoop). Full-bleed, so the section itself has no gutter — the cards own it.
 * Empty state per ui-rules → States.
 */
export function SelectedWork() {
  const projects = getProjects();

  return (
    <Section id="work" label="Selected work" bleed>
      {projects.length === 0 ? (
        <div className="bg-surface px-gutter flex min-h-svh items-center">
          <MonoLabel>Work coming soon</MonoLabel>
        </div>
      ) : (
        <StickyStack>
          {projects.map((project, i) => (
            <StickyStackItem key={project.slug}>
              <WorkCard project={project} index={i} total={projects.length} />
            </StickyStackItem>
          ))}
        </StickyStack>
      )}
    </Section>
  );
}
