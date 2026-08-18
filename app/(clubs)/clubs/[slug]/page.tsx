import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ClubProfileView from '@/components/clubs/ClubProfileView';
import { getClub, listClubReviews, UNVERIFIED, type Club } from '@/lib/clubs';
import { SOCIAL_IMAGE, buildMetadata, canonicalUrl } from '@/lib/seo';

type PageProps = { params: Promise<{ slug: string }> };

// Rendered per request so console edits appear immediately, and so 352 club
// pages are not all built up front.
export const dynamic = 'force-dynamic';

/** Console-authored metaTags win; anything left blank falls back to club data. */
function seoFor(club: Club) {
  const meta = club.metaTags ?? {};
  const title = meta.title?.trim() || `${club.name} | Miami Padel Club Guide | Brisa Padel`;
  const description =
    meta.description?.trim() ||
    `${club.name} in ${club.neighborhood}: club hours, court environment, coaching, location, contact details, and transparent Brisa player-review information.`;
  return { meta, title, description };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const club = await getClub(slug);

  if (!club) {
    return { title: 'Club not found | Brisa Padel', robots: { index: false, follow: false } };
  }

  const { meta, title, description } = seoFor(club);
  const image = meta.ogImage?.trim() || club.heroImageUrl || SOCIAL_IMAGE;

  const metadata = buildMetadata({
    title,
    description,
    lang: 'en',
    basePath: `/clubs/${club.slug}`,
    image,
    // "noindex" typed by an admin must actually de-index the page.
    index: !(meta.robots ?? '').toLowerCase().includes('noindex')
  });

  if (meta.canonicalUrl?.trim()) {
    metadata.alternates = { ...metadata.alternates, canonical: meta.canonicalUrl.trim() };
  }
  if (meta.keywords?.trim()) {
    metadata.keywords = meta.keywords.split(',').map((k) => k.trim()).filter(Boolean);
  }
  metadata.openGraph = {
    ...metadata.openGraph,
    title: meta.ogTitle?.trim() || title,
    description: meta.ogDescription?.trim() || description
  };
  metadata.twitter = {
    ...metadata.twitter,
    card: (meta.twitterCard?.trim() as 'summary_large_image') || 'summary_large_image',
    title: meta.twitterTitle?.trim() || title,
    description: meta.twitterDescription?.trim() || description,
    images: [meta.twitterImage?.trim() || image]
  };

  return metadata;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const club = await getClub(slug);
  if (!club) notFound();

  const reviews = await listClubReviews(slug);

  const { description } = seoFor(club);
  const known = (value: string) => (value && value !== UNVERIFIED ? value : undefined);

  // SportsActivityLocation, server-rendered so crawlers get it in the HTML.
  // aggregateRating appears only once real approved reviews exist — publishing
  // a rating with nothing behind it is structured-data spam.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: club.name,
    description: club.description || description,
    url: canonicalUrl('en', `/clubs/${club.slug}`),
    address: {
      '@type': 'PostalAddress',
      streetAddress: club.address,
      addressLocality: club.city || undefined,
      addressRegion: club.state || undefined,
      addressCountry: club.country || 'US'
    },
    telephone: known(club.phone),
    openingHours: known(club.hours),
    sameAs: club.website ? [club.website] : undefined,
    geo: club.latitude && club.longitude
      ? { '@type': 'GeoCoordinates', latitude: club.latitude, longitude: club.longitude }
      : undefined,
    aggregateRating:
      club.reviewCount > 0 && club.averageRating !== null
        ? {
            '@type': 'AggregateRating',
            ratingValue: club.averageRating,
            reviewCount: club.reviewCount,
            bestRating: 5,
            worstRating: 1
          }
        : undefined
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClubProfileView club={club} reviews={reviews} />
    </>
  );
}
