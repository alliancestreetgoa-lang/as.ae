import { PUBLICATIONS, REGIONS } from "@/lib/content";

export const SITE_URL = "https://shaukinsv.com";
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
      name: "Stallone Shaikh",
      jobTitle: "Founder & CEO",
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
