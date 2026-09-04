/** Mirrors CLUB_REVIEW_MATCH_TYPES on the server; the API rejects anything else. */
export const MATCH_TYPES = [
  'Open Play',
  'Competitive Match',
  'Networking Match',
  'Lesson / Clinic',
  'Tournament',
  'Other'
] as const;

export type MatchType = (typeof MATCH_TYPES)[number];

export const EXPERIENCE_MIN = 20;
export const EXPERIENCE_MAX = 1000;
export const MAX_PHOTOS = 5;
export const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

const API_BASE_URL = '';

/** Statuses a member can see on their own review. */
export type AuthoredReviewStatus = 'pending' | 'approved' | 'rejected' | 'removed';

export type AuthoredReview = {
  id: string;
  status: AuthoredReviewStatus;
  datePlayed: string;
  matchType: string;
  experience: string;
  rating: number;
  createdAt: string;
};

/**
 * The signed-in member's own reviews of one club, including the ones the public
 * list hides. Returns an empty list rather than an error when the session has
 * expired: this only decorates the page, and a stale token should not stop the
 * reviews themselves from rendering.
 */
export async function fetchMyReviews(slug: string, token: string): Promise<AuthoredReview[]> {
  if (!token) return [];
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/clubs/${encodeURIComponent(slug)}/reviews/mine`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!response.ok) return [];
    const payload = (await response.json().catch(() => null)) as
      | { success?: boolean; data?: { reviews?: AuthoredReview[] } }
      | null;
    return payload?.data?.reviews ?? [];
  } catch {
    return [];
  }
}

export type SubmitReviewResult =
  | { ok: true }
  // `expired` lets the form send the member back to sign-in instead of showing
  // a dead-end error, which is the one failure they can actually act on.
  | { ok: false; message: string; expired?: boolean };

/**
 * Same-origin, exactly like the directory search: nginx proxies /api to the API
 * server, and next.config rewrites it when the portal runs on its own port.
 */
export async function submitClubReview(
  slug: string,
  input: {
    reviewerName: string;
    datePlayed: string;
    matchType: string;
    experience: string;
    rating: number;
    photos: File[];
  },
  /** Member access token; the endpoint rejects the request without it. */
  token: string
): Promise<SubmitReviewResult> {
  const form = new FormData();
  form.set('reviewerName', input.reviewerName);
  form.set('datePlayed', input.datePlayed);
  form.set('matchType', input.matchType);
  form.set('experience', input.experience);
  form.set('rating', String(input.rating));
  input.photos.forEach((photo) => form.append('photos', photo));

  try {
    const response = await fetch(`${API_BASE_URL}/api/clubs/${encodeURIComponent(slug)}/reviews`, {
      body: form,
      // Content-Type is left unset on purpose: the browser must add the
      // multipart boundary itself, and setting it here would break the upload.
      headers: { Authorization: `Bearer ${token}` },
      method: 'POST'
    });
    const payload = (await response.json().catch(() => null)) as
      | { success?: boolean; message?: string }
      | null;

    if (response.status === 401 || response.status === 403) {
      return {
        expired: true,
        message: 'Your sign-in has expired. Please sign in again to post your review.',
        ok: false
      };
    }

    if (!response.ok || !payload?.success) {
      return {
        message:
          payload?.message ||
          'We could not submit your review. Please try again in a moment.',
        ok: false
      };
    }
    return { ok: true };
  } catch {
    return { message: 'We could not reach the server. Please try again.', ok: false };
  }
}
