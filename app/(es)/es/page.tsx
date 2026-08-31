import type { Metadata } from 'next';
import HomePage from '@/components/HomePage';
import { translations } from '@/data/i18n';
import { buildMetadata } from '@/lib/seo';

const t = translations.es;

// Keep this in sync with the English landing page. The matching response
// headers in next.config.ts also disable the outer nginx page cache.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildMetadata({
  title: t.pageTitle,
  description: t.pageDescription,
  lang: 'es',
  basePath: ''
});

export default function Page() {
  return <HomePage lang="es" />;
}
