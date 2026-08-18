import type { Metadata } from 'next';
import HomePage from '@/components/HomePage';
import LangPreferenceRedirect from '@/components/LangPreferenceRedirect';
import { translations } from '@/data/i18n';
import { buildMetadata } from '@/lib/seo';

const t = translations.en;

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
