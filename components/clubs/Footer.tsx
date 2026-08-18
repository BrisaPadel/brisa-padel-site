/*
 * BRISA PADEL — Footer Component
 * Design: Dark charcoal background, warm white text, orange accents
 * Four-column layout: brand, navigation, contact, social
 */

import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";

interface FooterProps {
  variant?: "detailed" | "live";
}

export default function Footer({ variant = "detailed" }: FooterProps) {
  if (variant === "live") {
    return (
      <footer className="bg-[#1d1a17] px-6 py-7 text-center">
        <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-3 text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-white/55">
          <Link href="/about" className="transition-colors hover:text-white">About</Link>
          <span aria-hidden="true" className="h-3 w-px bg-white/25" />
          <Link href="/contact" className="transition-colors hover:text-white">Contact</Link>
          <span aria-hidden="true" className="h-3 w-px bg-white/25" />
          <Link href="/terms" className="transition-colors hover:text-white">Terms</Link>
          <span aria-hidden="true" className="h-3 w-px bg-white/25" />
          <Link href="/privacy" className="transition-colors hover:text-white">Privacy</Link>
        </nav>
      </footer>
    );
  }

  return (
    <footer className="bg-[#1E1E1E] text-white">
      {/* Main footer content */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
        {/* Brand column */}
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3 mb-5">
            <span className="accent-bar h-6" />
            <span
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
              className="text-[1.35rem] font-bold tracking-wide text-white leading-none"
            >
              BRISA <span className="text-[#F26419]">PADEL</span>
            </span>
          </div>
          <p className="text-stone-400 text-sm leading-relaxed max-w-[220px]">
            A premier padel experience where sport meets sophistication. Join the community.
          </p>
        </div>

        {/* Contact column */}
        <div>
          <p className="section-label text-stone-500 mb-5">Contact</p>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <MapPin size={15} className="text-[#F26419] mt-0.5 flex-shrink-0" />
              <span className="text-stone-400 text-sm leading-relaxed">
                123 Coastal Drive<br />Miami, FL 33101
              </span>
            </li>
            <li className="flex items-center gap-3">
              <Phone size={15} className="text-[#F26419] flex-shrink-0" />
              <span className="text-stone-400 text-sm">+1 (305) 555-0192</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={15} className="text-[#F26419] flex-shrink-0" />
              <span className="text-stone-400 text-sm">hello@brisapadel.com</span>
            </li>
          </ul>
        </div>

        {/* Hours column */}
        <div>
          <p className="section-label text-stone-500 mb-5">Hours</p>
          <ul className="space-y-3">
            {[
              { day: "Monday – Friday", hours: "7:00 AM – 10:00 PM" },
              { day: "Saturday", hours: "8:00 AM – 10:00 PM" },
              { day: "Sunday", hours: "9:00 AM – 8:00 PM" },
            ].map(({ day, hours }) => (
              <li key={day} className="text-sm">
                <span className="text-stone-300 font-medium">{day}</span>
                <br />
                <span className="text-stone-500">{hours}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-800">
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-stone-600 text-xs tracking-wide">
            © {new Date().getFullYear()} Brisa Padel. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/terms" className="text-stone-600 text-xs hover:text-[#F26419] transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="text-stone-600 text-xs hover:text-[#F26419] transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
