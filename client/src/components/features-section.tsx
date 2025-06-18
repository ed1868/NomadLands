import { Heart, Leaf, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import backgroundImage from '@assets/back_1750268064928.png';

const features = [
  {
    icon: Heart,
    title: "Shadow Integration",
    description: "Deploy AI agents that move unseen through your workflows. Built in the shadows. Born to disrupt.",
    delay: "0s",
  },
  {
    icon: Leaf,
    title: "Lethal Efficiency",
    description: "Zero tolerance for weakness. Our agents eliminate inefficiency with surgical precision.",
    delay: "1s",
  },
  {
    icon: Sparkles,
    title: "Warrior Experience", 
    description: "Every agent is forged in digital fire. They don't just work—they dominate their assigned domain.",
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
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-extralight mb-8 text-gray-200 tracking-wide fade-in-luxury">
            Why Choose Shadow Ops?
          </h2>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto font-extralight leading-relaxed">
            We don't build software. We forge digital weapons.
            <br className="hidden md:block" />
            <span className="knight-text font-light">Every line of code is a declaration of war against inefficiency.</span>
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
