/**
 * Typed analytics event taxonomy, a runtime parameter sanitizer, and the
 * `trackEvent()` entry point every UI call site should use to fire GA4
 * events. Defers to `analytics-config.ts` for the measurement ID and the
 * (currently placeholder) consent gate.
 *
 * This module builds the substrate only — no UI is wired to call
 * `trackEvent()` yet (that's a later task in this effort). Events
 * `lead_qualified` through `calculator_completed` below are typed ahead of
 * any real feature (booking system, lead magnets, calculators) so that
 * future work can import and call them without re-deriving the param shape,
 * matching the pattern already used by `articleSchema()` in
 * `src/lib/schema.ts` for future resource pages.
 */

import { GA_MEASUREMENT_ID, hasAnalyticsConsent } from "./analytics-config";

/** Minimal typing for the GA4 gtag.js global — no `any`. */
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

// ---------------------------------------------------------------------------
// Event taxonomy
// ---------------------------------------------------------------------------

/**
 * Every analytics event this site can fire, as a discriminated union keyed
 * on `name`. Exactly the 13 events specified for this task — no more, no
 * fewer.
 */
export type AnalyticsEvent =
  | { name: "nav_cta_click"; params: { cta_label: string; location: string } }
  | {
      name: "consultation_cta_click";
      params: { cta_label: string; location: string };
    }
  | { name: "contact_click"; params: { method: "phone" | "email" } }
  | { name: "chat_opened"; params: Record<string, never> }
  // Never the question text itself — this event only records that a first
  // question was asked, not what it was.
  | { name: "chat_first_question"; params: Record<string, never> }
  | { name: "form_start"; params: { form_name: string } }
  | { name: "form_submit"; params: { form_name: string } }
  // Deliberately empty: every field on the site's one lead form
  // (ChatWidget's LEAD_FIELDS) is free text, so this conversion event
  // carries no field values, just the fact that a lead was submitted.
  | { name: "lead_submitted"; params: Record<string, never> }
  | {
      name: "lead_qualified";
      params: {
        qualification_result: "qualified" | "not_qualified" | "needs_review";
      };
    }
  | { name: "booking_started"; params: { booking_type: string } }
  | { name: "booking_completed"; params: { booking_type: string } }
  | { name: "guide_downloaded"; params: { guide_slug: string } }
  | { name: "calculator_completed"; params: { calculator_slug: string } };

export type AnalyticsEventName = AnalyticsEvent["name"];

// ---------------------------------------------------------------------------
// Runtime param allowlist (defense-in-depth, independent of the TS types)
// ---------------------------------------------------------------------------

/**
 * Single source of truth for which param keys are allowed to leave this
 * module for each event, derived from the taxonomy above. TypeScript's
 * structural typing means a caller could still pass extra properties on a
 * variable (excess-property checks only apply to object literals, not to a
 * value passed through a variable), so `trackEvent()` cannot rely on the
 * compile-time types alone — this runtime map is checked on every call.
 */
const EVENT_PARAM_ALLOWLIST: Record<AnalyticsEventName, readonly string[]> = {
  nav_cta_click: ["cta_label", "location"],
  consultation_cta_click: ["cta_label", "location"],
  contact_click: ["method"],
  chat_opened: [],
  chat_first_question: [],
  form_start: ["form_name"],
  form_submit: ["form_name"],
  lead_submitted: [],
  lead_qualified: ["qualification_result"],
  booking_started: ["booking_type"],
  booking_completed: ["booking_type"],
  guide_downloaded: ["guide_slug"],
  calculator_completed: ["calculator_slug"],
};

/**
 * Key names that must never appear in any event's params, checked
 * unconditionally as an independent second layer — regardless of whether a
 * key is on the event's allowlist above. Defense-in-depth against a caller
 * accidentally spreading free-text form data into an event's params (see
 * `LEAD_FIELDS` in `ChatWidget.tsx`: name, company, email, phone, revenue,
 * occupation, business — all open strings, none safe to forward).
 *
 * Matching is case-insensitive substring matching for every term *except*
 * `"name"`, which is checked as an exact key match only. Judgment call: a
 * pure substring match on `"name"` would also flag the taxonomy's own
 * legitimate `form_name` param (used by `form_start`/`form_submit`) — since
 * the taxonomy above is normative and `form_name` must survive
 * sanitization, `"name"` is scoped to exact-match to avoid that false
 * positive while still catching a raw `name`/`Name`/`NAME` key. All other
 * terms (email, phone, company, address, message, password, ssn) don't
 * collide with any allowlisted key today, so substring matching (e.g.
 * `"userEmail"` catching `"email"`) applies to them as specified.
 */
const DENYLISTED_KEYS = [
  "name",
  "email",
  "phone",
  "company",
  "address",
  "message",
  "password",
  "ssn",
] as const;

const EXACT_MATCH_ONLY_DENYLIST_KEYS: ReadonlySet<string> = new Set(["name"]);

function isDenylistedKey(key: string): boolean {
  const lowerKey = key.toLowerCase();
  return DENYLISTED_KEYS.some((term) =>
    EXACT_MATCH_ONLY_DENYLIST_KEYS.has(term)
      ? lowerKey === term
      : lowerKey.includes(term)
  );
}

function isPrimitive(value: unknown): value is string | number | boolean {
  return (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

const MAX_STRING_PARAM_LENGTH = 100;

/**
 * Cleans an event's params down to only what's safe to send to GA4. Pure
 * (no external side effects beyond an optional dev-only console warning —
 * see below) and never throws: a malformed event produces an empty or
 * partial payload, never a crash.
 *
 * Order of operations, each independent and unconditional:
 * 1. Drop any key matching the denylist (logged in development only, so a
 *    dropped signal is never silently lost with no feedback anywhere).
 * 2. Drop any key not on that event's allowlist.
 * 3. Drop any remaining value that isn't a string, number, or boolean (no
 *    nested objects/arrays/functions ever reach analytics).
 * 4. Truncate any remaining string longer than 100 characters.
 */
export function sanitizeEventPayload(
  event: AnalyticsEvent
): Record<string, string | number | boolean> {
  const allowedKeys = EVENT_PARAM_ALLOWLIST[event.name] ?? [];
  const rawParams = (event.params ?? {}) as Record<string, unknown>;
  const sanitized: Record<string, string | number | boolean> = {};

  for (const [key, value] of Object.entries(rawParams)) {
    if (isDenylistedKey(key)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          `[analytics] Dropped denylisted param key "${key}" from event "${event.name}".`
        );
      }
      continue;
    }

    if (!allowedKeys.includes(key)) continue;
    if (!isPrimitive(value)) continue;

    sanitized[key] =
      typeof value === "string" && value.length > MAX_STRING_PARAM_LENGTH
        ? value.slice(0, MAX_STRING_PARAM_LENGTH)
        : value;
  }

  return sanitized;
}

// ---------------------------------------------------------------------------
// trackEvent()
// ---------------------------------------------------------------------------

/**
 * Fires a GA4 event, if and only if analytics is fully available:
 * client-side, a valid measurement ID is configured, consent is granted,
 * and the gtag.js script has actually loaded. Every one of those is a
 * silent no-op, never a throw — this must be safe to call from anywhere,
 * including with no measurement ID configured at all.
 */
export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;
  if (!GA_MEASUREMENT_ID) return;
  if (!hasAnalyticsConsent()) return;
  if (typeof window.gtag !== "function") return;

  const sanitizedParams = sanitizeEventPayload(event);
  window.gtag("event", event.name, sanitizedParams);
}
