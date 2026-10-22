import type { Metadata } from 'next';
import MembershipPage from '@/components/MembershipPage';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Membership | Brisa',
  description: 'Apply to Brisa private membership in South Florida.',
  lang: 'en',
  basePath: '/membership'
});

export default function Page() {
  return <MembershipPage lang="en" />;
}
