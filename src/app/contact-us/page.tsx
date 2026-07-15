import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Breadcrumb } from "@/components/Breadcrumb";
import { GradientHero } from "@/components/GradientHero";
import { Collaborate } from "@/components/Collaborate";
import { AsSeenIn } from "@/components/AsSeenIn";
import { Footer } from "@/components/Footer";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/motion/Reveal";
import { FOUNDER, REGIONS } from "@/lib/content";

export const metadata = pageMeta({
  title: "Contact UAE Business Setup Experts | Dubai | Alliance Street",
  description:
    "Get in touch with Alliance Street. Offices across the UAE (Dubai, Ras Al Khaimah) and Europe (UK, Germany, Austria, Slovakia).",
  path: "contact-us",
});

export default function ContactUsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema("Contact", "contact-us")),
        }}
      />
      <Navbar overLight />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Contact", href: "/contact-us" },
        ]}
      />
      <main>
        <GradientHero
          title="Get in Touch"
          subtitle="We stay at the forefront of international tax regulations, ensuring that your business has access to the latest benefits and opportunities."
          cta="How can we help?"
        />

        {/* Offices */}
        <Section bg="canvas">
          <Reveal as="div" y={28} className="col-span-12">
            <Eyebrow>Our Presence</Eyebrow>
          </Reveal>

          <div className="col-span-12 mt-14 space-y-16">
            {REGIONS.map((r, ri) => (
              <div key={r.region}>
                <Reveal as="h2" y={24} delay={0.08 * ri} className="font-display mb-8 text-[28px] tracking-[-0.02em] text-as-ink sm:text-[32px]">
                  {r.region}
                </Reveal>
                <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
                  {r.offices.map((o, oi) => (
                    <Reveal
                      as="div"
                      y={20}
                      blur={6}
                      delay={0.08 * ri + 0.06 * oi}
                      key={o.country}
                      className="border-t border-as-line pt-6 transition-colors duration-300 hover:border-as-red/60"
                    >
                      <h3 className="font-display mb-3 text-xl text-as-ink">
                        {o.country}
                      </h3>
                      <p className="text-[15px] leading-relaxed text-as-muted">
                        {o.address}
                      </p>
                      <a
                        href={`tel:${o.phone.replace(/\s/g, "")}`}
                        className="mt-2 block text-[15px] text-as-ink hover:text-as-red"
                      >
                        {o.phone}
                      </a>
                      <a
                        href={`mailto:${o.email}`}
                        className="block text-[15px] text-as-red"
                      >
                        {o.email}
                      </a>
                    </Reveal>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Founder credential block */}
        <Section bg="canvas">
          <Reveal
            as="div"
            y={24}
            className="col-span-12 flex flex-col items-start gap-8 border-t border-as-line pt-14 sm:flex-row sm:items-center"
          >
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full">
              <Image
                src="/images/values-stallone.jpg"
                alt={`${FOUNDER.name}, ${FOUNDER.jobTitle} of Alliance Street Consultancy`}
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-display text-xl text-as-ink">{FOUNDER.name}</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-as-red">
                {FOUNDER.jobTitle}
              </p>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-as-muted">
                A former banker with hands-on experience at a major UAE
                bank, Stallone has helped 200+ businesses relocate to
                and structure in the UAE. He&apos;s the author of{" "}
                <em>Fast-Track to Zero Tax</em>
                , and has been featured in Khaleej Times, Gulf News, Forbes,
                and Business Insider.
              </p>
            </div>
          </Reveal>
        </Section>

        <Collaborate />
        <AsSeenIn />
      </main>
      <Footer />
    </>
  );
}
