import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Filter, Grid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navigation from "@/components/navigation";
import AgentCard from "@/components/agent-card";
import type { Agent } from "@shared/schema";

const categories = [
  { id: "all", label: "All Agents" },
  { id: "productivity", label: "Productivity" },
  { id: "communication", label: "Communication" },
  { id: "business", label: "Business" },
  { id: "lifestyle", label: "Lifestyle" },
  { id: "wellness", label: "Wellness" },
];

const sortOptions = [
  { id: "popular", label: "Most Popular" },
  { id: "newest", label: "Newest" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
];

export default function Marketplace() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const { data: allAgents = [], isLoading } = useQuery({
    queryKey: ['/api/agents'],
  });

  const filteredAgents = (allAgents as Agent[])
    .filter((agent: Agent) => {
      const matchesCategory = selectedCategory === "all" || agent.category === selectedCategory;
      const matchesSearch = searchQuery === "" || 
        agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        agent.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a: Agent, b: Agent) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "newest":
          return b.id - a.id;
        default:
          return 0;
      }
    });

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-emerald-950/10">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-5xl md:text-7xl font-extralight mb-6 sm:mb-8 text-gray-200 tracking-wide fade-in-luxury">
            Agent Marketplace
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto font-extralight leading-relaxed px-4">
            Discover, deploy, and command your AI workforce.
            <br className="hidden md:block" />
            <span className="knight-text font-light">Every agent crafted for precision.</span>
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-black/40 border border-gray-800 rounded-lg p-4 sm:p-6 mb-8 sm:mb-12 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row lg:flex-row gap-4 sm:gap-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/60 border-gray-700 text-gray-300 placeholder-gray-500 focus:border-emerald-600"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={
                    selectedCategory === category.id
                      ? "obsidian-gradient text-gray-300 shadow-lg shadow-gray-900/30 border border-gray-700 font-light px-4 py-2 rounded backdrop-blur-sm"
                      : "bg-black/40 border border-gray-800 text-gray-500 hover:bg-gray-900/40 hover:text-gray-400 font-extralight px-4 py-2 rounded backdrop-blur-sm"
                  }
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  size="sm"
                >
                  {category.label}
                </Button>
              ))}
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <Button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded ${viewMode === "grid" ? "bg-emerald-900/40 text-emerald-400" : "bg-black/40 text-gray-500"} border border-gray-800`}
                size="sm"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded ${viewMode === "list" ? "bg-emerald-900/40 text-emerald-400" : "bg-black/40 text-gray-500"} border border-gray-800`}
                size="sm"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-800">
            <span className="text-gray-400 text-sm font-extralight">Sort by:</span>
            <div className="flex gap-2">
              {sortOptions.map((option) => (
                <Button
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={
                    sortBy === option.id
                      ? "bg-gray-800 text-gray-300 text-xs px-3 py-1"
                      : "bg-transparent text-gray-500 hover:text-gray-400 text-xs px-3 py-1"
                  }
                  variant="ghost"
                  size="sm"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-400 font-extralight">
            {filteredAgents.length} agent{filteredAgents.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Agent Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-black/40 border border-gray-800 rounded h-96 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className={
            viewMode === "grid" 
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
              : "space-y-6"
          }>
            {filteredAgents.map((agent: Agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}

        {filteredAgents.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg font-extralight">
              No agents found matching your criteria.
            </p>
            <Button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="mt-4 obsidian-gradient text-gray-300 px-6 py-2 rounded border border-gray-700 font-light backdrop-blur-sm"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}