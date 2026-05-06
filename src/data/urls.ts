export const SITE_BASE_URL = 'https://website.brisapadel.com';
export const WEB_BASE_URL = import.meta.env.PUBLIC_WEB_BASE_URL ?? '';

export function siteUrl(path: string) {
  return path;
}

export function webUrl(path: string) {
  return WEB_BASE_URL ? `${WEB_BASE_URL}${path}` : path;
}
