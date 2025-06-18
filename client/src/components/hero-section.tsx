import { useEffect, useState } from "react";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);

  const scrollToMarketplace = () => {
    const element = document.getElementById('marketplace');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="relative h-screen hero-section flex items-center justify-center overflow-hidden">
      {/* Luxury ambient effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/5 w-96 h-96 bg-emerald-800/8 rounded-full blur-3xl floating-luxury" />
        <div className="absolute bottom-1/3 right-1/5 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl floating-luxury" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-6xl mx-auto px-8 text-center relative z-10">
        <div className={`${isVisible ? 'fade-in-luxury' : 'opacity-0'}`}>
          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl font-light mb-8 leading-[0.9] tracking-[-0.02em] text-white">
            Work Less.
            <br />
            <span className="luxury-text font-medium">
              Live Smart.
            </span>
          </h1>
          
          {/* Subheadline */}
          <div className={`${isVisible ? 'slide-up-luxury' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
            <p className="text-xl md:text-2xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed font-light">
              Exquisitely crafted AI agents for discerning professionals.
              <br className="hidden md:block" />
              <span className="text-amber-200">Sophisticated automation that elevates your practice.</span>
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center ${isVisible ? 'slide-up-luxury' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
            <Button
              onClick={scrollToMarketplace}
              className="velvet-gradient px-12 py-6 rounded-md text-lg font-medium hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 text-white border-none smooth-hover luxury-shadow"
              size="lg"
            >
              Explore Collection
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="brass-border bg-transparent px-12 py-6 rounded-md text-lg font-light transition-all duration-500 text-amber-200 backdrop-blur-sm smooth-hover"
              size="lg"
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Story
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 floating-luxury">
        <div className="w-6 h-10 border-2 border-amber-300/60 rounded-full flex justify-center backdrop-blur-sm">
          <div className="w-1 h-3 bg-amber-300/80 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
