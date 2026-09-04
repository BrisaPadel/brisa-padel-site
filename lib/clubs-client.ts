import type { Club } from './clubs';
import { serializeClubFilters, type ClubFilters } from './club-filters';

/** Cards fetched per page. Matches the API's own default. */
export const PAGE_SIZE = 24;

/** How long to wait after the last keystroke before querying the API. */
export const SEARCH_DEBOUNCE_MS = 400;

/**
 * Always same-origin. Behind nginx, /api/* is proxied to the API server; when
 * the portal runs on its own port, next.config.ts rewrites /api/clubs to it.
 * Either way no API host is compiled into the client bundle, so one build works
 * in both places.
 */
const API_BASE_URL = '';

export type ClubsPage = {
  clubs: Club[];
  total: number;
  page: number;
  hasMore: boolean;
};

/** The area and city values published clubs actually use, with their counts. */
export type ClubFilterOptions = {
  areas: Array<{ name: string; count: number }>;
  cities: Array<{ name: string; count: number }>;
};

/**
 * Options for the filter modal. Returns empty lists on failure rather than
 * throwing: the modal still opens, just without area and city choices, which
 * beats blocking every other filter because one request blipped.
 */
export async function fetchClubFilterOptions(): Promise<ClubFilterOptions> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/clubs/filters`, {
      headers: { accept: 'application/json' }
    });
    if (!response.ok) throw new Error(`Filter options failed: ${response.status}`);
    const payload = (await response.json()) as { success?: boolean; data?: ClubFilterOptions };
    if (!payload?.success || !payload.data) throw new Error('Malformed filter options');
    return payload.data;
  } catch {
    return { areas: [], cities: [] };
  }
}

export async function fetchClubs(params: ClubFilters & { page: number }): Promise<ClubsPage> {
  // Reuses the same serializer as the address bar, so what the API is asked for
  // and what the URL claims can never drift apart.
  const search = new URLSearchParams(serializeClubFilters(params));
  search.set('page', String(params.page));
  search.set('limit', String(PAGE_SIZE));

  try {
    const response = await fetch(`${API_BASE_URL}/api/clubs?${search.toString()}`, {
      headers: { accept: 'application/json' }
    });
    if (!response.ok) throw new Error(`Clubs request failed: ${response.status}`);
    const payload = (await response.json()) as { success?: boolean; data?: ClubsPage };
    if (!payload?.success || !payload.data) throw new Error('Malformed clubs response');
    return payload.data;
  } catch {
    // Keep the page usable if the API blips: report an empty page rather than
    // throwing into the client component and blanking the directory.
    return { clubs: [], total: 0, page: params.page, hasMore: false };
  }
}
