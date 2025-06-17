import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Mail, Cloud, Receipt, Search, Share, Sun, Wind } from "lucide-react";
import type { Agent } from "@shared/schema";

const iconMap = {
  "fas fa-envelope": Mail,
  "fas fa-cloud": Cloud,
  "fas fa-receipt": Receipt,
  "fas fa-search": Search,
  "fas fa-share-alt": Share,
  "fas fa-sun": Sun,
  "fas fa-wind": Wind,
};

export default function Carousel3D() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const { data: featuredAgents = [] } = useQuery<Agent[]>({
    queryKey: ["/api/agents/featured"],
  });

  useEffect(() => {
    let rotation = 0;
    const animate = () => {
      rotation += 0.3;
      if (carouselRef.current) {
        carouselRef.current.style.transform = `rotateY(${rotation}deg)`;
      }
      requestAnimationFrame(animate);
    };
    
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  if (featuredAgents.length === 0) return null;

  return (
    <div className="perspective-1000 opacity-80">
      <div
        ref={carouselRef}
        className="relative w-96 h-96 transform-style-3d"
      >
        {featuredAgents.slice(0, 5).map((agent, index) => {
          const IconComponent = iconMap[agent.icon as keyof typeof iconMap] || Mail;
          const rotationY = (360 / 5) * index;
          const gradients = ['electric-gradient', 'fire-gradient', 'cosmic-gradient', 'forest-gradient', 'sage-gradient'];
          const gradientClass = gradients[index % gradients.length];
          
          return (
            <div
              key={agent.id}
              className="absolute w-64 h-80 left-1/2 top-1/2 -ml-32 -mt-40 glass-card rounded-3xl p-8 transition-all duration-700 animate-aggressive-pulse border-2 border-orange-400/20 hover:border-orange-400/60"
              style={{
                transform: `rotateY(${rotationY}deg) translateZ(220px)`,
                animationDelay: `${index * 0.3}s`,
              }}
            >
              <div className="text-center">
                <div className={`w-16 h-16 ${gradientClass} rounded-2xl mx-auto mb-6 flex items-center justify-center animate-power-glow shadow-xl`}>
                  <IconComponent className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight">{agent.name}</h3>
                <p className="text-muted-foreground text-sm font-medium leading-relaxed">{agent.description.substring(0, 60)}...</p>
                <div className="mt-4">
                  <span className="text-2xl font-black text-orange-600">${agent.price}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
