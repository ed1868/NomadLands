import { useState, useEffect } from "react";
import { Menu, X, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled 
        ? 'bg-slate-900/95 backdrop-blur-md shadow-xl border-b border-purple-500/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 neon-gradient rounded-lg flex items-center justify-center transition-all duration-300 glow-effect ${isScrolled ? 'shadow-lg shadow-purple-500/50' : ''}`}>
              <Bot className="text-white text-lg" />
            </div>
            <span className={`text-2xl font-bold tracking-tight transition-all duration-300 ${
              isScrolled 
                ? 'text-white' 
                : 'text-white drop-shadow-sm'
            }`}>
              AI NOMADS
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-12">
            <button
              onClick={() => scrollToSection('marketplace')}
              className={`font-semibold tracking-wide transition-all duration-300 hover:scale-105 ${
                isScrolled 
                  ? 'text-gray-300 hover:text-purple-400' 
                  : 'text-gray-300 hover:text-purple-400'
              }`}
            >
              AGENTS
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className={`font-semibold tracking-wide transition-all duration-300 hover:scale-105 ${
                isScrolled 
                  ? 'text-gray-300 hover:text-purple-400' 
                  : 'text-gray-300 hover:text-purple-400'
              }`}
            >
              FEATURES
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className={`font-semibold tracking-wide transition-all duration-300 hover:scale-105 ${
                isScrolled 
                  ? 'text-gray-300 hover:text-purple-400' 
                  : 'text-gray-300 hover:text-purple-400'
              }`}
            >
              TECH
            </button>
            <Button className="neon-gradient hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105 transition-all duration-300 border-none rounded-lg px-8 py-3 font-bold text-white glow-effect">
              GET STARTED
            </Button>
          </div>
          
          <button
            className={`md:hidden transition-colors duration-300 ${
              isScrolled ? 'text-white' : 'text-white'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden mt-6 pb-6 border-t ${isScrolled ? 'border-purple-500/30' : 'border-purple-500/30'}`}>
            <div className="flex flex-col space-y-6 pt-6">
              <button
                onClick={() => scrollToSection('marketplace')}
                className="text-gray-300 hover:text-purple-400 transition-colors text-left font-semibold tracking-wide"
              >
                AGENTS
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-300 hover:text-purple-400 transition-colors text-left font-semibold tracking-wide"
              >
                FEATURES
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-300 hover:text-purple-400 transition-colors text-left font-semibold tracking-wide"
              >
                TECH
              </button>
              <Button className="neon-gradient w-full py-4 rounded-lg font-bold text-white">
                GET STARTED
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
