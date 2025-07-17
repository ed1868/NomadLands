import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Search, Filter, Plus, Clock, CheckCircle, XCircle, Workflow, Play, Pause, ExternalLink, Calendar } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

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

interface N8nWorkflow {
  id: number;
  userId: string;
  n8nWorkflowId: string;
  workflowName: string;
  webhookUrl: string;
  webhookPath: string;
  isActive: boolean;
  isArchived: boolean;
  totalRuns: number;
  successRate: string;
  averageRunTime: number;
  totalRevenue: string;
  createdAt: string;
  updatedAt: string;
}

export default function MyAgents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<'agents' | 'workflows'>('agents');
  const queryClient = useQueryClient();

  const { data: agents = [], isLoading: agentsLoading } = useQuery({
    queryKey: ['/api/agents/my'],
    refetchInterval: 5000 // Refresh every 5 seconds to check for status updates
  });

  const { data: n8nWorkflows = [], isLoading: workflowsLoading } = useQuery({
    queryKey: ['/api/n8n/workflows'],
    refetchInterval: 10000 // Refresh every 10 seconds to check for workflow updates
  });

  const toggleWorkflowMutation = useMutation({
    mutationFn: async (workflowId: number) => {
      return apiRequest('PATCH', `/api/n8n/workflows/${workflowId}/toggle`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/n8n/workflows'] });
    }
  });

  const filteredAgents = agents.filter((agent: Agent) => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || agent.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredWorkflows = n8nWorkflows.filter((workflow: N8nWorkflow) => {
    const matchesSearch = workflow.workflowName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         workflow.webhookPath?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && workflow.isActive) ||
                         (statusFilter === "inactive" && !workflow.isActive) ||
                         (statusFilter === "archived" && workflow.isArchived);
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

  const isLoading = activeTab === 'agents' ? agentsLoading : workflowsLoading;

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
          <p className="text-gray-400">Manage and monitor your created AI agents and deployed workflows</p>
          
          {/* Tabs */}
          <div className="flex space-x-1 mt-6 bg-gray-800/50 rounded-lg p-1">
            <button
              onClick={() => {
                setActiveTab('agents');
                setStatusFilter('all');
                setSearchTerm('');
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'agents'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>AI Agents</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('workflows');
                setStatusFilter('all');
                setSearchTerm('');
              }}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'workflows'
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700'
              }`}
            >
              <Workflow className="w-4 h-4" />
              <span>N8N Workflows</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder={activeTab === 'agents' ? "Search agents..." : "Search workflows..."}
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
            {activeTab === 'agents' ? (
              <>
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
              </>
            ) : (
              <>
                <Button
                  variant={statusFilter === "active" ? "default" : "outline"}
                  onClick={() => setStatusFilter("active")}
                  className="bg-green-600/20 hover:bg-green-600/30 text-green-300"
                >
                  Active
                </Button>
                <Button
                  variant={statusFilter === "inactive" ? "default" : "outline"}
                  onClick={() => setStatusFilter("inactive")}
                  className="bg-gray-600/20 hover:bg-gray-600/30 text-gray-300"
                >
                  Inactive
                </Button>
                <Button
                  variant={statusFilter === "archived" ? "default" : "outline"}
                  onClick={() => setStatusFilter("archived")}
                  className="bg-red-600/20 hover:bg-red-600/30 text-red-300"
                >
                  Archived
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'agents' ? (
          filteredAgents.length === 0 ? (
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

                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1 text-xs bg-gray-700/50 hover:bg-gray-700"
                    >
                      View Details
                    </Button>
                    {agent.status === 'approved' && (
                      <Button 
                        size="sm" 
                        className="flex-1 text-xs bg-emerald-600 hover:bg-emerald-700"
                      >
                        Deploy
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          )
        ) : (
          /* N8N Workflows Section */
          filteredWorkflows.length === 0 ? (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardContent className="p-8 text-center">
                <Workflow className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Workflows Found</h3>
                <p className="text-gray-400 mb-4">
                  {n8nWorkflows.length === 0 
                    ? "No n8n workflows have been deployed yet. Create workflows in n8n to see them here!"
                    : "No workflows match your current filters."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredWorkflows.map((workflow: N8nWorkflow) => (
                <Card key={workflow.id} className="bg-gray-800/50 border-gray-700 hover:border-emerald-500/30 transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-white mb-1 truncate">
                          {workflow.workflowName.split('_').slice(2).join('_') || workflow.workflowName}
                        </h3>
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant="outline" className="text-xs bg-gray-700/50 text-gray-300">
                            n8n
                          </Badge>
                          <Badge className={`text-xs ${workflow.isActive ? 'bg-green-500/20 text-green-300 border-green-500/30' : 'bg-gray-500/20 text-gray-300 border-gray-500/30'}`}>
                            {workflow.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {workflow.webhookPath && (
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Webhook Path:</p>
                          <code className="text-xs bg-gray-700/50 px-2 py-1 rounded text-emerald-400 break-all">
                            /{workflow.webhookPath}
                          </code>
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <p className="text-gray-500">Total Runs</p>
                          <p className="text-white font-medium">{workflow.totalRuns || 0}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Success Rate</p>
                          <p className="text-white font-medium">{workflow.successRate || '0'}%</p>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        <div className="flex items-center space-x-1 mb-1">
                          <Calendar className="w-3 h-3" />
                          <span>Created: {new Date(workflow.createdAt).toLocaleDateString()}</span>
                        </div>
                        {workflow.updatedAt !== workflow.createdAt && (
                          <div className="flex items-center space-x-1">
                            <span>Updated: {new Date(workflow.updatedAt).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="flex-1 text-xs bg-gray-700/50 hover:bg-gray-700"
                          onClick={() => window.open(workflow.webhookUrl, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View in n8n
                        </Button>
                        <Button 
                          size="sm" 
                          variant={workflow.isActive ? "destructive" : "default"}
                          className={`flex-1 text-xs ${workflow.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                          onClick={() => toggleWorkflowMutation.mutate(workflow.id)}
                          disabled={toggleWorkflowMutation.isPending}
                        >
                          {workflow.isActive ? (
                            <>
                              <Pause className="w-3 h-3 mr-1" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 mr-1" />
                              Activate
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )
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