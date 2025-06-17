import { useState } from "react";
import { Menu, X, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-card border-b-2 border-orange-400/20">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 electric-gradient rounded-2xl flex items-center justify-center animate-aggressive-pulse shadow-lg">
              <Bot className="text-white text-xl" />
            </div>
            <span className="text-3xl font-black bg-gradient-to-r from-orange-500 via-green-600 to-purple-600 bg-clip-text text-transparent">
              AI NOMADS
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('marketplace')}
              className="text-foreground hover:text-orange-600 transition-colors duration-300 font-bold text-lg"
            >
              ARSENAL
            </button>
            <button
              onClick={() => scrollToSection('agents')}
              className="text-foreground hover:text-orange-600 transition-colors duration-300 font-bold text-lg"
            >
              WARRIORS
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-foreground hover:text-orange-600 transition-colors duration-300 font-bold text-lg"
            >
              POWER
            </button>
            <Button className="fire-gradient hover:shadow-xl hover:shadow-orange-500/40 transition-all duration-300 text-white rounded-full px-8 py-3 font-bold text-lg animate-power-glow">
              DOMINATE NOW
            </Button>
          </div>
          
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-white/10">
            <div className="flex flex-col space-y-4 pt-4">
              <button
                onClick={() => scrollToSection('marketplace')}
                className="text-gray-300 hover:text-white transition-colors text-left"
              >
                Marketplace
              </button>
              <button
                onClick={() => scrollToSection('agents')}
                className="text-gray-300 hover:text-white transition-colors text-left"
              >
                Agents
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-300 hover:text-white transition-colors text-left"
              >
                Features
              </button>
              <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 w-full">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
