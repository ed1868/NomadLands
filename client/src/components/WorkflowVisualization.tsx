import { useState, useEffect } from "react";
import ReactFlow, { 
  MiniMap, 
  Controls, 
  Background, 
  Node,
  Edge,
  BackgroundVariant,
  MarkerType,
  Handle,
  Position
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

// Custom node component for workflow visualization with proper handles
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

  // Sticky Note component
  if (data.type === 'stickyNote') {
    return (
      <div 
        className="relative bg-yellow-100 border-2 border-yellow-300 rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform duration-200"
        style={{ 
          width: data.parameters?.width || 300, 
          height: data.parameters?.height || 150,
          backgroundColor: data.parameters?.color === 4 ? '#fef3c7' : 
                          data.parameters?.color === 6 ? '#e0f2fe' : 
                          data.parameters?.color === 5 ? '#f3e8ff' : 
                          data.parameters?.color === 2 ? '#f0f9ff' : '#fef3c7'
        }}
        onClick={() => data.onNodeClick?.(data)}
      >
        <div className="p-3 h-full overflow-y-auto">
          <div className="text-gray-800 text-sm leading-relaxed whitespace-pre-wrap">
            {data.parameters?.content || data.label}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative px-3 py-2 shadow-lg rounded-lg bg-gradient-to-r ${getNodeColor(data.type)} border border-white/20 min-w-[120px] max-w-[200px] cursor-pointer hover:scale-105 transition-transform duration-200`}
      onClick={() => data.onNodeClick?.(data)}
    >
      {/* Input Handle */}
      {data.type !== 'chatTrigger' && data.type !== 'stickyNote' && (
        <Handle
          type="target"
          position={Position.Left}
          className="w-3 h-3 bg-emerald-500 border-2 border-emerald-300 shadow-lg shadow-emerald-500/50"
          style={{ background: '#10b981', left: -6 }}
        />
      )}
      
      <div className="flex items-center space-x-2">
        <div className="text-white">
          {getNodeIcon(data.type)}
        </div>
        <div className="text-white">
          <div className="text-xs font-medium truncate">{data.label}</div>
          <div className="text-xs opacity-80 truncate">{data.subLabel}</div>
        </div>
      </div>

      {/* Output Handle */}
      {data.type !== 'stickyNote' && (
        <Handle
          type="source"
          position={Position.Right}
          className="w-3 h-3 bg-emerald-500 border-2 border-emerald-300 shadow-lg shadow-emerald-500/50"
          style={{ background: '#10b981', right: -6 }}
        />
      )}
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
  const [selectedNode, setSelectedNode] = useState<any>(null);

  // Convert n8n workflow JSON to ReactFlow nodes and edges
  const convertWorkflowToReactFlow = (workflow: any) => {
    if (!workflow || !workflow.nodes) return { nodes: [], edges: [] };

    const nodes: Node[] = workflow.nodes.map((node: any) => {
      const getNodeType = (n8nType: string) => {
        if (n8nType.includes('chatTrigger')) return 'chatTrigger';
        if (n8nType.includes('lmOpenAi') || n8nType.includes('ai')) return 'ai';
        if (n8nType.includes('memory') || n8nType.includes('buffer')) return 'memory';
        return 'tool';
      };

      return {
        id: node.id,
        type: 'workflowNode',
        position: { x: node.position[0], y: node.position[1] },
        data: {
          label: node.name,
          subLabel: node.type.split('.').pop() || 'Node',
          type: getNodeType(node.type),
          parameters: node.parameters,
          fullType: node.type,
          nodeId: node.id,
          onNodeClick: (nodeData: any) => setSelectedNode({ ...nodeData, originalNode: node })
        },
      };
    });

    const edges: Edge[] = [];
    if (workflow.connections) {
      Object.entries(workflow.connections).forEach(([sourceNodeName, connections]: [string, any]) => {
        const sourceNode = workflow.nodes.find((n: any) => n.name === sourceNodeName);
        if (!sourceNode) return;

        connections.main?.[0]?.forEach((connection: any, index: number) => {
          const targetNode = workflow.nodes.find((n: any) => n.name === connection.node);
          if (targetNode) {
            edges.push({
              id: `${sourceNode.id}-${targetNode.id}-${index}`,
              source: sourceNode.id,
              target: targetNode.id,
              type: 'smoothstep',
              markerEnd: { type: MarkerType.ArrowClosed },
              style: { stroke: '#10b981', strokeWidth: 2 }
            });
          }
        });
      });
    }

    return { nodes, edges };
  };

  const [reactFlowData, setReactFlowData] = useState<{ nodes: Node[], edges: Edge[] }>({ nodes: [], edges: [] });

  useEffect(() => {
    if (workflowData) {
      const { nodes, edges } = convertWorkflowToReactFlow(workflowData);
      setReactFlowData({ nodes, edges });
    }
  }, [workflowData]);

  const generateWorkflow = async () => {
    setLoading(true);
    try {
      // Generate realistic n8n workflow based on agent
      const mockWorkflow = {
        name: "n8n Builder Workflow",
        nodes: [
          {
            parameters: {
              options: {}
            },
            type: "@n8n/n8n-nodes-langchain.chatTrigger",
            typeVersion: 1.1,
            position: [-500, 20],
            id: "864f0d4f-2652-4100-91d2-2aad9eb556d5",
            name: "When chat message received",
            webhookId: "d832bc01-555e-4a24-a8cc-31db8fc1c816"
          },
          {
            parameters: {
              model: {
                "__rl": true,
                "value": "claude-opus-4-20250514",
                "mode": "list",
                "cachedResultName": "Claude Opus 4"
              },
              options: {
                maxTokensToSample: 8000,
                thinking: true,
                thinkingBudget: 1024
              }
            },
            type: "@n8n/n8n-nodes-langchain.lmChatAnthropic",
            typeVersion: 1.3,
            position: [180, 700],
            id: "997d9c78-8cb1-4dc5-bd26-c6be8df389aa",
            name: "Claude Opus 4",
            credentials: {
              anthropicApi: {
                id: "FzhOcn5sLnl6NF7Q",
                name: "Anthropic account"
              }
            }
          },
          {
            parameters: {
              operation: "text",
              options: {}
            },
            type: "n8n-nodes-base.extractFromFile",
            typeVersion: 1,
            position: [-60, 480],
            id: "814b37f2-0939-4032-ae28-b59d4eeb5e59",
            name: "Extract from File"
          },
          {
            parameters: {
              promptType: "define",
              text: "=User request: {{ $('workwork').item.json.query }}",
              options: {
                systemMessage: "You are an expert AI automation developer specializing in building workflows for n8n. Your job is to translate a human's natural language request into a fully functional n8n workflow JSON."
              }
            },
            type: "@n8n/n8n-nodes-langchain.agent",
            typeVersion: 2,
            position: [160, 480],
            id: "39e4aec5-1017-4cf8-853b-4d0dbbe400e7",
            name: "n8n Builder",
            alwaysOutputData: false
          },
          {
            parameters: {
              options: {
                systemMessage: "Your job is to take the incoming query and pass that to the Developer Tool tool EXACTLY AS YOU RECEIVED IT. Don't change any of the wording."
              }
            },
            type: "@n8n/n8n-nodes-langchain.agent",
            typeVersion: 2,
            position: [-248, 20],
            id: "0fb217cd-e41a-49fd-8460-4b982e34ccb3",
            name: "n8n Developer"
          },
          {
            parameters: {
              description: "Call this tool once you have a finished workflow design to build the workflow.",
              workflowId: {
                "__rl": true,
                "value": "8rF4sA4hWpSwcSQt",
                "mode": "id"
              }
            },
            type: "@n8n/n8n-nodes-langchain.toolWorkflow",
            typeVersion: 2.2,
            position: [-40, 240],
            id: "2d817ebd-7abc-4005-8da0-91cb61075baa",
            name: "Developer Tool"
          },
          {
            parameters: {},
            type: "@n8n/n8n-nodes-langchain.memoryBufferWindow",
            typeVersion: 1.3,
            position: [-400, 260],
            id: "a3bd651b-7f56-45df-b068-de9aed9e85f0",
            name: "Simple Memory"
          },
          {
            parameters: {
              model: {
                "__rl": true,
                "mode": "list",
                "value": "gpt-4.1-mini"
              },
              options: {}
            },
            type: "@n8n/n8n-nodes-langchain.lmChatOpenAi",
            typeVersion: 1.2,
            position: [-520, 260],
            id: "db914a33-6a19-4752-b96d-292b5d9c1a3a",
            name: "OpenAI Chat Model",
            credentials: {
              openAiApi: {
                id: "HIkseAGipFDil7rW",
                name: "OpenAi account"
              }
            }
          },
          {
            parameters: {
              operation: "download",
              fileId: {
                "__rl": true,
                "value": "1ezGwMWhvOk6BZbLNZ0_eQYeqEMCiTekDSmVxY7rksdg",
                "mode": "list",
                "cachedResultName": "n8n Documentation"
              },
              options: {
                googleFileConversion: {
                  conversion: {
                    docsToFormat: "text/plain"
                  }
                }
              }
            },
            type: "n8n-nodes-base.googleDrive",
            typeVersion: 3,
            position: [-280, 480],
            id: "817c73bb-7843-4a4a-83eb-12dbe6059867",
            name: "Get n8n Docs",
            credentials: {
              googleDriveOAuth2Api: {
                id: "4uymesgeGGNsFprZ",
                name: "Google Drive account"
              }
            }
          },
          {
            parameters: {
              inputSource: "passthrough"
            },
            type: "n8n-nodes-base.executeWorkflowTrigger",
            typeVersion: 1.1,
            position: [-500, 520],
            id: "a49024d8-ddf5-4382-b1ad-936927ad243f",
            name: "workwork"
          },
          {
            parameters: {
              assignments: {
                assignments: [
                  {
                    id: "ab073780-d17b-4855-997e-b3a30a26a329",
                    name: "id",
                    value: "=https://romadeveloper.app.n8n.cloud/workflow/{{ $json.id }}",
                    type: "string"
                  }
                ]
              },
              options: {}
            },
            type: "n8n-nodes-base.set",
            typeVersion: 3.4,
            position: [760, 480],
            id: "21c07fb5-9232-4864-9002-fb68026f627d",
            name: "Edit Fields"
          },
          {
            parameters: {
              operation: "create",
              workflowObject: "={{ $json.output[1].text }}",
              requestOptions: {}
            },
            type: "n8n-nodes-base.n8n",
            typeVersion: 1,
            position: [520, 480],
            id: "22983a76-e290-4477-91ac-0ec0e9ecf95f",
            name: "Create a workflow",
            credentials: {
              n8nApi: {
                id: "CnnhSIcXICxz6vyY",
                name: "n8n account"
              }
            }
          },
          // Sticky Notes for documentation
          {
            parameters: {
              content: "# n8n Developer Agent\n\nThis workflow creates AI agents that can build other n8n workflows automatically.",
              height: 280,
              width: 660,
              color: 4
            },
            type: "n8n-nodes-base.stickyNote",
            typeVersion: 1,
            position: [-576, -100],
            id: "sticky-note-header",
            name: "Header Info"
          },
          {
            parameters: {
              content: "## Brain\n\nAI processing with OpenAI and Claude models for intelligent workflow generation.",
              height: 200,
              width: 320,
              color: 6
            },
            type: "n8n-nodes-base.stickyNote",
            typeVersion: 1,
            position: [-560, 200],
            id: "sticky-note-brain",
            name: "Brain Section"
          },
          {
            parameters: {
              content: "## Tool\n\nDeveloper tools for workflow creation and file processing.",
              height: 200,
              width: 320,
              color: 5
            },
            type: "n8n-nodes-base.stickyNote",
            typeVersion: 1,
            position: [-200, 200],
            id: "sticky-note-tool",
            name: "Tool Section"
          },
          {
            parameters: {
              content: "# Workflow Builder\n\nCore workflow generation system with Claude Opus 4 and n8n API integration.",
              height: 440,
              width: 1540,
              color: 2
            },
            type: "n8n-nodes-base.stickyNote",
            typeVersion: 1,
            position: [-560, 420],
            id: "sticky-note-builder",
            name: "Workflow Builder Section"
          }
        ],
        connections: {
          "When chat message received": {
            main: [
              [
                {
                  node: "n8n Developer",
                  type: "main",
                  index: 0
                }
              ]
            ]
          },
          "Claude Opus 4": {
            ai_languageModel: [
              [
                {
                  node: "n8n Builder",
                  type: "ai_languageModel",
                  index: 0
                }
              ]
            ]
          },
          "Extract from File": {
            main: [
              [
                {
                  node: "n8n Builder",
                  type: "main",
                  index: 0
                }
              ]
            ]
          },
          "n8n Builder": {
            main: [
              [
                {
                  node: "Create a workflow",
                  type: "main",
                  index: 0
                }
              ]
            ]
          },
          "Developer Tool": {
            ai_tool: [
              [
                {
                  node: "n8n Developer",
                  type: "ai_tool",
                  index: 0
                }
              ]
            ]
          },
          "Simple Memory": {
            ai_memory: [
              [
                {
                  node: "n8n Developer",
                  type: "ai_memory",
                  index: 0
                }
              ]
            ]
          },
          "OpenAI Chat Model": {
            ai_languageModel: [
              [
                {
                  node: "n8n Developer",
                  type: "ai_languageModel",
                  index: 0
                }
              ]
            ]
          },
          "Get n8n Docs": {
            main: [
              [
                {
                  node: "Extract from File",
                  type: "main",
                  index: 0
                }
              ]
            ]
          },
          "workwork": {
            main: [
              [
                {
                  node: "Get n8n Docs",
                  type: "main",
                  index: 0
                }
              ]
            ]
          },
          "Create a workflow": {
            main: [
              [
                {
                  node: "Edit Fields",
                  type: "main",
                  index: 0
                }
              ]
            ]
          }
        },
        meta: {
          templateCredsSetupCompleted: true,
          instanceId: "9397da5cd2a0f7613d20df414cb2c5a92e1627b6bbedf1b322b0a046e1b57940",
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

        {/* Node Details Sidebar */}
        {selectedNode && (
          <div className="absolute right-0 top-0 w-80 h-full bg-gray-800/95 border-l border-gray-700 z-50 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-bold text-white">Node Details</h4>
                <Button
                  onClick={() => setSelectedNode(null)}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                {/* Node Info */}
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <h5 className="text-white font-semibold mb-2">Basic Information</h5>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-400">Name:</span>
                      <span className="text-white ml-2">{selectedNode.label}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Type:</span>
                      <span className="text-white ml-2">{selectedNode.fullType}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">ID:</span>
                      <span className="text-white ml-2 font-mono text-xs">{selectedNode.nodeId}</span>
                    </div>
                    <div>
                      <span className="text-gray-400">Category:</span>
                      <span className="text-white ml-2 capitalize">{selectedNode.type}</span>
                    </div>
                  </div>
                </div>

                {/* Parameters */}
                {selectedNode.parameters && Object.keys(selectedNode.parameters).length > 0 && (
                  <div className="bg-gray-700/50 rounded-lg p-3">
                    <h5 className="text-white font-semibold mb-2">Parameters</h5>
                    <div className="space-y-2 text-sm">
                      {Object.entries(selectedNode.parameters).map(([key, value]) => (
                        <div key={key}>
                          <span className="text-gray-400">{key}:</span>
                          <div className="text-white ml-2 mt-1">
                            {typeof value === 'object' ? (
                              <pre className="bg-gray-800 p-2 rounded text-xs overflow-x-auto">
                                {JSON.stringify(value, null, 2)}
                              </pre>
                            ) : (
                              <span className="break-words">{String(value)}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Connections */}
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <h5 className="text-white font-semibold mb-2">Connections</h5>
                  <div className="space-y-2 text-sm">
                    {workflowData && workflowData.connections && (
                      <>
                        {/* Outgoing connections */}
                        {workflowData.connections[selectedNode.label]?.main?.[0] && (
                          <div>
                            <span className="text-gray-400">Outputs to:</span>
                            <div className="ml-2 mt-1">
                              {workflowData.connections[selectedNode.label].main[0].map((conn: any, idx: number) => (
                                <div key={idx} className="text-emerald-400 text-xs">
                                  → {conn.node}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Incoming connections */}
                        {Object.entries(workflowData.connections).map(([sourceName, connections]: [string, any]) => {
                          const hasConnectionToThisNode = connections.main?.[0]?.some((conn: any) => conn.node === selectedNode.label);
                          if (hasConnectionToThisNode) {
                            return (
                              <div key={sourceName}>
                                <span className="text-gray-400">Input from:</span>
                                <div className="text-blue-400 text-xs ml-2">
                                  ← {sourceName}
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })}
                      </>
                    )}
                  </div>
                </div>

                {/* Node Description */}
                <div className="bg-gray-700/50 rounded-lg p-3">
                  <h5 className="text-white font-semibold mb-2">Description</h5>
                  <p className="text-gray-300 text-sm">
                    {selectedNode.type === 'chatTrigger' && "Triggers the workflow when a chat message is received."}
                    {selectedNode.type === 'ai' && "Processes input using AI language models to generate intelligent responses."}
                    {selectedNode.type === 'memory' && "Stores and retrieves conversation context for maintaining chat history."}
                    {selectedNode.type === 'tool' && "Integrates with external services and APIs to perform specific actions."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden relative">
          {activeTab === 'visual' && (
            <div className="h-full p-2 sm:p-6">
              <div className="h-full border border-gray-700 rounded-lg bg-gray-800/30">
                <ReactFlow
                  nodes={reactFlowData.nodes}
                  edges={reactFlowData.edges}
                  nodeTypes={nodeTypes}
                  fitView
                  attributionPosition="bottom-left"
                  className="rounded-lg"
                  minZoom={0.1}
                  maxZoom={2}
                  onNodeClick={(event, node) => {
                    if (node.data.onNodeClick) {
                      node.data.onNodeClick(node.data);
                    }
                  }}
                  style={{ marginRight: selectedNode ? '320px' : '0' }}
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
                {reactFlowData.nodes.map((node) => (
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