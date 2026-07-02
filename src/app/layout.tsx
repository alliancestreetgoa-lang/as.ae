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

export const metadata: Metadata = {
  title: "Business Setup in Dubai & UAE | Alliance Street",
  description:
    "Alliance Street helps entrepreneurs with UAE company formation, free zone & mainland setup, banking, tax, visas, and compliance end-to-end support.",
  icons: {
    icon: "/images/favicon-32.png",
    apple: "/images/favicon-32.png",
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
