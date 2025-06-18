import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Users, Building2, Star, Clock, Zap, Plus, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { NomadAgent, Company } from "@shared/schema";

export default function NomadLands() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [hireType, setHireType] = useState("all"); // all, per_run, per_hour
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mock data for now - will implement backend later
  const mockNomadAgents: NomadAgent[] = [
    {
      id: 1,
      name: "Pipeline Pete",
      description: "Master of ETL pipelines and data transformation. Turns messy data into pristine analytics-ready datasets.",
      category: "Engineering",
      ownerId: "user1",
      companyId: 1,
      pricePerRun: "25000000000000000", // 0.025 ETH
      pricePerHour: "100000000000000000", // 0.1 ETH  
      availability: "available",
      skills: ["Python", "Apache Spark", "PostgreSQL", "AWS", "Data Modeling"],
      rating: 5,
      totalRuns: 247,
      icon: "Database",
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      teamWorthy: true
    },
    {
      id: 2,
      name: "Fortress Felix",
      description: "Cybersecurity ninja who finds vulnerabilities before the bad guys do. Expert penetration tester and security auditor.",
      category: "Security",
      ownerId: "user2", 
      companyId: 2,
      pricePerRun: "50000000000000000", // 0.05 ETH
      pricePerHour: "200000000000000000", // 0.2 ETH
      availability: "busy",
      skills: ["Solidity", "Security Auditing", "Penetration Testing", "Smart Contracts", "Vulnerability Assessment"],
      rating: 5,
      totalRuns: 189,
      icon: "Shield",
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      teamWorthy: true
    },
    {
      id: 3,
      name: "Viral Vixen Maya",
      description: "Creative strategist specializing in viral content creation, brand storytelling, and multi-platform campaigns.",
      category: "Marketing",
      ownerId: "user3",
      companyId: 3,
      pricePerRun: "15000000000000000", // 0.015 ETH
      pricePerHour: "75000000000000000", // 0.075 ETH
      availability: "available",
      skills: ["Content Strategy", "Copywriting", "Social Media", "Brand Development", "Video Production"],
      rating: 4,
      totalRuns: 156,
      icon: "Megaphone",
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 4,
      name: "CloudOps Jordan",
      description: "DevOps engineer with expertise in Kubernetes, microservices architecture, and CI/CD pipeline optimization.",
      category: "Operations", 
      ownerId: "user4",
      companyId: 4,
      pricePerRun: "35000000000000000", // 0.035 ETH
      pricePerHour: "150000000000000000", // 0.15 ETH
      availability: "available",
      skills: ["Kubernetes", "Docker", "AWS", "Terraform", "CI/CD", "Monitoring"],
      rating: 5,
      totalRuns: 203,
      icon: "Cloud",
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 5,
      name: "AnalyticsBot Sam",
      description: "Data scientist specializing in predictive modeling, machine learning pipelines, and business intelligence dashboards.",
      category: "Analytics",
      ownerId: "user5",
      companyId: 5,
      pricePerRun: "30000000000000000", // 0.03 ETH
      pricePerHour: "120000000000000000", // 0.12 ETH
      availability: "available",
      skills: ["Python", "R", "Machine Learning", "Tableau", "SQL", "Statistics"],
      rating: 5,
      totalRuns: 178,
      icon: "BarChart3",
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 6,
      name: "UIux Aria",
      description: "Product designer focused on user experience research, interface design, and design system architecture.",
      category: "Design",
      ownerId: "user6",
      companyId: 6,
      pricePerRun: "20000000000000000", // 0.02 ETH
      pricePerHour: "90000000000000000", // 0.09 ETH
      availability: "offline",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems", "Usability Testing"],
      rating: 4,
      totalRuns: 134,
      icon: "Palette",
      featured: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  const mockCompanies = [
    { id: 1, name: "DataFlow Systems", verified: true },
    { id: 2, name: "CyberShield Security", verified: true },
    { id: 3, name: "Creative Collective", verified: false },
    { id: 4, name: "CloudOps Solutions", verified: true },
    { id: 5, name: "Analytics Pro", verified: true },
    { id: 6, name: "Design Studio", verified: false },
  ];

  const categories = ["all", "Engineering", "Security", "Marketing", "Operations", "Analytics", "Design"];
  
  const formatPrice = (wei: string, type: "run" | "hour") => {
    const eth = parseFloat(wei) / 1e18;
    return `${eth.toFixed(3)} ETH/${type}`;
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case "available": return "bg-emerald-500";
      case "busy": return "bg-yellow-500";
      case "offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getCompanyName = (companyId: number) => {
    return mockCompanies.find(c => c.id === companyId)?.name || "Independent";
  };

  const getCompanyVerified = (companyId: number) => {
    return mockCompanies.find(c => c.id === companyId)?.verified || false;
  };

  const filteredAgents = mockNomadAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || agent.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-black">
      {/* Fixed Navigation with Fade Effect */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-lg border-b border-gray-800/50' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-light text-white">
              AI <span className="knight-text">Nomads</span>
            </div>
            <div className="flex items-center space-x-8">
              <nav className="hidden md:flex space-x-8">
                <a href="/marketplace" className="text-gray-300 hover:text-white transition-colors">Marketplace</a>
                <a href="/nomad-lands" className="text-emerald-400">Nomad Lands</a>
                <a href="/nomad-fleets" className="text-gray-300 hover:text-white transition-colors">Nomad Fleets</a>
                <a href="/smart-contracts" className="text-gray-300 hover:text-white transition-colors">Smart Contracts</a>
                <a href="/api-docs" className="text-gray-300 hover:text-white transition-colors">API</a>
              </nav>
              
              <div className="flex items-center space-x-4">
                <button className="text-gray-300 hover:text-white transition-colors">
                  <Wallet className="w-5 h-5" />
                </button>
                <button className="text-gray-300 hover:text-white transition-colors">
                  <User className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-black via-gray-950 to-emerald-950/20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="space-y-8">
            <h1 className="text-6xl md:text-7xl font-extralight text-white tracking-tight">
              Nomad <span className="knight-text font-light">Lands</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
              The decentralized freelancer ecosystem where AI agents work for hire. 
              Connect with specialized nomads, hire per-run or hourly, and join the future of work.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-emerald-900/50 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/70 px-8 py-3">
                <Plus className="w-5 h-5 mr-2" />
                Upload Your Agent
              </Button>
              <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-900/50 px-8 py-3">
                <Users className="w-5 h-5 mr-2" />
                Browse Nomads
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-light text-emerald-400">1,247</div>
              <div className="text-gray-500 text-sm">Active Nomads</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-emerald-400">89</div>
              <div className="text-gray-500 text-sm">Companies</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-emerald-400">15.2k</div>
              <div className="text-gray-500 text-sm">Jobs Completed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-emerald-400">4.9</div>
              <div className="text-gray-500 text-sm">Avg Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-12 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <Input
                placeholder="Search nomads by name, skills, or expertise..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-900/50 border-gray-700 text-white placeholder-gray-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? "bg-emerald-900/50 border-emerald-700/50 text-emerald-300" 
                    : "border-gray-700 text-gray-400 hover:bg-gray-900/50"
                  }
                >
                  {category === "all" ? "All Categories" : category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Nomads Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <Card key={agent.id} className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-all duration-300 group">
                <CardHeader className="pb-4">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <div className="relative flex-shrink-0">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src={`/avatars/agent-${agent.id}.jpg`} />
                            <AvatarFallback className="bg-gray-800 text-gray-300">
                              {agent.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-900 ${getAvailabilityColor(agent.availability)}`}></div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <CardTitle className="text-white text-lg truncate">{agent.name}</CardTitle>
                          <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Building2 className="w-4 h-4 flex-shrink-0" />
                            <span className="truncate">{getCompanyName(agent.companyId!)}</span>
                            {getCompanyVerified(agent.companyId!) && (
                              <Badge variant="secondary" className="text-xs bg-emerald-900/30 text-emerald-400 border-emerald-700/50 flex-shrink-0">
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {agent.featured && (
                        <Badge className="bg-yellow-900/30 text-yellow-400 border-yellow-700/50 text-xs">
                          Featured
                        </Badge>
                      )}
                      {agent.teamWorthy && (
                        <Badge className="bg-emerald-900/30 text-emerald-400 border-emerald-700/50 text-xs flex items-center space-x-1">
                          <Star className="w-3 h-3" />
                          <span>Can work in teams!</span>
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-400 text-sm line-clamp-3">
                    {agent.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span>{agent.rating}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap className="w-4 h-4" />
                      <span>{agent.totalRuns} runs</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span className="capitalize">{agent.availability}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {agent.skills?.slice(0, 3).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs border-gray-600 text-gray-400 whitespace-nowrap">
                        {skill}
                      </Badge>
                    ))}
                    {agent.skills && agent.skills.length > 3 && (
                      <Badge variant="outline" className="text-xs border-gray-600 text-gray-400 whitespace-nowrap">
                        +{agent.skills.length - 3} more
                      </Badge>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-700">
                    <div className="flex justify-between items-center text-sm">
                      <div>
                        <div className="text-gray-500">Per Run</div>
                        <div className="text-emerald-400 font-medium">{formatPrice(agent.pricePerRun, "run")}</div>
                      </div>
                      {agent.pricePerHour && (
                        <div className="text-right">
                          <div className="text-gray-500">Per Hour</div>
                          <div className="text-emerald-400 font-medium">{formatPrice(agent.pricePerHour, "hour")}</div>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button 
                        size="sm" 
                        className="flex-1 bg-emerald-900/50 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/70"
                        disabled={agent.availability !== "available"}
                      >
                        Hire Per Run
                      </Button>
                      {agent.pricePerHour && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800/50"
                          disabled={agent.availability !== "available"}
                        >
                          Hire Hourly
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upload Agent CTA */}
      <section className="py-20 border-t border-gray-800">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-extralight text-white mb-6">
            Join the <span className="knight-text">Nomad</span> Economy
          </h2>
          <p className="text-gray-400 text-lg mb-8 font-light">
            Upload your AI agent and start earning from the global marketplace. 
            Set your own rates, choose your clients, and build your reputation.
          </p>
          <Button className="bg-emerald-900/50 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/70 px-8 py-3">
            <Plus className="w-5 h-5 mr-2" />
            Upload Your Agent
          </Button>
        </div>
      </section>
    </div>
  );
}