import type { Metadata, Viewport } from 'next';
import type { Lang } from '@/data/i18n';
import { SITE_BASE_URL } from '@/data/urls';

/**
 * A page's path with the language prefix stripped.
 * '' is the home page ('/' in English, '/es' in Spanish).
 *
 * This is a plain string so dynamic, slug-based routes work the same way as
 * the static ones — e.g. '/clubs' and `/clubs/${slug}` both round-trip through
 * canonicalUrl()/buildMetadata() and produce correct per-language hreflang.
 */
export type BasePath = string;

/** The static pages that exist today; used by the sitemap. */
export const STATIC_BASE_PATHS: BasePath[] = [
  '',
  '/about',
  '/membership',
  '/contact',
  '/terms',
  '/privacy'
];

/*
  Served from public/. The CloudFront bucket this used to load from returns 403
  AccessDenied, so the asset lives in the repo instead of behind a URL that can
  stop resolving without anything here changing.

  Root-relative is safe for a social image here: buildMetadata sets
  metadataBase, and the one call site that builds the tag itself runs it through
  absoluteImageUrl — both give crawlers the absolute URL they need.
*/
export const SOCIAL_IMAGE = '/hero-main.jpg';

/**
 * Absolute form of an image URL, for the places a relative one cannot work.
 *
 * The API serves stored images as root-relative paths so no host is baked into
 * the database. That is right for <img>, but og:image, twitter:image and
 * JSON-LD are read by crawlers that have no page origin to resolve against, so
 * those must be absolute. Anything already absolute is passed through.
 */
export function absoluteImageUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `${SITE_BASE_URL}${trimmed.startsWith('/') ? '' : '/'}${trimmed}`;
}

/** Normalise a base path: no trailing slash, always a leading slash (or empty). */
export function normalizeBasePath(basePath: BasePath): BasePath {
  if (!basePath || basePath === '/') return '';
  const withLeadingSlash = basePath.startsWith('/') ? basePath : `/${basePath}`;
  return withLeadingSlash.endsWith('/') ? withLeadingSlash.slice(0, -1) : withLeadingSlash;
}

/** Absolute English URL for a base path. */
export function enUrl(basePath: BasePath) {
  const path = normalizeBasePath(basePath);
  return `${SITE_BASE_URL}${path === '' ? '/' : path}`;
}

/** Absolute Spanish URL for a base path. */
export function esUrl(basePath: BasePath) {
  return `${SITE_BASE_URL}/es${normalizeBasePath(basePath)}`;
}

/** Absolute canonical URL for a page in a given language. */
export function canonicalUrl(lang: Lang, basePath: BasePath) {
  return lang === 'en' ? enUrl(basePath) : esUrl(basePath);
}

interface BuildMetadataOptions {
  title: string;
  description: string;
  lang: Lang;
  /** Path without the language prefix; drives canonical + hreflang. */
  basePath: BasePath;
  /** Override the social image, e.g. a club's own photo on a slug page. */
  image?: string;
  /** Set false for pages that should not be indexed. */
  index?: boolean;
}

export function buildMetadata({
  title,
  description,
  lang,
  basePath,
  image = SOCIAL_IMAGE,
  index = true
}: BuildMetadataOptions): Metadata {
  const canonical = canonicalUrl(lang, basePath);

  return {
    metadataBase: new URL(SITE_BASE_URL),
    title,
    description,
    robots: {
      index,
      follow: true
    },
    alternates: {
      canonical,
      languages: {
        en: enUrl(basePath),
        es: esUrl(basePath),
        'x-default': enUrl(basePath)
      }
    },
    openGraph: {
      type: 'website',
      title,
      description,
      url: canonical,
      siteName: 'Brisa Padel',
      locale: lang === 'en' ? 'en_US' : 'es_ES',
      alternateLocale: lang === 'en' ? 'es_ES' : 'en_US',
      images: [{ url: image, alt: 'Brisa Padel' }]
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image]
    },
    icons: {
      icon: [{ url: '/favicon.png', type: 'image/png' }],
      shortcut: [{ url: '/favicon.png', type: 'image/png' }],
      apple: [{ url: '/apple-touch-icon.png' }]
    },
    manifest: '/site.webmanifest',
    other: {
      'msapplication-TileColor': '#f26419',
      'msapplication-config': '/browserconfig.xml'
    }
  };
}

export const siteViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f26419'
};
