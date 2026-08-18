import type { Metadata } from 'next';
import ClubsDirectory from '@/components/clubs/ClubsDirectory';
import { listClubs } from '@/lib/clubs';
import { buildMetadata } from '@/lib/seo';

// Always reflect the current database state rather than a cached render.
export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams: Promise<{ q?: string | string[]; setting?: string | string[] }>;
};

const first = (value: string | string[] | undefined) =>
  (Array.isArray(value) ? value[0] : value) ?? '';

/** Only the two real settings filter; anything else means "all". */
const normalizeSetting = (value: string) =>
  value === 'Indoor' || value === 'Outdoor' ? value : '';

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const params = await searchParams;
  const query = first(params.q).trim();
  const setting = normalizeSetting(first(params.setting));
  const isFiltered = Boolean(query || setting);

  const metadata = buildMetadata({
    title: 'Miami Padel Clubs | Brisa Club Intelligence',
    description:
      'A transparent Miami padel club directory: court environment, pricing visibility, coach access, operating hours, and verified facility facts.',
    lang: 'en',
    // Filtered views canonicalise to the bare directory, so search engines
    // consolidate them instead of treating each combination as its own page.
    basePath: '/clubs',
    // A filtered result set is a view of the same content, not new content.
    index: !isFiltered
  });

  return metadata;
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = first(params.q).trim();
  const setting = normalizeSetting(first(params.setting));

  // Rendered on the server with the filters already applied, so a shared or
  // reloaded URL shows the same results without waiting for client JavaScript.
  const { clubs, total } = await listClubs({ q: query, setting });

  return (
    <ClubsDirectory
      initialClubs={clubs}
      initialTotal={total}
      initialQuery={query}
      initialSetting={setting === '' ? 'All' : (setting as 'Indoor' | 'Outdoor')}
    />
  );
}
