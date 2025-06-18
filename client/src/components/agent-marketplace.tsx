import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AgentCard from "@/components/agent-card";
import { Button } from "@/components/ui/button";
import type { Agent } from "@shared/schema";

const categories = [
  { id: "all", label: "ALL AGENTS" },
  { id: "productivity", label: "STEALTH OPS" },
  { id: "communication", label: "NET INFILTRATION" },
  { id: "business", label: "CORP WARFARE" },
  { id: "lifestyle", label: "GHOST PROTOCOL" },
  { id: "wellness", label: "NEURAL SYNC" },
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
    <section id="marketplace" className="py-24 bg-gradient-to-br from-black via-slate-900 to-slate-800 matrix-rain">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black mb-8 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent tracking-tight matrix-glow">
            AGENT ARSENAL
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            Elite AI operatives engineered for maximum efficiency and stealth operation. 
            <span className="text-green-400">Select your digital weapon of choice.</span>
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={
                selectedCategory === category.id
                  ? "neon-gradient text-black shadow-lg shadow-green-500/30 border-none font-bold"
                  : "bg-slate-800/80 hover:bg-slate-700/80 text-green-400 border border-green-500/30 hover:border-green-400/60 backdrop-blur-sm font-semibold"
              }
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
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
