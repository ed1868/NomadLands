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
    <section id="marketplace" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-light mb-8 text-white tracking-tight fade-in-luxury">
            Nomad Collection
          </h2>
          <div className="slide-up-luxury" style={{ animationDelay: '0.4s' }}>
            <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto font-light leading-relaxed">
              Curated with intention for discerning professionals seeking excellence.
              <br className="hidden md:block" />
              <span className="luxury-text">Each agent crafted to elevate your practice.</span>
            </p>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={
                selectedCategory === category.id
                  ? "velvet-gradient text-white shadow-lg shadow-emerald-500/20 border-none font-medium px-6 py-3 rounded-md smooth-hover"
                  : "bg-secondary border border-border text-gray-300 hover:bg-accent hover:text-amber-200 font-light px-6 py-3 rounded-md smooth-hover"
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
