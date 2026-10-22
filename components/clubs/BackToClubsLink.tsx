'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

/** Key the directory writes its current query string under. */
export const CLUBS_RETURN_KEY = 'clubs:return';

/**
 * "Back to the directory" that remembers the filters you left it with.
 *
 * The club profile is a server component and cannot know which filters were
 * applied on /clubs, so the directory stores its query string in sessionStorage.
 *
 * The rendered href stays a plain /clubs — correct for crawlers, and for
 * middle-click or open-in-new-tab — while a normal click resolves the remembered
 * filters at click time. Reading storage in the handler rather than in an effect
 * keeps the markup identical on server and client, with no extra render.
 */
export default function BackToClubsLink({
  className,
  children
}: {
  className?: string;
  children: ReactNode;
}) {
  const router = useRouter();

  const handleClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Let the browser handle modified clicks (new tab, new window, download).
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    let stored = '';
    try {
      stored = sessionStorage.getItem(CLUBS_RETURN_KEY) ?? '';
    } catch {
      // Private browsing can throw; fall through to the plain link.
    }
    if (!stored) return;
    event.preventDefault();
    router.push(`/clubs${stored}`);
  };

  return (
    <Link href="/clubs" className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
