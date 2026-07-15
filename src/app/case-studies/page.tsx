import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { breadcrumbSchema } from "@/lib/schema";
import { Navbar } from "@/components/Navbar";
import { Breadcrumb } from "@/components/Breadcrumb";
import { GradientHero } from "@/components/GradientHero";
import { Section } from "@/components/primitives/Section";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Collaborate } from "@/components/Collaborate";
import { AsSeenIn } from "@/components/AsSeenIn";
import { Footer } from "@/components/Footer";

export const metadata = pageMeta({
  title: "UAE Company Formation Case Studies | Alliance Street",
  description:
    "20 real case studies on UAE company formation and tax structuring, anonymized and generalized to protect client confidentiality - across property, e-commerce, tech, trades, and more, including cases we advised against.",
  path: "case-studies",
});

type CaseStudy = {
  number: number;
  title: string;
  profile: string;
  situation: string;
  structure: string;
  outcome: string;
  takeaway: string;
};

const CASE_STUDIES: CaseStudy[] = [
  {
    number: 1,
    title: "Three-layer structure for a property developer",
    profile:
      "A UK-based property developer running a project management/development business, evaluating a full UAE holding structure.",
    situation:
      "Wanted to reduce UK tax exposure on property development income and was open to a more sophisticated multi-entity structure.",
    structure:
      "A three-layer structure - a UAE trading entity to run the project management business, a holding company above it, and a foundation on top for asset protection - with UAE Small Business Relief (0% tax on the first £600,000) directly applicable.",
    outcome:
      "Agreed the structure made sense in principle, pending a decision after consulting a new UK accountant.",
    takeaway:
      "Multi-layer structures land well with clients already used to complexity (developers, multi-entity operators) - but expect a \"let me check with my accountant\" pause, and pre-empt it by offering an accountant referral rather than letting an existing adviser become a blocker.",
  },
  {
    number: 2,
    title: "UAE residency for a property portfolio landlord",
    profile:
      "A UK property investor with a mixed commercial/residential portfolio worth roughly £1.2-1.3 million, generating about £120,000-130,000 a year before expenses.",
    situation:
      "Was mid-transfer of properties into a UK limited company (which would raise annual tax to an estimated £60,000-65,000) and wanted to know whether relocating to Dubai could reduce the tax hit, plus how to protect the properties for his children long-term.",
    structure:
      "The Statutory Residence Test (SRT) path to non-UK tax residency (183+ days outside the UK), letting him draw money from the new company without UK dividend tax; and transferring the bulk of the properties into a UAE foundation to reduce personal income tax exposure and shield against UK inheritance tax.",
    outcome:
      "Arranged a follow-up in-person meeting in Dubai to progress the foundation setup.",
    takeaway:
      "For landlords already spending significant time abroad, the pitch isn't \"should I leave the UK\" - it's \"how do I formalize what I'm already doing\" (SRT residency), plus a forward-looking estate-planning layer.",
  },
  {
    number: 3,
    title: "Foundation vs. company for an existing Dubai property owner",
    profile:
      "A UK-based investor who already owns Dubai real estate worth approximately 4.5 million AED.",
    situation:
      "Wanted to structure existing Dubai property holdings to avoid future UK income tax on rental income and UK inheritance tax (40%) when the properties eventually pass to his children. Was cost-sensitive given the properties weren't yet generating income.",
    structure:
      "A UAE common-law foundation to hold the properties - framed not as solving a current tax problem, but as paying for itself roughly 8x over once the properties start producing rental income, while removing 40% UK inheritance tax exposure entirely.",
    outcome:
      "Requested a detailed pros/cons breakdown to discuss with family before deciding.",
    takeaway:
      "When a structure's benefit is mostly forward-looking, quantify it as a multiple of the annual cost (\"8x your £5,000\") rather than a percentage tax rate - that framing lands better when there's no current income to compare against.",
  },
  {
    number: 4,
    title: "Holding structure for a scaling e-commerce brand",
    profile:
      "A UK e-commerce business importing and selling decorative goods, growing from roughly £250,000-300,000 toward a targeted £400,000 turnover.",
    situation:
      "Already paying UK corporation tax, wanted a scalable structure ahead of further growth and an eventual exit in 7-10 years, without disrupting the existing UK sales operation.",
    structure:
      "A UAE holding company linked to the UK trading brand, using transfer pricing to consolidate purchasing under the UAE entity while UK-facing sales stayed in the UK company - letting profit accumulate tax-free in the UAE while UK operations stayed lean.",
    outcome:
      "Planned a Dubai trip to explore the market and de-risk payment/logistics questions before committing capital.",
    takeaway:
      "Growing e-commerce brands respond well to a \"holding company + transfer pricing\" pitch that lets them keep UK sales operations intact while shifting margin offshore - but the operational plumbing needs de-risking before they'll commit.",
  },
  {
    number: 5,
    title: "IP law route for an AI health-tech app",
    profile:
      "A two-person team building an AI-powered booking CRM for the health and beauty industry.",
    situation:
      "Wanted to structure IP ownership and sales revenue tax-efficiently from day one, ahead of launch.",
    structure:
      "Two options were presented - the UAE's IP law route (full 0% corporation tax, contingent on genuine local development activity and UAE-based employees), or a simpler standard free-zone company at the flat 9% rate.",
    outcome:
      "Both options were sent in writing for the co-founders to compare and decide which partner would act as UAE manager.",
    takeaway:
      "For IP-heavy tech/SaaS businesses, the UAE's IP law (a true 0% rate) is a strong differentiator over the standard 9% free-zone company - but set expectations early that it comes with real substance conditions.",
  },
  {
    number: 6,
    title: "Closing on a time-limited visa promotion",
    profile: "A UK professional-services practice owner, already tax-literate.",
    situation:
      "Paying high UK taxes on the practice, had been exploring a living trust before this conversation turned toward a UAE company structure. Was price-anchored against cheaper competitor quotes and skeptical of a \"visa-for-life\" promotional offer.",
    structure:
      "A UAE trading entity managing a UK marketing-outsourcing relationship, with regular UAE travel to prove control-and-management to HMRC. All-in first-year cost around £6,000-7,000 including license, visa, medicals, and bank account.",
    outcome:
      "Proceeded after the promotional visa offer was verified live with the free zone representative on the call.",
    takeaway:
      "When a prospect compares an all-in price against a stripped-down competitor quote, itemize what's actually included rather than arguing the number - and a genuine, verifiable time-limited promo is one of the most effective closes.",
  },
  {
    number: 7,
    title: "VAT and payment-routing for an education recruitment agency",
    profile:
      "A UK-based student recruitment agency with turnover around £1 million, VAT-registered.",
    situation:
      "The core problem wasn't tax rate - it was cash flow and VAT: university partners were reluctant to pay commissions into a UAE-registered entity. Was also uneasy about a UAE entity being run by a different named manager.",
    structure:
      "The UK company acting as a sourcing/marketing agent billing a new UAE entity only for its real costs (not a marked-up fee), while the UAE entity billed the UK counterparties directly - a cost-recharge arrangement that doesn't create a VAT liability in either jurisdiction, backed by a genuine UAE office and employee.",
    outcome:
      "Still deciding, pending direct confirmation from university partners on whether they'd accept payment to a UAE entity.",
    takeaway:
      "Not every client's real blocker is UK tax rate - for agency/commission businesses, whether counterparties will even pay the new entity can matter more than the tax math.",
  },
  {
    number: 8,
    title: "A healthcare professional already living in the UAE",
    profile:
      "A UK-qualified healthcare professional who had already relocated to the UAE, but still operated through a UK limited company with turnover in the £100,000-130,000 range.",
    situation:
      "Was already a non-UK tax resident personally, but the company itself remained UK tax resident - meaning UK tax and VAT were still being paid unnecessarily. Practicing in the UAE required navigating separate professional licensing requirements.",
    structure:
      "A menu of options was presented - deregistering the UK company for VAT, drawing salary tax-efficiently given non-residency, routing dividends into a UAE entity, or a UAE parent company owning the UK entity as a subsidiary.",
    outcome:
      "Sequenced advice - complete UAE licensing exams first, keep working remotely under the optimized UK company in the interim, revisit UAE practice once qualified.",
    takeaway:
      "Regulated professionals often have a personal residency situation well ahead of their corporate structure - the fix isn't always \"move everything to the UAE,\" it's often \"align the company with where you already, legally, live.\"",
  },
  {
    number: 9,
    title: "IP licensing for a multi-business trades roll-up",
    profile:
      "A former property investor who pivoted to acquiring small trades businesses, owning several outright plus a minority stake in another, for combined group turnover in the £3-4 million range.",
    situation:
      "Wanted to reduce the group's overall tax burden while continuing to roll up more trades businesses, with a genuine interest in legitimate anonymity and creditor protection.",
    structure:
      "IP (potentially trademarking the business brands) created in the UAE to charge licensing fees to the UK operating businesses, combined with a share-for-share exchange between UK and UAE holding companies.",
    outcome:
      "A detailed proposal was prepared, with the anonymity/protection question specifically validated by a compliance specialist before being promised.",
    takeaway:
      "For serial acquirers with multiple UK trading entities, IP licensing plus a holding-company share exchange is a strong structural fit - but any \"anonymity and creditor protection\" ask should be validated by a compliance specialist first.",
  },
  {
    number: 10,
    title: "Choosing Cyprus over the UAE for an EU-facing business",
    profile:
      "A business owner running in-person training courses across several European countries, plus roughly $50,000-70,000 in cryptocurrency trading profit.",
    situation:
      "Wanted to structure both the training business and crypto gains tax-efficiently, weighing the UAE against other jurisdictions given the business was EU-centric, not UAE-facing.",
    structure:
      "A Cyprus company was recommended instead of a UAE entity, given the European client base - with dividends taken outside the EU untaxed - alongside the UAE's Small Business Relief as an alternative if a UAE-based structure was preferred.",
    outcome: "Still deciding, modeling the numbers independently before responding.",
    takeaway:
      "Not every prospect belongs in a UAE structure - when a client's revenue base is EU-centric, an EU-adjacent jurisdiction can be the more honest recommendation, and offering it builds the kind of trust that closes the next deal.",
  },
  {
    number: 11,
    title: "A content creator comparing quotes",
    profile:
      "A UK-based content creator with annual turnover around £300,000, mostly from brand deals, facing a UK tax liability of roughly £75,000.",
    situation:
      "Considering relocating to Dubai to reduce the tax bill while keeping the ability to travel back to the UK for work commitments. Was weighing quotes from other UAE company-formation providers.",
    structure:
      "The Small Business Relief window, the 90-day UK / 180-day UAE residency framework to establish genuine tax residency, and a holding-company structure with documentation to satisfy HMRC that income was genuinely UAE-sourced.",
    outcome:
      "Encouraged to independently verify by speaking to an existing Dubai-based network about their experience with different providers before deciding.",
    takeaway:
      "High-earning individuals with brand-deal income are attractive prospects because so much of their income is genuinely relocatable - but don't compete on price against unnamed cheaper quotes; invite the prospect to diligence the competition themselves.",
  },
  {
    number: 12,
    title: "A Golden Visa via the media/influence route",
    profile:
      "An influencer planning to relocate to Dubai with a partner, exploring a Golden Visa route rather than a standard employment or investor visa.",
    situation:
      "Wanted UAE residency for both, ideally via Golden Visa, and was also exploring how to move surplus personal funds into a UAE structure as part of the relocation plan.",
    structure:
      "A Golden Visa proposal to the relevant UAE authority leveraging public influence/reach, alongside a standard UAE company structure with the influencer as an employee (securing residency) and a local manager on the trade license for HMRC purposes.",
    outcome:
      "A written quotation was prepared (with and without manager costs) so the true baseline setup cost was visible separately from the optional manager fee.",
    takeaway:
      "Golden Visas aren't only for large investors - public profile/media influence is itself a valid basis for an application, a differentiated angle worth raising with content creators and other public-facing clients.",
  },
  {
    number: 13,
    title: "A multi-million-pound real estate fund structure",
    profile:
      "A small founding team with a finance/investment background planning to pool £5-10 million from UK investors into a Dubai/Abu Dhabi off-plan real estate vehicle, targeting a 2-3 year hold.",
    situation:
      "Wanted a lighter-weight structure than a full regulated investment fund (which would take roughly 8 months and significant cost), while still giving larger investors real security.",
    structure:
      "A General Partnership Limited by Shares (GPLP) via the DIFC - a lighter alternative supporting up to 50 shareholders, startable immediately - modeled to show a strong after-tax return given the first $100,000 tax-exempt and the remainder at 9%, with no capital gains tax.",
    outcome: "A full proposal and cost breakdown was prepared for further discussion.",
    takeaway:
      "For fund-style, multi-investor deals, a lighter DIFC structure can capture most of the benefit of a full regulated fund at a fraction of the setup time and cost - valuable when the real blocker is speed-to-market, not size.",
  },
  {
    number: 14,
    title: "Working through an HMRC scrutiny objection",
    profile:
      "A UK-based operation involving land sourcing and project coordination services (construction-adjacent), moving several thousand pounds a month between entities.",
    situation:
      "Directly worried that large, regular monthly payments to a UAE entity would draw HMRC investigation.",
    structure:
      "A management consultancy license in the UAE, with a UK holding company added above the UAE operational entity for standard dividend-routing and ownership structuring, plus regular UAE visits (roughly every six months) to maintain genuine, documented management decision-making there, consistent with the control-and-management test.",
    outcome:
      "Moved from \"worried this looks dodgy\" to open to proceeding, pending the client's own accountant's review.",
    takeaway:
      "When a client's objection is specifically about regulatory scrutiny, walk through the actual substance requirements rather than simply reassuring them - clients who understand why a structure is defensible are more likely to actually maintain compliance.",
  },
  {
    number: 15,
    title: "Restructuring around existing HMRC debt",
    profile:
      "A UK professional with variable, high income (salary plus commission), separately holding an existing UK limited company carrying legacy HMRC debt.",
    situation:
      "Facing a steep UK tax bill and wanting to both optimize going forward and clean up the legacy debt situation. Cash flow was a genuine constraint on the upfront setup cost.",
    structure:
      "A UAE trading entity paired with a trust/foundation for asset protection, targeting genuine non-UK tax residency, modeled to allow drawing significant income tax-efficiently. Total setup was quoted in the £12,000-13,000 range.",
    outcome:
      "Payment was split into two stages - an upfront amount and a second instalment once the bank account was live - which converted a hesitation into a signed deal.",
    takeaway:
      "When cost is a genuine cash-flow constraint (not price-shopping), splitting payment into stages tied to actual milestones can close a deal that a straight discount wouldn't.",
  },
  {
    number: 16,
    title: "A trading educator mid-relocation",
    profile:
      "An online educator teaching everyday people stock market investing via webinars and courses.",
    situation:
      "Already committed to relocating to Dubai and setting up a UAE free-zone company - this was about getting the details right, not persuasion.",
    structure:
      "Confirmed non-residency mechanics (under 183 days in the UK), flagged that the license activity needed to correctly reflect investment-advisory work for banking compliance, and confirmed that renting out a UK property wouldn't by itself break non-resident status.",
    outcome:
      "The call converted into an ongoing banking and accounting client relationship, plus a referral opportunity given the client's own advisory client base.",
    takeaway:
      "Not every valuable call is a \"will they sign\" moment - some of the most durable clients are people already committed to relocating who need execution help rather than persuasion.",
  },
  {
    number: 17,
    title: "Comparison-shopping between providers",
    profile:
      "A UK professional-services consulting practice owner, expecting around £300,000 in revenue, not needing to be physically based in Dubai.",
    situation:
      "Wanted a straightforward UAE setup for tax efficiency while living wherever suited personally, and was simultaneously in conversation with a competing provider.",
    structure:
      "Confirmed the expected revenue could likely achieve 0% tax under Small Business Relief, recommended specific UAE banking options, and supported the client's preference to keep his own accountant rather than a bundled arrangement.",
    outcome: "Requested a full proposal to compare directly against the competing quote.",
    takeaway:
      "When prospects are actively comparing providers, don't disparage the competitor - get specific about what's actually included in each quote and let the client discover the gap themselves.",
  },
  {
    number: 18,
    title: "Too small for now: a cleaning business and a SaaS startup",
    profile:
      "An owner running two ventures - a UK cleaning company, and a SaaS startup providing CRM software for service businesses.",
    situation:
      "Interested in tax optimization for both, and considering expanding the SaaS product into the Dubai market.",
    structure:
      "Assessed that UAE management and operations costs would likely not be worthwhile given current profit levels - advised to revisit once the cleaning business scales further, and noted the SaaS startup's current position meant it could be managed without a UAE structure for now.",
    outcome:
      "No structure was set up; free, no-cost information was shared instead (a foreign company can market into the UAE without needing a local entity).",
    takeaway:
      "Fixed UAE setup and running costs only pay for themselves above a certain profit threshold. Advising a clearly sub-scale prospect to wait costs nothing today and preserves the relationship for when they do scale.",
  },
  {
    number: 19,
    title: "Already well-optimized: a trades business",
    profile:
      "An owner of a UK trades business (HVAC/mechanical services) with a small team, annual turnover of £1.1-1.3 million.",
    situation: "Exploring a UAE presence due to changing UK tax laws.",
    structure:
      "A detailed analysis of the actual tax position (corporation tax plus Construction Industry Scheme labour taxes, totalling roughly £80,000/year) found the business was already well-optimized for its structure and sector - the potential UAE tax savings wouldn't cover the cost of establishing and maintaining a UAE structure.",
    outcome:
      "No UAE company was set up; alternatives (personal relocation, or UAE real estate as an investor) were offered instead.",
    takeaway:
      "A business with heavy payroll-tax exposure may already be near-optimally taxed under its existing structure - always run the actual cost-of-setup-vs-tax-saved math before proposing a UAE entity, and be willing to say it isn't the right move.",
  },
  {
    number: 20,
    title: "A pre-revenue founder with multiple ideas",
    profile:
      "A founder building an ecosystem of ventures - a consumer products brand, an accessories business, and a coaching program - none of which had generated revenue yet.",
    situation:
      "Wanted to set up UAE structures for multiple businesses simultaneously, primarily to lock in tax savings before the businesses even launched.",
    structure:
      "With no revenue in either target business yet, there was no current tax liability to structure around, meaning the setup cost had nothing to offset. Advised launching in the home market first and only bringing the structure to the UAE once there was real revenue.",
    outcome:
      "The process was delayed to a specific future date, with materials prepared in advance for when the founder was ready.",
    takeaway:
      "Pre-revenue founders are the clearest \"not yet\" case - there's no tax to optimize before there's profit. The right move is to delay the structure and stay useful in adjacent ways.",
  },
];

const CASE_STUDY_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  itemListElement: CASE_STUDIES.map((c) => ({
    "@type": "CreativeWork",
    position: c.number,
    name: `Case Study ${c.number}: ${c.title}`,
    abstract: c.takeaway,
  })),
};

export default function CaseStudiesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            CASE_STUDY_JSON_LD,
            breadcrumbSchema("Case Studies", "case-studies"),
          ]),
        }}
      />
      <Navbar />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Case Studies", href: "/case-studies" },
        ]}
      />
      <main>
        <GradientHero
          title="Case Studies"
          subtitle="20 real situations we've worked through, anonymized and generalized to protect client confidentiality - across property, e-commerce, tech, trades, and more. Including the ones we said no to."
        />

        <Section bg="canvas">
          <div className="col-span-12 mx-auto max-w-3xl">
            <Eyebrow>Anonymized precedent</Eyebrow>
            <p className="mt-4 text-[14px] leading-relaxed text-as-muted">
              Every case below is drawn from real client work, with names,
              companies, exact figures, and other identifying details
              removed, generalized into broader categories, or rounded into
              ranges to protect confidentiality. The situation, structure,
              and outcome are kept intact. Figures are illustrative and vary
              by individual circumstances.
            </p>

            <p className="mt-4 text-[14px] leading-relaxed text-as-muted">
              Related services:{" "}
              <Link
                href="/dubai-business-setup"
                className="text-as-red underline-offset-4 hover:underline"
              >
                Dubai Business Setup
              </Link>
              ,{" "}
              <Link
                href="/banking"
                className="text-as-red underline-offset-4 hover:underline"
              >
                Banking Solutions
              </Link>
              , and{" "}
              <Link
                href="/bookkeeping-accounting"
                className="text-as-red underline-offset-4 hover:underline"
              >
                Accounting Service
              </Link>
              .
            </p>

            <div className="mt-10 divide-y divide-as-line border-t border-as-line">
              {CASE_STUDIES.map((c) => (
                <details key={c.number} className="group py-6">
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 marker:content-none">
                    <span className="font-display text-[18px] leading-snug text-as-ink sm:text-[20px]">
                      <span className="mr-2 text-as-red">
                        Case {c.number}.
                      </span>
                      {c.title}
                    </span>
                    <span
                      aria-hidden="true"
                      className="mt-1 shrink-0 text-as-muted transition-transform duration-200 group-open:rotate-45"
                    >
                      +
                    </span>
                  </summary>
                  <div className="mt-4 space-y-3 text-[15px] leading-relaxed text-as-muted">
                    <p>
                      <span className="font-medium text-as-ink">Profile: </span>
                      {c.profile}
                    </p>
                    <p>
                      <span className="font-medium text-as-ink">Situation: </span>
                      {c.situation}
                    </p>
                    <p>
                      <span className="font-medium text-as-ink">Structure: </span>
                      {c.structure}
                    </p>
                    <p>
                      <span className="font-medium text-as-ink">Outcome: </span>
                      {c.outcome}
                    </p>
                    <p>
                      <span className="font-medium text-as-ink">Takeaway: </span>
                      {c.takeaway}
                    </p>
                  </div>
                </details>
              ))}
            </div>

            <p className="mt-14 text-[13px] leading-relaxed text-as-muted">
              These are illustrative summaries, not guarantees of outcome for
              your own situation - every structure depends on your specific
              circumstances. This page is general information, not regulated
              tax, legal, or financial advice.
            </p>
          </div>
        </Section>

        <Collaborate />
        <AsSeenIn />
      </main>
      <Footer />
    </>
  );
}
