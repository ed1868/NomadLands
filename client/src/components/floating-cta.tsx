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
        className="velvet-gradient text-white px-6 py-4 rounded-md shadow-2xl luxury-shadow transition-all duration-500 smooth-hover warm-glow"
        size="lg"
      >
        <ArrowRight className="w-5 h-5" />
      </Button>
    </div>
  );
}