# Alliance Street (as.ae) Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the entire Alliance Street site (homepage + 6 sub-pages) into the "Modern Institutional Red" design language — editorial ink-on-cream, Fraunces display serif, red as a sparing jewel accent, rich scroll-driven motion — sourcing components from 21st.dev re-themed to the brand.

**Architecture:** Build a thin design-system foundation first (color/type tokens, `next/font` fonts, a GSAP motion layer, and reusable primitives), then rebuild each homepage section and sub-page on top of it. Content, routes, and imagery are preserved from the existing codebase; only presentation changes. Each section sources a 21st.dev base component, re-themed to brand tokens.

**Tech Stack:** Next.js 16.2.1 (App Router) · React 19.2.4 · TypeScript strict · Tailwind v4 · shadcn 4 · @base-ui/react · lucide-react · **+ gsap + @gsap/react** · fonts via `next/font/google` (Fraunces, Geist Sans, Geist Mono).

## Global Constraints

- **Preserve content & routes:** all copy comes from `src/lib/content.ts`; types from `src/types/index.ts`. Do not delete routes or content. IA is fixed: `/`, `/dubai-business-setup`, `/banking`, `/bookkeeping-accounting`, `/financial-services`, `/real-estate`, `/contact-us`.
- **Red is accent-only:** `#e22e34` used for CTAs, active states, eyebrow ticks, the corner-bracket motif, and one hero gradient. No large flat-red section fills except the existing "As Seen In" red gradient band.
- **Fonts:** Fraunces = display/headings; Geist Sans = body/UI; Geist Mono = eyebrow labels (uppercase, tracked). Replaces Inter + Poppins.
- **Colors:** `--as-ink #101014`, `--as-red #e22e34`, `--as-red-bright #f13232`, `--as-canvas #FAFAF8`, plus one hairline `--as-line` and one warm `--as-muted`.
- **Motion:** GSAP + ScrollTrigger; transform/opacity only; every animation must fully degrade under `prefers-reduced-motion: reduce` (reduced users see final state, no motion).
- **No external image hosts:** vendor any new imagery to `public/images/`. Production `basePath` is `/as.ae` (GitHub Pages) — use the existing asset-path pattern; never hard-code `/as.ae`.
- **shadcn/Tailwind-compatible only:** 21st.dev components must drop in without bespoke adapter glue.
- **Verification is visual + build:** the "test" for UI tasks is (a) dev server renders correctly (preview tools: snapshot/inspect/screenshot), and (b) `npm run build` passes clean. Commit after each task.

---

## File Structure

**Foundation (new):**
- `src/app/globals.css` (modify) — brand tokens + font vars.
- `src/app/layout.tsx` (modify) — swap fonts to Fraunces/Geist.
- `src/components/motion/Reveal.tsx` (new) — scroll-reveal wrapper.
- `src/components/motion/useReveal.ts` (new) — GSAP reveal hook + reduced-motion guard.
- `src/components/motion/Counter.tsx` (new) — animated number counter.
- `src/components/primitives/Section.tsx` (new) — section wrapper (spacing, grid, bg variants).
- `src/components/primitives/Eyebrow.tsx` (new) — tracked mono label.
- `src/components/primitives/Frame.tsx` (new) — corner-bracket frame motif.

**Sections (modify in place, same filenames/exports):** `Navbar`, `Hero`, `Mission`, `Solutions`, `StatsBanner`, `Values`, `Process`, `Publications`, `Testimonials`, `Collaborate`, `AsSeenIn`, `Footer`.

**Shared page primitives (modify):** `PageHero`, `GradientHero`, `ImageHero`, `StepsSection`, `InfoBlocks`, `FeatureGrid`, `Stats3`.

**Pages (modify assembly only):** the 7 `page.tsx` route files.

---

## Phase 0 — Setup & baseline

### Task 0: Baseline + dependencies

**Files:**
- Modify: `package.json` (add `gsap`, `@gsap/react`)

- [ ] **Step 1: Install & verify baseline builds**

```bash
cd ~/Desktop/as.ae
npm install
npm run build
```
Expected: build succeeds, 7 routes prerendered, no errors.

- [ ] **Step 2: Start dev server and confirm the current site renders**

Use preview tools: create `.claude/launch.json` with a `dev` config (`npm run dev`, port 3000), `preview_start` it, `preview_snapshot` the homepage. Expected: current red/ink site renders.

- [ ] **Step 3: Add motion deps**

```bash
npm install gsap @gsap/react
```
Expected: installs clean (gsap is MIT/free for standard ScrollTrigger).

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json .claude/launch.json
git commit -m "chore: add gsap deps, verify baseline"
```

---

## Phase 1 — Design-system foundation

### Task 1: Fonts (Fraunces + Geist)

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/globals.css` (font vars in `@theme inline`)

**Interfaces:**
- Produces: CSS vars `--font-fraunces`, `--font-geist-sans`, `--font-geist-mono`; Tailwind font families `font-display` (Fraunces), `font-sans` (Geist Sans), `font-mono` (Geist Mono).

- [ ] **Step 1: Swap font imports in `layout.tsx`**

```tsx
import { Fraunces, Geist, Geist_Mono } from "next/font/google";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  axes: ["opsz"],
});
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
```
Replace the `<html className>` to use `${fraunces.variable} ${geistSans.variable} ${geistMono.variable} antialiased`. Remove Inter/Poppins imports.

- [ ] **Step 2: Update `@theme inline` in `globals.css`**

```css
--font-sans: var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif;
--font-mono: var(--font-geist-mono), ui-monospace, monospace;
--font-display: var(--font-fraunces), Georgia, "Times New Roman", serif;
--font-heading: var(--font-fraunces), Georgia, serif;
```
Remove `--font-inter` / `--font-poppins` vars.

- [ ] **Step 3: Verify in browser**

Reload dev server. `preview_inspect` an `<h1>` — expected `font-family` resolves to Fraunces. Body text resolves to Geist. No FOUT errors in `preview_console_logs`.

- [ ] **Step 4: Commit**

```bash
git add src/app/layout.tsx src/app/globals.css
git commit -m "feat: swap to Fraunces display + Geist body/mono fonts"
```

### Task 2: Color tokens

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx` (`<body>` base bg/text)

**Interfaces:**
- Produces: `--color-as-ink`, `--color-as-red`, `--color-as-red-bright`, `--color-as-canvas`, `--color-as-line`, `--color-as-muted` — usable as `bg-as-canvas text-as-ink` etc.

- [ ] **Step 1: Update brand palette in `@theme inline`**

```css
--color-as-ink: #101014;
--color-as-red: #e22e34;
--color-as-red-bright: #f13232;
--color-as-canvas: #FAFAF8;
--color-as-line: #ecebe7;
--color-as-muted: #6f6f78;
```
Keep the old `--color-as-*` names that content/components still reference (map `--color-as-light` → canvas value) to avoid breaking un-migrated sections mid-phase.

- [ ] **Step 2: Set base surface**

In `layout.tsx`, change `<body>` to `className="min-h-full bg-as-canvas text-as-ink font-sans"`.

- [ ] **Step 3: Verify**

Reload. `preview_inspect body` → `background-color` ≈ `rgb(250, 250, 248)`, `color` ≈ `rgb(16,16,20)`. `preview_screenshot` — page reads warm off-white, not stark white.

- [ ] **Step 4: Commit**

```bash
git add src/app/globals.css src/app/layout.tsx
git commit -m "feat: Modern Institutional Red color tokens"
```

### Task 3: Motion foundation

**Files:**
- Create: `src/components/motion/useReveal.ts`
- Create: `src/components/motion/Reveal.tsx`
- Create: `src/components/motion/Counter.tsx`

**Interfaces:**
- Produces:
  - `useReveal(opts?: { y?: number; delay?: number; duration?: number }): React.RefObject<HTMLElement>` — attaches a ScrollTrigger fade/slide-up; no-op under reduced motion.
  - `<Reveal as?="div" y?={number} delay?={number} className?={string}>children</Reveal>` — wrapper using `useReveal`.
  - `<Counter to={number} suffix?={string} className?={string} />` — counts up on scroll into view; renders final value immediately under reduced motion.

- [ ] **Step 1: Implement `useReveal.ts`**

```ts
"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger, useGSAP);

const prefersReduced = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export function useReveal({ y = 24, delay = 0, duration = 0.7 } = {}) {
  const ref = useRef<HTMLElement>(null);
  useGSAP(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    gsap.fromTo(
      el,
      { opacity: 0, y },
      {
        opacity: 1, y: 0, duration, delay, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      }
    );
  }, { scope: ref });
  return ref;
}
```

- [ ] **Step 2: Implement `Reveal.tsx`** — thin wrapper that spreads `useReveal()` ref onto the chosen element and renders `children`. Under reduced motion the element renders at full opacity by default (never start hidden in CSS — start visible, let GSAP set the from-state only when it runs).

- [ ] **Step 3: Implement `Counter.tsx`** — client component; on ScrollTrigger enter, `gsap.to({ val: 0 }, { val: to, ... onUpdate })`; under reduced motion set text to final value on mount.

- [ ] **Step 4: Verify with a scratch element**

Temporarily drop a `<Reveal>` + `<Counter to={200} suffix="+" />` on the homepage. Reload, scroll, `preview_screenshot` mid-scroll to confirm reveal; `preview_resize` with `colorScheme` unaffected; toggle reduced motion via `preview_eval` matchMedia stub or DevTools emulation and confirm final state shows instantly. Remove scratch usage.

- [ ] **Step 5: Commit**

```bash
git add src/components/motion
git commit -m "feat: GSAP motion foundation (Reveal, useReveal, Counter)"
```

### Task 4: Primitives (Section, Eyebrow, Frame)

**Files:**
- Create: `src/components/primitives/Section.tsx`
- Create: `src/components/primitives/Eyebrow.tsx`
- Create: `src/components/primitives/Frame.tsx`

**Interfaces:**
- Produces:
  - `<Section id?={string} bg?="canvas"|"ink"|"transparent" className?={string}>` — max-width container, responsive vertical rhythm, 12-col grid context.
  - `<Eyebrow>label</Eyebrow>` — `font-mono uppercase tracking-[0.2em] text-xs text-as-red` with a small tick.
  - `<Frame>children</Frame>` — wraps content with the four corner-bracket SVGs (reuse `public/images/rectangle-5.svg` or inline CSS brackets) as the recurring brand motif.

- [ ] **Step 1: Implement the three primitives** with the signatures above, using brand tokens.

- [ ] **Step 2: Verify on scratch page** — render all three; `preview_inspect` Eyebrow letter-spacing ≈ 0.2em, red; Frame shows brackets at corners; Section max-width + padding correct at mobile/desktop (`preview_resize`).

- [ ] **Step 3: Commit**

```bash
git add src/components/primitives
git commit -m "feat: Section, Eyebrow, corner-bracket Frame primitives"
```

---

## Phase 2 — Homepage sections

> **Per-section procedure (applies to Tasks 5–16):**
> 1. Read the section's current component + its content in `src/lib/content.ts` (never change the content shape).
> 2. **Source:** run the given 21st.dev search (21st MCP `search` / `21st` CLI); pick the strongest base; if none fits, generate with 21st AI or hand-build in the primitives' style.
> 3. **Re-theme:** map to brand tokens (Fraunces display, Geist body, ink/canvas, red accent-only), wrap headings in `<Reveal>`, add the specified motion, apply the `Frame`/`Eyebrow` motifs where noted.
> 4. **Verify:** reload; `preview_snapshot` (content/structure intact), `preview_screenshot` (look), `preview_inspect` (token values), `preview_resize` mobile+desktop (no overflow); check reduced-motion final state.
> 5. `npm run build` passes; commit `feat: redesign <Section>`.

### Task 5: Navbar
**Files:** Modify `src/components/Navbar.tsx`.
**Source query:** "sticky transparent navbar scroll to solid, shadcn". **Motion:** transparent over hero → solid `as-ink` on `scrollY > 40` (keep existing scroll logic); animated mobile menu. **Notes:** red only on the primary CTA pill. Verify scroll state via `preview_eval` scroll + `preview_inspect` background.

### Task 6: Hero
**Files:** Modify `src/components/Hero.tsx`.
**Source query:** "editorial hero with large serif headline, eyebrow, corner frame, background gradient". **Motion:** staggered load reveal (eyebrow → headline lines → subcopy → CTAs); subtle parallax on the hero gradient/graphic. **Notes:** Fraunces headline at display scale; keep the red hero gradient as the one large red moment; `Frame` corner brackets. Verify headline uses Fraunces (`preview_inspect`).

### Task 7: Mission
**Files:** Modify `src/components/Mission.tsx`.
**Source query:** "statement section with video thumbnail, editorial". **Motion:** `Reveal` on statement; hover-scale on video thumb. **Content:** `mission-team-homepage.jpg`.

### Task 8: Solutions
**Files:** Modify `src/components/Solutions.tsx`.
**Source query:** "bento feature grid cards with icons, shadcn". **Motion:** staggered card reveals. **Notes:** bento grouping (4 solution cards + graph card + 200+ trust card); red only on icons/accents; `graph-card.png`, trust avatars.

### Task 9: StatsBanner
**Files:** Modify `src/components/StatsBanner.tsx`.
**Source query:** "full-bleed image stat band with large number overlay". **Motion:** `<Counter to={200} suffix="+">` on scroll; image parallax. **Content:** `reviews.png`.

### Task 10: Values
**Files:** Modify `src/components/Values.tsx`.
**Source query:** "image + values list (Integrity/Innovation/Excellence), editorial split". **Motion:** `Reveal` per value row. **Content:** `values-stallone.jpg`.

### Task 11: Process (Battleplan)
**Files:** Modify `src/components/Process.tsx`.
**Source query:** "pinned scroll steps / tabbed process section, gsap". **Motion:** **pinned** section — steps advance as user scrolls (ScrollTrigger pin + scrub), keeping the existing 4 panels (Strategy, Next Step/Global Citizen, Vitamin C(onnections), Peace of Mind). Preserve click-to-tab as reduced-motion fallback. **Content:** `strategy`/`businesswoman`/`bank`/`compliance` images.

### Task 12: Publications
**Files:** Modify `src/components/Publications.tsx`.
**Source query:** "sticky-left intro with horizontally scrolling cards". **Motion:** sticky intro + horizontal scroll/marquee of press cards. **Content:** Daily Mail, Forbes, Gulf News, Business Insider, CEO Weekly, Digital Journal, Khaleej Times covers.

### Task 13: Testimonials
**Files:** Modify `src/components/Testimonials.tsx`.
**Source query:** "testimonial slider / carousel, shadcn". **Motion:** slide transitions; autoplay pausable. **Content:** Charlotte/Phaibion/Richard (quotes already in content.ts).

### Task 14: Collaborate
**Files:** Modify `src/components/Collaborate.tsx`.
**Source query:** "orbital avatars graphic CTA section". **Motion:** slow continuous orbit rotation (paused under reduced motion). **Content:** `orbit-1..6`, badge icons.

### Task 15: AsSeenIn
**Files:** Modify `src/components/AsSeenIn.tsx`.
**Source query:** "logo marquee over gradient band". **Motion:** infinite marquee of press logos. **Notes:** this is the deliberate large-red gradient band (kept). **Content:** press logos.

### Task 16: Footer
**Files:** Modify `src/components/Footer.tsx`.
**Source query:** "large editorial footer with link columns and headline". **Motion:** `Reveal` on the "Clean. Legal. Compliant." headline. **Notes:** Fraunces headline; link columns; keep white/black inversion or restyle to ink.

### Task 17: Homepage assembly + full-scroll verification
**Files:** `src/app/page.tsx` (only if section order/props changed — likely unchanged).
- [ ] Reload homepage; `preview_screenshot` at top, mid, bottom; `preview_snapshot` confirms all 11 sections present and content intact.
- [ ] `preview_resize mobile` — scroll full page, confirm no horizontal overflow, motifs adapt.
- [ ] Reduced-motion pass (`preview_resize colorScheme` n/a; emulate reduced motion) — every section shows final state, page is fully usable.
- [ ] `npm run build` clean. Commit `feat: complete homepage redesign`.

---

## Phase 3 — Sub-pages

### Task 18: Shared page primitives
**Files:** Modify `PageHero`, `GradientHero`, `ImageHero`, `StepsSection`, `InfoBlocks`, `FeatureGrid`, `Stats3`.
Re-theme each to the new tokens/fonts/motion (they back all 6 sub-pages). Add `Reveal`/`Eyebrow`/`Frame` where appropriate. Verify each renders on at least one consuming page. Commit `feat: redesign shared page primitives`.

> **Per-sub-page procedure (Tasks 19–24):** re-lay-out the route's `page.tsx` using the redesigned primitives + any section components it reuses. Content unchanged. Verify: `preview_snapshot` (content intact), `preview_screenshot`, `preview_resize` mobile/desktop, reduced-motion. `npm run build` clean. Commit.

### Task 19: `/dubai-business-setup`
**Files:** `src/app/dubai-business-setup/page.tsx` (+ any page-specific components).
Sections: "Are you next?" globe hero + Mission + Stats + "Go Global in 4 Steps" (StepsSection).

### Task 20: `/banking`
**Files:** `src/app/banking/page.tsx`.
Full-bleed `ImageHero` + "Good Ol' Times" `InfoBlocks` + "Done in 4 Strategic Steps".

### Task 21: `/bookkeeping-accounting`
**Files:** `src/app/bookkeeping-accounting/page.tsx`.
`GradientHero` + "Why Choose Us" checklist + Testimonials.

### Task 22: `/financial-services`
**Files:** `src/app/financial-services/page.tsx`.
Dark `PageHero` + 6-feature funding `FeatureGrid` + "You need it - we've got it" tabs.

### Task 23: `/real-estate`
**Files:** `src/app/real-estate/page.tsx`.
Split `GradientHero` + EMAAR/DAMAC/MERAAS/SOBHA/Omniyat developer logos + `InfoBlocks`.

### Task 24: `/contact-us`
**Files:** `src/app/contact-us/page.tsx`.
Offices grid (Dubai, RAK, UK, Germany, Austria, Slovakia). Ensure form controls (if any) use shadcn + brand tokens.

---

## Phase 4 — Final pass

### Task 25: Polish, audit, PR
- [ ] **Reduced-motion audit:** with `prefers-reduced-motion: reduce`, walk all 7 routes — no element stuck hidden, no motion. Fix any `Reveal` that starts hidden in CSS.
- [ ] **Responsive audit:** `preview_resize` mobile/tablet/desktop on all 7 routes — no horizontal overflow, tap targets ≥ 44px, type scales sanely.
- [ ] **Build & export:** `npm run build` clean (TS strict, all routes prerendered); confirm static export assets resolve under `basePath`.
- [ ] **Console/network:** `preview_console_logs` and `preview_network filter=failed` clean on each route.
- [ ] **Screenshots:** capture homepage + each sub-page for the PR.
- [ ] **PR:** push `redesign/21st-premium-red`, open PR to `master` with before/after screenshots.

```bash
cd ~/Desktop/as.ae
git push -u origin redesign/21st-premium-red
gh pr create --title "Redesign: Modern Institutional Red" --body "..."
```

---

## Self-Review

**Spec coverage:** tokens (T2) ✓ · Fraunces/Geist (T1) ✓ · corner-bracket motif (T4, used per-section) ✓ · red accent-only rule (Global Constraints + per-section notes) ✓ · GSAP scroll motion + reduced-motion (T3, per-section, T17/T25 audits) ✓ · 21st sourcing per section (Phase 2/3 procedure) ✓ · all 11 homepage sections (T5–16) ✓ · all 6 sub-pages (T19–24) ✓ · shared primitives (T18) ✓ · build/responsive/a11y (T25) ✓ · no external image hosts + basePath (Global Constraints) ✓.

**Placeholder scan:** foundation tasks (T1–4) carry complete code. Section tasks (T5–24) are catalog-sourced, so exact JSX is authored at execution from the chosen 21st component — each task still specifies concrete files, source query, motion, content source, and a verification loop (not "TBD"). This is intentional for design-catalog work.

**Type consistency:** `useReveal` / `<Reveal>` / `<Counter>` / `<Section>` / `<Eyebrow>` / `<Frame>` signatures defined in T3–T4 are used consistently in Phase 2/3.
