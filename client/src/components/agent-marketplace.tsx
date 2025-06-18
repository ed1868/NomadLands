import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AgentCard from "@/components/agent-card";
import { Button } from "@/components/ui/button";
import type { Agent } from "@shared/schema";

const categories = [
  { id: "all", label: "All Nomads" },
  { id: "productivity", label: "Productivity" },
  { id: "communication", label: "Communication" },
  { id: "business", label: "Business" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "wellness", label: "Wellness" },
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
    <section id="marketplace" className="py-24 bg-gradient-to-br from-slate-50 via-emerald-50/30 to-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-light mb-8 bg-gradient-to-r from-emerald-800 to-emerald-600 bg-clip-text text-transparent tracking-tight">
            Nomad Collection
          </h2>
          <p className="text-xl text-emerald-700 max-w-3xl mx-auto font-light leading-relaxed">
            Curated with intention for mindful professionals seeking balance in their digital practice. Each agent flows seamlessly into your conscious workflow.
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
                  ? "forest-gradient text-white shadow-lg shadow-emerald-500/20 border-none"
                  : "bg-white/80 hover:bg-white text-emerald-700 border border-emerald-200/50 hover:border-emerald-400/40 backdrop-blur-sm"
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
