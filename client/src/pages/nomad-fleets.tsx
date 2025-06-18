import { useState } from "react";
import { ArrowRight, Users, Zap, Shield, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";

export default function NomadFleets() {
  const [selectedFleet, setSelectedFleet] = useState("enterprise");

  const fleets = [
    {
      id: "enterprise",
      name: "Enterprise Fleet",
      description: "Complete AI workforce for large organizations",
      agents: 25,
      price: 2499,
      features: ["Advanced Analytics", "Custom Integrations", "24/7 Support", "Dedicated Infrastructure"],
      gradient: "obsidian-gradient"
    },
    {
      id: "growth",
      name: "Growth Fleet",
      description: "Scalable AI teams for growing businesses",
      agents: 12,
      price: 999,
      features: ["Team Collaboration", "Workflow Automation", "API Access", "Priority Support"],
      gradient: "shadow-gradient"
    },
    {
      id: "startup",
      name: "Startup Fleet",
      description: "Essential AI agents for new ventures",
      agents: 6,
      price: 499,
      features: ["Core Automation", "Basic Analytics", "Email Support", "Standard API"],
      gradient: "emerald-knight"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-emerald-950/10">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-extralight mb-8 text-gray-200 tracking-wide fade-in-luxury">
            Nomad Fleets
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto font-extralight leading-relaxed">
            AI agent teams at scale. Where individual power becomes
            <br className="hidden md:block" />
            <span className="knight-text font-light">collective intelligence.</span>
          </p>
        </div>

        {/* Fleet Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {fleets.map((fleet) => (
            <div
              key={fleet.id}
              className={`bg-black/60 border border-gray-800 p-8 rounded backdrop-blur-sm hover:border-gray-700 transition-all duration-700 cursor-pointer ${
                selectedFleet === fleet.id ? 'border-emerald-700 shadow-lg shadow-emerald-900/20' : ''
              }`}
              onClick={() => setSelectedFleet(fleet.id)}
            >
              <div className="mb-6">
                <div className={`w-16 h-16 ${fleet.gradient} rounded border border-gray-600 flex items-center justify-center shadow-2xl backdrop-blur-sm mb-4`}>
                  <Users className="text-gray-300 text-2xl" />
                </div>
                <h3 className="text-2xl font-light text-gray-200 mb-2">{fleet.name}</h3>
                <p className="text-gray-500 text-sm font-extralight">{fleet.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-extralight knight-text">${fleet.price}</span>
                  <span className="text-gray-500 text-sm font-extralight ml-2">/month</span>
                </div>
                <Badge className="bg-gray-900/60 text-gray-400 text-sm font-extralight px-3 py-1 rounded border border-gray-800">
                  {fleet.agents} AI Agents
                </Badge>
              </div>

              <div className="space-y-3 mb-8">
                {fleet.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-400 text-sm">
                    <Shield className="w-4 h-4 mr-3 text-emerald-600" />
                    {feature}
                  </div>
                ))}
              </div>

              <Button
                className={`w-full ${fleet.gradient} py-3 rounded font-light hover:shadow-xl hover:shadow-gray-900/50 transition-all duration-700 text-gray-300 border border-gray-700 hover:border-gray-600 backdrop-blur-sm`}
              >
                Deploy Fleet
              </Button>
            </div>
          ))}
        </div>

        {/* Enterprise Scale Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Scale Description */}
          <div className="bg-black/40 border border-gray-800 rounded-lg p-12 backdrop-blur-sm">
            <h2 className="text-3xl font-light text-gray-200 mb-8">
              Enterprise Scale <span className="knight-text">Deployment</span>
            </h2>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-emerald-900/40 rounded border border-emerald-700 flex items-center justify-center mt-1">
                  <span className="text-emerald-400 font-light text-sm">10</span>
                </div>
                <div>
                  <h4 className="text-gray-300 font-light mb-2">Companies</h4>
                  <p className="text-gray-500 font-extralight">Multi-tenant deployment across enterprise organizations</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-emerald-900/40 rounded border border-emerald-700 flex items-center justify-center mt-1">
                  <span className="text-emerald-400 font-light text-sm">500</span>
                </div>
                <div>
                  <h4 className="text-gray-300 font-light mb-2">Active Agents</h4>
                  <p className="text-gray-500 font-extralight">Simultaneous AI workforce operating at global scale</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-emerald-900/40 rounded border border-emerald-700 flex items-center justify-center mt-1">
                  <span className="text-emerald-400 font-light text-sm">∞</span>
                </div>
                <div>
                  <h4 className="text-gray-300 font-light mb-2">Departments</h4>
                  <p className="text-gray-500 font-extralight">Cross-functional teams unified toward common objectives</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scale Visualization */}
          <div className="bg-black/40 border border-gray-800 rounded-lg p-12 backdrop-blur-sm">
            <h3 className="text-xl font-light text-gray-200 mb-8">Network Topology</h3>
            <div className="relative h-64">
              {/* Central Hub */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-emerald-900/60 border-2 border-emerald-600 rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-emerald-400" />
              </div>
              
              {/* Company Nodes */}
              {[...Array(8)].map((_, i) => {
                const angle = (i * 45) * (Math.PI / 180);
                const radius = 80;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                return (
                  <div key={i}>
                    {/* Connection Line */}
                    <div 
                      className="absolute top-1/2 left-1/2 origin-left h-0.5 bg-gradient-to-r from-emerald-600/60 to-transparent"
                      style={{
                        width: `${radius}px`,
                        transform: `translate(-2px, -1px) rotate(${i * 45}deg)`,
                        animationDelay: `${i * 0.2}s`
                      }}
                    />
                    {/* Company Node */}
                    <div 
                      className="absolute w-6 h-6 bg-emerald-900/40 border border-emerald-700 rounded-full animate-pulse"
                      style={{
                        left: `calc(50% + ${x}px - 12px)`,
                        top: `calc(50% + ${y}px - 12px)`,
                        animationDelay: `${i * 0.3}s`
                      }}
                    >
                      <div className="w-2 h-2 bg-emerald-500 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Power Multiplier Section */}
        <div className="text-center bg-black/40 border border-gray-800 rounded-lg p-12 backdrop-blur-sm">
          <h2 className="text-3xl font-light text-gray-200 mb-6">
            AI Power × Agent Power = <span className="knight-text">Exponential Results</span>
          </h2>
          <p className="text-gray-400 text-lg font-extralight mb-8 max-w-3xl mx-auto">
            When AI agents work together, their combined intelligence creates capabilities 
            far beyond the sum of their parts. Deploy fleets that think, adapt, and evolve as one.
          </p>
          
          {/* Animated Growth Chart */}
          <div className="bg-black/60 border border-gray-700 rounded-lg p-8 mb-8">
            <div className="flex items-end justify-center space-x-4 h-32">
              {[
                { label: "1 Agent", height: "20%", delay: "0s" },
                { label: "5 Agents", height: "35%", delay: "0.5s" },
                { label: "25 Agents", height: "60%", delay: "1s" },
                { label: "100 Agents", height: "85%", delay: "1.5s" },
                { label: "500 Agents", height: "100%", delay: "2s" }
              ].map((bar, index) => (
                <div key={index} className="text-center">
                  <div 
                    className="w-12 bg-gradient-to-t from-emerald-900 to-emerald-600 rounded-t scale-bar"
                    style={{ 
                      height: bar.height,
                      animationDelay: bar.delay
                    }}
                  />
                  <span className="text-gray-500 text-xs mt-2 block font-extralight">{bar.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center items-center space-x-8">
            <div className="text-center">
              <Zap className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
              <span className="text-gray-400 text-sm">Speed</span>
            </div>
            <div className="text-emerald-600 text-2xl">×</div>
            <div className="text-center">
              <Globe className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
              <span className="text-gray-400 text-sm">Scale</span>
            </div>
            <div className="text-emerald-600 text-2xl">=</div>
            <div className="text-center">
              <Shield className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
              <span className="text-gray-400 text-sm">Dominance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}