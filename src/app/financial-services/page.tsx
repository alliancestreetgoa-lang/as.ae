import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { PageHero } from "@/components/PageHero";
import { FeatureGrid, type Feature } from "@/components/FeatureGrid";
import { StepsSection, type Step } from "@/components/StepsSection";
import { Solutions } from "@/components/Solutions";
import { Collaborate } from "@/components/Collaborate";
import { AsSeenIn } from "@/components/AsSeenIn";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Financial & Corporate Advisory Services UAE | Alliance Street",
  description:
    "UAE corporate tax, compliance and financial advisory. Business loans, working capital and mortgages - we cut the noise and deliver solutions banks can't.",
};

const FEATURES: Feature[] = [
  {
    heading: "More Options, Better Deals",
    body: "Why settle for one lender when we can connect you with 17? More choices mean you get a mortgage tailored to your goals.",
  },
  {
    heading: "Negotiation Muscle",
    body: "We know the banks, and they know us. That means we'll fight to get you the best rates and terms—deals you won't find on your own.",
  },
  {
    heading: "Stress-Free Process",
    body: "Hate paperwork? So do we. That's why we handle it all, from lender calls to contract details. You focus on your dream home, and we'll do the rest.",
  },
  {
    heading: "No Fluff Expert Advice",
    body: "Our team knows mortgages inside out. No fluff, just clear guidance and solutions designed for you.",
  },
  {
    heading: "Savings That Last",
    body: "No hidden fees. No nasty surprises. Just smart mortgages that save you money, year after year.",
  },
  {
    heading: "Fast Approvals, No Delays",
    body: "Time is money, and we don't waste either. Our streamlined process gets you approved quickly, so you can move forward without the wait.",
  },
];

const STEPS: Step[] = [
  {
    tab: "Business Loans",
    heading: "Cash - without the Hassle",
    body: "Running a business means seizing opportunities fast, not waiting around for approvals. We provide access to business loans that are tailored to you — without the exhausting back-and-forth. Whether you're expanding your operations, upgrading equipment or launching something new, we make the process quick, simple and stress-free.",
  },
  {
    tab: "Trade or Working Capital",
    heading: "Fuel Your Cash Flow",
    body: "Bridge the gap between paying suppliers and getting paid. We arrange trade finance and working-capital facilities that keep your operations moving and your growth funded, without tying up your reserves.",
  },
  {
    tab: "Mortgages",
    heading: "Your Dream Property, Financed",
    body: "First-time buyer or refinancing, we connect you with up to 17 lenders and negotiate the rates and terms you won't find on your own — then handle all the paperwork end-to-end.",
  },
  {
    tab: "Cash - without the Hassle",
    heading: "Fast, Flexible Funding",
    body: "When you need liquidity quickly, our streamlined process gets you approved without the delays. Clear guidance, competitive terms and no hidden surprises.",
  },
];

export default function FinancialServicesPage() {
  return (
    <>
      <Navbar overLight />
      <main>
        <PageHero
          title="UAE Corporate Tax, Compliance & Financial Advisory Services"
          subtitle="Getting a mortgage doesn't have to be complicated. At Alliance Street, we cut the noise and deliver solutions banks can't."
        />
        <FeatureGrid
          eyebrow="HERE'S WHY WE'RE YOUR GO-TO FOR FUNDING"
          title="First-time buyer? Refinancing? Doesn't matter—we've got you."
          features={FEATURES}
        />
        <StepsSection
          eyebrow="OUR FINANCING PROCESS"
          title="You need it - we've got it."
          steps={STEPS}
          cta="Get your Business Loan"
        />
        <Solutions />
        <Collaborate />
        <AsSeenIn />
      </main>
      <Footer />
    </>
  );
}
