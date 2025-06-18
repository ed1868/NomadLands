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
        ? 'bg-slate-900/95 backdrop-blur-xl luxury-shadow border-b border-emerald-600/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 obsidian-gradient rounded border border-gray-700 flex items-center justify-center transition-all duration-500 backdrop-blur-sm ${isScrolled ? 'shadow-lg' : ''}`}>
              <Bot className="text-gray-300 text-lg" />
            </div>
            <span className={`text-xl font-extralight tracking-wide transition-all duration-500 ${
              isScrolled 
                ? 'text-gray-200' 
                : 'text-gray-200 drop-shadow-sm'
            }`}>
              AI <span className="knight-text font-light">Nomads</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-10">
            <button
              onClick={() => scrollToSection('marketplace')}
              className={`font-extralight tracking-wide transition-all duration-500 ${
                isScrolled 
                  ? 'text-gray-500 hover:text-gray-300' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Archives
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className={`font-extralight tracking-wide transition-all duration-500 ${
                isScrolled 
                  ? 'text-gray-500 hover:text-gray-300' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Arsenal
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className={`font-extralight tracking-wide transition-all duration-500 ${
                isScrolled 
                  ? 'text-gray-500 hover:text-gray-300' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Origins
            </button>
            <Button className="obsidian-gradient hover:shadow-lg hover:shadow-gray-900/30 transition-all duration-500 border border-gray-700 rounded px-6 py-2 font-light text-gray-300 backdrop-blur-sm hover:border-gray-600">
              Deploy
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
          <div className={`md:hidden mt-6 pb-6 border-t ${isScrolled ? 'border-gray-800' : 'border-gray-800'}`}>
            <div className="flex flex-col space-y-6 pt-6">
              <button
                onClick={() => scrollToSection('marketplace')}
                className="text-gray-500 hover:text-gray-300 transition-colors text-left font-extralight tracking-wide"
              >
                Archives
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-500 hover:text-gray-300 transition-colors text-left font-extralight tracking-wide"
              >
                Arsenal
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="text-gray-500 hover:text-gray-300 transition-colors text-left font-extralight tracking-wide"
              >
                Origins
              </button>
              <Button className="obsidian-gradient w-full py-3 rounded border border-gray-700 font-light text-gray-300 backdrop-blur-sm">
                Deploy
              </Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
