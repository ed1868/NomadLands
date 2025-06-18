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

        {/* Power Multiplier Section */}
        <div className="text-center bg-black/40 border border-gray-800 rounded-lg p-12 backdrop-blur-sm">
          <h2 className="text-3xl font-light text-gray-200 mb-6">
            AI Power × Agent Power = <span className="knight-text">Exponential Results</span>
          </h2>
          <p className="text-gray-400 text-lg font-extralight mb-8 max-w-3xl mx-auto">
            When AI agents work together, their combined intelligence creates capabilities 
            far beyond the sum of their parts. Deploy fleets that think, adapt, and evolve as one.
          </p>
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