import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import AgentCard from "@/components/agent-card";
import { Button } from "@/components/ui/button";
import type { Agent, AgentTag } from "@shared/schema";

export default function AgentMarketplace() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: allAgents = [], isLoading: agentsLoading } = useQuery<Agent[]>({
    queryKey: ["/api/agents"],
  });

  const { data: tags = [], isLoading: tagsLoading } = useQuery<AgentTag[]>({
    queryKey: ["/api/tags"],
  });

  // Fetch filtered agents when a tag is selected
  const { data: taggedAgents = [], isLoading: taggedLoading } = useQuery<Agent[]>({
    queryKey: ["/api/agents/tag/" + selectedCategory],
    enabled: selectedCategory !== "all",
  });

  const filteredAgents = useMemo(() => {
    return selectedCategory === "all" ? allAgents : taggedAgents;
  }, [selectedCategory, allAgents, taggedAgents]);

  const isLoading = agentsLoading || tagsLoading || (selectedCategory !== "all" && taggedLoading);

  return (
    <section id="marketplace" className="py-20 bg-gradient-to-br from-black via-gray-950 to-emerald-950/20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-extralight mb-8 text-gray-200 tracking-wide fade-in-luxury">
            Agents Built Like Legends.
          </h2>
          <div className="slide-up-luxury" style={{ animationDelay: '0.4s' }}>
            <p className="text-lg md:text-xl text-gray-500 max-w-4xl mx-auto font-extralight leading-relaxed">
              Molded in silence. Trained for war. Released into the wild.
              <br className="hidden md:block" />
              <span className="knight-text font-light">Every AI agent here? A shadow with a purpose.</span>
            </p>
          </div>
        </div>

        {/* Tag Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-14">
          <Button
            onClick={() => setSelectedCategory("all")}
            className={
              selectedCategory === "all"
                ? "obsidian-gradient text-gray-300 shadow-lg shadow-gray-900/30 border border-gray-700 font-light px-5 py-2 rounded backdrop-blur-sm"
                : "bg-black/40 border border-gray-800 text-gray-500 hover:bg-gray-900/40 hover:text-gray-400 font-extralight px-5 py-2 rounded backdrop-blur-sm"
            }
            variant={selectedCategory === "all" ? "default" : "outline"}
          >
            All Nomads
          </Button>
          {tags.map((tag) => (
            <Button
              key={tag.id}
              onClick={() => setSelectedCategory(tag.slug)}
              className={
                selectedCategory === tag.slug
                  ? "obsidian-gradient text-gray-300 shadow-lg shadow-gray-900/30 border border-gray-700 font-light px-5 py-2 rounded backdrop-blur-sm"
                  : "bg-black/40 border border-gray-800 text-gray-500 hover:bg-gray-900/40 hover:text-gray-400 font-extralight px-5 py-2 rounded backdrop-blur-sm"
              }
              variant={selectedCategory === tag.slug ? "default" : "outline"}
            >
              {tag.name}
            </Button>
          ))}
        </div>

        {/* Agent Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-black/60 border border-gray-800 rounded-xl p-6 animate-pulse backdrop-blur-sm">
                <div className="w-full h-40 bg-gray-700 rounded-lg mb-6" />
                <div className="h-6 bg-gray-700 rounded w-3/4 mb-4" />
                <div className="h-16 bg-gray-700 rounded w-full mb-4" />
                <div className="space-y-2 mb-6">
                  <div className="h-3 bg-gray-700 rounded w-full" />
                  <div className="h-3 bg-gray-700 rounded w-4/5" />
                  <div className="h-3 bg-gray-700 rounded w-3/4" />
                </div>
                <div className="h-12 bg-gray-700 rounded w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {filteredAgents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
