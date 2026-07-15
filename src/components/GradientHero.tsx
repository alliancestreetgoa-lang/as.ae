import { Button } from "@/components/primitives/Button";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import type { AnalyticsEvent } from "@/lib/analytics";

/**
 * GradientHero — centered hero over the black -> red -> white brand gradient
 * (accounting/services/contact pages). This *is* the "hero gradient moment"
 * the design system's red-accent-only rule carves out an exception for
 * (`.as-hero-gradient`, unchanged), so the background stays as-is; only the
 * headline moves to Fraunces, the CTA moves to the brand's `as-ink` pill
 * (hover `as-red`, same shape used across the redesigned homepage sections),
 * and the load-in gets the same staggered `Reveal` treatment as the other
 * heroes.
 */
export function GradientHero({
  title,
  subtitle,
  cta = "Let's talk",
  ctaHref = "/contact-us",
  ctaTrack,
}: {
  title: string;
  subtitle: string;
  cta?: string;
  ctaHref?: string;
  /** Overrides the default `consultation_cta_click` event fired by this
   *  hero's CTA. Optional — most callers can rely on the default below. */
  ctaTrack?: AnalyticsEvent;
}) {
  const track: AnalyticsEvent = ctaTrack ?? {
    name: "consultation_cta_click",
    params: { cta_label: cta, location: "gradient_hero" },
  };
  return (
    <section className="bg-as-canvas pt-[82px]">
      <div className="as-container flex min-h-[78vh] flex-col items-center justify-center py-24 text-center">
        <SplitReveal
          as="h1"
          text={title}
          stagger={0.05}
          className="font-display max-w-4xl text-[40px] leading-[1.08] tracking-[-0.04em] text-as-ink sm:text-[56px] lg:text-[64px]"
        />
        <Reveal
          as="p"
          y={22}
          delay={0.1}
          className="mt-8 max-w-xl text-lg leading-relaxed text-as-ink/70"
        >
          {subtitle}
        </Reveal>
        <Reveal as="div" y={18} delay={0.2} className="mt-10">
          <Button href={ctaHref} variant="ink" track={track}>
            {cta}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
