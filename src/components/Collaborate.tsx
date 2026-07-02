import Image from "next/image";
import { ORBIT_AVATARS } from "@/lib/content";

// Pill-shaped avatar positions (percentages) around the orbit.
const AVATAR_POS = [
  { top: "50%", left: "44%", w: 150 }, // center front (big)
  { top: "30%", left: "31%", w: 96 },
  { top: "30%", left: "52%", w: 96 },
  { top: "42%", left: "63%", w: 104 },
  { top: "60%", left: "26%", w: 96 },
  { top: "62%", left: "60%", w: 96 },
];

const BADGES = [
  { src: "/images/icon-lock.svg", top: "40%", left: "44%" },
  { src: "/images/graph-new.svg", top: "58%", left: "66%" },
  { src: "/images/icon-layers.svg", top: "70%", left: "33%" },
];

export function Collaborate() {
  return (
    <section
      id="collaborate"
      className="relative overflow-hidden bg-gradient-to-b from-white via-[#f7dede] to-[#f0c0c0] pt-24"
    >
      <div className="as-container relative z-10 text-center">
        <p className="as-eyebrow mb-6">
          LET&apos;S <span className="accent">COLLABORATE</span>
        </p>
        <h2 className="mx-auto max-w-2xl text-[44px] leading-[1.05] tracking-[-0.03em] text-black sm:text-[60px]">
          Go where you&apos;re treated best.
        </h2>
        <a href="#" className="as-btn-dark mt-10">
          Get in Touch
        </a>
      </div>

      {/* Orbit graphic */}
      <div className="relative mx-auto mt-6 h-[420px] w-full max-w-[900px]">
        {/* concentric ellipse rings */}
        {[1, 0.72, 0.46].map((s, idx) => (
          <div
            key={idx}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-as-red/20"
            style={{ width: `${s * 760}px`, height: `${s * 420}px` }}
          />
        ))}

        {/* icon badges */}
        {BADGES.map((b, idx) => (
          <div
            key={idx}
            className="absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md"
            style={{ top: b.top, left: b.left }}
          >
            <Image src={b.src} alt="" width={20} height={20} className="h-5 w-5" />
          </div>
        ))}

        {/* avatar pills */}
        {AVATAR_POS.map((p, idx) => (
          <div
            key={idx}
            className="absolute -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-full shadow-lg"
            style={{ top: p.top, left: p.left, width: p.w, height: p.w * 1.15 }}
          >
            <Image
              src={ORBIT_AVATARS[idx]}
              alt=""
              width={p.w}
              height={Math.round(p.w * 1.15)}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
