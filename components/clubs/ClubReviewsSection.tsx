'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import ClubReviewForm from './ClubReviewForm';
import type { ClubReview } from '@/lib/clubs';

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
              <p className="mt-3 text-sm leading-relaxed text-stone-700">{review.experience}</p>
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
          }}
        />
      )}
    </section>
  );
}
