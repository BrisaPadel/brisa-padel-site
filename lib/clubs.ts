import 'server-only';
import { cache } from 'react';
import { EMPTY_FILTERS, serializeClubFilters, type ClubFilters } from './club-filters';

/** Mirrors PublicClub in brisa-padel-server/src/modules/clubs/types. */
export type ClubMetaTags = {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  robots?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
};

export type ClubSource = { label: string; href: string };

export type ClubReview = {
  id: string;
  reviewerName: string;
  datePlayed: string;
  matchType: string;
  experience: string;
  rating: number;
  images: Array<{ id: string; imageUrl: string }>;
};

export type Club = {
  id: string;
  slug: string;
  name: string;
  neighborhood: string;
  address: string;
  website: string;
  phone: string;
  whatsapp: string;
  hours: string;
  setting: string;
  courtCount: string;
  climateControl: string;
  ceilingHeight: string;
  /** Null when the club gave no number; `ceilingHeight` is the fallback text. */
  ceilingHeightFeet: number | null;
  /** Brisa's 1-10 editorial score. Null means the club is unassessed. */
  brisaClubStandardScore: number | null;
  peakOffPeakTimes: string;
  peakRate: string;
  offPeakRate: string;
  coaches: string[];
  courtReplacement: string;
  courtQuality: string;
  outsidePlayRoom: string;
  courtSpeed: string;
  facilityCleanliness: string;
  showerQuality: string;
  vibe: string;
  description: string;
  ownership: string;
  /** Uploaded gallery in display order; the first is also `heroImageUrl`. */
  images: string[];
  heroImageUrl: string;
  sources: ClubSource[];
  metaTags: ClubMetaTags;
  /** Approved reviews only; averageRating is null when a club has none. */
  reviewCount: number;
  averageRating: number | null;
  latitude: string | null;
  longitude: string | null;
  city: string;
  state: string;
  country: string;
};

export const UNVERIFIED = 'Not verified by club';

// Server Components run inside the `brisa-padel-site` container in production,
// where localhost points back to that container rather than to the API. Both
// production containers share the `brisa` Docker network, so use Docker DNS as
// the safe production default while retaining localhost for local development.
const API_BASE_URL =
  process.env.CLUBS_API_BASE_URL ??
  (process.env.NODE_ENV === 'production'
    ? 'http://brisa_server:8000'
    : 'http://localhost:8000');

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      // Rendered fresh on every request, so a console edit is live immediately.
      cache: 'no-store',
      headers: { accept: 'application/json' }
    });
    if (!response.ok) return null;
    const payload = (await response.json()) as { success?: boolean; data?: T };
    return payload?.success ? (payload.data ?? null) : null;
  } catch {
    // A directory page is worth rendering empty rather than 500ing if the API
    // is briefly unavailable; the caller decides what to show.
    return null;
  }
}

export async function listClubs(
  filters: Partial<ClubFilters> & { limit?: number } = {}
): Promise<{ clubs: Club[]; total: number }> {
  // The same serializer the browser and the address bar use, so the first
  // server-rendered page cannot be built from different filters than the ones
  // the URL advertises.
  const search = new URLSearchParams(
    serializeClubFilters({ ...EMPTY_FILTERS, ...filters })
  );
  search.set('limit', String(filters.limit ?? 24));
  const data = await getJson<{ clubs: Club[]; total: number }>(`/api/clubs?${search.toString()}`);
  return { clubs: data?.clubs ?? [], total: data?.total ?? 0 };
}

export async function listClubReviews(slug: string): Promise<ClubReview[]> {
  const data = await getJson<{ reviews: ClubReview[] }>(
    `/api/clubs/${encodeURIComponent(slug)}/reviews`
  );
  return data?.reviews ?? [];
}

/** Every published slug — used by the sitemap, which needs all of them. */
export async function listClubSlugs(): Promise<string[]> {
  const data = await getJson<{ slugs: string[] }>('/api/clubs/slugs');
  return data?.slugs ?? [];
}

/**
 * Wrapped in React's `cache` so generateMetadata() and the page component share
 * one call per request. Both need the club, and both run on every request
 * because the route is force-dynamic with `cache: 'no-store'` — the setting
 * that also switches off Next's own fetch memoisation, so without this the API
 * is hit twice for every club page a crawler visits.
 */
export const getClub = cache(async (slug: string): Promise<Club | null> => {
  const data = await getJson<{ club: Club }>(`/api/clubs/${encodeURIComponent(slug)}`);
  return data?.club ?? null;
});
