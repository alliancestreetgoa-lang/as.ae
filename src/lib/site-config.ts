/**
 * Single source of truth for site-wide deployment configuration: which base
 * URL the site is served from, and whether the current build is the
 * "staging" or "production" deployment.
 *
 * Both values are read from build-time environment variables and validated
 * eagerly at module-evaluation time (which, in Next.js, happens at build
 * time). Neither value falls back to a default and neither is derived from
 * the other (or from `NODE_ENV`) — see the individual comments below for
 * why. If either variable is missing or malformed, this module throws
 * immediately so a misconfigured build fails loudly at build time instead of
 * silently shipping the wrong domain, robots directives, or canonical URLs.
 */

/**
 * The two deployment targets this site can be built for. Intentionally a
 * closed union (not `string`) so every consumer gets exhaustiveness checking
 * instead of having to guard against arbitrary strings at every call site.
 */
export type SiteEnvironment = "staging" | "production";

/**
 * Reference-only lookup of the known domains for each deployment target.
 *
 * This exists so tooling (build-assertion scripts, docs, tests) can refer to
 * "the staging domain" or "the production domain" by name instead of a
 * magic string scattered across the codebase. It is deliberately NOT used
 * anywhere in this module to derive the active `SITE_URL` or
 * `SITE_ENVIRONMENT` — those always come from the validated environment
 * variables below. Wiring this table into the active config would silently
 * reintroduce the exact inference bug (guessing the environment from the
 * URL, or vice versa) this module is meant to eliminate.
 */
export const KNOWN_DOMAINS = {
  staging: "https://shaukinsv.com",
  production: "https://alliancestreet.ae",
} as const;

/** Removes a single trailing slash, if present, so callers can safely do `${SITE_URL}/${path}` without doubled slashes. */
function stripTrailingSlash(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

/**
 * Validates and normalizes the raw `NEXT_PUBLIC_SITE_URL` environment
 * variable. Throws a descriptive `Error` (rather than falling back to a
 * default) if it is missing, empty, or not a valid absolute URL, because a
 * silent fallback here would mean the build could ship with the wrong
 * canonical domain (e.g. staging content pointing at the production domain,
 * or vice versa) without anyone noticing until it's live.
 */
function readSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;

  if (!raw || raw.trim() === "") {
    throw new Error(
      "Missing required environment variable NEXT_PUBLIC_SITE_URL. " +
        "Set it to the active site's absolute base URL, e.g. " +
        `"${KNOWN_DOMAINS.staging}" (staging) or "${KNOWN_DOMAINS.production}" (production). ` +
        "See .env.example for details. This variable is required and has no default " +
        "— it must be set explicitly for every build."
    );
  }

  try {
    // The URL constructor throws on anything that isn't a valid absolute URL.
    new URL(raw);
  } catch {
    throw new Error(
      `Invalid NEXT_PUBLIC_SITE_URL: "${raw}" is not a valid absolute URL. ` +
        `Expected something like "${KNOWN_DOMAINS.staging}" or "${KNOWN_DOMAINS.production}" ` +
        "(must include the protocol, e.g. https://)."
    );
  }

  return stripTrailingSlash(raw);
}

/**
 * Validates the raw `NEXT_PUBLIC_SITE_ENVIRONMENT` environment variable.
 * Throws a descriptive `Error` if it isn't exactly `"staging"` or
 * `"production"`.
 *
 * This is intentionally a separate, independently-configured variable from
 * `NEXT_PUBLIC_SITE_URL` — it is never inferred from the URL's hostname (or
 * from `NODE_ENV`, which distinguishes dev-vs-prod *builds*, not
 * staging-vs-production *deployments*; both staging and production are
 * "production" NODE_ENV builds). Inferring one from the other would silently
 * break the moment the staging or production domain changes, or if a build
 * is ever run against a domain not in `KNOWN_DOMAINS` (e.g. a preview URL).
 * Requiring both to be set explicitly makes every deployment's configuration
 * self-evident and independently verifiable.
 */
function readSiteEnvironment(): SiteEnvironment {
  const raw = process.env.NEXT_PUBLIC_SITE_ENVIRONMENT;

  if (raw === "staging" || raw === "production") {
    return raw;
  }

  throw new Error(
    `Invalid or missing NEXT_PUBLIC_SITE_ENVIRONMENT: ${
      raw === undefined ? "(not set)" : `"${raw}"`
    }. Must be set to exactly "staging" or "production" — it is not inferred from ` +
      "NEXT_PUBLIC_SITE_URL or NODE_ENV. See .env.example for details."
  );
}

/**
 * The active site's canonical base URL (no trailing slash), sourced from
 * `NEXT_PUBLIC_SITE_URL`. This is the one place that should be treated as
 * "the domain" throughout the app — canonical tags, sitemap/robots entries,
 * structured data `@id`/`url` fields, and `metadataBase` should all derive
 * from this rather than hardcoding a domain literal.
 */
export const SITE_URL: string = readSiteUrl();

/**
 * Which deployment target this build is for, sourced from
 * `NEXT_PUBLIC_SITE_ENVIRONMENT`. Drives indexability (`shouldIndex`) and is
 * available for any other staging/production branching this app needs.
 */
export const SITE_ENVIRONMENT: SiteEnvironment = readSiteEnvironment();

/** True when this build is the production deployment. */
export const IS_PRODUCTION: boolean = SITE_ENVIRONMENT === "production";

/** True when this build is the staging deployment. */
export const IS_STAGING: boolean = SITE_ENVIRONMENT === "staging";

/**
 * Builds an absolute, trailing-slash-normalized URL for a route segment,
 * relative to `SITE_URL`. Leading/trailing slashes on `path` are stripped
 * before joining, so callers can pass `"banking"`, `"/banking"`,
 * `"banking/"`, or `"/banking/"` interchangeably.
 *
 * @example
 * pageUrl("")          // => "https://shaukinsv.com/"
 * pageUrl("banking")   // => "https://shaukinsv.com/banking/"
 * pageUrl("/banking/") // => "https://shaukinsv.com/banking/"
 */
export function pageUrl(path: string): string {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return clean ? `${SITE_URL}/${clean}/` : `${SITE_URL}/`;
}

/**
 * Whether the current build should be indexable by search engines and other
 * crawlers. Only the production deployment is indexable — staging must never
 * be indexed, since it's a temporary domain that will eventually be
 * replaced.
 *
 * Kept as a single named function (rather than inlining `IS_PRODUCTION`
 * everywhere) so every call site — robots meta tags, `robots.ts`, and
 * anywhere else that needs this decision — reads the same intent and stays
 * in sync if the rule ever needs to change.
 */
export function shouldIndex(): boolean {
  return IS_PRODUCTION;
}
