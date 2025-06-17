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
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Bot className="text-white text-lg" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
              AI Nomads
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('marketplace')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Marketplace
            </button>
            <button
              onClick={() => scrollToSection('agents')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Agents
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Features
            </button>
            <Button className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:shadow-lg hover:shadow-purple-500/50 transition-all">
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
