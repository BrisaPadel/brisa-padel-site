import type { Metadata } from 'next';
import HomePage from '@/components/HomePage';
import { translations } from '@/data/i18n';
import { buildMetadata } from '@/lib/seo';

const t = translations.es;

// SEO fix: /es/home is a duplicate of /es, so it canonicalises to /es.
export const metadata: Metadata = buildMetadata({
  title: t.pageTitle,
  description: t.pageDescription,
  lang: 'es',
  basePath: ''
});

export default function Page() {
  return <HomePage lang="es" />;
}
