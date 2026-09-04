/*
 * BRISA PADEL — Navbar Component
 * Design: Fixed top bar, white background, left-aligned wordmark, one focused
 * booking action. The Brisa public experience now uses intentional minimalism:
 * no competing section tabs in the header, and club profiles may send the CTA
 * directly to the featured club's official booking destination.
 */

import Link from "next/link";

interface NavbarProps {
  bookingHref?: string;
  bookingExternal?: boolean;
  showBooking?: boolean;
}

export default function Navbar({ bookingHref = "/contact", bookingExternal = false, showBooking = true }: NavbarProps) {
  const bookingClassName = "btn-primary shrink-0 rounded-none px-4 py-2.5 text-[0.68rem] tracking-[0.11em] sm:px-5 sm:text-[0.72rem]";

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-stone-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-6 lg:px-10">
        <Link href="/" className="group flex items-center gap-3">
          <span className="accent-bar h-6" />
          <span style={{ fontFamily: "'Cormorant Garamond', serif" }} className="text-[1.22rem] font-bold leading-none tracking-wide text-stone-900 sm:text-[1.45rem]">BRISA <span className="text-[#F26419]">PADEL</span></span>
        </Link>
        {showBooking && bookingExternal ? (
          <a href={bookingHref} target="_blank" rel="noreferrer" className={bookingClassName}>Book a Court</a>
        ) : showBooking ? (
          <Link href={bookingHref} className={bookingClassName}>Book a Court</Link>
        ) : null}
      </div>
    </header>
  );
}
