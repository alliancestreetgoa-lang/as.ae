import { FOUNDER, PUBLICATIONS, REGIONS } from "@/lib/content";
import { SITE_URL } from "@/lib/site-config";

export const ORG_NAME = "Alliance Street Consultancy";

const dubai = REGIONS[0].offices[0];

// Every other office, represented as a subordinate `department` so the
// primary Dubai HQ can carry the main address/telephone directly.
const otherOffices = REGIONS.flatMap((r) => r.offices).filter(
  (o) => o !== dubai
);

/**
 * Site-wide Organization + LocalBusiness schema (rendered once, in the root
 * layout). Combines both types on one node: LocalBusiness for the Dubai HQ's
 * address/phone, Organization for founder/sameAs/press coverage. Press
 * articles (from PUBLICATIONS, all real/verified) are surfaced as `subjectOf`
 * so AI engines see the third-party coverage, not just self-description.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["Organization", "LocalBusiness"],
    "@id": `${SITE_URL}/#organization`,
    name: ORG_NAME,
    alternateName: "Alliance Street",
    url: `${SITE_URL}/`,
    logo: `${SITE_URL}/images/logo-black.png`,
    email: dubai.email,
    telephone: dubai.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress: dubai.address,
      addressLocality: dubai.city,
      addressCountry: "AE",
    },
    founder: {
      "@type": "Person",
      name: FOUNDER.name,
      jobTitle: FOUNDER.jobTitle,
    },
    sameAs: [
      "https://ae.linkedin.com/company/alliancestreetconsultancy",
      "https://www.facebook.com/AllianceStreetConsultancy/",
    ],
    department: otherOffices.map((o) => ({
      "@type": "Organization",
      name: `${ORG_NAME} - ${o.country}`,
      address: {
        "@type": "PostalAddress",
        streetAddress: o.address,
        addressLocality: o.city,
      },
      telephone: o.phone,
      email: o.email,
    })),
    subjectOf: PUBLICATIONS.map((p) => ({
      "@type": "Article",
      headline: p.title,
      url: p.href,
    })),
  };
}

/**
 * Per-page Service schema for the 5 service pages. `path` is the route
 * segment (e.g. "banking") used to build the canonical page URL.
 */
export function serviceSchema({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: name,
    name,
    description,
    url: `${SITE_URL}/${path}/`,
    areaServed: { "@type": "Country", name: "United Arab Emirates" },
    provider: {
      "@type": "Organization",
      name: ORG_NAME,
      url: `${SITE_URL}/`,
    },
  };
}

/**
 * Article/BlogPosting schema for future resources/blog/guides content.
 * `path` is the route segment (e.g. "resources/some-guide") used to build
 * the canonical page URL, matching `serviceSchema`'s URL construction.
 * `author` defaults to the Organization (via `authorName`); `dateModified`
 * defaults to `datePublished` when the page hasn't been updated since.
 * `publisher` references the Organization by `@id`, mirroring how
 * `websiteSchema`'s publisher references the org. Not yet called anywhere —
 * ready for a future resources/blog feature to adopt.
 */
export function articleSchema({
  headline,
  description,
  path,
  datePublished,
  dateModified,
  authorName = ORG_NAME,
}: {
  headline: string;
  description: string;
  path: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url: `${SITE_URL}/${path}/`,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author:
      authorName === ORG_NAME
        ? { "@type": "Organization", name: ORG_NAME, url: `${SITE_URL}/` }
        : { "@type": "Person", name: authorName },
    publisher: { "@id": `${SITE_URL}/#organization` },
  };
}

/**
 * BreadcrumbList schema for a top-level page: Home > <name>. The site is flat,
 * so every non-home page is a single hop from Home. `path` is the route segment
 * (e.g. "banking"); the homepage doesn't need one.
 */
export function breadcrumbSchema(name: string, path: string) {
  const seg = path.replace(/^\/+|\/+$/g, "");
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name, item: `${SITE_URL}/${seg}/` },
    ],
  };
}

/**
 * Site-wide WebSite node (rendered once, in the root layout, alongside the
 * Organization). Aids entity recognition; `publisher` links to the Organization
 * by @id so engines resolve them as the same entity.
 */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: "Alliance Street",
    description:
      "UAE company formation, banking, tax, accounting, real estate and financial advisory - Alliance Street Consultancy.",
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en",
  };
}
