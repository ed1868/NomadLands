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
    <section className="relative h-screen cyber-hero cyber-grid matrix-rain flex items-center justify-center overflow-hidden">
      {/* Dark Forest Green Cyberpunk Glow Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-float-pulse" />
        <div className="absolute top-2/3 right-1/6 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl animate-float-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-lime-500/10 rounded-full blur-3xl animate-float-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="max-w-6xl mx-auto px-8 text-center relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Main Headline */}
          <h1 className="text-7xl md:text-9xl font-black mb-8 leading-[0.85] tracking-[-0.02em] text-white">
            WORK LESS.
            <br />
            <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-lime-400 bg-clip-text text-transparent matrix-glow">
              LIVE SMART.
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className={`text-xl md:text-2xl text-gray-300 mb-16 max-w-4xl mx-auto leading-relaxed font-light transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '300ms' }}>
            Advanced AI agents powered by dark forest technology. 
            <br className="hidden md:block" />
            <span className="text-green-400">Infiltrate systems. Dominate workflows.</span>
          </p>
          
          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '600ms' }}>
            <Button
              onClick={scrollToMarketplace}
              className="neon-gradient px-10 py-6 rounded-lg text-lg font-bold hover:shadow-2xl hover:shadow-green-500/50 transition-all duration-300 transform hover:scale-105 text-black border-none glow-effect"
              size="lg"
            >
              EXPLORE AGENTS
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="border-green-500/50 px-10 py-6 rounded-lg text-lg font-semibold hover:bg-green-500/10 transition-all duration-300 text-green-400 backdrop-blur-sm hover:border-green-400"
              size="lg"
            >
              <Play className="mr-2 w-5 h-5" />
              WATCH DEMO
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float-pulse">
        <div className="w-6 h-10 border-2 border-green-400/60 rounded-full flex justify-center backdrop-blur-sm glow-effect">
          <div className="w-1 h-3 bg-green-400 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
