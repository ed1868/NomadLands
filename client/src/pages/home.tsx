import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import AgentMarketplace from "@/components/agent-marketplace";
import FeaturesSection from "@/components/features-section";
import Footer from "@/components/footer";
import FloatingCTA from "@/components/floating-cta";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <HeroSection />
      <AgentMarketplace />
      <FeaturesSection />
      <Footer />
      <FloatingCTA />
    </div>
  );
}
