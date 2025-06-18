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
  "sage-green": "cyber-gradient",
  "ocean-mist": "neon-gradient", 
  "warm-beige": "matrix-gradient",
  "dusty-rose": "forest-gradient",
  "lavender-grey": "cyber-gradient",
  "soft-sage": "neon-gradient",
  "charcoal": "matrix-gradient",
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
      alert(`${agent.name} has been deployed to your neural network!`);
    }, 2000);
  };

  return (
    <div className="agent-card cyber-card rounded-xl p-8 hover:shadow-2xl transition-all duration-500 animate-fade-in-up group">
      <div className="flex items-center justify-between mb-6">
        <div className={`w-14 h-14 ${gradientClass} rounded-lg flex items-center justify-center group-hover:scale-105 transition-all duration-300 shadow-lg glow-effect`}>
          <IconComponent className="text-black text-xl" />
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-white">${agent.price}</span>
          <span className="text-green-400 text-sm block font-semibold">/month</span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-3 text-white tracking-tight">{agent.name}</h3>
      <p className="text-gray-300 mb-6 text-sm leading-relaxed font-light">{agent.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-6">
        {agent.features.map((feature, index) => (
          <Badge 
            key={index}
            variant="secondary"
            className="bg-green-500/20 text-green-400 text-xs font-semibold px-3 py-1 rounded-md border border-green-500/30"
          >
            {feature}
          </Badge>
        ))}
      </div>
      
      <Button
        onClick={handleDeploy}
        disabled={isDeploying}
        className={`w-full ${gradientClass} py-4 rounded-lg font-bold hover:shadow-xl hover:shadow-green-500/30 transition-all duration-300 disabled:opacity-50 text-black border-none glow-effect`}
      >
        {isDeploying ? "DEPLOYING..." : "DEPLOY AGENT"}
      </Button>
    </div>
  );
}
