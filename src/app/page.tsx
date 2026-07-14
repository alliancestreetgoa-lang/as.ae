import { pageMeta } from "@/lib/seo";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Mission } from "@/components/Mission";
import { Solutions } from "@/components/Solutions";
import { StatsBanner } from "@/components/StatsBanner";
import { Values } from "@/components/Values";
import { Process } from "@/components/Process";
import { Publications } from "@/components/Publications";
import { Testimonials } from "@/components/Testimonials";
import { Collaborate } from "@/components/Collaborate";
import { AsSeenIn } from "@/components/AsSeenIn";
import { Footer } from "@/components/Footer";

// Homepage owns its metadata explicitly rather than inheriting the layout
// default, so it stays correct even if the layout's fallback changes later.
export const metadata = pageMeta({
  title: "Business Setup in Dubai & UAE | Alliance Street",
  description:
    "Alliance Street helps entrepreneurs with UAE company formation, free zone & mainland setup, banking, tax, visas, and compliance end-to-end support.",
  path: "",
});

export default function Home() {
  return (
    <>
      <Navbar overLight />
      <main>
        <Hero />
        <Mission />
        <Solutions />
        <StatsBanner />
        <Values />
        <Process />
        <Publications />
        <Testimonials />
        <Collaborate />
        <AsSeenIn />
      </main>
      <Footer />
    </>
  );
}
