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
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://img.freepik.com/premium-photo/abstract-background-design-hd-dark-dark-cal-poly-green-color_851755-34811.jpg?semt=ais_hybrid&w=740)'
        }}
      ></div>
      
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      {/* Additional atmospheric layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
      
      {/* Subtle depth effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_60%)]"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className={`${isVisible ? 'fade-in-luxury' : 'opacity-0'}`}>
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extralight mb-6 sm:mb-8 leading-[0.9] tracking-wide text-gray-200">
            AI
            <br />
            <span className="knight-text font-light">
              Nomads
            </span>
          </h1>
          
          {/* Subheadline */}
          <div className={`${isVisible ? 'slide-up-luxury' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
            <p className="text-base sm:text-lg md:text-xl text-gray-500 mb-12 sm:mb-16 max-w-4xl mx-auto leading-relaxed font-extralight px-4">
              Wander where machines meet magic.
              <br className="hidden md:block" />
              <span className="text-gray-400">Built in the shadows. Born to disrupt.</span>
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center ${isVisible ? 'slide-up-luxury' : 'opacity-0'}`} style={{ animationDelay: '0.8s' }}>
            <Button
              onClick={scrollToMarketplace}
              className="obsidian-gradient px-8 sm:px-10 py-4 sm:py-5 rounded border border-gray-800 text-base sm:text-lg font-light hover:border-emerald-800 hover:shadow-2xl hover:shadow-emerald-900/30 transition-all duration-700 text-gray-300 backdrop-blur-sm w-full sm:w-auto"
              size="lg"
            >
              Enter the Shadows
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              className="bg-transparent border-gray-700 px-8 sm:px-10 py-4 sm:py-5 rounded text-base sm:text-lg font-extralight transition-all duration-500 text-gray-400 hover:text-gray-300 hover:border-gray-600 backdrop-blur-sm w-full sm:w-auto"
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
