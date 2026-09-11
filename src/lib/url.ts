/**
 * Absolute base URL for metadata, sitemap and robots. Read once from
 * NEXT_PUBLIC_SITE_URL (see .env.example); falls back to localhost so local builds
 * never fail on a missing variable.
 */
export function siteUrl(): URL {
  return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000');
}
