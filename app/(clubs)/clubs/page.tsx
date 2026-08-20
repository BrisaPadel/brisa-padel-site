import type { Metadata } from 'next';
import ClubsDirectory from '@/components/clubs/ClubsDirectory';
import { listClubs } from '@/lib/clubs';
import { buildMetadata } from '@/lib/seo';
import { countActiveFilters, parseClubFilters } from '@/lib/club-filters';

// Always reflect the current database state rather than a cached render.
export const dynamic = 'force-dynamic';

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

/**
 * Next gives repeated params as arrays; the filter parser speaks query strings,
 * so the params are put back into one. Rebuilding it here rather than reading
 * each key by hand keeps a single definition of how a filter is spelled.
 */
const toSearchString = (params: Record<string, string | string[] | undefined>) => {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    const first = Array.isArray(value) ? value[0] : value;
    if (first !== undefined) search.set(key, first);
  }
  return search.toString();
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const filters = parseClubFilters(toSearchString(await searchParams));
  const isFiltered = Boolean(filters.q) || countActiveFilters(filters) > 0;

  return buildMetadata({
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
}

export default async function Page({ searchParams }: PageProps) {
  const filters = parseClubFilters(toSearchString(await searchParams));

  // Rendered on the server with the filters already applied, so a shared or
  // reloaded URL shows the same results without waiting for client JavaScript.
  // The same serializer feeds the API and the address bar, so the two agree.
  const { clubs, total } = await listClubs(filters);

  return <ClubsDirectory initialClubs={clubs} initialTotal={total} initialFilters={filters} />;
}
