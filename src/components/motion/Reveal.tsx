"use client";
import { createElement, type ElementType, type ReactNode } from "react";
import { useReveal } from "./useReveal";

type RevealProps = {
  as?: ElementType;
  y?: number;
  delay?: number;
  duration?: number;
  className?: string;
  children?: ReactNode;
};

export function Reveal({
  as = "div",
  y,
  delay,
  duration,
  className,
  children,
}: RevealProps) {
  const ref = useReveal({ y, delay, duration });
  return createElement(
    as,
    { ref, className },
    children
  );
}
