/**
 * First-touch marketing attribution: captures UTM params + landing page once
 * per visitor and remembers them in `localStorage` so later conversions
 * (`lead_submitted`) can still be attributed to the campaign that brought the
 * visitor in, even after client-side navigation has scrubbed the query
 * string off the address bar. Client-side only — this is a static export
 * site with no server to persist this on.
 *
 * "First touch wins": once a value is stored, it is not overwritten by a
 * later page load's (possibly different, possibly absent) UTM params, unless
 * the stored value has gone stale (see `ATTRIBUTION_MAX_AGE_MS`). This
 * mirrors the versioned localStorage key convention already used by
 * `ChatWidget.tsx`'s `LEAD_STORAGE_KEY = "as_chat_lead_v1"`.
 */

const ATTRIBUTION_STORAGE_KEY = "as_attribution_v1";

/**
 * 90 days — a reasonably generous B2B sales-cycle window for this business
 * (company formation / banking / advisory), not a technical constraint. May
 * need tuning if real conversion-lag data shows leads regularly convert
 * later than this and lose their original attribution as a result.
 */
const ATTRIBUTION_MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;

export interface Attribution {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  /** Pathname of the page where this attribution was first captured. */
  landing_page: string;
  /** `document.referrer`, omitted when empty or same-origin. */
  referrer?: string;
  /** ISO timestamp of capture. */
  captured_at: string;
}

function isStale(capturedAt: string): boolean {
  const capturedTime = Date.parse(capturedAt);
  if (Number.isNaN(capturedTime)) return true;
  return Date.now() - capturedTime > ATTRIBUTION_MAX_AGE_MS;
}

function readStoredAttribution(): Attribution | undefined {
  try {
    const raw = localStorage.getItem(ATTRIBUTION_STORAGE_KEY);
    if (!raw) return undefined;
    const parsed = JSON.parse(raw) as Attribution;
    if (!parsed || typeof parsed !== "object") return undefined;
    if (typeof parsed.landing_page !== "string") return undefined;
    if (typeof parsed.captured_at !== "string") return undefined;
    return parsed;
  } catch {
    return undefined;
  }
}

function captureFromCurrentPage(): Attribution {
  const params = new URLSearchParams(location.search);
  const attribution: Attribution = {
    landing_page: location.pathname,
    captured_at: new Date().toISOString(),
  };

  const utmSource = params.get("utm_source");
  if (utmSource) attribution.utm_source = utmSource;

  const utmMedium = params.get("utm_medium");
  if (utmMedium) attribution.utm_medium = utmMedium;

  const utmCampaign = params.get("utm_campaign");
  if (utmCampaign) attribution.utm_campaign = utmCampaign;

  const utmTerm = params.get("utm_term");
  if (utmTerm) attribution.utm_term = utmTerm;

  const utmContent = params.get("utm_content");
  if (utmContent) attribution.utm_content = utmContent;

  if (document.referrer) {
    try {
      const referrerOrigin = new URL(document.referrer).origin;
      if (referrerOrigin !== location.origin) {
        attribution.referrer = document.referrer;
      }
    } catch {
      // Malformed referrer URL — omit rather than guess.
    }
  }

  return attribution;
}

/**
 * Captures first-touch attribution, respecting "first touch wins" and the
 * staleness window. Idempotent and safe to call on every page load. Never
 * throws — a `localStorage` failure (private browsing, disabled storage,
 * quota exceeded) is a silent no-op.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;

  try {
    const existing = readStoredAttribution();
    if (existing && !isStale(existing.captured_at)) return;

    const attribution = captureFromCurrentPage();
    localStorage.setItem(ATTRIBUTION_STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // ignore blocked/unavailable storage
  }
}

/**
 * Reads the currently stored attribution, if any. Returns `undefined` when
 * nothing is stored, storage is unavailable, or the stored value fails to
 * parse. Never throws.
 */
export function getStoredAttribution(): Attribution | undefined {
  if (typeof window === "undefined") return undefined;

  try {
    return readStoredAttribution();
  } catch {
    return undefined;
  }
}
