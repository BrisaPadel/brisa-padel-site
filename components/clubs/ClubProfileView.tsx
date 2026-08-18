/**
 * BRISA PADEL — Indexable Club Profile (/clubs/:slug)
 * Ported from the prototype's ClubProfile.tsx with the markup unchanged.
 *
 * Two deliberate differences: the club arrives from the API as a prop, and the
 * document head is produced by generateMetadata on the server instead of the
 * prototype's useEffect, so crawlers see the real tags in the HTML. Review
 * submission is not wired up yet, so this renders as a server component with
 * no client JavaScript at all.
 */

import Link from 'next/link';
import {
  ArrowLeft, ArrowUpRight, CalendarDays, Clock3, DollarSign, Droplets,
  ExternalLink, Info, MapPin, MessageCircle, Phone, Ruler, Snowflake,
  Sparkles, Star, Sun, Wind
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import { UNVERIFIED, type Club } from '@/lib/clubs';

function DataValue({ value }: { value: string }) {
  return value === UNVERIFIED
    ? <span className="text-stone-400 italic">{UNVERIFIED}</span>
    : <span className="text-stone-700">{value}</span>;
}

function RatingStars({ rating, size = 17 }: { rating: number; size?: number }) {
  return <div className="flex items-center gap-0.5" aria-label={`${rating.toFixed(1)} out of 5 stars`}>{Array.from({ length: 5 }, (_, i) => <Star key={i} size={size} className={i < Math.round(rating) ? 'fill-[#F26419] text-[#F26419]' : 'text-stone-300'} />)}</div>;
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex gap-3 border-t border-stone-100 py-3.5 first:border-t-0 first:pt-0"><span className="mt-0.5 shrink-0 text-[#F26419]">{icon}</span><div className="min-w-0"><p className="text-xs font-semibold text-stone-500">{label}</p><p className="mt-0.5 text-sm leading-snug"><DataValue value={value} /></p></div></div>;
}

export default function ClubProfileView({ club }: { club: Club }) {
  const directions = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(club.address)}`;
  const directBookingHref = club.website || directions;
  const rating: number | null = null;

  return (
    <div className="min-h-screen bg-[#f9f7f4] text-stone-900">
      <Navbar bookingHref={directBookingHref} bookingExternal />
      <main className="pt-[72px]">
        <section className="border-b border-stone-200 bg-[#fffdfb]">
          <div className="mx-auto max-w-[1280px] px-6 py-10 lg:px-10 lg:py-14">
            <Link href="/clubs" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.13em] text-stone-500 transition-colors hover:text-[#F26419]"><ArrowLeft size={14} /> All club profiles</Link>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_0.65fr] lg:items-end">
              <div><p className="text-[0.66rem] font-bold uppercase tracking-[0.18em] text-[#F26419]">{club.neighborhood} · Brisa Club Intelligence</p><h1 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="mt-3 max-w-4xl text-5xl font-bold leading-[0.92] text-stone-900 sm:text-6xl">{club.name}</h1><p className="mt-5 max-w-3xl text-base leading-relaxed text-stone-600">{club.description}</p></div>
              <div className="border-2 border-[#F26419] bg-[#fffaf6] p-5"><p className="text-[0.64rem] font-bold uppercase tracking-[0.15em] text-[#c44b0c]">Blended player rating</p><div className="mt-2 flex items-center gap-3"><RatingStars rating={rating ?? 0} /><span className="text-lg font-semibold text-stone-900">{rating ? `${rating}/5` : '— / 5'}</span></div><p className="mt-4 text-xs leading-relaxed text-stone-500">Player reports open soon.</p></div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1280px] px-6 py-12 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="space-y-8">
              <section><p className="text-[0.65rem] font-bold uppercase tracking-[0.17em] text-[#F26419]">Club character</p><h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="mt-2 text-4xl font-bold text-stone-900">The Brisa read</h2><div className="mt-5 border-l-2 border-[#F26419] bg-[#fff5ef] px-5 py-4"><p className="text-base leading-relaxed text-stone-800">{club.vibe}</p><div className="mt-5 border-t border-[#f4d9c8] pt-4"><p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-stone-500">Ownership</p><p className="mt-1.5 text-sm leading-relaxed"><DataValue value={club.ownership} /></p></div></div></section>

              <section className="border border-stone-200 bg-white p-6"><div className="flex items-end justify-between gap-4"><div><p className="text-[0.65rem] font-bold uppercase tracking-[0.17em] text-[#F26419]">Facility ledger</p><h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="mt-2 text-4xl font-bold text-stone-900">Club context</h2></div><span className="hidden text-xs text-stone-400 sm:block">Confirmed facts first</span></div><div className="mt-7 grid gap-x-8 md:grid-cols-2"><div><DetailRow icon={<Clock3 size={16} />} label="Hours" value={club.hours} /><DetailRow icon={club.setting === 'Indoor' ? <Snowflake size={16} /> : <Sun size={16} />} label="Court setting" value={`${club.setting} · ${club.courtCount}`} /><DetailRow icon={<Wind size={16} />} label="Indoor AC" value={club.climateControl} /><DetailRow icon={<Ruler size={16} />} label="Indoor ceiling height" value={club.ceilingHeight} /><DetailRow icon={<DollarSign size={16} />} label="Peak / off-peak court rate" value={`${club.peakRate} / ${club.offPeakRate}`} /></div><div><DetailRow icon={<CalendarDays size={16} />} label="Last court replacement" value={club.courtReplacement} /><DetailRow icon={<Sparkles size={16} />} label="Court quality" value={club.courtQuality} /><DetailRow icon={<Ruler size={16} />} label="Room for outside play" value={club.outsidePlayRoom} /><DetailRow icon={<Wind size={16} />} label="Court speed" value={club.courtSpeed} /><DetailRow icon={<Sparkles size={16} />} label="Facility cleanliness" value={club.facilityCleanliness} /><DetailRow icon={<Droplets size={16} />} label="Shower quality" value={club.showerQuality} /></div></div></section>

              {club.coaches.length > 0 && (
                <section className="border border-stone-200 bg-white p-6"><p className="text-[0.65rem] font-bold uppercase tracking-[0.17em] text-[#F26419]">Coaching</p><h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="mt-2 text-4xl font-bold text-stone-900">Coaches on site</h2><ul className="mt-5 flex flex-wrap gap-2">{club.coaches.map((coach) => <li key={coach} className="border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700">{coach}</li>)}</ul></section>
              )}

              <section><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-[0.65rem] font-bold uppercase tracking-[0.17em] text-[#F26419]">Player reports</p><h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="mt-2 text-4xl font-bold text-stone-900">Reviews by last date played</h2><p className="mt-2 text-sm text-stone-500">Approved player reports appear newest first.</p></div></div><div className="mt-6 border border-dashed border-stone-300 bg-white px-6 py-12 text-center"><Star size={23} className="mx-auto text-[#F26419]" /><p className="mt-3 font-semibold text-stone-800">No player reviews yet.</p><p className="mx-auto mt-1 max-w-md text-sm leading-relaxed text-stone-500">Player reports open soon. Nothing here is generated or estimated.</p></div></section>
            </div>

            <aside className="space-y-5 lg:sticky lg:top-24 lg:h-fit">
              <section className="border border-stone-200 bg-white p-5"><p className="text-[0.65rem] font-bold uppercase tracking-[0.15em] text-[#F26419]">Location &amp; contact</p><h2 style={{ fontFamily: "'Cormorant Garamond', serif" }} className="mt-2 text-3xl font-bold text-stone-900">Get there, get playing.</h2><a href={directBookingHref} target="_blank" rel="noreferrer" className="mt-5 flex items-center justify-center gap-2 bg-[#F26419] px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#d9500b]"><ExternalLink size={14} /> Book direct with {club.name}</a><div className="mt-5 space-y-3 border-t border-stone-100 pt-4"><p className="flex gap-2 text-sm leading-relaxed text-stone-700"><MapPin size={16} className="mt-0.5 shrink-0 text-[#F26419]" />{club.address}</p>{club.phone ? <a href={`tel:${club.phone.replace(/[^\d]/g, '')}`} className="flex items-center gap-2 text-sm font-semibold text-stone-700 hover:text-[#F26419]"><Phone size={15} className="text-[#F26419]" />{club.phone}</a> : <p className="text-sm italic text-stone-400">Phone: {UNVERIFIED}</p>}{club.whatsapp ? <a href={club.whatsapp} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-stone-700 hover:text-[#F26419]"><MessageCircle size={15} className="text-[#F26419]" />WhatsApp the club</a> : <p className="flex items-center gap-2 text-sm italic text-stone-400"><MessageCircle size={15} />WhatsApp: {UNVERIFIED}</p>}{club.website && <a href={club.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-stone-700 hover:text-[#F26419]"><ExternalLink size={15} className="text-[#F26419]" />Official website</a>}<a href={directions} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm font-semibold text-stone-700 hover:text-[#F26419]"><MapPin size={15} className="text-[#F26419]" />Get directions</a></div></section>
              <section className="border-l-2 border-[#F26419] bg-[#fff5ef] px-4 py-4"><div className="flex gap-3"><Info size={18} className="mt-0.5 shrink-0 text-[#F26419]" /><p className="text-xs leading-relaxed text-stone-600">This profile is designed for direct sharing and search discovery. Any commercial, technical, or ownership details marked unverified need confirmation from the club before Brisa promotes them as fact.</p></div><div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 pl-7">{club.sources.map((source) => <a key={source.href} href={source.href} target="_blank" rel="noreferrer" className="text-xs font-semibold text-[#c44b0c] hover:underline">{source.label} <ArrowUpRight size={12} className="inline" /></a>)}</div></section>
              <Link href="/clubs" className="flex items-center justify-center gap-2 border border-stone-900 px-4 py-3 text-xs font-bold uppercase tracking-[0.12em] text-stone-900 transition-colors hover:border-[#F26419] hover:bg-[#F26419] hover:text-white"><ArrowLeft size={14} /> Browse all clubs</Link>
            </aside>
          </div>
        </section>
      </main>
      <Footer variant="live" />
    </div>
  );
}
