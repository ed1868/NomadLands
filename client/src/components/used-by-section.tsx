import { useEffect, useRef, useState } from "react";
import backgroundImage from '@assets/back_1750268064928.png';

export default function UsedBySection() {
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2, rootMargin: '0px 0px -20% 0px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);
  const companies = [
    { name: "Google", logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
    { name: "Microsoft", logo: "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg" },
    { name: "Apple", logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
    { name: "Amazon", logo: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
    { name: "Meta", logo: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
    { name: "Netflix", logo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
    { name: "Tesla", logo: "https://upload.wikimedia.org/wikipedia/commons/b/bb/Tesla_T_symbol.svg" },
    { name: "Spotify", logo: "https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg" }
  ];

  return (
    <section 
      ref={sectionRef}
      className="relative py-20 overflow-hidden"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/50"></div>
      
      <div className={`absolute inset-0 transition-all duration-1000 ${
        isInView 
          ? 'bg-gradient-to-br from-purple-500/5 via-transparent to-purple-400/10 border-t border-purple-500/20' 
          : 'bg-transparent border-t border-gray-900/50'
      }`}></div>
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-extralight mb-8 text-white tracking-wide fade-in-luxury">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg md:text-xl text-white max-w-3xl mx-auto font-extralight leading-relaxed">
            The world's most innovative companies deploy our AI agents
            <br className="hidden md:block" />
            <span className="knight-text font-light">to transform their operations.</span>
          </p>
        </div>

        {/* Company Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 items-center">
          {companies.map((company, index) => (
            <div
              key={company.name}
              className="flex items-center justify-center h-24 p-8 bg-black/40 border border-white/20 rounded-lg hover:border-emerald-500/50 hover:bg-black/60 transition-all duration-500 group backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={company.logo}
                alt={company.name}
                className="h-6 w-auto opacity-60 group-hover:opacity-90 transition-all duration-300 group-hover:scale-105"
                style={{ 
                  maxWidth: '100px', 
                  filter: 'brightness(0) invert(1) opacity(0.7)' 
                }}
              />
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          <div className="text-center bg-black/20 border border-gray-800 rounded-lg p-8 backdrop-blur-sm">
            <div className="text-4xl font-extralight knight-text mb-2">500K+</div>
            <div className="text-gray-400 font-extralight">AI Agents Deployed</div>
          </div>
          <div className="text-center bg-black/20 border border-gray-800 rounded-lg p-8 backdrop-blur-sm">
            <div className="text-4xl font-extralight knight-text mb-2">99.9%</div>
            <div className="text-gray-400 font-extralight">Uptime Guarantee</div>
          </div>
          <div className="text-center bg-black/20 border border-gray-800 rounded-lg p-8 backdrop-blur-sm">
            <div className="text-4xl font-extralight knight-text mb-2">24/7</div>
            <div className="text-gray-400 font-extralight">Enterprise Support</div>
          </div>
        </div>
      </div>
    </section>
  );
}