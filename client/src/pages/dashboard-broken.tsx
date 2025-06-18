import { useEffect, useState, useRef } from "react";
import { useWallet } from "@/hooks/use-wallet";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  User, 
  Wallet, 
  ShoppingCart, 
  Activity, 
  Calendar, 
  ExternalLink,
  Download,
  Settings,
  Upload,
  FileText,
  Plus,
  Eye,
  Trash2,
  Users,
  Zap,
  Building2,
  Clock,
  Star,
  Shield,
  Code
} from "lucide-react";
import Navigation from "@/components/navigation";
import PhoneVerification from "@/components/phone-verification";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface PurchasedAgent {
  id: number;
  userId: string;
  agentId: number;
  transactionHash: string;
  blockNumber: number | null;
  purchasePrice: string;
  purchasedAt: string;
  agent: {
    id: number;
    name: string;
    description: string;
    category: string;
    price: number;
    priceInWei: string;
    icon: string;
    features: string[];
    gradientFrom: string;
    gradientTo: string;
    featured: boolean;
  };
}

export default function Dashboard() {
  const { address, isConnected, connectWallet } = useWallet();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Form states for agent upload
  const [agentName, setAgentName] = useState("");
  const [agentDescription, setAgentDescription] = useState("");
  const [agentCategory, setAgentCategory] = useState("");
  const [pricePerRun, setPricePerRun] = useState("");
  const [pricePerHour, setPricePerHour] = useState("");
  const [agentSkills, setAgentSkills] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { data: userPurchases, isLoading: purchasesLoading } = useQuery({
    queryKey: [`/api/user/${address}/purchases`],
    enabled: !!address && isConnected,
  });

  // Mock data for new features - will implement backend later
  const mockUserFiles = [
    {
      id: 1,
      fileName: "agent-config.json",
      fileType: "application/json",
      fileSize: 2048,
      category: "agent",
      description: "Configuration file for DataFlow Jenkins agent",
      createdAt: new Date().toISOString(),
    },
    {
      id: 2,
      fileName: "contract-terms.pdf",
      fileType: "application/pdf", 
      fileSize: 15360,
      category: "contract",
      description: "Terms and conditions for freelance work contract",
      createdAt: new Date().toISOString(),
    },
    {
      id: 3,
      fileName: "project-spec.md",
      fileType: "text/markdown",
      fileSize: 8192,
      category: "document",
      description: "Project specification and requirements",
      createdAt: new Date().toISOString(),
    }
  ];

  const mockUserAgents = [
    {
      id: 1,
      name: "DataFlow Jenkins",
      description: "Expert at ETL pipelines and data transformation",
      category: "Engineering",
      pricePerRun: "25000000000000000",
      pricePerHour: "100000000000000000",
      availability: "available",
      totalRuns: 247,
      rating: 5,
      earnings: "2.45 ETH",
    },
    {
      id: 2,
      name: "ContentCraft Maya",
      description: "Creative strategist for viral content creation",
      category: "Marketing",
      pricePerRun: "15000000000000000",
      pricePerHour: "75000000000000000",
      availability: "busy",
      totalRuns: 156,
      rating: 4,
      earnings: "1.87 ETH",
    }
  ];

  const mockContracts = [
    {
      id: 1,
      contractName: "Escrow Service Contract",
      partyA: "0x742d...0001",
      partyB: "0x8b3f...0002",
      amount: "0.5 ETH",
      taxAmount: "0.0125 ETH",
      status: "active",
      startTime: "2025-06-15T10:00:00Z",
      terms: "Web development project with milestone-based payments",
    },
    {
      id: 2,
      contractName: "Freelance Payment Contract",
      partyA: "0x742d...0001", 
      partyB: "0x9a4c...0003",
      amount: "1.2 ETH",
      taxAmount: "0.036 ETH",
      status: "completed",
      startTime: "2025-06-10T14:30:00Z",
      terms: "AI agent development and deployment services",
    }
  ];

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatEth = (wei: string) => {
    const eth = parseFloat(wei) / 1e18;
    return `${eth.toFixed(3)} ETH`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-500";
      case "completed": return "bg-blue-500";
      case "pending": return "bg-yellow-500";
      case "disputed": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case "available": return "bg-emerald-500";
      case "busy": return "bg-yellow-500";
      case "offline": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const { data: userProfile } = useQuery({
    queryKey: [`/api/auth/user/${address}`],
    enabled: !!address && isConnected,
  });

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <Wallet className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h1 className="text-2xl font-light text-gray-200 mb-4">Connect Your Wallet</h1>
            <p className="text-gray-400 font-extralight mb-8 max-w-md">
              Please connect your MetaMask wallet to access your AI agent dashboard and view your purchased agents.
            </p>
            <Button 
              onClick={connectWallet}
              className="bg-emerald-900/80 hover:bg-emerald-800/90 text-gray-200 border border-emerald-700/50"
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-20 sm:pt-24 pb-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-gray-200 mb-2">Dashboard</h1>
          <p className="text-gray-400 font-extralight">
            Manage your AI agents and view your blockchain transactions
          </p>
        </div>

        {/* User Info Card */}
        <Card className="bg-black/40 border-gray-800 mb-6">
          <CardHeader>
            <CardTitle className="text-gray-200 font-light flex items-center">
              <User className="w-5 h-5 mr-2" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-400 text-sm font-extralight mb-1">Wallet Address</p>
                <p className="text-gray-200 font-mono text-sm break-all">{address}</p>
              </div>
              <div>
                <p className="text-gray-400 text-sm font-extralight mb-1">Total Agents Owned</p>
                <p className="text-gray-200 text-lg font-light">
                  {Array.isArray(userPurchases) ? userPurchases.length : 0}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phone Verification Card */}
        <div className="mb-8">
          <PhoneVerification />
        </div>

        {/* Enhanced Dashboard Tabs */}
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-black/40 border border-gray-800 grid w-full grid-cols-6">
            <TabsTrigger value="overview" className="text-gray-400 data-[state=active]:text-gray-200">
              Overview
            </TabsTrigger>
            <TabsTrigger value="my-agents" className="text-gray-400 data-[state=active]:text-gray-200">
              My Agents
            </TabsTrigger>
            <TabsTrigger value="files" className="text-gray-400 data-[state=active]:text-gray-200">
              Files
            </TabsTrigger>
            <TabsTrigger value="contracts" className="text-gray-400 data-[state=active]:text-gray-200">
              Contracts
            </TabsTrigger>
            <TabsTrigger value="uploads" className="text-gray-400 data-[state=active]:text-gray-200">
              Upload Agent
            </TabsTrigger>
            <TabsTrigger value="transactions" className="text-gray-400 data-[state=active]:text-gray-200">
              Transactions
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-gradient-to-br from-emerald-900/20 to-emerald-800/10 border-emerald-700/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-emerald-400 text-sm font-light flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    Agents Owned
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-light text-white">
                    {Array.isArray(userPurchases) ? userPurchases.length : 0}
                  </div>
                  <p className="text-emerald-400/70 text-xs">Marketplace purchases</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-900/20 to-blue-800/10 border-blue-700/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-blue-400 text-sm font-light flex items-center">
                    <Building2 className="w-4 h-4 mr-2" />
                    Nomad Agents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-light text-white">{mockUserAgents.length}</div>
                  <p className="text-blue-400/70 text-xs">Your uploaded agents</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/20 to-purple-800/10 border-purple-700/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-purple-400 text-sm font-light flex items-center">
                    <Code className="w-4 h-4 mr-2" />
                    Active Contracts
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-light text-white">
                    {mockContracts.filter(c => c.status === "active").length}
                  </div>
                  <p className="text-purple-400/70 text-xs">Smart contracts engaged</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-yellow-900/20 to-yellow-800/10 border-yellow-700/30">
                <CardHeader className="pb-2">
                  <CardTitle className="text-yellow-400 text-sm font-light flex items-center">
                    <Zap className="w-4 h-4 mr-2" />
                    Total Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-light text-white">4.32 ETH</div>
                  <p className="text-yellow-400/70 text-xs">From agent hires</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card className="bg-black/40 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-200 font-light flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                      <span className="text-gray-300">DataFlow Jenkins completed a data transformation task</span>
                    </div>
                    <span className="text-gray-500 text-sm">2 hours ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-gray-300">New contract engagement: Escrow Service</span>
                    </div>
                    <span className="text-gray-500 text-sm">1 day ago</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-gray-900/30 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      <span className="text-gray-300">ContentCraft Maya earned 0.15 ETH</span>
                    </div>
                    <span className="text-gray-500 text-sm">3 days ago</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Agents Tab */}
          <TabsContent value="my-agents" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockUserAgents.map((agent) => (
                <Card key={agent.id} className="bg-black/40 border-gray-800 hover:border-gray-600 transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-white text-lg">{agent.name}</CardTitle>
                        <p className="text-gray-400 text-sm">{agent.description}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getAvailabilityColor(agent.availability)}`}></div>
                        <span className="text-gray-400 text-sm capitalize">{agent.availability}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Category</span>
                        <div className="text-gray-300">{agent.category}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Rating</span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-gray-300">{agent.rating}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-500">Total Runs</span>
                        <div className="text-gray-300">{agent.totalRuns}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Earnings</span>
                        <div className="text-emerald-400">{agent.earnings}</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Per Run</span>
                        <div className="text-emerald-400">{formatEth(agent.pricePerRun)}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Per Hour</span>
                        <div className="text-emerald-400">{formatEth(agent.pricePerHour)}</div>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gray-700">
                      <Button size="sm" className="flex-1 bg-emerald-900/50 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/70">
                        <Settings className="w-4 h-4 mr-2" />
                        Manage
                      </Button>
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800/50">
                        <Eye className="w-4 h-4 mr-2" />
                        View Stats
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files" className="mt-6">
            <Card className="bg-black/40 border-gray-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-gray-200 font-light flex items-center">
                      <FileText className="w-5 h-5 mr-2" />
                      File Management
                    </CardTitle>
                    <p className="text-gray-400 text-sm font-light">Upload and manage your agent files and documents</p>
                  </div>
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-blue-900/50 border border-blue-700/50 text-blue-300 hover:bg-blue-900/70"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload File
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".json,.pdf,.md,.txt,.zip,.py,.js,.ts"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockUserFiles.map((file) => (
                    <div key={file.id} className="flex items-center justify-between p-4 bg-gray-900/30 border border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <FileText className="w-5 h-5 text-blue-400" />
                        </div>
                        <div>
                          <div className="text-gray-200 font-medium">{file.fileName}</div>
                          <div className="text-gray-400 text-sm">{file.description}</div>
                          <div className="flex items-center space-x-4 text-xs text-gray-500">
                            <span>{formatFileSize(file.fileSize)}</span>
                            <span>{file.category}</span>
                            <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800/50">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline" className="border-red-600 text-red-400 hover:bg-red-900/20">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Upload Progress */}
                {selectedFiles.length > 0 && (
                  <div className="mt-6 p-4 bg-blue-900/20 border border-blue-700/30 rounded-lg">
                    <h4 className="text-blue-400 font-medium mb-2">Upload Queue</h4>
                    <div className="space-y-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-300">{file.name}</span>
                          <span className="text-blue-400">{formatFileSize(file.size)}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      className="w-full mt-4 bg-blue-900/50 border border-blue-700/50 text-blue-300 hover:bg-blue-900/70"
                      onClick={() => {
                        // Simulate upload
                        toast({
                          title: "Upload Started",
                          description: `Uploading ${selectedFiles.length} file(s)...`,
                        });
                        setSelectedFiles([]);
                      }}
                    >
                      Start Upload
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contracts Tab */}
          <TabsContent value="contracts" className="mt-6">
            <Card className="bg-black/40 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-200 font-light flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Smart Contract Engagements
                </CardTitle>
                <p className="text-gray-400 text-sm font-light">Track your active and completed contract transactions</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockContracts.map((contract) => (
                    <div key={contract.id} className="p-4 bg-gray-900/30 border border-gray-700 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="text-gray-200 font-medium">{contract.contractName}</h4>
                          <p className="text-gray-400 text-sm">{contract.terms}</p>
                        </div>
                        <Badge className={`${getStatusColor(contract.status)} text-white border-0`}>
                          {contract.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Party A</span>
                          <div className="text-gray-300 font-mono">{contract.partyA}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Party B</span>
                          <div className="text-gray-300 font-mono">{contract.partyB}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Amount</span>
                          <div className="text-emerald-400">{contract.amount}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Tax</span>
                          <div className="text-yellow-400">{contract.taxAmount}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700">
                        <div className="text-gray-500 text-sm">
                          Started: {new Date(contract.startTime).toLocaleDateString()}
                        </div>
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800/50">
                          <Eye className="w-4 h-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Upload Agent Tab */}
          <TabsContent value="uploads" className="mt-6">
            <Card className="bg-black/40 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-200 font-light flex items-center">
                  <Plus className="w-5 h-5 mr-2" />
                  Upload Your Agent
                </CardTitle>
                <p className="text-gray-400 text-sm font-light">Create and deploy your own AI agent to the Nomad Lands marketplace</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="agentName">Agent Name</Label>
                      <Input
                        id="agentName"
                        placeholder="Enter agent name"
                        value={agentName}
                        onChange={(e) => setAgentName(e.target.value)}
                        className="bg-gray-800 border-gray-600"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="agentDescription">Description</Label>
                      <Textarea
                        id="agentDescription"
                        placeholder="Describe your agent's capabilities and expertise"
                        value={agentDescription}
                        onChange={(e) => setAgentDescription(e.target.value)}
                        className="bg-gray-800 border-gray-600 min-h-[100px]"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="agentCategory">Category</Label>
                      <Select value={agentCategory} onValueChange={setAgentCategory}>
                        <SelectTrigger className="bg-gray-800 border-gray-600">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Engineering">Engineering</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="Design">Design</SelectItem>
                          <SelectItem value="Analytics">Analytics</SelectItem>
                          <SelectItem value="Operations">Operations</SelectItem>
                          <SelectItem value="Security">Security</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="pricePerRun">Price Per Run (ETH)</Label>
                        <Input
                          id="pricePerRun"
                          type="number"
                          step="0.001"
                          placeholder="0.025"
                          value={pricePerRun}
                          onChange={(e) => setPricePerRun(e.target.value)}
                          className="bg-gray-800 border-gray-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="pricePerHour">Price Per Hour (ETH)</Label>
                        <Input
                          id="pricePerHour"
                          type="number"
                          step="0.001"
                          placeholder="0.1"
                          value={pricePerHour}
                          onChange={(e) => setPricePerHour(e.target.value)}
                          className="bg-gray-800 border-gray-600"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="agentSkills">Skills (comma-separated)</Label>
                      <Input
                        id="agentSkills"
                        placeholder="Python, Machine Learning, Data Analysis"
                        value={agentSkills}
                        onChange={(e) => setAgentSkills(e.target.value)}
                        className="bg-gray-800 border-gray-600"
                      />
                    </div>
                    
                    <div className="pt-4">
                      <Button 
                        className="w-full bg-emerald-900/50 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/70"
                        onClick={() => {
                          toast({
                            title: "Agent Upload Started",
                            description: "Your agent is being deployed to the marketplace...",
                          });
                          // Reset form
                          setAgentName("");
                          setAgentDescription("");
                          setAgentCategory("");
                          setPricePerRun("");
                          setPricePerHour("");
                          setAgentSkills("");
                        }}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Deploy Agent
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Agents Tab */}
          <TabsContent value="agents" className="mt-6">
            {purchasesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-black/40 border border-gray-800 rounded-lg p-6 animate-pulse">
                    <div className="h-4 bg-gray-800 rounded mb-4"></div>
                    <div className="h-3 bg-gray-800 rounded mb-2"></div>
                    <div className="h-3 bg-gray-800 rounded mb-4"></div>
                    <div className="h-8 bg-gray-800 rounded"></div>
                  </div>
                ))}
              </div>
            ) : Array.isArray(userPurchases) && userPurchases.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userPurchases.map((purchase: PurchasedAgent) => (
                  <Card key={purchase.id} className="bg-black/40 border-gray-800 hover:border-gray-700 transition-all duration-300">
                    <CardHeader>
                      <CardTitle className="text-gray-200 font-light flex items-center justify-between">
                        {purchase.agent.name}
                        <Badge className="bg-emerald-900/40 text-emerald-400">
                          Owned
                        </Badge>
                      </CardTitle>
                      <CardDescription className="text-gray-400 font-extralight">
                        {purchase.agent.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <p className="text-gray-400 text-sm font-extralight mb-2">Features</p>
                          <div className="flex flex-wrap gap-2">
                            {purchase.agent.features.slice(0, 2).map((feature, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                            {purchase.agent.features.length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{purchase.agent.features.length - 2} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-800">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-400 text-sm font-extralight">Purchased</span>
                            <span className="text-gray-300 text-sm">
                              {new Date(purchase.purchasedAt).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm font-extralight">Price Paid</span>
                            <span className="text-emerald-400 text-sm font-light">
                              ${purchase.purchasePrice}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1 bg-emerald-900/40 hover:bg-emerald-800/60 text-emerald-300 border border-emerald-700/50"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Deploy
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="border-gray-700 text-gray-400 hover:text-gray-200"
                          >
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-light text-gray-200 mb-2">No Agents Yet</h3>
                <p className="text-gray-400 font-extralight mb-6">
                  Start building your AI agent collection by purchasing from the marketplace.
                </p>
                <Button 
                  onClick={() => window.location.href = '/marketplace'}
                  className="bg-emerald-900/80 hover:bg-emerald-800/90 text-gray-200 border border-emerald-700/50"
                >
                  Browse Marketplace
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="mt-6">
            <Card className="bg-black/40 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-200 font-light flex items-center">
                  <Activity className="w-5 h-5 mr-2" />
                  Transaction History
                </CardTitle>
                <CardDescription className="text-gray-400 font-extralight">
                  Your blockchain transaction history for agent purchases and contract engagements
                </CardDescription>
              </CardHeader>
              <CardContent>
                {Array.isArray(userPurchases) && userPurchases.length > 0 ? (
                  <div className="space-y-4">
                    {userPurchases.map((purchase: PurchasedAgent) => (
                      <div key={purchase.id} className="flex items-center justify-between p-4 bg-black/20 border border-gray-800 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-emerald-900/30 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <div className="text-gray-200 font-medium">{purchase.agent.name}</div>
                            <div className="text-gray-400 text-sm">Agent Purchase</div>
                            <div className="text-gray-500 text-xs font-mono">{purchase.transactionHash}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-emerald-400 font-medium">${purchase.purchasePrice}</div>
                          <div className="text-gray-500 text-sm">{new Date(purchase.purchasedAt).toLocaleDateString()}</div>
                          <Badge variant="secondary" className="text-xs">
                            Block #{purchase.blockNumber}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Activity className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-xl font-light text-gray-200 mb-2">No Transactions Yet</h3>
                    <p className="text-gray-400 font-extralight">
                      Your transaction history will appear here once you start purchasing agents or engaging contracts.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}