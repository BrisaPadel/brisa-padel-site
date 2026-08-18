# Brisa Padel Portal — Next.js

Marketing site for Brisa Padel, migrated from Astro to **Next.js 16 (App Router)**
on the `next-js-setup` branch. The `main` branch still holds the original Astro
implementation.

## Stack

| Concern | Choice |
|---|---|
| Framework | Next.js 16, App Router, React 19 |
| Rendering | Fully static — every route is prerendered at build time |
| Styling | CSS Modules, ported verbatim from the Astro `<style>` blocks |
| i18n | Two root layouts (`app/(en)`, `app/(es)`) so `<html lang>` is correct without middleware |
| SEO | Metadata API — canonical, per-page hreflang, Open Graph, Twitter, `sitemap.xml`, `robots.txt` |
| Output | `standalone` — the Docker image runs `node server.js` |

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build && npm start   # production build
npm run typecheck            # tsc --noEmit
npm run lint                 # eslint
```

## Routes

Fourteen static routes; the `/es` tree mirrors the English one.

| English | Spanish |
|---|---|
| `/` | `/es` |
| `/home` | `/es/home` |
| `/about` | `/es/about` |
| `/contact` | `/es/contact` |
| `/membership` | `/es/membership` |
| `/terms` | `/es/terms` |
| `/privacy` | `/es/privacy` |

`/home` and `/es/home` render the same component as `/` and `/es` and
canonicalise to them.

## Environment variables

| Variable | Default | Purpose |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://website.brisapadel.com` | Base for canonical, hreflang, OG and sitemap URLs |
| `NEXT_PUBLIC_WEB_BASE_URL` | *(empty)* | Prefix for links into the React app (`/login`, `/request-access`) |

Both are inlined into the client bundle at build time — set them as Docker build
args, not just at runtime.

## Layout

```
app/
  (en)/            English root layout + routes      -> /, /home, /about, ...
  (es)/es/         Spanish root layout + routes      -> /es, /es/home, ...
  sitemap.ts       Canonical URLs with hreflang alternates
  robots.ts        robots.txt
components/        Page components + co-located .module.css
data/              i18n strings, legal copy, URL helpers
lib/seo.ts         buildMetadata() — canonical, hreflang, OG, Twitter
styles/globals.css Design tokens and resets (was BaseLayout's is:global block)
```

### The `.s` scope class

Astro scoped component CSS by stamping `[data-astro-cid-…]` onto every element
and every compound selector. CSS Modules only scope class selectors, so a bare
`h1 { }` would have leaked globally and specificity would have shifted — which
silently changes which rule wins.

Each module therefore defines a scope class `s` that is applied to every element
the component renders, and every compound selector carries it. `[data-astro-cid]`
and `.s` both count as one class, so specificity is identical to the Astro build.

This matters. For example `.lang-switch.s .lang-btn.s` (0,4,0) still outranks
`.lang-btn.s:hover` (0,3,0), so hovering a language button changes only its
background — exactly as before. A naive port would have flipped that.

## Adding slug-based routes

`lib/seo.ts` takes any path, so dynamic routes work the same as static ones:

```tsx
export async function generateMetadata({ params }) {
  const { slug } = await params;
  return buildMetadata({ title, description, lang: 'en', basePath: `/clubs/${slug}` });
}
```

To list them in the sitemap, make `app/sitemap.ts` async and concatenate the
slug paths onto `STATIC_BASE_PATHS`.

## Deployment

`next.config.ts` sets `output: "standalone"`, so the Docker image contains a
self-contained server:

```bash
docker build --build-arg NEXT_PUBLIC_SITE_URL=https://website.brisapadel.com -t brisa-padel-site .
docker run -p 3000:3000 brisa-padel-site
```

The container listens on **3000** and serves the app itself. The previous Astro
image served static files through nginx on port 80, so any port mapping or
reverse-proxy config that assumed `:80` needs updating.
