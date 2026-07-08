"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Frame } from "@/components/primitives/Frame";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/motion/Reveal";
import { usePinnedStepper } from "@/components/motion/usePinnedStepper";
import { cn } from "@/lib/utils";

export interface Step {
  tab: string;
  heading: string;
  body: string;
  image?: string;
}

/**
 * StepsSection — process/steps section ("Done in 4 Strategic Steps"). Two
 * variants share one panel card:
 *
 * - Default (`pinned` = false): a click-driven tab set — the accessible,
 *   always-available variant used by most sub-pages.
 * - `pinned` = true: the homepage Process section's scroll-driven "pinned
 *   steps" style (numbered 01…0N rail + scrub progress line, panels advancing
 *   as you scroll). Under `prefers-reduced-motion` / no-JS it degrades to the
 *   exact same click-tab set, so no content is ever pinned or scroll-jacked
 *   for those users. The pin/scrub/reduced-motion machinery lives in
 *   `usePinnedStepper`, shared with `Process`.
 *
 * The step image sits inside the shared `Frame` (red corner brackets).
 */
export function StepsSection({
  eyebrow,
  title,
  steps,
  cta = "Get started",
  pinned = false,
}: {
  eyebrow: string;
  title: string;
  steps: Step[];
  cta?: string;
  pinned?: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const { sectionRef, stageRef, progressRef, active, setActive, pinnedActive } =
    usePinnedStepper(steps.length, pinned);

  // Cross-fade the panel card on every step change (pinned mode only).
  useGSAP(
    () => {
      if (!pinnedActive || !panelRef.current) return;
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
      );
    },
    { scope: sectionRef, dependencies: [active, pinnedActive] }
  );

  const step = steps[active];

  const panelCard = (
    <div
      ref={pinnedActive ? panelRef : undefined}
      className={cn(
        "grid items-stretch gap-8 rounded-[24px] border border-as-line bg-as-canvas p-8 lg:p-10",
        step.image && "lg:grid-cols-2"
      )}
    >
      <div className="flex flex-col justify-center">
        {pinned && (
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-as-red">
            Step 0{active + 1} / 0{steps.length}
          </p>
        )}
        <h3
          className={cn(
            "font-display text-3xl text-as-ink sm:text-4xl",
            pinned && "mt-4"
          )}
        >
          {step.heading}
        </h3>
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
  );

  return (
    <Section bg="canvas">
      <div ref={sectionRef} className="col-span-12">
        <Reveal as="div" y={28}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 className="font-display mt-6 max-w-2xl text-[32px] leading-[1.1] tracking-[-0.03em] text-as-ink sm:text-[44px]">
            {title}
          </h2>
        </Reveal>

        {pinnedActive ? (
          // Pinned scroll stage: the section pins while the numbered steps
          // advance with scroll (mirrors the homepage Process section).
          <div ref={stageRef} className="relative mt-14 flex min-h-screen items-center">
            <div className="w-full">
              <div className="mb-8 flex items-center gap-5">
                {steps.map((s, i) => (
                  <span
                    key={s.tab}
                    className={cn(
                      "font-mono text-xs tracking-[0.2em] transition-colors",
                      i === active ? "text-as-red" : "text-as-muted/50"
                    )}
                  >
                    0{i + 1}
                  </span>
                ))}
                <div className="relative ml-2 h-px max-w-[200px] flex-1 bg-as-line">
                  <div
                    ref={progressRef}
                    className="absolute inset-y-0 left-0 w-0 bg-as-red"
                  />
                </div>
              </div>
              {panelCard}
            </div>
          </div>
        ) : (
          // Accessible fallback (and the default for non-pinned pages):
          // click-driven tabs, no pin, no scroll-jacking.
          <div className="mt-10">
            <div className="mb-8 flex flex-wrap gap-3">
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
            {panelCard}
          </div>
        )}
      </div>
    </Section>
  );
}
