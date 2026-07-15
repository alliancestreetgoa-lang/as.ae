"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/primitives/Button";
import { Logo } from "@/components/icons";
import { NAV_ITEMS } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Navbar — transparent over the hero, solid `as-ink` (blurred, hairline
 * border) once the page scrolls past 40px. Sourced structurally from
 * 21st.dev "Navbar" (valentinvernejoul, id 13545): scroll-driven solid
 * state + a controlled hamburger toggle, re-themed to our tokens/fonts
 * and re-built with a CSS grid-rows accordion (no framer-motion) for the
 * mobile panel.
 */
export function Navbar({
  alwaysSolid = false,
  overLight = false,
}: {
  alwaysSolid?: boolean;
  /** Set when the navbar sits transparent over a LIGHT hero — its
   *  transparent state then uses a dark logo + ink text so it stays visible
   *  (it still flips to the solid ink bar on scroll). */
  overLight?: boolean;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (alwaysSolid) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [alwaysSolid]);

  // Escape closes the mobile panel.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  // Lock body scroll while the mobile panel is open.
  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [mobileOpen]);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const solid = alwaysSolid || scrolled || mobileOpen;
  // Transparent over a light hero → dark logo + ink text/borders.
  const overLightTransparent = overLight && !solid;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 animate-[as-nav-in_0.6s_ease-out_both] motion-reduce:animate-none",
        solid
          ? "border-as-line bg-white/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      )}
    >
      <nav className="as-container flex h-[82px] items-center justify-between">
        <Link href="/" className="shrink-0" onClick={closeMobile}>
          <Logo variant={solid || overLightTransparent ? "black" : "white"} className="h-9" />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={cn(
                  "rounded-full border px-4 py-2 font-sans text-[15px] font-medium transition-colors hover:border-as-red/60",
                  solid || overLightTransparent
                    ? "border-as-line text-as-ink hover:text-as-red"
                    : "border-white/15 text-white/90 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <Button
            href="/contact-us"
            variant="primary"
            size="sm"
            className="hidden shrink-0 sm:inline-flex"
            track={{
              name: "nav_cta_click",
              params: { cta_label: "Get in Touch", location: "navbar_desktop" },
            }}
          >
            Get in Touch
          </Button>

          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            onClick={() => setMobileOpen((open) => !open)}
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-full border transition-colors hover:border-as-red/60 lg:hidden",
              solid || overLightTransparent
                ? "border-as-line text-as-ink"
                : "border-white/15 text-white"
            )}
          >
            {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {/* Mobile panel: CSS grid-template-rows accordion, no JS height math.
          When closed, the panel is clipped to 0px but its links remain in
          the DOM — `inert` (+ aria-hidden as a screen-reader mirror) keeps
          those clipped controls out of the tab order and AT tree so
          keyboard users can't tab into invisible content. */}
      <div
        id="mobile-nav-panel"
        className={cn(
          "grid overflow-hidden border-t transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none lg:hidden",
          mobileOpen
            ? "grid-rows-[1fr] border-as-line bg-white/98 backdrop-blur-md"
            : "grid-rows-[0fr] border-transparent"
        )}
        {...(!mobileOpen ? { inert: true, "aria-hidden": true } : {})}
      >
        <div className="min-h-0">
          <ul className="as-container flex flex-col gap-1 py-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  onClick={closeMobile}
                  className="block rounded-lg px-3 py-3 font-sans text-base font-medium text-as-ink transition-colors hover:bg-as-red/5 hover:text-as-red"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Button
                href="/contact-us"
                variant="primary"
                size="sm"
                onClick={closeMobile}
                className="w-full"
                track={{
                  name: "nav_cta_click",
                  params: { cta_label: "Get in Touch", location: "navbar_mobile" },
                }}
              >
                Get in Touch
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
