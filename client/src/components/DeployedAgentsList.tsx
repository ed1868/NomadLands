import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Activity, 
  DollarSign, 
  Globe, 
  Lock, 
  Building, 
  Zap, 
  TrendingUp, 
  Users, 
  Clock,
  ExternalLink,
  Settings,
  Trash2
} from "lucide-react";

interface AgentDeployment {
  id: number;
  name: string;
  description: string;
  category: string;
  apiEndpoint: string;
  status: string;
  healthStatus: string;
  accessType: string;
  pricePerCall: string;
  currency: string;
  totalCalls: number;
  totalRevenue: string;
  lastUsed: string;
  tags: string[];
  createdAt: string;
}

export default function DeployedAgentsList() {
  const { data: deployments, isLoading } = useQuery({
    queryKey: ["/api/deployments"],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="bg-black/40 border-green-500/20 animate-pulse">
            <CardContent className="p-6">
              <div className="h-6 bg-green-500/20 rounded mb-4"></div>
              <div className="h-4 bg-green-500/20 rounded mb-2"></div>
              <div className="h-4 bg-green-500/20 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!deployments || deployments.length === 0) {
    return (
      <Card className="bg-black/40 border-green-500/20">
        <CardContent className="p-8 text-center">
          <Zap className="w-12 h-12 text-green-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-green-400 mb-2">No Deployed Agents</h3>
          <p className="text-gray-400 mb-4">
            Deploy your first AI agent to start earning revenue from your creations.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getAccessIcon = (accessType: string) => {
    switch (accessType) {
      case 'public': return <Globe className="w-4 h-4" />;
      case 'private': return <Lock className="w-4 h-4" />;
      case 'enterprise': return <Building className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400';
      case 'inactive': return 'bg-gray-500/20 text-gray-400';
      case 'suspended': return 'bg-red-500/20 text-red-400';
      case 'error': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-400';
      case 'warning': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {deployments.map((deployment: AgentDeployment) => (
        <Card key={deployment.id} className="bg-black/40 border-green-500/20">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-green-400 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  {deployment.name}
                  <Badge className={getStatusColor(deployment.status)}>
                    {deployment.status}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-gray-400 mt-2">
                  {deployment.description}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-green-500/30 text-green-400">
                  <Settings className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="border-red-500/30 text-red-400">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Agent Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-gray-400">API Endpoint</p>
                <div className="flex items-center gap-2">
                  <code className="text-sm bg-black/30 px-2 py-1 rounded text-green-400 flex-1">
                    {deployment.apiEndpoint}
                  </code>
                  <Button variant="ghost" size="sm" className="text-green-400">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Access Type</p>
                <div className="flex items-center gap-2 text-green-400">
                  {getAccessIcon(deployment.accessType)}
                  <span className="capitalize">{deployment.accessType}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <p className="text-sm text-gray-400">Health Status</p>
                <div className="flex items-center gap-2">
                  <Activity className={`w-4 h-4 ${getHealthColor(deployment.healthStatus)}`} />
                  <span className={`capitalize ${getHealthColor(deployment.healthStatus)}`}>
                    {deployment.healthStatus}
                  </span>
                </div>
              </div>
            </div>

            <Separator className="bg-green-500/20" />

            {/* Performance Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-green-400 mb-1">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm text-gray-400">Total Calls</span>
                </div>
                <p className="text-xl font-semibold text-white">
                  {deployment.totalCalls?.toLocaleString() || 0}
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-green-400 mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm text-gray-400">Revenue</span>
                </div>
                <p className="text-xl font-semibold text-white">
                  ${parseFloat(deployment.totalRevenue || '0').toFixed(2)}
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-green-400 mb-1">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm text-gray-400">Price/Call</span>
                </div>
                <p className="text-xl font-semibold text-white">
                  ${parseFloat(deployment.pricePerCall || '0').toFixed(4)}
                </p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-green-400 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm text-gray-400">Last Used</span>
                </div>
                <p className="text-sm text-white">
                  {deployment.lastUsed ? 
                    new Date(deployment.lastUsed).toLocaleDateString() : 
                    'Never'
                  }
                </p>
              </div>
            </div>

            {/* Tags */}
            {deployment.tags && deployment.tags.length > 0 && (
              <>
                <Separator className="bg-green-500/20" />
                <div className="flex flex-wrap gap-2">
                  {deployment.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="bg-green-500/20 text-green-400">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" className="border-green-500/30 text-green-400">
                View Analytics
              </Button>
              <Button variant="outline" className="border-green-500/30 text-green-400">
                API Documentation
              </Button>
              <Button variant="outline" className="border-green-500/30 text-green-400">
                Test Endpoint
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}