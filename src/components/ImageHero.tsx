import Image from "next/image";
import Link from "next/link";
import { Frame } from "@/components/primitives/Frame";
import { Reveal } from "@/components/motion/Reveal";

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
}: {
  title: string;
  subtitle: string;
  image: string;
  cta?: string;
  ctaHref?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-as-ink pt-[82px]">
      <Image src={image} alt="" fill priority className="object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-r from-as-ink/90 via-as-ink/60 to-as-ink/20" />

      <div className="as-container relative z-10 flex min-h-[80vh] flex-col justify-center py-24">
        <Frame tone="red" className="max-w-3xl">
          <Reveal as="h1" y={28} className="font-display text-[42px] leading-[1.05] tracking-[-0.04em] text-white sm:text-[56px] lg:text-[68px]">
            {title}
          </Reveal>
          <Reveal
            as="p"
            y={22}
            delay={0.1}
            className="mt-8 max-w-xl text-lg leading-relaxed text-white/70"
          >
            {subtitle}
          </Reveal>
          <Reveal as="div" y={18} delay={0.2} className="mt-10 w-fit">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-full bg-as-red px-7 py-3.5 font-sans text-[15px] font-semibold text-white transition-colors hover:bg-as-red-bright"
            >
              {cta}
            </Link>
          </Reveal>
        </Frame>
      </div>
    </section>
  );
}
