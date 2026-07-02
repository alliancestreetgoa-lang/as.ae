"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";

export interface Step {
  tab: string;
  heading: string;
  body: string;
  image?: string;
}

/** Tabbed process section ("Go Global in 4 Steps"). */
export function StepsSection({
  eyebrow,
  title,
  steps,
  cta = "Get started",
}: {
  eyebrow: string;
  title: string;
  steps: Step[];
  cta?: string;
}) {
  const [active, setActive] = useState(0);
  const step = steps[active];

  return (
    <section className="bg-as-light py-24">
      <div className="as-container">
        <p className="as-eyebrow mb-6">{eyebrow}</p>
        <h2 className="mb-10 text-[40px] leading-[1.05] sm:text-[56px]">{title}</h2>

        <div className="mb-8 flex flex-wrap gap-3">
          {steps.map((s, i) => (
            <button
              key={s.tab}
              type="button"
              onClick={() => setActive(i)}
              className={
                "rounded-full px-5 py-2.5 text-[15px] font-medium transition-colors " +
                (i === active
                  ? "bg-black text-white"
                  : "border border-black/15 text-black/70 hover:border-black/40")
              }
            >
              {s.tab}
            </button>
          ))}
        </div>

        <div
          className={
            "grid items-stretch gap-8 rounded-[24px] bg-white p-8 shadow-[0_2px_30px_rgba(0,0,0,0.05)] lg:p-10 " +
            (step.image ? "lg:grid-cols-2" : "")
          }
        >
          <div className="flex flex-col justify-center">
            <h3 className="mb-5 text-3xl font-semibold text-black">{step.heading}</h3>
            <p className="mb-8 max-w-lg text-[15px] leading-relaxed text-as-muted">
              {step.body}
            </p>
            <Link href="/contact-us" className="as-btn-dark w-fit">
              {cta}
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
          {step.image && (
            <div className="relative min-h-[320px] overflow-hidden rounded-[18px]">
              <Image src={step.image} alt={step.heading} fill className="object-cover" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
