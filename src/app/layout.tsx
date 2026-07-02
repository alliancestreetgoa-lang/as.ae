import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

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
      className={`${inter.variable} ${poppins.variable} antialiased`}
    >
      <body className="min-h-full bg-white text-black">{children}</body>
    </html>
  );
}
