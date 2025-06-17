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
    <nav className="fixed top-0 w-full z-50 glass-card">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 sage-gradient rounded-2xl flex items-center justify-center animate-breathe">
              <Bot className="text-white text-lg" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent">
              AI Nomads
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('marketplace')}
              className="text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Marketplace
            </button>
            <button
              onClick={() => scrollToSection('agents')}
              className="text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Agents
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-muted-foreground hover:text-foreground transition-colors duration-300"
            >
              Features
            </button>
            <Button className="sage-gradient hover:shadow-lg hover:shadow-green-500/20 transition-all duration-300 text-white rounded-full px-6">
              Get Started
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
