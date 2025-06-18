import { useState, useEffect } from "react";
import { Menu, X, Sparkles } from "lucide-react";
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
        ? 'bg-white/95 backdrop-blur-md shadow-xl border-b border-emerald-100/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 forest-gradient rounded-xl flex items-center justify-center transition-all duration-300 ${isScrolled ? 'shadow-lg' : ''}`}>
              <Sparkles className="text-white text-lg" />
            </div>
            <span className={`text-2xl font-light tracking-tight transition-all duration-300 ${
              isScrolled 
                ? 'text-emerald-900' 
                : 'text-white drop-shadow-sm'
            }`}>
              AI Nomads
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-12">
            <button
              onClick={() => scrollToSection('marketplace')}
              className={`font-light tracking-wide transition-all duration-300 hover:scale-105 ${
                isScrolled 
                  ? 'text-emerald-600 hover:text-emerald-900' 
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              Collection
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className={`font-light tracking-wide transition-all duration-300 hover:scale-105 ${
                isScrolled 
                  ? 'text-emerald-600 hover:text-emerald-900' 
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className={`font-light tracking-wide transition-all duration-300 hover:scale-105 ${
                isScrolled 
                  ? 'text-emerald-600 hover:text-emerald-900' 
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              Story
            </button>
            <Button className={`${isScrolled ? 'forest-gradient text-white' : 'bg-white/95 hover:bg-white text-emerald-900'} hover:shadow-xl hover:scale-105 transition-all duration-500 border-none rounded-full px-8 py-3 font-medium magnetic-hover`}>
              Start Journey
            </Button>
          </div>
          
          <button
            className={`md:hidden transition-colors duration-300 ${
              isScrolled ? 'text-emerald-900' : 'text-white'
            }`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden mt-6 pb-6 border-t ${isScrolled ? 'border-emerald-100/30' : 'border-white/30'}`}>
            <div className="flex flex-col space-y-6 pt-6">
              <button
                onClick={() => scrollToSection('marketplace')}
                className={`${isScrolled ? 'text-emerald-600 hover:text-emerald-900' : 'text-emerald-100 hover:text-white'} transition-colors text-left font-light tracking-wide`}
              >
                Collection
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className={`${isScrolled ? 'text-emerald-600 hover:text-emerald-900' : 'text-emerald-100 hover:text-white'} transition-colors text-left font-light tracking-wide`}
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className={`${isScrolled ? 'text-emerald-600 hover:text-emerald-900' : 'text-emerald-100 hover:text-white'} transition-colors text-left font-light tracking-wide`}
              >
                Story
              </button>
              <Button className={`${isScrolled ? 'forest-gradient text-white' : 'bg-white/95 text-emerald-900'} w-full py-4 rounded-full font-medium`}>
                Start Journey
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
