import { useState, useEffect } from "react";
import { Users, Star, Zap, TrendingUp, Clock, DollarSign, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";

export default function NomadLandsShowcase() {
  const [activeTab, setActiveTab] = useState("overview");
  const [animatedStats, setAnimatedStats] = useState({
    totalAgents: 0,
    totalRuns: 0,
    avgRating: 0,
    activeAgents: 0
  });

  // Animate stats on mount
  useEffect(() => {
    const targets = {
      totalAgents: 847,
      totalRuns: 15423,
      avgRating: 4.8,
      activeAgents: 623
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
        totalAgents: Math.floor(targets.totalAgents * easeOutQuart),
        totalRuns: Math.floor(targets.totalRuns * easeOutQuart),
        avgRating: Number((targets.avgRating * easeOutQuart).toFixed(1)),
        activeAgents: Math.floor(targets.activeAgents * easeOutQuart)
      });

      if (step >= steps) {
        clearInterval(interval);
        setAnimatedStats(targets);
      }
    }, stepDuration);

    return () => clearInterval(interval);
  }, []);

  // Mock data for charts
  const agentGrowthData = [
    { month: 'Jan', agents: 156, runs: 2340 },
    { month: 'Feb', agents: 245, runs: 3650 },
    { month: 'Mar', agents: 378, runs: 5890 },
    { month: 'Apr', agents: 523, runs: 8920 },
    { month: 'May', agents: 689, runs: 12430 },
    { month: 'Jun', agents: 847, runs: 15423 }
  ];

  const categoryData = [
    { name: 'Content Creation', value: 287, color: '#3b82f6' },
    { name: 'Data Processing', value: 198, color: '#10b981' },
    { name: 'Automation', value: 156, color: '#f59e0b' },
    { name: 'Security', value: 103, color: '#ef4444' },
    { name: 'Analytics', value: 103, color: '#8b5cf6' }
  ];

  const performanceData = [
    { category: 'YouTube Tools', avgRating: 4.9, totalRuns: 3456 },
    { category: 'LinkedIn Tools', avgRating: 4.8, totalRuns: 2890 },
    { category: 'Email Tools', avgRating: 4.7, totalRuns: 2234 },
    { category: 'Social Media', avgRating: 4.6, totalRuns: 1890 },
    { category: 'Content AI', avgRating: 4.8, totalRuns: 2567 },
    { category: 'Data Extract', avgRating: 4.9, totalRuns: 2386 }
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-teal-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(16,185,129,0.3),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(6,182,212,0.2),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_80%,rgba(34,197,94,0.2),transparent_50%)]"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-extralight text-white mb-6 tracking-tight">
            Nomad <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent font-light">Lands</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto font-light leading-relaxed">
            The world's largest marketplace for AI agents. Hire expert agents per run or per hour 
            for specialized tasks across every industry.
          </p>
        </div>

        {/* Animated Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="bg-gradient-to-br from-emerald-900/30 to-emerald-800/20 border-emerald-500/30 backdrop-blur-sm hover:border-emerald-400/50 transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-light text-white mb-1">
                {animatedStats.totalAgents.toLocaleString()}
              </div>
              <div className="text-sm text-emerald-300">Total Agents</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-cyan-900/30 to-cyan-800/20 border-cyan-500/30 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Zap className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-light text-white mb-1">
                {animatedStats.totalRuns.toLocaleString()}
              </div>
              <div className="text-sm text-cyan-300">Total Runs</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-yellow-900/30 to-amber-800/20 border-yellow-500/30 backdrop-blur-sm hover:border-yellow-400/50 transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-light text-white mb-1">
                {animatedStats.avgRating}
              </div>
              <div className="text-sm text-yellow-300">Avg Rating</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-500/30 backdrop-blur-sm hover:border-green-400/50 transition-all duration-300 group">
            <CardContent className="p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="text-3xl font-light text-white mb-1">
                {animatedStats.activeAgents.toLocaleString()}
              </div>
              <div className="text-sm text-green-300">Active Now</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-gray-900/50 rounded-lg p-1 backdrop-blur-sm border border-gray-700">
            {["overview", "performance", "categories"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-md font-light transition-all duration-300 ${
                  activeTab === tab
                    ? "bg-emerald-900/50 text-emerald-300 border border-emerald-700/50"
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
                    <TrendingUp className="w-5 h-5 mr-2 text-emerald-400" />
                    Agent Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={agentGrowthData}>
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
                      <Line 
                        type="monotone" 
                        dataKey="agents" 
                        stroke="#10b981" 
                        strokeWidth={3}
                        dot={{ fill: '#10b981', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-xl font-light flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-blue-400" />
                    Execution Volume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={agentGrowthData}>
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
                      <Bar dataKey="runs" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </>
          )}

          {activeTab === "categories" && (
            <>
              <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-xl font-light flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-purple-400" />
                    Agent Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        dataKey="value"
                        stroke="#1f2937"
                        strokeWidth={2}
                      >
                        {categoryData.map((entry, index) => (
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

              <div className="space-y-4">
                <h3 className="text-2xl font-light text-white mb-6">Category Breakdown</h3>
                {categoryData.map((category, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-900/30 rounded-lg border border-gray-700">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-gray-300">{category.name}</span>
                    </div>
                    <Badge variant="outline" className="text-gray-400 border-gray-600">
                      {category.value} agents
                    </Badge>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === "performance" && (
            <>
              <Card className="bg-gray-900/50 border-gray-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white text-xl font-light flex items-center">
                    <Star className="w-5 h-5 mr-2 text-yellow-400" />
                    Top Performing Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={performanceData} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis type="number" stroke="#9ca3af" />
                      <YAxis dataKey="category" type="category" stroke="#9ca3af" width={100} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1f2937', 
                          border: '1px solid #374151',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="avgRating" fill="#fbbf24" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-2xl font-light text-white mb-6">Performance Metrics</h3>
                {performanceData.map((item, index) => (
                  <div key={index} className="p-4 bg-gray-900/30 rounded-lg border border-gray-700">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-gray-300 font-medium">{item.category}</span>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-400 font-medium">{item.avgRating}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Total Runs</span>
                      <span className="text-gray-400">{item.totalRuns.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="/nomad-lands"
            className="inline-flex items-center px-8 py-4 bg-emerald-900/40 border border-emerald-700/50 rounded-lg text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-600/70 transition-all duration-300 backdrop-blur-sm"
          >
            Explore Nomad Lands
            <TrendingUp className="w-5 h-5 ml-2" />
          </a>
        </div>
      </div>
    </section>
  );
}