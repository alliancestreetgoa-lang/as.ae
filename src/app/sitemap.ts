import type { MetadataRoute } from "next";

const SITE_URL = "https://shaukinsv.com";

const ROUTES: { path: string; priority: number }[] = [
  { path: "", priority: 1 },
  { path: "about-us", priority: 0.9 },
  { path: "dubai-business-setup", priority: 0.9 },
  { path: "faq", priority: 0.9 },
  { path: "case-studies", priority: 0.9 },
  { path: "banking", priority: 0.8 },
  { path: "bookkeeping-accounting", priority: 0.8 },
  { path: "financial-services", priority: 0.8 },
  { path: "real-estate", priority: 0.8 },
  { path: "contact-us", priority: 0.7 },
  { path: "careers", priority: 0.6 },
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
