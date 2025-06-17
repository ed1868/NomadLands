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
    <div className="perspective-1000 opacity-60">
      <div
        ref={carouselRef}
        className="relative w-80 h-80 transform-style-3d"
      >
        {featuredAgents.slice(0, 5).map((agent, index) => {
          const IconComponent = iconMap[agent.icon as keyof typeof iconMap] || Mail;
          const rotationY = (360 / 5) * index;
          
          return (
            <div
              key={agent.id}
              className="absolute w-56 h-72 left-1/2 top-1/2 -ml-28 -mt-36 glass-card rounded-3xl p-6 transition-all duration-500 animate-breathe"
              style={{
                transform: `rotateY(${rotationY}deg) translateZ(180px)`,
                animationDelay: `${index * 0.2}s`,
              }}
            >
              <div className="text-center">
                <div className="w-14 h-14 sage-gradient rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <IconComponent className="text-xl text-white" />
                </div>
                <h3 className="text-lg font-medium mb-2 text-foreground">{agent.name}</h3>
                <p className="text-muted-foreground text-xs font-light leading-relaxed">{agent.description.substring(0, 50)}...</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
