import type { ReactNode } from 'react';
import type { Lang } from '@/data/i18n';
import '@/styles/globals.css';

interface Props {
  lang: Lang;
  children: ReactNode;
}

/**
 * Shared document shell. Each language has its own root layout so that
 * <html lang> is correct in the statically rendered HTML, exactly as
 * BaseLayout.astro produced it.
 */
export default function SiteHtml({ lang, children }: Props) {
  return (
    <html lang={lang}>
      <body>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,700;1,400;1,700&family=Source+Sans+3:wght@400;500;600;700&display=swap"
          rel="stylesheet"
          precedence="default"
        />
        {children}
      </body>
    </html>
  );
}
