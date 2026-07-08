# Alliance Street (as.ae) — "Modern Institutional Red" Redesign

**Date:** 2026-07-08
**Branch:** `redesign/21st-premium-red`
**Status:** Approved design → ready for implementation planning

## Goal

Redesign the entire Alliance Street website (homepage + 6 sub-pages) with a fresh,
premium, editorial visual language. Keep the brand's signature red and all existing
content; replace the current Webflow-clone look with a distinctive 2026 execution built
from **21st.dev components re-themed to the brand**, with rich scroll-driven motion.

This is a **redesign**, not a content rewrite. Information architecture, copy, routes,
and imagery are preserved. Every section is re-laid-out and re-styled.

## Non-goals (YAGNI)

- No new pages, routes, or features beyond what exists today.
- No copywriting changes beyond fixing obvious placeholder/filler text if it blocks layout.
- No CMS, i18n, backend, or auth work.
- No change to the hosting/deploy target.

## Current state (baseline)

- **Stack:** Next.js 16.2.1 (App Router) · React 19.2.4 · TypeScript (strict) ·
  Tailwind v4 · shadcn 4 · @base-ui/react · lucide-react · tw-animate-css.
- **Content:** lives in `src/lib/content.ts`; types in `src/types/index.ts`.
- **Tokens:** `src/app/globals.css` (`--color-as-*`, shadcn oklch vars).
- **Routes:** `/`, `/dubai-business-setup`, `/banking`, `/bookkeeping-accounting`,
  `/financial-services`, `/real-estate`, `/contact-us`.
- **Homepage sections (11):** Navbar, Hero, Mission, Solutions, StatsBanner, Values,
  Process (Battleplan), Publications, Testimonials, Collaborate, AsSeenIn, Footer.
- **~19 hand-coded components** in `src/components/` + shared page primitives
  (`PageHero`, `GradientHero`, `ImageHero`, `StepsSection`, `InfoBlocks`,
  `FeatureGrid`, `Stats3`).
- **Assets:** ~45 images/SVGs already vendored to `public/images/`.

## Design language: "Modern Institutional Red"

**Concept:** the red is a jewel tone, not the wallpaper. Most of the page is restrained
ink-on-cream editorial layout; red earns attention because it is used sparingly and
deliberately.

### Color tokens

| Token | Value | Use |
|-------|-------|-----|
| `--as-ink` | `#101014` | primary text, dark sections (deepened from `#171719`) |
| `--as-red` | `#e22e34` | signature accent — CTAs, key highlights, motif |
| `--as-red-bright` | `#f13232` | gradients, glows, hover |
| `--as-canvas` | `#FAFAF8` | warm off-white page base (replaces flat `#fafafa`) |
| `--as-line` | hairline border neutral | dividers, card borders |
| `--as-muted` | warm gray | secondary text |

Red usage rule: **accent only** — CTAs, eyebrow ticks, active states, one hero gradient,
the corner-bracket motif. Never large flat red fills for whole sections except the
existing "As Seen In" red gradient band (kept as a deliberate punctuation).

### Typography

- **Display (headings):** **Fraunces** (variable, high-contrast optical serif) via
  `next/font/google`. Editorial, premium, with personality.
- **Body / UI:** **Geist Sans** — clean modern grotesque.
- **Eyebrow / labels:** **Geist Mono**, uppercase, tracked.
- Large, confident type scale; tighten tracking on display sizes.
- Replaces the current Inter + Poppins pairing.

### Motif

Retain the current hero's **corner-bracket** framing detail as a recurring brand
signature — used to frame stats, feature cards, and key images. Ties the redesign back
to the existing brand identity.

### Layout

12-column editorial grid, generous whitespace, deliberate asymmetry, bento groupings
where they earn their place. Same IA and content; every section re-laid-out.

## Motion (rich, scroll-driven)

- **Library:** GSAP + ScrollTrigger (`gsap`, `@gsap/react`).
- **Patterns:** hero reveal on load; section fade/slide-ins on scroll; **pinned**
  Process/Battleplan sequence; animated stat counters; press-logo marquee; subtle image
  parallax; refined hover micro-interactions.
- **Accessibility:** all motion gated behind `prefers-reduced-motion: reduce` — reduced
  users get instant, non-animated states.
- **Performance:** transform/opacity-only animations; lazy-init ScrollTriggers; no
  layout thrash.

## Component sourcing (21st.dev)

For each section, search the 21st.dev catalog (via the 21st MCP / `21st` CLI), select the
strongest base component, and **re-theme it to the brand tokens** (Fraunces/Geist,
ink/red/canvas). Target archetypes:

- Hero (with motion), bento feature grid, testimonial slider, logo marquee,
  stats band, steps/process (pinned), navbar, footer.

Where the catalog has no strong fit, generate a variant with 21st AI or hand-build in the
existing component style. Everything stays shadcn/Tailwind-compatible so it drops into the
current stack without adapter glue. Vendor any new imagery locally (no external image
hosts — matches existing project rule).

## Tech changes

- **Add:** `gsap`, `@gsap/react`. Wire Fraunces + Geist Sans + Geist Mono via `next/font`.
- **Keep:** Next 16 / React 19 / Tailwind v4 / shadcn / base-ui / lucide.
- **Refactor tokens:** update `globals.css` brand palette + font vars; introduce a small
  set of reusable primitives (Section wrapper, Eyebrow, corner-bracket Frame,
  Reveal-on-scroll wrapper) so sections stay consistent and thin.

## Build order

1. **Design-system layer:** tokens, fonts, motion utilities, shared primitives. Verify in
   isolation.
2. **Homepage, section by section:** Navbar → Hero → Mission → Solutions → StatsBanner →
   Values → Process → Publications → Testimonials → Collaborate → AsSeenIn → Footer.
   Verify each live in the browser before moving on.
3. **Sub-pages (6):** re-lay-out reusing the new system + primitives.
4. **Final pass:** `npm run build` clean, reduced-motion check, responsive/mobile check,
   Lighthouse sanity.

## Success criteria

- Every existing route renders with the new design language; no content lost.
- Red reads as a deliberate accent, not a flat background.
- Fraunces display + Geist body applied consistently; corner-bracket motif present.
- Scroll motion works and fully degrades under `prefers-reduced-motion`.
- `npm run build` passes clean (TypeScript strict, all routes prerendered).
- Responsive from mobile → desktop; no horizontal overflow.

## Risks / open items

- **21st.dev fit:** some archetypes may not have a strong catalog match → fall back to AI
  generation or hand-build. Budget for re-theming effort per component.
- **Fraunces weight:** high-contrast serif at large sizes needs careful line-height /
  tracking to stay legible and premium (not trendy). Restraint on optical settings.
- **Motion scope:** rich scroll motion is the heaviest maintenance surface; keep patterns
  centralized in reusable wrappers rather than per-section bespoke code.
- **Content filler:** CLONE_SUMMARY notes some testimonial/Battleplan body copy is
  representative filler — layout must not depend on exact lengths.
