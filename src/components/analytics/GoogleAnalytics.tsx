"use client";

import Script from "next/script";
import { GA_MEASUREMENT_ID, hasAnalyticsConsent } from "@/lib/analytics-config";

/**
 * Conditionally loads the GA4 gtag.js script. Renders nothing when
 * `GA_MEASUREMENT_ID` isn't configured or consent hasn't been granted (see
 * `analytics-config.ts` for both) — with no measurement ID set, this
 * component is a true no-op: no script tag, no network request, no global
 * `gtag`/`dataLayer` set up. `trackEvent()` in `src/lib/analytics.ts`
 * independently no-ops in that case too, so the two stay safe on their own.
 *
 * Uses `strategy="afterInteractive"` (next/script's default for tag
 * managers/analytics per the Next docs): loads after hydration begins so it
 * never blocks anything render-critical, while still loading early enough
 * to catch events fired soon after page load.
 */
export function GoogleAnalytics() {
  if (!GA_MEASUREMENT_ID || !hasAnalyticsConsent()) {
    return null;
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}');
          window.gtag = gtag;
        `}
      </Script>
    </>
  );
}
