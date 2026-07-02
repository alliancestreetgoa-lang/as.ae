import Image from "next/image";
import { ArrowRight } from "@/components/icons";
import { PUBLICATIONS } from "@/lib/content";

export function Publications() {
  return (
    <section id="publications" className="bg-white py-24">
      <div className="as-container grid gap-12 lg:grid-cols-2 lg:gap-16">
        {/* Sticky intro */}
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <h2 className="text-[56px] leading-[1] tracking-[-0.04em] sm:text-[72px]">
            Publications
          </h2>
          <p className="mt-6 max-w-md text-lg text-as-muted">
            Read about us in renowned publications, each underlining our dedication to
            excellence and innovation.
          </p>
          <a href="#collaborate" className="as-btn-dark mt-8">
            Let&apos;s talk
          </a>
        </div>

        {/* Scrolling cards */}
        <div className="space-y-12">
          {PUBLICATIONS.map((pub) => (
            <article key={pub.title} className="relative">
              <span className="as-red-shadow" />
              <div className="relative z-10 overflow-hidden rounded-[20px] border border-black/5 bg-white shadow-[0_2px_24px_rgba(0,0,0,0.05)]">
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-as-light">
                  <Image
                    src={pub.image}
                    alt={pub.outlet}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-7">
                  <h3 className="text-2xl font-semibold leading-snug text-black">
                    {pub.title}
                  </h3>
                  <p className="mt-4 text-[15px] leading-relaxed text-as-muted">
                    {pub.excerpt}
                  </p>
                  <a
                    href={pub.href}
                    className="mt-6 inline-flex items-center gap-2 font-semibold text-black"
                  >
                    Read the Full Article
                    <ArrowRight className="h-5 w-5 text-as-red" />
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
