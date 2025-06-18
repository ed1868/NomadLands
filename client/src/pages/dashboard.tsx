import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/use-wallet";
import ReactFlow, { 
  MiniMap, 
  Controls, 
  Background, 
  useNodesState, 
  useEdgesState, 
  addEdge,
  Node,
  Edge,
  Connection,
  BackgroundVariant,
  MarkerType,
  Position,
  Handle,
  NodeTypes
} from 'reactflow';
import 'reactflow/dist/style.css';
import { 
  User, 
  Wallet, 
  Bot, 
  FileText, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Settings, 
  Edit3, 
  Save,
  X,
  Eye,
  Play,
  Pause,
  AlertCircle,
  CheckCircle,
  Clock,
  Trophy,
  Target,
  Trash2,
  Zap,
  BarChart3,
  PieChart,
  Upload,
  Download,
  RefreshCw,
  MapPin,
  Users,
  Building2,
  Cpu,
  Network,
  Shield,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Timer,
  Coins,
  ChevronLeft,
  ChevronRight,
  Menu
} from "lucide-react";

// Custom Agent Node Component with visible handles
const AgentNode = ({ data }: { data: any }) => {
  return (
    <div className="relative">
      {/* Connection Handles */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-4 h-4 bg-emerald-500 border-2 border-emerald-300 shadow-lg shadow-emerald-500/50 hover:bg-emerald-400 transition-colors"
        style={{ background: '#10b981', top: -8 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        className="w-4 h-4 bg-emerald-500 border-2 border-emerald-300 shadow-lg shadow-emerald-500/50 hover:bg-emerald-400 transition-colors"
        style={{ background: '#10b981', left: -8 }}
      />
      
      {/* Node Content */}
      <div className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 border-2 border-emerald-500/40 rounded-xl p-4 min-w-[180px] shadow-2xl backdrop-blur-lg hover:border-emerald-400/60 transition-all duration-300 hover:shadow-emerald-500/20">
        <div className="flex items-center space-x-3">
          <div className="text-2xl filter drop-shadow-lg">{data.icon}</div>
          <div className="flex-1">
            <div className="font-bold text-white text-sm tracking-wide">{data.type}</div>
            <div className="text-xs text-emerald-300 opacity-80 mt-0.5">{data.level}</div>
            {data.description && (
              <div className="text-xs text-gray-400 opacity-70 mt-1 max-w-[120px] truncate">
                {data.description}
              </div>
            )}
          </div>
        </div>
        
        {/* Status indicator */}
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-gray-900 shadow-lg animate-pulse"></div>
        
        {/* Department badge */}
        {data.departmentId && (
          <div className="absolute -bottom-1 -left-1 px-2 py-0.5 bg-purple-600/80 text-white text-xs rounded-md border border-purple-400/40">
            {data.departmentId}
          </div>
        )}
      </div>

      {/* Output Handles */}
      <Handle
        type="source"
        position={Position.Right}
        className="w-4 h-4 bg-emerald-500 border-2 border-emerald-300 shadow-lg shadow-emerald-500/50 hover:bg-emerald-400 transition-colors"
        style={{ background: '#10b981', right: -8 }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-4 h-4 bg-emerald-500 border-2 border-emerald-300 shadow-lg shadow-emerald-500/50 hover:bg-emerald-400 transition-colors"
        style={{ background: '#10b981', bottom: -8 }}
      />
    </div>
  );
};

// Node types configuration
const nodeTypes: NodeTypes = {
  agentNode: AgentNode,
};

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";
import Navigation from "@/components/navigation";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface DroppedAgent {
  id: string;
  type: string;
  icon: string;
  level: string;
  description: string;
  bgColor: string;
  borderColor: string;
  color: string;
  x: number;
  y: number;
  connections: string[];
  departmentId?: string;
}

// Mock data for analytics
const mockPerformanceData = [
  { month: 'Jan', earnings: 2400, hires: 14, hired: 8 },
  { month: 'Feb', earnings: 1398, hires: 18, hired: 12 },
  { month: 'Mar', earnings: 9800, hires: 24, hired: 18 },
  { month: 'Apr', earnings: 3908, hires: 28, hired: 22 },
  { month: 'May', earnings: 4800, hires: 35, hired: 28 },
  { month: 'Jun', earnings: 3800, hires: 42, hired: 35 }
];

const mockNomadAgents = [
  { 
    id: 1, 
    name: 'Email Classifier Pro', 
    status: 'Working', 
    earnings: 2340, 
    hires: 127, 
    rating: 4.9,
    location: 'Cloud-US-East',
    uptime: 99.8
  },
  { 
    id: 2, 
    name: 'Data Processor Elite', 
    status: 'Available', 
    earnings: 1890, 
    hires: 89, 
    rating: 4.7,
    location: 'Cloud-EU-West',
    uptime: 97.2
  },
  { 
    id: 3, 
    name: 'Security Monitor', 
    status: 'Hired', 
    earnings: 3240, 
    hires: 156, 
    rating: 4.8,
    location: 'Cloud-Asia',
    uptime: 98.9
  }
];

const mockContracts = [
  {
    id: 1,
    name: 'Agent Revenue Share v2',
    status: 'Active',
    value: '5.2 ETH',
    earnings: 12450,
    expires: '2025-12-01',
    penalties: 0
  },
  {
    id: 2,
    name: 'Data Processing License',
    status: 'Pending',
    value: '2.8 ETH',
    earnings: 4560,
    expires: '2025-08-15',
    penalties: 0
  },
  {
    id: 3,
    name: 'API Access Rights',
    status: 'Completed',
    value: '1.5 ETH',
    earnings: 8900,
    expires: '2024-10-30',
    penalties: 150
  }
];

const mockUserAgents = [
  {
    id: 1,
    name: 'Custom Email Parser',
    category: 'Data Processing',
    uploaded: '2024-12-15',
    runs: 1240,
    success: 98.4,
    revenue: 2340,
    status: 'Active'
  },
  {
    id: 2,
    name: 'Invoice Analyzer',
    category: 'Finance',
    uploaded: '2024-11-20',
    runs: 890,
    success: 96.7,
    revenue: 1890,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Document Classifier',
    category: 'Document Processing',
    uploaded: '2024-10-05',
    runs: 567,
    success: 99.1,
    revenue: 3240,
    status: 'Paused'
  }
];

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const { isConnected, address, connectWallet } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('wallet');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>("sales-domination");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [departmentCount, setDepartmentCount] = useState<{[key: string]: number}>({
    'Executive Director': 0,
    'Department Manager': 0,
    'Senior Associate': 0,
    'Associate': 0
  });

  // React Flow connection handler
  const onConnect = useCallback(
    (params: Connection) => setEdges((els) => addEdge({
      ...params,
      type: 'smoothstep',
      markerEnd: { type: MarkerType.ArrowClosed },
      style: { stroke: '#10b981', strokeWidth: 2 }
    }, els)),
    [setEdges]
  );

  // Handle dropping agents onto React Flow canvas
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const agentData = JSON.parse(e.dataTransfer.getData('text/plain'));
    const reactFlowBounds = e.currentTarget.getBoundingClientRect();
    const position = {
      x: e.clientX - reactFlowBounds.left - 90,
      y: e.clientY - reactFlowBounds.top - 40,
    };

    const newNode: Node = {
      id: `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'agentNode',
      position,
      data: {
        icon: agentData.icon,
        type: agentData.type,
        level: agentData.level,
        description: agentData.description,
        departmentId: agentData.departmentId,
        agentType: agentData.type
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    };

    setNodes((nds) => nds.concat(newNode));
    setDepartmentCount(prev => ({
      ...prev,
      [agentData.type]: prev[agentData.type] + 1
    }));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Fleet templates - 3 power horse nomad fleets
  const fleetTemplates = {
    'sales-domination': {
      name: 'Sales Domination Fleet',
      description: 'Complete enterprise sales automation and lead conversion powerhouse',
      agents: [
        { type: 'Executive Director', x: 300, y: 50, id: 'exec-1', connections: ['sales-mgr-1', 'sales-mgr-2'] },
        { type: 'Department Manager', x: 150, y: 180, id: 'sales-mgr-1', connections: ['lead-gen-1', 'closer-1'] },
        { type: 'Department Manager', x: 450, y: 180, id: 'sales-mgr-2', connections: ['nurture-1', 'analytics-1'] },
        { type: 'Senior Associate', x: 80, y: 320, id: 'lead-gen-1', connections: ['prospector-1', 'qualifier-1'] },
        { type: 'Senior Associate', x: 220, y: 320, id: 'closer-1', connections: ['negotiator-1'] },
        { type: 'Senior Associate', x: 380, y: 320, id: 'nurture-1', connections: ['follow-up-1'] },
        { type: 'Senior Associate', x: 520, y: 320, id: 'analytics-1', connections: ['reporter-1'] },
        { type: 'Associate', x: 50, y: 480, id: 'prospector-1', connections: [] },
        { type: 'Associate', x: 120, y: 480, id: 'qualifier-1', connections: [] },
        { type: 'Associate', x: 220, y: 480, id: 'negotiator-1', connections: [] },
        { type: 'Associate', x: 380, y: 480, id: 'follow-up-1', connections: [] },
        { type: 'Associate', x: 520, y: 480, id: 'reporter-1', connections: [] }
      ]
    },
    'customer-success': {
      name: 'Customer Success Fleet',
      description: 'Advanced customer retention and growth optimization network',
      agents: [
        { type: 'Executive Director', x: 300, y: 50, id: 'exec-2', connections: ['success-mgr-1', 'success-mgr-2', 'success-mgr-3'] },
        { type: 'Department Manager', x: 120, y: 200, id: 'success-mgr-1', connections: ['onboard-1', 'support-1'] },
        { type: 'Department Manager', x: 300, y: 200, id: 'success-mgr-2', connections: ['health-1', 'expansion-1'] },
        { type: 'Department Manager', x: 480, y: 200, id: 'success-mgr-3', connections: ['advocacy-1', 'renewal-1'] },
        { type: 'Senior Associate', x: 80, y: 350, id: 'onboard-1', connections: ['trainer-1'] },
        { type: 'Senior Associate', x: 160, y: 350, id: 'support-1', connections: ['resolver-1'] },
        { type: 'Senior Associate', x: 260, y: 350, id: 'health-1', connections: ['monitor-1'] },
        { type: 'Senior Associate', x: 340, y: 350, id: 'expansion-1', connections: ['upsell-1'] },
        { type: 'Senior Associate', x: 440, y: 350, id: 'advocacy-1', connections: ['referral-1'] },
        { type: 'Senior Associate', x: 520, y: 350, id: 'renewal-1', connections: ['retention-1'] },
        { type: 'Associate', x: 80, y: 500, id: 'trainer-1', connections: [] },
        { type: 'Associate', x: 160, y: 500, id: 'resolver-1', connections: [] },
        { type: 'Associate', x: 260, y: 500, id: 'monitor-1', connections: [] },
        { type: 'Associate', x: 340, y: 500, id: 'upsell-1', connections: [] },
        { type: 'Associate', x: 440, y: 500, id: 'referral-1', connections: [] },
        { type: 'Associate', x: 520, y: 500, id: 'retention-1', connections: [] }
      ]
    },
    'product-innovation': {
      name: 'Product Innovation Fleet',
      description: 'AI-driven product development and market analysis ecosystem',
      agents: [
        { type: 'Executive Director', x: 350, y: 50, id: 'exec-3', connections: ['research-mgr-1', 'dev-mgr-1'] },
        { type: 'Department Manager', x: 200, y: 180, id: 'research-mgr-1', connections: ['market-1', 'user-1', 'trend-1'] },
        { type: 'Department Manager', x: 500, y: 180, id: 'dev-mgr-1', connections: ['proto-1', 'test-1', 'launch-1'] },
        { type: 'Senior Associate', x: 100, y: 320, id: 'market-1', connections: ['competitor-1'] },
        { type: 'Senior Associate', x: 200, y: 320, id: 'user-1', connections: ['feedback-1'] },
        { type: 'Senior Associate', x: 300, y: 320, id: 'trend-1', connections: ['predictor-1'] },
        { type: 'Senior Associate', x: 420, y: 320, id: 'proto-1', connections: ['builder-1'] },
        { type: 'Senior Associate', x: 500, y: 320, id: 'test-1', connections: ['validator-1'] },
        { type: 'Senior Associate', x: 580, y: 320, id: 'launch-1', connections: ['marketer-1'] },
        { type: 'Associate', x: 100, y: 480, id: 'competitor-1', connections: [] },
        { type: 'Associate', x: 200, y: 480, id: 'feedback-1', connections: [] },
        { type: 'Associate', x: 300, y: 480, id: 'predictor-1', connections: [] },
        { type: 'Associate', x: 420, y: 480, id: 'builder-1', connections: [] },
        { type: 'Associate', x: 500, y: 480, id: 'validator-1', connections: [] },
        { type: 'Associate', x: 580, y: 480, id: 'marketer-1', connections: [] }
      ]
    }
  };

  // Load fleet template
  const loadTemplate = (templateKey: string) => {
    const template = fleetTemplates[templateKey as keyof typeof fleetTemplates];
    if (!template) return;

    const agentTypes = {
      'Executive Director': { 
        icon: '👨‍💼', 
        level: 'C-Level', 
        description: 'Strategic oversight & governance',
        bgColor: 'bg-gradient-to-br from-purple-500/20 to-purple-600/20',
        borderColor: 'border-purple-400/40',
        color: 'from-purple-400 to-purple-300'
      },
      'Department Manager': { 
        icon: '👩‍💼', 
        level: 'Management', 
        description: 'Cross-functional coordination',
        bgColor: 'bg-gradient-to-br from-cyan-500/20 to-cyan-600/20',
        borderColor: 'border-cyan-400/40',
        color: 'from-cyan-400 to-cyan-300'
      },
      'Senior Associate': { 
        icon: '👨‍🔬', 
        level: 'Senior', 
        description: 'Complex task execution',
        bgColor: 'bg-gradient-to-br from-amber-500/20 to-amber-600/20',
        borderColor: 'border-amber-400/40',
        color: 'from-amber-400 to-amber-300'
      },
      'Associate': { 
        icon: '👩‍💻', 
        level: 'Operations', 
        description: 'Operational task processing',
        bgColor: 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/20',
        borderColor: 'border-emerald-400/40',
        color: 'from-emerald-400 to-emerald-300'
      }
    };

    // Create nodes from template
    const newNodes: Node[] = template.agents.map((agent, index) => {
      const agentType = agentTypes[agent.type as keyof typeof agentTypes];
      const nodeId = agent.id || `agent-${Date.now()}-${index}`;
      
      return {
        id: nodeId,
        type: 'agentNode',
        position: { x: agent.x, y: agent.y },
        data: {
          icon: agentType?.icon || '👤',
          type: agent.type,
          level: agentType?.level || 'Staff',
          description: agentType?.description || 'Team member',
          departmentId: `Dept-${index + 1}`,
          agentType: agent.type
        },
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      };
    });

    // Create edges from connections
    const newEdges: Edge[] = [];
    template.agents.forEach((agent) => {
      if (agent.connections) {
        agent.connections.forEach((targetId) => {
          newEdges.push({
            id: `${agent.id || agent.type}-${targetId}`,
            source: agent.id || `agent-${template.agents.findIndex(a => a.type === agent.type)}`,
            target: targetId,
            type: 'smoothstep',
            markerEnd: { type: MarkerType.ArrowClosed },
            style: { stroke: '#10b981', strokeWidth: 2 }
          });
        });
      }
    });

    setNodes(newNodes);
    setEdges(newEdges);
    
    // Update department counts
    const newCounts = { 'Executive Director': 0, 'Department Manager': 0, 'Senior Associate': 0, 'Associate': 0 };
    template.agents.forEach(agent => {
      newCounts[agent.type as keyof typeof newCounts] = (newCounts[agent.type as keyof typeof newCounts] || 0) + 1;
    });
    setDepartmentCount(newCounts);
    setSelectedTemplate(templateKey);
  };

  // Fetch user's purchased agents
  const { data: userPurchases } = useQuery({
    queryKey: ["/api/user/purchases"],
    enabled: !!user
  });

  // Auto-load Sales Domination Fleet template when fleet tab is accessed
  useEffect(() => {
    if (activeTab === 'fleet' && selectedTemplate === "sales-domination" && nodes.length === 0) {
      loadTemplate('sales-domination');
    }
  }, [activeTab, selectedTemplate, nodes.length]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-emerald-400 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Bot className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">Please log in to access your dashboard</p>
          <Button asChild className="mt-4 bg-emerald-600 hover:bg-emerald-700">
            <a href="/signin">Sign In</a>
          </Button>
        </div>
      </div>
    );
  }

  const totalEarnings = mockPerformanceData.reduce((sum, month) => sum + month.earnings, 0);
  const totalHires = mockPerformanceData.reduce((sum, month) => sum + month.hires, 0);
  const totalHired = mockPerformanceData.reduce((sum, month) => sum + month.hired, 0);

  return (
    <div className="min-h-screen bg-black text-white" style={{
      backgroundImage: `linear-gradient(135deg, #000000 0%, #0a0a0a 25%, #050505 50%, #0f0f0f 75%, #000000 100%)`,
      backgroundAttachment: 'fixed'
    }}>
      {/* Top Navigation - Full Width */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-transparent backdrop-blur-sm border-b border-gray-800/30">
        <div className="flex items-center justify-between px-4 lg:px-8 py-4">
          {/* Left - Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AN</span>
            </div>
            <span className="text-xl lg:text-2xl font-bold text-white tracking-tight">AI Nomads</span>
          </div>

          {/* Center - Navigation Tabs (Hidden on mobile) */}
          <nav className="hidden lg:flex items-center space-x-1">
            <button 
              onClick={() => window.location.href = '/marketplace'} 
              className="px-4 py-2 text-gray-300 hover:text-emerald-400 font-medium transition-colors"
            >
              Marketplace
            </button>
            <button 
              onClick={() => window.location.href = '/nomad-fleets'} 
              className="px-4 py-2 text-gray-300 hover:text-emerald-400 font-medium transition-colors"
            >
              Nomad Fleets
            </button>
            <button 
              onClick={() => window.location.href = '/nomad-lands'} 
              className="px-4 py-2 text-gray-300 hover:text-emerald-400 font-medium transition-colors"
            >
              Nomad Lands
            </button>
            <button 
              onClick={() => window.location.href = '/smart-contracts'} 
              className="px-4 py-2 text-gray-300 hover:text-emerald-400 font-medium transition-colors"
            >
              Smart Contracts
            </button>
            <button 
              onClick={() => window.location.href = '/api-docs'} 
              className="px-4 py-2 text-gray-300 hover:text-emerald-400 font-medium transition-colors"
            >
              API
            </button>
          </nav>

          {/* Right - Mobile Menu Button & User Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-emerald-400 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="w-10 h-10 border border-gray-700/50 cursor-pointer hover:border-emerald-500/60 transition-colors">
                  <AvatarImage src={user.profileImageUrl || ''} />
                  <AvatarFallback className="bg-transparent text-gray-400 border-0">
                    {user.firstName?.[0] || 'U'}{user.lastName?.[0] || 'S'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 bg-black/95 border border-gray-700/50 backdrop-blur-sm" align="end">
                <DropdownMenuLabel className="text-gray-300">
                  {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.username}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-700/50" />
                <DropdownMenuItem 
                  className="text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer"
                  onClick={() => setActiveTab('wallet')}
                >
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 cursor-pointer"
                  onClick={() => setActiveTab('agents')}
                >
                  My Agents
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-gray-700/50" />
                <DropdownMenuItem 
                  className="text-red-400 hover:bg-red-500/10 hover:text-red-300 cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex pt-16 relative">
        {/* Mobile Sidebar Overlay */}
        {isMobileSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Left Sidebar */}
        <div className={`
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 fixed lg:relative z-50 lg:z-auto
          w-80 min-h-screen bg-black/95 lg:bg-transparent backdrop-blur-sm
          transition-transform duration-300 ease-in-out
          border-r border-gray-700/30 lg:border-r-0
        `}>
          <div className="p-4 lg:p-6">
            {/* Mobile Navigation Links */}
            <div className="lg:hidden mb-6 border-b border-gray-700/30 pb-4">
              <button 
                onClick={() => { window.location.href = '/marketplace'; setIsMobileSidebarOpen(false); }} 
                className="w-full px-4 py-3 text-left text-gray-300 hover:text-emerald-400 font-medium transition-colors border-b border-gray-700/20"
              >
                Marketplace
              </button>
              <button 
                onClick={() => { window.location.href = '/nomad-lands'; setIsMobileSidebarOpen(false); }} 
                className="w-full px-4 py-3 text-left text-gray-300 hover:text-emerald-400 font-medium transition-colors border-b border-gray-700/20"
              >
                Nomad Lands
              </button>
              <button 
                onClick={() => { window.location.href = '/smart-contracts'; setIsMobileSidebarOpen(false); }} 
                className="w-full px-4 py-3 text-left text-gray-300 hover:text-emerald-400 font-medium transition-colors border-b border-gray-700/20"
              >
                Smart Contracts
              </button>
              <button 
                onClick={() => { window.location.href = '/api-docs'; setIsMobileSidebarOpen(false); }} 
                className="w-full px-4 py-3 text-left text-gray-300 hover:text-emerald-400 font-medium transition-colors"
              >
                API Docs
              </button>
            </div>
            {/* Navigation Tabs */}
            <nav className="space-y-2 mt-4">
              <button
                onClick={() => { setActiveTab('wallet'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all font-semibold ${
                  activeTab === 'wallet' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-lg shadow-emerald-500/20' 
                    : 'text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 border border-transparent'
                }`}
              >
                <Wallet className="w-5 h-5" />
                <span className="font-medium">Wallet Details</span>
              </button>

              <button
                onClick={() => { setActiveTab('nomad'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all font-semibold ${
                  activeTab === 'nomad' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-lg shadow-emerald-500/20' 
                    : 'text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 border border-transparent'
                }`}
              >
                <MapPin className="w-5 h-5" />
                <span className="font-medium">Nomad Lands</span>
              </button>

              <button
                onClick={() => { setActiveTab('contracts'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all font-semibold ${
                  activeTab === 'contracts' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-lg shadow-emerald-500/20' 
                    : 'text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 border border-transparent'
                }`}
              >
                <FileText className="w-5 h-5" />
                <span className="font-medium">My Contracts</span>
              </button>

              <button
                onClick={() => { setActiveTab('agents'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all font-semibold ${
                  activeTab === 'agents' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-lg shadow-emerald-500/20' 
                    : 'text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 border border-transparent'
                }`}
              >
                <Bot className="w-5 h-5" />
                <span className="font-medium">My AI Agents</span>
              </button>

              <button
                onClick={() => { setActiveTab('performance'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all font-semibold ${
                  activeTab === 'performance' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-lg shadow-emerald-500/20' 
                    : 'text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 border border-transparent'
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span className="font-medium">Performance</span>
              </button>

              <button
                onClick={() => { setActiveTab('fleet'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all font-semibold ${
                  activeTab === 'fleet' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-lg shadow-emerald-500/20' 
                    : 'text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 border border-transparent'
                }`}
              >
                <Target className="w-5 h-5" />
                <div className="flex items-center space-x-2">
                  <span className="font-medium">My Fleet</span>
                  <Badge className="bg-emerald-500/20 text-emerald-300 text-xs px-2 py-0.5 border border-emerald-400/40">
                    BETA
                  </Badge>
                </div>
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-4 lg:p-8 bg-gradient-to-br from-gray-950/30 via-black/20 to-gray-900/40 lg:ml-0">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 lg:mb-8 space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl lg:text-4xl font-bold text-white mb-2 tracking-tight">Dashboard</h1>
              <p className="text-gray-300 font-medium text-sm lg:text-base">Manage your AI agents, contracts, and files in the Nomad Lands ecosystem</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <Button variant="outline" className="border-gray-600/50 text-gray-300 hover:bg-gray-800/60 hover:border-gray-500 font-semibold text-sm lg:text-base">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-lg shadow-emerald-500/20 font-semibold border-0 text-sm lg:text-base">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'wallet' && (
            <div className="space-y-4 lg:space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                {/* Account Information */}
                <Card className="bg-gradient-to-br from-gray-950/80 via-black/60 to-gray-900/80 border-gray-700/30 backdrop-blur-lg shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center font-bold text-lg tracking-tight">
                      <User className="w-5 h-5 mr-2 text-emerald-400" />
                      Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-gray-300 text-sm font-semibold">Wallet Address</Label>
                        <p className="text-white font-mono text-sm break-all bg-gray-800/50 p-2 rounded mt-1">
                          {address || 'Not connected'}
                        </p>
                      </div>
                      <div>
                        <Label className="text-gray-300 text-sm font-semibold">Total Agents Owned</Label>
                        <p className="text-emerald-400 text-2xl font-bold tracking-tight">{Array.isArray(userPurchases) ? userPurchases.length : 0}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Wallet Connection */}
                <Card className="bg-gradient-to-br from-gray-950/80 via-black/60 to-gray-900/80 border-gray-700/30 backdrop-blur-lg shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center font-bold text-lg tracking-tight">
                      <Wallet className="w-5 h-5 mr-2 text-emerald-400" />
                      Wallet Connection
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isConnected ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 font-semibold">Status</span>
                          <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 font-semibold">Connected</Badge>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300 font-semibold">Network</span>
                          <span className="text-white font-medium">Ethereum Mainnet</span>
                        </div>
                        <div className="text-center pt-4">
                          <p className="text-emerald-400 font-mono text-sm bg-gray-800/50 px-3 py-2 rounded-lg">
                            {address?.slice(0, 6)}...{address?.slice(-4)}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Wallet className="w-12 h-12 text-emerald-400/30 mx-auto mb-4" />
                        <p className="text-gray-300 mb-4 font-medium">Connect your wallet to access full features</p>
                        <Button
                          onClick={connectWallet}
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          Connect Wallet
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'nomad' && (
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">Active Agents</p>
                        <p className="text-2xl font-bold text-white">{mockNomadAgents.filter(a => a.status === 'Working').length}</p>
                      </div>
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                        <Bot className="w-5 h-5 text-emerald-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">Total Hires</p>
                        <p className="text-2xl font-bold text-white">{mockNomadAgents.reduce((sum, agent) => sum + agent.hires, 0)}</p>
                      </div>
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                        <Users className="w-5 h-5 text-emerald-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">Total Earnings</p>
                        <p className="text-2xl font-bold text-white">${mockNomadAgents.reduce((sum, agent) => sum + agent.earnings, 0).toLocaleString()}</p>
                      </div>
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-emerald-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">Avg Rating</p>
                        <p className="text-2xl font-bold text-white">{(mockNomadAgents.reduce((sum, agent) => sum + agent.rating, 0) / mockNomadAgents.length).toFixed(1)}</p>
                      </div>
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-emerald-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Nomad Agents List */}
              <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Nomad Lands Agents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockNomadAgents.map((agent) => (
                      <div key={agent.id} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                              <Cpu className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                              <h4 className="text-white font-semibold">{agent.name}</h4>
                              <p className="text-gray-400 text-sm">{agent.location}</p>
                            </div>
                          </div>
                          <Badge 
                            className={
                              agent.status === 'Working' 
                                ? "bg-emerald-600 text-white"
                                : agent.status === 'Hired'
                                ? "bg-blue-600 text-white"
                                : "bg-gray-600 text-white"
                            }
                          >
                            {agent.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Earnings:</span>
                            <p className="text-emerald-400 font-semibold">${agent.earnings.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Hires:</span>
                            <p className="text-white">{agent.hires}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Rating:</span>
                            <p className="text-white">{agent.rating}/5.0</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Uptime:</span>
                            <p className="text-emerald-400">{agent.uptime}%</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'contracts' && (
            <div className="space-y-6">
              {/* Contract Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">Active Contracts</p>
                        <p className="text-2xl font-bold text-white">{mockContracts.filter(c => c.status === 'Active').length}</p>
                      </div>
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-emerald-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">Total Revenue</p>
                        <p className="text-2xl font-bold text-white">${mockContracts.reduce((sum, contract) => sum + contract.earnings, 0).toLocaleString()}</p>
                      </div>
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-emerald-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">Total Value</p>
                        <p className="text-2xl font-bold text-white">9.5 ETH</p>
                      </div>
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                        <Coins className="w-5 h-5 text-emerald-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">Penalties</p>
                        <p className="text-2xl font-bold text-white">${mockContracts.reduce((sum, contract) => sum + contract.penalties, 0)}</p>
                      </div>
                      <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Contracts List */}
              <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Smart Contracts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockContracts.map((contract) => (
                      <div key={contract.id} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                              <FileText className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                              <h4 className="text-white font-semibold">{contract.name}</h4>
                              <p className="text-gray-400 text-sm">Expires: {contract.expires}</p>
                            </div>
                          </div>
                          <Badge 
                            className={
                              contract.status === 'Active' 
                                ? "bg-emerald-600 text-white"
                                : contract.status === 'Pending'
                                ? "bg-yellow-600 text-white"
                                : "bg-gray-600 text-white"
                            }
                          >
                            {contract.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Value:</span>
                            <p className="text-emerald-400 font-semibold">{contract.value}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Earnings:</span>
                            <p className="text-white">${contract.earnings.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Penalties:</span>
                            <p className={contract.penalties > 0 ? "text-red-400" : "text-emerald-400"}>${contract.penalties}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Status:</span>
                            <p className="text-white">{contract.status}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'agents' && (
            <div className="space-y-6">
              {/* Agent Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">Uploaded Agents</p>
                        <p className="text-2xl font-bold text-white">{mockUserAgents.length}</p>
                      </div>
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                        <Bot className="w-5 h-5 text-emerald-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">Total Runs</p>
                        <p className="text-2xl font-bold text-white">{mockUserAgents.reduce((sum, agent) => sum + agent.runs, 0).toLocaleString()}</p>
                      </div>
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5 text-emerald-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">Success Rate</p>
                        <p className="text-2xl font-bold text-white">{(mockUserAgents.reduce((sum, agent) => sum + agent.success, 0) / mockUserAgents.length).toFixed(1)}%</p>
                      </div>
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-emerald-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">Total Revenue</p>
                        <p className="text-2xl font-bold text-white">${mockUserAgents.reduce((sum, agent) => sum + agent.revenue, 0).toLocaleString()}</p>
                      </div>
                      <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-emerald-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* User Agents List */}
              <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white">My AI Agents</CardTitle>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New Agent
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockUserAgents.map((agent) => (
                      <div key={agent.id} className="p-4 bg-gray-800/30 rounded-lg border border-gray-700/50">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                              <Bot className="w-5 h-5 text-emerald-500" />
                            </div>
                            <div>
                              <h4 className="text-white font-semibold">{agent.name}</h4>
                              <p className="text-gray-400 text-sm">{agent.category} • Uploaded {agent.uploaded}</p>
                            </div>
                          </div>
                          <Badge 
                            className={
                              agent.status === 'Active' 
                                ? "bg-emerald-600 text-white"
                                : "bg-gray-600 text-white"
                            }
                          >
                            {agent.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-400">Runs:</span>
                            <p className="text-white">{agent.runs.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Success Rate:</span>
                            <p className="text-emerald-400">{agent.success}%</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Revenue:</span>
                            <p className="text-emerald-400">${agent.revenue.toLocaleString()}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Actions:</span>
                            <div className="flex space-x-2">
                              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800 h-7 px-2">
                                <Eye className="w-3 h-3" />
                              </Button>
                              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800 h-7 px-2">
                                <Settings className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="space-y-6">
              {/* Performance KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">Total Earnings</p>
                        <p className="text-3xl font-bold text-white">${totalEarnings.toLocaleString()}</p>
                        <div className="flex items-center mt-2">
                          <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                          <span className="text-emerald-500 text-sm ml-1">+18.2%</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-6 h-6 text-emerald-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">Times Hired</p>
                        <p className="text-3xl font-bold text-white">{totalHired}</p>
                        <div className="flex items-center mt-2">
                          <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                          <span className="text-emerald-500 text-sm ml-1">+12.5%</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                        <Users className="w-6 h-6 text-emerald-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">Times Hiring</p>
                        <p className="text-3xl font-bold text-white">{totalHires}</p>
                        <div className="flex items-center mt-2">
                          <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                          <span className="text-emerald-500 text-sm ml-1">+24.1%</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                        <Network className="w-6 h-6 text-emerald-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Performance Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Earnings Over Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={mockPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="earnings" 
                          stroke="#10b981" 
                          fill="url(#earningsGradient)" 
                        />
                        <defs>
                          <linearGradient id="earningsGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Hiring Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={mockPerformanceData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="month" stroke="#9ca3af" />
                        <YAxis stroke="#9ca3af" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }} 
                        />
                        <Bar dataKey="hires" fill="#10b981" name="Hires" />
                        <Bar dataKey="hired" fill="#3b82f6" name="Hired" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Additional Performance Metrics */}
              <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Nomad Landscape Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Shield className="w-8 h-8 text-emerald-500" />
                      </div>
                      <p className="text-2xl font-bold text-white">99.2%</p>
                      <p className="text-gray-400 text-sm">Uptime</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Timer className="w-8 h-8 text-emerald-500" />
                      </div>
                      <p className="text-2xl font-bold text-white">2.3s</p>
                      <p className="text-gray-400 text-sm">Avg Response</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Trophy className="w-8 h-8 text-emerald-500" />
                      </div>
                      <p className="text-2xl font-bold text-white">4.8</p>
                      <p className="text-gray-400 text-sm">Avg Rating</p>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Building2 className="w-8 h-8 text-emerald-500" />
                      </div>
                      <p className="text-2xl font-bold text-white">12</p>
                      <p className="text-gray-400 text-sm">Active Regions</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Fleet Management Tab */}
          {activeTab === 'fleet' && (
            <div className="space-y-4 lg:space-y-8">
              {/* Fleet Header */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                <div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">Enterprise Fleet Orchestration</h2>
                  <p className="text-gray-300 mt-2 text-sm lg:text-base">Design departmental hierarchies and manage agent deployment strategies</p>
                </div>
                <div className="flex items-center space-x-2 lg:space-x-4">
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs lg:text-sm px-3 lg:px-4 py-2"
                    onClick={() => { setNodes([]); setEdges([]); }}
                  >
                    <Trash2 className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                    Clear
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 text-xs lg:text-sm px-3 lg:px-4 py-2">
                    <Save className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                    Save
                  </Button>
                </div>
              </div>

              {/* Fleet Templates */}
              <Card className="bg-gradient-to-br from-gray-950/80 via-black/60 to-gray-900/80 border-gray-700/30 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-white font-bold text-lg lg:text-xl">Nomad Fleet Powerhouses</CardTitle>
                  <p className="text-gray-400 text-xs lg:text-sm">Deploy proven enterprise organizational templates</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
                    {Object.entries(fleetTemplates).map(([key, template]) => (
                      <div
                        key={key}
                        className={`p-4 lg:p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          selectedTemplate === key
                            ? 'bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 border-emerald-400/60'
                            : 'bg-gradient-to-br from-gray-800/40 to-gray-900/40 border-gray-600/40 hover:border-gray-500/60'
                        }`}
                        onClick={() => loadTemplate(key)}
                      >
                        <div className="text-center mb-3 lg:mb-4">
                          <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-2 lg:mb-3 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center">
                            <Network className="w-6 h-6 lg:w-8 lg:h-8 text-blue-400" />
                          </div>
                          <h3 className="text-white font-bold text-base lg:text-lg">{template.name}</h3>
                          <p className="text-gray-400 text-xs lg:text-sm mt-1 lg:mt-2">{template.description}</p>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Agents:</span>
                            <span className="text-white font-semibold">{template.agents.length}</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Connections:</span>
                            <span className="text-white font-semibold">
                              {template.agents.reduce((total, agent) => total + agent.connections.length, 0)}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Complexity:</span>
                            <span className="text-emerald-400 font-semibold">
                              {template.agents.length > 6 ? 'High' : template.agents.length > 4 ? 'Medium' : 'Low'}
                            </span>
                          </div>
                        </div>
                        
                        {selectedTemplate === key && (
                          <div className="mt-4 pt-3 border-t border-emerald-400/30">
                            <p className="text-emerald-400 text-xs font-medium text-center">✓ Active Template</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Agent Deployment Palette */}
              <Card className="bg-gradient-to-br from-gray-950/80 via-black/60 to-gray-900/80 border-gray-700/30 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-white font-bold text-lg lg:text-xl">Organizational Hierarchy</CardTitle>
                  <p className="text-gray-400 text-xs lg:text-sm">Deploy agents by department and configure reporting structures</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
                    {[
                      { 
                        type: 'Executive Director', 
                        icon: '👨‍💼', 
                        color: 'from-indigo-400/80 via-purple-400/80 to-pink-400/80',
                        bgColor: 'bg-indigo-500/10',
                        borderColor: 'border-indigo-400/30',
                        description: 'Strategic oversight & governance',
                        level: 'C-Level'
                      },
                      { 
                        type: 'Department Manager', 
                        icon: '👩‍💼', 
                        color: 'from-cyan-400/80 via-blue-400/80 to-indigo-400/80',
                        bgColor: 'bg-blue-500/10',
                        borderColor: 'border-blue-400/30',
                        description: 'Cross-functional coordination',
                        level: 'Management'
                      },
                      { 
                        type: 'Senior Associate', 
                        icon: '👨‍🔬', 
                        color: 'from-emerald-400/80 via-teal-400/80 to-cyan-400/80',
                        bgColor: 'bg-emerald-500/10',
                        borderColor: 'border-emerald-400/30',
                        description: 'Complex task execution',
                        level: 'Senior'
                      },
                      { 
                        type: 'Associate', 
                        icon: '👩‍💻', 
                        color: 'from-amber-400/80 via-orange-400/80 to-red-400/80',
                        bgColor: 'bg-amber-500/10',
                        borderColor: 'border-amber-400/30',
                        description: 'Operational task processing',
                        level: 'Associate'
                      },
                    ].map((agent, index) => (
                      <div
                        key={index}
                        className={`p-3 lg:p-4 rounded-xl ${agent.bgColor} ${agent.borderColor} border-2 cursor-move hover:scale-105 hover:shadow-lg transition-all duration-300 backdrop-blur-sm touch-manipulation`}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('text/plain', JSON.stringify(agent));
                        }}
                      >
                        <div className="text-2xl lg:text-3xl mb-1 lg:mb-2 text-center">{agent.icon}</div>
                        <h3 className="text-white font-bold text-xs lg:text-sm text-center leading-tight">{agent.type}</h3>
                        <div className={`text-xs text-center mt-1 px-1 lg:px-2 py-0.5 lg:py-1 rounded-full bg-gradient-to-r ${agent.color} text-black font-medium`}>
                          {agent.level}
                        </div>
                        <p className="text-gray-300 text-xs text-center mt-1 lg:mt-2 leading-tight">{agent.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* React Flow Fleet Canvas */}
              <Card className="bg-gradient-to-br from-gray-950/80 via-black/60 to-gray-900/80 border-gray-700/30 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-white font-bold text-lg lg:text-xl">Enterprise Network Canvas</CardTitle>
                  <p className="text-gray-400 text-xs lg:text-sm">Professional flow-based agent network builder with advanced connections</p>
                </CardHeader>
                <CardContent>
                  <div 
                    className="h-[400px] lg:h-[700px] bg-gray-900/30 rounded-xl border border-gray-600/40"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <ReactFlow
                      nodes={nodes}
                      edges={edges}
                      onNodesChange={onNodesChange}
                      onEdgesChange={onEdgesChange}
                      onConnect={onConnect}
                      nodeTypes={nodeTypes}
                      fitView
                      attributionPosition="bottom-left"
                      className="rounded-xl"
                      style={{ backgroundColor: 'transparent' }}
                    >
                      <Controls 
                        className="bg-gray-800/80 border border-gray-600/40 rounded-lg scale-75 lg:scale-100"
                        style={{ color: 'white' }}
                      />
                      <MiniMap 
                        className="bg-gray-800/80 border border-gray-600/40 rounded-lg scale-75 lg:scale-100"
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

                  {/* Fleet Instructions */}
                  <div className="mt-3 lg:mt-4 bg-gray-800/40 rounded-lg p-3 lg:p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 lg:gap-4 text-xs lg:text-sm text-gray-300">
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 lg:w-3 lg:h-3 bg-emerald-500 rounded-full"></span>
                        <span>Drag roles from palette above</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 lg:w-3 lg:h-3 bg-blue-500 rounded-full"></span>
                        <span>Connect nodes by dragging handles</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 lg:w-3 lg:h-3 bg-purple-500 rounded-full"></span>
                        <span>Use templates for quick setup</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="w-2 h-2 lg:w-3 lg:h-3 bg-amber-500 rounded-full"></span>
                        <span>Zoom and pan to navigate</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fleet Configuration */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                <Card className="bg-gradient-to-br from-gray-950/80 via-black/60 to-gray-900/80 border-gray-700/30 backdrop-blur-lg">
                  <CardHeader>
                    <CardTitle className="text-white font-bold text-lg lg:text-xl">Organizational Structure</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 lg:space-y-4">
                    <div>
                      <label className="text-gray-300 text-xs lg:text-sm font-medium">Department Name</label>
                      <input 
                        type="text" 
                        className="w-full mt-1 bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm lg:text-base focus:border-emerald-400 transition-colors"
                        placeholder="Data Operations Department"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 text-xs lg:text-sm font-medium">Mission Statement</label>
                      <textarea 
                        className="w-full mt-1 bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm lg:text-base h-16 lg:h-20 focus:border-emerald-400 transition-colors resize-none"
                        placeholder="Automated enterprise data processing, analysis, and strategic decision support"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 text-xs lg:text-sm font-medium">Workflow Pattern</label>
                      <select className="w-full mt-1 bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm lg:text-base focus:border-emerald-400 transition-colors">
                        <option>Hierarchical Command Structure</option>
                        <option>Collaborative Network</option>
                        <option>Event-Driven Response</option>
                        <option>Matrix Organization</option>
                      </select>
                    </div>
                    
                    {/* Department Headcount */}
                    <div className="pt-4 border-t border-gray-700">
                      <h4 className="text-gray-300 text-sm font-medium mb-3">Current Headcount</h4>
                      <div className="space-y-2">
                        {Object.entries(departmentCount).map(([role, count]) => (
                          <div key={role} className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">{role}</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-semibold">{count}</span>
                              <div className={`w-3 h-3 rounded-full ${
                                count > 0 ? 'bg-emerald-400' : 'bg-gray-600'
                              }`} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-950/80 via-black/60 to-gray-900/80 border-gray-700/30 backdrop-blur-lg">
                  <CardHeader>
                    <CardTitle className="text-white font-bold text-lg lg:text-xl">Network Analytics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 lg:space-y-4">
                    <div className="grid grid-cols-2 gap-2 lg:gap-4">
                      <div className="bg-gradient-to-br from-emerald-500/10 to-emerald-600/10 border border-emerald-500/30 p-3 lg:p-4 rounded-lg">
                        <p className="text-emerald-400 text-xs lg:text-sm font-medium">Deployed Agents</p>
                        <p className="text-xl lg:text-2xl font-bold text-white">{nodes.length}</p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 p-3 lg:p-4 rounded-lg">
                        <p className="text-blue-400 text-xs lg:text-sm font-medium">Network Links</p>
                        <p className="text-xl lg:text-2xl font-bold text-white">{edges.length}</p>
                      </div>
                      <div className="bg-gradient-to-br from-amber-500/10 to-amber-600/10 border border-amber-500/30 p-3 lg:p-4 rounded-lg">
                        <p className="text-amber-400 text-xs lg:text-sm font-medium">Cost/Hour</p>
                        <p className="text-xl lg:text-2xl font-bold text-white">
                          ${(nodes.length * 0.48 + edges.length * 0.12).toFixed(2)}
                        </p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 p-3 lg:p-4 rounded-lg">
                        <p className="text-purple-400 text-xs lg:text-sm font-medium">Net Density</p>
                        <p className="text-xl lg:text-2xl font-bold text-white">
                          {nodes.length > 0 ? (edges.length / nodes.length).toFixed(1) : '0'}
                        </p>
                      </div>
                    </div>

                    {/* Organizational Health Metrics */}
                    <div className="pt-3 lg:pt-4 border-t border-gray-700">
                      <h4 className="text-gray-300 text-xs lg:text-sm font-medium mb-2 lg:mb-3">Organizational Health</h4>
                      <div className="space-y-2 lg:space-y-3">
                        <div>
                          <div className="flex justify-between text-xs lg:text-sm mb-1">
                            <span className="text-gray-400">Leadership Coverage</span>
                            <span className="text-white">
                              {departmentCount['Executive Director'] > 0 ? '100%' : '0%'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1.5 lg:h-2">
                            <div 
                              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-1.5 lg:h-2 rounded-full transition-all duration-500"
                              style={{ width: departmentCount['Executive Director'] > 0 ? '100%' : '0%' }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs lg:text-sm mb-1">
                            <span className="text-gray-400">Management Span</span>
                            <span className="text-white">
                              {departmentCount['Department Manager'] > 0 ? 'Optimal' : 'Needs Management'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1.5 lg:h-2">
                            <div 
                              className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 lg:h-2 rounded-full transition-all duration-500"
                              style={{ width: departmentCount['Department Manager'] > 0 ? '100%' : '20%' }}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-xs lg:text-sm mb-1">
                            <span className="text-gray-400">Operational Capacity</span>
                            <span className="text-white">
                              {Object.values(departmentCount).reduce((a, b) => a + b, 0) > 3 ? 'High' : 'Building'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1.5 lg:h-2">
                            <div 
                              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1.5 lg:h-2 rounded-full transition-all duration-500"
                              style={{ 
                                width: `${Math.min(100, (Object.values(departmentCount).reduce((a, b) => a + b, 0) / 5) * 100)}%` 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}