/** How feet convert to metres. Exact by definition. */
const METRES_PER_FOOT = 0.3048;

export type ClubStandardTone = 'orange' | 'charcoal' | 'stone' | 'red' | 'pending';

export type ClubStandardClassification = {
  label: 'World-Class' | 'Elite' | 'Solid' | 'Investment Needed' | 'Assessment Pending';
  tone: ClubStandardTone;
};

/**
 * Maps Brisa's manual 1-10 editorial assessment onto the agreed wording:
 * 10 World-Class, above 8 Elite, 6 to 8 Solid, below 6 Investment Needed.
 *
 * Deliberately separate from the player rating. A club Brisa has not assessed
 * reads "Assessment Pending" rather than being given a made-up score, and an
 * out-of-range number is treated the same way — a public club page should never
 * fail to render because one admin field holds a bad value.
 */
export function classifyClubStandard(score: number | null | undefined): ClubStandardClassification {
  if (score === null || score === undefined) return { label: 'Assessment Pending', tone: 'pending' };
  if (!Number.isFinite(score) || score < 1 || score > 10) {
    return { label: 'Assessment Pending', tone: 'pending' };
  }
  if (score === 10) return { label: 'World-Class', tone: 'orange' };
  if (score > 8) return { label: 'Elite', tone: 'charcoal' };
  if (score >= 6) return { label: 'Solid', tone: 'stone' };
  return { label: 'Investment Needed', tone: 'red' };
}

/**
 * Indoor clearance in both units when the club confirmed a number, otherwise the
 * free-text line as-is — that is where "Not applicable - outdoor courts" and the
 * unverified placeholder live.
 */
export function formatCeilingHeight(club: {
  ceilingHeight: string;
  ceilingHeightFeet: number | null;
}): string {
  const feet = club.ceilingHeightFeet;
  if (feet === null || !Number.isFinite(feet) || feet <= 0) return club.ceilingHeight;
  const metres = (feet * METRES_PER_FOOT).toFixed(1);
  // A whole number of feet should read "32 ft", not "32.0 ft".
  return `${Number.isInteger(feet) ? feet : feet.toFixed(1)} ft / ${metres} m`;
}
