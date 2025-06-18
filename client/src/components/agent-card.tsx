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
  "sage-green": "forest-gradient",
  "ocean-mist": "mist-gradient", 
  "warm-beige": "mist-gradient",
  "dusty-rose": "forest-gradient",
  "lavender-grey": "mist-gradient",
  "soft-sage": "forest-gradient",
  "charcoal": "deep-gradient",
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
    <div className="agent-card premium-card rounded-3xl p-8 hover:shadow-2xl transition-all duration-500 animate-fade-in-up group">
      <div className="flex items-center justify-between mb-6">
        <div className={`w-14 h-14 ${gradientClass} rounded-2xl flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-lg`}>
          <IconComponent className="text-white text-xl" />
        </div>
        <div className="text-right">
          <span className="text-2xl font-medium text-emerald-900">${agent.price}</span>
          <span className="text-emerald-600 text-sm block font-light">/month</span>
        </div>
      </div>
      
      <h3 className="text-xl font-medium mb-3 text-emerald-900 tracking-tight">{agent.name}</h3>
      <p className="text-emerald-700 mb-6 text-sm leading-relaxed font-light">{agent.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {agent.features.map((feature, index) => (
          <Badge 
            key={index}
            variant="secondary"
            className="bg-emerald-100 text-emerald-700 text-xs font-light px-3 py-1 rounded-full border-none"
          >
            {feature}
          </Badge>
        ))}
      </div>
      
      <Button
        onClick={handleDeploy}
        disabled={isDeploying}
        className={`w-full ${gradientClass} py-4 rounded-2xl font-medium hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300 disabled:opacity-50 text-white border-none magnetic-hover`}
      >
        {isDeploying ? "Integrating..." : "Begin Journey"}
      </Button>
    </div>
  );
}
