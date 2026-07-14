import { SITE_URL } from "@/lib/site-config";

export const dynamic = "force-static";

/**
 * Generates `/llms.txt` at build time from the active `SITE_URL`, so this
 * AI-crawler-facing summary can never drift from the domain the rest of the
 * site (canonical tags, sitemap, robots.txt) is built against. Content is
 * otherwise identical to the original static `public/llms.txt` file this
 * route replaces.
 */
function buildLlmsTxt(): string {
  return `# Alliance Street Consultancy

> Dubai-based business consultancy specializing in UAE company formation, tax structuring, banking, and relocation for entrepreneurs, property investors, and businesses moving to the UAE.

Founded by Stallone Shaikh, Alliance Street Consultancy has helped 200+ businesses relocate to and structure in the UAE. Services span company formation (free zone, mainland, and multi-jurisdictional structures), business & private banking introductions, bookkeeping/accounting/VAT compliance, financial & corporate advisory, and Dubai commercial real estate. Offices in the UAE (Dubai, Ras Al Khaimah) and Europe (UK, Germany, Austria, Slovakia).

## Key pages

- [Homepage](${SITE_URL}/): Overview of all services.
- [About Us](${SITE_URL}/about-us/): Company history (founded 2017), stats, values, founder background.
- [Dubai Business Setup](${SITE_URL}/dubai-business-setup/): Company formation and structuring (free zone, mainland, multi-jurisdictional).
- [Banking Solutions](${SITE_URL}/banking/): UAE business & private bank account opening.
- [Accounting Service](${SITE_URL}/bookkeeping-accounting/): Bookkeeping, accounting, and VAT compliance.
- [Financial Solutions](${SITE_URL}/financial-services/): UAE corporate tax, compliance, and financial advisory.
- [Real Estate](${SITE_URL}/real-estate/): Dubai commercial real estate and investment.
- [FAQ](${SITE_URL}/faq/): 43 answers on UAE company formation, tax, Small Business Relief, banking, and tax residency.
- [Case Studies](${SITE_URL}/case-studies/): 20 anonymized real client situations, including cases advised against.
- [Contact](${SITE_URL}/contact-us/): Office locations, contact details, and founder background.
- [Careers](${SITE_URL}/careers/): No public jobs board; how to get in touch about future roles.

## Optional

- [Khaleej Times feature](https://www.khaleejtimes.com/kt-network/meet-alliance-street-consultancy-the-one-stop-shop-business-consultancy-in-uae)
- [Gulf News feature](https://gulfnews.com/business/corporate-news/alliance-street-consultancy-announces-strategic-partnership-with-vasil-legal-1.1726217791344)
- [Asia Business Outlook feature](https://www.asiabusinessoutlook.com/services-and-consulting/cover-story/alliance-street-consultancy-steering-businesses-to-growth-with-bespoke-consulting-solutions-cid-1423.html)
`;
}

export function GET(): Response {
  return new Response(buildLlmsTxt(), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
