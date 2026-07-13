import type { Metadata } from "next";
import { Fraunces, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { ChatWidget } from "@/components/ChatWidget";
import { organizationSchema } from "@/lib/schema";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

const isProd = process.env.NODE_ENV === "production";
// Served from the custom domain root (shaukinsv.com via public/CNAME) - no
// basePath prefix needed in production.
const siteUrl = isProd ? "https://shaukinsv.com" : "http://localhost:3000";

const SITE_TITLE = "Business Setup in Dubai & UAE | Alliance Street";
const SITE_DESCRIPTION =
  "Alliance Street helps entrepreneurs with UAE company formation, free zone & mainland setup, banking, tax, visas, and compliance end-to-end support.";

export const metadata: Metadata = {
  metadataBase: new URL(`${siteUrl}/`),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icons: {
    icon: "/images/favicon-32.png",
    apple: "/images/favicon-32.png",
  },
  openGraph: {
    type: "website",
    siteName: "Alliance Street",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/images/businessman-hero.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/images/businessman-hero.jpg"],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema()),
          }}
        />
        <SmoothScroll />
        <ScrollProgress />
        {children}
        <ChatWidget />
      </body>
    </html>
  );
}
