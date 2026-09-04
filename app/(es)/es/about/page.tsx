import type { Metadata } from 'next';
import AboutPage from '@/components/AboutPage';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Nosotros | Brisa Padel',
  description: 'Sobre Brisa Padel y nuestra plataforma privada de matchmaking.',
  lang: 'es',
  basePath: '/about'
});

export default function Page() {
  return <AboutPage lang="es" />;
}
