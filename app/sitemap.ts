import type { MetadataRoute } from 'next';
import { STATIC_BASE_PATHS, enUrl, esUrl, type BasePath } from '@/lib/seo';

/**
 * Canonical URLs only.
 * /home and /es/home are intentionally omitted: they render the same page as
 * / and /es and now canonicalise to them, so listing them would advertise
 * duplicate content. URLs match the canonical tags exactly (no trailing slash),
 * which the Astro sitemap did not do.
 *
 * Slug-based sections plug in here: make this async and concat the paths, e.g.
 *   const clubPaths = (await listClubSlugs()).map((slug) => `/clubs/${slug}`);
 */
function entriesFor(basePath: BasePath): MetadataRoute.Sitemap {
  const languages = { en: enUrl(basePath), es: esUrl(basePath) };
  return [
    { url: enUrl(basePath), alternates: { languages } },
    { url: esUrl(basePath), alternates: { languages } }
  ];
}

export default function sitemap(): MetadataRoute.Sitemap {
  return STATIC_BASE_PATHS.flatMap(entriesFor);
}
