import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Download, 
  Code, 
  Eye, 
  Play, 
  GitBranch, 
  Zap,
  Bot,
  Database,
  MessageSquare,
  Settings,
  ArrowRight
} from "lucide-react";

interface WorkflowNode {
  id: string;
  name: string;
  type: string;
  position: [number, number];
  parameters: Record<string, any>;
  credentials?: Record<string, any>;
}

interface WorkflowVisualizationProps {
  agentId: number;
  agentName: string;
  onClose: () => void;
}

export default function WorkflowVisualization({ agentId, agentName, onClose }: WorkflowVisualizationProps) {
  const [workflowData, setWorkflowData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("visual");

  const generateWorkflow = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/agents/${agentId}/generate-workflow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tools: ["gmail", "slack", "notion"],
          aiModel: "gpt-4o",
          name: agentName,
          systemPrompt: `You are ${agentName}, an advanced AI agent for productivity automation.`
        })
      });
      
      const workflow = await response.json();
      setWorkflowData(workflow);
    } catch (error) {
      console.error('Error generating workflow:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadWorkflow = () => {
    if (!workflowData) return;
    
    const blob = new Blob([JSON.stringify(workflowData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${agentName.toLowerCase().replace(/\s+/g, '-')}-workflow.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getNodeIcon = (nodeType: string) => {
    if (nodeType.includes('chatTrigger')) return <MessageSquare className="w-4 h-4" />;
    if (nodeType.includes('agent')) return <Bot className="w-4 h-4" />;
    if (nodeType.includes('languageModel') || nodeType.includes('OpenAi')) return <Zap className="w-4 h-4" />;
    if (nodeType.includes('memory')) return <Database className="w-4 h-4" />;
    if (nodeType.includes('gmail') || nodeType.includes('slack') || nodeType.includes('notion')) return <Settings className="w-4 h-4" />;
    return <GitBranch className="w-4 h-4" />;
  };

  const getNodeColor = (nodeType: string) => {
    if (nodeType.includes('chatTrigger')) return "bg-blue-500/20 border-blue-500/40 text-blue-300";
    if (nodeType.includes('agent')) return "bg-purple-500/20 border-purple-500/40 text-purple-300";
    if (nodeType.includes('languageModel') || nodeType.includes('OpenAi')) return "bg-green-500/20 border-green-500/40 text-green-300";
    if (nodeType.includes('memory')) return "bg-orange-500/20 border-orange-500/40 text-orange-300";
    if (nodeType.includes('gmail')) return "bg-red-500/20 border-red-500/40 text-red-300";
    if (nodeType.includes('slack')) return "bg-yellow-500/20 border-yellow-500/40 text-yellow-300";
    if (nodeType.includes('notion')) return "bg-cyan-500/20 border-cyan-500/40 text-cyan-300";
    return "bg-gray-500/20 border-gray-500/40 text-gray-300";
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl h-[90vh] bg-gray-900/95 border-gray-700">
        <CardHeader className="border-b border-gray-700 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl text-white">
              {agentName} - N8n Workflow Structure
            </CardTitle>
            <p className="text-gray-400 text-sm mt-1">
              Generate and visualize the n8n workflow for this agent
            </p>
          </div>
          <div className="flex gap-2">
            {workflowData && (
              <Button onClick={downloadWorkflow} variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download JSON
              </Button>
            )}
            <Button onClick={onClose} variant="outline" size="sm">
              Close
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 h-[calc(100%-8rem)]">
          {!workflowData ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4">
              <div className="text-center">
                <Bot className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl text-white mb-2">Generate N8n Workflow</h3>
                <p className="text-gray-400 mb-6 max-w-md">
                  Create a production-ready n8n workflow file that you can import directly into your n8n instance.
                </p>
                <Button 
                  onClick={generateWorkflow} 
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Generate Workflow
                    </>
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="grid w-full grid-cols-3 bg-gray-800">
                <TabsTrigger value="visual" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  Visual Flow
                </TabsTrigger>
                <TabsTrigger value="nodes" className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4" />
                  Node Details
                </TabsTrigger>
                <TabsTrigger value="json" className="flex items-center gap-2">
                  <Code className="w-4 h-4" />
                  JSON Structure
                </TabsTrigger>
              </TabsList>

              <TabsContent value="visual" className="h-[calc(100%-3rem)] mt-4">
                <Card className="h-full bg-gray-800/50 border-gray-600">
                  <CardContent className="p-6 h-full">
                    <div className="grid grid-cols-4 gap-4 h-full">
                      {workflowData.nodes?.map((node: WorkflowNode, index: number) => (
                        <div key={node.id} className="relative">
                          <Card className={`${getNodeColor(node.type)} border-2 p-4 h-full`}>
                            <div className="flex items-center gap-2 mb-2">
                              {getNodeIcon(node.type)}
                              <h4 className="font-medium text-sm truncate">{node.name}</h4>
                            </div>
                            <Badge variant="secondary" className="text-xs mb-2">
                              {node.type.split('.').pop()}
                            </Badge>
                            <p className="text-xs opacity-70 line-clamp-2">
                              {node.parameters?.text || node.parameters?.model || 'Node configuration'}
                            </p>
                          </Card>
                          
                          {index < workflowData.nodes.length - 1 && (
                            <ArrowRight className="absolute -right-6 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="nodes" className="h-[calc(100%-3rem)] mt-4">
                <ScrollArea className="h-full">
                  <div className="space-y-4">
                    {workflowData.nodes?.map((node: WorkflowNode) => (
                      <Card key={node.id} className="bg-gray-800/50 border-gray-600">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3 mb-3">
                            {getNodeIcon(node.type)}
                            <div>
                              <h4 className="font-medium text-white">{node.name}</h4>
                              <p className="text-sm text-gray-400">{node.type}</p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-400 mb-1">Position:</p>
                              <p className="text-gray-300">[{node.position.join(', ')}]</p>
                            </div>
                            <div>
                              <p className="text-gray-400 mb-1">Parameters:</p>
                              <p className="text-gray-300 font-mono text-xs">
                                {Object.keys(node.parameters || {}).length} configs
                              </p>
                            </div>
                          </div>
                          
                          {node.credentials && (
                            <div className="mt-3">
                              <p className="text-gray-400 text-sm mb-1">Credentials Required:</p>
                              <div className="flex flex-wrap gap-1">
                                {Object.keys(node.credentials).map(cred => (
                                  <Badge key={cred} variant="outline" className="text-xs">
                                    {cred}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="json" className="h-[calc(100%-3rem)] mt-4">
                <Card className="h-full bg-gray-800/50 border-gray-600">
                  <CardContent className="p-0 h-full">
                    <ScrollArea className="h-full">
                      <pre className="p-6 text-xs text-gray-300 font-mono leading-relaxed">
                        {JSON.stringify(workflowData, null, 2)}
                      </pre>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}