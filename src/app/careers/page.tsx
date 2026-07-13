import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { GradientHero } from "@/components/GradientHero";
import { Values } from "@/components/Values";
import { Testimonials } from "@/components/Testimonials";
import { Collaborate } from "@/components/Collaborate";
import { AsSeenIn } from "@/components/AsSeenIn";
import { Footer } from "@/components/Footer";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Careers at Alliance Street | Dubai Business Consultancy",
  description:
    "We're a small team doing real UAE structuring work for real clients. No open roles listed right now, but we're always open to hearing from the right person.",
};

export default function CareersPage() {
  return (
    <>
      <Navbar overLight />
      <main>
        <GradientHero
          title="Careers at Alliance Street"
          subtitle="We're a small team doing real structuring work for real clients - not a call center reading scripts. If that's the kind of work you want to do, we want to hear from you."
        />

        {/* Open roles - honest, no fabricated listings */}
        <Section bg="canvas">
          <Reveal as="div" y={28} className="col-span-12 lg:col-span-8 lg:col-start-3">
            <Eyebrow>Open roles</Eyebrow>
            <h2 className="font-display mt-6 max-w-2xl text-[30px] leading-[1.15] tracking-[-0.03em] text-as-ink sm:text-[40px]">
              Nothing open right now - but we&apos;re always listening.
            </h2>
            <p className="mt-6 max-w-2xl text-[16px] leading-relaxed text-as-muted">
              We don&apos;t run a public jobs board. When we are hiring, it&apos;s
              usually for tax strategists, client-facing consultants, or
              operations and compliance roles.
            </p>
            <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-as-muted">
              If that sounds like you, get in touch with your CV and a note on
              what you&apos;d bring to the team - we&apos;ll reach back out if
              there&apos;s a fit.
            </p>
          </Reveal>
        </Section>

        <Values />
        <Testimonials />
        <Collaborate />
        <AsSeenIn />
      </main>
      <Footer />
    </>
  );
}
