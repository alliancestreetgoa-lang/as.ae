import Image from "next/image";

export function Mission() {
  return (
    <section className="relative overflow-hidden bg-white pb-24 pt-10">
      <div className="as-container">
        <h2 className="mx-auto max-w-4xl text-[34px] leading-[1.15] tracking-[-0.03em] sm:text-[46px] lg:text-[54px]">
          <span className="text-black">Our mission is to </span>
          <span className="bg-gradient-to-r from-as-ink to-as-red bg-clip-text text-transparent">
            help businesses
          </span>
          <span className="text-as-muted">
            {" "}earn more and keep what they deserve - which is everything.
          </span>
        </h2>

        {/* Team video thumbnail */}
        <div className="relative mx-auto mt-14 w-full max-w-[420px]">
          <div className="absolute -bottom-2 left-6 right-6 h-10 rounded-full bg-as-red blur-[2px]" />
          <div className="relative overflow-hidden rounded-[18px]">
            <Image
              src="/images/mission-team-homepage.jpg"
              alt="The Alliance Street team"
              width={420}
              height={280}
              className="h-auto w-full object-cover"
            />
            <button
              type="button"
              aria-label="Play video"
              className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 backdrop-blur transition-transform hover:scale-105"
            >
              <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6 fill-black">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
