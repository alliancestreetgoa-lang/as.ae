"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Check } from "@/components/icons";
import { Eyebrow } from "@/components/primitives/Eyebrow";
import { Frame } from "@/components/primitives/Frame";
import { Section } from "@/components/primitives/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Counter } from "@/components/motion/Counter";
import { usePinnedStepper } from "@/components/motion/usePinnedStepper";
import { PROCESS_TABS, PROCESS_STATS } from "@/lib/content";
import { cn } from "@/lib/utils";

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

const STEPS = PANELS.length;

/**
 * Process ("The Battleplan") — the site's most motion-complex section: a
 * pinned, scroll-driven sequence through the four engagement steps
 * (Strategy & Business Setup / Next Step, Global Citizen /
 * Vitamin C(onnections) / Peace of Mind — content unchanged from the
 * original click-driven version).
 *
 * 21st.dev was checked first for a ready-made pinned-steps pattern:
 * "pinned scroll steps sticky sequence gsap" -> Story scroll
 * (boudjadjasamira, id 12461, GSAP+ScrollTrigger but pins a stack of
 * *separate* full sections rather than stepping through panels inside one
 * pinned stage), Explorations with GSAP and Scroll Trigger (filipz, id
 * 4755, a Three.js shader cube, not a layout pattern), Sticky Scroll
 * (ui-layouts, id 2837, a Lenis-smooth-scroll image gallery); "scroll
 * timeline steps" -> Process Timeline (YoucefBnm, id 1943, closest in
 * intent but built on framer-motion's `useScroll`/`useTransform`, which
 * this codebase explicitly avoids). None fit the "one pinned stage,
 * stepped content" shape needed here, so the pin itself is hand-built with
 * GSAP ScrollTrigger; only the general "pin + scrub progress drives
 * content" idea carries over from Story scroll / Process Timeline.
 *
 * Motion (non-reduced-motion branch only):
 * - `stageRef` is pinned via `ScrollTrigger.create({ pin: true, scrub })`
 *   for a scroll distance of `STEPS * 100vh`. `onUpdate` buckets the
 *   scrubbed `self.progress` into a step index (0..STEPS-1) and only calls
 *   `setActive` when the bucket actually changes, so React re-renders once
 *   per step instead of every scrub frame. A separate imperative write to
 *   `progressRef` (no re-render) drives a hairline progress bar.
 * - A second `useGSAP` cross-fades the panel card whenever `active`
 *   changes, giving the step transition some motion beyond the instant
 *   content swap.
 * - `pinSpacing` is left at its GSAP default (true): ScrollTrigger inserts
 *   its own spacer for the pin duration, so no extra height/margin is
 *   added by hand — avoiding double-reserved scroll space that would
 *   shove the following section down twice.
 *
 * Reduced motion / no-JS fallback (REQUIRED, and also the SSR/first-paint
 * default — see `reduced` via `useSyncExternalStore` below): renders the
 * original click-driven tab set (`PROCESS_TABS` buttons + a static panel),
 * restyled to the design system. Nothing is pinned, no ScrollTrigger is
 * created, and scroll behaves natively — every step is reachable by
 * clicking its tab. `getReducedMotionServerSnapshot` always returns `true`,
 * so both the server render and the very first client paint use this
 * fallback; `useSyncExternalStore` then syncs to the real OS preference
 * right after mount (and live, on OS-setting changes) without a manual
 * setState-in-effect. Because of this, the
 * server-rendered HTML and the first client paint always agree on the
 * accessible tab markup: a `prefers-reduced-motion` user (or anyone
 * without JS) never sees the pinned stage at all, and the pin logic itself
 * only ever runs inside the `motionEnabled` branch.
 */
export function Process() {
  const panelRef = useRef<HTMLDivElement>(null);
  const { sectionRef, stageRef, progressRef, active, setActive, motionEnabled } =
    usePinnedStepper(STEPS);

  // Cross-fade the panel card on every step change (pinned mode only).
  useGSAP(
    () => {
      if (!motionEnabled || !panelRef.current) return;
      gsap.fromTo(
        panelRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
      );
    },
    { scope: sectionRef, dependencies: [active, motionEnabled] }
  );

  const panel = PANELS[active];

  return (
    <Section id="process" bg="canvas">
      <div ref={sectionRef} className="col-span-12">
        <Reveal as="div" y={28}>
          <Eyebrow>Our Process</Eyebrow>
          <h2 className="font-display mt-6 max-w-2xl text-[32px] leading-[1.1] tracking-[-0.03em] text-as-ink sm:text-[44px]">
            The Battleplan
          </h2>
        </Reveal>

        {motionEnabled ? (
          <div ref={stageRef} className="relative mt-14 flex min-h-screen items-center">
            <div className="w-full">
              {/* Step rail: 01–04, active in red, plus a scrub-driven progress line. */}
              <div className="mb-8 flex items-center gap-5">
                {PANELS.map((p, i) => (
                  <span
                    key={p.heading}
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

              <div
                ref={panelRef}
                className="grid items-stretch gap-8 rounded-[24px] border border-as-line bg-as-canvas p-8 lg:grid-cols-2 lg:p-10"
              >
                <div className="flex flex-col justify-center">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-as-red">
                    Step 0{active + 1} / 0{STEPS}
                  </p>
                  <h3 className="font-display mt-4 text-3xl text-as-ink sm:text-4xl">
                    {panel.heading}
                  </h3>
                  <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-as-muted">
                    {panel.body}
                  </p>
                  <ul className="mt-8 space-y-4">
                    {panel.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-3">
                        <Check className="h-5 w-5 shrink-0 text-as-red" />
                        <span className="font-semibold text-as-ink">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Frame tone="red" className="min-h-[300px]">
                  <div className="relative h-[260px] w-full overflow-hidden rounded-[18px] sm:h-[320px] lg:h-full">
                    <Image
                      src={panel.image}
                      alt={panel.heading}
                      fill
                      sizes="(min-width: 1024px) 480px, 100vw"
                      className="object-cover"
                    />
                  </div>
                </Frame>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-14">
            {/* Accessible fallback: click-driven tabs, no pin, no scroll-jacking. */}
            <div className="mb-8 flex flex-wrap gap-3">
              {PROCESS_TABS.map((tab, i) => (
                <button
                  key={tab}
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
                  {tab}
                </button>
              ))}
            </div>

            <div className="grid items-stretch gap-8 rounded-[24px] border border-as-line bg-as-canvas p-8 lg:grid-cols-2 lg:p-10">
              <div className="flex flex-col justify-center">
                <p className="font-mono text-xs uppercase tracking-[0.2em] text-as-red">
                  Step 0{active + 1} / 0{STEPS}
                </p>
                <h3 className="font-display mt-4 text-3xl text-as-ink sm:text-4xl">
                  {panel.heading}
                </h3>
                <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-as-muted">
                  {panel.body}
                </p>
                <ul className="mt-8 space-y-4">
                  {panel.bullets.map((b) => (
                    <li key={b} className="flex items-center gap-3">
                      <Check className="h-5 w-5 shrink-0 text-as-red" />
                      <span className="font-semibold text-as-ink">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative min-h-[300px] overflow-hidden rounded-[18px] border border-as-line">
                <Image
                  src={panel.image}
                  alt={panel.heading}
                  fill
                  sizes="(min-width: 1024px) 480px, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        )}

        {/* Stats row — unchanged content, present in both branches. */}
        <div className="mt-16 grid gap-10 sm:grid-cols-3">
          {PROCESS_STATS.map((s) => {
            const numeric = parseInt(s.value.replace(/\D/g, ""), 10);
            return (
              <div key={s.label}>
                <p className="font-display text-[56px] leading-none tracking-[-0.03em] text-as-ink sm:text-[72px]">
                  <Counter to={numeric} suffix="+" />
                </p>
                <p className="mt-3 text-lg text-as-muted">{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
