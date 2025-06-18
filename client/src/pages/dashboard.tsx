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

        {/* Dashboard Tabs */}
        <Tabs defaultValue="agents" className="w-full">
          <TabsList className="bg-black/40 border border-gray-800">
            <TabsTrigger value="agents" className="text-gray-400 data-[state=active]:text-gray-200">
              My Agents
            </TabsTrigger>
            <TabsTrigger value="transactions" className="text-gray-400 data-[state=active]:text-gray-200">
              Transactions
            </TabsTrigger>
          </TabsList>

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
                  Your blockchain transaction history for agent purchases
                </CardDescription>
              </CardHeader>
              <CardContent>
                {Array.isArray(userPurchases) && userPurchases.length > 0 ? (
                  <div className="space-y-4">
                    {userPurchases.map((purchase: PurchasedAgent) => (
                      <div key={purchase.id} className="flex items-center justify-between p-4 bg-black/20 border border-gray-800 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-emerald-900/40 border border-emerald-700 rounded-full flex items-center justify-center">
                            <ShoppingCart className="w-5 h-5 text-emerald-400" />
                          </div>
                          <div>
                            <p className="text-gray-200 font-light">{purchase.agent.name}</p>
                            <p className="text-gray-400 text-sm font-extralight">
                              {new Date(purchase.purchasedAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-400 font-light">${purchase.purchasePrice}</p>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-gray-400 hover:text-gray-200 p-0 h-auto"
                            onClick={() => window.open(`https://etherscan.io/tx/${purchase.transactionHash}`, '_blank')}
                          >
                            <ExternalLink className="w-4 h-4 mr-1" />
                            View on Etherscan
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 font-extralight">No transactions yet</p>
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