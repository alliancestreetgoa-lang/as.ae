"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/attribution";

/**
 * Mount-point that triggers first-touch attribution capture on every page
 * load. Renders nothing — a pure side-effect component, matching the shape
 * of `SmoothScroll`/`ScrollProgress`. Runs on mount only (this static-export
 * site has no client-side route transitions to react to separately — every
 * route is its own full page load, so a fresh mount happens naturally on
 * every navigation).
 */
export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);

  return null;
}
