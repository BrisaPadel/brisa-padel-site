import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { privacyEn } from '@/data/legal';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Privacy | Brisa Padel',
  description: 'Brisa Padel privacy policy.',
  lang: 'en',
  basePath: '/privacy'
});

export default function Page() {
  return <LegalPage lang="en" kind="privacy" sections={privacyEn} />;
}
