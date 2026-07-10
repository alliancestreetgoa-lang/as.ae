import { Button } from "@/components/primitives/Button";
import { Reveal } from "@/components/motion/Reveal";

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
}: {
  title: string;
  subtitle: string;
  cta?: string;
  ctaHref?: string;
}) {
  return (
    <section className="as-hero-gradient pt-[82px]">
      <div className="as-container flex min-h-[78vh] flex-col items-center justify-center py-24 text-center">
        <Reveal
          as="h1"
          y={28}
          className="font-display max-w-4xl text-[40px] leading-[1.08] tracking-[-0.04em] text-as-ink sm:text-[56px] lg:text-[64px]"
        >
          {title}
        </Reveal>
        <Reveal
          as="p"
          y={22}
          delay={0.1}
          className="mt-8 max-w-xl text-lg leading-relaxed text-as-ink/70"
        >
          {subtitle}
        </Reveal>
        <Reveal as="div" y={18} delay={0.2} className="mt-10">
          <Button href={ctaHref} variant="ink">
            {cta}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
