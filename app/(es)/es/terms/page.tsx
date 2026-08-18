import type { Metadata } from 'next';
import LegalPage from '@/components/LegalPage';
import { termsEs } from '@/data/legal';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Términos | Brisa Padel',
  description: 'Términos de servicio de Brisa Padel.',
  lang: 'es',
  basePath: '/terms'
});

export default function Page() {
  return <LegalPage lang="es" kind="terms" sections={termsEs} />;
}
