import { useState, useEffect } from "react";
import { Shield, Lock, FileText, TrendingUp, Zap, Calculator, Code, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

export default function SmartContractsShowcase() {
  const [activeTab, setActiveTab] = useState("overview");
  const [animatedStats, setAnimatedStats] = useState({
    totalContracts: 0,
    totalVolume: 0,
    gasEfficiency: 0,
    verifiedContracts: 0
  });

  // Animate stats on mount
  useEffect(() => {
    const targets = {
      totalContracts: 16,
      totalVolume: 2.3,
      gasEfficiency: 94.7,
      verifiedContracts: 16
    };

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;

    let step = 0;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      setAnimatedStats({
        totalContracts: Math.floor(targets.totalContracts * easeOutQuart),
        totalVolume: Number((targets.totalVolume * easeOutQuart).toFixed(1)),
        gasEfficiency: Number((targets.gasEfficiency * easeOutQuart).toFixed(1)),
        verifiedContracts: Math.floor(targets.verifiedContracts * easeOutQuart)
      });

      if (step >= steps) {
        clearInterval(interval);
        setAnimatedStats(targets);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  // Mock data for charts
  const volumeData = [
    { month: 'Jan', volume: 0.15, transactions: 145 },
    { month: 'Feb', volume: 0.32, transactions: 289 },
    { month: 'Mar', volume: 0.58, transactions: 456 },
    { month: 'Apr', volume: 1.2, transactions: 678 },
    { month: 'May', volume: 1.8, transactions: 892 },
    { month: 'Jun', volume: 2.3, transactions: 1156 }
  ];

  const contractTypes = [
    { name: 'Core Infrastructure', value: 6, color: '#3b82f6', percentage: 37.5 },
    { name: 'Financial Services', value: 4, color: '#10b981', percentage: 25 },
    { name: 'Governance', value: 3, color: '#f59e0b', percentage: 18.75 },
    { name: 'Utility', value: 2, color: '#ef4444', percentage: 12.5 },
    { name: 'Security', value: 1, color: '#8b5cf6', percentage: 6.25 }
  ];

  const gasEfficiencyData = [
    { contract: 'AgentRegistry', gasUsed: 65000, gasLimit: 80000, efficiency: 81.25 },
    { contract: 'AccessController', gasUsed: 75000, gasLimit: 90000, efficiency: 83.33 },
    { contract: 'LicenseNFT', gasUsed: 85000, gasLimit: 100000, efficiency: 85 },
    { contract: 'RevenueSplitter', gasUsed: 55000, gasLimit: 65000, efficiency: 84.6 },
    { contract: 'Reputation', gasUsed: 70000, gasLimit: 85000, efficiency: 82.35 },
    { contract: 'Dispute', gasUsed: 95000, gasLimit: 110000, efficiency: 86.36 }
  ];

  const securityMetrics = [
    { metric: 'Audit Score', value: 98.5, color: '#10b981' },
    { metric: 'Code Coverage', value: 96.2, color: '#3b82f6' },
    { metric: 'Vulnerability Score', value: 99.1, color: '#f59e0b' },
    { metric: 'Performance Score', value: 94.7, color: '#ef4444' }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-black via-gray-950 to-blue-950/10">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-extralight text-white mb-6 tracking-tight">
            Smart <span className="knight-text font-light">Contracts</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto font-light leading-relaxed">
            Battle-tested smart contracts for secure transactions. Verified, audited, and optimized 
            for the decentralized freelancer economy.
          </p>
        </div>

        {/* Animated Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Code className="w-8 h-8 text-blue-400" />
              </div>
              <div className="text-3xl font-light text-white mb-1">
                {animatedStats.totalContracts}
              </div>
              <div className="text-sm text-gray-400">Smart Contracts</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <TrendingUp className="w-8 h-8 text-green-400" />
              </div>
              <div className="text-3xl font-light text-white mb-1">
                ${animatedStats.totalVolume}M
              </div>
              <div className="text-sm text-gray-400">Total Volume</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Zap className="w-8 h-8 text-yellow-400" />
              </div>
              <div className="text-3xl font-light text-white mb-1">
                {animatedStats.gasEfficiency}%
              </div>
              <div className="text-sm text-gray-400">Gas Efficiency</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Shield className="w-8 h-8 text-emerald-400" />
              </div>
              <div className="text-3xl font-light text-white mb-1">
                {animatedStats.verifiedContracts}
              </div>
              <div className="text-sm text-gray-400">Verified</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-900/50 rounded-lg p-1 backdrop-blur-sm border border-gray-700">
            {["overview", "security", "efficiency"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-md font-light transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-blue-900/50 text-blue-300 border border-blue-700/50"
                    : "text-gray-400 hover:text-gray-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Chart Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          {activeTab === "overview" && (
            <>
              <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-xl font-light flex items-center">
                    <TrendingUp className="w-5 h-5 mr-2 text-blue-400" />
                    Transaction Volume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={volumeData}>
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
                        dataKey="volume" 
                        stroke="#3b82f6" 
                        fill="url(#colorVolume)"
                        strokeWidth={3}
                      />
                      <defs>
                        <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-xl font-light flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-purple-400" />
                    Contract Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={contractTypes}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        stroke="#1f2937"
                        strokeWidth={2}
                      >
                        {contractTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "security" && (
            <>
              <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-xl font-light flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-emerald-400" />
                    Security Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={securityMetrics}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="metric" stroke="#9ca3af" />
                      <YAxis stroke="#9ca3af" domain={[90, 100]} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar 
                        dataKey="value" 
                        radius={[4, 4, 0, 0]}
                        fill={(entry: any) => entry.color || '#3b82f6'}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-2xl font-light text-white mb-6">Security Features</h3>
                <div className="grid gap-4">
                  <div className="p-4 bg-gray-900/30 rounded-lg border border-gray-700">
                    <div className="flex items-center space-x-3 mb-2">
                      <Shield className="w-5 h-5 text-emerald-400" />
                      <span className="text-white font-medium">Multi-Signature Wallet Support</span>
                    </div>
                    <p className="text-gray-400 text-sm">Enhanced security with multi-party transaction approval</p>
                  </div>
                  
                  <div className="p-4 bg-gray-900/30 rounded-lg border border-gray-700">
                    <div className="flex items-center space-x-3 mb-2">
                      <Lock className="w-5 h-5 text-blue-400" />
                      <span className="text-white font-medium">Access Control Lists</span>
                    </div>
                    <p className="text-gray-400 text-sm">Role-based permissions and access management</p>
                  </div>
                  
                  <div className="p-4 bg-gray-900/30 rounded-lg border border-gray-700">
                    <div className="flex items-center space-x-3 mb-2">
                      <Calculator className="w-5 h-5 text-yellow-400" />
                      <span className="text-white font-medium">Automated Audits</span>
                    </div>
                    <p className="text-gray-400 text-sm">Continuous security monitoring and vulnerability detection</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "efficiency" && (
            <>
              <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-xl font-light flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                    Gas Efficiency
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={gasEfficiencyData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis type="number" stroke="#9ca3af" domain={[70, 90]} />
                      <YAxis dataKey="contract" type="category" stroke="#9ca3af" width={120} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="efficiency" fill="#fbbf24" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-2xl font-light text-white mb-6">Optimization Details</h3>
                {gasEfficiencyData.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-900/30 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 font-medium">{item.contract}</span>
                      <Badge className="bg-yellow-900/30 text-yellow-400 border-yellow-700/50">
                        {item.efficiency.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Gas Used</span>
                        <div className="text-gray-400">{item.gasUsed.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Gas Limit</span>
                        <div className="text-gray-400">{item.gasLimit.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Contract Types Legend */}
        {activeTab === "overview" && (
          <div className="mt-8">
            <h3 className="text-2xl font-light text-white mb-6 text-center">Contract Categories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {contractTypes.map((type, index) => (
                <div key={index} className="p-4 bg-gray-900/30 rounded-lg border border-gray-700 text-center">
                  <div 
                    className="w-8 h-8 rounded-full mx-auto mb-2" 
                    style={{ backgroundColor: type.color }}
                  />
                  <div className="text-gray-300 font-medium text-sm">{type.name}</div>
                  <div className="text-gray-500 text-xs">{type.value} contracts</div>
                  <Badge variant="outline" className="text-xs mt-2 border-gray-600 text-gray-400">
                    {type.percentage}%
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="/smart-contracts"
            className="inline-flex items-center px-8 py-4 bg-blue-900/40 border border-blue-700/50 rounded-lg text-blue-300 hover:bg-blue-900/60 hover:border-blue-600/70 transition-all duration-300 backdrop-blur-sm"
          >
            Explore Smart Contracts
            <Code className="w-5 h-5 ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
}