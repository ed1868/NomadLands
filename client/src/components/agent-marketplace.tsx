import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import AgentCard from "@/components/agent-card";
import { Button } from "@/components/ui/button";
import type { Agent } from "@shared/schema";

const categories = [
  { id: "all", label: "All Agents" },
  { id: "productivity", label: "Productivity" },
  { id: "communication", label: "Communication" },
  { id: "business", label: "Business" },
  { id: "lifestyle", label: "Lifestyle" },
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
    <section id="marketplace" className="py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-cyan-500 bg-clip-text text-transparent">
            Agent Marketplace
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose from our extensive library of specialized AI agents designed to automate and enhance every aspect of your digital workflow.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <Button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={
                selectedCategory === category.id
                  ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white"
                  : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
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
