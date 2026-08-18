import type { Metadata } from 'next';
import AboutPage from '@/components/AboutPage';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'About | Brisa Padel',
  description: 'About Brisa Padel and our private membership matchmaking platform.',
  lang: 'en',
  basePath: '/about'
});

export default function Page() {
  return <AboutPage lang="en" />;
}
