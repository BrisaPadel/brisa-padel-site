import Link from 'next/link';
import { ArrowLeft, MapPin, Search } from 'lucide-react';
import Navbar from '@/components/clubs/Navbar';
import Footer from '@/components/clubs/Footer';

/**
 * Shown when a club slug does not resolve — a typo in the URL, or a club that
 * has been unpublished. Rendered inside the clubs root layout, so it carries
 * the directory's own theme rather than Next's default error page.
 */
export default function ClubNotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-[#f9f7f4] text-stone-900">
      <Navbar showBooking={false} />
      <main className="flex flex-1 items-center justify-center px-6 pt-[72px]">
        <div className="mx-auto w-full max-w-xl py-20 text-center">
          <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#F26419] bg-[#fff5ef]">
            <MapPin size={26} className="text-[#F26419]" />
          </span>

          <p className="mt-7 text-[0.68rem] font-bold uppercase tracking-[0.23em] text-[#F26419]">
            Brisa Club Intelligence
          </p>
          <h1
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
            className="mt-3 text-5xl font-bold leading-[0.95] text-stone-900 sm:text-6xl"
          >
            No club found with <span className="italic text-[#c44b0c]">that name.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-base leading-relaxed text-stone-600">
            The address may be mistyped, or this club is no longer listed in the Brisa
            directory. Browse the full directory to find it.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/clubs"
              className="inline-flex w-full items-center justify-center gap-2 bg-[#F26419] px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#d9500b] sm:w-auto"
            >
              <Search size={14} /> Browse all clubs
            </Link>
            <Link
              href="/"
              className="inline-flex w-full items-center justify-center gap-2 border border-stone-900 px-6 py-3.5 text-xs font-bold uppercase tracking-[0.12em] text-stone-900 transition-colors hover:border-[#F26419] hover:bg-[#F26419] hover:text-white sm:w-auto"
            >
              <ArrowLeft size={14} /> Back to Brisa Padel
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
