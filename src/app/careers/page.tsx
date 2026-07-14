import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { Navbar } from "@/components/Navbar";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Values } from "@/components/Values";
import { Testimonials } from "@/components/Testimonials";
import { Collaborate } from "@/components/Collaborate";
import { AsSeenIn } from "@/components/AsSeenIn";
import { Footer } from "@/components/Footer";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";

export const metadata = pageMeta({
  title: "Careers at Alliance Street | Dubai Business Consultancy",
  description:
    "We're a small team doing real UAE structuring work for real clients. No open roles listed right now, but we're always open to hearing from the right person.",
  path: "careers",
});

export default function CareersPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema("Careers", "careers")),
        }}
      />
      <Navbar />
      <Breadcrumb
        variant="dark"
        items={[
          { label: "Home", href: "/" },
          { label: "Careers", href: "/careers" },
        ]}
      />
      <main>
        {/* Careers hero — the site's black -> red -> white brand gradient
            (`.as-hero-gradient`, defined in globals.css but otherwise
            unused), with white bold sans copy matching the reference
            design, instead of the light-background/Fraunces GradientHero
            used on every other page. */}
        <section className="as-hero-gradient min-h-[115vh] pt-[82px]">
          <div className="as-container flex flex-col items-center pt-20 text-center sm:pt-28">
            <SplitReveal
              as="h1"
              text="Careers in UAE Business Consulting & Advisory"
              stagger={0.05}
              className="font-sans font-extrabold max-w-4xl text-[40px] leading-[1.1] tracking-[-0.02em] text-white sm:text-[56px] lg:text-[64px]"
            />
            <Reveal
              as="p"
              y={22}
              delay={0.1}
              className="mt-8 max-w-xl text-lg leading-relaxed text-white/85"
            >
              At Alliance Street, we built business structures that help
              entrepreneurs protect their assets and eliminate taxation -
              corporate & private.
            </Reveal>
          </div>
        </section>

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
