import Image from "next/image";
import Link from "next/link";

const DEFAULT_QUOTE =
  "“...a testament to the competence and excellent application of industry standards & methods combined with a strive towards brilliance.” - Asia Business Outlook";

export function StatsBanner({
  quote = DEFAULT_QUOTE,
  showButton = true,
}: {
  quote?: string;
  showButton?: boolean;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-black">
      <Image
        src="/images/reviews.png"
        alt=""
        fill
        className="object-cover object-center opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/30" />

      <div className="as-container relative z-10 flex min-h-[560px] flex-col justify-end py-16">
        <div className="max-w-3xl">
          <p className="text-[110px] font-semibold leading-none tracking-[-0.05em] text-white sm:text-[150px]">
            200<span className="text-as-red">+</span>
          </p>
          <p className="mt-2 text-2xl font-medium text-white">
            Successful projects completed.
          </p>
          <p className="mt-6 max-w-2xl text-lg italic text-white/70">{quote}</p>
          {showButton && (
            <Link
              href="/contact-us"
              className="mt-8 inline-flex rounded-full bg-white px-6 py-3 font-semibold text-black transition-colors hover:bg-white/90"
            >
              About Us
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
