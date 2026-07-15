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
  title: "UAE Company Formation & Tax FAQ | Alliance Street",
  description:
    "Answers to the most common questions on UAE company formation, tax structuring, Small Business Relief, banking, residency, and compliance - straight, no sales pitch.",
  path: "faq",
});

type FaqItem = { q: string; a: string };
type FaqCategory = {
  category: string;
  items: FaqItem[];
  relatedService?: { label: string; href: string };
};

const FAQ: FaqCategory[] = [
  {
    category: "Legality & Compliance",
    items: [
      {
        q: "Is UAE company structuring legal, or is this tax evasion?",
        a: "UAE company structuring is a recognized, legal form of tax planning when the UAE entity has genuine economic substance: a real, UAE-based manager who actually signs contracts and makes decisions, arm's-length pricing between related entities, and documentation showing decisions were genuinely made in the UAE. That substance is what makes a structure compliant - a company with no real UAE activity, used only to redirect income on paper, does not meet the standard. Whether a specific structure is compliant depends on individual facts and should be confirmed with a qualified tax adviser.",
      },
      {
        q: "How do I prove \"control and management\" is genuinely in the UAE?",
        a: "This is the single most important compliance requirement. In practice it means a UAE-based manager who signs contracts, invoices, and banking paperwork; regular travel by the owner to make and document strategic decisions in the UAE; a genuine UAE office or address; and paperwork - board minutes, invoices, contracts - showing decisions were made there. The public trade license lists the appointed manager; shareholder ownership is recorded in the company's constitutional documents and verified by the bank and relevant authorities rather than shown on the license itself.",
      },
      {
        q: "What does a \"local manager\" actually do, and is my money safe?",
        a: "The manager's role is to sign contracts, invoices, and banking paperwork to demonstrate UAE-based control - not to control your money. The shareholder retains full access to funds via online banking, a company debit card, and full account visibility. A dedicated manager typically costs around £5,000; some clients instead use a trusted family member already based in (or willing to relocate to) the UAE to avoid that cost.",
      },
      {
        q: "Will regular payments from my UK company to a UAE company raise red flags with HMRC?",
        a: "Only if they lack commercial justification. Payments need to reflect a real service - marketing, management consultancy, IP licensing, sourcing - charged at a fair, arm's-length rate, not an arbitrary profit share. A management fee well above a normal commercial rate (roughly 7-10% is a common benchmark) is a compliance risk worth avoiding.",
      },
      {
        q: "Do I need a nominee director?",
        a: "No - you remain the legal shareholder throughout; a nominee director isn't required.",
      },
      {
        q: "Does moving ownership to a UAE entity change what's shown on public company records?",
        a: "The UAE trade license lists the appointed manager rather than the shareholders. Your actual ownership and shareholding are documented in the company's constitutional documents and can be shared directly with partners, clients, or banks whenever you need to verify who owns the business.",
      },
    ],
  },
  {
    category: "Costs & Fees",
    items: [
      {
        q: "How much does it cost to set up a company in the UAE?",
        a: "Typical first-year, all-inclusive setup costs (license, establishment card, one visa, medical/biometrics, virtual office, and advisory fees) cluster around £6,000-£8,500 / $8,000-$10,000, though this varies by jurisdiction (Dubai mainland/free zone vs. Ras Al Khaimah/Northern Emirates), number of shareholders/visas, and package inclusions - Northern Emirates licenses generally run cheaper than Dubai or Abu Dhabi.",
      },
      {
        q: "What does it cost to keep the company running each year?",
        a: "Ongoing costs are generally lower than year one: roughly £4,500-£5,000 for license renewal, plus monthly accounting/bookkeeping, plus visa renewal every two years (~£800-£900, sometimes waived under promotional offers), plus audit costs of roughly £800-£1,000 depending on turnover.",
      },
      {
        q: "Is there a separate manager fee, and can it be paid in stages?",
        a: "Yes - a dedicated local manager typically costs around £5,000, and this can sometimes be phased (an initial payment to start setup, with the manager fee payable later once the bank account is live) to ease cash-flow pressure.",
      },
      {
        q: "Is it worth the cost if my turnover or tax savings are small?",
        a: "Often no - and we'll say so directly. If your current tax position is already reasonably efficient relative to setup and running costs, your business is pre-revenue, or projected turnover doesn't clearly justify a £6,000+ setup cost, the honest advice is to wait until the business scales rather than proceed anyway.",
      },
      {
        q: "What tax saving can I realistically expect?",
        a: "This is calculated case by case, but as a rule of thumb the tax saving should clearly outweigh setup and running costs - ideally by several multiples - before a full structure makes sense. We generally want to see savings large relative to roughly £6,000-£10,000 in setup costs and £5,000-£10,000/year in running costs before recommending one.",
      },
    ],
  },
  {
    category: "Process & Timeline",
    items: [
      {
        q: "How long does the whole setup process take?",
        a: "Company formation: 5-7 working days (remote, from KYC documents). Entry permit: ~5 working days. Residency visa (medical + biometrics): 5-7 working days, requiring physical presence in the UAE. Bank account opening: 7-10 working days after the Emirates ID is issued. Most clients are fully operational - company, visa, and bank account - within about 30 days.",
      },
      {
        q: "Do I need to travel to Dubai, or can this be done remotely?",
        a: "Company formation itself can be done fully remotely with passport/KYC documents. The residency visa requires an in-person visit for medical tests and biometrics - typically a 5-working-day trip. Around 95% of applicants complete this within the standard window.",
      },
      {
        q: "Once I have a UAE company, how much time do I need to spend there to keep it valid?",
        a: "For license validity alone, requirements are light - visiting roughly once every six months is generally enough to demonstrate ongoing control and management for HMRC purposes. This is a separate, lower bar than personal UAE tax residency, which requires 90 days a year physically present.",
      },
      {
        q: "What paperwork do you need from me to get started?",
        a: "Standard KYC: passport copy, date of birth, mother's maiden name, proposed company name, and business activity description. Cross-border structures involving a foreign entity may need additional document legalization, which can take about a month.",
      },
    ],
  },
  {
    category: "Banking",
    relatedService: { label: "Banking Solutions", href: "/banking" },
    items: [
      {
        q: "Will I have trouble opening a UAE bank account?",
        a: "It depends heavily on license type and residency status. Higher-risk categories - general trading licenses, gold/precious metals trading, or applicants without a resident Emirates ID - are more frequently declined over compliance concerns. Obtaining an Emirates ID first, or using alternative European e-money institutions that don't require UAE residency, are the standard fixes.",
      },
      {
        q: "Which banks do you work with, and why?",
        a: "It depends on the client's needs: Wio (UAE Central Bank-licensed, multi-currency, fast digital onboarding), Mashreq and RAK Bank (for trade licenses), Emirates NBD (for larger fixed deposits and Golden Visa routes), and international payment institutions for accounts with lower documentation requirements. For larger relationships we also have strong connections with FAB, HSBC, and Standard Chartered.",
      },
      {
        q: "Will HMRC automatically see my UAE bank account and balances?",
        a: "The UAE participates in Common Reporting Standard (CRS) automatic information exchange, meaning UAE financial institutions can report account information to HMRC for UK tax residents in the normal course of CRS reporting. For everyday spending, a UAE company debit card usable worldwide is generally simpler than routing company funds through a personal UK bank account, which can carry its own separate UK tax implications and is worth discussing with your accountant.",
      },
      {
        q: "Can I get a debit card I can use back home?",
        a: "Yes - company debit cards can be used for spending and cash withdrawals in the UK and worldwide, and in some cases a physical card can be delivered directly to you in the UK.",
      },
      {
        q: "What ongoing balance or fees does a UAE business account require?",
        a: "Typically either an average balance requirement (commonly around 50,000 AED) or a flat monthly fee (around 200 AED/month) if that balance isn't maintained.",
      },
    ],
  },
  {
    category: "Personal UK Tax Residency",
    items: [
      {
        q: "How many days can I spend in the UK before I'm still considered UK tax resident?",
        a: "Under the UK's Statutory Residence Test (SRT), we generally advise staying under 183 days in the UK per tax year, and ideally under 90 days to claim non-residence cleanly. Even under 183 days, factors like a UK family home or 30+ working days in the UK can trigger the SRT's \"sufficient ties\" test.",
      },
      {
        q: "How do I actually become a UAE tax resident, not just own a UAE company?",
        a: "You generally need a minimum of 90 days in the UAE within a 12-month period (not necessarily consecutive), a UAE residential address, and a company that's been operational for roughly 6 months with regular income - this qualifies you for a UAE Tax Residency Certificate, used to invoke the UK-UAE Double Tax Treaty.",
      },
      {
        q: "Do I need to formally notify HMRC that I've left the UK?",
        a: "Yes - filing Form P85 with HMRC on departure is the standard way to formally register non-residence.",
      },
      {
        q: "If I leave and come back within a few years, will HMRC tax me retroactively?",
        a: "Under the UK's temporary non-residence rules, returning to the UK within 5 years of leaving can make certain income or gains realized while \"non-resident\" taxable again retroactively - worth treating UAE relocation as a genuine multi-year commitment (3-5 years minimum), not a short-term move.",
      },
      {
        q: "Is there an \"exit tax\" if I leave the UK with property or business assets?",
        a: "An exit tax on assets has been discussed as a possible future UK policy but is not currently in force. It's worth factoring the risk into timing decisions.",
      },
    ],
  },
  {
    category: "Holding Companies, Foundations & Trusts",
    items: [
      {
        q: "What's the difference between a UAE foundation, a trust, and a holding company?",
        a: "A holding company owns shares in operating entities and suits tax-efficient dividend flows and share exchanges. A UAE foundation is a separate legal person with no individual \"owner\" - governed by bylaws with directors and beneficiaries - making it well suited to asset protection, privacy, and succession/inheritance planning. A trust serves a similar succession purpose and can hold property or investments, sometimes layered on top of a foundation or company.",
      },
      {
        q: "Why would I want a foundation instead of just owning the company myself?",
        a: "Two main reasons: succession and inheritance planning - assets held via a UAE foundation rather than personally can pass to heirs according to the foundation's bylaws, which can be structured to manage UK inheritance tax exposure within the law - and asset structuring, since a foundation is a separate legal person that can hold and govern assets independently of any one individual. As with any cross-border structure, the tax and legal treatment depends on individual circumstances and should be confirmed with a qualified adviser.",
      },
      {
        q: "What does a foundation cost, and is it worth it for future or uncertain income?",
        a: "Roughly £5,000/year to establish and maintain. It's often worth setting up ahead of an income event - for example before a property starts generating rental income - rather than as an immediate fix; the annual cost is typically recovered several times over once income begins.",
      },
      {
        q: "Can a UAE holding company own my existing UK company without triggering UK capital gains tax?",
        a: "Yes, via a share-for-share exchange - moving shares of the UK company into a new holding structure without a taxable disposal event. This avoids CGT at the point of exchange, though your own ongoing UK tax residency remains a separate question that still needs addressing.",
      },
    ],
  },
  {
    category: "UAE Corporate Tax & Small Business Relief",
    relatedService: { label: "Accounting Service", href: "/bookkeeping-accounting" },
    items: [
      {
        q: "How much can my UAE company earn before paying any tax?",
        a: "Under the UAE's Small Business Relief, revenue up to a threshold is taxed at 0% for a limited window. The exact figure is quoted differently depending on jurisdiction and currency - commonly cited around £600,000 / $600,000-800,000 / €700,000-800,000 / AED 3,000,000 - so always confirm the current threshold and expiry date directly rather than relying on one figure. Above the threshold (or once it lapses), profit is taxed at 9%, though the first $100,000 of net profit is always tax-free regardless.",
      },
      {
        q: "Are there capital gains or dividend taxes in the UAE?",
        a: "No - the UAE has no capital gains tax and no dividend tax, which is a significant advantage for anyone planning to eventually sell a business or extract accumulated profit.",
      },
      {
        q: "What is the 0% corporate tax option for intellectual property income?",
        a: "A UAE incentive for qualifying IP income (software, trademarks, and similar) can achieve 0% corporation tax, but only with genuine local development activity and UAE-based employees - it generally only makes sense for businesses with meaningful IP value and the resources to meet the substance requirements.",
      },
      {
        q: "Will invoicing my UK company to a UAE entity reduce my UK corporation tax bill?",
        a: "Yes, in principle, via legitimate intercompany service charges - marketing, management, IP licensing - but these must reflect real services at a commercially reasonable, arm's-length rate. A benchmark of roughly 7-10% is commonly used as a guideline for intercompany fees and loan interest.",
      },
    ],
  },
  {
    category: "Golden Visa & Investment Residency",
    relatedService: { label: "Real Estate", href: "/real-estate" },
    items: [
      {
        q: "What do I need to qualify for a UAE Golden Visa?",
        a: "The standard route is a minimum AED 2,000,000 investment in UAE real estate (or an equivalent bank deposit/investment route), held for a minimum of 3 years. This grants a 10-year renewable residency and allows sponsoring family members.",
      },
      {
        q: "What's the minimum time I need to spend in the UAE to keep a Golden Visa valid?",
        a: "There's no strict minimum-stay requirement - visiting roughly once every 10 years is generally sufficient to maintain the visa itself. This is separate from what's required to maintain UAE tax residency, which does require the 90-day rule.",
      },
    ],
  },
  {
    category: "Industry-Specific Notes",
    items: [
      {
        q: "I own UK rental property personally - can a UAE structure reduce my tax?",
        a: "Two separate levers apply: moving UK property into a UK limited company (a distinct exercise with its own UK tax/SDLT considerations, best handled with a UK accountant), versus the property owner personally becoming non-UK tax resident, which can allow rental profit to be drawn more tax-efficiently. Depending on portfolio size, the second route has been estimated to save well into five figures per year.",
      },
      {
        q: "Can my e-commerce brand's profits sit in a UAE entity while I keep selling into the UK?",
        a: "Yes - a common structure has a UAE entity act as the wholesale/purchasing hub while a UK entity continues local retail sales, using transfer pricing to shift margin to the UAE side. Pre-revenue or very early-stage e-commerce businesses often shouldn't set this up yet - it's usually better to wait until there's real tax liability to offset the setup cost against.",
      },
      {
        q: "I'm a healthcare professional - can I run an online consultancy from the UAE?",
        a: "This is one of the more constrained categories. UAE-regulated healthcare practice generally requires practicing under a licensed clinic rather than independently; independent practice requires passing UAE licensing exams and meaningful setup capital. Platforms that facilitate bookings or payments between patients and doctors, without delivering care directly, are structured differently - as software/marketing facilitation companies rather than clinics.",
      },
      {
        q: "Can I trade crypto or forex through a UAE company tax-free?",
        a: "Broadly yes for the entity's profits, subject to the standard 0%/9% thresholds - but opening a crypto-friendly bank account is genuinely harder, and license activity descriptions need to precisely match the actual investment-advisory or brokerage work for bank compliance checks.",
      },
      {
        q: "As a content creator, can I move brand-deal income into a UAE structure while still working with UK brands?",
        a: "Yes, in principle - a UAE entity can receive the majority of brand-deal income while the creator takes a smaller portion for UK living expenses, provided there's a genuine separation from day-to-day control of the income-generating entity. This works best paired with an actual relocation plan, not as a pure paperwork exercise.",
      },
      {
        q: "I trade physical goods internationally - what license do I need?",
        a: "It depends on the goods' risk profile. Substantial international trading can use a designated zone license for 0% corporation tax, while gold and precious metals trading is treated as high-risk and generally requires a mainland or DMCC free zone license, a security agency contract for physical transport, and demonstrable experience (5+ years is a common bank requirement) before banks will onboard the account.",
      },
    ],
  },
  {
    category: "VAT",
    relatedService: { label: "Accounting Service", href: "/bookkeeping-accounting" },
    items: [
      {
        q: "Can moving my UK service business to a UAE entity reduce my VAT bill?",
        a: "Sometimes, but it depends on where the service is actually delivered or consumed. Services genuinely exported from the UAE - outsourced back-office work, for example - generally don't carry UK VAT, while UK-delivered local services still do, regardless of who owns the entity. This is an area that needs specialist VAT input alongside any UAE structuring.",
      },
    ],
  },
  {
    category: "When It's Not Worth It",
    items: [
      {
        q: "When would you actually advise against setting up a UAE structure?",
        a: "When the current UK tax burden is already reasonably well-optimized relative to setup and running costs, when the business is pre-revenue or too early to justify locking in setup costs, or when projected turnover is too small to move the needle. In those cases, the honest advice is to revisit once the business scales, or to consider UAE investment opportunities - real estate, deposits - rather than a full operating company in the meantime.",
      },
    ],
  },
];

const FAQ_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQ.flatMap((cat) =>
    cat.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    }))
  ),
};

export default function FaqPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([FAQ_JSON_LD, breadcrumbSchema("FAQ", "faq")]),
        }}
      />
      <Navbar />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "FAQ", href: "/faq" },
        ]}
      />
      <main>
        <GradientHero
          title="Frequently Asked Questions"
          subtitle="Straight answers on UAE company formation, tax structuring, banking, residency, and compliance - no sales pitch, and we'll tell you when it isn't worth it."
        />

        <Section bg="canvas">
          <div className="col-span-12 mx-auto max-w-3xl space-y-16">
            {FAQ.map((cat) => (
              <div key={cat.category}>
                <Eyebrow>{cat.category}</Eyebrow>
                <h2 className="font-display mt-4 text-[26px] leading-tight tracking-[-0.02em] text-as-ink sm:text-[32px]">
                  {cat.category}
                </h2>
                {cat.relatedService && (
                  <Link
                    href={cat.relatedService.href}
                    className="mt-3 flex w-fit items-center gap-1.5 font-mono text-xs uppercase tracking-[0.15em] text-as-muted transition-colors hover:text-as-red"
                  >
                    Related: {cat.relatedService.label} →
                  </Link>
                )}
                <div className="mt-6 divide-y divide-as-line border-t border-as-line">
                  {cat.items.map((item) => (
                    <details key={item.q} className="group py-5">
                      <summary className="flex cursor-pointer list-none items-start justify-between gap-4 text-[16px] font-medium text-as-ink marker:content-none">
                        <span>{item.q}</span>
                        <span
                          aria-hidden="true"
                          className="mt-0.5 shrink-0 text-as-muted transition-transform duration-200 group-open:rotate-45"
                        >
                          +
                        </span>
                      </summary>
                      <p className="mt-3 text-[15px] leading-relaxed text-as-muted">
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            ))}

            <p className="text-[13px] leading-relaxed text-as-muted">
              The information on this page is general in nature and provided
              for informational purposes only. It does not constitute
              regulated tax, legal, immigration, or financial advice, and it
              is not a substitute for advice tailored to your individual
              circumstances. Figures, thresholds, and requirements referenced
              above are illustrative, change over time, and vary by
              jurisdiction, currency, and personal situation. Tax residency,
              corporate structuring, and cross-border compliance carry real
              legal and financial consequences if applied incorrectly - before
              making any decisions or taking any action, consult a qualified,
              independently regulated tax adviser, accountant, or lawyer in
              the relevant jurisdiction(s), including a UK tax professional
              for UK tax matters. Nothing on this page should be relied on as
              a recommendation to adopt any particular structure.
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
