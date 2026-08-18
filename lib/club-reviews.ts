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

export type SubmitReviewResult = { ok: true } | { ok: false; message: string };

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
  }
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
      method: 'POST'
    });
    const payload = (await response.json().catch(() => null)) as
      | { success?: boolean; message?: string }
      | null;

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
