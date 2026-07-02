import Image from "next/image";
import { PRESS_LOGOS } from "@/lib/content";

export function AsSeenIn() {
  return (
    <section className="bg-gradient-to-b from-[#f0c0c0] via-as-red to-[#8a1417] pb-20 pt-14">
      <div className="as-container">
        <p
          className="mb-10 text-center text-[13px] font-medium uppercase tracking-[0.22em] text-white/80"
          style={{ fontFamily: "var(--font-poppins)" }}
        >
          As Seen In:
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-16 gap-y-8">
          {PRESS_LOGOS.map((logo) => (
            <Image
              key={logo.name}
              src={logo.src}
              alt={logo.name}
              width={logo.width}
              height={48}
              className="h-8 w-auto object-contain opacity-95 sm:h-10"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
