export default function UsedBySection() {
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
    <section className="py-20 bg-gradient-to-br from-gray-950 via-black to-emerald-950/10">
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8 items-center">
          {companies.map((company, index) => (
            <div
              key={company.name}
              className="flex items-center justify-center p-6 bg-black/20 border border-gray-800 rounded-lg backdrop-blur-sm hover:border-gray-700 transition-all duration-500 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={company.logo}
                alt={company.name}
                className="h-8 w-auto filter brightness-0 invert opacity-40 group-hover:opacity-60 transition-opacity duration-300"
                style={{ maxWidth: '120px' }}
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