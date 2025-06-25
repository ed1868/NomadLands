import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Search, Clock, CheckCircle, XCircle, Upload } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Agent {
  id: number;
  name: string;
  description: string;
  category: string;
  deploymentStatus: 'pending' | 'approved' | 'rejected' | 'deployed';
  tools: string[];
  createdAt: string;
  runs?: number;
  successRate?: string;
  revenue?: string;
}

export default function MyAgentsSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['/api/agents/my'],
    refetchInterval: 5000
  });

  const filteredAgents = agents.filter((agent: Agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || agent.deploymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (deploymentStatus: string) => {
    switch (deploymentStatus) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'approved':
      case 'deployed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (deploymentStatus: string) => {
    switch (deploymentStatus) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'approved':
      case 'deployed':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center space-x-2">
          <Bot className="w-6 h-6 text-emerald-500" />
          <span>My AI Agents</span>
        </h2>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin w-6 h-6 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
          <Bot className="w-6 h-6 text-emerald-500" />
          <span>My AI Agents</span>
          {agents.length > 0 && (
            <Badge className="bg-emerald-500/20 text-emerald-300 ml-2">
              {agents.length}
            </Badge>
          )}
        </h2>
        <Button 
          onClick={() => window.location.href = '/dashboard'} 
          className="bg-emerald-600 hover:bg-emerald-700"
          size="sm"
        >
          <Upload className="w-4 h-4 mr-2" />
          Create New Agent
        </Button>
      </div>

      {/* Filters */}
      {agents.length > 0 && (
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search agents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-600 text-white"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === "all" ? "default" : "outline"}
              onClick={() => setStatusFilter("all")}
              className="bg-gray-700 hover:bg-gray-600"
              size="sm"
            >
              All
            </Button>
            <Button
              variant={statusFilter === "pending" ? "default" : "outline"}
              onClick={() => setStatusFilter("pending")}
              className="bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300"
              size="sm"
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === "approved" ? "default" : "outline"}
              onClick={() => setStatusFilter("approved")}
              className="bg-green-600/20 hover:bg-green-600/30 text-green-300"
              size="sm"
            >
              Active
            </Button>
          </div>
        </div>
      )}

      {/* Agents Grid */}
      {filteredAgents.length === 0 && agents.length === 0 ? (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-8 text-center">
            <Bot className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Agents Created Yet</h3>
            <p className="text-gray-400 mb-4">
              Start building your first AI agent using the chat interface above!
            </p>
          </CardContent>
        </Card>
      ) : filteredAgents.length === 0 ? (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-8 text-center">
            <Bot className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No Agents Match Filters</h3>
            <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent: Agent) => (
            <Card key={agent.id} className="bg-gray-800/50 border-gray-700 hover:border-emerald-500/30 transition-all">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{agent.name}</h3>
                    <Badge variant="outline" className="text-xs bg-gray-700/50 text-gray-300">
                      {agent.category}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(agent.deploymentStatus)}
                    <Badge className={`text-xs ${getStatusColor(agent.deploymentStatus)}`}>
                      {agent.deploymentStatus === 'approved' ? 'Active' : agent.deploymentStatus?.charAt(0).toUpperCase() + agent.deploymentStatus?.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                  {agent.description}
                </p>
                
                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                  <div>
                    <p className="text-gray-500">Runs:</p>
                    <p className="font-semibold text-white">{agent.runs || 0}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Success Rate:</p>
                    <p className="font-semibold text-emerald-400">{agent.successRate || "0.00"}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Revenue:</p>
                    <p className="font-semibold text-green-400">${agent.revenue || "0.00"}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Created:</p>
                    <p className="text-gray-400">{new Date(agent.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {agent.tools && agent.tools.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Tools:</p>
                    <div className="flex flex-wrap gap-1">
                      {agent.tools.slice(0, 3).map((tool, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-gray-700/30 text-gray-400">
                          {tool}
                        </Badge>
                      ))}
                      {agent.tools.length > 3 && (
                        <Badge variant="outline" className="text-xs bg-gray-700/30 text-gray-400">
                          +{agent.tools.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs bg-gray-700/50 hover:bg-gray-700"
                  >
                    View
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs bg-gray-700/50 hover:bg-gray-700"
                    disabled={agent.deploymentStatus !== 'approved' && agent.deploymentStatus !== 'deployed'}
                  >
                    Run
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-xs bg-gray-700/50 hover:bg-gray-700"
                  >
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}