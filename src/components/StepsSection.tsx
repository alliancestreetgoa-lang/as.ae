"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Frame } from "@/components/primitives/Frame";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/motion/Reveal";
import { cn } from "@/lib/utils";

export interface Step {
  tab: string;
  heading: string;
  body: string;
  image?: string;
}

/**
 * StepsSection — tabbed process section ("Go Global in 4 Steps"). Re-themed
 * onto the shared `Section`/`Eyebrow`/`Reveal` primitives; the tab pill and
 * card treatment now mirror the reduced-motion fallback of `Process.tsx`
 * (`bg-as-ink` active tab, hairline `border-as-line` inactive) so this
 * click-driven variant reads as the same component family as the homepage's
 * pinned-scroll steps. The step image sits inside the shared `Frame` (red
 * corner brackets) instead of a plain rounded box.
 */
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
    <Section bg="canvas">
      <Reveal as="div" y={28} className="col-span-12">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h2 className="font-display mt-6 max-w-2xl text-[32px] leading-[1.1] tracking-[-0.03em] text-as-ink sm:text-[44px]">
          {title}
        </h2>
      </Reveal>

      <div className="col-span-12 mt-10 flex flex-wrap gap-3">
        {steps.map((s, i) => (
          <button
            key={s.tab}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className={cn(
              "rounded-full px-5 py-2.5 font-sans text-[15px] font-medium transition-colors",
              i === active
                ? "bg-as-ink text-white"
                : "border border-as-line text-as-muted hover:border-as-red/50 hover:text-as-ink"
            )}
          >
            {s.tab}
          </button>
        ))}
      </div>

      <div
        className={cn(
          "col-span-12 mt-8 grid items-stretch gap-8 rounded-[24px] border border-as-line bg-as-canvas p-8 lg:p-10",
          step.image && "lg:grid-cols-2"
        )}
      >
        <div className="flex flex-col justify-center">
          <h3 className="font-display text-3xl text-as-ink sm:text-4xl">{step.heading}</h3>
          <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-as-muted">
            {step.body}
          </p>
          <Link
            href="/contact-us"
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-as-ink px-7 py-3.5 font-sans text-[15px] font-semibold text-white transition-colors hover:bg-as-red"
          >
            {cta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        {step.image && (
          <Frame tone="red" className="min-h-[320px]">
            <div className="relative h-[280px] w-full overflow-hidden rounded-[18px] lg:h-full">
              <Image src={step.image} alt={step.heading} fill className="object-cover" />
            </div>
          </Frame>
        )}
      </div>
    </Section>
  );
}
