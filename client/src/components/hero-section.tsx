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
      {/* Subtle ambient effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/5 w-96 h-96 bg-emerald-800/5 rounded-full blur-3xl animate-float-pulse" />
        <div className="absolute bottom-1/3 right-1/5 w-72 h-72 bg-emerald-700/5 rounded-full blur-3xl animate-float-pulse" style={{ animationDelay: '3s' }} />
      </div>

      <div className="max-w-6xl mx-auto px-8 text-center relative z-10">
        <div className={`transition-all duration-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
          {/* Main Headline */}
          <h1 className="text-6xl md:text-8xl font-light mb-8 leading-[0.9] tracking-[-0.02em] text-white">
            Work Less.
            <br />
            <span className="font-medium bg-gradient-to-r from-emerald-400 to-emerald-300 bg-clip-text text-transparent">
              Live Smart.
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className={`text-xl md:text-2xl text-gray-400 mb-16 max-w-4xl mx-auto leading-relaxed font-light transition-all duration-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '200ms' }}>
            Premium AI agents designed for mindful professionals.
            <br className="hidden md:block" />
            <span className="text-emerald-400">Elegant automation that respects your flow.</span>
          </p>
          
          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: '400ms' }}>
            <Button
              onClick={scrollToMarketplace}
              className="forest-gradient px-12 py-6 rounded-full text-lg font-medium hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 transform hover:scale-105 text-white border-none magnetic-hover"
              size="lg"
            >
              Explore Collection
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="border-emerald-600/30 px-12 py-6 rounded-full text-lg font-light hover:bg-emerald-500/5 transition-all duration-500 text-emerald-300 backdrop-blur-sm hover:border-emerald-500/50"
              size="lg"
            >
              <Play className="mr-2 w-5 h-5" />
              Watch Story
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-float-pulse">
        <div className="w-6 h-10 border-2 border-emerald-500/40 rounded-full flex justify-center backdrop-blur-sm">
          <div className="w-1 h-3 bg-emerald-400/70 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
