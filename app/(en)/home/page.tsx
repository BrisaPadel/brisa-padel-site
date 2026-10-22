import type { Metadata } from 'next';
import HomePage from '@/components/HomePage';
import { translations } from '@/data/i18n';
import { buildMetadata } from '@/lib/seo';

const t = translations.en;

// SEO fix: /home is a duplicate of /, so it canonicalises to / instead of itself.
export const metadata: Metadata = buildMetadata({
  title: t.pageTitle,
  description: t.pageDescription,
  lang: 'en',
  basePath: ''
});

export default function Page() {
  return <HomePage lang="en" />;
}
