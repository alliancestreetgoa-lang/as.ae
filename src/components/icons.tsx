import Image from "next/image";
import { cn } from "@/lib/utils";

/** Alliance Street wordmark (red triangle + "ALLIANCE STREET"). */
export function Logo({
  variant = "white",
  className,
}: {
  variant?: "white" | "black";
  className?: string;
}) {
  const src = variant === "white" ? "/images/logo-white.png" : "/images/logo-black.png";
  return (
    <Image
      src={src}
      alt="Alliance Street"
      width={1470}
      height={399}
      priority
      className={cn("h-8 w-auto", className)}
    />
  );
}

/** The small red triangle logo mark used in the footer bottom bar. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 34" fill="none" className={cn("h-7 w-auto", className)}>
      <path d="M20 0L40 34H26.5L20 22.5L13.5 34H0L20 0Z" fill="#e22e34" />
    </svg>
  );
}

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-5 w-5", className)}
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function Check({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-5 w-5", className)}
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}
