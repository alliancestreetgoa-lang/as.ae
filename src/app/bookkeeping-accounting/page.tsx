import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { GradientHero } from "@/components/GradientHero";
import { AsSeenIn } from "@/components/AsSeenIn";
import { Stats3 } from "@/components/Stats3";
import { Solutions } from "@/components/Solutions";
import { StatsBanner } from "@/components/StatsBanner";
import { Testimonials } from "@/components/Testimonials";
import { Collaborate } from "@/components/Collaborate";
import { Footer } from "@/components/Footer";
import { Check } from "@/components/icons";

export const metadata: Metadata = {
  title: "Bookkeeping & Accounting Services in Dubai | Alliance Street",
  description:
    "Bookkeeping, accounting & VAT services in Dubai. We take care of your finances so you can focus on scaling your business - compliant and audit-ready, always.",
};

const CHECKLIST = [
  { label: "Spotless Bookkeeping:", rest: "All transactions tracked, no loose ends" },
  { label: "Clear Financial Reports:", rest: "0% jargon, 100% Your Language" },
  { label: "Smart Tax Planning:", rest: "Maximized savings, fully compliant" },
  { label: "Payroll, Perfected:", rest: "Accurate + timely payouts = happy staff" },
  { label: "Audit-Ready, Always:", rest: "Stay prepared, no last-minute rushing" },
];

const STATS = [
  { value: "200+", label: "Businesses in Service" },
  { value: "20+", label: "Tax Lawyers & Strategists" },
  { value: "17+", label: "Years Experience" },
];

export default function BookkeepingAccountingPage() {
  return (
    <>
      <Navbar />
      <main>
        <GradientHero
          title="Bookkeeping, Accounting & VAT Services in Dubai"
          subtitle="At Alliance Street Consultancy, we take care of your finances so you can focus on scaling your business."
        />

        <AsSeenIn />

        {/* Statement */}
        <section className="bg-white py-24">
          <div className="as-container">
            <h2 className="mx-auto max-w-4xl text-center text-[32px] leading-[1.15] tracking-[-0.03em] sm:text-[46px]">
              <span className="text-black">We actually understand your business...</span>{" "}
              <span className="text-as-muted">
                that&apos;s why we customize every service.
              </span>
            </h2>
          </div>
        </section>

        <Stats3 stats={STATS} />

        {/* Why choose us */}
        <section className="bg-as-light py-24">
          <div className="as-container grid gap-12 lg:grid-cols-2 lg:gap-20">
            <div>
              <p className="as-eyebrow mb-6">
                WHY <span className="accent">CHOOSE US</span>
              </p>
              <h2 className="mb-6 text-[34px] leading-[1.1] sm:text-[44px]">How we can help</h2>
              <h3 className="mb-4 text-2xl font-semibold text-black">
                Efficiency Meets Expertise
              </h3>
              <p className="max-w-md text-[15px] leading-relaxed text-as-muted">
                We don&apos;t just balance books; we streamline your entire financial
                process. Reach out today, and let&apos;s keep your business running
                compliant and ready for what&apos;s next.
              </p>
            </div>

            <div className="flex flex-col justify-center">
              <ul className="space-y-5">
                {CHECKLIST.map((c) => (
                  <li key={c.label} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-5 w-5 shrink-0 text-as-red" />
                    <span className="text-[15px] text-black">
                      <span className="font-semibold">{c.label}</span> {c.rest}
                    </span>
                  </li>
                ))}
              </ul>
              <Link href="/contact-us" className="as-btn-dark mt-10 w-fit">
                Get in Touch
              </Link>
            </div>
          </div>
        </section>

        <Solutions />
        <StatsBanner />
        <Testimonials />
        <Collaborate />
        <AsSeenIn />
      </main>
      <Footer />
    </>
  );
}
