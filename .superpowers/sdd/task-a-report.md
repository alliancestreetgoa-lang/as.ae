# Task A Report — Schema Fixes, Article Schema Builder, Founder Centralization

## 1. Fixed `about-us/page.tsx`'s incorrect `serviceSchema()` usage

**Before:** The page called `serviceSchema({ name: "About Alliance Street Consultancy", ..., path: "about-us" })` and rendered `[SCHEMA, breadcrumbSchema(...)]` as a JSON-LD array, producing an `"@type":"Service"` node for a company-info page — semantically wrong per schema.org (About Us is not an offered service).

**After:** Removed the `serviceSchema` import, the `SCHEMA` constant, and the array wrapper. The page now renders only `breadcrumbSchema("About Us", "about-us")` — a single object, matching the exact pattern already used by `careers/page.tsx` and `contact-us/page.tsx` for pages without a Service schema (`JSON.stringify(breadcrumbSchema(...))`, no array). No replacement schema type (e.g. `AboutPage`) was added, per the task's guidance to keep the fix minimal.

File: `src/app/about-us/page.tsx`

## 2. Fixed `sitemap.ts`'s shared `lastModified`

**Before:** `const lastModified = new Date();` was computed once per build and reused identically for all 11 routes in `ROUTES.map(...)`, so every page claimed to have been "modified" at build time regardless of actual content changes.

**After:** Added a `lastModified: string` field (ISO date `"2026-07-14"`, today's date per the system clock at commit time) to every entry in the `ROUTES` array, updated the array's inline type to include it, and changed `sitemap()` to destructure and use `route.lastModified` per-entry instead of the single shared variable. A doc comment on `ROUTES` explains the mechanism and that future content edits to a specific page should update just that page's date. All values are identical today (expected — no historical per-page change data exists), but the field itself is genuinely per-route and independently editable going forward.

File: `src/app/sitemap.ts`

## 3. Added `articleSchema()` builder

Added a new exported function in `src/lib/schema.ts`, positioned after `serviceSchema()` and before `breadcrumbSchema()`, following the same TSDoc-comment and URL-construction (`${SITE_URL}/${path}/`) conventions as the existing functions:

```ts
export function articleSchema({
  headline,
  description,
  path,
  datePublished,
  dateModified,
  authorName = ORG_NAME,
}: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: `${SITE_URL}/${path}/`,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author:
      authorName === ORG_NAME
        ? { "@type": "Organization", name: ORG_NAME, url: `${SITE_URL}/` }
        : { "@type": "Person", name: authorName },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}
```

- `authorName` defaults to `ORG_NAME` (not a hardcoded string), matching the task's requirement that the default author references the org.
- When `authorName === ORG_NAME`, `author` is an `Organization` node; if a caller ever passes a different name (a future named article author), it falls back to a `Person` node — fully typed, no `any`.
- `publisher` references the Organization by `@id` (`${SITE_URL}/#organization`), mirroring `websiteSchema()`'s publisher pattern exactly.
- Fully typed, matches existing function signatures' style (destructured object param with inline type).
- Not called anywhere — confirmed via grep (see Verification).

File: `src/lib/schema.ts`

## 4. Centralized the founder's name

**Before:** `organizationSchema()` hardcoded `founder: { "@type": "Person", name: "Stallone Shaikh", jobTitle: "Founder & CEO" }` inline.

**After:**
- Added `export const FOUNDER = { name: "Stallone Shaikh", jobTitle: "Founder & CEO" };` to `src/lib/content.ts` (placed right before `NAV_ITEMS`, with a short doc comment; matches the file's existing flat `export const` convention — no new type needed since it's a simple two-field literal).
- `src/lib/schema.ts` now imports `FOUNDER` from `@/lib/content` and uses `FOUNDER.name` / `FOUNDER.jobTitle` in `organizationSchema()`.
- **Judgment call (optional, low-risk, done):** Also updated the two page-level "Founder credential block"s in `src/app/about-us/page.tsx` and `src/app/contact-us/page.tsx`, which previously hardcoded `"Stallone Shaikh"` and `"Founder & CEO"` as plain JSX text/alt strings. Both now import `FOUNDER` from `@/lib/content` and reference `{FOUNDER.name}` / `{FOUNDER.jobTitle}` (image `alt` uses a template literal). This was explicitly framed as optional in the task; I did it because it was a same-shape, mechanical substitution with no behavioral risk and directly serves the "centralize" goal. `PUBLICATIONS` press-quote titles/excerpts in `content.ts` and `llms.txt/route.ts` were deliberately left untouched — those are verbatim press-coverage text and site copy sentences, not structural name/title fields, so rewriting them was out of scope and riskier.

Files: `src/lib/content.ts`, `src/lib/schema.ts`, `src/app/about-us/page.tsx`, `src/app/contact-us/page.tsx`

## Verification

1. **Build:**
   ```
   NEXT_PUBLIC_SITE_URL=https://shaukinsv.com NEXT_PUBLIC_SITE_ENVIRONMENT=staging npm run build
   ```
   Succeeded — all 17 static routes generated, no errors.

   - `grep -o '"@type":"Service"' out/about-us/index.html` → **no matches** (confirmed absent).
   - `grep -o 'BreadcrumbList' out/about-us/index.html` → 2 matches, both from the same single `breadcrumbSchema()` JSON-LD payload: one in the rendered `<script>` tag, one in Next's duplicated RSC flight-data serialization of the same script element (normal Next.js static-export behavior, not a duplicate schema node). Confirmed via `grep -o 'application/ld+json.\{0,300\}'` that the actual JSON-LD payload is a single BreadcrumbList object, not an array.
   - `cat out/sitemap.xml` → every `<url>` has `<lastmod>2026-07-14</lastmod>`; confirmed the underlying `sitemap.ts` code reads `route.lastModified` per array entry (not a single shared `Date` variable) — code-correctness verified by reading the diff, not just output.

2. **Typecheck:**
   ```
   NEXT_PUBLIC_SITE_URL=https://shaukinsv.com NEXT_PUBLIC_SITE_ENVIRONMENT=staging npm run typecheck
   ```
   Passed with no errors (`tsc --noEmit`).

3. **Lint:**
   ```
   npm run lint
   ```
   Passed with no errors (`eslint`).

4. **`articleSchema()` unused check:**
   ```
   grep -rn "articleSchema" src
   ```
   Only one match: the function definition in `src/lib/schema.ts:105`. Confirmed exported but not imported/called anywhere — expected, since no resource/blog pages exist yet.

5. **No invented facts:**
   Reviewed full `git diff` by hand. The only new literal values introduced are:
   - `"2026-07-14"` — today's actual system date (confirmed via `date` command), used consistently as the sitemap's current-baseline `lastModified` for all routes (not a fabricated historical date).
   - `FOUNDER = { name: "Stallone Shaikh", jobTitle: "Founder & CEO" }` — copied verbatim from the pre-existing hardcoded literal in `schema.ts` (itself corroborated by `PUBLICATIONS` press entries in `content.ts`), not a new fact.
   No new prices, addresses, reviews, awards, or credentials were introduced anywhere.

## Files changed

- `src/app/about-us/page.tsx`
- `src/app/contact-us/page.tsx`
- `src/app/sitemap.ts`
- `src/lib/content.ts`
- `src/lib/schema.ts`

## Self-review findings

- Verified `about-us` and `contact-us`'s single-schema JSON-LD pattern (`JSON.stringify(breadcrumbSchema(...))`, no array) already existed elsewhere in the codebase (`careers/page.tsx`) before adopting it for `about-us`, so the fix follows an established convention rather than inventing a new one.
- Confirmed `schema.ts` does not import or use the `pageUrl()` helper from `site-config.ts` anywhere (checked all existing functions) — so `articleSchema()` intentionally matches `serviceSchema()`'s manual `${SITE_URL}/${path}/` construction rather than introducing a new import pattern into the file.
- Confirmed no other file references the old `SCHEMA` constant removed from `about-us/page.tsx` (it was page-local, not exported).

## Concerns / judgment calls

- The optional founder-name centralization in `about-us`/`contact-us` page bodies (item 4) was not strictly required by the task; flagged above as a deliberate low-risk judgment call, easy to revert if unwanted (isolated to two small JSX substitutions plus one import line each).
- `articleSchema()`'s `author` type-branching (`Organization` when `authorName === ORG_NAME`, else `Person`) was my interpretation of the task's "Person or Organization — use Organization by default" instruction, since the task didn't specify exact branching logic; this seemed the most natural reading and keeps the function usable for a future named-author article without further changes.
