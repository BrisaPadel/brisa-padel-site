import type { Metadata } from 'next';
import ClubsDirectory from '@/components/clubs/ClubsDirectory';
import { listClubs } from '@/lib/clubs';
import { buildMetadata } from '@/lib/seo';

// Always reflect the current database state rather than a cached render.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = buildMetadata({
  title: 'Miami Padel Clubs | Brisa Club Intelligence',
  description:
    'A transparent Miami padel club directory: court environment, pricing visibility, coach access, operating hours, and verified facility facts.',
  lang: 'en',
  basePath: '/clubs'
});

export default async function Page() {
  // First page is server-rendered so crawlers and the initial paint have real
  // content; searching and paging after that happen against the API.
  const { clubs, total } = await listClubs();
  return <ClubsDirectory initialClubs={clubs} initialTotal={total} />;
}
