import type { Metadata } from 'next';
import ContactPage from '@/components/ContactPage';
import { buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'Contact | Brisa',
  description: 'Contact Brisa membership team.',
  lang: 'en',
  basePath: '/contact'
});

export default function Page() {
  return <ContactPage lang="en" />;
}
