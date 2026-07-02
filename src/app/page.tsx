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

export default function Home() {
  return (
    <>
      <Navbar />
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
