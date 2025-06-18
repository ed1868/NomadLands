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
        ? 'bg-black/98 backdrop-blur-xl modern-shadow border-b border-green-400/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-12 h-12 bright-gradient rounded-2xl flex items-center justify-center transition-all duration-300 elastic-hover ${isScrolled ? 'bright-border' : ''}`}>
              <Bot className="text-white text-xl" />
            </div>
            <span className={`text-3xl font-black tracking-tight transition-all duration-300 ${
              isScrolled 
                ? 'text-white' 
                : 'text-white drop-shadow-lg'
            }`}>
              AI NOMADS
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('marketplace')}
              className={`font-bold tracking-wide transition-all duration-300 elastic-hover ${
                isScrolled 
                  ? 'text-white hover:text-green-400' 
                  : 'text-white hover:text-green-400'
              }`}
            >
              AGENTS
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className={`font-bold tracking-wide transition-all duration-300 elastic-hover ${
                isScrolled 
                  ? 'text-white hover:text-green-400' 
                  : 'text-white hover:text-green-400'
              }`}
            >
              FEATURES
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className={`font-bold tracking-wide transition-all duration-300 elastic-hover ${
                isScrolled 
                  ? 'text-white hover:text-green-400' 
                  : 'text-white hover:text-green-400'
              }`}
            >
              ABOUT
            </button>
            <Button className="bright-gradient hover:shadow-xl hover:shadow-green-500/40 transition-all duration-300 border-none rounded-full px-10 py-4 font-black text-white elastic-hover pulse-bright">
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
          <div className={`md:hidden mt-6 pb-6 border-t ${isScrolled ? 'border-green-400/30' : 'border-green-400/30'}`}>
            <div className="flex flex-col space-y-6 pt-6">
              <button
                onClick={() => scrollToSection('marketplace')}
                className="text-white hover:text-green-400 transition-colors text-left font-bold tracking-wide"
              >
                AGENTS
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-white hover:text-green-400 transition-colors text-left font-bold tracking-wide"
              >
                FEATURES
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-white hover:text-green-400 transition-colors text-left font-bold tracking-wide"
              >
                ABOUT
              </button>
              <Button className="bright-gradient w-full py-4 rounded-full font-black text-white">
                GET STARTED
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
