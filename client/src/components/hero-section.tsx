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
      {/* Bright ambient effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-96 h-96 bg-green-600/10 rounded-full blur-3xl floating-animation" />
        <div className="absolute bottom-1/4 right-1/6 w-80 h-80 bg-green-500/15 rounded-full blur-3xl floating-animation" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-2/3 left-1/2 w-64 h-64 bg-green-400/8 rounded-full blur-3xl floating-animation" style={{ animationDelay: '3s' }} />
      </div>

      <div className="max-w-6xl mx-auto px-8 text-center relative z-10">
        <div className={`${isVisible ? 'bounce-in' : 'opacity-0'}`}>
          {/* Main Headline */}
          <h1 className="text-7xl md:text-9xl font-black mb-8 leading-[0.85] tracking-[-0.03em] text-white glow-text">
            WORK LESS.
            <br />
            <span className="vibrant-text font-black">
              LIVE SMART.
            </span>
          </h1>
          
          {/* Subheadline */}
          <div className={`${isVisible ? 'slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            <p className="text-2xl md:text-3xl text-white mb-16 max-w-4xl mx-auto leading-relaxed font-medium">
              Revolutionary AI agents that work <span className="text-green-400 font-bold">brilliantly</span> in the background.
              <br className="hidden md:block" />
              <span className="text-green-300">Transform your workflow. Amplify your impact.</span>
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-8 justify-center items-center ${isVisible ? 'slide-up' : 'opacity-0'}`} style={{ animationDelay: '0.6s' }}>
            <Button
              onClick={scrollToMarketplace}
              className="bright-gradient px-16 py-8 rounded-full text-xl font-bold hover:shadow-2xl transition-all duration-300 text-white border-none elastic-hover pulse-bright"
              size="lg"
            >
              EXPLORE AGENTS
              <ArrowRight className="ml-3 w-6 h-6" />
            </Button>
            <Button
              variant="outline"
              className="bright-border bg-transparent px-16 py-8 rounded-full text-xl font-bold transition-all duration-300 text-white backdrop-blur-sm elastic-hover"
              size="lg"
            >
              <Play className="mr-3 w-6 h-6" />
              WATCH DEMO
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 floating-animation">
        <div className="w-8 h-12 border-2 border-green-400 rounded-full flex justify-center backdrop-blur-sm bright-border">
          <div className="w-2 h-4 bg-green-400 rounded-full mt-2 pulse-bright" />
        </div>
      </div>
    </section>
  );
}
