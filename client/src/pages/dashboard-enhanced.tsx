import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Activity, 
  TrendingUp, 
  Users, 
  Bot, 
  DollarSign, 
  Clock, 
  BarChart3, 
  Target,
  Zap,
  Globe,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Settings,
  Bell
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Mock data for analytics - in production this would come from APIs
const performanceData = [
  { date: "Jan 1", agents: 12, revenue: 2400, efficiency: 85 },
  { date: "Jan 8", agents: 19, revenue: 1398, efficiency: 78 },
  { date: "Jan 15", agents: 23, revenue: 9800, efficiency: 92 },
  { date: "Jan 22", agents: 27, revenue: 3908, efficiency: 88 },
  { date: "Jan 29", agents: 31, revenue: 4800, efficiency: 95 },
  { date: "Feb 5", agents: 35, revenue: 3800, efficiency: 90 },
  { date: "Feb 12", agents: 42, revenue: 4300, efficiency: 87 },
];

const agentCategoryData = [
  { name: "Data Processing", value: 35, color: "#10b981" },
  { name: "Content Creation", value: 25, color: "#3b82f6" },
  { name: "Analytics", value: 20, color: "#8b5cf6" },
  { name: "Automation", value: 15, color: "#f59e0b" },
  { name: "Security", value: 5, color: "#ef4444" },
];

const recentActivities = [
  {
    id: 1,
    type: "agent_deployed",
    title: "Crypto Analytics Agent",
    time: "2 minutes ago",
    status: "success",
    impact: "+$125 revenue"
  },
  {
    id: 2,
    type: "performance_alert",
    title: "High Traffic Detected",
    time: "5 minutes ago",
    status: "warning",
    impact: "98% capacity"
  },
  {
    id: 3,
    type: "agent_optimized",
    title: "Email Classifier v2.1",
    time: "1 hour ago",
    status: "success",
    impact: "+12% efficiency"
  },
  {
    id: 4,
    type: "system_update",
    title: "Security Patch Applied",
    time: "3 hours ago",
    status: "info",
    impact: "All systems secure"
  },
];

const topAgents = [
  {
    id: 1,
    name: "Blockchain Analyzer Pro",
    category: "Analytics",
    runs: 2547,
    revenue: 12400,
    efficiency: 94,
    trend: "up"
  },
  {
    id: 2,
    name: "Content Generator Elite",
    category: "Content",
    runs: 1823,
    revenue: 8900,
    efficiency: 91,
    trend: "up"
  },
  {
    id: 3,
    name: "Data Pipeline Master",
    category: "Processing",
    runs: 3421,
    revenue: 15600,
    efficiency: 89,
    trend: "down"
  },
  {
    id: 4,
    name: "Security Sentinel",
    category: "Security",
    runs: 956,
    revenue: 7200,
    efficiency: 96,
    trend: "up"
  },
];

export default function DashboardEnhanced() {
  const [timeRange, setTimeRange] = useState("7d");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Get user data
  const { data: user } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  // Get user purchases/agents
  const { data: userPurchases, isLoading: isPurchasesLoading } = useQuery({
    queryKey: ["/api/user/purchases"],
    enabled: !!user,
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1500);
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Bot className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
          <p className="text-gray-400">Please log in to access your dashboard</p>
          <Button asChild className="mt-4">
            <a href="/signup">Sign In</a>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      {/* Header */}
      <div className="border-b border-gray-800 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">
                Welcome back, {user.firstName || user.username || 'Nomad'}
              </h1>
              <p className="text-gray-400 text-sm">
                Monitor your AI agents and track performance metrics
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32 bg-slate-800 border-gray-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-gray-700">
                  <SelectItem value="24h">24 Hours</SelectItem>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="border-gray-700 hover:bg-slate-800"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" className="border-gray-700 hover:bg-slate-800">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-slate-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Active Agents</p>
                  <p className="text-2xl font-bold text-white">
                    {userPurchases?.length || 0}
                  </p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-500 text-sm ml-1">+12%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                  <Bot className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Runs</p>
                  <p className="text-2xl font-bold text-white">24,847</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-blue-500" />
                    <span className="text-blue-500 text-sm ml-1">+8.2%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <Activity className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Revenue</p>
                  <p className="text-2xl font-bold text-white">$12,847</p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="w-4 h-4 text-purple-500" />
                    <span className="text-purple-500 text-sm ml-1">+15.3%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-6 h-6 text-purple-500" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-gray-800 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Efficiency</p>
                  <p className="text-2xl font-bold text-white">94.2%</p>
                  <div className="flex items-center mt-2">
                    <ArrowDownRight className="w-4 h-4 text-orange-500" />
                    <span className="text-orange-500 text-sm ml-1">-2.1%</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-slate-900/50 border border-gray-800">
            <TabsTrigger value="overview" className="data-[state=active]:bg-slate-800">
              Overview
            </TabsTrigger>
            <TabsTrigger value="agents" className="data-[state=active]:bg-slate-800">
              Agents
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-slate-800">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-slate-800">
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Chart */}
              <Card className="bg-slate-900/50 border-gray-800 backdrop-blur-sm lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Performance Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={performanceData}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9ca3af" />
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
                        dataKey="revenue"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#revenueGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Agent Categories */}
              <Card className="bg-slate-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    Agent Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={agentCategoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {agentCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {agentCategoryData.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-gray-300 text-sm">{item.name}</span>
                        </div>
                        <span className="text-white font-medium">{item.value}%</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="bg-slate-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${
                          activity.status === 'success' ? 'bg-emerald-500' :
                          activity.status === 'warning' ? 'bg-orange-500' :
                          activity.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium">{activity.title}</p>
                          <p className="text-gray-400 text-xs">{activity.time}</p>
                          <p className="text-emerald-400 text-xs mt-1">{activity.impact}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="agents" className="space-y-6">
            <Card className="bg-slate-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Top Performing Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topAgents.map((agent) => (
                    <div key={agent.id} className="flex items-center justify-between p-4 rounded-lg bg-slate-800/50 border border-gray-700">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <Bot className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-white font-medium">{agent.name}</h3>
                          <p className="text-gray-400 text-sm">{agent.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-right">
                          <p className="text-white font-medium">{agent.runs.toLocaleString()}</p>
                          <p className="text-gray-400 text-sm">Runs</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-medium">${agent.revenue.toLocaleString()}</p>
                          <p className="text-gray-400 text-sm">Revenue</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            <span className="text-white font-medium">{agent.efficiency}%</span>
                            {agent.trend === 'up' ? 
                              <ArrowUpRight className="w-4 h-4 text-emerald-500" /> :
                              <ArrowDownRight className="w-4 h-4 text-red-500" />
                            }
                          </div>
                          <p className="text-gray-400 text-sm">Efficiency</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-gray-700">
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">Usage Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Line type="monotone" dataKey="agents" stroke="#8884d8" strokeWidth={2} />
                      <Line type="monotone" dataKey="efficiency" stroke="#82ca9d" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-slate-900/50 border-gray-800 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white">System Health</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">CPU Usage</span>
                      <span className="text-white">67%</span>
                    </div>
                    <Progress value={67} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Memory</span>
                      <span className="text-white">45%</span>
                    </div>
                    <Progress value={45} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Storage</span>
                      <span className="text-white">78%</span>
                    </div>
                    <Progress value={78} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-300">Network</span>
                      <span className="text-white">34%</span>
                    </div>
                    <Progress value={34} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="bg-slate-900/50 border-gray-800 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Activity Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {recentActivities.concat(recentActivities).map((activity, index) => (
                    <div key={`${activity.id}-${index}`} className="flex items-start gap-4 p-4 rounded-lg bg-slate-800/30 border border-gray-700">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        activity.status === 'success' ? 'bg-emerald-500/20 text-emerald-500' :
                        activity.status === 'warning' ? 'bg-orange-500/20 text-orange-500' :
                        activity.status === 'error' ? 'bg-red-500/20 text-red-500' : 'bg-blue-500/20 text-blue-500'
                      }`}>
                        {activity.type === 'agent_deployed' ? <Bot className="w-4 h-4" /> :
                         activity.type === 'performance_alert' ? <Activity className="w-4 h-4" /> :
                         activity.type === 'agent_optimized' ? <Zap className="w-4 h-4" /> :
                         <Settings className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium">{activity.title}</h3>
                        <p className="text-gray-400 text-sm mt-1">{activity.time}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="secondary" className="bg-slate-700 text-gray-300">
                            {activity.type.replace('_', ' ')}
                          </Badge>
                          <span className="text-emerald-400 text-sm">{activity.impact}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}