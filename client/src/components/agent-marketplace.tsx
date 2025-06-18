import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AgentCard from "@/components/agent-card";
import { Button } from "@/components/ui/button";
import type { Agent } from "@shared/schema";

const categories = [
  { id: "all", label: "ALL AGENTS" },
  { id: "productivity", label: "PRODUCTIVITY" },
  { id: "communication", label: "COMMUNICATION" },
  { id: "business", label: "BUSINESS" },
  { id: "lifestyle", label: "LIFESTYLE" },
  { id: "wellness", label: "WELLNESS" },
];

export default function AgentMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: allAgents = [], isLoading } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });

  const filteredAgents = selectedCategory === "all" 
    ? allAgents 
    : allAgents.filter(agent => agent.category === selectedCategory);

  return (
    <section id="marketplace" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-24">
          <h2 className="text-6xl md:text-8xl font-black mb-8 text-black tracking-tight bounce-in">
            AGENT ARSENAL
          </h2>
          <div className="slide-up" style={{ animationDelay: '0.3s' }}>
            <p className="text-2xl md:text-3xl text-black max-w-4xl mx-auto font-bold leading-relaxed">
              Next-generation AI agents that work <span className="text-green-600">brilliantly</span> and autonomously.
              <br className="hidden md:block" />
              <span className="text-green-500">Choose your digital workforce.</span>
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={
                selectedCategory === category.id
                  ? "bright-gradient text-white shadow-lg shadow-green-500/30 border-none font-black px-8 py-4 text-lg rounded-full elastic-hover"
                  : "bg-white border-2 border-green-600 text-green-600 hover:bg-green-50 font-black px-8 py-4 text-lg rounded-full elastic-hover"
              }
              variant={selectedCategory === category.id ? "default" : "outline"}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Agent Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 animate-pulse">
                <div className="w-12 h-12 bg-gray-700 rounded-xl mb-4" />
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-700 rounded w-full mb-4" />
                <div className="h-8 bg-gray-700 rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
