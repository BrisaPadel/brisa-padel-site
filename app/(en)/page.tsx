import type { Metadata } from 'next';
import HomePage from '@/components/HomePage';
import LangPreferenceRedirect from '@/components/LangPreferenceRedirect';
import { translations } from '@/data/i18n';
import { buildMetadata } from '@/lib/seo';

const t = translations.en;

// Do not let Next.js retain the landing document between deployments. The
// matching response headers in next.config.ts also disable the outer nginx
// page cache; the large hero asset remains independently cacheable.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildMetadata({
  title: t.pageTitle,
  description: t.pageDescription,
  lang: 'en',
  basePath: ''
});

export default function Page() {
  return (
    <>
      <HomePage lang="en" />
      <LangPreferenceRedirect />
    </>
  );
}
