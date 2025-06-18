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
  "sage-green": "bright-gradient",
  "ocean-mist": "forest-accent-gradient", 
  "warm-beige": "bright-gradient",
  "dusty-rose": "forest-accent-gradient",
  "lavender-grey": "bright-gradient",
  "soft-sage": "forest-accent-gradient",
  "charcoal": "bright-gradient",
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
      alert(`${agent.name} deployed successfully! Ready to revolutionize your workflow.`);
    }, 2000);
  };

  return (
    <div className="agent-card modern-card p-8 bounce-in group" style={{ animationDelay: `${Math.random() * 0.5}s` }}>
      <div className="flex items-center justify-between mb-6">
        <div className={`w-16 h-16 ${gradientClass} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg`}>
          <IconComponent className="text-white text-2xl" />
        </div>
        <div className="text-right">
          <span className="text-3xl font-black text-black">${agent.price}</span>
          <span className="text-green-600 text-sm block font-bold">/month</span>
        </div>
      </div>
      
      <h3 className="text-2xl font-black mb-4 text-black tracking-tight">{agent.name}</h3>
      <p className="text-gray-700 mb-6 text-base leading-relaxed font-medium">{agent.description}</p>
      
      <div className="flex flex-wrap gap-3 mb-8">
        {agent.features.map((feature, index) => (
          <Badge 
            key={index}
            variant="secondary"
            className="bg-green-100 text-green-700 text-sm font-bold px-4 py-2 rounded-full border-2 border-green-200"
          >
            {feature}
          </Badge>
        ))}
      </div>
      
      <Button
        onClick={handleDeploy}
        disabled={isDeploying}
        className={`w-full ${gradientClass} py-6 rounded-full font-black text-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 text-white border-none elastic-hover pulse-bright`}
      >
        {isDeploying ? "DEPLOYING..." : "DEPLOY NOW"}
      </Button>
    </div>
  );
}
