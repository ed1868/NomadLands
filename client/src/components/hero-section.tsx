import { Play, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import Carousel3D from "@/components/carousel-3d";

export default function HeroSection() {
  const scrollToMarketplace = () => {
    const element = document.getElementById('marketplace');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen aggressive-mesh flex items-center justify-center overflow-hidden">
      {/* Dynamic floating elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-6 h-6 electric-gradient rounded-full animate-float animate-power-glow" />
        <div className="absolute top-40 right-20 w-8 h-8 fire-gradient rounded-full animate-float animate-aggressive-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-20 w-4 h-4 cosmic-gradient rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-10 w-7 h-7 forest-gradient rounded-full animate-float animate-power-glow" style={{ animationDelay: '3s' }} />
        <div className="absolute top-60 left-1/2 w-5 h-5 sage-gradient rounded-full animate-float animate-aggressive-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <div className="animate-slide-up">
          <h1 className="text-7xl md:text-9xl font-black mb-8 leading-tight tracking-tight">
            AGGRESSIVE{' '}
            <span className="bg-gradient-to-r from-orange-500 via-green-600 to-purple-600 bg-clip-text text-transparent font-black animate-shimmer">
              MINDFULNESS
            </span>
          </h1>
          <p className="text-2xl md:text-3xl text-foreground mb-12 max-w-4xl mx-auto leading-relaxed font-medium">
            Unleash AI agents that dominate your workflow while honoring your inner zen. 
            <span className="electric-gradient bg-clip-text text-transparent font-bold">Power meets purpose.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <Button
              onClick={scrollToMarketplace}
              className="electric-gradient px-12 py-6 rounded-full text-xl font-bold hover:shadow-2xl hover:shadow-green-500/40 transition-all duration-300 transform hover:scale-110 text-white animate-power-glow"
              size="lg"
            >
              <Rocket className="mr-3 text-xl" />
              UNLEASH THE POWER
            </Button>
            <Button
              variant="outline"
              className="border-foreground/40 px-12 py-6 rounded-full text-xl font-bold hover:bg-foreground/10 transition-all duration-300 fire-gradient text-white border-none"
              size="lg"
            >
              <Play className="mr-3 text-xl" />
              WITNESS THE FLOW
            </Button>
          </div>
        </div>
      </div>

      {/* 3D Carousel */}
      <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
        <Carousel3D />
      </div>
    </section>
  );
}
