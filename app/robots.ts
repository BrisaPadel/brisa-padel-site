import type { MetadataRoute } from 'next';
import { SITE_BASE_URL } from '@/data/urls';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    // SEO fix: the static robots.txt pointed at www.brisapadel.com while every
    // canonical tag used website.brisapadel.com. Both now derive from one value.
    sitemap: `${SITE_BASE_URL}/sitemap.xml`
  };
}
