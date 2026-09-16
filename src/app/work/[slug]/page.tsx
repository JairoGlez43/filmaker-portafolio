import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ViewTransition } from 'react';
import { TitleCard } from '@/components/scenes/09-TitleCard';
import { CaseHero } from '@/components/scenes/10-CaseHero';
import { Credits } from '@/components/scenes/11-Credits';
import { Stills } from '@/components/scenes/12-Stills';
import { DISSOLVE, NextProject } from '@/components/scenes/13-NextProject';
import { getProject, getProjects } from '@/lib/content';

// Every case study is prerendered; a slug outside `projects` is a static 404 (the root
// not-found "missing reel" card) — nothing renders at request time.
export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<'/work/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const result = getProject(slug);
  if (!result.ok) return {};
  const { title, summary, loop } = result.data;
  return {
    title,
    description: summary,
    // Feature 20 replaces this with a generated per-project card (opengraph-image.tsx).
    openGraph: { images: [{ url: loop.poster, width: 1920, height: 1080, alt: title }] },
  };
}

// Only navigations tagged `dissolve` (the Next-project strip) animate: case study → case
// study fades (CSS in globals.css). Back button, ← WORK and the home cards stay instant.
const TRANSITIONS = { [DISSOLVE]: DISSOLVE, default: 'none' } as const;

/** /work/[slug] — scenes 09–13 (experience-script). */
export default async function WorkPage({ params }: PageProps<'/work/[slug]'>) {
  const { slug } = await params;
  const result = getProject(slug);
  if (!result.ok) notFound();

  return (
    <ViewTransition enter={TRANSITIONS} exit={TRANSITIONS} default="none">
      <div>
        <TitleCard project={result.data} />
        <CaseHero project={result.data} />
        <Credits project={result.data} />
        <Stills project={result.data} />
        <NextProject project={result.data} />
      </div>
    </ViewTransition>
  );
}
