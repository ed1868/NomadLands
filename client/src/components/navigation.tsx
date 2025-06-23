import { useState, useEffect } from "react";
import { Menu, X, Bot, Wallet, User, LogOut, Settings } from "lucide-react";
import aiNomadsLogo from "@assets/log_1750270769527.png";
import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { address, isConnected, isConnecting, connectWallet, disconnectWallet, formatAddress } = useWallet();
  const { user, isLoading: isUserLoading } = useAuth();

  const handleLogout = async () => {
    try {
      // Call logout endpoint
      await fetch("/api/logout");
      // Clear local storage
      localStorage.removeItem('token');
      // Redirect to main landing page
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      // Still redirect even if API call fails
      localStorage.removeItem('token');
      window.location.href = "/";
    }
  };

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
            <div className={`w-10 h-10 flex items-center justify-center transition-all duration-500 ${isScrolled ? 'shadow-lg' : ''}`}>
              <img 
                src={aiNomadsLogo} 
                alt="AI Nomads"
                className="w-8 h-8 object-contain"
              />
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
              href="/nomad-lands"
              className={`font-extralight tracking-wide transition-all duration-500 ${
                isScrolled 
                  ? 'text-gray-500 hover:text-gray-300' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Nomad Lands
            </a>
            <a
              href="/smart-contracts"
              className={`font-extralight tracking-wide transition-all duration-500 ${
                isScrolled 
                  ? 'text-gray-500 hover:text-gray-300' 
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              Smart Contracts
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
            
            {/* User Authentication or Wallet Connection */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="relative h-10 w-10 rounded-full bg-slate-800/50 border border-gray-700 hover:border-emerald-500/50 transition-all duration-300"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImageUrl} alt={user.username || user.email} />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-blue-600 text-white text-sm">
                        {(user.firstName && user.lastName) 
                          ? `${user.firstName[0]}${user.lastName[0]}` 
                          : user.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-56 bg-slate-900/95 border border-gray-700 backdrop-blur-xl" 
                  align="end" 
                  forceMount
                >
                  <div className="flex items-center justify-start gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.profileImageUrl} alt={user.username || user.email} />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-blue-600 text-white text-sm">
                        {(user.firstName && user.lastName) 
                          ? `${user.firstName[0]}${user.lastName[0]}` 
                          : user.username?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium text-white">
                        {user.firstName && user.lastName 
                          ? `${user.firstName} ${user.lastName}` 
                          : user.username || 'User'}
                      </p>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem asChild>
                    <a href="/dashboard" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                      <User className="h-4 w-4" />
                      Dashboard
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/settings" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                      <Settings className="h-4 w-4" />
                      Settings
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-gray-700" />
                  <DropdownMenuItem 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : isConnected ? (
              <div className="flex items-center space-x-3">
                <a
                  href="/signin"
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  Sign In
                </a>
                <button
                  onClick={disconnectWallet}
                  className="flex items-center space-x-2 bg-emerald-900/40 border border-emerald-700/50 rounded px-4 py-2 font-light text-emerald-300 backdrop-blur-sm hover:bg-emerald-900/60 hover:border-emerald-600/70 transition-all duration-300"
                >
                  <Wallet className="w-4 h-4" />
                  <span className="text-sm">{address && formatAddress(address)}</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <a
                  href="/signin"
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  Sign In
                </a>
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
              </div>
            )}
            
            {!user && (
              <a
                href="/signup"
                className="obsidian-gradient hover:shadow-lg hover:shadow-gray-900/30 transition-all duration-500 border border-gray-700 rounded px-6 py-2 font-light text-gray-300 backdrop-blur-sm hover:border-gray-600"
              >
                Deploy
              </a>
            )}
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
                href="/nomad-lands"
                className="text-gray-500 hover:text-gray-300 transition-colors text-left font-extralight tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                Nomad Lands
              </a>
              <a
                href="/smart-contracts"
                className="text-gray-500 hover:text-gray-300 transition-colors text-left font-extralight tracking-wide"
                onClick={() => setIsMenuOpen(false)}
              >
                Smart Contracts
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
              
              {/* Sign In link for mobile */}
              {!user && (
                <a
                  href="/signin"
                  className="text-emerald-400 hover:text-emerald-300 transition-colors text-left font-medium tracking-wide"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </a>
              )}
              
              {/* Dashboard link for mobile */}
              {user && (
                <a
                  href="/dashboard"
                  className="text-gray-500 hover:text-gray-300 transition-colors text-left font-extralight tracking-wide"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </a>
              )}
              
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
