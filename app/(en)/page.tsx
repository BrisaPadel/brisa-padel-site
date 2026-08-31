import type { Metadata } from 'next';
import HomePage from '@/components/HomePage';
import LangPreferenceRedirect from '@/components/LangPreferenceRedirect';
import { translations } from '@/data/i18n';
import { buildMetadata } from '@/lib/seo';

const t = translations.en;

// The outer nginx layer previously retained this HTML for 24 hours, leaving
// visitors with an obsolete CloudFront hero URL after a deployment. Render the
// landing document dynamically so nginx receives a non-cacheable page response;
// the large local hero asset remains independently cacheable by the browser.
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
