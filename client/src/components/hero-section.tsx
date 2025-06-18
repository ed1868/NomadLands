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
    <section className="relative h-screen bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 flex items-center justify-center overflow-hidden">
      {/* Cinematic Fog Overlay */}
      <div className="absolute inset-0 fog-overlay" />
      
      {/* Floating fog effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/6 w-32 h-32 fog-effect rounded-full animate-float-pulse opacity-60" />
        <div className="absolute top-2/3 right-1/6 w-24 h-24 fog-effect rounded-full animate-float-pulse opacity-40" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-1/4 left-1/3 w-40 h-40 fog-effect rounded-full animate-float-pulse opacity-30" style={{ animationDelay: '4s' }} />
      </div>

      <div className="max-w-6xl mx-auto px-8 text-center relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          {/* Main Headline */}
          <h1 className="text-7xl md:text-9xl font-extralight mb-6 leading-[0.9] tracking-[-0.02em] text-white drop-shadow-2xl">
            Work Less.
            <br />
            <span className="font-light bg-gradient-to-r from-emerald-200 to-white bg-clip-text text-transparent">
              Live Smart.
            </span>
          </h1>
          
          {/* Subheadline */}
          <p className={`text-xl md:text-2xl text-emerald-100 mb-16 max-w-4xl mx-auto leading-relaxed font-light transition-all duration-1000 drop-shadow-lg ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '300ms' }}>
            Premium AI agents crafted for the modern nomad lifestyle. 
            <br className="hidden md:block" />
            Effortless automation that travels with you.
          </p>
          
          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`} style={{ transitionDelay: '600ms' }}>
            <Button
              onClick={scrollToMarketplace}
              className="bg-white/95 hover:bg-white px-10 py-6 rounded-full text-lg font-medium hover:shadow-2xl transition-all duration-500 transform hover:scale-105 text-emerald-900 border-none magnetic-hover"
              size="lg"
            >
              Explore Agents
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="border-white/40 px-10 py-6 rounded-full text-lg font-medium hover:bg-white/10 transition-all duration-300 text-white backdrop-blur-sm magnetic-hover"
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
        <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center backdrop-blur-sm">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
