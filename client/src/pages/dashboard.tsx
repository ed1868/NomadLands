import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Download
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

// Mock data for KPIs - in real app would come from API
const mockRevenue = [
  { month: 'Jan', revenue: 2400, contracts: 14 },
  { month: 'Feb', revenue: 1398, contracts: 18 },
  { month: 'Mar', revenue: 9800, contracts: 24 },
  { month: 'Apr', revenue: 3908, contracts: 28 },
  { month: 'May', revenue: 4800, contracts: 35 },
  { month: 'Jun', revenue: 3800, contracts: 42 }
];

const mockAgentPerformance = [
  { name: 'Email Classifier', runs: 1240, success: 98, revenue: 2400 },
  { name: 'Cloud Manager', runs: 890, success: 95, revenue: 3200 },
  { name: 'Data Processor', runs: 567, success: 97, revenue: 1800 },
  { name: 'Security Monitor', runs: 234, success: 99, revenue: 4200 }
];

const COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];

export default function Dashboard() {
  const { user, isLoading } = useAuth();
  const { isConnected, address, connectWallet } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: ''
  });

  // Fetch user's purchased agents
  const { data: userPurchases } = useQuery({
    queryKey: ["/api/user/purchases"],
    enabled: !!user
  });

  // Initialize profile data when user loads
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || ''
      });
    }
  }, [user]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: typeof profileData) => {
      const response = await apiRequest("PATCH", "/api/auth/profile", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      setIsEditingProfile(false);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive"
      });
    }
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

  const totalRevenue = mockRevenue.reduce((sum, month) => sum + month.revenue, 0);
  const totalContracts = mockRevenue.reduce((sum, month) => sum + month.contracts, 0);
  const activeAgents = Array.isArray(userPurchases) ? userPurchases.length : 0;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/95 to-black"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-emerald-300 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse delay-2000"></div>
        </div>
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-emerald-400/30 to-transparent"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-emerald-300/30 to-transparent"></div>
      </div>

      <Navigation />

      <div className="relative z-10 container mx-auto px-6 py-12 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Command Center</h1>
            <p className="text-gray-400">Manage your AI agents and monitor your performance</p>
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="bg-gray-900/50 border-gray-700">
              <TabsTrigger value="overview" className="data-[state=active]:bg-emerald-600">Overview</TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-emerald-600">Profile</TabsTrigger>
              <TabsTrigger value="agents" className="data-[state=active]:bg-emerald-600">My Agents</TabsTrigger>
              <TabsTrigger value="contracts" className="data-[state=active]:bg-emerald-600">Contracts</TabsTrigger>
              <TabsTrigger value="analytics" className="data-[state=active]:bg-emerald-600">Analytics</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">Active Agents</p>
                        <p className="text-3xl font-bold text-white">{activeAgents}</p>
                        <div className="flex items-center mt-2">
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                          <span className="text-emerald-500 text-sm ml-1">+12%</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                        <Bot className="w-6 h-6 text-emerald-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">Total Revenue</p>
                        <p className="text-3xl font-bold text-white">${totalRevenue.toLocaleString()}</p>
                        <div className="flex items-center mt-2">
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                          <span className="text-emerald-500 text-sm ml-1">+24%</span>
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
                        <p className="text-gray-400 text-sm font-medium">Active Contracts</p>
                        <p className="text-3xl font-bold text-white">{totalContracts}</p>
                        <div className="flex items-center mt-2">
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                          <span className="text-emerald-500 text-sm ml-1">+18%</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-emerald-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm font-medium">Success Rate</p>
                        <p className="text-3xl font-bold text-white">97.2%</p>
                        <div className="flex items-center mt-2">
                          <TrendingUp className="w-4 h-4 text-emerald-500" />
                          <span className="text-emerald-500 text-sm ml-1">+2.1%</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-emerald-500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Revenue Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={mockRevenue}>
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
                          dataKey="revenue" 
                          stroke="#10b981" 
                          fill="url(#emeraldGradient)" 
                        />
                        <defs>
                          <linearGradient id="emeraldGradient" x1="0" y1="0" x2="0" y2="1">
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
                    <CardTitle className="text-white">Agent Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <RechartsPieChart>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#1f2937', 
                            border: '1px solid #374151',
                            borderRadius: '8px'
                          }} 
                        />
                        <Pie
                          data={mockAgentPerformance}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="revenue"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {mockAgentPerformance.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Info */}
                <Card className="lg:col-span-2 bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white">Profile Information</CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditingProfile(!isEditingProfile)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        {isEditingProfile ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                        {isEditingProfile ? 'Cancel' : 'Edit'}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center space-x-4 mb-6">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={user.profileImageUrl || ''} />
                        <AvatarFallback className="bg-emerald-600 text-white text-xl">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {user.firstName} {user.lastName}
                        </h3>
                        <p className="text-gray-400">{user.email}</p>
                        <Badge variant="outline" className="mt-2 border-emerald-500 text-emerald-400">
                          {user.subscriptionPlan} Plan
                        </Badge>
                      </div>
                    </div>

                    {isEditingProfile ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                          <Input
                            id="firstName"
                            value={profileData.firstName}
                            onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                            className="bg-gray-800/50 border-gray-600 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                          <Input
                            id="lastName"
                            value={profileData.lastName}
                            onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                            className="bg-gray-800/50 border-gray-600 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email" className="text-gray-300">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            className="bg-gray-800/50 border-gray-600 text-white"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phoneNumber" className="text-gray-300">Phone Number</Label>
                          <Input
                            id="phoneNumber"
                            value={profileData.phoneNumber}
                            onChange={(e) => setProfileData({...profileData, phoneNumber: e.target.value})}
                            className="bg-gray-800/50 border-gray-600 text-white"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <Button
                            onClick={() => updateProfileMutation.mutate(profileData)}
                            disabled={updateProfileMutation.isPending}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            <Save className="w-4 h-4 mr-2" />
                            {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-gray-400">First Name</Label>
                          <p className="text-white">{user.firstName || 'Not set'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Last Name</Label>
                          <p className="text-white">{user.lastName || 'Not set'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Email</Label>
                          <p className="text-white">{user.email || 'Not set'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Phone Number</Label>
                          <p className="text-white">{user.phoneNumber || 'Not set'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Member Since</Label>
                          <p className="text-white">{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}</p>
                        </div>
                        <div>
                          <Label className="text-gray-400">Last Login</Label>
                          <p className="text-white">{user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Wallet Info */}
                <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center">
                      <Wallet className="w-5 h-5 mr-2" />
                      Wallet Details
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isConnected ? (
                      <div>
                        <Label className="text-gray-400">Connected Wallet</Label>
                        <p className="text-white font-mono text-sm break-all">
                          {address}
                        </p>
                        <Badge variant="outline" className="mt-2 border-emerald-500 text-emerald-400">
                          Connected
                        </Badge>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <Wallet className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">No wallet connected</p>
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
            </TabsContent>

            {/* Agents Tab */}
            <TabsContent value="agents" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">My Deployed Agents</h3>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <Upload className="w-4 h-4 mr-2" />
                  Deploy New Agent
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.isArray(userPurchases) && userPurchases.length > 0 ? (
                  userPurchases.map((purchase: any) => (
                    <Card key={purchase.id} className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm hover:border-emerald-500/50 transition-colors">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-white text-lg">{purchase.agent.name}</CardTitle>
                          <Badge variant="outline" className="border-emerald-500 text-emerald-400">
                            Active
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-400 text-sm mb-4">{purchase.agent.description}</p>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Runs Today:</span>
                            <span className="text-white">127</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Success Rate:</span>
                            <span className="text-emerald-400">98.4%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-400">Revenue:</span>
                            <span className="text-white">$2,340</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1 border-gray-600 hover:bg-gray-800">
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 border-gray-600 hover:bg-gray-800">
                            <Settings className="w-4 h-4 mr-1" />
                            Config
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-300 mb-2">No Agents Deployed</h3>
                    <p className="text-gray-500 mb-6">Deploy your first AI agent to get started</p>
                    <Button className="bg-emerald-600 hover:bg-emerald-700">
                      Browse Marketplace
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Contracts Tab */}
            <TabsContent value="contracts" className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-white">Smart Contracts</h3>
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <FileText className="w-4 h-4 mr-2" />
                  New Contract
                </Button>
              </div>

              <div className="space-y-4">
                {[
                  { id: 1, name: 'Agent Revenue Share', status: 'Active', value: '5.2 ETH', expires: '2025-12-01' },
                  { id: 2, name: 'Data Processing License', status: 'Pending', value: '2.8 ETH', expires: '2025-08-15' },
                  { id: 3, name: 'API Access Rights', status: 'Active', value: '1.5 ETH', expires: '2025-10-30' },
                ].map((contract) => (
                  <Card key={contract.id} className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-emerald-500/10 rounded-lg flex items-center justify-center">
                            <FileText className="w-6 h-6 text-emerald-500" />
                          </div>
                          <div>
                            <h4 className="text-white font-semibold">{contract.name}</h4>
                            <p className="text-gray-400 text-sm">Expires: {contract.expires}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-white font-semibold">{contract.value}</p>
                            <Badge 
                              variant="outline" 
                              className={
                                contract.status === 'Active' 
                                  ? "border-emerald-500 text-emerald-400"
                                  : "border-yellow-500 text-yellow-400"
                              }
                            >
                              {contract.status}
                            </Badge>
                          </div>
                          <Button variant="outline" size="sm" className="border-gray-600 hover:bg-gray-800">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <h3 className="text-2xl font-bold text-white">Performance Analytics</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Agent Rankings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockAgentPerformance.map((agent, index) => (
                        <div key={agent.name} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-emerald-500/10 rounded-full flex items-center justify-center">
                              <span className="text-emerald-400 font-semibold">#{index + 1}</span>
                            </div>
                            <div>
                              <p className="text-white font-medium">{agent.name}</p>
                              <p className="text-gray-400 text-sm">{agent.runs} runs</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-white font-semibold">${agent.revenue}</p>
                            <p className="text-emerald-400 text-sm">{agent.success}% success</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-white">Monthly Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={mockRevenue}>
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
                        <Bar dataKey="contracts" fill="#10b981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}