import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Shield, Code, Coins, FileText, Clock, Users, Zap, Calculator, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import type { SmartContract } from "@shared/schema";

export default function SmartContracts() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedContract, setSelectedContract] = useState<SmartContract | null>(null);
  const [partyAWallet, setPartyAWallet] = useState("");
  const [partyBWallet, setPartyBWallet] = useState("");
  const [amount, setAmount] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smart Contracts including the 6 core contracts
  const mockSmartContracts: SmartContract[] = [
    // Core Smart Contracts
    {
      id: 1,
      name: "AgentRegistry.sol",
      description: "Tracks all registered agents with metadata like owner, description, pricing, and endpoint URLs. Central registry for the agent ecosystem.",
      category: "Core Infrastructure",
      contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA1000001",
      abi: JSON.stringify([]),
      taxPercentage: 100, // 1.0%
      minAmount: "1000000000000000", // 0.001 ETH
      maxAmount: "1000000000000000000000", // 1000 ETH
      features: ["Agent Registration", "Metadata Storage", "Owner Verification", "Pricing Config", "Endpoint URLs"],
      gasEstimate: 65000,
      icon: "Code",
      verified: true,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 2,
      name: "AgentAccessController.sol",
      description: "Handles access control and payment logic for agents—supports both pay-per-use and subscription models with flexible pricing.",
      category: "Core Infrastructure",
      contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA1000002",
      abi: JSON.stringify([]),
      taxPercentage: 150, // 1.5%
      minAmount: "5000000000000000", // 0.005 ETH
      maxAmount: "500000000000000000000", // 500 ETH
      features: ["Pay-per-use", "Subscriptions", "Access Control", "Payment Processing", "Usage Tracking"],
      gasEstimate: 75000,
      icon: "Lock",
      verified: true,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      name: "AgentLicenseNFT.sol",
      description: "Represents agent access or ownership as NFTs (ERC-721/ERC-1155), including royalty support and transferability options.",
      category: "Core Infrastructure",
      contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA1000003",
      abi: JSON.stringify([]),
      taxPercentage: 300, // 3.0%
      minAmount: "10000000000000000", // 0.01 ETH
      maxAmount: "100000000000000000000", // 100 ETH
      features: ["ERC-721 NFTs", "ERC-1155 Support", "Royalty Distribution", "Transfer Rights", "Ownership Proof"],
      gasEstimate: 120000,
      icon: "FileText",
      verified: true,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 4,
      name: "RevenueSplitter.sol",
      description: "Splits payments among multiple stakeholders—ideal for team-built agents or DAO-owned assets with automated distribution.",
      category: "Core Infrastructure",
      contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA1000004",
      abi: JSON.stringify([]),
      taxPercentage: 200, // 2.0%
      minAmount: "10000000000000000", // 0.01 ETH
      maxAmount: "1000000000000000000000", // 1000 ETH
      features: ["Multi-party Splits", "Automated Distribution", "DAO Support", "Team Payments", "Revenue Sharing"],
      gasEstimate: 90000,
      icon: "Users",
      verified: true,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 5,
      name: "ReviewAndReputation.sol", 
      description: "Lets users review agents and build a decentralized reputation layer with anti-sybil protection and weighted scoring.",
      category: "Core Infrastructure",
      contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA1000005",
      abi: JSON.stringify([]),
      taxPercentage: 50, // 0.5%
      minAmount: "1000000000000000", // 0.001 ETH
      maxAmount: "10000000000000000000", // 10 ETH
      features: ["Reputation Tracking", "Review System", "Anti-sybil Protection", "Weighted Scoring", "Agent Rankings"],
      gasEstimate: 55000,
      icon: "Shield",
      verified: true,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 6,
      name: "DisputeResolution.sol",
      description: "Resolves disputes around agent rentals or performance—can integrate with decentralized courts like Kleros or Aragon.",
      category: "Core Infrastructure", 
      contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA1000006",
      abi: JSON.stringify([]),
      taxPercentage: 400, // 4.0%
      minAmount: "50000000000000000", // 0.05 ETH
      maxAmount: "10000000000000000000000", // 10000 ETH
      features: ["Dispute Arbitration", "Kleros Integration", "Aragon Support", "Evidence Submission", "Automated Resolution"],
      gasEstimate: 150000,
      icon: "Calculator",
      verified: true,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    // Additional marketplace contracts
    {
      id: 7,
      name: "Escrow Service Contract",
      description: "Secure escrow service for peer-to-peer transactions with automatic release conditions and dispute resolution.",
      category: "Finance",
      contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA2000001",
      abi: JSON.stringify([]),
      taxPercentage: 250, // 2.5%
      minAmount: "1000000000000000", // 0.001 ETH
      maxAmount: "100000000000000000000", // 100 ETH
      features: ["Automatic Release", "Dispute Resolution", "Multi-Signature", "Time Locks", "Refund Protection"],
      gasEstimate: 120000,
      icon: "Shield",
      verified: true,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 8,
      name: "Freelance Payment Contract",
      description: "Milestone-based payment system for freelance work with automated releases and performance tracking.",
      category: "Employment",
      contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA2000002",
      abi: JSON.stringify([]),
      taxPercentage: 300, // 3.0%
      minAmount: "5000000000000000", // 0.005 ETH
      maxAmount: "50000000000000000000", // 50 ETH
      features: ["Milestone Tracking", "Performance Metrics", "Automatic Payments", "Work Verification", "Rating System"],
      gasEstimate: 150000,
      icon: "Users",
      verified: true,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 3,
      name: "NFT Trading Contract",
      description: "Secure NFT marketplace contract with royalty distribution, authenticity verification, and batch trading.",
      category: "NFT",
      contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA1000003",
      abi: JSON.stringify([]),
      taxPercentage: 275, // 2.75%
      minAmount: "10000000000000000", // 0.01 ETH
      maxAmount: "1000000000000000000000", // 1000 ETH
      features: ["Royalty Distribution", "Authenticity Verification", "Batch Trading", "Price Discovery", "Metadata Storage"],
      gasEstimate: 200000,
      icon: "FileText",
      verified: true,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 4,
      name: "Subscription Service Contract",
      description: "Recurring payment system for subscription services with automatic billing, grace periods, and cancellation.",
      category: "Subscription",
      contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA1000004",
      abi: JSON.stringify([]),
      taxPercentage: 200, // 2.0%
      minAmount: "1000000000000000", // 0.001 ETH
      maxAmount: "10000000000000000000", // 10 ETH
      features: ["Automatic Billing", "Grace Periods", "Cancellation Options", "Usage Tracking", "Refund Handling"],
      gasEstimate: 100000,
      icon: "Clock",
      verified: true,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 5,
      name: "Supply Chain Tracking Contract",
      description: "End-to-end supply chain transparency with authenticity verification, logistics tracking, and quality assurance.",
      category: "Logistics",
      contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA1000005",
      abi: JSON.stringify([]),
      taxPercentage: 150, // 1.5%
      minAmount: "100000000000000000", // 0.1 ETH
      maxAmount: "500000000000000000000", // 500 ETH
      features: ["End-to-End Tracking", "Authenticity Verification", "Quality Assurance", "Logistics Optimization", "Compliance Monitoring"],
      gasEstimate: 180000,
      icon: "Code",
      verified: true,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 6,
      name: "Insurance Claim Contract",
      description: "Automated insurance claim processing with risk assessment, payout calculations, and fraud detection.",
      category: "Insurance",
      contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA1000006",
      abi: JSON.stringify([]),
      taxPercentage: 350, // 3.5%
      minAmount: "50000000000000000", // 0.05 ETH
      maxAmount: "200000000000000000000", // 200 ETH
      features: ["Risk Assessment", "Automated Payouts", "Fraud Detection", "Claim Verification", "Premium Calculations"],
      gasEstimate: 250000,
      icon: "Shield",
      verified: true,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 7,
      name: "Real Estate Transaction Contract",
      description: "Property transfer contract with title verification, escrow services, and automated closing procedures.",
      category: "Real Estate",
      contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA1000007",
      abi: JSON.stringify([]),
      taxPercentage: 400, // 4.0%
      minAmount: "1000000000000000000", // 1 ETH
      maxAmount: "10000000000000000000000", // 10,000 ETH
      features: ["Title Verification", "Escrow Services", "Automated Closing", "Property Documentation", "Transfer Records"],
      gasEstimate: 300000,
      icon: "Lock",
      verified: true,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 8,
      name: "Voting & Governance Contract",
      description: "Decentralized voting system with proposal management, voting power calculation, and result transparency.",
      category: "Governance",
      contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA1000008",
      abi: JSON.stringify([]),
      taxPercentage: 100, // 1.0%
      minAmount: "0", // No minimum
      maxAmount: "1000000000000000000", // 1 ETH
      features: ["Proposal Management", "Voting Power Calculation", "Result Transparency", "Delegation Options", "Time-based Voting"],
      gasEstimate: 80000,
      icon: "Users",
      verified: true,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 9,
      name: "Token Swap Contract",
      description: "Decentralized token exchange with liquidity pools, slippage protection, and multi-chain support.",
      category: "DeFi",
      contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA1000009",
      abi: JSON.stringify([]),
      taxPercentage: 30, // 0.3%
      minAmount: "1000000000000000", // 0.001 ETH
      maxAmount: "1000000000000000000000", // 1000 ETH
      features: ["Liquidity Pools", "Slippage Protection", "Multi-Chain Support", "Price Discovery", "Yield Farming"],
      gasEstimate: 120000,
      icon: "Coins",
      verified: true,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 10,
      name: "Energy Trading Contract",
      description: "Peer-to-peer energy trading platform with smart grid integration, renewable energy certificates, and carbon credits.",
      category: "Energy",
      contractAddress: "0x742d35Cc6635C0532925a3b8D359e16FA1000010",
      abi: JSON.stringify([]),
      taxPercentage: 200, // 2.0%
      minAmount: "10000000000000000", // 0.01 ETH
      maxAmount: "100000000000000000000", // 100 ETH
      features: ["Smart Grid Integration", "Renewable Certificates", "Carbon Credits", "Energy Metering", "Grid Balancing"],
      gasEstimate: 160000,
      icon: "Zap",
      verified: true,
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
  ];

  const categories = ["all", "Core Infrastructure", "Finance", "Employment", "NFT", "Subscription", "Logistics", "Insurance", "Real Estate", "Governance", "DeFi", "Energy"];

  const getIconComponent = (iconName: string) => {
    const icons: Record<string, any> = {
      Shield, Code, Coins, FileText, Clock, Users, Zap, Calculator, Lock
    };
    return icons[iconName] || Code;
  };

  const formatEth = (wei: string) => {
    if (!wei || wei === "0") return "0 ETH";
    const eth = parseFloat(wei) / 1e18;
    return `${eth} ETH`;
  };

  const calculateTax = (amount: string, taxPercentage: number) => {
    if (!amount) return "0";
    const amountWei = parseFloat(amount) * 1e18;
    const taxWei = (amountWei * taxPercentage) / 10000;
    return (taxWei / 1e18).toFixed(6);
  };

  const filteredContracts = mockSmartContracts.filter(contract => {
    const matchesSearch = contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contract.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || contract.category === selectedCategory;
    return matchesSearch && matchesCategory && contract.active;
  });

  return (
    <div className="min-h-screen bg-black">
      {/* Fixed Navigation with Fade Effect */}
      <div className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-black/95 backdrop-blur-lg border-b border-gray-800/50' 
          : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-light text-white">
              AI <span className="knight-text">Nomads</span>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/marketplace" className="text-gray-300 hover:text-white transition-colors">Marketplace</a>
              <a href="/nomad-lands" className="text-gray-300 hover:text-white transition-colors">Nomad Lands</a>
              <a href="/smart-contracts" className="text-blue-400">Smart Contracts</a>
              <a href="/api-docs" className="text-gray-300 hover:text-white transition-colors">API</a>
            </nav>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-br from-black via-gray-950 to-blue-950/20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="space-y-8">
            <h1 className="text-6xl md:text-7xl font-extralight text-white tracking-tight">
              Smart <span className="knight-text font-light">Contracts</span>
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
              Secure blockchain contracts for every transaction. 
              Choose from verified smart contracts with automatic execution and transparent tax calculations.
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span>Verified Contracts</span>
              </div>
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-emerald-400" />
                <span>Secure Execution</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calculator className="w-5 h-5 text-emerald-400" />
                <span>Transparent Fees</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-light text-blue-400">10</div>
              <div className="text-gray-500 text-sm">Contract Types</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-blue-400">5.2k</div>
              <div className="text-gray-500 text-sm">Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-blue-400">99.9%</div>
              <div className="text-gray-500 text-sm">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-light text-blue-400">$2.3M</div>
              <div className="text-gray-500 text-sm">Total Volume</div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter */}
      <section className="py-12 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="relative flex-1">
              <Input
                placeholder="Search contracts by name, category, or features..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-900/50 border-gray-700 text-white placeholder-gray-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className={selectedCategory === category 
                    ? "bg-blue-900/50 border-blue-700/50 text-blue-300" 
                    : "border-gray-700 text-gray-400 hover:bg-gray-900/50"
                  }
                >
                  {category === "all" ? "All Categories" : category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contracts Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredContracts.map((contract) => {
              const IconComponent = getIconComponent(contract.icon!);
              return (
                <Card key={contract.id} className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-all duration-300 group">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center">
                          <IconComponent className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{contract.name}</CardTitle>
                          <Badge variant="secondary" className="text-xs bg-gray-800 text-gray-400">
                            {contract.category}
                          </Badge>
                        </div>
                      </div>
                      {contract.verified && (
                        <Badge className="bg-emerald-900/30 text-emerald-400 border-emerald-700/50">
                          <Shield className="w-3 h-3 mr-1" />
                          Verified
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-gray-400 text-sm line-clamp-3">
                      {contract.description}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <div className="text-gray-500">Tax Rate</div>
                        <div className="text-blue-400 font-medium">{(contract.taxPercentage / 100).toFixed(1)}%</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Gas Estimate</div>
                        <div className="text-blue-400 font-medium">{contract.gasEstimate?.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Min Amount</div>
                        <div className="text-blue-400 font-medium">{formatEth(contract.minAmount!.toString())}</div>
                      </div>
                      <div>
                        <div className="text-gray-500">Max Amount</div>
                        <div className="text-blue-400 font-medium">{formatEth(contract.maxAmount!.toString())}</div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {contract.features?.slice(0, 3).map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs border-gray-600 text-gray-400">
                          {feature}
                        </Badge>
                      ))}
                      {contract.features && contract.features.length > 3 && (
                        <Badge variant="outline" className="text-xs border-gray-600 text-gray-400">
                          +{contract.features.length - 3} more
                        </Badge>
                      )}
                    </div>

                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          className="w-full bg-blue-900/50 border border-blue-700/50 text-blue-300 hover:bg-blue-900/70"
                          onClick={() => setSelectedContract(contract)}
                        >
                          Engage Contract
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
                        <DialogHeader>
                          <DialogTitle className="text-xl">Engage {contract.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="partyA">Party A Wallet Address</Label>
                              <Input
                                id="partyA"
                                placeholder="0x..."
                                value={partyAWallet}
                                onChange={(e) => setPartyAWallet(e.target.value)}
                                className="bg-gray-800 border-gray-600"
                              />
                            </div>
                            <div>
                              <Label htmlFor="partyB">Party B Wallet Address</Label>
                              <Input
                                id="partyB"
                                placeholder="0x..."
                                value={partyBWallet}
                                onChange={(e) => setPartyBWallet(e.target.value)}
                                className="bg-gray-800 border-gray-600"
                              />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="amount">Transaction Amount (ETH)</Label>
                            <Input
                              id="amount"
                              type="number"
                              step="0.001"
                              placeholder="0.0"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                              className="bg-gray-800 border-gray-600"
                            />
                          </div>
                          {amount && (
                            <div className="bg-gray-800/50 p-4 rounded-lg">
                              <h4 className="font-medium mb-2">Transaction Summary</h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span>Amount:</span>
                                  <span>{amount} ETH</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Tax ({(contract.taxPercentage / 100).toFixed(1)}%):</span>
                                  <span>{calculateTax(amount, contract.taxPercentage)} ETH</span>
                                </div>
                                <div className="flex justify-between font-medium border-t border-gray-600 pt-2">
                                  <span>Total:</span>
                                  <span>{(parseFloat(amount || "0") + parseFloat(calculateTax(amount, contract.taxPercentage))).toFixed(6)} ETH</span>
                                </div>
                              </div>
                            </div>
                          )}
                          <div className="flex gap-3">
                            <Button className="flex-1 bg-blue-900/50 border border-blue-700/50 text-blue-300 hover:bg-blue-900/70">
                              Execute Contract
                            </Button>
                            <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800/50">
                              Save Draft
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}