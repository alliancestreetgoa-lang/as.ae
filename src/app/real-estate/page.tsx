import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { InfoBlocks, type InfoBlock } from "@/components/InfoBlocks";
import { Testimonials } from "@/components/Testimonials";
import { Values } from "@/components/Values";
import { Collaborate } from "@/components/Collaborate";
import { AsSeenIn } from "@/components/AsSeenIn";
import { Footer } from "@/components/Footer";

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
      <Navbar />
      <main>
        {/* Split gradient hero */}
        <section className="as-hero-gradient pt-[82px]">
          <div className="as-container grid min-h-[70vh] items-center gap-10 py-24 lg:grid-cols-2">
            <div>
              <h1 className="text-[44px] leading-[1.05] tracking-[-0.04em] text-black sm:text-[60px] lg:text-[68px]">
                Invest, Buy or Rent Property in Dubai
              </h1>
              <p className="mt-8 text-lg text-black/60">
                *The Way It Benefits You (Not Some Agent&apos;s Bank Account).
              </p>
            </div>
            <div className="lg:pl-10">
              <p className="max-w-md text-lg text-black/70">
                Our Developer Connections can and will help you access deals no Agent in
                Dubai can afford to offer:
              </p>
              <Link href="/contact-us" className="as-btn-dark mt-8">
                Let&apos;s talk
              </Link>
            </div>
          </div>
        </section>

        {/* Trusted by developers */}
        <section className="bg-black py-14">
          <div className="as-container">
            <p
              className="mb-10 text-center text-[13px] font-medium uppercase tracking-[0.22em] text-white/70"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              Trusted by the best in the market:
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
              {DEVELOPERS.map((d) => (
                <Image
                  key={d.name}
                  src={d.src}
                  alt={d.name}
                  width={150}
                  height={44}
                  className="h-7 w-auto object-contain opacity-90 sm:h-9"
                />
              ))}
            </div>
          </div>
        </section>

        <InfoBlocks
          eyebrow="LOOKING FOR PROPERTY IN DUBAI?"
          title="Wether you're looking to rent, buy or invest in high ROI opportunities:"
          blocks={BLOCKS}
        />

        <Testimonials />

        {/* Transactions stat */}
        <section className="bg-as-light py-24">
          <div className="as-container max-w-3xl">
            <p className="text-[110px] font-semibold leading-none tracking-[-0.05em] text-black sm:text-[150px]">
              200<span className="text-as-red">+</span>
            </p>
            <p className="mt-2 text-2xl font-medium text-black">
              Successful transactions completed.
            </p>
            <p className="mt-6 max-w-2xl text-lg text-as-muted">
              With over 200 successful transactions, Alliance Street has built a solid
              reputation for providing trusted, reliable advice that clients can count
              on.
            </p>
            <Link href="/contact-us" className="as-btn-dark mt-8">
              Tell us how we can help you
            </Link>
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
