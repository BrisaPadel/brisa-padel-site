export const SITE_BASE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://website.brisapadel.com';
export const WEB_BASE_URL = process.env.NEXT_PUBLIC_WEB_BASE_URL ?? '';

export function siteUrl(path: string) {
  return path;
}

export function webUrl(path: string) {
  return WEB_BASE_URL ? `${WEB_BASE_URL}${path}` : path;
}
