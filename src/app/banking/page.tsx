import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { ImageHero } from "@/components/ImageHero";
import { InfoBlocks, type InfoBlock } from "@/components/InfoBlocks";
import { StepsSection, type Step } from "@/components/StepsSection";
import { StatsBanner } from "@/components/StatsBanner";
import { Solutions } from "@/components/Solutions";
import { Collaborate } from "@/components/Collaborate";
import { AsSeenIn } from "@/components/AsSeenIn";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "UAE Business Bank Account Opening Services | Alliance Street",
  description:
    "Open a UAE business bank account without the tedious KYC, bureaucracy or large deposits. Our banking connections get your accounts opened in hours or days.",
};

const BLOCKS: InfoBlock[] = [
  {
    heading: "The Good Ol' Times Are Over...",
    body: "Walking into a bank in the UAE by yourself to open your business account has became increasingly complex due to stringent regulations and increased scrutiny. This complexity is primarily driven by new taxes, anti-money laundering rules, and compliance requirements.",
  },
  {
    heading: "In 2025, You Need…",
    body: "More Than Just Documents. You Need the Right People. That is exactly where Alliance Street comes in. We offer a full-service, end-to-end support system designed to eliminate the friction, frustration, and delays that come with the modern banking process.",
  },
  {
    heading: "Vitamin C(onnections)",
    body: "By leveraging our banking connections, we minimize delays and maximize efficiency. In simpler terms: We bypass nosey bank managers, complex KYC and bureaucracy, and get your bank account/s opened, hassle-free, in hours or maximum days - even if you are in a 'high risk' business!",
  },
];

const STEPS: Step[] = [
  {
    tab: "Step One",
    heading: "Kick-Off Strategy Session",
    body: "Every investor, entrepreneur, and global brand's journey with us begins with a thorough assessment. At Alliance Street, we evaluate your business structure, revenue model, jurisdictional exposure, transaction volumes, and compliance history to develop a tailored banking strategy unique to your profile.",
    image: "/images/bank.jpg",
  },
  {
    tab: "Step Two",
    heading: "Documentation & KYC Preparation",
    body: "We prepare and stress-test your entire application pack - source of funds, business activity evidence and enhanced KYC - so it sails through the bank's compliance checks the first time, without back-and-forth delays.",
    image: "/images/banking-step-2.jpg",
  },
  {
    tab: "Step Three",
    heading: "Account Opening",
    body: "Using our direct relationships with prestigious banks and financial institutions, we get your corporate and private accounts opened at the institutions of your choice - in a matter of hours or days.",
    image: "/images/bank-card.jpg",
  },
  {
    tab: "Step Four",
    heading: "Ongoing Banking Support",
    body: "Beyond opening, we support you with facility requests, multi-currency accounts and any future banking needs - so your relationship stays smooth as your business scales.",
    image: "/images/banking-step-3.jpg",
  },
];

export default function BankingPage() {
  return (
    <>
      <Navbar alwaysSolid />
      <main>
        <ImageHero
          title="UAE Business Bank Account Opening & Banking Support"
          subtitle="Opening a bank account in Dubai isn't as simple as walking into a branch with your trade license. Banks now follow strict checks, enhanced KYC procedures, and detailed background reviews. That means preparation is non-negotiable. Our connections make navigating the complex UAE banking landscape smooth - even if you are in “high-risk” business!"
          image="/images/bank.jpg"
        />
        <InfoBlocks
          eyebrow="FOR UAE BUSINESS OWNERS & GLOBAL ENTREPRENEURS"
          title="Looking for UAE bank accounts, without tedious KYC processes, bureaucracy or large deposits?"
          blocks={BLOCKS}
        />
        <StepsSection
          eyebrow="OUR BANKING APPROACH"
          title="Done in 4 Strategic Steps"
          steps={STEPS}
          pinned
        />
        <StatsBanner
          quote="“Alliance Street stands as a true benchmark in the UAE's business services landscape, a testament to the competence and excellent application of industry standards and methods, combined with a relentless strive towards brilliance. For entrepreneurs and corporations looking for the best business setup consultants in Dubai, Alliance Street is quite simply the name the industry trusts, respects and continues to recommend.”"
        />
        <Solutions />
        <Collaborate />
        <AsSeenIn />
      </main>
      <Footer />
    </>
  );
}
