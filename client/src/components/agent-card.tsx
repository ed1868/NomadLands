import { useState } from "react";
import { Mail, Cloud, Receipt, Search, Share, Calendar, Database, Heart, Sun, Wind, X, ExternalLink } from "lucide-react";
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
  "sage-green": "obsidian-gradient",
  "ocean-mist": "shadow-gradient", 
  "warm-beige": "obsidian-gradient",
  "dusty-rose": "shadow-gradient",
  "lavender-grey": "obsidian-gradient",
  "soft-sage": "emerald-knight",
  "charcoal": "obsidian-gradient",
};

// Dark Knight architectural images - inspired by your references
const agentImages = {
  "Mindful Email Curator": "@assets/Screenshot 2025-06-17 at 21.43.12_1750210995781.png",
  "CloudFlow Orchestrator": "@assets/Screenshot 2025-06-17 at 21.43.26_1750211011505.png",
  "Invoice Intelligence": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop&crop=center", // Dark modern architecture
  "Talent Scout Pro": "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=400&h=300&fit=crop&crop=center", // Moody building
  "Social Harmony Bot": "https://images.unsplash.com/photo-1600607688960-e095cb4bd6b8?w=400&h=300&fit=crop&crop=center", // Dark architectural detail
  "Schedule Sage": "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=400&h=300&fit=crop&crop=center", // Minimal dark structure
  "Data Whisperer": "https://images.unsplash.com/photo-1600607688960-e095cb4bd6b8?w=400&h=300&fit=crop&crop=center", // Dark tech aesthetic
  "Wellness Guardian": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&h=300&fit=crop&crop=center", // Serene dark space
};

interface AgentCardProps {
  agent: Agent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  const [isDeploying, setIsDeploying] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const IconComponent = iconMap[agent.icon as keyof typeof iconMap] || Mail;
  const gradientClass = gradientClasses[agent.gradientFrom as keyof typeof gradientClasses] || "velvet-gradient";
  const agentImage = agentImages[agent.name as keyof typeof agentImages] || agentImages["Mindful Email Curator"];

  const handleDeploy = async () => {
    setIsDeploying(true);
    
    // Simulate deployment process
    setTimeout(() => {
      setIsDeploying(false);
      alert(`${agent.name} has been seamlessly integrated into your workflow.`);
    }, 2000);
  };

  const handleCardClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <div 
        className="agent-card luxury-card p-0 fade-in-luxury group cursor-pointer" 
        style={{ animationDelay: `${Math.random() * 0.5}s` }}
        onClick={handleCardClick}
      >
        {/* Agent Image */}
        <div className="relative overflow-hidden h-48">
          <img 
            src={agentImage} 
            alt={agent.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
          />
          <div className="absolute inset-0 image-overlay" />
          <div className={`absolute top-4 left-4 w-12 h-12 ${gradientClass} rounded-lg flex items-center justify-center shadow-lg`}>
            <IconComponent className="text-white text-xl" />
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-xl font-medium text-white tracking-tight">{agent.name}</h3>
            <div className="text-right">
              <span className="text-2xl font-light luxury-text">${agent.price}</span>
              <span className="text-amber-300 text-sm block font-light">/month</span>
            </div>
          </div>
          
          <p className="text-gray-400 mb-6 text-sm leading-relaxed font-light line-clamp-3">
            {agent.description}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {agent.features.slice(0, 3).map((feature, index) => (
              <Badge 
                key={index}
                variant="secondary"
                className="bg-emerald-900/40 text-emerald-300 text-xs font-light px-3 py-1 rounded-md border border-emerald-700/30"
              >
                {feature}
              </Badge>
            ))}
            {agent.features.length > 3 && (
              <Badge className="bg-slate-700/40 text-gray-400 text-xs font-light px-3 py-1 rounded-md">
                +{agent.features.length - 3} more
              </Badge>
            )}
          </div>
          
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleDeploy();
            }}
            disabled={isDeploying}
            className={`w-full ${gradientClass} py-3 rounded-md font-medium hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-500 disabled:opacity-50 text-white border-none smooth-hover`}
          >
            {isDeploying ? "Integrating..." : "Begin Journey"}
          </Button>
        </div>
      </div>

      {/* Modal for detailed view */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="bg-card border border-border rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto luxury-shadow" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img 
                src={agentImage} 
                alt={agent.name}
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 image-overlay" />
              <Button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white border-none rounded-full w-10 h-10 p-0"
              >
                <X className="w-5 h-5" />
              </Button>
              <div className={`absolute bottom-4 left-4 w-16 h-16 ${gradientClass} rounded-xl flex items-center justify-center shadow-lg`}>
                <IconComponent className="text-white text-2xl" />
              </div>
            </div>
            
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-3xl font-medium text-white">{agent.name}</h2>
                <div className="text-right">
                  <span className="text-3xl font-light luxury-text">${agent.price}</span>
                  <span className="text-amber-300 text-base block font-light">/month</span>
                </div>
              </div>
              
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                {agent.description}
              </p>
              
              <div className="mb-8">
                <h3 className="text-xl font-medium text-white mb-4">Capabilities</h3>
                <div className="flex flex-wrap gap-3">
                  {agent.features.map((feature, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className="bg-emerald-900/40 text-emerald-300 text-sm font-light px-4 py-2 rounded-md border border-emerald-700/30"
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button
                  onClick={handleDeploy}
                  disabled={isDeploying}
                  className={`flex-1 ${gradientClass} py-4 rounded-md font-medium hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-500 disabled:opacity-50 text-white border-none smooth-hover`}
                >
                  {isDeploying ? "Integrating..." : "Begin Journey"}
                </Button>
                <Button
                  variant="outline"
                  className="brass-border bg-transparent px-6 py-4 rounded-md font-light text-amber-200 hover:bg-amber-500/5"
                >
                  <ExternalLink className="w-5 h-5 mr-2" />
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
