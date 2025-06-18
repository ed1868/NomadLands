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
    { name: "Google", logo: "https://logos-world.net/wp-content/uploads/2020/09/Google-Logo.png" },
    { name: "Microsoft", logo: "https://logoeps.com/wp-content/uploads/2013/03/microsoft-vector-logo.png" },
    { name: "Apple", logo: "https://logos-world.net/wp-content/uploads/2020/04/Apple-Logo.png" },
    { name: "Amazon", logo: "https://logos-world.net/wp-content/uploads/2020/04/Amazon-Logo.png" },
    { name: "Meta", logo: "https://logos-world.net/wp-content/uploads/2021/10/Meta-Logo.png" },
    { name: "Netflix", logo: "https://logos-world.net/wp-content/uploads/2020/04/Netflix-Logo.png" },
    { name: "Tesla", logo: "https://logos-world.net/wp-content/uploads/2021/08/Tesla-Logo.png" },
    { name: "Spotify", logo: "https://logos-world.net/wp-content/uploads/2020/06/Spotify-Logo.png" }
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
          <h2 className="text-4xl md:text-6xl font-extralight mb-8 text-gray-200 tracking-wide fade-in-luxury">
            Trusted by Industry Leaders
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto font-extralight leading-relaxed">
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
              className="flex flex-col items-center justify-center p-8 bg-black/30 border border-gray-800/60 rounded-lg hover:border-gray-600/60 hover:bg-black/40 transition-all duration-500 group hover:scale-105 floating-luxury backdrop-blur-sm"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={company.logo}
                alt={company.name}
                className="h-12 w-auto opacity-60 group-hover:opacity-90 transition-all duration-300 group-hover:scale-110 mb-3"
                style={{ maxWidth: '150px', filter: 'grayscale(100%) brightness(1.2)' }}
              />
              <span className="text-gray-500 group-hover:text-gray-300 text-xs font-extralight transition-colors duration-300">
                {company.name}
              </span>
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