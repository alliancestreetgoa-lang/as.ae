import Image from "next/image";
import Link from "next/link";

/** Full-bleed image hero with dark overlay and left-aligned title (banking/services pages). */
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
    <section className="relative isolate overflow-hidden bg-black pt-[82px]">
      <Image src={image} alt="" fill priority className="object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />

      <div className="as-container relative z-10 flex min-h-[80vh] flex-col justify-center py-24">
        {/* red corner bracket */}
        <span className="mb-8 hidden h-14 w-14 rounded-tl-md border-l-2 border-t-2 border-as-red/70 lg:block" />
        <h1 className="max-w-3xl text-[42px] leading-[1.05] tracking-[-0.04em] text-white sm:text-[56px] lg:text-[68px]">
          {title}
        </h1>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/70">{subtitle}</p>
        <Link href={ctaHref} className="as-btn-dark mt-10 w-fit bg-white text-black hover:bg-white/90">
          {cta}
        </Link>
      </div>
    </section>
  );
}
