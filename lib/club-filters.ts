/**
 * URL ⇄ filter state for the club directory.
 *
 * Follows the admin app's match filters: the query string is the single source
 * of truth, so a filtered view is a link someone can share, bookmark or reload
 * and get back exactly. Nothing about the applied filters lives only in React
 * state, which is also what lets the server render page one already filtered.
 *
 * Everything parses defensively. These params arrive from a URL anyone can
 * hand-edit, so a malformed value narrows to nothing or falls back to the
 * default rather than throwing a visitor onto an error page.
 */

export type Setting = 'All' | 'Indoor' | 'Outdoor';

export type ClubFilters = {
  q: string;
  setting: Setting;
  areas: string[];
  cities: string[];
  /** Minimum average player rating, 1-5. Null means no rating requirement. */
  minRating: number | null;
  /** Minimum Brisa Club Standard, 1-10. Null means unscored clubs are kept. */
  minStandard: number | null;
  hasCoaches: boolean;
  hasPhotos: boolean;
};

export const EMPTY_FILTERS: ClubFilters = {
  areas: [],
  cities: [],
  hasCoaches: false,
  hasPhotos: false,
  minRating: null,
  minStandard: null,
  q: '',
  setting: 'All'
};

/**
 * Lists travel comma-separated (`?areas=Texas,California`). URLSearchParams
 * percent-encodes the value, so spaces and accents are safe; a value containing
 * a literal comma would split, and no area or city name contains one.
 */
const readList = (params: URLSearchParams, key: string) =>
  (params.get(key) ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);

const readBoundedInt = (params: URLSearchParams, key: string, min: number, max: number) => {
  const raw = (params.get(key) ?? '').trim();
  if (!raw) return null;
  const parsed = Number.parseInt(raw, 10);
  if (!Number.isFinite(parsed) || parsed < min || parsed > max) return null;
  return parsed;
};

/** Query string → filters. Accepts a leading "?" or a bare string. */
export function parseClubFilters(search: string): ClubFilters {
  const params = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);
  const setting = params.get('setting');

  return {
    areas: readList(params, 'areas'),
    cities: readList(params, 'cities'),
    hasCoaches: params.get('hasCoaches') === 'true',
    hasPhotos: params.get('hasPhotos') === 'true',
    minRating: readBoundedInt(params, 'minRating', 1, 5),
    minStandard: readBoundedInt(params, 'minStandard', 1, 10),
    q: (params.get('q') ?? '').trim(),
    setting: setting === 'Indoor' || setting === 'Outdoor' ? setting : 'All'
  };
}

/**
 * Filters → query string, without the leading "?".
 *
 * Defaults are omitted rather than written out, unlike the admin's match
 * filters: this is a public, indexed page, so the unfiltered directory has to
 * keep the clean `/clubs` URL instead of a query string full of empty values
 * that search engines would treat as a separate address.
 */
export function serializeClubFilters(filters: ClubFilters): string {
  const params = new URLSearchParams();

  if (filters.q.trim()) params.set('q', filters.q.trim());
  if (filters.setting !== 'All') params.set('setting', filters.setting);
  if (filters.areas.length > 0) params.set('areas', filters.areas.join(','));
  if (filters.cities.length > 0) params.set('cities', filters.cities.join(','));
  if (filters.minRating !== null) params.set('minRating', String(filters.minRating));
  if (filters.minStandard !== null) params.set('minStandard', String(filters.minStandard));
  if (filters.hasCoaches) params.set('hasCoaches', 'true');
  if (filters.hasPhotos) params.set('hasPhotos', 'true');

  return params.toString();
}

/** Query string with the leading "?", or "" when nothing is applied. */
export function toClubQueryString(filters: ClubFilters): string {
  const search = serializeClubFilters(filters);
  return search ? `?${search}` : '';
}

/**
 * How many filters are applied, for the badge on the Filter button.
 *
 * The free-text search is excluded: it has its own visible input, so counting
 * it would make the button claim a filter the visitor cannot find inside it.
 * Each list counts once however many values it holds, matching how a visitor
 * reads "Area" as one thing they narrowed by.
 */
export function countActiveFilters(filters: ClubFilters): number {
  return [
    filters.setting !== 'All',
    filters.areas.length > 0,
    filters.cities.length > 0,
    filters.minRating !== null,
    filters.minStandard !== null,
    filters.hasCoaches,
    filters.hasPhotos
  ].filter(Boolean).length;
}
