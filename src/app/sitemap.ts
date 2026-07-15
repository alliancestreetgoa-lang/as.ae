import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-config";

/**
 * `lastModified` is a real per-route field, not a shared build-time
 * timestamp — each route owns its own date so a future content edit to one
 * page can update just that page's entry instead of every route silently
 * claiming to have changed on every build. All dates are currently set to
 * the date this field was introduced (no historical per-page change data
 * exists yet); update a route's date individually when its content changes.
 */
const ROUTES: { path: string; priority: number; lastModified: string }[] = [
  { path: "", priority: 1, lastModified: "2026-07-14" },
  { path: "about-us", priority: 0.9, lastModified: "2026-07-14" },
  { path: "dubai-business-setup", priority: 0.9, lastModified: "2026-07-14" },
  { path: "faq", priority: 0.9, lastModified: "2026-07-14" },
  { path: "case-studies", priority: 0.9, lastModified: "2026-07-14" },
  { path: "banking", priority: 0.8, lastModified: "2026-07-14" },
  { path: "bookkeeping-accounting", priority: 0.8, lastModified: "2026-07-14" },
  { path: "financial-services", priority: 0.8, lastModified: "2026-07-14" },
  { path: "real-estate", priority: 0.8, lastModified: "2026-07-14" },
  { path: "contact-us", priority: 0.7, lastModified: "2026-07-14" },
  { path: "careers", priority: 0.6, lastModified: "2026-07-14" },
];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.map(({ path, priority, lastModified }) => ({
    url: `${SITE_URL}/${path}${path ? "/" : ""}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
