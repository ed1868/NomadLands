import { Heart, Leaf, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import backgroundImage from '@assets/back_1750268064928.png';

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

  return (
    <section 
      ref={sectionRef}
      id="features" 
      className="relative py-24 overflow-hidden"
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
          ? 'bg-gradient-to-br from-blue-500/5 via-transparent to-blue-400/10 border-t border-blue-500/20' 
          : 'bg-transparent border-t border-gray-900/50'
      }`}></div>
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
