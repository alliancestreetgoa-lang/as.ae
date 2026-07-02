import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { PageHero } from "@/components/PageHero";
import { Mission } from "@/components/Mission";
import { Stats3 } from "@/components/Stats3";
import { StepsSection, type Step } from "@/components/StepsSection";
import { StatsBanner } from "@/components/StatsBanner";
import { Solutions } from "@/components/Solutions";
import { Values } from "@/components/Values";
import { Testimonials } from "@/components/Testimonials";
import { Collaborate } from "@/components/Collaborate";
import { AsSeenIn } from "@/components/AsSeenIn";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Dubai Business Setup & Company Formation Experts | Alliance Street",
  description:
    "Start your business in Dubai and expand your global opportunities. Alliance Street helps entrepreneurs establish a strong, compliant presence in the UAE.",
};

const STEPS: Step[] = [
  {
    tab: "Step One",
    heading: "Kick-Off Consultation",
    body: "On the button below you can book a private and confidential consultation, where we review your current business, its structure, and your requirements for company formation and banking support. Based on this information, our team will develop a legal and compliant Dubai business setup strategy tailored to your goals and long-term business expansion plans.",
    image: "/images/businessman-hero.jpg",
  },
  {
    tab: "Step Two",
    heading: "Strategy & Structuring",
    body: "Our strategists and international tax lawyers design the optimal jurisdiction and corporate structure for your goals - free zone, mainland or multi-jurisdictional - minimising tax liability while keeping you fully compliant.",
    image: "/images/strategy.jpg",
  },
  {
    tab: "Step Three",
    heading: "Setup & Banking",
    body: "We handle every piece of paperwork to secure your licences, residency visas and Emirates ID, then leverage our network to open your corporate and private bank accounts at prestigious institutions - fast.",
    image: "/images/bank.jpg",
  },
  {
    tab: "Step Four",
    heading: "Launch & Scale",
    body: "With your structure live, we support you with ongoing accounting, tax and compliance, and help you strategically invest your tax savings into prime real estate and exclusive opportunities.",
    image: "/images/team-3.jpg",
  },
];

export default function DubaiBusinessSetupPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          title="Are you next?"
          subtitle="Are you ready to start business in Dubai and expand your global opportunities? At Alliance Street, we help entrepreneurs and companies establish a strong presence in the UAE through strategic Dubai business setup solutions."
        />
        <Mission />
        <Stats3 />
        <StepsSection
          eyebrow="BUSINESS SETUP SIMPLIFIED"
          title="Go Global in 4 Steps"
          steps={STEPS}
        />
        <StatsBanner />
        <Solutions />
        <Values />
        <Testimonials />
        <Collaborate />
        <AsSeenIn />
      </main>
      <Footer />
    </>
  );
}
