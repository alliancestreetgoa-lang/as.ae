import type { Metadata } from "next";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { GradientHero } from "@/components/GradientHero";
import { Stats3 } from "@/components/Stats3";
import { StatsBanner } from "@/components/StatsBanner";
import { Values } from "@/components/Values";
import { Testimonials } from "@/components/Testimonials";
import { Collaborate } from "@/components/Collaborate";
import { AsSeenIn } from "@/components/AsSeenIn";
import { Footer } from "@/components/Footer";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/motion/Reveal";
import { serviceSchema } from "@/lib/schema";

export const metadata: Metadata = {
  title: "About Alliance Street | Dubai Business Consultancy Since 2017",
  description:
    "Since 2017, Alliance Street has helped 200+ businesses relocate to and structure in the UAE - bridging the gap between business goals and the capital required to achieve them.",
};

const SCHEMA = serviceSchema({
  name: "About Alliance Street Consultancy",
  description:
    "Since 2017, Alliance Street has helped 200+ businesses relocate to and structure in the UAE.",
  path: "about-us",
});

const ABOUT_STATS = [
  { value: "200+", label: "Business Structures Built" },
  { value: "20+", label: "Tax Lawyers & Strategists" },
  { value: "91%", label: "Average Corporate Tax Saved" },
  { value: "17+", label: "Years Experience" },
];

export default function AboutUsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(SCHEMA) }}
      />
      <Navbar overLight />
      <main>
        <GradientHero
          title="About Alliance Street"
          subtitle="At Alliance Street, we built business structures that help you protect your assets and eliminate taxation (often fully) - corporate & private."
        />

        {/* Company origin */}
        <Section bg="canvas">
          <Reveal as="div" y={28} className="col-span-12 lg:col-span-8 lg:col-start-3">
            <Eyebrow>Since 2017</Eyebrow>
            <h2 className="font-display mt-6 max-w-2xl text-[30px] leading-[1.15] tracking-[-0.03em] text-as-ink sm:text-[40px]">
              Streamlining company setup in Dubai, from day one.
            </h2>
            <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-as-muted">
              Since its inception in 2017, Alliance Street has been dedicated
              to streamlining company setups in Dubai. Our goal? Freeing up
              our clients to give their undivided attention to business
              success.
            </p>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-as-muted">
              With a passion for entrepreneurship and a desire to drive
              meaningful change, we set out to create a company that could
              bridge the gap between business goals and the capital required
              to achieve them.
            </p>
          </Reveal>
        </Section>

        <Stats3 stats={ABOUT_STATS} />

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
                alt="Stallone Shaikh, Founder & CEO of Alliance Street Consultancy"
                fill
                sizes="112px"
                className="object-cover"
              />
            </div>
            <div>
              <p className="font-display text-xl text-as-ink">Stallone Shaikh</p>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-as-red">
                Founder &amp; CEO
              </p>
              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-as-muted">
                A former banker with hands-on experience at one of the UAE&apos;s
                top five banks, Stallone has helped 200+ businesses relocate to
                and structure in the UAE. He&apos;s the author of{" "}
                <em>
                  Dubai Dreams &amp; Tax-Free Schemes: The Smart Digital
                  Nomad&apos;s Guide to Building and Protecting Wealth in the
                  UAE
                </em>
                , and has been featured in Khaleej Times, Gulf News, Forbes,
                and Business Insider.
              </p>
            </div>
          </Reveal>
        </Section>

        <Values />
        <StatsBanner />
        <Testimonials />
        <Collaborate />
        <AsSeenIn />
      </main>
      <Footer />
    </>
  );
}
