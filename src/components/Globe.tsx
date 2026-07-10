"use client";

import createGlobe, { type COBEOptions } from "cobe";
import { useEffect, useRef } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReduced } from "@/components/motion/gsap-setup";
import { cn } from "@/lib/utils";

// cobe 2.x supports an `onRender` callback at runtime (see its README), but
// the shipped COBEOptions type omits it — extend the type so the config is
// assignable without an object-literal excess-property error.
type GlobeConfig = COBEOptions & {
  onRender: (state: Record<string, number>) => void;
};

/**
 * Globe — a dark, auto-rotating WebGL globe (via `cobe`, ~5kb, no external
 * assets) used purely as a decorative background behind dark hero sections.
 * Themed onto the brand: an ink-toned sphere with a warm red atmospheric
 * glow and red location markers (Dubai emphasised). Rendering is client-only
 * and the canvas is `aria-hidden` + `pointer-events-none` so it never steals
 * focus or clicks from the hero content on top of it.
 *
 * Under `prefers-reduced-motion` the globe renders a static frame (no
 * auto-rotation).
 */
export function Globe({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let width = 0;
    let phi = 0;
    let scrollSpin = 0;
    const reduce = prefersReduced();

    const onResize = () => {
      if (canvasRef.current) width = canvasRef.current.offsetWidth;
    };
    window.addEventListener("resize", onResize);
    onResize();

    // Scroll-reactive spin: as the hero scrolls past, the globe turns an extra
    // ~1.4 rad on top of its idle rotation. Skipped under reduced motion.
    const trigger = reduce
      ? null
      : ScrollTrigger.create({
          trigger: canvasRef.current?.closest("section") ?? canvasRef.current!,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            scrollSpin = self.progress * 1.4;
          },
        });

    const config: GlobeConfig = {
      devicePixelRatio: 2,
      width: width * 2,
      height: width * 2,
      phi: 0,
      theta: 0.28,
      dark: 1,
      diffuse: 1.5,
      mapSamples: 22000,
      mapBrightness: 16,
      mapBaseBrightness: 0.12,
      baseColor: [0.45, 0.5, 0.58],
      markerColor: [226 / 255, 46 / 255, 52 / 255],
      glowColor: [0.55, 0.24, 0.27],
      markers: [
        { location: [25.2048, 55.2708], size: 0.11 }, // Dubai
        { location: [40.7128, -74.006], size: 0.06 }, // New York
        { location: [51.5074, -0.1278], size: 0.06 }, // London
        { location: [1.3521, 103.8198], size: 0.05 }, // Singapore
        { location: [19.076, 72.8777], size: 0.05 }, // Mumbai
        { location: [48.2082, 16.3738], size: 0.04 }, // Vienna
      ],
      onRender: (state) => {
        if (!reduce) phi += 0.003;
        state.phi = phi + scrollSpin;
        state.width = width * 2;
        state.height = width * 2;
      },
    };

    const globe = createGlobe(canvasRef.current!, config);

    const reveal = setTimeout(() => {
      if (canvasRef.current) canvasRef.current.style.opacity = "1";
    });

    return () => {
      clearTimeout(reveal);
      trigger?.kill();
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none aspect-square h-full w-full opacity-0 transition-opacity duration-1000 [contain:layout_paint_size]",
        className
      )}
    />
  );
}
