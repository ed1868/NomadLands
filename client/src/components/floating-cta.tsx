import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FloatingCTA() {
  const scrollToMarketplace = () => {
    const element = document.getElementById('marketplace');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="floating-cta">
      <Button
        onClick={scrollToMarketplace}
        className="neon-gradient text-black px-6 py-4 rounded-lg shadow-2xl hover:shadow-green-500/30 transition-all duration-500 transform hover:scale-110 border-none glow-effect"
        size="lg"
      >
        <ArrowRight className="w-5 h-5" />
      </Button>
    </div>
  );
}