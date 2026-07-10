import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/primitives/Button";
import { Navbar } from "@/components/Navbar";
import { InfoBlocks, type InfoBlock } from "@/components/InfoBlocks";
import { Testimonials } from "@/components/Testimonials";
import { Values } from "@/components/Values";
import { Collaborate } from "@/components/Collaborate";
import { AsSeenIn } from "@/components/AsSeenIn";
import { Footer } from "@/components/Footer";
import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { Parallax } from "@/components/motion/Parallax";

export const metadata: Metadata = {
  title: "Commercial Real Estate & Office Space in Dubai | Alliance Street",
  description:
    "Invest, buy or rent property in Dubai the way it benefits you. Our developer connections give you access to exclusive deals no agent in Dubai can offer.",
};

const DEVELOPERS = [
  { name: "Emaar", src: "/images/dev-emaar.png" },
  { name: "Damac", src: "/images/dev-damac.png" },
  { name: "Meraas", src: "/images/dev-meraas.png" },
  { name: "Sobha", src: "/images/dev-sobha.png" },
  { name: "Omniyat", src: "/images/dev-omniyat.png" },
];

const BLOCKS: InfoBlock[] = [
  {
    heading: "We don't sell,...",
    body: "we consult. Wether it's about location, developer, building, quality and valuation, Alliance Street is not incentivized by commissions, unlike agents, thus only your success, is our success.",
  },
  {
    heading: "Our mission is simple...",
    body: "to provide unparalleled access to exclusive properties and insider deals, that even 'seasoned' agents in Dubai can't. Whether it's off plan projects, a new home, to rent, buy or on a payment plan, our connections ensure you get the upper hand.",
  },
  {
    heading: "No gimmicks.",
    body: "Unlike agents who are motivated by closing a quick deal for a commission, we operate with transparency and integrity. In simpler terms: We don't just find you properties; we find the right properties for your goals.",
  },
];

export default function RealEstatePage() {
  return (
    <>
      <Navbar overLight />
      <main>
        {/* Split gradient hero — the page's one large red hero moment (brand
            exception to the red-accent-only rule), same `.as-hero-gradient`
            background used by `GradientHero`, but kept as a bespoke
            two-column split (headline left / subcopy + CTA right) since
            `GradientHero` only supports a single centered column. */}
        <section className="bg-as-canvas pt-[82px]">
          <div className="as-container grid min-h-[70vh] items-center gap-10 py-24 lg:grid-cols-2">
            <Reveal as="div" y={28}>
              <h1 className="font-display text-[44px] leading-[1.05] tracking-[-0.04em] text-as-ink sm:text-[60px] lg:text-[68px]">
                Invest, Buy or Rent Property in Dubai
              </h1>
              <p className="mt-8 text-lg text-as-muted">
                *The Way It Benefits You (Not Some Agent&apos;s Bank Account).
              </p>
            </Reveal>
            <Reveal as="div" y={28} delay={0.1} className="lg:pl-10">
              <p className="max-w-md text-lg text-as-muted">
                Our Developer Connections can and will help you access deals no Agent in
                Dubai can afford to offer:
              </p>
              <Button href="/contact-us" variant="ink" className="mt-8">
                Let&apos;s talk
              </Button>
            </Reveal>
          </div>
        </section>

        {/* Trusted by developers — a clean, muted ink trust strip (not the
            red `AsSeenIn` marquee treatment): grayscale logos separated by
            hairline dividers, mirroring `AsSeenIn`'s hand-rolled label
            pattern rather than the red `Eyebrow` primitive, so the row
            stays a quiet ink moment. */}
        <section className="border-y border-as-line bg-as-canvas py-14">
          <div className="as-container">
            <Reveal
              as="p"
              y={16}
              className="mb-10 flex items-center justify-center gap-3 text-center font-mono text-xs uppercase tracking-[0.3em] text-as-muted"
            >
              <span aria-hidden="true" className="inline-block h-px w-6 bg-as-line" />
              Trusted by the best in the market:
              <span aria-hidden="true" className="inline-block h-px w-6 bg-as-line" />
            </Reveal>
            <Reveal
              as="div"
              y={20}
              delay={0.08}
              className="flex flex-wrap items-center justify-center divide-x divide-as-line"
            >
              {DEVELOPERS.map((d) => (
                <div key={d.name} className="px-8 py-1 first:pl-0 last:pr-0 sm:px-10">
                  <Image
                    src={d.src}
                    alt={d.name}
                    width={150}
                    height={44}
                    className="h-7 w-auto object-contain opacity-60 brightness-0 transition-opacity hover:opacity-100 sm:h-9"
                  />
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <InfoBlocks
          eyebrow="LOOKING FOR PROPERTY IN DUBAI?"
          title="Wether you're looking to rent, buy or invest in high ROI opportunities:"
          blocks={BLOCKS}
        />

        <Testimonials />

        {/* Transactions stat — oversized proof-point over a full-bleed
            background image with a dark ink scrim (matches the `StatsBanner`
            treatment), the `Counter` driving the big number. */}
        <section className="relative isolate overflow-hidden bg-as-ink py-24 sm:py-32">
          <div className="absolute inset-0 -z-10">
            <Parallax className="absolute inset-0" amount={100}>
              <Image
                src="/images/businessman-hero.jpg"
                alt=""
                aria-hidden
                fill
                sizes="100vw"
                className="object-cover object-center opacity-60"
              />
            </Parallax>
            {/* Left-weighted scrim keeps the (left-aligned) copy legible. */}
            <div className="absolute inset-0 bg-gradient-to-r from-as-ink via-as-ink/85 to-as-ink/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-as-ink/80 to-transparent" />
          </div>
          <div className="as-container">
            <Reveal as="div" y={28} className="max-w-3xl">
              <p className="font-display text-[110px] leading-none tracking-[-0.05em] text-white sm:text-[150px]">
                <Counter to={200} />
                <span className="text-as-red">+</span>
              </p>
              <p className="mt-2 text-2xl font-medium text-white">
                Successful transactions completed.
              </p>
              <p className="mt-6 max-w-2xl text-lg text-white/70">
                With over 200 successful transactions, Alliance Street has built a solid
                reputation for providing trusted, reliable advice that clients can count
                on.
              </p>
              <Button href="/contact-us" variant="white" className="mt-8">
                Tell us how we can help you
              </Button>
            </Reveal>
          </div>
        </section>

        <Values />
        <Collaborate />
        <AsSeenIn />
      </main>
      <Footer />
    </>
  );
}
