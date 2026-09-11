import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/url';

export default function robots(): MetadataRoute.Robots {
  return {
    // /dev/* are build-time inspectors, deleted in feature 21; never worth indexing.
    rules: { userAgent: '*', allow: '/', disallow: '/dev/' },
    sitemap: new URL('/sitemap.xml', siteUrl()).href,
  };
}
