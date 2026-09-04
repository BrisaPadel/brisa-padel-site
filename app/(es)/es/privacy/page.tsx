import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { privacyEs } from '@/data/legal';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Privacidad | Brisa Padel',
  description: 'Política de privacidad de Brisa Padel.',
  lang: 'es',
  basePath: '/privacy'
});

export default function Page() {
  return <LegalPage lang="es" kind="privacy" sections={privacyEs} />;
}
