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
        className="bright-gradient text-white px-8 py-6 rounded-full shadow-2xl bright-border transition-all duration-300 elastic-hover pulse-bright"
        size="lg"
      >
        <ArrowRight className="w-6 h-6" />
      </Button>
    </div>
  );
}