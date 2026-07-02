"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "@/components/icons";
import { TESTIMONIALS } from "@/lib/content";

export function Testimonials() {
  const [i, setI] = useState(0);
  const t = TESTIMONIALS[i];
  const go = (d: number) =>
    setI((prev) => (prev + d + TESTIMONIALS.length) % TESTIMONIALS.length);

  return (
    <section className="bg-white py-24">
      <div className="as-container">
        <p className="as-eyebrow mb-10">
          DON&apos;T LISTEN TO US, <span className="accent">LISTEN TO THEM:</span>
        </p>

        <blockquote className="max-w-4xl text-[30px] font-semibold leading-[1.25] tracking-[-0.02em] text-black sm:text-[40px]">
          &ldquo;{t.quote}&rdquo;
        </blockquote>

        <div className="mt-10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Image
              src={t.image}
              alt={t.name}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full object-cover"
            />
            <div>
              <p className="text-xl font-semibold text-black">{t.name}</p>
              <p className="text-as-muted">{t.company}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous testimonial"
              onClick={() => go(-1)}
              className="flex h-12 w-12 rotate-180 items-center justify-center rounded-full border border-black/15 text-black transition-colors hover:border-black/50"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next testimonial"
              onClick={() => go(1)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-black/15 text-black transition-colors hover:border-black/50"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
