# Astrologer Kali Charan – Next.js

Next.js (App Router) version of the cloned static page (`index.html` + `styles.css`).

```bash
npm install
npm run dev     # http://localhost:3000
npm run build && npm start
```

## Structure

- `app/layout.tsx` – metadata (title, description, Open Graph) and optional Google Tag Manager / Ads tags
- `app/page.tsx` – composes the page sections
- `app/globals.css` – the original theme CSS (Bootstrap, Swiper, Font Awesome, theme, custom, inline styles)
- `app/next-overrides.css` – small additions for the React version (CSS marquee, scroll-top button reset)
- `components/` – one component per section; `ThSlider` replaces the jQuery Swiper setup
- `lib/site.ts` – phone numbers, links and all repeated content (services, counters, testimonials, footer links)

## Assets

All images and Font Awesome fonts live in `public/assets/` (same paths as the original site),
so the page has no dependency on the original domain. Only the Exo/Inter web fonts load from
Google Fonts (`fonts.gstatic.com`).

`assets/img/google-review.webp` (testimonial avatar) is missing on the original site too, so it
is not included.

## Tracking

Copy `.env.example` to `.env.local` to turn on the GTM / Google Ads tags from the original page.
