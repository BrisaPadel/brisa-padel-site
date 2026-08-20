'use client';

/**
 * BRISA PADEL — Club Intelligence Directory (/clubs)
 * Ported from the prototype's Clubs.tsx. Markup and classes are unchanged; the
 * club list now arrives from the API as a prop instead of a static constant,
 * and the review UI is omitted until reviews are wired to the backend.
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowUpRight, CheckCircle2, Info, LoaderCircle, Search, SlidersHorizontal, Star, XCircle
} from 'lucide-react';
import { CLUBS_RETURN_KEY } from './BackToClubsLink';
import ClubCardSkeleton from './ClubCardSkeleton';
import Navbar from './Navbar';
import Footer from './Footer';
import ClubFilterModal from './ClubFilterModal';
import { SEARCH_DEBOUNCE_MS, fetchClubs } from '@/lib/clubs-client';
import type { Club } from '@/lib/clubs';
import {
  EMPTY_FILTERS,
  countActiveFilters,
  toClubQueryString,
  type ClubFilters,
  type Setting
} from '@/lib/club-filters';

const UNVERIFIED = 'Not verified by club';

function isVerified(value?: string) {
  if (!value) return false;
  return value !== UNVERIFIED && !value.toLowerCase().startsWith('not applicable');
}

function DataValue({ value }: { value: string }) {
  if (value === UNVERIFIED) {
    return <span className="text-stone-400 italic">{UNVERIFIED}</span>;
  }
  return <span className="text-stone-700">{value}</span>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <p className="text-[0.64rem] font-bold tracking-[0.16em] uppercase text-stone-400">{children}</p>;
}

function ClubCard({ club }: { club: Club }) {
  const verificationFields = [
    { label: 'Hours', value: club.hours },
    { label: 'Court count', value: club.courtCount },
    { label: 'Contact number', value: club.phone },
    { label: 'Court setting', value: club.setting },
    { label: 'Indoor AC', value: club.climateControl },
    { label: 'Ceiling height', value: club.ceilingHeight },
    { label: 'Ownership', value: club.ownership }
  ].map((field) => ({ ...field, verified: isVerified(field.value) }));
  const verifiedCount = verificationFields.filter((field) => field.verified).length;
  const tooltipId = `verification-${club.slug}`;

  return (
    <article className="group relative flex h-full flex-col overflow-visible border border-stone-200 bg-white shadow-[0_10px_35px_-25px_rgba(41,37,36,0.35)] transition-all duration-300 hover:z-20 hover:-translate-y-1 hover:shadow-[0_18px_40px_-24px_rgba(41,37,36,0.42)] focus-within:z-20">
      <div className="h-1.5 bg-gradient-to-r from-[#F26419] via-[#f99a62] to-[#f8efe8]" />
      <div className="flex flex-1 flex-col p-6">
        <div className="flex h-[4.5rem] items-start justify-between gap-4">
          <div className="min-w-0 overflow-hidden">
            <p className="text-[0.65rem] font-bold tracking-[0.15em] uppercase text-[#F26419]">{club.neighborhood}</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="mt-1 text-2xl font-bold leading-tight text-stone-900">{club.name}</h2>
          </div>
          <div className="relative z-30 shrink-0">
            <button
              type="button"
              aria-describedby={tooltipId}
              className="peer border border-stone-200 bg-stone-50 px-2 py-1 text-[0.62rem] font-bold tracking-[0.1em] uppercase text-stone-500 outline-none transition-colors hover:border-[#F26419]/50 hover:text-[#c44b0c] focus-visible:border-[#F26419] focus-visible:ring-2 focus-visible:ring-[#F26419]/20"
            >
              {verifiedCount}/7 verified
            </button>
            <div
              id={tooltipId}
              role="tooltip"
              className="pointer-events-none invisible absolute right-0 top-full z-50 mt-2 w-64 translate-y-1 border border-stone-200 bg-white p-3 opacity-0 shadow-[0_16px_40px_-18px_rgba(41,37,36,0.5)] transition-all duration-150 peer-hover:visible peer-hover:translate-y-0 peer-hover:opacity-100 peer-focus:visible peer-focus:translate-y-0 peer-focus:opacity-100"
            >
              <p className="mb-2 border-b border-stone-100 pb-2 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-stone-700">
                Verified club details
              </p>
              <ul className="space-y-1.5">
                {verificationFields.map((field) => (
                  <li key={field.label} className="flex items-center gap-2 text-xs text-stone-600">
                    {field.verified ? (
                      <CheckCircle2 size={14} className="shrink-0 text-emerald-600" aria-hidden="true" />
                    ) : (
                      <XCircle size={14} className="shrink-0 text-red-500" aria-hidden="true" />
                    )}
                    <span>{field.label}</span>
                    <span className="sr-only">: {field.verified ? 'verified' : 'not verified'}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-4 h-[44px] overflow-hidden">
          <p className="text-sm leading-relaxed text-stone-600">{club.vibe}</p>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-stone-100 py-4">
          <div>
            <Label>Setting</Label>
            <p className="mt-1 text-sm font-semibold text-stone-800">{club.setting}</p>
          </div>
          <div>
            <Label>Player rating</Label>
            {club.averageRating !== null ? (
              <div className="mt-1 flex items-center gap-1.5">
                <span className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      size={13}
                      className={index < Math.round(club.averageRating ?? 0) ? 'fill-[#F26419] text-[#F26419]' : 'text-stone-300'}
                    />
                  ))}
                </span>
                <span className="text-xs font-semibold text-stone-700">
                  {club.averageRating.toFixed(1)}
                </span>
              </div>
            ) : (
              <p className="mt-1 text-sm text-stone-400">No reviews yet</p>
            )}
          </div>
          <div className="col-span-2">
            <Label>Hours</Label>
            <div className="min-h-[40px] overflow-hidden">
              <p className="mt-1 text-sm leading-snug"><DataValue value={club.hours} /></p>
            </div>
          </div>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-5">
          <Link href={`/clubs/${club.slug}`} className="flex flex-1 items-center justify-center gap-2 border border-stone-900 px-3 py-2.5 text-xs font-bold tracking-[0.1em] uppercase text-stone-900 transition-colors hover:border-[#F26419] hover:bg-[#F26419] hover:text-white">
            Compare details <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function ClubsDirectory({
  initialClubs,
  initialTotal,
  initialFilters = EMPTY_FILTERS
}: {
  initialClubs: Club[];
  initialTotal: number;
  /** Parsed from the URL on the server, so page one arrives already filtered. */
  initialFilters?: ClubFilters;
}) {
  const router = useRouter();
  const pathname = usePathname();

  // What the user has typed, versus what has actually been applied. Separating
  // them is what makes the debounce work without racing the other filters.
  const [query, setQuery] = useState(initialFilters.q);
  // Every applied filter, including the settled search text. One object so the
  // URL, the API call and the modal all read from the same description.
  const [filters, setFilters] = useState<ClubFilters>(initialFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const activeFilterCount = countActiveFilters(filters);

  const [clubs, setClubs] = useState<Club[]>(initialClubs);
  const [total, setTotal] = useState(initialTotal);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialClubs.length < initialTotal);

  const [isLoading, setIsLoading] = useState(false);
  // Appending keeps the existing cards on screen; replacing swaps in skeletons.
  const [isAppending, setIsAppending] = useState(false);

  const isTypingPending = query !== filters.q;

  // The server already rendered page 1 for these exact filters; refetching on
  // mount would throw that away and flash the list.
  const isFirstRun = useRef(true);
  // Only the newest response may write to state, so a slow early request cannot
  // overwrite the result of a later keystroke or filter click.
  const requestId = useRef(0);

  // Remember the filters so a club profile's "back" link can return here with
  // them intact. Written on mount too, so arriving via a filtered URL and
  // clicking straight into a club still comes back filtered.
  useEffect(() => {
    try {
      sessionStorage.setItem(CLUBS_RETURN_KEY, toClubQueryString(filters));
    } catch {
      // sessionStorage can throw in private mode; the plain /clubs link remains.
    }
  }, [filters]);

  const load = useCallback(
    async (nextPage: number, append: boolean) => {
      const id = ++requestId.current;
      setIsAppending(append);
      setIsLoading(true);
      const result = await fetchClubs({ ...filters, page: nextPage });
      if (id !== requestId.current) return;
      setClubs((current) => (append ? [...current, ...result.clubs] : result.clubs));
      setTotal(result.total);
      setHasMore(result.hasMore);
      setPage(result.page);
      setIsLoading(false);
      setIsAppending(false);
    },
    [filters]
  );

  // Typing settles into the applied filters after the debounce.
  useEffect(() => {
    if (query === filters.q) return;
    const timer = setTimeout(
      () => setFilters((current) => ({ ...current, q: query })),
      SEARCH_DEBOUNCE_MS
    );
    return () => clearTimeout(timer);
  }, [query, filters.q]);

  // One place fetches, and the same place writes the filters into the URL, so
  // the address bar always describes what is on screen. Reloading, sharing or
  // coming back to that URL re-runs the identical query on the server.
  // replace() rather than push() keeps one history entry per visit instead of
  // one per keystroke.
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    router.replace(`${pathname}${toClubQueryString(filters)}`, { scroll: false });
    void load(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  const clearFilters = () => {
    setQuery('');
    // Set together, so clearing is one navigation and one refetch rather than
    // the search and the filters each triggering their own.
    setFilters(EMPTY_FILTERS);
  };

  return (
    <div className="min-h-screen bg-[#f9f7f4] text-stone-900">
      <Navbar showBooking={false} />
      <main>
        <section className="relative overflow-hidden bg-[#1d1a17] pt-[72px] text-white">
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 16% 35%, rgba(242,100,25,.58), transparent 25%), radial-gradient(circle at 82% 12%, rgba(255,255,255,.12), transparent 22%), linear-gradient(135deg, #1d1a17 10%, #332820 58%, #1d1a17 100%)' }} />
          <div className="relative mx-auto max-w-[1280px] px-6 py-20 lg:px-10 lg:py-24">
            <div className="grid items-end gap-10 lg:grid-cols-[1.25fr_0.75fr]">
              <div>
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.23em] text-[#f7975a]">Brisa Club Intelligence</p>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="mt-4 max-w-3xl text-5xl font-bold leading-[0.92] sm:text-6xl lg:text-7xl">Choose a club with <span className="italic text-[#f7975a]">context.</span></h1>
                <p className="mt-7 max-w-2xl text-base leading-relaxed text-stone-300">A transparent Miami padel directory for the factors players actually need: court environment, pricing visibility, coach access, operating hours, and real player reports.</p>
              </div>
              <div className="border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.17em] text-[#f7975a]">A better club review standard</p>
                <p className="mt-3 text-sm leading-relaxed text-stone-200">We show confirmed facts, flag unknowns, and never manufacture ratings. Read the detail, then add your own report after you play.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative z-10 mx-auto -mt-7 max-w-[1280px] px-6 lg:px-10">
          <div className="border border-stone-200 bg-white p-4 shadow-[0_16px_35px_-27px_rgba(41,37,36,.55)] md:p-5">
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <label className="relative block">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a club, neighborhood, or address" className="w-full border border-stone-200 bg-stone-50 py-3 pl-10 pr-4 text-sm text-stone-900 outline-none transition-colors placeholder:text-stone-400 focus:border-[#F26419] focus:bg-white focus:ring-2 focus:ring-[#F26419]/10" />
              </label>
              <div className="flex items-center gap-2 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setIsFilterOpen(true)}
                  aria-haspopup="dialog"
                  className={`flex items-center gap-1.5 whitespace-nowrap border px-3.5 py-3 text-xs font-bold uppercase tracking-[0.11em] transition-colors ${
                    activeFilterCount > 0
                      ? 'border-[#F26419] text-[#c44b0c]'
                      : 'border-stone-200 text-stone-600 hover:border-[#F26419]/50 hover:text-[#F26419]'
                  }`}
                >
                  <SlidersHorizontal size={14} /> Filter
                  {activeFilterCount > 0 && (
                    <span className="ml-0.5 inline-flex h-4 min-w-4 items-center justify-center bg-[#F26419] px-1 text-[0.6rem] text-white">
                      {activeFilterCount}
                    </span>
                  )}
                </button>
                {/* Kept alongside the modal as a shortcut for the most-used
                    filter. Both write the same URL param, so they cannot
                    disagree about what is applied. */}
                {(['All', 'Indoor', 'Outdoor'] as const).map((setting) => (
                  <button
                    key={setting}
                    onClick={() => setFilters((current) => ({ ...current, setting: setting as Setting }))}
                    className={`whitespace-nowrap border px-3.5 py-3 text-xs font-bold uppercase tracking-[0.09em] transition-colors ${filters.setting === setting ? 'border-[#F26419] bg-[#F26419] text-white' : 'border-stone-200 text-stone-600 hover:border-[#F26419]/50 hover:text-[#F26419]'}`}
                  >
                    {setting}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-6 pb-24 pt-16 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_2.25fr]">
            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <p className="text-[0.66rem] font-bold uppercase tracking-[0.18em] text-[#F26419]">Directory status</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="mt-2 text-4xl font-bold leading-none text-stone-900">Facts before stars.</h2>
              <p className="mt-5 text-sm leading-relaxed text-stone-600">This initial directory starts with public official-source facts. Fields that clubs have not confirmed stay visible but clearly unresolved.</p>
              <div className="mt-7 space-y-3 border-y border-stone-200 py-5 text-sm">
                <div className="flex items-center gap-3"><CheckCircle2 size={16} className="text-[#F26419]" /><span className="text-stone-700">Official source used where available</span></div>
                <div className="flex items-center gap-3"><Info size={16} className="text-[#F26419]" /><span className="text-stone-700">Unknown details are not estimated</span></div>
                <div className="flex items-center gap-3"><Star size={16} className="text-[#F26419]" /><span className="text-stone-700">No fabricated player reviews</span></div>
              </div>
              <div className="mt-7 border-l-2 border-[#F26419] bg-[#fff3ec] p-4">
                <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#c44b0c]">Club representative?</p>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">Submit verified pricing, facility, or ownership details through Brisa so players can make a better decision.</p>
                <Link href="/contact" className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.1em] text-[#c44b0c] hover:text-[#F26419]">Contact Brisa <ArrowUpRight size={13} /></Link>
              </div>
            </aside>

            <div>
              <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
                <div><p className="text-[0.65rem] font-bold uppercase tracking-[0.16em] text-stone-400">Miami club profiles</p><h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="mt-1 text-4xl font-bold text-stone-900">{total} {total === 1 ? 'club' : 'clubs'} to compare</h2></div>
                <p className="flex items-center gap-2 text-xs text-stone-500">{(isLoading || isTypingPending) && <LoaderCircle size={13} className="animate-spin text-[#F26419]" />}{isTypingPending ? 'Waiting for you to finish typing…' : isLoading ? 'Searching clubs…' : 'Select a profile for the full facility ledger.'}</p>
              </div>
              {isLoading && !isAppending ? (
                <div className="grid gap-5 md:grid-cols-2">{Array.from({ length: 6 }, (_, index) => <ClubCardSkeleton key={index} />)}</div>
              ) : clubs.length ? (
                <>
                  <div className="grid gap-5 md:grid-cols-2">
                    {clubs.map((club) => <ClubCard key={club.slug} club={club} />)}
                    {isAppending && Array.from({ length: 4 }, (_, index) => <ClubCardSkeleton key={`skeleton-${index}`} />)}
                  </div>
                  {hasMore && (
                    <div className="mt-8 flex flex-col items-center gap-2">
                      <button onClick={() => void load(page + 1, true)} disabled={isLoading} className="inline-flex items-center gap-2 border border-stone-900 px-6 py-3 text-xs font-bold uppercase tracking-[0.12em] text-stone-900 transition-colors hover:border-[#F26419] hover:bg-[#F26419] hover:text-white disabled:cursor-not-allowed disabled:opacity-50">
                        {isAppending && <LoaderCircle size={13} className="animate-spin" />}
                        {isAppending ? 'Loading…' : 'Show more clubs'}
                      </button>
                      <p className="text-xs text-stone-500">Showing {clubs.length} of {total}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="border border-dashed border-stone-300 bg-white px-6 py-16 text-center"><Search size={24} className="mx-auto text-[#F26419]" /><p className="mt-3 font-semibold text-stone-800">No clubs match those filters.</p><button onClick={clearFilters} className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#c44b0c] hover:text-[#F26419]">Clear filters</button></div>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />

      {isFilterOpen && (
        <ClubFilterModal
          initial={filters}
          onClose={() => setIsFilterOpen(false)}
          onApply={(next) => {
            setIsFilterOpen(false);
            // The modal never edits the search box, so its `q` is carried
            // through unchanged and a pending keystroke is not discarded.
            setFilters({ ...next, q: filters.q });
          }}
        />
      )}
    </div>
  );
}
