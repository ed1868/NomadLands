export default function UsedBySection() {
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
              className="flex items-center justify-center p-6 hover:bg-black/10 transition-all duration-500 group floating-luxury"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img
                src={company.logo}
                alt={company.name}
                className="h-8 w-auto opacity-40 group-hover:opacity-70 transition-all duration-300 group-hover:scale-110"
                style={{ maxWidth: '120px', filter: 'grayscale(100%) brightness(0.8)' }}
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