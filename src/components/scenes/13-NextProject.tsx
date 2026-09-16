import Image from 'next/image';
import { Section } from '@/components/layout/Section';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { TrackLink } from '@/components/ui/TrackLink';
import { getNextProject } from '@/lib/content';
import type { Project } from '@/types/content';

/** Transition type carried by the strip's link; `page.tsx` maps it to the CSS dissolve. */
export const DISSOLVE = 'dissolve';

/**
 * Scene 13 · Next project (experience-script §13). Bottom strip with the next project's
 * poster dimmed and `NEXT — Title`; wraps to the first after the last. The whole strip is
 * one link; the navigation carries the `dissolve` transition type so the page fades into
 * the next one (View Transitions, no JS of ours). `work_open` fires with `from: 'next'`.
 */
export function NextProject({ project }: { project: Project }) {
  const next = getNextProject(project.slug);
  if (!next.ok) return null;

  return (
    <Section id="next" label="Next project" bleed>
      <TrackLink
        href={`/work/${next.data.slug}`}
        event="work_open"
        payload={{ slug: next.data.slug, from: 'next' }}
        transitionTypes={[DISSOLVE]}
        className="group bg-surface relative block h-[50svh] w-full overflow-hidden focus-visible:-outline-offset-8"
      >
        <Image
          src={next.data.loop.poster}
          alt=""
          fill
          sizes="100vw"
          className="object-cover opacity-70 transition-opacity duration-(--dur-base) ease-out group-hover:opacity-100 motion-reduce:transition-none"
        />
        <div
          aria-hidden="true"
          className="from-scrim absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t to-transparent"
        />
        <div className="p-gutter pb-band absolute inset-x-0 bottom-0 flex flex-col gap-3">
          <Eyebrow>Next</Eyebrow>
          <p className="font-display text-h2 text-text-primary leading-[1.05]">{next.data.title}</p>
        </div>
      </TrackLink>
    </Section>
  );
}
