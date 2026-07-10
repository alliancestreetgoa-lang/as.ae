"use client";

import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowRight } from "@/components/icons";

/**
 * Button — the site-wide pill CTA, unifying every hand-rolled red pill /
 * outline link into one primitive with a consistent 21st.dev-inspired
 * treatment: a top inner highlight, a brand-tinted glow shadow that lifts
 * on hover, and (on the primary variant) a light shine that sweeps across.
 * All pure CSS so it respects the site's no-framer-motion constraint and
 * degrades cleanly under reduced motion (only transform/opacity animate).
 *
 * Polymorphic: renders `next/link` for internal routes, a plain `<a>` for
 * hash / external / mailto / tel targets, and a `<button>` when no href is
 * given. Pass `arrow` to append a right-arrow that nudges on hover.
 *
 * 21st.dev inspiration: Shiny Button (gradient fill + glow-on-hover) and
 * Gradient Borders Button (Shatlyk1011) — adapted onto Alliance Street's
 * red pill idiom rather than installed verbatim.
 */
type Variant = "primary" | "ink" | "white" | "outline";
type Size = "default" | "sm";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-sans font-semibold whitespace-nowrap transition-[transform,box-shadow,background-color,border-color,color] duration-300 ease-out will-change-transform active:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0";

const sizes: Record<Size, string> = {
  default: "px-7 py-3.5 text-[15px]",
  sm: "px-5 py-2.5 text-sm",
};

// Every button now renders as the easemize frosted "glass" pill
// (`.glass-button` styles in globals.css). The variant is kept for API
// compatibility but no longer changes the look.
const variants: Record<Variant, string> = {
  primary: "glass-button",
  ink: "glass-button",
  white: "glass-button",
  outline: "glass-button",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
};

type AnchorProps = CommonProps &
  Omit<ComponentPropsWithoutRef<"a">, keyof CommonProps> & { href: string };
type NativeButtonProps = CommonProps &
  Omit<ComponentPropsWithoutRef<"button">, keyof CommonProps> & {
    href?: never;
  };

export function Button(props: AnchorProps | NativeButtonProps) {
  const {
    variant = "primary",
    size = "default",
    arrow = false,
    className,
    children,
    ...rest
  } = props;

  const cls = cn(base, sizes[size], variants[variant], className);

  const content = (
    <span className="relative inline-flex items-center gap-2">
      {children}
      {arrow && (
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none" />
      )}
    </span>
  );

  if (rest.href !== undefined) {
    const { href, ...anchorRest } = rest as Omit<AnchorProps, keyof CommonProps>;
    const usePlainAnchor = /^(https?:|#|mailto:|tel:)/.test(href);
    if (usePlainAnchor) {
      return (
        <a className={cls} href={href} {...anchorRest}>
          {content}
        </a>
      );
    }
    return (
      <Link className={cls} href={href} {...anchorRest}>
        {content}
      </Link>
    );
  }

  const buttonRest = rest as Omit<NativeButtonProps, keyof CommonProps>;
  return (
    <button className={cls} {...buttonRest}>
      {content}
    </button>
  );
}
