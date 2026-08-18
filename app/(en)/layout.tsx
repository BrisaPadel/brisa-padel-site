import type { ReactNode } from 'react';
import SiteHtml from '@/components/SiteHtml';
import { siteViewport } from '@/lib/seo';

export const viewport = siteViewport;

export default function EnRootLayout({ children }: { children: ReactNode }) {
  return <SiteHtml lang="en">{children}</SiteHtml>;
}
