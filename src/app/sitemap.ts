import type { MetadataRoute } from 'next';
import { getProjects } from '@/lib/content';
import { siteUrl } from '@/lib/url';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();

  return [
    { url: base.href, lastModified: now, changeFrequency: 'monthly', priority: 1 },
    ...getProjects().map((project) => ({
      url: new URL(`/work/${project.slug}`, base).href,
      lastModified: now,
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
  ];
}
