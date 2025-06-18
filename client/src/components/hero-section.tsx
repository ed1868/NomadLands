import { useEffect, useState, useRef } from "react";
import { ArrowRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import backgroundImage from '@assets/back_1750268064928.png';

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

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

  // Motion sensor scroll effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2, rootMargin: '0px 0px -20% 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50"></div>
      
      {/* Motion sensor lighting effect */}
      <div className={`absolute inset-0 transition-all duration-1000 ${
        isInView 
          ? 'bg-gradient-to-br from-emerald-500/8 via-transparent to-emerald-400/15 border-t border-emerald-500/30' 
          : 'bg-transparent border-t border-gray-900/50'
      }`}></div>
      
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60"></div>
      
      {/* Additional atmospheric layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40"></div>
      
      {/* Subtle depth effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_60%)]"></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className={`${isVisible ? 'fade-in-luxury' : 'opacity-0'}`}>
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extralight mb-6 sm:mb-8 leading-[0.9] tracking-wide text-white drop-shadow-2xl">
            AI
            <br />
            <span className="knight-text font-light text-emerald-300 drop-shadow-lg">
              Nomads
            </span>
          </h1>
          
          {/* Subheadline */}
          <div className={`${isVisible ? 'slide-up-luxury' : 'opacity-0'}`} style={{ animationDelay: '0.4s' }}>
            <div className="backdrop-blur-sm bg-black/30 border border-emerald-900/40 rounded-xl px-8 py-6 mb-12 sm:mb-16 max-w-4xl mx-auto shadow-2xl">
              <p className="text-lg sm:text-xl md:text-2xl text-white mb-2 leading-relaxed font-light drop-shadow-lg">
                Wander where machines meet magic.
              </p>
              <p className="text-base sm:text-lg md:text-xl text-emerald-200 leading-relaxed font-extralight drop-shadow-md">
                Built in the shadows. Born to disrupt.
              </p>
            </div>
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
