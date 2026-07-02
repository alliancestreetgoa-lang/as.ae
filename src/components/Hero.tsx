import { ArrowRight } from "@/components/icons";

export function Hero() {
  return (
    <section id="top" className="relative as-hero-gradient pt-[82px]">
      {/* White rounded card overlaying the gradient */}
      <div className="as-container">
        <div className="relative mt-4 overflow-hidden rounded-t-[28px] bg-white px-6 pb-24 pt-10 sm:px-12 lg:px-16">
          {/* red gradient top border line */}
          <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-black via-as-red to-black" />

          {/* decorative red corner brackets */}
          <span className="pointer-events-none absolute left-10 top-14 h-16 w-16 rounded-tl-md border-l-2 border-t-2 border-as-red/70" />
          <span className="pointer-events-none absolute bottom-24 right-24 hidden h-16 w-16 rounded-br-md border-b-2 border-r-2 border-as-red/70 lg:block" />

          <div className="relative max-w-3xl pt-16">
            {/* nomination badge */}
            <div className="mb-8 inline-flex items-center gap-3 rounded-full bg-black/[0.04] py-1.5 pl-5 pr-1.5 text-sm text-black/70">
              <span>
                Alliance Street is nominated as best business consulting firm in Asia
              </span>
              <a
                href="#publications"
                className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black shadow-sm"
              >
                Read more
              </a>
            </div>

            <h1 className="text-[44px] leading-[1.05] tracking-[-0.04em] sm:text-[56px] lg:text-[68px]">
              Business Setup &amp; Company Formation Services in Dubai, UAE
            </h1>

            <p className="mt-8 max-w-xl text-lg text-as-muted">
              At Alliance Street, we built business structures that help you protect
              your assets and eliminate taxation (often fully) - corporate &amp;
              private.
            </p>

            <div className="mt-10 flex items-center gap-8">
              <a href="#collaborate" className="as-btn-dark">
                Let&apos;s talk
              </a>
              <a
                href="#solutions"
                className="inline-flex items-center gap-2 text-lg font-semibold text-black"
              >
                Our solutions
                <ArrowRight className="h-5 w-5 text-as-red" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
