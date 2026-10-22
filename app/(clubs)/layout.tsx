import type { ReactNode } from 'react';
import { siteViewport } from '@/lib/seo';
import '@/styles/clubs.css';

export const viewport = siteViewport;

/**
 * Third root layout, for the club directory. It is separate from the marketing
 * layouts so Tailwind (and its preflight reset) is scoped to these routes only
 * — the ported Astro pages render from CSS Modules and must stay untouched.
 */
export default function ClubsRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600;1,700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
          precedence="default"
        />
        {children}
      </body>
    </html>
  );
}
