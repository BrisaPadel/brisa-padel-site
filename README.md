# Brisa Padel Portal (Astro)

SEO-focused Astro starter for Brisa Padel homepage with EN/ES localization.

## What is included
- Localized home pages:
  - `/` (English)
  - `/es` (Spanish)
- Language switch behavior with persisted preference via `localStorage`
- SEO basics:
  - canonical tags
  - `hreflang` for EN/ES + `x-default`
  - Open Graph and Twitter meta tags
  - `robots.txt`
  - XML sitemap via `@astrojs/sitemap`

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Notes
- Update `site` in `astro.config.mjs` if domain changes.
- Links like `/request-access`, `/contact`, `/terms`, `/privacy`, `/login` are intentionally kept to match the existing portal flow and can be implemented next.
