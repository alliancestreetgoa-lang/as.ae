#!/usr/bin/env node

/**
 * Permanent, CI-enforced test of `sanitizeEventPayload()` (and a taxonomy
 * consistency sweep) from `src/lib/analytics.ts`.
 *
 * Tasks A-D built the full GA4 analytics layer and verified
 * `sanitizeEventPayload()`'s correctness by hand, via throwaway scratch
 * scripts (copied outside the repo, run once, deleted). This script turns
 * that ad-hoc verification into a real, permanent assertion suite that lives
 * in the repo and runs in CI on every push/PR.
 *
 * Unlike `verify-build.mjs`/`verify-seo.mjs`, this script does NOT read an
 * already-built `out/` directory — it needs no build step at all. It tests
 * `sanitizeEventPayload()` and `trackEvent()` directly from source, using
 * Node's native TypeScript support (type-stripping): `analytics.ts` is a
 * plain `.ts` file with interfaces/discriminated unions/functions only (no
 * enums, no namespaces, no experimental decorators), so Node can import it
 * unmodified.
 *
 * One wrinkle: `analytics.ts` imports its sibling module as
 * `from "./analytics-config"` (no file extension) — normal TypeScript/
 * bundler convention, but plain Node ESM resolution requires an explicit
 * extension on every relative specifier (this is a general Node ESM rule,
 * not specific to TypeScript — type-stripping does not change it). Rather
 * than modify `analytics.ts` (out of scope for this task) or add a build
 * step, this script registers a tiny, local-only module resolution hook
 * (via Node's built-in `module.register()`, no external loader package) that
 * retries a failed relative resolution with a `.ts` extension appended. It
 * changes nothing about module resolution outside of this process — it only
 * ever activates as a fallback after Node's normal resolution has already
 * failed.
 *
 * Because that resolution hook runs off-thread (Node's module customization
 * hooks execute in a dedicated worker thread), Node also emits one harmless
 * `MODULE_TYPELESS_PACKAGE_JSON` runtime warning to stderr the first time it
 * has to sniff `analytics.ts`'s module system (this repo's `package.json`
 * has no top-level `"type"` field) — it does not affect this script's exit
 * code or stdout, and is suppressed entirely when run via `npm run
 * verify:analytics` (which passes `--no-warnings`).
 *
 * Usage:
 *   node scripts/verify-analytics.mjs
 *   npm run verify:analytics
 *
 * Collects every failing assertion before exiting, rather than stopping at
 * the first one, so a single run tells you everything that's wrong. Prints
 * a running "N/N assertions passed" count so the script's own output makes
 * the actual coverage visible.
 */

import { register } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ANALYTICS_MODULE_PATH = join(ROOT, "src", "lib", "analytics.ts");

// --- extension-fallback resolution hook (see doc comment above) ----------

const resolutionFallbackHooks = `
export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (err) {
    const isRelative = specifier.startsWith("./") || specifier.startsWith("../");
    const alreadyHasExtension = /\\.[a-zA-Z0-9]+$/.test(specifier);
    if (isRelative && !alreadyHasExtension && err && err.code === "ERR_MODULE_NOT_FOUND") {
      return nextResolve(specifier + ".ts", context);
    }
    throw err;
  }
}
`;

register(
  "data:text/javascript," + encodeURIComponent(resolutionFallbackHooks),
  pathToFileURL(ROOT + "/")
);

const { sanitizeEventPayload, trackEvent } = await import(pathToFileURL(ANALYTICS_MODULE_PATH));

// --- tiny assertion helper (collects all failures, matching verify-build's pattern) ---

let passCount = 0;
let failCount = 0;
const failures = [];

function assert(condition, message) {
  if (condition) {
    passCount++;
  } else {
    failCount++;
    failures.push(message);
  }
}

/** Order-independent deep equality for the flat `Record<string, primitive>` shape `sanitizeEventPayload()` returns. */
function sortedJson(obj) {
  return JSON.stringify(
    Object.fromEntries(Object.entries(obj).sort(([a], [b]) => a.localeCompare(b)))
  );
}

function assertParamsEqual(tag, actual, expected, context) {
  const ok = sortedJson(actual) === sortedJson(expected);
  assert(
    ok,
    `[${tag}] ${context}\n    expected: ${JSON.stringify(expected)}\n    actual:   ${JSON.stringify(actual)}`
  );
}

// ---------------------------------------------------------------------------
// 1. Clean, fully-valid events (>= 3 different event names) pass through unchanged.
// ---------------------------------------------------------------------------

assertParamsEqual(
  "clean-event",
  sanitizeEventPayload({
    name: "nav_cta_click",
    params: { cta_label: "Get in Touch", location: "navbar_desktop" },
  }),
  { cta_label: "Get in Touch", location: "navbar_desktop" },
  "nav_cta_click: fully-valid params pass through unchanged"
);

assertParamsEqual(
  "clean-event",
  sanitizeEventPayload({ name: "contact_click", params: { method: "phone" } }),
  { method: "phone" },
  "contact_click: fully-valid params pass through unchanged"
);

assertParamsEqual(
  "clean-event",
  sanitizeEventPayload({ name: "form_start", params: { form_name: "lead_intake" } }),
  { form_name: "lead_intake" },
  "form_start: fully-valid params pass through unchanged"
);

assertParamsEqual(
  "clean-event",
  sanitizeEventPayload({ name: "guide_downloaded", params: { guide_slug: "banking-setup-guide" } }),
  { guide_slug: "banking-setup-guide" },
  "guide_downloaded: fully-valid params pass through unchanged"
);

// ---------------------------------------------------------------------------
// 2. An extra/unlisted param key is dropped; the rest of the object survives.
// ---------------------------------------------------------------------------

assertParamsEqual(
  "extra-key",
  sanitizeEventPayload({
    name: "nav_cta_click",
    params: { cta_label: "Get in Touch", location: "footer", unexpected_key: "leak" },
  }),
  { cta_label: "Get in Touch", location: "footer" },
  "nav_cta_click: unlisted param key dropped, allowlisted keys survive"
);

assertParamsEqual(
  "extra-key",
  sanitizeEventPayload({ name: "chat_opened", params: { random: "x" } }),
  {},
  "chat_opened: an unlisted key on a zero-param event drops to an empty object, no throw"
);

// ---------------------------------------------------------------------------
// 3. Each denylisted term, injected individually, is dropped: exact lower-case,
//    a capitalized variant, an all-caps variant, and a substring-match variant.
//    ("name" is excluded here — it gets its own exact-match-only section below.)
// ---------------------------------------------------------------------------

const SUBSTRING_DENYLIST_TERMS = ["email", "phone", "company", "address", "message", "password", "ssn"];

for (const term of SUBSTRING_DENYLIST_TERMS) {
  const capitalized = term[0].toUpperCase() + term.slice(1);
  const upper = term.toUpperCase();
  const prefixed = `user${capitalized}`; // e.g. "userEmail"

  assertParamsEqual(
    "denylist-exact",
    sanitizeEventPayload({
      name: "nav_cta_click",
      params: { cta_label: "a", location: "b", [term]: "leak" },
    }),
    { cta_label: "a", location: "b" },
    `nav_cta_click: denylisted key "${term}" dropped, allowlisted keys survive`
  );

  assertParamsEqual(
    "denylist-case-insensitive",
    sanitizeEventPayload({
      name: "nav_cta_click",
      params: { cta_label: "a", location: "b", [capitalized]: "leak" },
    }),
    { cta_label: "a", location: "b" },
    `nav_cta_click: denylisted key "${capitalized}" (capitalized variant) dropped`
  );

  assertParamsEqual(
    "denylist-case-insensitive",
    sanitizeEventPayload({
      name: "nav_cta_click",
      params: { cta_label: "a", location: "b", [upper]: "leak" },
    }),
    { cta_label: "a", location: "b" },
    `nav_cta_click: denylisted key "${upper}" (uppercase variant) dropped`
  );

  assertParamsEqual(
    "denylist-substring",
    sanitizeEventPayload({
      name: "nav_cta_click",
      params: { cta_label: "a", location: "b", [prefixed]: "leak" },
    }),
    { cta_label: "a", location: "b" },
    `nav_cta_click: substring-match key "${prefixed}" dropped (caught by denylist term "${term}")`
  );
}

// ---------------------------------------------------------------------------
// 4. The "name" exact-match special case (Task A's load-bearing judgment call):
//    a bare "name" key is dropped; "form_name" on form_start/form_submit survives.
// ---------------------------------------------------------------------------

assertParamsEqual(
  "name-exact-match",
  sanitizeEventPayload({ name: "nav_cta_click", params: { cta_label: "a", location: "b", name: "leak" } }),
  { cta_label: "a", location: "b" },
  'nav_cta_click: a bare "name" key is dropped (exact match)'
);

assertParamsEqual(
  "name-exact-match",
  sanitizeEventPayload({ name: "nav_cta_click", params: { cta_label: "a", location: "b", Name: "leak" } }),
  { cta_label: "a", location: "b" },
  'nav_cta_click: a "Name" key is dropped (case-insensitive exact match)'
);

assertParamsEqual(
  "name-exact-match",
  sanitizeEventPayload({ name: "nav_cta_click", params: { cta_label: "a", location: "b", NAME: "leak" } }),
  { cta_label: "a", location: "b" },
  'nav_cta_click: a "NAME" key is dropped (case-insensitive exact match)'
);

// Load-bearing regression test: if this ever breaks, it's a real, serious bug.
assertParamsEqual(
  "name-exact-match-regression",
  sanitizeEventPayload({ name: "form_start", params: { form_name: "lead_intake" } }),
  { form_name: "lead_intake" },
  'form_start: "form_name" survives sanitization (the "name" denylist term is exact-match-only, so it must not catch this)'
);

assertParamsEqual(
  "name-exact-match-regression",
  sanitizeEventPayload({ name: "form_submit", params: { form_name: "lead_intake" } }),
  { form_name: "lead_intake" },
  'form_submit: "form_name" survives sanitization (the "name" denylist term is exact-match-only, so it must not catch this)'
);

// ---------------------------------------------------------------------------
// 5. A non-primitive value (array, nested object) is dropped; remaining valid
//    keys survive.
// ---------------------------------------------------------------------------

assertParamsEqual(
  "non-primitive",
  sanitizeEventPayload({ name: "nav_cta_click", params: { cta_label: "a", location: ["x", "y"] } }),
  { cta_label: "a" },
  "nav_cta_click: an array value is dropped, the remaining valid key survives"
);

assertParamsEqual(
  "non-primitive",
  sanitizeEventPayload({ name: "nav_cta_click", params: { cta_label: { nested: true }, location: "b" } }),
  { location: "b" },
  "nav_cta_click: a nested-object value is dropped, the remaining valid key survives"
);

// ---------------------------------------------------------------------------
// 6. A string value over 100 characters is truncated to exactly 100 characters.
// ---------------------------------------------------------------------------

{
  const longString = "x".repeat(150);
  const result = sanitizeEventPayload({
    name: "nav_cta_click",
    params: { cta_label: longString, location: "b" },
  });

  assert(
    typeof result.cta_label === "string" && result.cta_label.length === 100,
    `[truncation] nav_cta_click: a 150-char cta_label is truncated to exactly 100 characters (got length ${
      typeof result.cta_label === "string" ? result.cta_label.length : typeof result.cta_label
    })`
  );
  assert(
    result.cta_label === "x".repeat(100),
    "[truncation] nav_cta_click: the truncated cta_label content matches the first 100 characters of the original string"
  );
  assert(
    result.location === "b",
    "[truncation] nav_cta_click: a shorter, untouched param survives unchanged alongside the truncated one"
  );
}

// ---------------------------------------------------------------------------
// 7. lead_submitted's attribution allowlist: all 4 allowlisted keys pass;
//    utm_term/utm_content/referrer (valid Attribution fields, NOT on
//    lead_submitted's allowlist) are all dropped.
// ---------------------------------------------------------------------------

assertParamsEqual(
  "lead-submitted-attribution",
  sanitizeEventPayload({
    name: "lead_submitted",
    params: {
      utm_source: "google",
      utm_medium: "cpc",
      utm_campaign: "spring_promo",
      landing_page: "/banking",
    },
  }),
  { utm_source: "google", utm_medium: "cpc", utm_campaign: "spring_promo", landing_page: "/banking" },
  "lead_submitted: all 4 allowlisted attribution keys pass through unchanged"
);

assertParamsEqual(
  "lead-submitted-attribution",
  sanitizeEventPayload({
    name: "lead_submitted",
    params: {
      utm_source: "google",
      utm_term: "tax advisory dubai",
      utm_content: "variant_b",
      referrer: "https://example.com",
    },
  }),
  { utm_source: "google" },
  "lead_submitted: utm_term/utm_content/referrer are valid Attribution fields but not on lead_submitted's allowlist, so all 3 are dropped"
);

// ---------------------------------------------------------------------------
// 8. trackEvent() called with no `window` (this script runs in plain Node,
//    so `window` is naturally absent) does not throw — the real server-side
//    no-op path, not a mock.
// ---------------------------------------------------------------------------

assert(
  typeof window === "undefined",
  "[no-window-noop] sanity check: this script genuinely runs with no `window` global, so the next check exercises the real server-side no-op path"
);

{
  let threw = false;
  try {
    trackEvent({ name: "chat_opened", params: {} });
  } catch {
    threw = true;
  }
  assert(!threw, "[no-window-noop] trackEvent() called with no `window` in scope does not throw");
}

// ---------------------------------------------------------------------------
// 9. Every one of the 13 taxonomy event names, called through
//    sanitizeEventPayload() with a valid params object, confirms the full
//    taxonomy's shapes are still internally consistent (catches future
//    type/allowlist drift on any event, wired or not).
// ---------------------------------------------------------------------------

const TAXONOMY_SAMPLES = [
  ["nav_cta_click", { cta_label: "Get in Touch", location: "navbar_desktop" }],
  ["consultation_cta_click", { cta_label: "Let's talk", location: "hero" }],
  ["contact_click", { method: "phone" }],
  ["chat_opened", {}],
  ["chat_first_question", {}],
  ["form_start", { form_name: "lead_intake" }],
  ["form_submit", { form_name: "lead_intake" }],
  [
    "lead_submitted",
    { utm_source: "google", utm_medium: "cpc", utm_campaign: "spring_promo", landing_page: "/banking" },
  ],
  ["lead_qualified", { qualification_result: "qualified" }],
  ["booking_started", { booking_type: "consultation" }],
  ["booking_completed", { booking_type: "consultation" }],
  ["guide_downloaded", { guide_slug: "banking-setup-guide" }],
  ["calculator_completed", { calculator_slug: "vat-calculator" }],
];

assert(
  TAXONOMY_SAMPLES.length === 13,
  `[taxonomy-consistency] this script exercises exactly 13 events, matching the taxonomy's documented size (found ${TAXONOMY_SAMPLES.length})`
);

for (const [name, params] of TAXONOMY_SAMPLES) {
  let result;
  let threw = false;
  try {
    result = sanitizeEventPayload({ name, params });
  } catch {
    threw = true;
  }
  assert(!threw, `[taxonomy-consistency] sanitizeEventPayload() did not throw for event "${name}"`);
  assertParamsEqual(
    "taxonomy-consistency",
    result ?? {},
    params,
    `${name}: a valid params object for this event's documented shape passes through sanitization unchanged`
  );
}

// --- report ------------------------------------------------------------------

const total = passCount + failCount;

if (failures.length > 0) {
  console.error(`\n✗ verify-analytics: ${failCount}/${total} assertion(s) failed:\n`);
  failures.forEach((failure, i) => console.error(`${i + 1}. ${failure}\n`));
  process.exit(1);
}

console.log(`✓ verify-analytics: ${passCount}/${total} assertions passed.`);
