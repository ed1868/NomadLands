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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ${
      isScrolled 
        ? 'bg-slate-900/95 backdrop-blur-xl shadow-2xl border-b border-emerald-600/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 forest-gradient rounded-full flex items-center justify-center transition-all duration-500 ${isScrolled ? 'shadow-lg shadow-emerald-500/30' : ''}`}>
              <Bot className="text-white text-lg" />
            </div>
            <span className={`text-2xl font-light tracking-wide transition-all duration-500 ${
              isScrolled 
                ? 'text-white' 
                : 'text-white drop-shadow-sm'
            }`}>
              AI Nomads
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-12">
            <button
              onClick={() => scrollToSection('marketplace')}
              className={`font-light tracking-wide transition-all duration-500 hover:scale-105 ${
                isScrolled 
                  ? 'text-gray-300 hover:text-emerald-400' 
                  : 'text-gray-300 hover:text-emerald-400'
              }`}
            >
              Collection
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className={`font-light tracking-wide transition-all duration-500 hover:scale-105 ${
                isScrolled 
                  ? 'text-gray-300 hover:text-emerald-400' 
                  : 'text-gray-300 hover:text-emerald-400'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className={`font-light tracking-wide transition-all duration-500 hover:scale-105 ${
                isScrolled 
                  ? 'text-gray-300 hover:text-emerald-400' 
                  : 'text-gray-300 hover:text-emerald-400'
              }`}
            >
              Story
            </button>
            <Button className="forest-gradient hover:shadow-xl hover:shadow-emerald-500/30 hover:scale-105 transition-all duration-500 border-none rounded-full px-8 py-3 font-medium text-white magnetic-hover">
              Begin Journey
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
          <div className={`md:hidden mt-6 pb-6 border-t ${isScrolled ? 'border-emerald-600/30' : 'border-emerald-600/30'}`}>
            <div className="flex flex-col space-y-6 pt-6">
              <button
                onClick={() => scrollToSection('marketplace')}
                className="text-gray-300 hover:text-emerald-400 transition-colors text-left font-light tracking-wide"
              >
                Collection
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-300 hover:text-emerald-400 transition-colors text-left font-light tracking-wide"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-300 hover:text-emerald-400 transition-colors text-left font-light tracking-wide"
              >
                Story
              </button>
              <Button className="forest-gradient w-full py-4 rounded-full font-medium text-white">
                Begin Journey
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
