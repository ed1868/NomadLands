import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Mail, Cloud, Receipt, Search, Share } from "lucide-react";
import type { Agent } from "@shared/schema";

const iconMap = {
  "fas fa-envelope": Mail,
  "fas fa-cloud": Cloud,
  "fas fa-receipt": Receipt,
  "fas fa-search": Search,
  "fas fa-share-alt": Share,
};

export default function Carousel3D() {
  const carouselRef = useRef<HTMLDivElement>(null);

  const { data: featuredAgents = [] } = useQuery<Agent[]>({
    queryKey: ["/api/agents/featured"],
  });

  useEffect(() => {
    let rotation = 0;
    const animate = () => {
      rotation += 0.5;
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
    <div className="perspective-1000">
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
              className="absolute w-60 h-80 left-1/2 top-1/2 -ml-30 -mt-40 glass-card rounded-2xl p-6 transition-all duration-500"
              style={{
                transform: `rotateY(${rotationY}deg) translateZ(200px)`,
              }}
            >
              <div className="text-center">
                <div className={`w-16 h-16 bg-gradient-to-r from-${agent.gradientFrom}-500 to-${agent.gradientTo}-500 rounded-2xl mx-auto mb-4 flex items-center justify-center`}>
                  <IconComponent className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{agent.name}</h3>
                <p className="text-gray-400 text-sm">{agent.description.substring(0, 60)}...</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
