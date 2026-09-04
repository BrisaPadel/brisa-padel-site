'use client';

import { useCallback, useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import ClubReviewForm from './ClubReviewForm';
import type { ClubReview } from '@/lib/clubs';
import { fetchMyReviews, type AuthoredReview, type AuthoredReviewStatus } from '@/lib/club-reviews';
import { storedToken } from '@/lib/site-auth';

/**
 * How each hidden status is explained to the member who wrote it.
 *
 * `rejected` and `removed` are worded differently on purpose: one is a verdict
 * on what they wrote, the other is the review being taken down. Telling someone
 * their review was "rejected" when an admin simply deleted it would misrepresent
 * what happened.
 */
const AUTHOR_STATUS: Record<
  Exclude<AuthoredReviewStatus, 'approved'>,
  { title: string; detail: string; className: string }
> = {
  pending: {
    className: 'border-[#F26419] bg-[#fff5ef]',
    detail: 'It will appear here publicly once Brisa has approved it.',
    title: 'Your review is being reviewed.'
  },
  rejected: {
    className: 'border-red-400 bg-red-50',
    detail: 'It did not meet Brisa’s review guidelines and will not be published.',
    title: 'Your review was rejected.'
  },
  removed: {
    className: 'border-stone-400 bg-stone-100',
    detail: 'It has been taken down by Brisa and is no longer published.',
    title: 'Your review was removed.'
  }
};

function Stars({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          size={size}
          className={index < Math.round(rating) ? 'fill-[#F26419] text-[#F26419]' : 'text-stone-300'}
        />
      ))}
    </div>
  );
}

/**
 * Approved reviews are server-rendered above; this owns only the parts that
 * need interaction — opening the form and confirming a submission.
 */
export default function ClubReviewsSection({
  slug,
  clubName,
  reviews
}: {
  slug: string;
  clubName: string;
  reviews: ClubReview[];
}) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [mine, setMine] = useState<AuthoredReview[]>([]);

  /**
   * A member's own reviews are fetched in the browser, not rendered on the
   * server: the page is statically cacheable per club, and personalising it
   * server-side would make one visitor's moderation state cacheable for all.
   */
  const refreshMine = useCallback(() => {
    const token = storedToken();
    if (!token) return setMine([]);
    void fetchMyReviews(slug, token).then(setMine);
  }, [slug]);

  useEffect(refreshMine, [refreshMine]);

  // Approved reviews are already in the public list below, so showing them
  // again as "yours" would duplicate them. Only the hidden states are news.
  // Typed as a guard so the status is narrowed for the AUTHOR_STATUS lookup,
  // which has no entry for `approved` by design.
  const pendingMine = mine.filter(
    (review): review is AuthoredReview & { status: Exclude<AuthoredReviewStatus, 'approved'> } =>
      review.status !== 'approved'
  );

  return (
    <section>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[0.65rem] font-bold uppercase tracking-[0.17em] text-[#F26419]">
            Player reports
          </p>
          <h2
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="mt-2 text-4xl font-bold text-stone-900"
          >
            Reviews by last date played
          </h2>
          <p className="mt-2 text-sm text-stone-500">
            Approved player reports appear newest first.
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-[#F26419] px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-[#d9500b]"
        >
          <Star size={14} /> Write a review
        </button>
      </div>

      {hasSubmitted && (
        <div className="mt-6 border-l-2 border-[#F26419] bg-[#fff5ef] px-4 py-3 text-sm leading-relaxed text-stone-700">
          Thanks — your review has been received and will appear here once Brisa has approved it.
        </div>
      )}

      {/* Visible only to the member who wrote them: pending, rejected and
          removed reviews are absent from the public list, so without this the
          author has no way to learn what became of their submission. */}
      {pendingMine.length > 0 && (
        <ul className="mt-6 space-y-2">
          {pendingMine.map((review) => {
            const tone = AUTHOR_STATUS[review.status];
            return (
              <li
                key={review.id}
                className={`border-l-2 px-4 py-3 text-sm leading-relaxed ${tone.className}`}
              >
                <span className="font-semibold">{tone.title}</span>{' '}
                <span className="text-stone-600">{tone.detail}</span>
                <span className="mt-1 block text-xs text-stone-400">
                  {review.matchType} · played {review.datePlayed}
                </span>
              </li>
            );
          })}
        </ul>
      )}

      {reviews.length > 0 ? (
        <div className="mt-6 divide-y divide-stone-200 border-y border-stone-200">
          {reviews.map((review) => (
            <article key={review.id} className="py-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Stars rating={review.rating} />
                  <span className="text-xs font-semibold text-stone-700">{review.matchType}</span>
                  <span className="text-xs text-stone-500">{review.reviewerName}</span>
                </div>
                <time className="text-xs text-stone-500" dateTime={review.datePlayed}>
                  {new Date(`${review.datePlayed}T12:00:00`).toLocaleDateString('en-US', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </time>
              </div>
              {/* Reviews are written in a textarea, so the paragraph breaks a
                  player typed are part of what they wrote. HTML collapses them
                  by default, which ran separate points together into one wall
                  of text. `pre-line` keeps the newlines while still wrapping
                  normally, and still collapses runs of spaces. */}
              <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-stone-700">
                {review.experience}
              </p>
              {review.images.length > 0 && (
                <div className="mt-4 grid max-w-lg grid-cols-2 gap-2 sm:grid-cols-3">
                  {review.images.map((image) => (
                    <a
                      key={image.id}
                      href={image.imageUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="aspect-video overflow-hidden border border-stone-200"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image.imageUrl}
                        alt="Photo shared with this club review"
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-200 hover:scale-105"
                      />
                    </a>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-6 border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
          <Star size={23} className="mx-auto text-[#F26419]" />
          <p className="mt-3 font-semibold text-stone-800">No player reviews yet.</p>
          <p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-stone-500">
            Be the first to add a report after you play. Nothing here is generated or estimated.
          </p>
        </div>
      )}

      {isFormOpen && (
        <ClubReviewForm
          slug={slug}
          clubName={clubName}
          onClose={() => setIsFormOpen(false)}
          onSubmitted={() => {
            setIsFormOpen(false);
            setHasSubmitted(true);
            // The submission is now one of the member's own reviews, so the
            // pending notice should appear without waiting for a reload.
            refreshMine();
          }}
        />
      )}
    </section>
  );
}
