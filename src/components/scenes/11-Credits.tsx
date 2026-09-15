import { Section } from '@/components/layout/Section';
import { Reveal } from '@/components/motion/Reveal';
import { MonoLabel } from '@/components/ui/MonoLabel';
import type { Project } from '@/types/content';

/**
 * Scene 11 · Credits (experience-script §11). Two-column mono table from
 * `project.credits`; rows with an empty value are omitted, never shown as "—"
 * (ui-rules → Core components). Contained, like About.
 */
export function Credits({ project }: { project: Project }) {
  const rows = project.credits.filter((credit) => credit.value.trim() !== '');
  if (rows.length === 0) return null;

  return (
    <Section id="credits" label="Credits" heading="eyebrow" contained className="pb-section">
      <Reveal variant="soft" className="mt-6">
        <dl className="max-w-[65ch]">
          {rows.map((credit) => (
            <div
              key={credit.label}
              className="border-line grid grid-cols-[minmax(8rem,1fr)_2fr] gap-6 border-t py-3"
            >
              <MonoLabel as="dt">{credit.label}</MonoLabel>
              <dd className="text-mono text-text-primary font-mono">{credit.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
