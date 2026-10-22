import type { Metadata } from 'next';
import MembershipPage from '@/components/MembershipPage';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Membresía | Brisa',
  description: 'Solicita membresía privada de Brisa en South Florida.',
  lang: 'es',
  basePath: '/membership'
});

export default function Page() {
  return <MembershipPage lang="es" />;
}
