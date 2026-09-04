import type { Metadata } from 'next';
import MembershipPage from '@/components/MembershipPage';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Membresía | Brisa Padel',
  description: 'Solicita membresía privada de Brisa Padel en South Florida.',
  lang: 'es',
  basePath: '/membership'
});

export default function Page() {
  return <MembershipPage lang="es" />;
}
