'use client';

import { useRef, useState } from 'react';
import { ImagePlus, LoaderCircle, Star, Trash2, X } from 'lucide-react';
import {
  EXPERIENCE_MAX,
  EXPERIENCE_MIN,
  MATCH_TYPES,
  MAX_PHOTOS,
  MAX_PHOTO_BYTES,
  submitClubReview,
  type MatchType
} from '@/lib/club-reviews';

type PhotoDraft = { id: string; file: File; previewUrl: string };

export default function ClubReviewForm({
  slug,
  clubName,
  onClose,
  onSubmitted
}: {
  slug: string;
  clubName: string;
  onClose: () => void;
  onSubmitted: () => void;
}) {
  const [reviewerName, setReviewerName] = useState('');
  const [datePlayed, setDatePlayed] = useState('');
  const [matchType, setMatchType] = useState<MatchType>('Open Play');
  const [experience, setExperience] = useState('');
  const [rating, setRating] = useState(0);
  const [photos, setPhotos] = useState<PhotoDraft[]>([]);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // The server re-checks all of this; these messages exist so a mistake is
  // caught before a multi-megabyte upload is attempted.
  const addPhotos = (fileList: FileList | null) => {
    if (!fileList) return;
    const incoming = Array.from(fileList);
    const room = Math.max(0, MAX_PHOTOS - photos.length);

    if (incoming.length > room) {
      setError(`You can attach up to ${MAX_PHOTOS} photos.`);
    }

    const accepted: PhotoDraft[] = [];
    for (const file of incoming.slice(0, room)) {
      if (file.size > MAX_PHOTO_BYTES) {
        setError(`${file.name} is larger than 5 MB.`);
        continue;
      }
      accepted.push({
        file,
        id: `${file.name}-${file.size}-${accepted.length}-${photos.length}`,
        previewUrl: URL.createObjectURL(file)
      });
    }
    setPhotos((current) => [...current, ...accepted]);
  };

  const removePhoto = (id: string) => {
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === id);
      // Object URLs are leaked memory until revoked.
      if (target) URL.revokeObjectURL(target.previewUrl);
      return current.filter((photo) => photo.id !== id);
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!datePlayed) return setError('Add the date you played.');
    if (rating === 0) return setError('Add a star rating.');
    if (experience.trim().length < EXPERIENCE_MIN) {
      return setError(`Tell us a little more — at least ${EXPERIENCE_MIN} characters.`);
    }

    setIsSubmitting(true);
    const result = await submitClubReview(slug, {
      datePlayed,
      experience: experience.trim(),
      matchType,
      photos: photos.map((photo) => photo.file),
      rating,
      reviewerName: reviewerName.trim()
    });
    setIsSubmitting(false);

    if (!result.ok) return setError(result.message);
    photos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
    onSubmitted();
  };

  return (
    <section
      className="fixed inset-0 z-[70] flex items-end bg-stone-950/50 sm:items-center sm:justify-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="club-review-title"
    >
      <form
        onSubmit={handleSubmit}
        className="max-h-[94vh] w-full max-w-xl overflow-y-auto bg-[#fffdfb] p-6 shadow-2xl sm:p-8"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#F26419]">
              Your club intelligence
            </p>
            <h2
              id="club-review-title"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="mt-1 text-3xl font-bold text-stone-900"
            >
              Review {clubName}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-900"
            aria-label="Close review form"
          >
            <X size={20} />
          </button>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-stone-500">
          Write a concise report from a match you played. Your review is published once Brisa
          has approved it.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <label>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.13em] text-stone-500">
              Your name (optional)
            </span>
            <input
              value={reviewerName}
              onChange={(event) => setReviewerName(event.target.value)}
              maxLength={80}
              placeholder="Shown as Anonymous player if blank"
              className="mt-2 w-full border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#F26419] focus:ring-2 focus:ring-[#F26419]/15"
            />
          </label>
          <label>
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.13em] text-stone-500">
              Date played
            </span>
            <input
              type="date"
              value={datePlayed}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(event) => setDatePlayed(event.target.value)}
              className="mt-2 w-full border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#F26419] focus:ring-2 focus:ring-[#F26419]/15"
            />
          </label>
        </div>

        <label className="mt-4 block">
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.13em] text-stone-500">
            Match type
          </span>
          <select
            value={matchType}
            onChange={(event) => setMatchType(event.target.value as MatchType)}
            className="mt-2 w-full border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#F26419] focus:ring-2 focus:ring-[#F26419]/15"
          >
            {MATCH_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="mt-6">
          <legend className="text-[0.65rem] font-bold uppercase tracking-[0.13em] text-stone-500">
            1–5 star rating
          </legend>
          <div className="mt-2 flex gap-1">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                className="p-1.5"
                aria-label={`${value} star${value === 1 ? '' : 's'}`}
              >
                <Star
                  size={29}
                  className={value <= rating ? 'fill-[#F26419] text-[#F26419]' : 'text-stone-300'}
                />
              </button>
            ))}
          </div>
        </fieldset>

        <label className="mt-6 block">
          <span className="text-[0.65rem] font-bold uppercase tracking-[0.13em] text-stone-500">
            Your experience
          </span>
          <textarea
            rows={5}
            maxLength={EXPERIENCE_MAX}
            value={experience}
            onChange={(event) => setExperience(event.target.value)}
            placeholder="What should players know before they book?"
            className="mt-2 w-full resize-none border border-stone-300 bg-white px-3 py-3 text-sm leading-relaxed outline-none placeholder:text-stone-400 focus:border-[#F26419] focus:ring-2 focus:ring-[#F26419]/15"
          />
          <span className="mt-1 block text-right text-xs text-stone-400">
            {experience.length}/{EXPERIENCE_MAX}
          </span>
        </label>

        <div className="mt-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.13em] text-stone-500">
                Photos from your visit
              </p>
              <p className="mt-1 text-sm text-stone-500">
                JPEG, PNG or WebP · 5 MB each · up to {MAX_PHOTOS} photos
              </p>
            </div>
            <button
              type="button"
              onClick={() => photoInputRef.current?.click()}
              className="inline-flex items-center gap-2 border-2 border-[#F26419] bg-white px-3.5 py-2.5 text-xs font-bold uppercase tracking-[0.1em] text-[#c44b0c] transition-colors hover:bg-[#F26419] hover:text-white"
            >
              <ImagePlus size={15} /> Add photos
            </button>
          </div>
          <input
            ref={photoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="sr-only"
            aria-label="Add review photos"
            onChange={(event) => {
              addPhotos(event.target.files);
              event.currentTarget.value = '';
            }}
          />
          {photos.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative aspect-square overflow-hidden border border-stone-200 bg-stone-100"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photo.previewUrl}
                    alt="Review photo preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(photo.id)}
                    className="absolute right-1 top-1 rounded-full bg-stone-950/75 p-1.5 text-white"
                    aria-label={`Remove ${photo.file.name}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <p role="alert" className="mt-5 border-l-2 border-red-500 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="mt-5 border-l-2 border-[#F26419] bg-[#fff5ef] px-3 py-2.5 text-xs leading-relaxed text-stone-600">
          Your review and photos are stored securely, then shown publicly only after Brisa
          approves them.
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="border border-stone-300 px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-stone-600 hover:border-stone-900 hover:text-stone-900 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center gap-2 bg-[#F26419] px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-[#d9500b] disabled:opacity-60"
          >
            {isSubmitting && <LoaderCircle size={14} className="animate-spin" />}
            {isSubmitting ? 'Sending…' : 'Submit review'}
          </button>
        </div>
      </form>
    </section>
  );
}
