"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Logo } from "@/components/icons";
import { NAV_ITEMS } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Navbar({ alwaysSolid = false }: { alwaysSolid?: boolean }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (alwaysSolid) return;
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [alwaysSolid]);

  const solid = alwaysSolid || scrolled;

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        solid ? "bg-black" : "bg-transparent"
      )}
    >
      <nav className="as-container flex h-[82px] items-center justify-between">
        <Link href="/" className="shrink-0">
          <Logo variant="white" className="h-9" />
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="rounded-full border border-white/15 px-4 py-2 text-[15px] font-medium text-white/90 transition-colors hover:border-white/40 hover:text-white"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href="/contact-us"
          className={cn(
            "hidden shrink-0 rounded-full px-5 py-2.5 text-[17px] font-semibold transition-colors sm:inline-flex",
            solid
              ? "bg-white text-black hover:bg-white/90"
              : "bg-black text-white hover:bg-as-red"
          )}
        >
          Get in Touch
        </Link>
      </nav>
    </header>
  );
}
