"use client";

import { useState } from "react";
import Image from "next/image";
import { Check } from "@/components/icons";
import { PROCESS_TABS, PROCESS_STATS } from "@/lib/content";

interface Panel {
  heading: string;
  body: string;
  bullets: string[];
  image: string;
}

const PANELS: Panel[] = [
  {
    heading: "Strategy & Business Setup",
    body: "Setting up a new business in Dubai can be complex, especially for international entrepreneurs. We manage the entire process by handling all the necessary paperwork ensuring you get approved for your business license/s for your Dubai company - all from the comfort of your home.",
    bullets: ["Strategic Planning", "Expert Legal Counsel", "Streamlined Process"],
    image: "/images/strategy.jpg",
  },
  {
    heading: "Next Step, Global Citizen",
    body: "We secure residency visas for you, your family and your team - handling medical tests, Emirates ID and every government touchpoint so your relocation to the UAE is seamless and fully compliant.",
    bullets: ["Investor & Partner Visas", "Family Sponsorship", "End-to-End Processing"],
    image: "/images/businesswoman.jpg",
  },
  {
    heading: "Vitamin C(onnections)",
    body: "Leveraging our strong network connections we guarantee bank account openings at prestigious banks and financial institutions of your choice - both corporate and private - in a matter of hours or days.",
    bullets: ["Prestigious Banking Partners", "Corporate & Private Accounts", "Rapid Onboarding"],
    image: "/images/bank.jpg",
  },
  {
    heading: "Peace of Mind",
    body: "To ensure accuracy and compliance, we provide comprehensive financial services, including bookkeeping, financial reporting, tax planning, auditing, and payroll management - keeping your structure clean, legal and optimised.",
    bullets: ["Corporate Tax Planning", "Audit & Reporting", "Ongoing Compliance"],
    image: "/images/compliance.jpg",
  },
];

export function Process() {
  const [active, setActive] = useState(0);
  const panel = PANELS[active];

  return (
    <section className="bg-as-light py-24">
      <div className="as-container">
        <p className="as-eyebrow mb-6">
          OUR <span className="accent">PROCESS</span>
        </p>
        <h2 className="mb-10 text-[40px] leading-[1.05] sm:text-[56px]">
          The Battleplan
        </h2>

        {/* Tabs */}
        <div className="mb-8 flex flex-wrap gap-3">
          {PROCESS_TABS.map((tab, i) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActive(i)}
              className={
                "rounded-full px-5 py-2.5 text-[15px] font-medium transition-colors " +
                (i === active
                  ? "bg-black text-white"
                  : "border border-black/15 text-black/70 hover:border-black/40")
              }
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Panel */}
        <div className="grid items-stretch gap-8 rounded-[24px] bg-white p-8 shadow-[0_2px_30px_rgba(0,0,0,0.05)] lg:grid-cols-2 lg:p-10">
          <div className="flex flex-col justify-center">
            <h3 className="mb-5 text-3xl font-semibold text-black">{panel.heading}</h3>
            <p className="mb-8 max-w-lg text-[15px] leading-relaxed text-as-muted">
              {panel.body}
            </p>
            <ul className="space-y-4">
              {panel.bullets.map((b) => (
                <li key={b} className="flex items-center gap-3">
                  <Check className="h-5 w-5 shrink-0 text-as-red" />
                  <span className="font-semibold text-black">{b}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative min-h-[300px] overflow-hidden rounded-[18px]">
            <Image
              src={panel.image}
              alt={panel.heading}
              fill
              className="object-cover"
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid gap-10 sm:grid-cols-3">
          {PROCESS_STATS.map((s) => (
            <div key={s.label}>
              <p className="text-[76px] font-semibold leading-none tracking-[-0.04em] text-black">
                {s.value.replace("+", "")}
                <span className="text-as-red">+</span>
              </p>
              <p className="mt-3 text-lg text-as-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
