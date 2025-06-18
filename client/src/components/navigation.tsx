import { useState, useEffect } from "react";
import { Menu, X, Bot, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { address, isConnected, isConnecting, connectWallet, disconnectWallet, formatAddress } = useWallet();

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
          <a href="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity duration-300">
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
          </a>
          
          <div className="hidden md:flex items-center space-x-6">
            <a
              href="/marketplace"
              className={`font-extralight tracking-wide transition-all duration-500 ${
                isScrolled 
                  ? 'text-gray-500 hover:text-gray-300' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Marketplace
            </a>
            <a
              href="/nomad-fleets"
              className={`font-extralight tracking-wide transition-all duration-500 ${
                isScrolled 
                  ? 'text-gray-500 hover:text-gray-300' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Nomad Fleets
            </a>
            <a
              href="/api-docs"
              className={`font-extralight tracking-wide transition-all duration-500 ${
                isScrolled 
                  ? 'text-gray-500 hover:text-gray-300' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              API
            </a>
            
            {/* Dashboard link for connected users */}
            {isConnected && (
              <a
                href="/dashboard"
                className={`font-extralight tracking-wide transition-all duration-500 ${
                  isScrolled 
                    ? 'text-gray-500 hover:text-gray-300' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                Dashboard
              </a>
            )}
            
            {/* Wallet Connection */}
            {isConnected ? (
              <button
                onClick={disconnectWallet}
                className="flex items-center space-x-2 bg-emerald-900/40 border border-emerald-700/50 rounded px-4 py-2 font-light text-emerald-300 backdrop-blur-sm hover:bg-emerald-900/60 hover:border-emerald-600/70 transition-all duration-300"
              >
                <Wallet className="w-4 h-4" />
                <span className="text-sm">{address && formatAddress(address)}</span>
              </button>
            ) : (
              <button
                onClick={connectWallet}
                disabled={isConnecting}
                className="flex items-center space-x-2 bg-black/40 border border-gray-700 rounded px-4 py-2 font-light text-gray-300 backdrop-blur-sm hover:border-gray-600 hover:bg-black/60 transition-all duration-300 disabled:opacity-50"
              >
                <Wallet className="w-4 h-4" />
                <span className="text-sm">
                  {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                </span>
              </button>
            )}
            
            <a
              href="/signup"
              className="obsidian-gradient hover:shadow-lg hover:shadow-gray-900/30 transition-all duration-500 border border-gray-700 rounded px-6 py-2 font-light text-gray-300 backdrop-blur-sm hover:border-gray-600"
            >
              Deploy
            </a>
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
              <a
                href="/marketplace"
                className="text-gray-500 hover:text-gray-300 transition-colors text-left font-extralight tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                Marketplace
              </a>
              <a
                href="/nomad-fleets"
                className="text-gray-500 hover:text-gray-300 transition-colors text-left font-extralight tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                Nomad Fleets
              </a>
              <a
                href="/api-docs"
                className="text-gray-500 hover:text-gray-300 transition-colors text-left font-extralight tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                API
              </a>
              
              {/* Mobile Wallet Connection */}
              {isConnected ? (
                <button
                  onClick={() => {
                    disconnectWallet();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 bg-emerald-900/40 border border-emerald-700/50 rounded px-4 py-3 font-light text-emerald-300 backdrop-blur-sm w-full"
                >
                  <Wallet className="w-4 h-4" />
                  <span className="text-sm">{address && formatAddress(address)}</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    connectWallet();
                    setIsMenuOpen(false);
                  }}
                  disabled={isConnecting}
                  className="flex items-center space-x-2 bg-black/40 border border-gray-700 rounded px-4 py-3 font-light text-gray-300 backdrop-blur-sm w-full disabled:opacity-50"
                >
                  <Wallet className="w-4 h-4" />
                  <span className="text-sm">
                    {isConnecting ? 'Connecting...' : 'Connect Wallet'}
                  </span>
                </button>
              )}
              
              <a
                href="/signup"
                className="obsidian-gradient w-full py-3 rounded border border-gray-700 font-light text-gray-300 backdrop-blur-sm block text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                Deploy
              </a>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
