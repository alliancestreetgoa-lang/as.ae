import type { MetadataRoute } from "next";
import { IS_STAGING, SITE_URL } from "@/lib/site-config";

// Explicit allow for the crawlers that power AI-generated answers, in
// addition to the default allow-all below — see chatbot/README.md and the
// ai-seo audit for context. None of these are blocked today; this just makes
// the intent explicit and future-proofs against an accidental Disallow.
const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "PerplexityBot",
  "ClaudeBot",
  "anthropic-ai",
  "Google-Extended",
  "Bingbot",
];

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  // Staging is a temporary domain that must never be indexed or crawled —
  // disallow everything rather than allowing the general + AI-bot crawl that
  // production gets.
  if (IS_STAGING) {
    return {
      rules: [{ userAgent: "*", disallow: "/" }],
      sitemap: `${SITE_URL}/sitemap.xml`,
    };
  }

  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
