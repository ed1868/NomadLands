import { Zap, Shield, Target } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "LIGHTNING EXECUTION",
    description: "Ruthlessly fast deployment with zen precision. Your agents launch with unstoppable force while maintaining spiritual alignment.",
    delay: "0s",
  },
  {
    icon: Shield,
    title: "FORTRESS SECURITY",
    description: "Military-grade protection meets mindful data handling. Your digital sanctuary remains impenetrable yet conscious.",
    delay: "0.3s",
  },
  {
    icon: Target,
    title: "LASER FOCUS",
    description: "Aggressive targeting of inefficiencies combined with mindful workflow integration. Dominate chaos, embrace flow.",
    delay: "0.6s",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-32 gradient-mesh relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-5xl md:text-6xl font-black mb-8 text-foreground tracking-tight">WHY WE DOMINATE</h2>
          <p className="text-2xl md:text-3xl text-foreground max-w-4xl mx-auto font-bold leading-relaxed">
            Experience <span className="fire-gradient bg-clip-text text-transparent">aggressive technology</span> that honors your values and amplifies your natural power.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="text-center p-10 rounded-3xl glass-card animate-fade-in-up hover:shadow-2xl transition-all duration-700 border-2 border-transparent hover:border-orange-400/40 group"
                style={{ animationDelay: feature.delay }}
              >
                <div className="w-20 h-20 fire-gradient rounded-2xl mx-auto mb-8 flex items-center justify-center animate-aggressive-pulse shadow-xl group-hover:animate-power-glow">
                  <IconComponent className="text-3xl text-white" />
                </div>
                <h3 className="text-3xl font-black mb-6 text-foreground tracking-tight group-hover:text-orange-600 transition-colors duration-300">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-bold text-lg">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
