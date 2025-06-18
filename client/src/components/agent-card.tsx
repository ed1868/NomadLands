import { useState } from "react";
import { Mail, Cloud, Receipt, Search, Share, Calendar, Database, Heart, Sun, Wind, X, ExternalLink, ArrowRight } from "lucide-react";
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
        className="agent-card bg-black/60 border border-gray-800 p-0 fade-in-luxury group cursor-pointer backdrop-blur-sm hover:border-gray-700 transition-all duration-700 rounded-xl overflow-hidden hover:bg-black/70 hover:shadow-2xl hover:shadow-black/30" 
        style={{ animationDelay: `${Math.random() * 0.5}s` }}
        onClick={handleCardClick}
      >
        {/* Agent Image */}
        <div className="relative overflow-hidden h-40 sm:h-48">
          <img 
            src={agentImage} 
            alt={agent.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 bg-black/30" />
          <div className={`absolute top-4 left-4 w-10 h-10 ${gradientClass} rounded border border-gray-600 flex items-center justify-center shadow-2xl backdrop-blur-sm`}>
            <IconComponent className="text-gray-300 text-sm" />
          </div>
        </div>
        
        <div className="p-4 sm:p-6">
          {/* Agent Name */}
          <div className="mb-4">
            <h3 className="text-lg sm:text-xl font-light text-gray-200 tracking-tight leading-tight">
              {agent.name}
            </h3>
          </div>
          
          {/* Pricing Section */}
          <div className="mb-6 p-3 sm:p-4 bg-black/30 border border-gray-800 rounded-lg">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl sm:text-3xl font-extralight knight-text">
                  ${agent.price}
                </span>
                <span className="text-gray-400 text-sm font-extralight ml-2">
                  /month
                </span>
              </div>
              <div className="text-right">
                <div className="text-xs text-gray-500 font-extralight">
                  {(parseFloat(agent.priceInWei) / 1e18).toFixed(3)} ETH
                </div>
              </div>
            </div>
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <p className="text-gray-400 text-sm leading-relaxed font-extralight">
              {agent.description}
            </p>
          </div>

          {/* Features Grid */}
          <div className="mb-6">
            <h4 className="text-xs font-light text-gray-300 uppercase tracking-wide mb-3">
              Capabilities
            </h4>
            <div className="space-y-2">
              {agent.features.slice(0, 3).map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-center text-xs text-gray-400 font-extralight"
                >
                  <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mr-3 flex-shrink-0"></div>
                  <span className="truncate">{feature}</span>
                </div>
              ))}
              {agent.features.length > 3 && (
                <div className="text-xs text-gray-500 font-extralight mt-2">
                  +{agent.features.length - 3} more capabilities
                </div>
              )}
            </div>
          </div>
          
          {/* Deploy Button */}
          <div className="pt-2">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleDeploy();
              }}
              disabled={isDeploying}
              className={`w-full ${gradientClass} py-3 sm:py-4 rounded-lg font-light hover:shadow-xl hover:shadow-gray-900/50 transition-all duration-700 disabled:opacity-50 text-gray-300 border border-gray-700 hover:border-gray-600 backdrop-blur-sm text-sm sm:text-base`}
            >
              {isDeploying ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                  Activating...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <span>Deploy Agent</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Dark Knight Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setShowModal(false)}>
          <div className="bg-black/80 border border-gray-800 rounded max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto backdrop-blur-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img 
                src={agentImage} 
                alt={agent.name}
                className="w-full h-64 object-cover opacity-70"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/50" />
              <Button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 bg-black/60 hover:bg-black/80 text-gray-400 border border-gray-700 rounded w-10 h-10 p-0 backdrop-blur-sm"
              >
                <X className="w-4 h-4" />
              </Button>
              <div className={`absolute bottom-4 left-4 w-12 h-12 ${gradientClass} rounded border border-gray-600 flex items-center justify-center shadow-2xl backdrop-blur-sm`}>
                <IconComponent className="text-gray-300 text-lg" />
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <h2 className="text-2xl font-light text-gray-200">{agent.name}</h2>
                <div className="text-right">
                  <span className="text-2xl font-extralight knight-text">${agent.price}</span>
                  <span className="text-gray-500 text-sm block font-extralight">/month</span>
                </div>
              </div>
              
              <p className="text-gray-400 mb-8 text-base leading-relaxed font-light">
                {agent.description}
              </p>
              
              <div className="mb-8">
                <h3 className="text-lg font-light text-gray-300 mb-4">Capabilities</h3>
                <div className="flex flex-wrap gap-2">
                  {agent.features.map((feature, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className="bg-gray-900/60 text-gray-400 text-sm font-extralight px-3 py-2 rounded border border-gray-800"
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
                  className={`flex-1 ${gradientClass} py-3 rounded font-light hover:shadow-xl hover:shadow-gray-900/50 transition-all duration-700 disabled:opacity-50 text-gray-300 border border-gray-700 backdrop-blur-sm`}
                >
                  {isDeploying ? "Activating..." : "Deploy"}
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent border-gray-700 px-6 py-3 rounded font-extralight text-gray-400 hover:text-gray-300 hover:border-gray-600 backdrop-blur-sm"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Details
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
