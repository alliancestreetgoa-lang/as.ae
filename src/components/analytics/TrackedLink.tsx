"use client";

import type { ReactNode } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

/**
 * A plain `<a>` that fires a `trackEvent()` call on click — for inline text
 * links (tel:/mailto:) that shouldn't be forced into `Button`'s pill
 * styling. Lets Server Component pages (like `contact-us/page.tsx`, which
 * exports `metadata` and so cannot itself be `"use client"`) attach an
 * analytics event to a link without becoming a Client Component
 * themselves — same serializable-`track`-prop pattern as `Button.tsx`.
 */
export function TrackedLink({
  href,
  className,
  children,
  track,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  track: AnalyticsEvent;
}) {
  return (
    <a href={href} className={className} onClick={() => trackEvent(track)}>
      {children}
    </a>
  );
}
