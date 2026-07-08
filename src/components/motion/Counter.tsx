"use client";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { prefersReduced } from "./gsap-setup";

type CounterProps = {
  to: number;
  suffix?: string;
  className?: string;
};

export function Counter({ to, suffix = "", className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  // Rendered value: defaults to the final value so SSR output and a
  // reduced-motion / no-JS environment always show the finished state.
  const [display, setDisplay] = useState(to);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el || prefersReduced()) return;

      const counter = { val: 0 };
      setDisplay(0);
      gsap.to(counter, {
        val: to,
        duration: 1.6,
        ease: "power2.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
        onUpdate: () => setDisplay(Math.round(counter.val)),
      });
    },
    { scope: ref, dependencies: [to] }
  );

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
