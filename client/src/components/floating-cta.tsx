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
        className="forest-gradient text-white px-6 py-4 rounded-full shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 transform hover:scale-110 border-none magnetic-hover breathing-glow"
        size="lg"
      >
        <ArrowRight className="w-5 h-5" />
      </Button>
    </div>
  );
}