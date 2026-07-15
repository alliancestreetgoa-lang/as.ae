import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Button } from "@/components/primitives/Button";
import { Frame } from "@/components/primitives/Frame";
import { Parallax } from "@/components/motion/Parallax";
import { GradientHero } from "@/components/GradientHero";
import { AsSeenIn } from "@/components/AsSeenIn";
import { Stats3 } from "@/components/Stats3";
import { Solutions } from "@/components/Solutions";
import { StatsBanner } from "@/components/StatsBanner";
import { Testimonials } from "@/components/Testimonials";
import { Collaborate } from "@/components/Collaborate";
import { Footer } from "@/components/Footer";
import { Check } from "@/components/icons";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/motion/Reveal";
import { serviceSchema, breadcrumbSchema } from "@/lib/schema";

export const metadata = pageMeta({
  title: "Bookkeeping & Accounting Services in Dubai | Alliance Street",
  description:
    "Bookkeeping, accounting & VAT services in Dubai. We take care of your finances so you can focus on scaling your business - compliant and audit-ready, always.",
  path: "bookkeeping-accounting",
});

const SCHEMA = serviceSchema({
  name: "Bookkeeping, Accounting & VAT Compliance",
  description:
    "Bookkeeping, accounting & VAT services in Dubai. We take care of your finances so you can focus on scaling your business - compliant and audit-ready, always.",
  path: "bookkeeping-accounting",
});

const CHECKLIST = [
  { label: "Spotless Bookkeeping:", rest: "All transactions tracked, no loose ends" },
  { label: "Clear Financial Reports:", rest: "0% jargon, 100% Your Language" },
  { label: "Smart Tax Planning:", rest: "Maximized savings, fully compliant" },
  { label: "Payroll, Perfected:", rest: "Accurate + timely payouts = happy staff" },
  { label: "Audit-Ready, Always:", rest: "Stay prepared, no last-minute rushing" },
];

const STATS = [
  { value: "200+", label: "Businesses in Service" },
  { value: "20+", label: "Tax Lawyers & Strategists" },
  { value: "17+", label: "Years Experience" },
];

export default function BookkeepingAccountingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            SCHEMA,
            breadcrumbSchema("Bookkeeping & Accounting", "bookkeeping-accounting"),
          ]),
        }}
      />
      <Navbar overLight />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Bookkeeping & Accounting", href: "/bookkeeping-accounting" },
        ]}
      />
      <main>
        <GradientHero
          title="Bookkeeping, Accounting & VAT Services in Dubai"
          subtitle="At Alliance Street Consultancy, we take care of your finances so you can focus on scaling your business."
        />

        <AsSeenIn />

        {/* Statement */}
        <Section bg="canvas">
          <Reveal
            as="h2"
            y={24}
            className="font-display col-span-12 mx-auto max-w-4xl text-center text-[32px] leading-[1.15] tracking-[-0.03em] sm:text-[46px]"
          >
            <span className="text-as-ink">We actually understand your business...</span>{" "}
            <span className="text-as-muted">
              that&apos;s why we customize every service.
            </span>
          </Reveal>
        </Section>

        {/* Team at work */}
        <Section bg="canvas">
          <Reveal as="div" y={28} className="col-span-12">
            <Frame tone="red">
              <Parallax
                className="aspect-[16/10] rounded-[18px] sm:aspect-[2/1]"
                amount={80}
              >
                <Image
                  src="/images/team-3.jpg"
                  alt="The Alliance Street accounting team at work in the Dubai office"
                  fill
                  sizes="(min-width: 1024px) 1100px, 100vw"
                  className="object-cover object-[center_34%]"
                />
              </Parallax>
            </Frame>
          </Reveal>
        </Section>

        <Stats3 stats={STATS} />

        {/* Why choose us */}
        <Section bg="ink">
          <Reveal as="div" y={28} className="col-span-12 lg:col-span-5">
            <Eyebrow>Why Choose Us</Eyebrow>
            <h2 className="font-display mt-6 mb-6 text-[34px] leading-[1.1] text-white sm:text-[44px]">
              How we can help
            </h2>
            <h3 className="font-display mb-4 text-2xl text-white">
              Efficiency Meets Expertise
            </h3>
            <p className="max-w-md text-[15px] leading-relaxed text-white/70">
              We don&apos;t just balance books; we streamline your entire financial
              process. Reach out today, and let&apos;s keep your business running
              compliant and ready for what&apos;s next.
            </p>
          </Reveal>

          <div className="col-span-12 mt-14 flex flex-col justify-center lg:col-span-7 lg:mt-0 lg:pl-8">
            <ul className="space-y-5">
              {CHECKLIST.map((c, i) => (
                <Reveal
                  as="li"
                  y={20}
                  delay={0.08 * i}
                  key={c.label}
                  className="flex items-start gap-3"
                >
                  <Check className="mt-0.5 h-5 w-5 shrink-0 text-as-red" />
                  <span className="text-[15px] text-white">
                    <span className="font-semibold">{c.label}</span> {c.rest}
                  </span>
                </Reveal>
              ))}
            </ul>
            <Reveal as="div" y={16} delay={0.5} className="mt-10 w-fit">
              <Button
                href="/contact-us"
                variant="primary"
                track={{
                  name: "consultation_cta_click",
                  params: { cta_label: "Get in Touch", location: "bookkeeping_accounting_hero" },
                }}
              >
                Get in Touch
              </Button>
            </Reveal>
          </div>
        </Section>

        <Solutions />
        <StatsBanner />
        <Testimonials />
        <Collaborate />
        <AsSeenIn />
      </main>
      <Footer />
    </>
  );
}
