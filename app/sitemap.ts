import type { MetadataRoute } from 'next';
import { STATIC_BASE_PATHS, enUrl, esUrl, type BasePath } from '@/lib/seo';
import { listClubSlugs } from '@/lib/clubs';

/**
 * Canonical URLs only.
 * /home and /es/home are intentionally omitted: they render the same page as
 * / and /es and now canonicalise to them, so listing them would advertise
 * duplicate content. URLs match the canonical tags exactly (no trailing slash),
 * which the Astro sitemap did not do.
 */
function entriesFor(basePath: BasePath): MetadataRoute.Sitemap {
  const languages = { en: enUrl(basePath), es: esUrl(basePath) };
  return [
    { url: enUrl(basePath), alternates: { languages } },
    { url: esUrl(basePath), alternates: { languages } }
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const marketing = STATIC_BASE_PATHS.flatMap(entriesFor);

  // The club directory is English-only, so these are listed without hreflang
  // alternates rather than advertising Spanish URLs that do not exist.
  const slugs = await listClubSlugs();
  const directory: MetadataRoute.Sitemap = [
    { url: enUrl('/clubs') },
    ...slugs.map((slug) => ({ url: enUrl(`/clubs/${slug}`) }))
  ];

  return [...marketing, ...directory];
}
