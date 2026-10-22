import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ClubProfileView from '@/components/clubs/ClubProfileView';
import { getClub } from '@/lib/clubs';

type PageProps = { params: Promise<{ slug: string }> };

export const dynamic = 'force-dynamic';

/** The score this route demonstrates: the top of the scale, "World-Class". */
const DESIGN_PREVIEW_SCORE = 10;

// Never indexed, never in the sitemap, and never given to a crawler: this page
// shows a real club under a score Brisa has NOT assigned it. The badge carries a
// "Preview" tag for anyone who follows the link, and robots keeps it out of
// search so the invented score cannot be mistaken for a published assessment.
export const metadata: Metadata = {
  title: 'Brisa Club Standard — design preview',
  robots: { index: false, follow: false }
};

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const club = await getClub(slug);
  if (!club) notFound();

  return (
    <>
      <p className="fixed inset-x-0 top-0 z-[60] bg-stone-900 px-4 py-1.5 text-center text-[0.6rem] font-bold uppercase tracking-[0.14em] text-white">
        Design preview · the {DESIGN_PREVIEW_SCORE}/10 mark below is an example, not {club.name}&rsquo;s assessment
      </p>
      <ClubProfileView club={club} reviews={[]} editorialPreviewScore={DESIGN_PREVIEW_SCORE} />
    </>
  );
}
