import Image from "next/image";
import { VALUES } from "@/lib/content";

export function Values() {
  return (
    <section className="bg-white py-24">
      <div className="as-container grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        {/* Image with About Us pill */}
        <div className="relative overflow-hidden rounded-[24px]">
          <Image
            src="/images/values-stallone.jpg"
            alt="Alliance Street team in a meeting"
            width={640}
            height={620}
            className="h-full w-full object-cover"
          />
          <a
            href="#collaborate"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white px-7 py-3 font-semibold text-black shadow-lg transition-transform hover:scale-105"
          >
            About Us
          </a>
        </div>

        {/* Values list */}
        <div>
          <p className="as-eyebrow mb-6">
            OUR <span className="accent">VALUES</span>
          </p>
          <h2 className="mb-12 text-[34px] leading-[1.1] tracking-[-0.03em] sm:text-[48px]">
            Our values are the foundation of everything we do.
          </h2>

          <ul className="space-y-9">
            {VALUES.map((v, i) => (
              <li
                key={v.title}
                className={i === 0 ? "border-l-2 border-as-red pl-6" : "pl-6"}
              >
                <h3 className="mb-2 text-xl font-semibold text-black">{v.title}</h3>
                <p className="max-w-md text-[15px] leading-relaxed text-as-muted">
                  {v.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
