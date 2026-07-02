import Link from "next/link";

/** Centered dark hero used across sub-pages ("Are you next?" style). */
export function PageHero({
  title,
  subtitle,
  cta = "Get in Touch",
  ctaHref = "/contact-us",
}: {
  title: string;
  subtitle: string;
  cta?: string;
  ctaHref?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-black pt-[82px]">
      {/* dark globe glow rising from the bottom */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 flex justify-center">
        <div className="h-[600px] w-[1100px] translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_0%,rgba(226,46,52,0.35),rgba(226,46,52,0.05)_40%,transparent_70%)]" />
      </div>

      <div className="as-container relative z-10 flex min-h-[70vh] flex-col items-center justify-center py-24 text-center">
        <h1 className="max-w-4xl text-[52px] leading-[1.05] tracking-[-0.04em] text-white sm:text-[72px] lg:text-[88px]">
          {title}
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-white/60">
          {subtitle}
        </p>
        <Link href={ctaHref} className="as-btn-dark mt-10 bg-white text-black hover:bg-white/90">
          {cta}
        </Link>
      </div>
    </section>
  );
}
