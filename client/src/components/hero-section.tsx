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
    <section className="relative min-h-screen gradient-mesh flex items-center justify-center overflow-hidden">
      {/* Floating organic elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-3 h-3 bg-green-400/40 rounded-full animate-float blur-sm" />
        <div className="absolute top-40 right-20 w-4 h-4 bg-stone-400/30 rounded-full animate-float blur-sm" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 left-20 w-2 h-2 bg-rose-300/40 rounded-full animate-float blur-sm" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-20 right-10 w-3 h-3 bg-blue-300/30 rounded-full animate-float blur-sm" style={{ animationDelay: '6s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <div className="animate-fade-in-up">
          <h1 className="text-6xl md:text-8xl font-light mb-8 leading-tight tracking-tight">
            Mindful{' '}
            <span className="bg-gradient-to-r from-green-600 via-green-500 to-stone-600 bg-clip-text text-transparent font-medium">
              AI Nomads
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed font-light">
            Discover intelligent agents that flow seamlessly into your digital practice. 
            Designed for intentional living and mindful productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              onClick={scrollToMarketplace}
              className="sage-gradient px-8 py-4 rounded-full text-lg font-medium hover:shadow-xl hover:shadow-green-500/20 transition-all duration-500 transform hover:scale-105 text-white"
              size="lg"
            >
              <Rocket className="mr-2" />
              Explore Collection
            </Button>
            <Button
              variant="outline"
              className="border-muted-foreground/30 px-8 py-4 rounded-full text-lg font-medium hover:bg-muted/50 transition-all duration-300"
              size="lg"
            >
              <Play className="mr-2" />
              Experience
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
