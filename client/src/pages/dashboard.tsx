import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/use-wallet";
import { useToast } from "@/hooks/use-toast";
import * as d3 from "d3";
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
  Menu,
  Globe
} from "lucide-react";

// Mock agent data for ecosystem visualization
const mockAgents = [
  { name: "Data Analyst AI", runs: 15420, success: 94.2, revenue: 23400, status: "Active", type: "Analytics" },
  { name: "Email Classifier", runs: 8650, success: 97.8, revenue: 12800, status: "Active", type: "NLP" },
  { name: "Cloud Monitor", runs: 22100, success: 89.5, revenue: 18900, status: "Active", type: "Infrastructure" },
  { name: "Sales Assistant", runs: 7230, success: 92.1, revenue: 31200, status: "Paused", type: "Sales" },
  { name: "Code Reviewer", runs: 11850, success: 88.7, revenue: 15600, status: "Active", type: "Development" },
  { name: "Report Generator", runs: 6420, success: 96.3, revenue: 9800, status: "Active", type: "Automation" },
  { name: "Customer Support", runs: 18750, success: 91.4, revenue: 28500, status: "Active", type: "Support" },
  { name: "Inventory Tracker", runs: 13200, success: 85.9, revenue: 16700, status: "Maintenance", type: "Operations" },
  { name: "Security Scanner", runs: 9840, success: 98.1, revenue: 22100, status: "Active", type: "Security" },
  { name: "Content Creator", runs: 4560, success: 87.3, revenue: 14300, status: "Active", type: "Creative" },
  { name: "Financial Analyzer", runs: 16890, success: 93.8, revenue: 34500, status: "Active", type: "Finance" },
  { name: "HR Assistant", runs: 5670, success: 90.2, revenue: 11900, status: "Paused", type: "HR" },
  { name: "Project Manager", runs: 12340, success: 89.6, revenue: 25800, status: "Active", type: "Management" },
  { name: "Quality Assurance", runs: 8920, success: 94.7, revenue: 17200, status: "Active", type: "QA" },
  { name: "Marketing Optimizer", runs: 7810, success: 86.4, revenue: 19600, status: "Active", type: "Marketing" },
  { name: "Compliance Checker", runs: 14560, success: 97.2, revenue: 26400, status: "Active", type: "Legal" },
  { name: "Task Scheduler", runs: 19240, success: 91.8, revenue: 15300, status: "Active", type: "Automation" },
  { name: "API Monitor", runs: 11630, success: 93.5, revenue: 18700, status: "Active", type: "Infrastructure" },
  { name: "Translation Engine", runs: 6780, success: 95.1, revenue: 13500, status: "Active", type: "NLP" },
  { name: "Backup Manager", runs: 21450, success: 88.9, revenue: 12100, status: "Active", type: "Infrastructure" }
];

// Custom Agent Node Component with visible handles and click functionality
const AgentNode = ({ data }: { data: any }) => {
  const handleClick = () => {
    if (data.onClick) {
      data.onClick(data);
    }
  };

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
      
      {/* Node Content - Now clickable */}
      <div 
        className="bg-gradient-to-br from-gray-900/95 to-gray-800/95 border-2 border-emerald-500/40 rounded-xl p-4 min-w-[180px] shadow-2xl backdrop-blur-lg hover:border-emerald-400/60 transition-all duration-300 hover:shadow-emerald-500/20 cursor-pointer hover:scale-105"
        onClick={handleClick}
      >
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
        
        {/* Click indicator */}
        <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500/20 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <Eye className="w-2 h-2 text-blue-400" />
        </div>
        
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

// Helper functions to generate agent details
const getAgentTasks = (agentType: string) => {
  const taskMap: { [key: string]: string[] } = {
    'Agent Boss': [
      'Strategic decision making and resource allocation',
      'Cross-departmental coordination and oversight',
      'Performance monitoring and optimization',
      'Risk assessment and mitigation planning',
      'Team leadership and delegation'
    ],
    'Agent Worker': [
      'Process automation and task execution',
      'Data processing and analysis',
      'Quality assurance and validation',
      'Workflow optimization',
      'Report generation and documentation'
    ],
    'Agent LLC': [
      'Contract management and compliance',
      'Legal document review and processing',
      'Regulatory compliance monitoring',
      'Policy implementation and enforcement',
      'Audit trail maintenance'
    ],
    'Agent Data': [
      'Data collection and aggregation',
      'Real-time analytics and insights',
      'Database optimization and maintenance',
      'Data visualization and reporting',
      'Predictive modeling and forecasting'
    ],
    'Director': [
      'Strategic planning and execution',
      'Budget management and resource allocation',
      'Team performance evaluation',
      'Stakeholder communication',
      'Innovation and process improvement'
    ]
  };
  return taskMap[agentType] || ['General task automation', 'Process optimization', 'Data handling'];
};

const getAgentToolkit = (agentType: string) => {
  const toolkitMap: { [key: string]: string[] } = {
    'Agent Boss': [
      'Executive Dashboard', 'Resource Planner', 'Performance Analytics', 
      'Risk Monitor', 'Strategic Forecaster', 'Team Coordinator'
    ],
    'Agent Worker': [
      'Process Automator', 'Data Processor', 'Quality Checker', 
      'Workflow Engine', 'Report Builder', 'Task Scheduler'
    ],
    'Agent LLC': [
      'Contract Parser', 'Compliance Scanner', 'Legal Analyzer', 
      'Policy Engine', 'Audit Logger', 'Regulatory Monitor'
    ],
    'Agent Data': [
      'Data Collector', 'Analytics Engine', 'Visualization Tool', 
      'Prediction Model', 'Database Optimizer', 'Insight Generator'
    ],
    'Director': [
      'Strategy Planner', 'Budget Tracker', 'Performance Evaluator', 
      'Communication Hub', 'Innovation Lab', 'Process Designer'
    ]
  };
  return toolkitMap[agentType] || ['Basic Tools', 'Data Handler', 'Process Manager'];
};

const getAgentPerformance = (agentType: string) => {
  const basePerformance = {
    uptime: 95 + Math.random() * 5,
    tasksCompleted: Math.floor(Math.random() * 1000) + 500,
    successRate: 85 + Math.random() * 15,
    avgResponseTime: Math.floor(Math.random() * 200) + 50,
    energyEfficiency: 80 + Math.random() * 20
  };
  
  // Adjust based on agent type
  if (agentType === 'Agent Boss') {
    basePerformance.successRate += 5;
    basePerformance.uptime += 2;
  } else if (agentType === 'Director') {
    basePerformance.successRate += 3;
    basePerformance.uptime += 1;
  }
  
  return basePerformance;
};

const getAgentConnections = (agentType: string) => {
  const connectionMap: { [key: string]: string[] } = {
    'Agent Boss': ['Strategic Database', 'Performance Monitor', 'Resource Pool', 'Risk Assessment'],
    'Agent Worker': ['Task Queue', 'Data Pipeline', 'Quality Gate', 'Report Storage'],
    'Agent LLC': ['Legal Database', 'Compliance Engine', 'Policy Repository', 'Audit System'],
    'Agent Data': ['Data Sources', 'Analytics Platform', 'Visualization Engine', 'Prediction Models'],
    'Director': ['Strategic Planning', 'Budget System', 'Team Dashboard', 'Innovation Hub']
  };
  return connectionMap[agentType] || ['System Database', 'Process Engine', 'Monitoring Hub'];
};

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const { isConnected, address, connectWallet } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const voronoiRef = useRef<SVGSVGElement>(null);
  
  const [activeTab, setActiveTab] = useState('wallet');
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>("sales-domination");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [isAgentDetailsOpen, setIsAgentDetailsOpen] = useState(false);
  const [departmentCount, setDepartmentCount] = useState<{[key: string]: number}>({
    'Executive Director': 0,
    'Department Manager': 0,
    'Senior Associate': 0,
    'Associate': 0
  });

  // Agent click handler
  const handleAgentClick = useCallback((agentData: any) => {
    // Create detailed agent information with tasks and toolkit
    const detailedAgent = {
      ...agentData,
      id: agentData.id || `agent-${Date.now()}`,
      tasks: getAgentTasks(agentData.type),
      toolkit: getAgentToolkit(agentData.type),
      performance: getAgentPerformance(agentData.type),
      connections: getAgentConnections(agentData.type)
    };
    
    setSelectedAgent(detailedAgent);
    setIsAgentDetailsOpen(true);
  }, []);

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
        agentType: agentData.type,
        onClick: handleAgentClick
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
    },
    'compliance-governance': {
      name: 'Compliance & Governance Fleet',
      description: 'Ensure full enterprise-grade compliance, audit trails, and regulatory guardrails—all handled by your AI watchdogs',
      agents: [
        { type: 'Executive Director', x: 350, y: 40, id: 'exec-4', connections: ['compliance-dir-1', 'audit-dir-1'] },
        { type: 'Director', x: 200, y: 120, id: 'compliance-dir-1', connections: ['policy-mgr-1', 'legal-mgr-1'] },
        { type: 'Director', x: 500, y: 120, id: 'audit-dir-1', connections: ['risk-mgr-1', 'monitor-mgr-1'] },
        { type: 'Department Manager', x: 120, y: 220, id: 'policy-mgr-1', connections: ['policy-ops-1', 'gdpr-1'] },
        { type: 'Department Manager', x: 280, y: 220, id: 'legal-mgr-1', connections: ['legal-analyst-1', 'contract-1'] },
        { type: 'Department Manager', x: 420, y: 220, id: 'risk-mgr-1', connections: ['risk-score-1', 'threat-1'] },
        { type: 'Department Manager', x: 580, y: 220, id: 'monitor-mgr-1', connections: ['log-scanner-1', 'violation-1'] },
        { type: 'Senior Associate', x: 80, y: 340, id: 'policy-ops-1', connections: ['reg-updater-1'] },
        { type: 'Senior Associate', x: 160, y: 340, id: 'gdpr-1', connections: ['privacy-guard-1'] },
        { type: 'Senior Associate', x: 240, y: 340, id: 'legal-analyst-1', connections: ['compliance-checker-1'] },
        { type: 'Senior Associate', x: 320, y: 340, id: 'contract-1', connections: ['terms-validator-1'] },
        { type: 'Senior Associate', x: 400, y: 340, id: 'risk-score-1', connections: ['score-calc-1'] },
        { type: 'Senior Associate', x: 480, y: 340, id: 'threat-1', connections: ['alert-gen-1'] },
        { type: 'Senior Associate', x: 560, y: 340, id: 'log-scanner-1', connections: ['anomaly-det-1'] },
        { type: 'Senior Associate', x: 640, y: 340, id: 'violation-1', connections: ['report-gen-1'] },
        { type: 'Associate', x: 80, y: 480, id: 'reg-updater-1', connections: [] },
        { type: 'Associate', x: 160, y: 480, id: 'privacy-guard-1', connections: [] },
        { type: 'Associate', x: 240, y: 480, id: 'compliance-checker-1', connections: [] },
        { type: 'Associate', x: 320, y: 480, id: 'terms-validator-1', connections: [] },
        { type: 'Associate', x: 400, y: 480, id: 'score-calc-1', connections: [] },
        { type: 'Associate', x: 480, y: 480, id: 'alert-gen-1', connections: [] },
        { type: 'Associate', x: 560, y: 480, id: 'anomaly-det-1', connections: [] },
        { type: 'Associate', x: 640, y: 480, id: 'report-gen-1', connections: [] }
      ]
    },
    'enterprise-saas': {
      name: 'Enterprise SaaS Company Fleet',
      description: 'Complete engineering powerhouse with 85+ specialized agents across all tech stacks, levels, and disciplines for scalable SaaS operations',
      agents: [
        // C-Level & Executive Leadership
        { type: 'Executive Director', x: 400, y: 30, id: 'cto-1', connections: ['eng-dir-1', 'platform-dir-1', 'security-dir-1'] },
        
        // Engineering Directors
        { type: 'Director', x: 200, y: 100, id: 'eng-dir-1', connections: ['frontend-mgr-1', 'backend-mgr-1', 'mobile-mgr-1'] },
        { type: 'Director', x: 400, y: 100, id: 'platform-dir-1', connections: ['infra-mgr-1', 'devops-mgr-1', 'data-mgr-1'] },
        { type: 'Director', x: 600, y: 100, id: 'security-dir-1', connections: ['security-mgr-1', 'qa-mgr-1'] },
        
        // Department Managers - Frontend
        { type: 'Department Manager', x: 80, y: 200, id: 'frontend-mgr-1', connections: ['react-lead-1', 'vue-lead-1', 'ui-lead-1'] },
        { type: 'Department Manager', x: 200, y: 200, id: 'backend-mgr-1', connections: ['api-lead-1', 'micro-lead-1', 'db-lead-1'] },
        { type: 'Department Manager', x: 320, y: 200, id: 'mobile-mgr-1', connections: ['ios-lead-1', 'android-lead-1', 'flutter-lead-1'] },
        
        // Department Managers - Platform
        { type: 'Department Manager', x: 440, y: 200, id: 'infra-mgr-1', connections: ['cloud-lead-1', 'k8s-lead-1', 'network-lead-1'] },
        { type: 'Department Manager', x: 560, y: 200, id: 'devops-mgr-1', connections: ['ci-lead-1', 'monitoring-lead-1', 'release-lead-1'] },
        { type: 'Department Manager', x: 680, y: 200, id: 'data-mgr-1', connections: ['analytics-lead-1', 'ml-lead-1', 'etl-lead-1'] },
        
        // Department Managers - Security & QA
        { type: 'Department Manager', x: 800, y: 200, id: 'security-mgr-1', connections: ['appsec-lead-1', 'compliance-lead-1'] },
        { type: 'Department Manager', x: 920, y: 200, id: 'qa-mgr-1', connections: ['test-lead-1', 'automation-lead-1'] },
        
        // Senior Associates - Tech Leads
        { type: 'Senior Associate', x: 40, y: 320, id: 'react-lead-1', connections: ['react-dev-1', 'react-dev-2'] },
        { type: 'Senior Associate', x: 120, y: 320, id: 'vue-lead-1', connections: ['vue-dev-1', 'vue-dev-2'] },
        { type: 'Senior Associate', x: 200, y: 320, id: 'ui-lead-1', connections: ['ui-dev-1', 'design-sys-1'] },
        
        { type: 'Senior Associate', x: 280, y: 320, id: 'api-lead-1', connections: ['node-dev-1', 'python-dev-1'] },
        { type: 'Senior Associate', x: 360, y: 320, id: 'micro-lead-1', connections: ['go-dev-1', 'rust-dev-1'] },
        { type: 'Senior Associate', x: 440, y: 320, id: 'db-lead-1', connections: ['postgres-dev-1', 'redis-dev-1'] },
        
        { type: 'Senior Associate', x: 520, y: 320, id: 'ios-lead-1', connections: ['swift-dev-1', 'objc-dev-1'] },
        { type: 'Senior Associate', x: 600, y: 320, id: 'android-lead-1', connections: ['kotlin-dev-1', 'java-dev-1'] },
        { type: 'Senior Associate', x: 680, y: 320, id: 'flutter-lead-1', connections: ['dart-dev-1', 'flutter-dev-1'] },
        
        { type: 'Senior Associate', x: 760, y: 320, id: 'cloud-lead-1', connections: ['aws-dev-1', 'gcp-dev-1'] },
        { type: 'Senior Associate', x: 840, y: 320, id: 'k8s-lead-1', connections: ['k8s-dev-1', 'helm-dev-1'] },
        { type: 'Senior Associate', x: 920, y: 320, id: 'network-lead-1', connections: ['network-dev-1', 'cdn-dev-1'] },
        
        { type: 'Senior Associate', x: 1000, y: 320, id: 'ci-lead-1', connections: ['jenkins-dev-1', 'github-dev-1'] },
        { type: 'Senior Associate', x: 1080, y: 320, id: 'monitoring-lead-1', connections: ['prometheus-dev-1', 'grafana-dev-1'] },
        { type: 'Senior Associate', x: 1160, y: 320, id: 'release-lead-1', connections: ['deploy-dev-1', 'canary-dev-1'] },
        
        { type: 'Senior Associate', x: 1240, y: 320, id: 'analytics-lead-1', connections: ['spark-dev-1', 'snowflake-dev-1'] },
        { type: 'Senior Associate', x: 1320, y: 320, id: 'ml-lead-1', connections: ['tensorflow-dev-1', 'pytorch-dev-1'] },
        { type: 'Senior Associate', x: 1400, y: 320, id: 'etl-lead-1', connections: ['airflow-dev-1', 'kafka-dev-1'] },
        
        { type: 'Senior Associate', x: 1480, y: 320, id: 'appsec-lead-1', connections: ['security-dev-1', 'pentest-dev-1'] },
        { type: 'Senior Associate', x: 1560, y: 320, id: 'compliance-lead-1', connections: ['audit-dev-1', 'gdpr-dev-1'] },
        
        { type: 'Senior Associate', x: 1640, y: 320, id: 'test-lead-1', connections: ['unit-test-1', 'integration-test-1'] },
        { type: 'Senior Associate', x: 1720, y: 320, id: 'automation-lead-1', connections: ['e2e-test-1', 'perf-test-1'] },
        
        // Associates - Individual Contributors
        { type: 'Associate', x: 20, y: 480, id: 'react-dev-1', connections: [] },
        { type: 'Associate', x: 60, y: 480, id: 'react-dev-2', connections: [] },
        { type: 'Associate', x: 100, y: 480, id: 'vue-dev-1', connections: [] },
        { type: 'Associate', x: 140, y: 480, id: 'vue-dev-2', connections: [] },
        { type: 'Associate', x: 180, y: 480, id: 'ui-dev-1', connections: [] },
        { type: 'Associate', x: 220, y: 480, id: 'design-sys-1', connections: [] },
        
        { type: 'Associate', x: 260, y: 480, id: 'node-dev-1', connections: [] },
        { type: 'Associate', x: 300, y: 480, id: 'python-dev-1', connections: [] },
        { type: 'Associate', x: 340, y: 480, id: 'go-dev-1', connections: [] },
        { type: 'Associate', x: 380, y: 480, id: 'rust-dev-1', connections: [] },
        { type: 'Associate', x: 420, y: 480, id: 'postgres-dev-1', connections: [] },
        { type: 'Associate', x: 460, y: 480, id: 'redis-dev-1', connections: [] },
        
        { type: 'Associate', x: 500, y: 480, id: 'swift-dev-1', connections: [] },
        { type: 'Associate', x: 540, y: 480, id: 'objc-dev-1', connections: [] },
        { type: 'Associate', x: 580, y: 480, id: 'kotlin-dev-1', connections: [] },
        { type: 'Associate', x: 620, y: 480, id: 'java-dev-1', connections: [] },
        { type: 'Associate', x: 660, y: 480, id: 'dart-dev-1', connections: [] },
        { type: 'Associate', x: 700, y: 480, id: 'flutter-dev-1', connections: [] },
        
        { type: 'Associate', x: 740, y: 480, id: 'aws-dev-1', connections: [] },
        { type: 'Associate', x: 780, y: 480, id: 'gcp-dev-1', connections: [] },
        { type: 'Associate', x: 820, y: 480, id: 'k8s-dev-1', connections: [] },
        { type: 'Associate', x: 860, y: 480, id: 'helm-dev-1', connections: [] },
        { type: 'Associate', x: 900, y: 480, id: 'network-dev-1', connections: [] },
        { type: 'Associate', x: 940, y: 480, id: 'cdn-dev-1', connections: [] },
        
        { type: 'Associate', x: 980, y: 480, id: 'jenkins-dev-1', connections: [] },
        { type: 'Associate', x: 1020, y: 480, id: 'github-dev-1', connections: [] },
        { type: 'Associate', x: 1060, y: 480, id: 'prometheus-dev-1', connections: [] },
        { type: 'Associate', x: 1100, y: 480, id: 'grafana-dev-1', connections: [] },
        { type: 'Associate', x: 1140, y: 480, id: 'deploy-dev-1', connections: [] },
        { type: 'Associate', x: 1180, y: 480, id: 'canary-dev-1', connections: [] },
        
        { type: 'Associate', x: 1220, y: 480, id: 'spark-dev-1', connections: [] },
        { type: 'Associate', x: 1260, y: 480, id: 'snowflake-dev-1', connections: [] },
        { type: 'Associate', x: 1300, y: 480, id: 'tensorflow-dev-1', connections: [] },
        { type: 'Associate', x: 1340, y: 480, id: 'pytorch-dev-1', connections: [] },
        { type: 'Associate', x: 1380, y: 480, id: 'airflow-dev-1', connections: [] },
        { type: 'Associate', x: 1420, y: 480, id: 'kafka-dev-1', connections: [] },
        
        { type: 'Associate', x: 1460, y: 480, id: 'security-dev-1', connections: [] },
        { type: 'Associate', x: 1500, y: 480, id: 'pentest-dev-1', connections: [] },
        { type: 'Associate', x: 1540, y: 480, id: 'audit-dev-1', connections: [] },
        { type: 'Associate', x: 1580, y: 480, id: 'gdpr-dev-1', connections: [] },
        
        { type: 'Associate', x: 1620, y: 480, id: 'unit-test-1', connections: [] },
        { type: 'Associate', x: 1660, y: 480, id: 'integration-test-1', connections: [] },
        { type: 'Associate', x: 1700, y: 480, id: 'e2e-test-1', connections: [] },
        { type: 'Associate', x: 1740, y: 480, id: 'perf-test-1', connections: [] }
      ]
    },
    'corporation-big-bull': {
      name: 'Corporation Big Bull Fleet',
      description: 'Massive enterprise-wide fleet with 400+ agents covering every business team, department, and function for complete organizational automation',
      agents: [
        // C-Suite Executive Leadership
        { type: 'Executive Director', x: 500, y: 30, id: 'ceo-1', connections: ['coo-1', 'cfo-1', 'cto-1', 'cmo-1'] },
        { type: 'Executive Director', x: 300, y: 80, id: 'coo-1', connections: ['ops-dir-1', 'hr-dir-1'] },
        { type: 'Executive Director', x: 500, y: 80, id: 'cfo-1', connections: ['finance-dir-1', 'accounting-dir-1'] },
        { type: 'Executive Director', x: 700, y: 80, id: 'cto-1', connections: ['tech-dir-1', 'product-dir-1'] },
        { type: 'Executive Director', x: 900, y: 80, id: 'cmo-1', connections: ['marketing-dir-1', 'sales-dir-1'] },

        // Directors Layer
        { type: 'Director', x: 200, y: 140, id: 'ops-dir-1', connections: ['facilities-mgr-1', 'procurement-mgr-1', 'logistics-mgr-1'] },
        { type: 'Director', x: 300, y: 140, id: 'hr-dir-1', connections: ['talent-mgr-1', 'benefits-mgr-1', 'training-mgr-1'] },
        { type: 'Director', x: 400, y: 140, id: 'finance-dir-1', connections: ['treasury-mgr-1', 'planning-mgr-1', 'risk-mgr-1'] },
        { type: 'Director', x: 500, y: 140, id: 'accounting-dir-1', connections: ['ap-mgr-1', 'ar-mgr-1', 'tax-mgr-1'] },
        { type: 'Director', x: 600, y: 140, id: 'tech-dir-1', connections: ['dev-mgr-1', 'infra-mgr-1', 'security-mgr-1'] },
        { type: 'Director', x: 700, y: 140, id: 'product-dir-1', connections: ['pm-mgr-1', 'design-mgr-1', 'qa-mgr-1'] },
        { type: 'Director', x: 800, y: 140, id: 'marketing-dir-1', connections: ['brand-mgr-1', 'digital-mgr-1', 'content-mgr-1'] },
        { type: 'Director', x: 900, y: 140, id: 'sales-dir-1', connections: ['enterprise-mgr-1', 'channel-mgr-1', 'customer-mgr-1'] },

        // Department Managers - Operations
        { type: 'Department Manager', x: 120, y: 220, id: 'facilities-mgr-1', connections: ['maintenance-lead-1', 'security-lead-1'] },
        { type: 'Department Manager', x: 200, y: 220, id: 'procurement-mgr-1', connections: ['sourcing-lead-1', 'vendor-lead-1'] },
        { type: 'Department Manager', x: 280, y: 220, id: 'logistics-mgr-1', connections: ['shipping-lead-1', 'inventory-lead-1'] },

        // Department Managers - HR
        { type: 'Department Manager', x: 360, y: 220, id: 'talent-mgr-1', connections: ['recruiting-lead-1', 'onboarding-lead-1'] },
        { type: 'Department Manager', x: 440, y: 220, id: 'benefits-mgr-1', connections: ['compensation-lead-1', 'wellness-lead-1'] },
        { type: 'Department Manager', x: 520, y: 220, id: 'training-mgr-1', connections: ['learning-lead-1', 'development-lead-1'] },

        // Department Managers - Finance
        { type: 'Department Manager', x: 600, y: 220, id: 'treasury-mgr-1', connections: ['cash-lead-1', 'investment-lead-1'] },
        { type: 'Department Manager', x: 680, y: 220, id: 'planning-mgr-1', connections: ['budget-lead-1', 'forecast-lead-1'] },
        { type: 'Department Manager', x: 760, y: 220, id: 'risk-mgr-1', connections: ['audit-lead-1', 'compliance-lead-1'] },

        // Department Managers - Accounting
        { type: 'Department Manager', x: 840, y: 220, id: 'ap-mgr-1', connections: ['invoice-lead-1', 'payment-lead-1'] },
        { type: 'Department Manager', x: 920, y: 220, id: 'ar-mgr-1', connections: ['billing-lead-1', 'collection-lead-1'] },
        { type: 'Department Manager', x: 1000, y: 220, id: 'tax-mgr-1', connections: ['corporate-lead-1', 'international-lead-1'] },

        // Department Managers - Technology
        { type: 'Department Manager', x: 1080, y: 220, id: 'dev-mgr-1', connections: ['frontend-lead-1', 'backend-lead-1', 'mobile-lead-1'] },
        { type: 'Department Manager', x: 1160, y: 220, id: 'infra-mgr-1', connections: ['cloud-lead-1', 'network-lead-1', 'database-lead-1'] },
        { type: 'Department Manager', x: 1240, y: 220, id: 'security-mgr-1', connections: ['cybersec-lead-1', 'privacy-lead-1'] },

        // Department Managers - Product
        { type: 'Department Manager', x: 1320, y: 220, id: 'pm-mgr-1', connections: ['strategy-lead-1', 'roadmap-lead-1'] },
        { type: 'Department Manager', x: 1400, y: 220, id: 'design-mgr-1', connections: ['ux-lead-1', 'ui-lead-1'] },
        { type: 'Department Manager', x: 1480, y: 220, id: 'qa-mgr-1', connections: ['testing-lead-1', 'automation-lead-1'] },

        // Department Managers - Marketing
        { type: 'Department Manager', x: 1560, y: 220, id: 'brand-mgr-1', connections: ['creative-lead-1', 'pr-lead-1'] },
        { type: 'Department Manager', x: 1640, y: 220, id: 'digital-mgr-1', connections: ['seo-lead-1', 'social-lead-1', 'paid-lead-1'] },
        { type: 'Department Manager', x: 1720, y: 220, id: 'content-mgr-1', connections: ['writing-lead-1', 'video-lead-1'] },

        // Department Managers - Sales
        { type: 'Department Manager', x: 1800, y: 220, id: 'enterprise-mgr-1', connections: ['account-lead-1', 'solution-lead-1'] },
        { type: 'Department Manager', x: 1880, y: 220, id: 'channel-mgr-1', connections: ['partner-lead-1', 'reseller-lead-1'] },
        { type: 'Department Manager', x: 1960, y: 220, id: 'customer-mgr-1', connections: ['success-lead-1', 'support-lead-1'] },

        // Senior Associates - Team Leads (Operations)
        { type: 'Senior Associate', x: 80, y: 320, id: 'maintenance-lead-1', connections: ['hvac-spec-1', 'electrical-spec-1'] },
        { type: 'Senior Associate', x: 160, y: 320, id: 'security-lead-1', connections: ['guard-coord-1', 'access-coord-1'] },
        { type: 'Senior Associate', x: 240, y: 320, id: 'sourcing-lead-1', connections: ['supplier-spec-1', 'contract-spec-1'] },
        { type: 'Senior Associate', x: 320, y: 320, id: 'vendor-lead-1', connections: ['relationship-spec-1', 'performance-spec-1'] },
        { type: 'Senior Associate', x: 400, y: 320, id: 'shipping-lead-1', connections: ['freight-spec-1', 'customs-spec-1'] },
        { type: 'Senior Associate', x: 480, y: 320, id: 'inventory-lead-1', connections: ['warehouse-spec-1', 'tracking-spec-1'] },

        // Senior Associates - Team Leads (HR)
        { type: 'Senior Associate', x: 560, y: 320, id: 'recruiting-lead-1', connections: ['sourcing-spec-1', 'screening-spec-1'] },
        { type: 'Senior Associate', x: 640, y: 320, id: 'onboarding-lead-1', connections: ['orientation-spec-1', 'integration-spec-1'] },
        { type: 'Senior Associate', x: 720, y: 320, id: 'compensation-lead-1', connections: ['salary-spec-1', 'equity-spec-1'] },
        { type: 'Senior Associate', x: 800, y: 320, id: 'wellness-lead-1', connections: ['health-spec-1', 'mental-spec-1'] },
        { type: 'Senior Associate', x: 880, y: 320, id: 'learning-lead-1', connections: ['curriculum-spec-1', 'platform-spec-1'] },
        { type: 'Senior Associate', x: 960, y: 320, id: 'development-lead-1', connections: ['career-spec-1', 'leadership-spec-1'] },

        // Senior Associates - Team Leads (Finance)
        { type: 'Senior Associate', x: 1040, y: 320, id: 'cash-lead-1', connections: ['liquidity-spec-1', 'banking-spec-1'] },
        { type: 'Senior Associate', x: 1120, y: 320, id: 'investment-lead-1', connections: ['portfolio-spec-1', 'analysis-spec-1'] },
        { type: 'Senior Associate', x: 1200, y: 320, id: 'budget-lead-1', connections: ['planning-spec-1', 'allocation-spec-1'] },
        { type: 'Senior Associate', x: 1280, y: 320, id: 'forecast-lead-1', connections: ['modeling-spec-1', 'scenario-spec-1'] },
        { type: 'Senior Associate', x: 1360, y: 320, id: 'audit-lead-1', connections: ['internal-spec-1', 'external-spec-1'] },
        { type: 'Senior Associate', x: 1440, y: 320, id: 'compliance-lead-1', connections: ['regulatory-spec-1', 'policy-spec-1'] },

        // Senior Associates - Team Leads (Accounting)
        { type: 'Senior Associate', x: 1520, y: 320, id: 'invoice-lead-1', connections: ['processing-spec-1', 'approval-spec-1'] },
        { type: 'Senior Associate', x: 1600, y: 320, id: 'payment-lead-1', connections: ['disbursement-spec-1', 'reconciliation-spec-1'] },
        { type: 'Senior Associate', x: 1680, y: 320, id: 'billing-lead-1', connections: ['invoicing-spec-1', 'revenue-spec-1'] },
        { type: 'Senior Associate', x: 1760, y: 320, id: 'collection-lead-1', connections: ['dunning-spec-1', 'recovery-spec-1'] },
        { type: 'Senior Associate', x: 1840, y: 320, id: 'corporate-lead-1', connections: ['federal-spec-1', 'state-spec-1'] },
        { type: 'Senior Associate', x: 1920, y: 320, id: 'international-lead-1', connections: ['transfer-spec-1', 'treaty-spec-1'] },

        // Senior Associates - Team Leads (Technology)
        { type: 'Senior Associate', x: 2000, y: 320, id: 'frontend-lead-1', connections: ['react-dev-1', 'vue-dev-1'] },
        { type: 'Senior Associate', x: 2080, y: 320, id: 'backend-lead-1', connections: ['api-dev-1', 'microservice-dev-1'] },
        { type: 'Senior Associate', x: 2160, y: 320, id: 'mobile-lead-1', connections: ['ios-dev-1', 'android-dev-1'] },
        { type: 'Senior Associate', x: 2240, y: 320, id: 'cloud-lead-1', connections: ['aws-dev-1', 'azure-dev-1'] },
        { type: 'Senior Associate', x: 2320, y: 320, id: 'network-lead-1', connections: ['infrastructure-dev-1', 'monitoring-dev-1'] },
        { type: 'Senior Associate', x: 2400, y: 320, id: 'database-lead-1', connections: ['sql-dev-1', 'nosql-dev-1'] },

        // Associates - Individual Contributors (First 100 agents)
        { type: 'Associate', x: 40, y: 480, id: 'hvac-spec-1', connections: [] },
        { type: 'Associate', x: 80, y: 480, id: 'electrical-spec-1', connections: [] },
        { type: 'Associate', x: 120, y: 480, id: 'guard-coord-1', connections: [] },
        { type: 'Associate', x: 160, y: 480, id: 'access-coord-1', connections: [] },
        { type: 'Associate', x: 200, y: 480, id: 'supplier-spec-1', connections: [] },
        { type: 'Associate', x: 240, y: 480, id: 'contract-spec-1', connections: [] },
        { type: 'Associate', x: 280, y: 480, id: 'relationship-spec-1', connections: [] },
        { type: 'Associate', x: 320, y: 480, id: 'performance-spec-1', connections: [] },
        { type: 'Associate', x: 360, y: 480, id: 'freight-spec-1', connections: [] },
        { type: 'Associate', x: 400, y: 480, id: 'customs-spec-1', connections: [] },
        { type: 'Associate', x: 440, y: 480, id: 'warehouse-spec-1', connections: [] },
        { type: 'Associate', x: 480, y: 480, id: 'tracking-spec-1', connections: [] },
        { type: 'Associate', x: 520, y: 480, id: 'sourcing-spec-1', connections: [] },
        { type: 'Associate', x: 560, y: 480, id: 'screening-spec-1', connections: [] },
        { type: 'Associate', x: 600, y: 480, id: 'orientation-spec-1', connections: [] },
        { type: 'Associate', x: 640, y: 480, id: 'integration-spec-1', connections: [] },
        { type: 'Associate', x: 680, y: 480, id: 'salary-spec-1', connections: [] },
        { type: 'Associate', x: 720, y: 480, id: 'equity-spec-1', connections: [] },
        { type: 'Associate', x: 760, y: 480, id: 'health-spec-1', connections: [] },
        { type: 'Associate', x: 800, y: 480, id: 'mental-spec-1', connections: [] },
        { type: 'Associate', x: 840, y: 480, id: 'curriculum-spec-1', connections: [] },
        { type: 'Associate', x: 880, y: 480, id: 'platform-spec-1', connections: [] },
        { type: 'Associate', x: 920, y: 480, id: 'career-spec-1', connections: [] },
        { type: 'Associate', x: 960, y: 480, id: 'leadership-spec-1', connections: [] },
        { type: 'Associate', x: 1000, y: 480, id: 'liquidity-spec-1', connections: [] },
        { type: 'Associate', x: 1040, y: 480, id: 'banking-spec-1', connections: [] },
        { type: 'Associate', x: 1080, y: 480, id: 'portfolio-spec-1', connections: [] },
        { type: 'Associate', x: 1120, y: 480, id: 'analysis-spec-1', connections: [] },
        { type: 'Associate', x: 1160, y: 480, id: 'planning-spec-1', connections: [] },
        { type: 'Associate', x: 1200, y: 480, id: 'allocation-spec-1', connections: [] },
        { type: 'Associate', x: 1240, y: 480, id: 'modeling-spec-1', connections: [] },
        { type: 'Associate', x: 1280, y: 480, id: 'scenario-spec-1', connections: [] },
        { type: 'Associate', x: 1320, y: 480, id: 'internal-spec-1', connections: [] },
        { type: 'Associate', x: 1360, y: 480, id: 'external-spec-1', connections: [] },
        { type: 'Associate', x: 1400, y: 480, id: 'regulatory-spec-1', connections: [] },
        { type: 'Associate', x: 1440, y: 480, id: 'policy-spec-1', connections: [] },
        { type: 'Associate', x: 1480, y: 480, id: 'processing-spec-1', connections: [] },
        { type: 'Associate', x: 1520, y: 480, id: 'approval-spec-1', connections: [] },
        { type: 'Associate', x: 1560, y: 480, id: 'disbursement-spec-1', connections: [] },
        { type: 'Associate', x: 1600, y: 480, id: 'reconciliation-spec-1', connections: [] },
        { type: 'Associate', x: 1640, y: 480, id: 'invoicing-spec-1', connections: [] },
        { type: 'Associate', x: 1680, y: 480, id: 'revenue-spec-1', connections: [] },
        { type: 'Associate', x: 1720, y: 480, id: 'dunning-spec-1', connections: [] },
        { type: 'Associate', x: 1760, y: 480, id: 'recovery-spec-1', connections: [] },
        { type: 'Associate', x: 1800, y: 480, id: 'federal-spec-1', connections: [] },
        { type: 'Associate', x: 1840, y: 480, id: 'state-spec-1', connections: [] },
        { type: 'Associate', x: 1880, y: 480, id: 'transfer-spec-1', connections: [] },
        { type: 'Associate', x: 1920, y: 480, id: 'treaty-spec-1', connections: [] },
        { type: 'Associate', x: 1960, y: 480, id: 'react-dev-1', connections: [] },
        { type: 'Associate', x: 2000, y: 480, id: 'vue-dev-1', connections: [] },
        { type: 'Associate', x: 2040, y: 480, id: 'api-dev-1', connections: [] },
        { type: 'Associate', x: 2080, y: 480, id: 'microservice-dev-1', connections: [] },
        { type: 'Associate', x: 2120, y: 480, id: 'ios-dev-1', connections: [] },
        { type: 'Associate', x: 2160, y: 480, id: 'android-dev-1', connections: [] },
        { type: 'Associate', x: 2200, y: 480, id: 'aws-dev-1', connections: [] },
        { type: 'Associate', x: 2240, y: 480, id: 'azure-dev-1', connections: [] },
        { type: 'Associate', x: 2280, y: 480, id: 'infrastructure-dev-1', connections: [] },
        { type: 'Associate', x: 2320, y: 480, id: 'monitoring-dev-1', connections: [] },
        { type: 'Associate', x: 2360, y: 480, id: 'sql-dev-1', connections: [] },
        { type: 'Associate', x: 2400, y: 480, id: 'nosql-dev-1', connections: [] },

        // Additional Associates - Second Layer (Next 100 agents)
        { type: 'Associate', x: 40, y: 580, id: 'cybersec-lead-1', connections: [] },
        { type: 'Associate', x: 80, y: 580, id: 'privacy-lead-1', connections: [] },
        { type: 'Associate', x: 120, y: 580, id: 'strategy-lead-1', connections: [] },
        { type: 'Associate', x: 160, y: 580, id: 'roadmap-lead-1', connections: [] },
        { type: 'Associate', x: 200, y: 580, id: 'ux-lead-1', connections: [] },
        { type: 'Associate', x: 240, y: 580, id: 'ui-lead-1', connections: [] },
        { type: 'Associate', x: 280, y: 580, id: 'testing-lead-1', connections: [] },
        { type: 'Associate', x: 320, y: 580, id: 'automation-lead-1', connections: [] },
        { type: 'Associate', x: 360, y: 580, id: 'creative-lead-1', connections: [] },
        { type: 'Associate', x: 400, y: 580, id: 'pr-lead-1', connections: [] },
        { type: 'Associate', x: 440, y: 580, id: 'seo-lead-1', connections: [] },
        { type: 'Associate', x: 480, y: 580, id: 'social-lead-1', connections: [] },
        { type: 'Associate', x: 520, y: 580, id: 'paid-lead-1', connections: [] },
        { type: 'Associate', x: 560, y: 580, id: 'writing-lead-1', connections: [] },
        { type: 'Associate', x: 600, y: 580, id: 'video-lead-1', connections: [] },
        { type: 'Associate', x: 640, y: 580, id: 'account-lead-1', connections: [] },
        { type: 'Associate', x: 680, y: 580, id: 'solution-lead-1', connections: [] },
        { type: 'Associate', x: 720, y: 580, id: 'partner-lead-1', connections: [] },
        { type: 'Associate', x: 760, y: 580, id: 'reseller-lead-1', connections: [] },
        { type: 'Associate', x: 800, y: 580, id: 'success-lead-1', connections: [] },
        { type: 'Associate', x: 840, y: 580, id: 'support-lead-1', connections: [] },
        // More specialists across departments (continuing pattern to reach 400+)
        { type: 'Associate', x: 880, y: 580, id: 'legal-specialist-1', connections: [] },
        { type: 'Associate', x: 920, y: 580, id: 'contract-specialist-1', connections: [] },
        { type: 'Associate', x: 960, y: 580, id: 'ip-specialist-1', connections: [] },
        { type: 'Associate', x: 1000, y: 580, id: 'regulatory-specialist-1', connections: [] },
        { type: 'Associate', x: 1040, y: 580, id: 'data-analyst-1', connections: [] },
        { type: 'Associate', x: 1080, y: 580, id: 'business-analyst-1', connections: [] },
        { type: 'Associate', x: 1120, y: 580, id: 'research-analyst-1', connections: [] },
        { type: 'Associate', x: 1160, y: 580, id: 'market-analyst-1', connections: [] },
        { type: 'Associate', x: 1200, y: 580, id: 'financial-analyst-1', connections: [] },
        { type: 'Associate', x: 1240, y: 580, id: 'operations-analyst-1', connections: [] },
        { type: 'Associate', x: 1280, y: 580, id: 'sales-analyst-1', connections: [] },
        { type: 'Associate', x: 1320, y: 580, id: 'marketing-analyst-1', connections: [] },
        { type: 'Associate', x: 1360, y: 580, id: 'hr-analyst-1', connections: [] },
        { type: 'Associate', x: 1400, y: 580, id: 'tech-analyst-1', connections: [] },
        { type: 'Associate', x: 1440, y: 580, id: 'product-analyst-1', connections: [] },
        { type: 'Associate', x: 1480, y: 580, id: 'customer-analyst-1', connections: [] },
        { type: 'Associate', x: 1520, y: 580, id: 'vendor-analyst-1', connections: [] },
        { type: 'Associate', x: 1560, y: 580, id: 'risk-analyst-1', connections: [] },
        { type: 'Associate', x: 1600, y: 580, id: 'compliance-analyst-1', connections: [] },
        { type: 'Associate', x: 1640, y: 580, id: 'security-analyst-1', connections: [] },
        { type: 'Associate', x: 1680, y: 580, id: 'quality-analyst-1', connections: [] },
        { type: 'Associate', x: 1720, y: 580, id: 'process-analyst-1', connections: [] },
        { type: 'Associate', x: 1760, y: 580, id: 'performance-analyst-1', connections: [] },
        { type: 'Associate', x: 1800, y: 580, id: 'budget-analyst-1', connections: [] },
        { type: 'Associate', x: 1840, y: 580, id: 'pricing-analyst-1', connections: [] },
        { type: 'Associate', x: 1880, y: 580, id: 'competitive-analyst-1', connections: [] },
        { type: 'Associate', x: 1920, y: 580, id: 'trend-analyst-1', connections: [] },
        { type: 'Associate', x: 1960, y: 580, id: 'forecast-analyst-1', connections: [] },
        { type: 'Associate', x: 2000, y: 580, id: 'reporting-analyst-1', connections: [] },
        { type: 'Associate', x: 2040, y: 580, id: 'dashboard-analyst-1', connections: [] },
        { type: 'Associate', x: 2080, y: 580, id: 'metrics-analyst-1', connections: [] },
        { type: 'Associate', x: 2120, y: 580, id: 'kpi-analyst-1', connections: [] },
        { type: 'Associate', x: 2160, y: 580, id: 'roi-analyst-1', connections: [] },
        { type: 'Associate', x: 2200, y: 580, id: 'efficiency-analyst-1', connections: [] },
        { type: 'Associate', x: 2240, y: 580, id: 'productivity-analyst-1', connections: [] },
        { type: 'Associate', x: 2280, y: 580, id: 'cost-analyst-1', connections: [] },
        { type: 'Associate', x: 2320, y: 580, id: 'revenue-analyst-1', connections: [] },
        { type: 'Associate', x: 2360, y: 580, id: 'profit-analyst-1', connections: [] },
        { type: 'Associate', x: 2400, y: 580, id: 'growth-analyst-1', connections: [] },

        // Third Layer - Supporting Functions (Next 150+ agents to reach 400+)
        { type: 'Associate', x: 40, y: 680, id: 'admin-assistant-1', connections: [] },
        { type: 'Associate', x: 80, y: 680, id: 'executive-assistant-1', connections: [] },
        { type: 'Associate', x: 120, y: 680, id: 'project-coordinator-1', connections: [] },
        { type: 'Associate', x: 160, y: 680, id: 'program-coordinator-1', connections: [] },
        { type: 'Associate', x: 200, y: 680, id: 'communications-specialist-1', connections: [] },
        { type: 'Associate', x: 240, y: 680, id: 'events-coordinator-1', connections: [] },
        { type: 'Associate', x: 280, y: 680, id: 'travel-coordinator-1', connections: [] },
        { type: 'Associate', x: 320, y: 680, id: 'office-manager-1', connections: [] },
        { type: 'Associate', x: 360, y: 680, id: 'reception-coordinator-1', connections: [] },
        { type: 'Associate', x: 400, y: 680, id: 'mail-coordinator-1', connections: [] },
        { type: 'Associate', x: 440, y: 680, id: 'supply-coordinator-1', connections: [] },
        { type: 'Associate', x: 480, y: 680, id: 'equipment-specialist-1', connections: [] },
        { type: 'Associate', x: 520, y: 680, id: 'maintenance-coordinator-1', connections: [] },
        { type: 'Associate', x: 560, y: 680, id: 'cleaning-coordinator-1', connections: [] },
        { type: 'Associate', x: 600, y: 680, id: 'cafeteria-coordinator-1', connections: [] },
        { type: 'Associate', x: 640, y: 680, id: 'parking-coordinator-1', connections: [] },
        { type: 'Associate', x: 680, y: 680, id: 'badge-coordinator-1', connections: [] },
        { type: 'Associate', x: 720, y: 680, id: 'visitor-coordinator-1', connections: [] },
        { type: 'Associate', x: 760, y: 680, id: 'document-specialist-1', connections: [] },
        { type: 'Associate', x: 800, y: 680, id: 'archive-specialist-1', connections: [] },
        { type: 'Associate', x: 840, y: 680, id: 'records-specialist-1', connections: [] },
        { type: 'Associate', x: 880, y: 680, id: 'filing-specialist-1', connections: [] },
        { type: 'Associate', x: 920, y: 680, id: 'scanning-specialist-1', connections: [] },
        { type: 'Associate', x: 960, y: 680, id: 'printing-specialist-1', connections: [] },
        { type: 'Associate', x: 1000, y: 680, id: 'translation-specialist-1', connections: [] },
        { type: 'Associate', x: 1040, y: 680, id: 'editing-specialist-1', connections: [] },
        { type: 'Associate', x: 1080, y: 680, id: 'proofreading-specialist-1', connections: [] },
        { type: 'Associate', x: 1120, y: 680, id: 'writing-specialist-1', connections: [] },
        { type: 'Associate', x: 1160, y: 680, id: 'copywriting-specialist-1', connections: [] },
        { type: 'Associate', x: 1200, y: 680, id: 'technical-writer-1', connections: [] },
        { type: 'Associate', x: 1240, y: 680, id: 'content-creator-1', connections: [] },
        { type: 'Associate', x: 1280, y: 680, id: 'social-media-specialist-1', connections: [] },
        { type: 'Associate', x: 1320, y: 680, id: 'community-manager-1', connections: [] },
        { type: 'Associate', x: 1360, y: 680, id: 'influencer-coordinator-1', connections: [] },
        { type: 'Associate', x: 1400, y: 680, id: 'brand-ambassador-1', connections: [] },
        { type: 'Associate', x: 1440, y: 680, id: 'event-planner-1', connections: [] },
        { type: 'Associate', x: 1480, y: 680, id: 'conference-coordinator-1', connections: [] },
        { type: 'Associate', x: 1520, y: 680, id: 'webinar-specialist-1', connections: [] },
        { type: 'Associate', x: 1560, y: 680, id: 'training-coordinator-1', connections: [] },
        { type: 'Associate', x: 1600, y: 680, id: 'workshop-facilitator-1', connections: [] },
        { type: 'Associate', x: 1640, y: 680, id: 'certification-coordinator-1', connections: [] },
        { type: 'Associate', x: 1680, y: 680, id: 'skills-assessor-1', connections: [] },
        { type: 'Associate', x: 1720, y: 680, id: 'performance-reviewer-1', connections: [] },
        { type: 'Associate', x: 1760, y: 680, id: 'goal-tracker-1', connections: [] },
        { type: 'Associate', x: 1800, y: 680, id: 'feedback-collector-1', connections: [] },
        { type: 'Associate', x: 1840, y: 680, id: 'survey-coordinator-1', connections: [] },
        { type: 'Associate', x: 1880, y: 680, id: 'poll-manager-1', connections: [] },
        { type: 'Associate', x: 1920, y: 680, id: 'data-collector-1', connections: [] },
        { type: 'Associate', x: 1960, y: 680, id: 'statistics-compiler-1', connections: [] },
        { type: 'Associate', x: 2000, y: 680, id: 'report-generator-1', connections: [] },
        { type: 'Associate', x: 2040, y: 680, id: 'presentation-creator-1', connections: [] },
        { type: 'Associate', x: 2080, y: 680, id: 'slide-designer-1', connections: [] },
        { type: 'Associate', x: 2120, y: 680, id: 'infographic-creator-1', connections: [] },
        { type: 'Associate', x: 2160, y: 680, id: 'chart-maker-1', connections: [] },
        { type: 'Associate', x: 2200, y: 680, id: 'graph-designer-1', connections: [] },
        { type: 'Associate', x: 2240, y: 680, id: 'visualization-specialist-1', connections: [] },
        { type: 'Associate', x: 2280, y: 680, id: 'dashboard-creator-1', connections: [] },
        { type: 'Associate', x: 2320, y: 680, id: 'scorecard-manager-1', connections: [] },
        { type: 'Associate', x: 2360, y: 680, id: 'benchmark-tracker-1', connections: [] }
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
          agentType: agent.type,
          onClick: handleAgentClick
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

  // Massive Brain-Like Hive Mind Visualization (200k+ data points)
  useEffect(() => {
    if (activeTab === 'ecosystem') {
      console.log('Starting massive hive mind brain visualization...');
      const container = d3.select('#voronoi-ecosystem');
      container.selectAll('*').remove();

      const width = 800;
      const height = 500;

      // Create SVG with dark cosmic background
      const svg = container
        .append('svg')
        .attr('width', '100%')
        .attr('height', '100%')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .style('background', 'radial-gradient(circle at center, #1a0a1a 0%, #0a0a0a 50%, #000000 100%)')
        .style('border-radius', '8px');

      // Add advanced glow and blur filters
      const defs = svg.append('defs');
      
      const glowFilter = defs.append('filter')
        .attr('id', 'glow')
        .attr('width', '200%')
        .attr('height', '200%')
        .attr('x', '-50%')
        .attr('y', '-50%');
      
      glowFilter.append('feGaussianBlur')
        .attr('stdDeviation', '2')
        .attr('result', 'coloredBlur');
      
      const feMerge = glowFilter.append('feMerge');
      feMerge.append('feMergeNode').attr('in', 'coloredBlur');
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

      const connectionFilter = defs.append('filter')
        .attr('id', 'connectionGlow')
        .attr('width', '200%')
        .attr('height', '200%')
        .attr('x', '-50%')
        .attr('y', '-50%');
      
      connectionFilter.append('feGaussianBlur')
        .attr('stdDeviation', '1')
        .attr('result', 'coloredBlur');
      
      const connectionMerge = connectionFilter.append('feMerge');
      connectionMerge.append('feMergeNode').attr('in', 'coloredBlur');
      connectionMerge.append('feMergeNode').attr('in', 'SourceGraphic');

      // Generate massive brain-like structure with 200k+ nodes
      console.log('Generating 200k+ neural nodes...');
      const nodes: any[] = [];
      const connections: any[] = [];

      // Color palette for brain-like hive mind
      const colors = {
        core: '#ff1493',      // Deep pink
        synapse: '#8b008b',   // Dark magenta
        neural: '#4b0082',    // Indigo
        dendrite: '#663399',  // Rebecca purple
        dark: '#2d1b3d'       // Dark purple
      };

      // Create brain hemisphere structure
      const leftCenter = { x: width * 0.25, y: height * 0.5 };
      const rightCenter = { x: width * 0.75, y: height * 0.5 };
      const corpus = { x: width * 0.5, y: height * 0.5 };

      // Generate dense neural clusters (brain regions)
      const regions = [
        // Left hemisphere regions
        { center: { x: leftCenter.x, y: height * 0.3 }, radius: 80, density: 15000, type: 'frontal' },
        { center: { x: leftCenter.x - 50, y: height * 0.5 }, radius: 60, density: 12000, type: 'temporal' },
        { center: { x: leftCenter.x, y: height * 0.7 }, radius: 70, density: 13000, type: 'occipital' },
        { center: { x: leftCenter.x + 30, y: height * 0.4 }, radius: 50, density: 10000, type: 'parietal' },
        
        // Right hemisphere regions
        { center: { x: rightCenter.x, y: height * 0.3 }, radius: 80, density: 15000, type: 'frontal' },
        { center: { x: rightCenter.x + 50, y: height * 0.5 }, radius: 60, density: 12000, type: 'temporal' },
        { center: { x: rightCenter.x, y: height * 0.7 }, radius: 70, density: 13000, type: 'occipital' },
        { center: { x: rightCenter.x - 30, y: height * 0.4 }, radius: 50, density: 10000, type: 'parietal' },
        
        // Central regions (corpus callosum, brainstem)
        { center: corpus, radius: 40, density: 8000, type: 'corpus' },
        { center: { x: width * 0.5, y: height * 0.8 }, radius: 30, density: 6000, type: 'brainstem' },
        
        // Additional neural clusters for density
        { center: { x: width * 0.15, y: height * 0.4 }, radius: 35, density: 7000, type: 'cluster' },
        { center: { x: width * 0.85, y: height * 0.4 }, radius: 35, density: 7000, type: 'cluster' },
        { center: { x: width * 0.3, y: height * 0.15 }, radius: 25, density: 5000, type: 'cluster' },
        { center: { x: width * 0.7, y: height * 0.15 }, radius: 25, density: 5000, type: 'cluster' },
        { center: { x: width * 0.3, y: height * 0.85 }, radius: 25, density: 5000, type: 'cluster' },
        { center: { x: width * 0.7, y: height * 0.85 }, radius: 25, density: 5000, type: 'cluster' }
      ];

      // Generate nodes for each brain region
      regions.forEach((region, regionIndex) => {
        for (let i = 0; i < region.density; i++) {
          // Generate points in circular cluster with gaussian distribution
          const angle = Math.random() * 2 * Math.PI;
          const radiusVariation = Math.random() * Math.random(); // Bias toward center
          const distance = radiusVariation * region.radius;
          
          const x = region.center.x + Math.cos(angle) * distance;
          const y = region.center.y + Math.sin(angle) * distance;
          
          // Skip if outside canvas bounds
          if (x < 0 || x > width || y < 0 || y > height) continue;
          
          // Determine node type and color based on region and distance from center
          let nodeColor, nodeSize;
          const distanceFromCenter = Math.sqrt((x - region.center.x) ** 2 + (y - region.center.y) ** 2);
          const normalizedDistance = distanceFromCenter / region.radius;
          
          if (normalizedDistance < 0.2) {
            nodeColor = colors.core;
            nodeSize = 2.5;
          } else if (normalizedDistance < 0.4) {
            nodeColor = colors.synapse;
            nodeSize = 2;
          } else if (normalizedDistance < 0.7) {
            nodeColor = colors.neural;
            nodeSize = 1.5;
          } else {
            nodeColor = colors.dendrite;
            nodeSize = 1;
          }
          
          nodes.push({
            id: `node-${regionIndex}-${i}`,
            x: x,
            y: y,
            region: regionIndex,
            type: region.type,
            color: nodeColor,
            size: nodeSize + Math.random() * 0.5,
            opacity: 0.4 + Math.random() * 0.4
          });
        }
      });

      console.log(`Generated ${nodes.length} neural nodes`);

      // Generate massive connection network
      console.log('Generating neural connections...');
      
      // Create regional connections (within brain regions)
      regions.forEach((region, regionIndex) => {
        const regionNodes = nodes.filter(n => n.region === regionIndex);
        
        // Connect nearby nodes within region
        for (let i = 0; i < Math.min(regionNodes.length, 2000); i += 3) {
          const sourceNode = regionNodes[i];
          
          // Find nearby nodes for connections
          const nearbyNodes = regionNodes.filter(n => {
            const distance = Math.sqrt((n.x - sourceNode.x) ** 2 + (n.y - sourceNode.y) ** 2);
            return distance < 25 && n.id !== sourceNode.id;
          });
          
          // Connect to 2-4 nearby nodes
          const connectionsCount = Math.min(2 + Math.floor(Math.random() * 3), nearbyNodes.length);
          for (let j = 0; j < connectionsCount; j++) {
            const targetNode = nearbyNodes[j];
            if (targetNode) {
              connections.push({
                source: sourceNode,
                target: targetNode,
                color: sourceNode.color,
                opacity: 0.1 + Math.random() * 0.2,
                width: 0.3 + Math.random() * 0.2
              });
            }
          }
        }
      });

      // Create inter-regional connections (corpus callosum, long-range)
      for (let i = 0; i < regions.length - 1; i++) {
        for (let j = i + 1; j < regions.length; j++) {
          const region1Nodes = nodes.filter(n => n.region === i);
          const region2Nodes = nodes.filter(n => n.region === j);
          
          // Create sparse long-range connections
          const connectionCount = Math.min(500, Math.min(region1Nodes.length, region2Nodes.length) / 20);
          
          for (let k = 0; k < connectionCount; k++) {
            const source = region1Nodes[Math.floor(Math.random() * region1Nodes.length)];
            const target = region2Nodes[Math.floor(Math.random() * region2Nodes.length)];
            
            if (source && target) {
              connections.push({
                source: source,
                target: target,
                color: colors.neural,
                opacity: 0.05 + Math.random() * 0.1,
                width: 0.2 + Math.random() * 0.15
              });
            }
          }
        }
      }

      console.log(`Generated ${connections.length} neural connections`);

      // Render connections first (background layer)
      const connectionGroup = svg.append('g').attr('class', 'connections');
      
      // Batch render connections for performance
      const connectionPaths = connectionGroup.selectAll('line')
        .data(connections.slice(0, 50000)) // Limit to 50k visible connections for performance
        .enter()
        .append('line')
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y)
        .attr('stroke', d => d.color)
        .attr('stroke-width', d => d.width)
        .attr('stroke-opacity', 0)
        .attr('filter', 'url(#connectionGlow)');

      // Render nodes in batches for performance
      const nodeGroup = svg.append('g').attr('class', 'nodes');
      
      // Render high-importance nodes (cores and synapses)
      const importantNodes = nodes.filter(n => n.color === colors.core || n.color === colors.synapse);
      const importantCircles = nodeGroup.selectAll('.important-node')
        .data(importantNodes)
        .enter()
        .append('circle')
        .attr('class', 'important-node')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y)
        .attr('r', d => d.size)
        .attr('fill', d => d.color)
        .attr('opacity', 0)
        .attr('filter', 'url(#glow)');

      // Render regular nodes in batches
      const batchSize = 20000;
      const regularNodes = nodes.filter(n => n.color !== colors.core && n.color !== colors.synapse);
      
      for (let i = 0; i < regularNodes.length; i += batchSize) {
        const batch = regularNodes.slice(i, i + batchSize);
        
        nodeGroup.selectAll(`.node-batch-${i}`)
          .data(batch)
          .enter()
          .append('circle')
          .attr('class', `node-batch-${i}`)
          .attr('cx', d => d.x)
          .attr('cy', d => d.y)
          .attr('r', d => d.size)
          .attr('fill', d => d.color)
          .attr('opacity', 0);
      }

      // Animate the brain coming alive
      setTimeout(() => {
        // Animate connections appearing in waves
        connectionPaths.transition()
          .duration(4000)
          .delay((d, i) => i * 0.1)
          .attr('stroke-opacity', d => d.opacity);

        // Animate important nodes first
        importantCircles.transition()
          .duration(2000)
          .delay((d, i) => i * 2)
          .attr('opacity', d => d.opacity);

        // Animate regular nodes in regional waves
        regions.forEach((region, regionIndex) => {
          setTimeout(() => {
            svg.selectAll('circle')
              .filter((d: any) => d && d.region === regionIndex)
              .transition()
              .duration(1500)
              .attr('opacity', (d: any) => d.opacity);
          }, regionIndex * 300);
        });

        // Add continuous neural activity pulses
        setInterval(() => {
          // Random neural firing across regions
          const randomRegion = Math.floor(Math.random() * regions.length);
          const regionCenter = regions[randomRegion].center;
          
          // Create expanding pulse
          const pulse = svg.append('circle')
            .attr('cx', regionCenter.x)
            .attr('cy', regionCenter.y)
            .attr('r', 5)
            .attr('fill', 'none')
            .attr('stroke', colors.core)
            .attr('stroke-width', 2)
            .attr('stroke-opacity', 0.8)
            .attr('filter', 'url(#glow)');

          pulse.transition()
            .duration(1500)
            .attr('r', 60)
            .attr('stroke-opacity', 0)
            .remove();
        }, 800);

      }, 1000);

      // Add brain region labels
      const labels = [
        { x: leftCenter.x, y: height * 0.25, text: 'L-Cortex', color: colors.core },
        { x: rightCenter.x, y: height * 0.25, text: 'R-Cortex', color: colors.core },
        { x: corpus.x, y: height * 0.45, text: 'Corpus', color: colors.synapse },
        { x: width * 0.5, y: height * 0.85, text: 'Stem', color: colors.neural }
      ];

      labels.forEach((label, i) => {
        setTimeout(() => {
          svg.append('text')
            .attr('x', label.x)
            .attr('y', label.y)
            .attr('text-anchor', 'middle')
            .attr('fill', label.color)
            .attr('font-size', '11px')
            .attr('font-weight', 'bold')
            .attr('filter', 'url(#glow)')
            .attr('opacity', 0)
            .text(label.text)
            .transition()
            .duration(1000)
            .attr('opacity', 0.8);
        }, 3000 + i * 200);
      });

      // Add statistics
      svg.append('text')
        .attr('x', 20)
        .attr('y', 30)
        .attr('fill', colors.core)
        .attr('font-size', '14px')
        .attr('font-weight', 'bold')
        .attr('filter', 'url(#glow)')
        .text('Neural Hive Mind');

      svg.append('text')
        .attr('x', 20)
        .attr('y', 50)
        .attr('fill', '#888888')
        .attr('font-size', '11px')
        .text(`${nodes.length.toLocaleString()} neurons • ${connections.length.toLocaleString()} synapses • Live activity`);

      console.log('Massive hive mind brain visualization complete');
    }
  }, [activeTab]);

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

              <button
                onClick={() => { setActiveTab('ecosystem'); setIsMobileSidebarOpen(false); }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all font-semibold ${
                  activeTab === 'ecosystem' 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 shadow-lg shadow-emerald-500/20' 
                    : 'text-gray-300 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 border border-transparent'
                }`}
              >
                <Globe className="w-5 h-5" />
                <span className="font-medium">Nomad Ecosystem</span>
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
                  <div className="relative group">
                    <Button 
                      variant="outline" 
                      className={`text-xs lg:text-sm px-3 lg:px-4 py-2 ${
                        user?.subscriptionStatus === 'active' 
                          ? 'border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white' 
                          : 'border-gray-700 text-gray-500 bg-gray-800/50 cursor-not-allowed'
                      }`}
                      disabled={user?.subscriptionStatus !== 'active'}
                      onClick={() => {
                        if (user?.subscriptionStatus === 'active') {
                          // Handle save functionality here
                          console.log('Saving fleet configuration...');
                          toast({
                            title: "Fleet Saved",
                            description: "Your fleet configuration has been saved successfully.",
                          });
                        } else {
                          toast({
                            title: "Upgrade Required",
                            description: "Save functionality requires a paid subscription. Upgrade to Nomad, Pioneer, or Sovereign plan.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <Save className="w-3 h-3 lg:w-4 lg:h-4 mr-1 lg:mr-2" />
                      {user?.subscriptionStatus === 'active' ? 'Save' : 'Save (Pro)'}
                    </Button>
                    {user?.subscriptionStatus !== 'active' && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-gray-200 text-xs rounded-lg border border-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10">
                        Upgrade to save fleet configurations
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    )}
                  </div>
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
                            <span className="text-gray-400"># of Tools:</span>
                            <span className="text-blue-400 font-semibold">
                              {key === 'sales-domination' ? '247' : 
                               key === 'customer-success' ? '312' : 
                               key === 'product-innovation' ? '289' : 
                               key === 'compliance-governance' ? '358' : 
                               key === 'enterprise-saas' ? '487' : 
                               key === 'corporation-big-bull' ? '623' : '180'}
                            </span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-400">Complexity:</span>
                            <span className="text-emerald-400 font-semibold">
                              {template.agents.length > 15 ? 'High' : template.agents.length > 10 ? 'Medium' : 'Low'}
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
                  <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-4">
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
                        type: 'Director', 
                        icon: '🎯', 
                        color: 'from-violet-400/80 via-purple-400/80 to-indigo-400/80',
                        bgColor: 'bg-violet-500/10',
                        borderColor: 'border-violet-400/30',
                        description: 'Division leadership & alignment',
                        level: 'Director'
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
                            <span className="text-gray-400">Director Span</span>
                            <span className="text-white">
                              {departmentCount['Director'] > 0 ? 'Strategic' : 'Limited'}
                            </span>
                          </div>
                          <div className="w-full bg-gray-700 rounded-full h-1.5 lg:h-2">
                            <div 
                              className="bg-gradient-to-r from-violet-500 to-purple-500 h-1.5 lg:h-2 rounded-full transition-all duration-500"
                              style={{ width: departmentCount['Director'] > 0 ? '100%' : '30%' }}
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

          {activeTab === 'ecosystem' && (
            <div className="space-y-6">
              {/* Ecosystem Header */}
              <div className="mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-2">Nomad Ecosystem</h2>
                <p className="text-gray-400">Real-time visualization of agent performance data using Voronoi stippling</p>
              </div>

              {/* Ecosystem Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">Total Agents</p>
                        <p className="text-2xl font-bold text-white">{mockAgents.length}</p>
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
                        <p className="text-2xl font-bold text-white">
                          {mockAgents.reduce((sum: number, agent: any) => sum + agent.runs, 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <Activity className="w-5 h-5 text-blue-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">Success Rate</p>
                        <p className="text-2xl font-bold text-white">
                          {(mockAgents.reduce((sum: number, agent: any) => sum + agent.success, 0) / mockAgents.length).toFixed(1)}%
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-green-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">Total Revenue</p>
                        <p className="text-2xl font-bold text-white">
                          ${mockAgents.reduce((sum: number, agent: any) => sum + agent.revenue, 0).toLocaleString()}
                        </p>
                      </div>
                      <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-purple-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Voronoi Stippling Visualization */}
              <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-2">Agent Performance Ecosystem</h3>
                      <p className="text-gray-400 text-sm">
                        Voronoi stippling visualization where each dot represents an agent, sized by total runs and colored by performance metrics
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                        <span className="text-xs text-gray-400">High Performance</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="text-xs text-gray-400">Medium Performance</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span className="text-xs text-gray-400">Low Performance</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* D3 Visualization Container */}
                  <div 
                    id="voronoi-ecosystem" 
                    className="w-full bg-black/40 rounded-lg border border-gray-700/50 overflow-hidden"
                    style={{ height: '500px', minHeight: '500px' }}
                  />
                </CardContent>
              </Card>

              {/* Agent Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockAgents.slice(0, 6).map((agent, index) => (
                  <Card key={index} className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-white">{agent.name}</h4>
                        <Badge 
                          className={`text-xs px-2 py-1 ${
                            agent.status === 'Active' 
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' 
                              : agent.status === 'Paused'
                              ? 'bg-yellow-500/20 text-yellow-300 border-yellow-400/40'
                              : 'bg-red-500/20 text-red-300 border-red-400/40'
                          }`}
                        >
                          {agent.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-400">Runs:</span>
                          <p className="text-white font-semibold">{agent.runs.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Success:</span>
                          <p className="text-emerald-400 font-semibold">{agent.success}%</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Revenue:</span>
                          <p className="text-white font-semibold">${agent.revenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <span className="text-gray-400">Type:</span>
                          <p className="text-gray-300">{agent.type}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Agent Details Panel - Slides in from right when agent is clicked */}
      {isAgentDetailsOpen && selectedAgent && (
        <div className="fixed inset-0 z-50 lg:inset-auto lg:right-0 lg:top-0 lg:w-96 lg:h-full">
          {/* Mobile overlay */}
          <div 
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsAgentDetailsOpen(false)}
          />
          
          {/* Details panel */}
          <div className="relative bg-gradient-to-b from-gray-900/95 to-black/95 h-full w-full lg:w-96 border-l border-emerald-500/30 backdrop-blur-lg shadow-2xl shadow-emerald-500/10 overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gray-900/80 backdrop-blur-md border-b border-emerald-500/20 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{selectedAgent.icon}</div>
                  <div>
                    <h3 className="font-bold text-white">{selectedAgent.type}</h3>
                    <p className="text-sm text-emerald-300">{selectedAgent.level}</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAgentDetailsOpen(false)}
                  className="w-8 h-8 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 space-y-6">
              {/* Description */}
              <div>
                <h4 className="font-semibold text-white mb-2">Overview</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {selectedAgent.description || `${selectedAgent.type} specializes in automated task execution and workflow optimization within organizational hierarchies.`}
                </p>
              </div>

              {/* Performance Metrics */}
              <div>
                <h4 className="font-semibold text-white mb-3">Performance Metrics</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-800/40 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Uptime</div>
                    <div className="text-lg font-bold text-emerald-400">
                      {selectedAgent.performance?.uptime.toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-gray-800/40 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Success Rate</div>
                    <div className="text-lg font-bold text-emerald-400">
                      {selectedAgent.performance?.successRate.toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-gray-800/40 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Tasks Done</div>
                    <div className="text-lg font-bold text-white">
                      {selectedAgent.performance?.tasksCompleted.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-gray-800/40 rounded-lg p-3">
                    <div className="text-xs text-gray-400 mb-1">Avg Response</div>
                    <div className="text-lg font-bold text-white">
                      {selectedAgent.performance?.avgResponseTime}ms
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary Tasks */}
              <div>
                <h4 className="font-semibold text-white mb-3">Primary Tasks</h4>
                <div className="space-y-2">
                  {selectedAgent.tasks?.map((task: string, index: number) => (
                    <div key={index} className="flex items-start space-x-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-300">{task}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Toolkit */}
              <div>
                <h4 className="font-semibold text-white mb-3">Available Tools</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedAgent.toolkit?.map((tool: string, index: number) => (
                    <div key={index} className="bg-gray-800/30 rounded-md px-2 py-1.5 text-xs text-emerald-300 border border-emerald-500/20">
                      {tool}
                    </div>
                  ))}
                </div>
              </div>

              {/* System Connections */}
              <div>
                <h4 className="font-semibold text-white mb-3">System Connections</h4>
                <div className="space-y-2">
                  {selectedAgent.connections?.map((connection: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0" />
                      <span className="text-gray-300">{connection}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Energy Efficiency */}
              <div>
                <h4 className="font-semibold text-white mb-3">Energy Efficiency</h4>
                <div className="bg-gray-800/40 rounded-lg p-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-400">Current Efficiency</span>
                    <span className="text-sm font-semibold text-emerald-400">
                      {selectedAgent.performance?.energyEfficiency.toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${selectedAgent.performance?.energyEfficiency}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Department Badge */}
              {selectedAgent.departmentId && (
                <div>
                  <h4 className="font-semibold text-white mb-2">Department</h4>
                  <div className="inline-block px-3 py-1.5 bg-purple-600/20 text-purple-300 text-sm rounded-md border border-purple-400/30">
                    {selectedAgent.departmentId}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}