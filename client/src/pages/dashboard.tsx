import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useWallet } from "@/hooks/use-wallet";
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
  Coins
} from "lucide-react";
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

  // Fetch user's purchased agents
  const { data: userPurchases } = useQuery({
    queryKey: ["/api/user/purchases"],
    enabled: !!user
  });

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
        <div className="flex items-center justify-between px-8 py-4">
          {/* Left - Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AN</span>
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">AI Nomads</span>
          </div>

          {/* Center - Navigation Tabs */}
          <nav className="flex items-center space-x-1">
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

          {/* Right - User Menu */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-10 h-10 border border-gray-700/50">
              <AvatarImage src={user.profileImageUrl || ''} />
              <AvatarFallback className="bg-transparent text-gray-400 border-0">
                {user.firstName?.[0] || 'U'}{user.lastName?.[0] || 'S'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="flex pt-16">
        {/* Left Sidebar */}
        <div className="w-80 min-h-screen bg-transparent backdrop-blur-sm">
          <div className="p-6">
            {/* Navigation Tabs */}
            <nav className="space-y-2 mt-4">
              <button
                onClick={() => setActiveTab('wallet')}
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
                onClick={() => setActiveTab('nomad')}
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
                onClick={() => setActiveTab('contracts')}
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
                onClick={() => setActiveTab('agents')}
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
                onClick={() => setActiveTab('performance')}
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
                onClick={() => setActiveTab('fleet')}
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
        <div className="flex-1 p-8 bg-gradient-to-br from-gray-950/30 via-black/20 to-gray-900/40">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Dashboard</h1>
              <p className="text-gray-300 font-medium">Manage your AI agents, contracts, and files in the Nomad Lands ecosystem</p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="border-gray-600/50 text-gray-300 hover:bg-gray-800/60 hover:border-gray-500 font-semibold">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 text-white shadow-lg shadow-emerald-500/20 font-semibold border-0">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Content based on active tab */}
          {activeTab === 'wallet' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Account Information */}
                <Card className="bg-gradient-to-br from-gray-950/80 via-black/60 to-gray-900/80 border-gray-700/30 backdrop-blur-lg shadow-xl">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center font-bold text-lg tracking-tight">
                      <User className="w-5 h-5 mr-2 text-emerald-400" />
                      Account Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
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
            <div className="space-y-8">
              {/* Fleet Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold text-white tracking-tight">Fleet Management</h2>
                  <p className="text-gray-300 mt-2">Build and orchestrate enterprise-scale agent networks</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                    <Bot className="w-4 h-4 mr-2" />
                    Add Agent
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    Save Fleet
                  </Button>
                </div>
              </div>

              {/* Agent Palette */}
              <Card className="bg-gradient-to-br from-gray-950/80 via-black/60 to-gray-900/80 border-gray-700/30 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-white font-bold">Agent Types</CardTitle>
                  <p className="text-gray-400 text-sm">Drag agents onto the canvas to build your fleet</p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-4">
                    {[
                      { type: 'Agent Boss', icon: '👑', color: 'from-purple-500 to-purple-600', description: 'Orchestrates team workflows' },
                      { type: 'Agent Worker', icon: '⚡', color: 'from-blue-500 to-blue-600', description: 'Executes specific tasks' },
                      { type: 'Agent LLC', icon: '🏢', color: 'from-green-500 to-green-600', description: 'Manages business logic' },
                      { type: 'Agent Data', icon: '📊', color: 'from-orange-500 to-orange-600', description: 'Handles data processing' },
                    ].map((agent, index) => (
                      <div
                        key={index}
                        className={`p-4 rounded-lg bg-gradient-to-br ${agent.color} cursor-move hover:scale-105 transition-transform border border-white/10`}
                        draggable
                      >
                        <div className="text-2xl mb-2 text-center">{agent.icon}</div>
                        <h3 className="text-white font-semibold text-sm text-center">{agent.type}</h3>
                        <p className="text-white/80 text-xs text-center mt-1">{agent.description}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Fleet Canvas */}
              <Card className="bg-gradient-to-br from-gray-950/80 via-black/60 to-gray-900/80 border-gray-700/30 backdrop-blur-lg">
                <CardHeader>
                  <CardTitle className="text-white font-bold">Fleet Canvas</CardTitle>
                  <p className="text-gray-400 text-sm">Design your agent network topology</p>
                </CardHeader>
                <CardContent>
                  <div 
                    className="relative bg-gray-900/50 rounded-lg border-2 border-dashed border-gray-600/50 min-h-[600px] p-8"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 20px 20px, rgba(75, 85, 99, 0.3) 1px, transparent 0)',
                      backgroundSize: '40px 40px'
                    }}
                  >
                    {/* Sample Fleet Network */}
                    <div className="absolute top-20 left-20">
                      <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-4 rounded-lg border border-white/20 shadow-lg min-w-[180px]">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">👑</span>
                          <div>
                            <h3 className="text-white font-semibold">Agent Boss</h3>
                            <p className="text-white/80 text-xs">main_orchestrator</p>
                          </div>
                        </div>
                      </div>
                      {/* Connection line */}
                      <svg className="absolute top-1/2 left-full" width="100" height="2">
                        <line x1="0" y1="0" x2="100" y2="0" stroke="#10b981" strokeWidth="2" />
                        <circle cx="100" cy="0" r="3" fill="#10b981" />
                      </svg>
                    </div>

                    <div className="absolute top-20 left-80">
                      <div className="bg-gradient-to-br from-green-500 to-green-600 p-4 rounded-lg border border-white/20 shadow-lg min-w-[180px]">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">🏢</span>
                          <div>
                            <h3 className="text-white font-semibold">Agent LLC</h3>
                            <p className="text-white/80 text-xs">business_logic</p>
                          </div>
                        </div>
                      </div>
                      {/* Connection lines */}
                      <svg className="absolute top-1/2 left-full" width="100" height="2">
                        <line x1="0" y1="0" x2="100" y2="0" stroke="#10b981" strokeWidth="2" />
                        <circle cx="100" cy="0" r="3" fill="#10b981" />
                      </svg>
                      <svg className="absolute top-full left-1/2 -translate-x-1/2" width="2" height="100">
                        <line x1="0" y1="0" x2="0" y2="100" stroke="#10b981" strokeWidth="2" />
                        <circle cx="0" cy="100" r="3" fill="#10b981" />
                      </svg>
                    </div>

                    <div className="absolute top-20 left-[540px]">
                      <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-4 rounded-lg border border-white/20 shadow-lg min-w-[180px]">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">📊</span>
                          <div>
                            <h3 className="text-white font-semibold">Agent Data</h3>
                            <p className="text-white/80 text-xs">data_processor</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-60 left-80">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg border border-white/20 shadow-lg min-w-[180px]">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">⚡</span>
                          <div>
                            <h3 className="text-white font-semibold">Agent Worker</h3>
                            <p className="text-white/80 text-xs">task_executor</p>
                          </div>
                        </div>
                      </div>
                      {/* Connection line */}
                      <svg className="absolute top-1/2 left-full" width="100" height="2">
                        <line x1="0" y1="0" x2="100" y2="0" stroke="#10b981" strokeWidth="2" />
                        <circle cx="100" cy="0" r="3" fill="#10b981" />
                      </svg>
                    </div>

                    <div className="absolute top-60 left-[540px]">
                      <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-4 rounded-lg border border-white/20 shadow-lg min-w-[180px]">
                        <div className="flex items-center space-x-3">
                          <span className="text-2xl">⚡</span>
                          <div>
                            <h3 className="text-white font-semibold">Agent Worker</h3>
                            <p className="text-white/80 text-xs">api_handler</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Canvas Instructions */}
                    <div className="absolute bottom-8 left-8 text-gray-400 text-sm">
                      <p>💡 Drag agents from the palette above to build your fleet</p>
                      <p>🔗 Click and drag between agents to create connections</p>
                      <p>⚙️ Double-click agents to configure their properties</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Fleet Configuration */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gradient-to-br from-gray-950/80 via-black/60 to-gray-900/80 border-gray-700/30 backdrop-blur-lg">
                  <CardHeader>
                    <CardTitle className="text-white font-bold">Fleet Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-gray-300 text-sm font-medium">Fleet Name</label>
                      <input 
                        type="text" 
                        className="w-full mt-1 bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white"
                        placeholder="Enterprise Data Pipeline"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm font-medium">Description</label>
                      <textarea 
                        className="w-full mt-1 bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white h-24"
                        placeholder="Automated enterprise data processing and analysis fleet"
                      />
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm font-medium">Execution Mode</label>
                      <select className="w-full mt-1 bg-gray-800/50 border border-gray-600 rounded-lg px-3 py-2 text-white">
                        <option>Sequential</option>
                        <option>Parallel</option>
                        <option>Event-Driven</option>
                      </select>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-gray-950/80 via-black/60 to-gray-900/80 border-gray-700/30 backdrop-blur-lg">
                  <CardHeader>
                    <CardTitle className="text-white font-bold">Fleet Metrics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-800/30 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm">Active Agents</p>
                        <p className="text-2xl font-bold text-emerald-400">5</p>
                      </div>
                      <div className="bg-gray-800/30 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm">Connections</p>
                        <p className="text-2xl font-bold text-blue-400">4</p>
                      </div>
                      <div className="bg-gray-800/30 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm">Est. Cost/Hour</p>
                        <p className="text-2xl font-bold text-yellow-400">$2.40</p>
                      </div>
                      <div className="bg-gray-800/30 p-4 rounded-lg">
                        <p className="text-gray-400 text-sm">Complexity</p>
                        <p className="text-2xl font-bold text-purple-400">Medium</p>
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