import type { Club } from './clubs';

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

export async function fetchClubs(params: {
  q: string;
  setting: string;
  page: number;
}): Promise<ClubsPage> {
  const search = new URLSearchParams({
    page: String(params.page),
    limit: String(PAGE_SIZE)
  });
  if (params.q.trim()) search.set('q', params.q.trim());
  if (params.setting) search.set('setting', params.setting);

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
