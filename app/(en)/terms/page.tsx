import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { termsEn } from '@/data/legal';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Terms | Brisa Padel',
  description: 'Brisa Padel terms of service.',
  lang: 'en',
  basePath: '/terms'
});

export default function Page() {
  return <LegalPage lang="en" kind="terms" sections={termsEn} />;
}
