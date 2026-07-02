# alliancestreet.ae — Clone Summary

Source: https://www.alliancestreet.ae/ (Webflow single-page site)
Rebuilt as: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4.

## Design tokens (extracted via getComputedStyle)
- Fonts: **Inter** (headings + body), **Poppins** (tracked eyebrow labels)
- H1: Inter 68px / 600, line-height 74.8px, letter-spacing -2.8px
- H2: Inter 50px / 600
- Accent red: `#e22e34` (bright `#f13232`) · ink `#171719` · muted `#9b9ba6` · light `#fafafa` / `#eff0f0`
- Hero gradient: `linear-gradient(#000, #e22e34 30%, #fff 77%)`
- Buttons: pill (radius 9999px). Dark = black/white; footer = white/black.
- Navbar: fixed 82px, transparent over hero → solid black on scroll (`window.scrollY > 40`).

Tokens live in `src/app/globals.css` (`--color-as-*`, `.as-*` utility classes).
Content lives in `src/lib/content.ts`; types in `src/types/index.ts`.

## Sections (top → bottom) → components
1. Navbar (`Navbar.tsx`, client — scroll-aware)
2. Hero (`Hero.tsx`) — gradient card, corner brackets, nomination badge
3. Mission (`Mission.tsx`) — statement + video thumbnail
4. Solutions (`Solutions.tsx`) — 4 cards + graph card + 200+ trust card
5. Stats banner (`StatsBanner.tsx`) — 200+ over businesswoman image
6. Values (`Values.tsx`) — image + Integrity/Innovation/Excellence
7. Process / Battleplan (`Process.tsx`, client — click-driven tabs)
8. Publications (`Publications.tsx`) — sticky-left intro + scrolling cards
9. Testimonials (`Testimonials.tsx`, client — slider)
10. Collaborate (`Collaborate.tsx`) — orbital avatar graphic
11. As Seen In (`AsSeenIn.tsx`) — press logos over red gradient
12. Footer (`Footer.tsx`) — Clean. Legal. Compliant. + link columns

## Assets
45 images/SVGs downloaded to `public/images/` via `scripts/download-assets.mjs`
(includes two CSS-background images — `team homepage.jpg`, `Stallone-min.jpg`).

Exact image → placement mapping (verified against the live DOM, incl. CSS backgrounds):
- Hero: gradient + `rectangle-5.svg` corner brackets (reproduced in CSS)
- Mission thumbnail: `mission-team-homepage.jpg`
- Solutions graph card: `graph-card.png`; trust-card avatars: `photo-2` / `mission-team` / `values-meeting`
- Stats banner (200+): `reviews.png`
- Values: `values-stallone.jpg`
- Battleplan panels: `strategy` (Strategy & Business Setup) · `businesswoman` (Next Step, Global Citizen) · `bank` (Vitamin C(onnections)) · `compliance` (Peace of Mind)
- Publications: Daily Mail `book-cover` · Forbes `book-mockup` · Gulf News · Business Insider · CEO Weekly · Digital Journal · Khaleej Times
- Testimonials: Charlotte `photo-2` · Phaibion `mission-team` · Richard `values-meeting`
- Collaborate orbit: `orbit-1..6`; badges `icon-lock` / `graph-new` / `icon-layers`
- As Seen In: `press-forbes` / `press-businessinsider` / `press-khaleejtimes` / `press-asiabusinessoutlook` / `press-benzinga`

## Known approximations (text only — all images are exact)
- Testimonials #2/#3: names/companies verbatim; the site only surfaced quote text
  for #1, so #2/#3 quote copy is representative filler.
- Battleplan tab panels 2–4: headings are the real ones; body copy is
  representative (site exposed only the first tab's body text on load).

## Sub-pages (all cloned as routes, reusing shared components)
- `/` — homepage
- `/dubai-business-setup` — "Are you next?" globe hero + Mission + Stats + "Go Global in 4 Steps"
- `/banking` — full-bleed image hero + "Good Ol' Times" info blocks + "Done in 4 Strategic Steps"
- `/bookkeeping-accounting` — gradient hero + "Why Choose Us" checklist + testimonials
- `/financial-services` — dark hero + 6-feature funding grid + "You need it - we've got it" tabs
- `/real-estate` — split gradient hero + EMAAR/DAMAC/MERAAS/SOBHA/Omniyat developer logos + info blocks
- `/contact-us` — offices across UAE (Dubai, RAK) & Europe (UK, Germany, Austria, Slovakia)

Shared building blocks: `Navbar`, `Footer`, `Solutions`, `Values`, `Testimonials`,
`Collaborate`, `AsSeenIn`, `StatsBanner`, plus reusable `PageHero`, `GradientHero`,
`ImageHero`, `StepsSection`, `InfoBlocks`, `FeatureGrid`, `Stats3`.

## Build / run
- `npm run build` — passes clean (TypeScript strict); 7 routes prerendered.
- `npm run dev` — dev server (used :3001 locally since :3000 was occupied).
