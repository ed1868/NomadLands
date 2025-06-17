import { useState } from "react";
import { Mail, Cloud, Receipt, Search, Share, Calendar, Database, Heart } from "lucide-react";
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
};

const gradientClasses = {
  "neon-purple": "from-purple-500",
  "cyber-cyan": "to-cyan-500",
  "mint-green": "from-green-500",
  "electric-blue": "to-blue-500",
};

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  const [isDeploying, setIsDeploying] = useState(false);
  
  const IconComponent = iconMap[agent.icon as keyof typeof iconMap] || Mail;
  const gradientFrom = gradientClasses[agent.gradientFrom as keyof typeof gradientClasses] || "from-purple-500";
  const gradientTo = gradientClasses[agent.gradientTo as keyof typeof gradientClasses] || "to-cyan-500";

  const handleDeploy = async () => {
    setIsDeploying(true);
    
    // Simulate deployment process
    setTimeout(() => {
      setIsDeploying(false);
      // Show success message or redirect
      alert(`${agent.name} has been successfully deployed!`);
    }, 2000);
  };

  return (
    <div className="agent-card glass-card rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-xl flex items-center justify-center`}>
          <IconComponent className="text-white text-lg" />
        </div>
        <div className="text-right">
          <span className="text-2xl font-bold text-purple-400">${agent.price}</span>
          <span className="text-gray-400 text-sm block">/month</span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold mb-2 text-white">{agent.name}</h3>
      <p className="text-gray-400 mb-4 text-sm leading-relaxed">{agent.description}</p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {agent.features.map((feature, index) => (
          <Badge 
            key={index}
            variant="secondary"
            className="bg-purple-500/20 text-purple-300 text-xs"
          >
            {feature}
          </Badge>
        ))}
      </div>
      
      <Button
        onClick={handleDeploy}
        disabled={isDeploying}
        className={`w-full bg-gradient-to-r ${gradientFrom} ${gradientTo} py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50`}
      >
        {isDeploying ? "Deploying..." : "Deploy Agent"}
      </Button>
    </div>
  );
}
