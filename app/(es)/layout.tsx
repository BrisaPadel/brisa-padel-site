import type { ReactNode } from 'react';
import SiteHtml from '@/components/SiteHtml';
import { siteViewport } from '@/lib/seo';

export const viewport = siteViewport;

export default function EsRootLayout({ children }: { children: ReactNode }) {
  return <SiteHtml lang="es">{children}</SiteHtml>;
}
