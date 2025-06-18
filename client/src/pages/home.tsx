import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import AgentMarketplace from "@/components/agent-marketplace";
import NomadLandsShowcase from "@/components/nomad-lands-showcase";
import SmartContractsShowcase from "@/components/smart-contracts-showcase";
import UsedBySection from "@/components/used-by-section";
import FeaturesSection from "@/components/features-section";
import Footer from "@/components/footer";
import FloatingCTA from "@/components/floating-cta";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <HeroSection />
      <AgentMarketplace />
      <NomadLandsShowcase />
      <SmartContractsShowcase />
      <UsedBySection />
      <FeaturesSection />
      <Footer />
      <FloatingCTA />
    </div>
  );
}
