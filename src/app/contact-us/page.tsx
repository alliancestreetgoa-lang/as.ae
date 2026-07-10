import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { GradientHero } from "@/components/GradientHero";
import { Collaborate } from "@/components/Collaborate";
import { AsSeenIn } from "@/components/AsSeenIn";
import { Footer } from "@/components/Footer";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Contact UAE Business Setup Experts | Dubai | Alliance Street",
  description:
    "Get in touch with Alliance Street. Offices across the UAE (Dubai, Ras Al Khaimah) and Europe (UK, Germany, Austria, Slovakia).",
};

interface Office {
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
}

const REGIONS: { region: string; offices: Office[] }[] = [
  {
    region: "United Arab Emirates",
    offices: [
      {
        country: "Dubai",
        city: "Dubai",
        address: "Oxford Tower 104, Business Bay",
        phone: "+971 4 262 7928",
        email: "info@alliancestreet.ae",
      },
      {
        country: "Ras Al Khaimah",
        city: "Ras Al Khaimah",
        address: "T1-SF-6B RAKEZ, Amenity Center, Al Hamra FZ",
        phone: "+971 7 207 7052",
        email: "info@alliancestreet.ae",
      },
    ],
  },
  {
    region: "Europe",
    offices: [
      {
        country: "United Kingdom",
        city: "United Kingdom",
        address: "Pine Tree House Gardiners Close, Basildon",
        phone: "+44 07427 431400",
        email: "info@alliancestreet.ae",
      },
      {
        country: "Germany",
        city: "Germany",
        address: "Garmischer Str. 4, 80339 Munich",
        phone: "+49 89 250066266",
        email: "info@alliancestreet.ae",
      },
      {
        country: "Austria",
        city: "Austria",
        address: "Schloßbergstraße 1, 6370 Kitzbühel",
        phone: "+43 1 742501006",
        email: "info@alliancestreet.ae",
      },
      {
        country: "Slovakia",
        city: "Slovakia",
        address: "Zizkova 4D, Kosice",
        phone: "+421 908 996 667",
        email: "info@alliancestreet.ae",
      },
    ],
  },
];

export default function ContactUsPage() {
  return (
    <>
      <Navbar overLight />
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

        <Collaborate />
        <AsSeenIn />
      </main>
      <Footer />
    </>
  );
}
