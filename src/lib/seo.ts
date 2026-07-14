import type { Metadata } from "next";
import { pageUrl, shouldIndex } from "@/lib/site-config";

/** Default social-share image; resolved to an absolute URL via metadataBase. */
const DEFAULT_OG_IMAGE = "/images/businessman-hero.jpg";

/**
 * Per-page metadata: canonical + OpenGraph + Twitter, built from the page's own
 * title/description so social shares and canonical tags are page-specific rather
 * than inheriting the homepage defaults from the root layout. `path` is the
 * route segment, e.g. "banking" (use "" for the homepage).
 */
export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  const url = pageUrl(opts.path);
  const images = [opts.image ?? DEFAULT_OG_IMAGE];
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    robots: shouldIndex()
      ? { index: true, follow: true }
      : { index: false, follow: false },
    openGraph: {
      type: "website",
      url,
      siteName: "Alliance Street",
      title: opts.title,
      description: opts.description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
      images,
    },
  };
}
