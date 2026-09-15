import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TitleCard } from '@/components/scenes/09-TitleCard';
import { CaseHero } from '@/components/scenes/10-CaseHero';
import { Credits } from '@/components/scenes/11-Credits';
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

/** /work/[slug] — scenes 09–11 (experience-script). 12 Stills and 13 Next project arrive in 18–19. */
export default async function WorkPage({ params }: PageProps<'/work/[slug]'>) {
  const { slug } = await params;
  const result = getProject(slug);
  if (!result.ok) notFound();

  return (
    <>
      <TitleCard project={result.data} />
      <CaseHero project={result.data} />
      <Credits project={result.data} />
    </>
  );
}
