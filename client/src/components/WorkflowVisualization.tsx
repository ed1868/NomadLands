import { useState, useEffect } from "react";
import ReactFlow, { 
  MiniMap, 
  Controls, 
  Background, 
  Node,
  Edge,
  BackgroundVariant,
  MarkerType
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Code, 
  Eye, 
  Bot,
  Database,
  MessageSquare,
  Settings,
  ArrowRight,
  X,
  Workflow
} from "lucide-react";

interface WorkflowVisualizationProps {
  agent: any;
  onClose: () => void;
}

// Custom node component for workflow visualization
const WorkflowNode = ({ data }: { data: any }) => {
  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'chatTrigger': return <MessageSquare className="w-4 h-4" />;
      case 'ai': return <Bot className="w-4 h-4" />;
      case 'tool': return <Settings className="w-4 h-4" />;
      case 'memory': return <Database className="w-4 h-4" />;
      default: return <Workflow className="w-4 h-4" />;
    }
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'chatTrigger': return 'from-blue-500 to-blue-600';
      case 'ai': return 'from-emerald-500 to-emerald-600';
      case 'tool': return 'from-purple-500 to-purple-600';
      case 'memory': return 'from-orange-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className={`px-3 py-2 shadow-lg rounded-lg bg-gradient-to-r ${getNodeColor(data.type)} border border-white/20 min-w-[120px] max-w-[200px]`}>
      <div className="flex items-center space-x-2">
        <div className="text-white">
          {getNodeIcon(data.type)}
        </div>
        <div className="text-white">
          <div className="text-xs font-medium truncate">{data.label}</div>
          <div className="text-xs opacity-80 truncate">{data.subLabel}</div>
        </div>
      </div>
    </div>
  );
};

const nodeTypes = {
  workflowNode: WorkflowNode,
};

export default function WorkflowVisualization({ agent, onClose }: WorkflowVisualizationProps) {
  const [activeTab, setActiveTab] = useState("visual");
  const [workflowData, setWorkflowData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Generate sample workflow nodes and edges for demonstration
  const generateSampleWorkflow = () => {
    const nodes: Node[] = [
      {
        id: '1',
        type: 'workflowNode',
        position: { x: 50, y: 100 },
        data: { 
          label: 'Chat Trigger', 
          subLabel: 'Start conversation',
          type: 'chatTrigger'
        },
      },
      {
        id: '2',
        type: 'workflowNode',
        position: { x: 250, y: 50 },
        data: { 
          label: 'Memory Buffer', 
          subLabel: 'Store context',
          type: 'memory'
        },
      },
      {
        id: '3',
        type: 'workflowNode',
        position: { x: 450, y: 100 },
        data: { 
          label: 'GPT-4o Model', 
          subLabel: 'AI Processing',
          type: 'ai'
        },
      },
      {
        id: '4',
        type: 'workflowNode',
        position: { x: 250, y: 200 },
        data: { 
          label: 'Gmail Tool', 
          subLabel: 'Email integration',
          type: 'tool'
        },
      },
      {
        id: '5',
        type: 'workflowNode',
        position: { x: 450, y: 250 },
        data: { 
          label: 'Slack Tool', 
          subLabel: 'Team messaging',
          type: 'tool'
        },
      },
      {
        id: '6',
        type: 'workflowNode',
        position: { x: 650, y: 150 },
        data: { 
          label: 'Output Parser', 
          subLabel: 'Format response',
          type: 'tool'
        },
      },
    ];

    const edges: Edge[] = [
      {
        id: 'e1-2',
        source: '1',
        target: '2',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#10b981', strokeWidth: 2 }
      },
      {
        id: 'e1-3',
        source: '1',
        target: '3',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#10b981', strokeWidth: 2 }
      },
      {
        id: 'e2-3',
        source: '2',
        target: '3',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#10b981', strokeWidth: 2 }
      },
      {
        id: 'e3-4',
        source: '3',
        target: '4',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#10b981', strokeWidth: 2 }
      },
      {
        id: 'e3-5',
        source: '3',
        target: '5',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#10b981', strokeWidth: 2 }
      },
      {
        id: 'e4-6',
        source: '4',
        target: '6',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#10b981', strokeWidth: 2 }
      },
      {
        id: 'e5-6',
        source: '5',
        target: '6',
        type: 'smoothstep',
        markerEnd: { type: MarkerType.ArrowClosed },
        style: { stroke: '#10b981', strokeWidth: 2 }
      },
    ];

    return { nodes, edges };
  };

  const { nodes, edges } = generateSampleWorkflow();

  const generateWorkflow = async () => {
    setLoading(true);
    try {
      // Simulate API call - using agent data to generate realistic workflow
      const mockWorkflow = {
        name: `${agent.name} Workflow`,
        nodes: [
          {
            parameters: {},
            type: "@n8n/n8n-nodes-langchain.chatTrigger",
            typeVersion: 1.1,
            position: [460, 460],
            id: "1234-5678-9abc",
            name: "Chat Trigger",
          },
          {
            parameters: {
              model: "gpt-4o",
              options: {}
            },
            type: "@n8n/n8n-nodes-langchain.lmOpenAi",
            typeVersion: 1,
            position: [680, 460],
            id: "2345-6789-abcd",
            name: "OpenAI GPT-4o",
          }
        ],
        connections: {
          "Chat Trigger": {
            main: [
              [
                {
                  node: "OpenAI GPT-4o",
                  type: "main",
                  index: 0,
                },
              ],
            ],
          },
        },
        meta: {
          templateCredsSetupCompleted: true,
          instanceId: "1234567890abcdef",
        },
      };
      
      setWorkflowData(mockWorkflow);
    } catch (error) {
      console.error('Failed to generate workflow:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    generateWorkflow();
  }, [agent]);

  const downloadWorkflow = () => {
    if (!workflowData) return;
    
    const blob = new Blob([JSON.stringify(workflowData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${agent.name.replace(/\s+/g, '_')}_workflow.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'visual', label: 'Visual Flow', icon: Eye },
    { id: 'details', label: 'Node Details', icon: Settings },
    { id: 'json', label: 'JSON Structure', icon: Code },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-gray-900 rounded-lg border border-gray-700 w-full max-w-7xl h-[95vh] sm:h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-3 sm:p-6 border-b border-gray-700">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-xl font-bold text-white truncate">
              {agent.name} - Workflow Visualization
            </h2>
            <p className="text-gray-400 text-xs sm:text-sm mt-1">
              Interactive n8n-style workflow diagram
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="border-gray-600 text-gray-300 hover:bg-gray-800 ml-2 sm:ml-4"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/10'
                  : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
              }`}
            >
              <tab.icon className="w-3 h-3 sm:w-4 sm:h-4 inline-block mr-1 sm:mr-2" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden">
          {activeTab === 'visual' && (
            <div className="h-full p-2 sm:p-6">
              <div className="h-full border border-gray-700 rounded-lg bg-gray-800/30">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  nodeTypes={nodeTypes}
                  fitView
                  attributionPosition="bottom-left"
                  className="rounded-lg"
                  minZoom={0.1}
                  maxZoom={2}
                >
                  <Controls className="bg-gray-800 border border-gray-600 scale-75 sm:scale-100" />
                  <MiniMap 
                    className="bg-gray-800 border border-gray-600 scale-75 sm:scale-100"
                    nodeColor="#10b981"
                    maskColor="rgba(0, 0, 0, 0.8)"
                  />
                  <Background 
                    variant={BackgroundVariant.Dots}
                    gap={20}
                    size={1}
                    color="#10b981"
                    style={{ opacity: 0.3 }}
                  />
                </ReactFlow>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="h-full p-2 sm:p-6 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
                {nodes.map((node) => (
                  <div key={node.id} className="bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-700">
                    <div className="flex items-center space-x-2 sm:space-x-3 mb-2 sm:mb-3">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                        <Bot className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-xs sm:text-sm truncate">{node.data?.label || node.type}</h3>
                        <p className="text-xs text-gray-400">Type: {node.data?.type || 'workflow'}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="text-gray-400">Position:</span>
                        <span className="text-white ml-2">x: {Math.round(node.position.x)}, y: {Math.round(node.position.y)}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Description:</span>
                        <span className="text-white ml-2">{node.data?.subLabel || 'Workflow component'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="h-full p-2 sm:p-6 overflow-y-auto">
              <div className="bg-gray-800/50 rounded-lg p-3 sm:p-4 border border-gray-700 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h3 className="font-semibold text-white text-sm sm:text-base">Generated n8n Workflow JSON</h3>
                  <Button
                    size="sm"
                    onClick={downloadWorkflow}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm"
                    disabled={!workflowData}
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Download JSON</span>
                    <span className="sm:hidden">Download</span>
                  </Button>
                </div>
                <div className="flex-1 overflow-auto">
                  <pre className="text-xs text-gray-300 whitespace-pre-wrap">
                    {workflowData ? JSON.stringify(workflowData, null, 2) : 'Loading workflow data...'}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}