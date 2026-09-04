'use client';

import { useEffect, useState } from 'react';
import { Check, LoaderCircle, Star, X } from 'lucide-react';
import { EMPTY_FILTERS, countActiveFilters, type ClubFilters, type Setting } from '@/lib/club-filters';
import { fetchClubFilterOptions, type ClubFilterOptions } from '@/lib/clubs-client';

const SETTINGS: Setting[] = ['All', 'Indoor', 'Outdoor'];

function Section({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-stone-100 pt-5 first:border-t-0 first:pt-0">
      <p className="text-[0.65rem] font-bold uppercase tracking-[0.13em] text-stone-500">{title}</p>
      {hint && <p className="mt-1 text-xs text-stone-400">{hint}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

/** Square, orange-when-selected chip, matching the directory's own controls. */
function Chip({
  label,
  count,
  selected,
  onClick
}: {
  label: string;
  count?: number;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`inline-flex items-center gap-1.5 border px-3 py-2 text-xs font-semibold transition-colors ${
        selected
          ? 'border-[#F26419] bg-[#F26419] text-white'
          : 'border-stone-200 text-stone-600 hover:border-[#F26419]/50 hover:text-[#F26419]'
      }`}
    >
      {selected && <Check size={12} />}
      {label}
      {count !== undefined && (
        <span className={selected ? 'text-white/70' : 'text-stone-400'}>{count}</span>
      )}
    </button>
  );
}

/**
 * The directory's filter panel.
 *
 * Edits a local copy and only reports it on Apply, so a half-built selection
 * never rewrites the URL or refetches on every click. Cancel therefore discards
 * cleanly, and Apply is a single navigation.
 */
export default function ClubFilterModal({
  initial,
  onApply,
  onClose
}: {
  initial: ClubFilters;
  onApply: (filters: ClubFilters) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<ClubFilters>(initial);
  const [options, setOptions] = useState<ClubFilterOptions>({ areas: [], cities: [] });
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [showAllCities, setShowAllCities] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void fetchClubFilterOptions().then((result) => {
      if (cancelled) return;
      setOptions(result);
      setLoadingOptions(false);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const toggleIn = (key: 'areas' | 'cities', value: string) =>
    setDraft((current) => ({
      ...current,
      [key]: current[key].includes(value)
        ? current[key].filter((entry) => entry !== value)
        : [...current[key], value]
    }));

  /** Clicking the chosen value again clears it, so a minimum needs no "Any". */
  const toggleNumber = (key: 'minRating' | 'minStandard', value: number) =>
    setDraft((current) => ({ ...current, [key]: current[key] === value ? null : value }));

  // 199 cities is far too many to render as chips, so the list is capped until
  // asked for. Selected ones are pinned in so a choice never scrolls out of it.
  const CITY_PREVIEW = 12;
  const visibleCities = showAllCities
    ? options.cities
    : options.cities.filter(
        (city, index) => index < CITY_PREVIEW || draft.cities.includes(city.name)
      );

  const activeCount = countActiveFilters(draft);

  return (
    <section
      className="fixed inset-0 z-[80] flex items-end bg-stone-950/50 sm:items-center sm:justify-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="club-filter-title"
    >
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col bg-[#fffdfb] shadow-2xl">
        <header className="flex items-start justify-between gap-4 border-b border-stone-200 p-6 pb-4">
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-[#F26419]">
              Narrow the directory
            </p>
            <h2
              id="club-filter-title"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="mt-1 text-3xl font-bold text-stone-900"
            >
              Filters
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-500 hover:text-stone-900"
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        </header>

        <div className="flex-1 space-y-5 overflow-y-auto p-6">
          <Section title="Court setting">
            <div className="flex flex-wrap gap-2">
              {SETTINGS.map((setting) => (
                <Chip
                  key={setting}
                  label={setting}
                  selected={draft.setting === setting}
                  onClick={() => setDraft((current) => ({ ...current, setting }))}
                />
              ))}
            </div>
          </Section>

          <Section title="Area">
            {loadingOptions ? (
              <LoaderCircle size={16} className="animate-spin text-stone-300" />
            ) : (
              <div className="flex flex-wrap gap-2">
                {options.areas.map((area) => (
                  <Chip
                    key={area.name}
                    label={area.name}
                    count={area.count}
                    selected={draft.areas.includes(area.name)}
                    onClick={() => toggleIn('areas', area.name)}
                  />
                ))}
              </div>
            )}
          </Section>

          <Section title="City">
            {loadingOptions ? (
              <LoaderCircle size={16} className="animate-spin text-stone-300" />
            ) : (
              <>
                <div className="flex flex-wrap gap-2">
                  {visibleCities.map((city) => (
                    <Chip
                      key={city.name}
                      label={city.name}
                      count={city.count}
                      selected={draft.cities.includes(city.name)}
                      onClick={() => toggleIn('cities', city.name)}
                    />
                  ))}
                </div>
                {options.cities.length > CITY_PREVIEW && (
                  <button
                    type="button"
                    onClick={() => setShowAllCities((current) => !current)}
                    className="mt-3 text-xs font-bold uppercase tracking-[0.1em] text-[#c44b0c] hover:text-[#F26419]"
                  >
                    {showAllCities
                      ? 'Show fewer cities'
                      : `Show all ${options.cities.length} cities`}
                  </button>
                )}
              </>
            )}
          </Section>

          <Section title="Minimum player rating" hint="Based on approved player reviews.">
            <div className="flex flex-wrap gap-2">
              {[3, 4, 5].map((value) => (
                <Chip
                  key={value}
                  label={`${value}★ and up`}
                  selected={draft.minRating === value}
                  onClick={() => toggleNumber('minRating', value)}
                />
              ))}
            </div>
          </Section>

          <Section
            title="Minimum Brisa Club Standard"
            hint="Brisa's own 1-10 assessment. Clubs not yet assessed are excluded."
          >
            <div className="flex flex-wrap gap-2">
              {[5, 7, 9].map((value) => (
                <Chip
                  key={value}
                  label={`${value}+ / 10`}
                  selected={draft.minStandard === value}
                  onClick={() => toggleNumber('minStandard', value)}
                />
              ))}
            </div>
          </Section>

          <Section title="Club has">
            <div className="flex flex-wrap gap-2">
              <Chip
                label="Coaching listed"
                selected={draft.hasCoaches}
                onClick={() => setDraft((current) => ({ ...current, hasCoaches: !current.hasCoaches }))}
              />
              <Chip
                label="Photos"
                selected={draft.hasPhotos}
                onClick={() => setDraft((current) => ({ ...current, hasPhotos: !current.hasPhotos }))}
              />
            </div>
          </Section>

         
        </div>

        <footer className="flex items-center justify-between gap-3 border-t border-stone-200 p-6 pt-4">
          <button
            type="button"
            // Keeps the typed search: it lives in its own visible input, and
            // wiping it from in here would look like the page lost the text.
            onClick={() => setDraft({ ...EMPTY_FILTERS, q: draft.q })}
            disabled={activeCount === 0}
            className="text-xs font-bold uppercase tracking-[0.1em] text-stone-500 hover:text-stone-900 disabled:opacity-40"
          >
            Clear all
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="border border-stone-300 px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-stone-600 hover:border-stone-900 hover:text-stone-900"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onApply(draft)}
              className="bg-[#F26419] px-5 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white hover:bg-[#d9500b]"
            >
              Apply{activeCount > 0 ? ` (${activeCount})` : ''}
            </button>
          </div>
        </footer>
      </div>
    </section>
  );
}
