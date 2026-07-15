import Image from "next/image";
import { Button } from "@/components/primitives/Button";
import { Frame } from "@/components/primitives/Frame";
import { Reveal } from "@/components/motion/Reveal";
import { SplitReveal } from "@/components/motion/SplitReveal";
import { Parallax } from "@/components/motion/Parallax";
import type { AnalyticsEvent } from "@/lib/analytics";

/**
 * ImageHero — full-bleed image hero with dark overlay and left-aligned title
 * (banking/services pages). The hand-rolled single corner-bracket `<span>`
 * is replaced by the shared `Frame` primitive (tone="red") wrapping the
 * whole copy block, matching how `Hero.tsx` frames its content on the same
 * dark canvas. Headline moves to Fraunces; CTA moves to the brand's red pill.
 */
export function ImageHero({
  title,
  subtitle,
  image,
  cta = "Get started",
  ctaHref = "/contact-us",
  ctaTrack,
}: {
  title: string;
  subtitle: string;
  image: string;
  cta?: string;
  ctaHref?: string;
  /** Overrides the default `consultation_cta_click` event fired by this
   *  hero's CTA. Optional — most callers can rely on the default below. */
  ctaTrack?: AnalyticsEvent;
}) {
  const track: AnalyticsEvent = ctaTrack ?? {
    name: "consultation_cta_click",
    params: { cta_label: cta, location: "image_hero" },
  };
  return (
    <section className="relative isolate overflow-hidden bg-as-ink pt-[82px]">
      <Parallax className="absolute inset-0" amount={120}>
        <Image
          src={image}
          alt=""
          fill
          priority
          className="object-cover object-center animate-[as-hero-zoom_1.8s_ease-out_both] motion-reduce:animate-none"
        />
      </Parallax>
      <div className="absolute inset-0 bg-gradient-to-r from-as-ink/90 via-as-ink/60 to-as-ink/20" />

      <div className="as-container relative z-10 flex min-h-[80vh] flex-col justify-center py-24">
        <Frame tone="red" className="max-w-3xl">
          <SplitReveal
            as="h1"
            text={title}
            stagger={0.05}
            className="font-display text-[42px] leading-[1.05] tracking-[-0.04em] text-white sm:text-[56px] lg:text-[68px]"
          />
          <Reveal
            as="p"
            y={22}
            delay={0.1}
            className="mt-8 max-w-xl text-lg leading-relaxed text-white/70"
          >
            {subtitle}
          </Reveal>
          <Reveal as="div" y={18} delay={0.2} className="mt-10 w-fit">
            <Button href={ctaHref} variant="primary" track={track}>
              {cta}
            </Button>
          </Reveal>
        </Frame>
      </div>
    </section>
  );
}
