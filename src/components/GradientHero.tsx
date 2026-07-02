import Link from "next/link";

/** Centered hero over the black -> red -> white brand gradient (accounting/services pages). */
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
        <h1 className="max-w-4xl text-[40px] leading-[1.08] tracking-[-0.04em] text-black sm:text-[56px] lg:text-[64px]">
          {title}
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-black/70">{subtitle}</p>
        <Link href={ctaHref} className="as-btn-dark mt-10">
          {cta}
        </Link>
      </div>
    </section>
  );
}
