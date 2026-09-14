import { VideoLoop } from '@/components/media/VideoLoop';
import { Reveal } from '@/components/motion/Reveal';
import { Badge } from '@/components/ui/Badge';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { MonoLabel } from '@/components/ui/MonoLabel';
import { TrackLink } from '@/components/ui/TrackLink';
import { LIMITS } from '@/lib/constants';
import { indexOf } from '@/lib/format';
import type { Project } from '@/types/content';

/** Cards reveal their title when their top reaches 60 % of the viewport (experience-script §03). */
const CARD_REVEAL_START = 'top 60%';

type WorkCardProps = {
  project: Project;
  index: number;
  total: number;
};

/**
 * One full-viewport project card (ui-rules → Core components → Work card). The whole card
 * is a single link — nothing inside is separately focusable. Loop dimmed to 70 % with a
 * bottom scrim; pointer devices un-dim on hover (Tailwind's `hover:` only applies where a
 * pointer exists). Focus ring drawn inward so it stays visible over the footage.
 */
export function WorkCard({ project, index, total }: WorkCardProps) {
  return (
    <TrackLink
      href={`/work/${project.slug}`}
      event="work_open"
      payload={{ slug: project.slug, from: 'home' }}
      className="group bg-surface relative block h-svh w-full overflow-hidden focus-visible:-outline-offset-8"
    >
      <div className="absolute inset-0">
        <VideoLoop
          loop={project.loop}
          slug={project.slug}
          dim
          sizes="100vw"
          className="h-full w-full transition-opacity duration-(--dur-base) ease-out group-hover:opacity-100 motion-reduce:transition-none"
        />
      </div>
      <div
        aria-hidden="true"
        className="from-scrim absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t to-transparent"
      />

      <div className="p-gutter pb-band absolute inset-x-0 bottom-0 flex items-end justify-between gap-6">
        <div className="flex flex-col gap-3">
          <Eyebrow>{indexOf(index + 1, total)}</Eyebrow>
          <Reveal variant="wipe" start={CARD_REVEAL_START}>
            <h3 className="font-display text-h2 text-text-primary leading-[1.05]">
              {project.title}
            </h3>
          </Reveal>
          <MonoLabel>
            {project.client} · {project.year}
          </MonoLabel>
        </div>
        <ul className="flex shrink-0 flex-wrap justify-end gap-2" aria-label="Roles">
          {project.roles.slice(0, LIMITS.maxRolesPerProject).map((role) => (
            <li key={role}>
              <Badge>{role}</Badge>
            </li>
          ))}
        </ul>
      </div>
    </TrackLink>
  );
}
