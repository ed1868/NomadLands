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
      {/* Floating particles background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-2 h-2 bg-purple-500 rounded-full animate-float" />
        <div className="absolute top-40 right-20 w-3 h-3 bg-cyan-500 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-20 w-1 h-1 bg-green-500 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-10 w-2 h-2 bg-blue-500 rounded-full animate-float" style={{ animationDelay: '3s' }} />
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <div className="animate-slide-up">
          <h1 className="text-6xl md:text-8xl font-black mb-6 leading-tight">
            The Future of{' '}
            <span className="bg-gradient-to-r from-purple-500 via-cyan-500 to-green-500 bg-clip-text text-transparent">
              AI Agents
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Discover, deploy, and scale intelligent AI agents that transform your digital workflow. 
            From email automation to social media management.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button
              onClick={scrollToMarketplace}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-105"
              size="lg"
            >
              <Rocket className="mr-2" />
              Explore Agents
            </Button>
            <Button
              variant="outline"
              className="border-white/30 px-8 py-4 rounded-full text-lg font-semibold hover:bg-white/10 transition-all"
              size="lg"
            >
              <Play className="mr-2" />
              Watch Demo
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
