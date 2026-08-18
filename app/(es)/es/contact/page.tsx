import type { Metadata } from 'next';
import ContactPage from '@/components/ContactPage';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Contacto | Brisa Padel',
  description: 'Contacta al equipo de membresía de Brisa Padel.',
  lang: 'es',
  basePath: '/contact'
});

export default function Page() {
  return <ContactPage lang="es" />;
}
