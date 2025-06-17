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
    <section id="marketplace" className="py-32 aggressive-mesh relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-24">
          <h2 className="text-6xl md:text-7xl font-black mb-8 bg-gradient-to-r from-orange-500 via-green-600 to-purple-600 bg-clip-text text-transparent tracking-tight animate-shimmer">
            POWER COLLECTION
          </h2>
          <p className="text-2xl md:text-3xl text-foreground max-w-4xl mx-auto font-bold leading-relaxed">
            Unleash <span className="fire-gradient bg-clip-text text-transparent">ruthless efficiency</span> while maintaining your inner zen. 
            Each agent is forged to <span className="electric-gradient bg-clip-text text-transparent">dominate workflows</span> with conscious intention.
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
                  ? "sage-gradient text-white shadow-lg shadow-green-500/20 border-none"
                  : "bg-muted/50 hover:bg-muted text-foreground border border-muted-foreground/20 hover:border-green-400/40"
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
