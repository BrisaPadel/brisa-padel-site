import 'server-only';

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
  heroImageUrl: string;
  sources: ClubSource[];
  metaTags: ClubMetaTags;
  latitude: string | null;
  longitude: string | null;
  city: string;
  state: string;
  country: string;
};

export const UNVERIFIED = 'Not verified by club';

const API_BASE_URL = process.env.CLUBS_API_BASE_URL ?? 'http://localhost:8000';

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
  filters: { q?: string; setting?: string; limit?: number } = {}
): Promise<{ clubs: Club[]; total: number }> {
  const search = new URLSearchParams({ limit: String(filters.limit ?? 24) });
  if (filters.q?.trim()) search.set('q', filters.q.trim());
  if (filters.setting) search.set('setting', filters.setting);
  const data = await getJson<{ clubs: Club[]; total: number }>(`/api/clubs?${search.toString()}`);
  return { clubs: data?.clubs ?? [], total: data?.total ?? 0 };
}

/** Every published slug — used by the sitemap, which needs all of them. */
export async function listClubSlugs(): Promise<string[]> {
  const data = await getJson<{ slugs: string[] }>('/api/clubs/slugs');
  return data?.slugs ?? [];
}

export async function getClub(slug: string): Promise<Club | null> {
  const data = await getJson<{ club: Club }>(`/api/clubs/${encodeURIComponent(slug)}`);
  return data?.club ?? null;
}
