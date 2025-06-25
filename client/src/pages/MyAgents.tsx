import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Search, Filter, Plus, Clock, CheckCircle, XCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

interface Agent {
  id: number;
  name: string;
  description: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  tools: string[];
  createdAt: string;
  updatedAt: string;
}

export default function MyAgents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: agents = [], isLoading } = useQuery({
    queryKey: ['/api/agents/my'],
    refetchInterval: 5000 // Refresh every 5 seconds to check for status updates
  });

  const filteredAgents = agents.filter((agent: Agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'approved':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'rejected':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Bot className="w-8 h-8 text-emerald-500" />
            <h1 className="text-3xl font-bold text-white">My AI Agents</h1>
          </div>
          <p className="text-gray-400">Manage and monitor your created AI agents</p>
        </div>

        {/* Filters and Search */}
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
            >
              All
            </Button>
            <Button
              variant={statusFilter === "pending" ? "default" : "outline"}
              onClick={() => setStatusFilter("pending")}
              className="bg-yellow-600/20 hover:bg-yellow-600/30 text-yellow-300"
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === "approved" ? "default" : "outline"}
              onClick={() => setStatusFilter("approved")}
              className="bg-green-600/20 hover:bg-green-600/30 text-green-300"
            >
              Approved
            </Button>
            <Button
              variant={statusFilter === "rejected" ? "default" : "outline"}
              onClick={() => setStatusFilter("rejected")}
              className="bg-red-600/20 hover:bg-red-600/30 text-red-300"
            >
              Rejected
            </Button>
          </div>
        </div>

        {/* Agents Grid */}
        {filteredAgents.length === 0 ? (
          <Card className="bg-gray-800/50 border-gray-700">
            <CardContent className="p-8 text-center">
              <Bot className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Agents Found</h3>
              <p className="text-gray-400 mb-4">
                {agents.length === 0 
                  ? "You haven't created any agents yet. Start building your first AI agent!"
                  : "No agents match your current filters."
                }
              </p>
              {agents.length === 0 && (
                <Button 
                  onClick={() => window.location.href = '/create'} 
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First Agent
                </Button>
              )}
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
                      {getStatusIcon(agent.status)}
                      <Badge className={`text-xs ${getStatusColor(agent.status)}`}>
                        {agent.status.charAt(0).toUpperCase() + agent.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                    {agent.description}
                  </p>
                  
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

                  <div className="text-xs text-gray-500 mb-3">
                    Created: {new Date(agent.createdAt).toLocaleDateString()}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500">Runs:</p>
                      <p className="text-sm font-semibold text-white">{agent.runs || 0}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Success Rate:</p>
                      <p className="text-sm font-semibold text-emerald-400">{agent.successRate || "0.00"}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Revenue:</p>
                      <p className="text-sm font-semibold text-green-400">${agent.revenue || "0.00"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Uploaded:</p>
                      <p className="text-xs text-gray-400">{new Date(agent.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">Quick Actions:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs bg-gray-800/50 hover:bg-gray-700 border-gray-600"
                      >
                        👁 View
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs bg-gray-800/50 hover:bg-gray-700 border-gray-600"
                      >
                        🔗 Flow
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs bg-gray-800/50 hover:bg-gray-700 border-gray-600"
                        disabled={agent.status !== 'approved'}
                      >
                        ▶ Run
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs bg-gray-800/50 hover:bg-gray-700 border-gray-600"
                      >
                        ✏ Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs bg-gray-800/50 hover:bg-gray-700 border-gray-600"
                      >
                        📊 Stats
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-xs bg-gray-800/50 hover:bg-gray-700 border-gray-600"
                      >
                        📋 Logs
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Create New Agent Button */}
        <div className="fixed bottom-8 right-8">
          <Button 
            onClick={() => window.location.href = '/create'} 
            className="bg-emerald-600 hover:bg-emerald-700 shadow-lg w-14 h-14 rounded-full"
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
      </div>
    </div>
  );
}