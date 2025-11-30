import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Faq } from "@/components/sections/Faq";
import { Features } from "@/components/sections/Features";
import { Hero } from "@/components/sections/Hero";
import { Integrations } from "@/components/sections/Integrations";
import { Pricing } from "@/components/sections/Pricing";
import { Steps } from "@/components/sections/Steps";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Steps />
        <Integrations />
        <Pricing />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
