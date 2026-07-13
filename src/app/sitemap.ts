import type { MetadataRoute } from "next";

const SITE_URL = "https://alliancestreetgoa-lang.github.io/as.ae";

const ROUTES: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "dubai-business-setup", priority: 0.9 },
  { path: "faq", priority: 0.9 },
  { path: "banking", priority: 0.8 },
  { path: "bookkeeping-accounting", priority: 0.8 },
  { path: "financial-services", priority: 0.8 },
  { path: "real-estate", priority: 0.8 },
  { path: "contact-us", priority: 0.7 },
];

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map(({ path, priority }) => ({
    url: `${SITE_URL}/${path}${path ? "/" : ""}`,
    lastModified,
    changeFrequency: "monthly",
    priority,
  }));
}
