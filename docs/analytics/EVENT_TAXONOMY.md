# Analytics Event Taxonomy

This document is the reference for this site's GA4 analytics layer: how it
works, why the sanitizer exists, every event it can fire, and how to add a
new one. It is aimed at a future developer — including whoever wires up the
5 currently-unfired "greenfield" events below (`lead_qualified`,
`booking_started`, `booking_completed`, `guide_downloaded`,
`calculator_completed`) as those features get built.

## Overview

The analytics layer lives in three files, plus two mounted components:

- **`src/lib/analytics-config.ts`** — configuration and the consent
  choke-point.
  - `GA_MEASUREMENT_ID: string | undefined` — read from the
    `NEXT_PUBLIC_GA_MEASUREMENT_ID` env var. If the var is unset, or set but
    doesn't start with `"G-"` (a typo'd/malformed value), it's treated as
    `undefined`. **Analytics is entirely optional**: with no measurement ID
    configured, every part of this layer is a safe no-op — no script tag is
    injected, no event is ever sent, nothing throws.
  - `hasAnalyticsConsent(): boolean` — **currently a placeholder that always
    returns `true`.** This site has no consent-management UI yet, so there is
    nothing to gate on. This function is the single choke-point every other
    piece of the analytics layer checks before doing anything — when a real
    consent banner is built, only this function's body needs to change (e.g.
    to read a stored consent choice from `localStorage`/a cookie); no call
    site (`trackEvent()`, `<GoogleAnalytics>`) needs to change.
- **`src/lib/analytics.ts`** — the event taxonomy (below), the runtime
  sanitizer, and `trackEvent()`.
- **`src/lib/attribution.ts`** — first-touch UTM/landing-page capture (see
  [Attribution model](#attribution-model)).
- **`src/components/analytics/GoogleAnalytics.tsx`** — a `"use client"`
  component that conditionally renders the two `next/script` tags that load
  `gtag.js` and initialize `window.gtag`/`window.dataLayer`. Renders `null`
  (no script tags at all) unless `GA_MEASUREMENT_ID` is set **and**
  `hasAnalyticsConsent()` is `true`. Mounted in `src/app/layout.tsx`.
- **`src/components/analytics/AttributionCapture.tsx`** — a `"use client"`
  component that calls `captureAttribution()` once on mount. Also mounted in
  `src/app/layout.tsx`, before `<GoogleAnalytics />`.

### `trackEvent()`'s no-op guarantees

`trackEvent(event: AnalyticsEvent): void` in `src/lib/analytics.ts` is the
only function any call site should ever call to fire an event. It is safe to
call unconditionally from anywhere — a component, an effect, an event
handler — with **no** error handling needed around it, because it never
throws and silently no-ops if any of the following is true, checked in this
order:

1. `typeof window === "undefined"` (server-side / build time).
2. `!GA_MEASUREMENT_ID` (analytics not configured).
3. `!hasAnalyticsConsent()` (consent not granted — currently never true, see
   above).
4. `typeof window.gtag !== "function"` (the `gtag.js` script hasn't loaded
   yet, or `<GoogleAnalytics>` didn't render it).

Only if all four checks pass does it call
`sanitizeEventPayload(event)` and then `window.gtag("event", event.name,
sanitizedParams)`.

## The sanitization mechanism

**Why it exists**: this site's one lead-intake form (`ChatWidget.tsx`'s
`LEAD_FIELDS`) has 7 entirely free-text fields — name, company, email,
phone, revenue, occupation, business — none of which are safe to forward to
a third-party analytics vendor. A visitor can type anything into any of
them. The sanitizer is defense-in-depth against ever leaking one of those
fields (or anything shaped like them) into GA4, independent of how careful
any individual `trackEvent()` call site tries to be.

`sanitizeEventPayload(event: AnalyticsEvent): Record<string, string | number
| boolean>` in `src/lib/analytics.ts` runs every event's `params` through a
fixed pipeline, in this order, each step independent and unconditional:

1. **Denylist (checked first, unconditionally)** — `DENYLISTED_KEYS = [
   "name", "email", "phone", "company", "address", "message", "password",
   "ssn" ]`. Matching is case-insensitive. Every term except `"name"` is a
   **substring** match (so a key like `"userEmail"` is caught by `"email"`).
   `"name"` is the one exception: it's checked as an **exact** key match
   only. This is a deliberate, documented judgment call (see the comment
   above `DENYLISTED_KEYS` in `analytics.ts`): a blanket substring match on
   `"name"` would also catch the taxonomy's own legitimate `form_name`
   param (`form_start`/`form_submit`), since `"form_name".includes("name")`
   is `true` — which would silently break two of the 13 specified events. In
   development (`NODE_ENV !== "production"`), a dropped denylisted key logs
   a `console.warn` so the drop is never silent to a developer debugging
   locally.
2. **Allowlist (per event)** — `EVENT_PARAM_ALLOWLIST` maps each event name
   to the exact list of param keys that event is allowed to send. Any key
   not on that event's list is dropped, even if it would otherwise be a
   perfectly safe primitive value. This is checked independently of
   TypeScript's own types: TypeScript's excess-property checks only apply to
   object literals, not to a value passed through a variable, so a caller
   could construct an `AnalyticsEvent` with extra properties that the type
   system wouldn't catch — this runtime map is the actual enforcement point.
3. **Non-primitive drop** — any remaining value that isn't a `string`,
   `number`, or `boolean` (arrays, nested objects, functions, etc.) is
   dropped. GA4 event params are always flat.
4. **100-character truncation** — any remaining string value longer than 100
   characters is truncated to exactly 100 characters.

The function never throws: a malformed event produces an empty or partial
payload, never a crash. It has no side effects beyond the optional dev-only
`console.warn` above.

## Every event

All 13 events are declared as a single discriminated union, `AnalyticsEvent`
(keyed on `name`), in `src/lib/analytics.ts`. "PII" below means anything a
visitor could type freely into a form field (name, email, phone, company,
etc.) — every event listed is explicitly designed to carry none.

| Event | Fires when | Params (type) | PII | Wired at |
|---|---|---|---|---|
| `nav_cta_click` | A primary nav "Get in Touch" CTA is clicked (desktop or mobile). | `cta_label: string`, `location: string` | Contains no PII — `cta_label` is a fixed button caption, `location` is a static site-position string (`navbar_desktop` \| `navbar_mobile`), never user input. | `src/components/Navbar.tsx` |
| `consultation_cta_click` | A "let's talk / get in touch"-style CTA is clicked outside the nav (hero, footer, section CTAs, per-page hero defaults). | `cta_label: string`, `location: string` | Contains no PII — same shape as `nav_cta_click`; both values are developer-controlled strings, never user input. | `src/components/Hero.tsx`, `Solutions.tsx`, `Footer.tsx`, `Publications.tsx`, `Collaborate.tsx`, `StepsSection.tsx`, `StatsBanner.tsx`, `src/app/real-estate/page.tsx`, `src/app/bookkeeping-accounting/page.tsx`, and the default `ctaTrack` on `GradientHero.tsx`/`PageHero.tsx`/`ImageHero.tsx` |
| `contact_click` | A phone or email contact link is clicked on the Contact Us page. | `method: "phone" \| "email"` | Contains no PII — `method` is one of two fixed literal values; the phone number/email address itself is never included in the event. | `src/app/contact-us/page.tsx` (via `TrackedLink`) |
| `chat_opened` | The chat widget transitions from closed to open (launcher button or header toggle). | `Record<string, never>` (always `{}`) | Contains no PII — no params at all. | `src/components/ChatWidget.tsx:135` |
| `chat_first_question` | The visitor sends their first message in the chat widget, once per mount. | `Record<string, never>` (always `{}`) | Contains no PII by design — the message text itself is deliberately never included; this event only records that a first question was asked, never what it said. | `src/components/ChatWidget.tsx:224` |
| `form_start` | The visitor focuses any field of the lead-intake form for the first time in a given mount. | `form_name: string` (currently always `"lead_intake"`) | Contains no PII — `form_name` is a fixed form identifier, not any of the form's own field values. | `src/components/ChatWidget.tsx:215` |
| `form_submit` | A genuine lead-form submission attempt is made (fires on every attempt, including retries after a failed one — not gated to "once"). | `form_name: string` (currently always `"lead_intake"`) | Contains no PII — same shape as `form_start`; none of the form's 7 free-text field values (name, company, email, phone, revenue, occupation, business) are ever referenced. | `src/components/ChatWidget.tsx:171` |
| `lead_submitted` | The lead-intake form submission succeeds (`res.ok`, after the fetch resolves without throwing). | `utm_source?: string`, `utm_medium?: string`, `utm_campaign?: string`, `landing_page?: string` (all optional) | Contains no PII — params are sourced exclusively from `getStoredAttribution()` in `src/lib/attribution.ts`, never from the submitted `Lead` object. `utm_*` values are marketing-team-controlled campaign tags (set in ad/email links), and `landing_page` is an internal site path — neither is user-entered free text. | `src/components/ChatWidget.tsx:186` |
| `lead_qualified` | **Not yet wired** — reserved for a future lead-qualification/scoring feature (e.g. an automated or CRM-driven qualification step, separate from the chat widget's own immediate `qualified` flag). | `qualification_result: "qualified" \| "not_qualified" \| "needs_review"` | Will contain no PII — a fixed 3-value enum, never any lead-identifying data. | Not wired |
| `booking_started` | **Not yet wired** — reserved for a future booking/scheduling feature (e.g. a consultation-booking calendar). | `booking_type: string` | Will contain no PII — intended for a developer-controlled category string (e.g. `"consultation"`), not any visitor-entered value. | Not wired |
| `booking_completed` | **Not yet wired** — reserved for the same future booking feature, fired on completion. | `booking_type: string` | Same as `booking_started`. | Not wired |
| `guide_downloaded` | **Not yet wired** — reserved for a future downloadable-guide/lead-magnet feature. | `guide_slug: string` | Will contain no PII — a static content-identifier slug (e.g. `"banking-setup-guide"`), not visitor input. | Not wired |
| `calculator_completed` | **Not yet wired** — reserved for a future interactive calculator feature (e.g. a fee or savings calculator). | `calculator_slug: string` | Will contain no PII — a static content-identifier slug (e.g. `"vat-calculator"`), not the calculator's own input/output values. | Not wired |

The 5 "not yet wired" events are typed ahead of any real feature (booking
system, lead magnets, calculators) specifically so that future work can
`import` and call them without re-deriving the param shape — the same
pattern already used by `articleSchema()` in `src/lib/schema.ts` for future
resource pages.

## Attribution model

`src/lib/attribution.ts` implements **first-touch** marketing attribution,
client-side only (this is a static-export site with no server to persist
this on):

- **Capture**: `captureAttribution()` reads `location.search` for the 5
  standard UTM params (`utm_source`, `utm_medium`, `utm_campaign`,
  `utm_term`, `utm_content`), `location.pathname` as `landing_page`, and
  `document.referrer` (only kept if it's a genuinely different origin than
  the current page — same-origin navigation is not "referral traffic").
  Called once per page load via `<AttributionCapture />` (mounted early in
  `src/app/layout.tsx`, before `<GoogleAnalytics />`), so attribution is
  captured before any GA event could plausibly fire or a visitor could
  convert.
- **Storage**: the whole `Attribution` object is written as one JSON blob to
  `localStorage` under the key `as_attribution_v1` (matching the
  `as_<domain>_v<n>` versioned-key convention already used elsewhere on this
  site, e.g. `ChatWidget.tsx`'s `as_chat_lead_v1`).
- **First touch wins**: if a stored value already exists and isn't stale
  (see below), `captureAttribution()` returns immediately without
  overwriting it — the current page's UTM params/referrer/landing page are
  discarded, even if they differ from (or omit) what's already stored. This
  ensures the *original* campaign that brought a visitor in survives their
  later, possibly-untagged page views (including after client-side
  navigation scrubs the query string off the address bar).
- **90-day staleness window**: `ATTRIBUTION_MAX_AGE_MS = 90 days`. Once a
  stored value's `captured_at` timestamp is older than 90 days, the next
  `captureAttribution()` call treats it as stale and overwrites it with a
  fresh capture from the current page. This is a business-logic assumption
  (a reasonably generous B2B sales-cycle window for company formation /
  banking / advisory services) rather than a technical constraint — it may
  need tuning if real conversion-lag data shows leads regularly convert
  later than this and lose their original attribution as a result.
- **Attaching to `lead_submitted`**: when the lead-intake form submission
  succeeds, `ChatWidget.tsx` calls `getStoredAttribution()` and copies only
  the 4 allowlisted fields (`utm_source`, `utm_medium`, `utm_campaign`,
  `landing_page`) — individually, field-by-field, never via object
  spread — into `lead_submitted`'s params. `Attribution`'s other fields
  (`utm_term`, `utm_content`, `referrer`, `captured_at`) are valid
  `Attribution` fields but are **not** on `lead_submitted`'s allowlist, so
  even if they were accidentally included in the source object, the
  sanitizer would strip them before anything reaches GA4.

## How to add a new event

1. Add a new member to the `AnalyticsEvent` discriminated union in
   `src/lib/analytics.ts`, with a `name` and a `params` type listing every
   field the event needs (mark optional fields with `?`; use `Record<string,
   never>` for a no-params event).
2. Add a matching entry to `EVENT_PARAM_ALLOWLIST` in the same file, listing
   exactly the param keys from step 1 — this is the runtime enforcement
   point, independent of the TypeScript type.
3. Call `trackEvent({ name: "...", params: { ... } })` at the point in the
   UI where the event should fire. `trackEvent()` never throws, so no error
   handling is needed around the call.
4. Update this document: add a row to the [Every event](#every-event) table
   (name, when it fires, params, a PII statement, and the file:line it's
   wired at).
5. Add the new event to `scripts/verify-analytics.mjs`'s taxonomy coverage
   list (`TAXONOMY_SAMPLES`) with a valid sample `params` object, so
   `npm run verify:analytics` continues to exercise every event's shape and
   would catch a future accidental type/allowlist drift.
