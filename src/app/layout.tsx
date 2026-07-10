import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ScrollProgress } from "@/components/motion/ScrollProgress";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

// Metadata icons are not auto-prefixed with basePath, so add it explicitly.
const basePath = process.env.NODE_ENV === "production" ? "/as.ae" : "";

export const metadata: Metadata = {
  title: "Business Setup in Dubai & UAE | Alliance Street",
  description:
    "Alliance Street helps entrepreneurs with UAE company formation, free zone & mainland setup, banking, tax, visas, and compliance end-to-end support.",
  icons: {
    icon: `${basePath}/images/favicon-32.png`,
    apple: `${basePath}/images/favicon-32.png`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body className="min-h-full bg-as-canvas text-as-ink font-sans">
        <SmoothScroll />
        <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
