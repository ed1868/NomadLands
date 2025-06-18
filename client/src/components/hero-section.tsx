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
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Dark Knight background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-950 to-black"></div>
      
      {/* Moody atmospheric layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60"></div>
      
      {/* Subtle fog/mist effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-emerald-900/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-slate-800/20 rounded-full blur-3xl"></div>
      </div>
      
      {/* Shadows and depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_70%)]"></div>

      <div className="max-w-6xl mx-auto px-8 text-center relative z-10">
        <div className={`${isVisible ? 'fade-in-luxury' : 'opacity-0'}`}>
          {/* Main Headline */}
          <h1 className="text-5xl md:text-7xl font-extralight mb-8 leading-[0.9] tracking-wide text-gray-200">
            AI
            <br />
            <span className="knight-text font-light">
              Nomads
            </span>
          </h1>
          
          {/* Subheadline */}
          <div className={`${isVisible ? 'slide-up-luxury' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
            <p className="text-lg md:text-xl text-gray-500 mb-16 max-w-4xl mx-auto leading-relaxed font-extralight">
              In the shadows of innovation.
              <br className="hidden md:block" />
              <span className="text-gray-400">Where darkness meets intelligence.</span>
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center ${isVisible ? 'slide-up-luxury' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
            <Button
              onClick={scrollToMarketplace}
              className="obsidian-gradient px-10 py-5 rounded border border-gray-800 text-lg font-light hover:border-emerald-800 hover:shadow-2xl hover:shadow-emerald-900/30 transition-all duration-700 text-gray-300 backdrop-blur-sm"
              size="lg"
            >
              Enter the Shadows
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border-gray-700 px-10 py-5 rounded text-lg font-extralight transition-all duration-500 text-gray-400 hover:text-gray-300 hover:border-gray-600 backdrop-blur-sm"
              size="lg"
            >
              <Play className="mr-2 w-4 h-4" />
              Witness Power
            </Button>
          </div>
        </div>
      </div>

      {/* Dark scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-10 border border-gray-700 rounded-full flex justify-center backdrop-blur-sm">
          <div className="w-0.5 h-3 bg-gray-600 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
}
