import { Heart, Leaf, Sparkles } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Mindful Integration",
    description: "Seamlessly weave AI agents into your daily practice with intentional, conscious design that honors your workflow.",
    delay: "0s",
  },
  {
    icon: Leaf,
    title: "Sustainable Technology",
    description: "Built with environmental consciousness and energy-efficient practices that align with your values.",
    delay: "1s",
  },
  {
    icon: Sparkles,
    title: "Authentic Experience",
    description: "Each agent is crafted to enhance your natural productivity rhythm without disrupting your inner balance.",
    delay: "2s",
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-gradient-to-br from-muted/20 via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-light mb-8 text-foreground tracking-tight">Why Choose Mindful AI?</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
            Experience technology that aligns with your values and enhances your natural flow.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={index}
                className="text-center p-8 rounded-3xl glass-card animate-fade-in-up hover:shadow-xl transition-all duration-500"
                style={{ animationDelay: feature.delay }}
              >
                <div className="w-16 h-16 sage-gradient rounded-2xl mx-auto mb-6 flex items-center justify-center animate-breathe">
                  <IconComponent className="text-2xl text-white" />
                </div>
                <h3 className="text-2xl font-medium mb-4 text-foreground tracking-tight">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed font-light">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
