"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReduced } from "@/components/motion/gsap-setup";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  const mq = window.matchMedia(REDUCED_MOTION_QUERY);
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

// Server/first-paint snapshot: always "reduced" so SSR and the first client
// render both use the accessible, non-pinned fallback markup (no hydration
// mismatch, and a reduced-motion / no-JS user never sees a pinned stage).
function getReducedMotionServerSnapshot() {
  return true;
}

export interface PinnedStepper {
  /** Scope ref for the whole section (useGSAP cleanup boundary). */
  sectionRef: React.RefObject<HTMLDivElement | null>;
  /** The element that gets pinned while the steps advance. */
  stageRef: React.RefObject<HTMLDivElement | null>;
  /** Imperatively-driven progress bar (width 0→100%), no re-render. */
  progressRef: React.RefObject<HTMLDivElement | null>;
  /** Currently active step index. */
  active: number;
  /** Set the active step (used by the click-driven fallback). */
  setActive: (index: number) => void;
  /** True when motion is allowed (not reduced-motion). */
  motionEnabled: boolean;
  /** True when the pinned scroll stage should render (enabled + motion). */
  pinnedActive: boolean;
}

/**
 * usePinnedStepper — the scroll-driven "pinned steps" behavior shared by the
 * homepage Process section and any `StepsSection` opted into the pinned
 * variant. Pins `stageRef` for `steps * 100vh` of scroll and buckets the
 * scrubbed progress into an active step index (re-rendering once per step,
 * not per frame), while `progressRef`'s width is written imperatively.
 *
 * Fully degrades under `prefers-reduced-motion` (and no-JS/SSR): when
 * `pinnedActive` is false the caller renders an accessible, non-pinned,
 * click-driven fallback and no ScrollTrigger is ever created.
 *
 * @param steps   number of steps in the sequence
 * @param enabled opt-in to pinning (false → always the click fallback)
 * @param refreshPriority ScrollTrigger refresh order — set higher than any
 *   pin BELOW this one on the page so stacked pins compute their positions in
 *   top-to-bottom order (prevents adjacent pins overlapping).
 */
export function usePinnedStepper(
  steps: number,
  enabled = true,
  refreshPriority = 0
): PinnedStepper {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const reduced = useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getReducedMotionServerSnapshot
  );
  const motionEnabled = !reduced;
  const pinnedActive = enabled && motionEnabled;

  useGSAP(
    () => {
      if (!pinnedActive || prefersReduced() || !stageRef.current) return;

      let lastIndex = -1;
      const trigger = ScrollTrigger.create({
        trigger: stageRef.current,
        start: "top top",
        end: () => `+=${window.innerHeight * steps}`,
        pin: true,
        scrub: 0.6,
        anticipatePin: 1,
        refreshPriority,
        onUpdate: (self) => {
          const idx = Math.min(steps - 1, Math.floor(self.progress * steps));
          if (idx !== lastIndex) {
            lastIndex = idx;
            setActive(idx);
          }
          if (progressRef.current) {
            progressRef.current.style.width = `${self.progress * 100}%`;
          }
        },
      });

      return () => trigger.kill();
    },
    { scope: sectionRef, dependencies: [pinnedActive, steps] }
  );

  return {
    sectionRef,
    stageRef,
    progressRef,
    active,
    setActive,
    motionEnabled,
    pinnedActive,
  };
}
