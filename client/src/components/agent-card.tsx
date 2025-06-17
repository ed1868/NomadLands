import { useState } from "react";
import { Mail, Cloud, Receipt, Search, Share, Calendar, Database, Heart, Sun, Wind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Agent } from "@shared/schema";

const iconMap = {
  "fas fa-envelope": Mail,
  "fas fa-cloud": Cloud,
  "fas fa-receipt": Receipt,
  "fas fa-search": Search,
  "fas fa-share-alt": Share,
  "fas fa-calendar": Calendar,
  "fas fa-database": Database,
  "fas fa-heartbeat": Heart,
  "fas fa-sun": Sun,
  "fas fa-wind": Wind,
};

const gradientClasses = {
  "electric-sage": "electric-gradient",
  "forest-green": "forest-gradient",
  "sunset-orange": "fire-gradient",
  "cosmic-purple": "cosmic-gradient",
  "vibrant-sage": "sage-gradient",
  "warm-terracotta": "warm-gradient",
  "deep-charcoal": "forest-gradient",
};

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  const [isDeploying, setIsDeploying] = useState(false);
  
  const IconComponent = iconMap[agent.icon as keyof typeof iconMap] || Mail;
  const gradientClass = gradientClasses[agent.gradientFrom as keyof typeof gradientClasses] || "sage-gradient";

  const handleDeploy = async () => {
    setIsDeploying(true);
    
    // Simulate deployment process
    setTimeout(() => {
      setIsDeploying(false);
      // Show success message or redirect
      alert(`${agent.name} has been mindfully integrated into your workflow!`);
    }, 2000);
  };

  return (
    <div className="agent-card glass-card rounded-3xl p-8 hover:shadow-2xl transition-all duration-700 animate-fade-in-up group relative overflow-hidden border-2 border-transparent hover:border-orange-400/30">
      <div className="flex items-center justify-between mb-6">
        <div className={`w-16 h-16 ${gradientClass} rounded-2xl flex items-center justify-center group-hover:animate-aggressive-pulse transition-all duration-300 shadow-lg`}>
          <IconComponent className="text-white text-2xl" />
        </div>
        <div className="text-right">
          <span className="text-3xl font-bold text-foreground">${agent.price}</span>
          <span className="text-muted-foreground text-sm block font-medium">/month</span>
        </div>
      </div>
      
      <h3 className="text-2xl font-bold mb-4 text-foreground tracking-tight group-hover:text-orange-600 transition-colors duration-300">{agent.name}</h3>
      <p className="text-muted-foreground mb-6 text-base leading-relaxed font-medium">{agent.description}</p>
      
      <div className="flex flex-wrap gap-3 mb-8">
        {agent.features.map((feature, index) => (
          <Badge 
            key={index}
            variant="secondary"
            className="bg-orange-100 text-orange-800 text-sm font-bold px-4 py-2 rounded-full border-2 border-orange-200 hover:bg-orange-200 transition-all duration-300"
          >
            {feature}
          </Badge>
        ))}
      </div>
      
      <Button
        onClick={handleDeploy}
        disabled={isDeploying}
        className={`w-full ${gradientClass} py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-500 disabled:opacity-50 text-white border-none transform hover:scale-105 animate-power-glow`}
      >
        {isDeploying ? "UNLEASHING..." : "DOMINATE NOW"}
      </Button>
    </div>
  );
}
