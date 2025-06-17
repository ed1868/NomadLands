import { Rocket, Shield, Settings } from "lucide-react";

const features = [
  {
    icon: Rocket,
    title: "Lightning Fast Deployment",
    description: "Deploy AI agents in minutes, not months. Our streamlined process gets you up and running instantly.",
    delay: "0s",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description: "Bank-level encryption and security protocols ensure your data remains protected at all times.",
    delay: "1s",
  },
  {
    icon: Settings,
    title: "Seamless Integration",
    description: "Connect with your existing tools and workflows through our extensive API and integration library.",
    delay: "2s",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 bg-gradient-to-r from-slate-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-6 text-white">Why Choose AI Nomads?</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience the next generation of AI automation with our cutting-edge agent marketplace.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="text-center p-8 rounded-2xl glass-card"
                style={{ animationDelay: feature.delay }}
              >
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-2xl mx-auto mb-6 flex items-center justify-center animate-glow">
                  <IconComponent className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
