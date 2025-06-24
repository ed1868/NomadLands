import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import AgentDeploymentForm from "@/components/AgentDeploymentForm";
import DeployedAgentsList from "@/components/DeployedAgentsList";
import { 
  Zap, 
  Plus, 
  Rocket, 
  BarChart3, 
  Code, 
  Shield, 
  Globe,
  TrendingUp,
  Users,
  DollarSign
} from "lucide-react";

export default function Deploy() {
  const [showDeployForm, setShowDeployForm] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 to-black/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-green-400 to-emerald-300 bg-clip-text text-transparent">
                Deploy & Monetize
              </span>
              <br />
              Your AI Agents
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Transform your AI models into revenue-generating APIs. Deploy once, earn forever from a global marketplace of millions of users.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Instant Deployment
              </Badge>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 px-4 py-2">
                <Shield className="w-4 h-4 mr-2" />
                Enterprise Security
              </Badge>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 px-4 py-2">
                <Globe className="w-4 h-4 mr-2" />
                Global Distribution
              </Badge>
              <Badge variant="secondary" className="bg-green-500/20 text-green-400 px-4 py-2">
                <BarChart3 className="w-4 h-4 mr-2" />
                Real-time Analytics
              </Badge>
            </div>

            <Button 
              onClick={() => setShowDeployForm(true)}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Deploy Your First Agent
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-black/40 border-green-500/20 text-center">
            <CardContent className="p-6">
              <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">2.3M+</div>
              <div className="text-gray-400">API Calls This Month</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/40 border-green-500/20 text-center">
            <CardContent className="p-6">
              <Users className="w-8 h-8 text-green-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">12,847</div>
              <div className="text-gray-400">Active Developers</div>
            </CardContent>
          </Card>
          
          <Card className="bg-black/40 border-green-500/20 text-center">
            <CardContent className="p-6">
              <DollarSign className="w-8 h-8 text-green-400 mx-auto mb-4" />
              <div className="text-3xl font-bold text-white mb-2">$847K</div>
              <div className="text-gray-400">Creator Earnings</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="deployments" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="bg-black/40 border border-green-500/20">
              <TabsTrigger value="deployments" className="data-[state=active]:bg-green-600">
                <Zap className="w-4 h-4 mr-2" />
                My Deployments
              </TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-green-600">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="documentation" className="data-[state=active]:bg-green-600">
                <Code className="w-4 h-4 mr-2" />
                API Docs
              </TabsTrigger>
            </TabsList>

            {!showDeployForm && (
              <Button 
                onClick={() => setShowDeployForm(true)}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Deploy New Agent
              </Button>
            )}
          </div>

          <TabsContent value="deployments" className="space-y-6">
            {showDeployForm ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-green-400">Deploy New Agent</h2>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowDeployForm(false)}
                    className="border-green-500/30 text-green-400"
                  >
                    Cancel
                  </Button>
                </div>
                <AgentDeploymentForm onSuccess={() => setShowDeployForm(false)} />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-green-400">Your Deployed Agents</h2>
                  <div className="text-sm text-gray-400">
                    Manage and monitor your live AI agent deployments
                  </div>
                </div>
                <DeployedAgentsList />
              </div>
            )}
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-black/40 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-400">Analytics Dashboard</CardTitle>
                <CardDescription className="text-gray-400">
                  Detailed performance metrics and insights for your deployed agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">Analytics Coming Soon</h3>
                  <p className="text-gray-400">
                    Deploy your first agent to see detailed analytics and performance metrics
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="documentation" className="space-y-6">
            <Card className="bg-black/40 border-green-500/20">
              <CardHeader>
                <CardTitle className="text-green-400">API Documentation</CardTitle>
                <CardDescription className="text-gray-400">
                  Integration guides and API references for your deployed agents
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-black/30 rounded-lg p-6 border border-green-500/20">
                    <h4 className="text-lg font-semibold text-green-400 mb-4">Quick Start</h4>
                    <div className="space-y-4">
                      <div>
                        <h5 className="text-white font-medium mb-2">1. Make a Request</h5>
                        <code className="block bg-black/50 p-3 rounded text-green-400 text-sm">
                          curl -X POST https://api.nomads.ai/agents/deployed/your-endpoint \<br/>
                          &nbsp;&nbsp;-H "Content-Type: application/json" \<br/>
                          &nbsp;&nbsp;-d '{"{"}{"message": "Your input data"{"}"}'
                        </code>
                      </div>
                      
                      <div>
                        <h5 className="text-white font-medium mb-2">2. Handle Response</h5>
                        <code className="block bg-black/50 p-3 rounded text-green-400 text-sm">
                          {`{
  "result": "Generated response from your AI agent",
  "confidence": 0.95,
  "processing_time": "1.2s",
  "tokens_used": 150
}`}
                        </code>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="bg-black/30 border-green-500/20">
                      <CardContent className="p-4">
                        <h5 className="text-green-400 font-medium mb-2">Authentication</h5>
                        <p className="text-gray-400 text-sm">
                          Use API keys or JWT tokens for secure access to your deployed agents.
                        </p>
                      </CardContent>
                    </Card>
                    
                    <Card className="bg-black/30 border-green-500/20">
                      <CardContent className="p-4">
                        <h5 className="text-green-400 font-medium mb-2">Rate Limiting</h5>
                        <p className="text-gray-400 text-sm">
                          Configure custom rate limits and usage quotas for your API endpoints.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}