/**
 * Configuration for the GA4 analytics layer. Follows the optional,
 * runtime-fallback pattern established in `chat-config.ts` (not
 * `site-config.ts`'s mandatory-throw pattern) — analytics must be fully
 * functional, as a safe no-op, with no measurement ID configured at all.
 */

/**
 * The GA4 measurement ID, read from `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
 *
 * Validation choice: if the env var is set but doesn't loosely look like a
 * real GA4 measurement ID (starting with `"G-"`), it is treated as unset
 * (`undefined`) rather than throwing at build time or passing a malformed ID
 * through to the script loader. A typo'd env var should quietly disable
 * analytics, not break the build or send garbage config to
 * `googletagmanager.com` — this module's whole job is "safe no-op when
 * misconfigured," so failing loudly here would work against that goal.
 */
export const GA_MEASUREMENT_ID: string | undefined = (() => {
  const raw = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  return raw && raw.startsWith("G-") ? raw : undefined;
})();

/**
 * Single choke-point for whether analytics is allowed to load/fire.
 *
 * PLACEHOLDER DEFAULT: this site has no consent-management UI yet, so this
 * currently returns `true` unconditionally — analytics loads whenever a
 * valid `GA_MEASUREMENT_ID` is present, since there is no consent banner to
 * gate on. When a real consent banner is built, update the implementation of
 * *this function* (e.g. to read a stored consent choice from
 * localStorage/cookie) rather than rewriting every `trackEvent()` /
 * `<GoogleAnalytics />` call site — that's the entire point of routing every
 * consent check through one named function now.
 */
export function hasAnalyticsConsent(): boolean {
  return true;
}
