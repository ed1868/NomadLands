import { useState, useEffect } from "react";
import { ArrowRight, Users, Zap, Shield, Globe, Activity, TrendingUp, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";

export default function NomadFleets() {
  const [selectedFleet, setSelectedFleet] = useState("enterprise");
  const [animationProgress, setAnimationProgress] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<number | null>(null);
  const [activeMetric, setActiveMetric] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationProgress(prev => (prev + 1) % 100);
    }, 100);

    const metricInterval = setInterval(() => {
      setActiveMetric(prev => (prev + 1) % 3);
    }, 2000);

    return () => {
      clearInterval(interval);
      clearInterval(metricInterval);
    };
  }, []);

  const fleets = [
    {
      id: "enterprise",
      name: "Enterprise Fleet",
      description: "Complete AI workforce for large organizations",
      agents: 25,
      price: 2499,
      features: ["Advanced Analytics", "Custom Integrations", "24/7 Support", "Dedicated Infrastructure"],
      gradient: "obsidian-gradient"
    },
    {
      id: "growth",
      name: "Growth Fleet",
      description: "Scalable AI teams for growing businesses",
      agents: 12,
      price: 999,
      features: ["Team Collaboration", "Workflow Automation", "API Access", "Priority Support"],
      gradient: "shadow-gradient"
    },
    {
      id: "startup",
      name: "Startup Fleet",
      description: "Essential AI agents for new ventures",
      agents: 6,
      price: 499,
      features: ["Core Automation", "Basic Analytics", "Email Support", "Standard API"],
      gradient: "emerald-knight"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-emerald-950/10">
      <Navigation />
      <div className="max-w-7xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-7xl font-extralight mb-8 text-gray-200 tracking-wide fade-in-luxury">
            Nomad Fleets
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto font-extralight leading-relaxed">
            AI agent teams at scale. Where individual power becomes
            <br className="hidden md:block" />
            <span className="knight-text font-light">collective intelligence.</span>
          </p>
        </div>

        {/* Fleet Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {fleets.map((fleet) => (
            <div
              key={fleet.id}
              className={`bg-black/60 border border-gray-800 p-8 rounded backdrop-blur-sm hover:border-gray-700 transition-all duration-700 cursor-pointer ${
                selectedFleet === fleet.id ? 'border-emerald-700 shadow-lg shadow-emerald-900/20' : ''
              }`}
              onClick={() => setSelectedFleet(fleet.id)}
            >
              <div className="mb-6">
                <div className={`w-16 h-16 ${fleet.gradient} rounded border border-gray-600 flex items-center justify-center shadow-2xl backdrop-blur-sm mb-4`}>
                  <Users className="text-gray-300 text-2xl" />
                </div>
                <h3 className="text-2xl font-light text-gray-200 mb-2">{fleet.name}</h3>
                <p className="text-gray-500 text-sm font-extralight">{fleet.description}</p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline mb-4">
                  <span className="text-4xl font-extralight knight-text">${fleet.price}</span>
                  <span className="text-gray-500 text-sm font-extralight ml-2">/month</span>
                </div>
                <Badge className="bg-gray-900/60 text-gray-400 text-sm font-extralight px-3 py-1 rounded border border-gray-800">
                  {fleet.agents} AI Agents
                </Badge>
              </div>

              <div className="space-y-3 mb-8">
                {fleet.features.map((feature, index) => (
                  <div key={index} className="flex items-center text-gray-400 text-sm">
                    <Shield className="w-4 h-4 mr-3 text-emerald-600" />
                    {feature}
                  </div>
                ))}
              </div>

              <Button
                className={`w-full ${fleet.gradient} py-3 rounded font-light hover:shadow-xl hover:shadow-gray-900/50 transition-all duration-700 text-gray-300 border border-gray-700 hover:border-gray-600 backdrop-blur-sm`}
              >
                Deploy Fleet
              </Button>
            </div>
          ))}
        </div>

        {/* Interactive Dashboard Section */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-20">
          {/* Live KPI Dashboard */}
          <div className="bg-black/40 border border-gray-800 rounded-lg p-8 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-light text-gray-200">Live KPI Dashboard</h3>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-emerald-500 text-sm font-extralight">Live</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {/* Tasks Deployed */}
              <div className="bg-emerald-900/10 border border-emerald-800/30 rounded-lg p-4">
                <div className="text-emerald-400 text-xs font-extralight mb-1">Tasks Deployed</div>
                <div className="text-2xl font-light text-white mb-2">
                  {Math.floor(12847 + Math.sin(animationProgress / 5) * 50).toLocaleString()}
                </div>
                <div className="text-emerald-400 text-xs">
                  +{Math.floor(15 + Math.cos(animationProgress / 8) * 3)} in last hour
                </div>
              </div>

              {/* Tasks Assigned */}
              <div className="bg-blue-900/10 border border-blue-800/30 rounded-lg p-4">
                <div className="text-blue-400 text-xs font-extralight mb-1">Tasks Assigned</div>
                <div className="text-2xl font-light text-white mb-2">
                  {Math.floor(8532 + Math.cos(animationProgress / 7) * 30).toLocaleString()}
                </div>
                <div className="text-blue-400 text-xs">
                  +{Math.floor(12 + Math.sin(animationProgress / 6) * 2)} active now
                </div>
              </div>

              {/* Tasks Rolled Back */}
              <div className="bg-orange-900/10 border border-orange-800/30 rounded-lg p-4">
                <div className="text-orange-400 text-xs font-extralight mb-1">Tasks Rolled Back</div>
                <div className="text-2xl font-light text-white mb-2">
                  {Math.floor(23 + Math.sin(animationProgress / 12) * 2)}
                </div>
                <div className="text-orange-400 text-xs">
                  0.18% error rate
                </div>
              </div>

              {/* Teams Working Together */}
              <div className="bg-purple-900/10 border border-purple-800/30 rounded-lg p-4">
                <div className="text-purple-400 text-xs font-extralight mb-1">Teams Collaborating</div>
                <div className="text-2xl font-light text-white mb-2">
                  {Math.floor(47 + Math.cos(animationProgress / 9) * 3)}
                </div>
                <div className="text-purple-400 text-xs">
                  Cross-department sync
                </div>
              </div>
            </div>

            {/* Real-time Activity Feed */}
            <div className="space-y-3">
              <div className="text-sm font-light text-gray-300 mb-3">Recent Activity</div>
              
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-gray-400 font-extralight">Agent deployment successful - Marketing Team</span>
                <span className="text-gray-600 text-xs">2s ago</span>
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-gray-400 font-extralight">Task assigned to Sales automation fleet</span>
                <span className="text-gray-600 text-xs">8s ago</span>
              </div>
              
              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span className="text-gray-400 font-extralight">Cross-team collaboration initiated</span>
                <span className="text-gray-600 text-xs">12s ago</span>
              </div>

              <div className="flex items-center space-x-3 text-sm">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span className="text-gray-400 font-extralight">Workflow optimization completed</span>
                <span className="text-gray-600 text-xs">18s ago</span>
              </div>
            </div>

            {/* Performance Indicator */}
            <div className="mt-6 pt-4 border-t border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm font-extralight">System Performance</span>
                <span className="text-emerald-400 text-sm font-light">
                  {Math.floor(98.5 + Math.sin(animationProgress / 20) * 1.5)}%
                </span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-2 rounded-full transition-all duration-500"
                  style={{ 
                    width: `${98.5 + Math.sin(animationProgress / 20) * 1.5}%`,
                    boxShadow: '0 0 10px #10b98140'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Interactive Network Graph */}
          <div className="bg-black/40 border border-gray-800 rounded-lg p-8 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-light text-gray-200">Network Topology</h3>
              <Network className="w-5 h-5 text-emerald-500" />
            </div>
            
            <div className="relative h-64">
              {/* Data Flow Animation */}
              <div className="absolute inset-0">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-emerald-400 rounded-full opacity-60"
                    style={{
                      left: `${50 + 40 * Math.cos((animationProgress + i * 33) / 10)}%`,
                      top: `${50 + 40 * Math.sin((animationProgress + i * 33) / 10)}%`,
                      transition: 'all 0.1s ease-out'
                    }}
                  />
                ))}
              </div>

              {/* Central Hub */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-emerald-900/60 border-2 border-emerald-600 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-all duration-300">
                <Shield className="w-8 h-8 text-emerald-400" />
                <div className="absolute inset-0 bg-emerald-400/20 rounded-full animate-ping" />
              </div>
              
              {/* Company Nodes */}
              {[...Array(8)].map((_, i) => {
                const angle = (i * 45) * (Math.PI / 180);
                const radius = 80;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                const isHovered = hoveredNode === i;
                
                return (
                  <div key={i}>
                    {/* Connection Line */}
                    <div 
                      className={`absolute top-1/2 left-1/2 origin-left h-0.5 transition-all duration-300 ${
                        isHovered ? 'bg-gradient-to-r from-emerald-400 to-emerald-600' : 'bg-gradient-to-r from-emerald-600/60 to-transparent'
                      }`}
                      style={{
                        width: `${radius}px`,
                        transform: `translate(-2px, -1px) rotate(${i * 45}deg)`,
                        opacity: isHovered ? 1 : 0.6
                      }}
                    />
                    {/* Company Node */}
                    <div 
                      className={`absolute w-8 h-8 rounded-full cursor-pointer transition-all duration-300 ${
                        isHovered 
                          ? 'bg-emerald-600 border-2 border-emerald-400 scale-125' 
                          : 'bg-emerald-900/40 border border-emerald-700 hover:scale-110'
                      }`}
                      style={{
                        left: `calc(50% + ${x}px - 16px)`,
                        top: `calc(50% + ${y}px - 16px)`
                      }}
                      onMouseEnter={() => setHoveredNode(i)}
                      onMouseLeave={() => setHoveredNode(null)}
                    >
                      <div className={`w-3 h-3 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                        isHovered ? 'bg-white' : 'bg-emerald-500'
                      }`} />
                      {isHovered && (
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                          Company {i + 1}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Performance Graph */}
          <div className="bg-black/40 border border-gray-800 rounded-lg p-8 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-light text-gray-200">Performance</h3>
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            
            <div className="h-64 relative">
              <svg className="w-full h-full" viewBox="0 0 300 200">
                {/* Grid */}
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgb(75, 85, 99)" strokeWidth="0.5" opacity="0.3"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
                
                {/* Performance Line */}
                <path
                  d={`M 0,${150 - Math.sin(0) * 30} ${[...Array(30)].map((_, i) => 
                    `L ${i * 10},${150 - Math.sin(i * 0.3 + animationProgress / 20) * 40 - i * 2}`
                  ).join(' ')}`}
                  fill="none"
                  stroke="url(#performance-gradient)"
                  strokeWidth="3"
                  className="drop-shadow-sm"
                />
                
                {/* Gradient Definition */}
                <defs>
                  <linearGradient id="performance-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#10b981" />
                    <stop offset="100%" stopColor="#34d399" />
                  </linearGradient>
                </defs>
                
                {/* Data Points */}
                {[...Array(6)].map((_, i) => (
                  <circle
                    key={i}
                    cx={i * 50}
                    cy={150 - Math.sin(i * 0.5 + animationProgress / 20) * 40 - i * 8}
                    r="4"
                    fill="#10b981"
                    className="cursor-pointer hover:r-6 transition-all duration-200"
                  >
                    <animate
                      attributeName="r"
                      values="4;6;4"
                      dur="2s"
                      repeatCount="indefinite"
                      begin={`${i * 0.3}s`}
                    />
                  </circle>
                ))}
              </svg>
            </div>
          </div>
        </div>

        {/* Power Multiplier Section */}
        <div className="text-center bg-black/40 border border-gray-800 rounded-lg p-12 backdrop-blur-sm">
          <h2 className="text-3xl font-light text-gray-200 mb-6">
            AI Power × Agent Power = <span className="knight-text">Exponential Results</span>
          </h2>
          <p className="text-gray-400 text-lg font-extralight mb-8 max-w-3xl mx-auto">
            When AI agents work together, their combined intelligence creates capabilities 
            far beyond the sum of their parts. Deploy fleets that think, adapt, and evolve as one.
          </p>
          
          {/* Interactive Scale Visualization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Exponential Growth Chart */}
            <div className="bg-black/60 border border-gray-700 rounded-lg p-8">
              <h4 className="text-lg font-light text-gray-200 mb-6">Exponential Scale</h4>
              <div className="h-48 relative">
                <svg className="w-full h-full" viewBox="0 0 400 180">
                  {/* Grid Lines */}
                  <defs>
                    <pattern id="exponential-grid" width="40" height="18" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 18" fill="none" stroke="rgb(75, 85, 99)" strokeWidth="0.3" opacity="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#exponential-grid)" />
                  
                  {/* Exponential Curve */}
                  <path
                    d={`M 20,160 ${[...Array(20)].map((_, i) => {
                      const x = 20 + i * 18;
                      const exponentialY = 160 - Math.pow(i / 5, 2.2) * 12;
                      return `L ${x},${exponentialY}`;
                    }).join(' ')}`}
                    fill="none"
                    stroke="url(#exponential-gradient)"
                    strokeWidth="4"
                    className="drop-shadow-lg"
                  />
                  
                  {/* Fill Area */}
                  <path
                    d={`M 20,160 ${[...Array(20)].map((_, i) => {
                      const x = 20 + i * 18;
                      const exponentialY = 160 - Math.pow(i / 5, 2.2) * 12;
                      return `L ${x},${exponentialY}`;
                    }).join(' ')} L 380,160 Z`}
                    fill="url(#exponential-fill)"
                    opacity="0.3"
                  />
                  
                  {/* Data Points */}
                  {[1, 5, 25, 100, 500].map((value, i) => {
                    const x = 20 + i * 90;
                    const y = 160 - Math.pow(i * 2 / 5, 2.2) * 12;
                    return (
                      <g key={i}>
                        <circle
                          cx={x}
                          cy={y}
                          r="6"
                          fill="#10b981"
                          className="cursor-pointer hover:r-8 transition-all duration-300"
                        >
                          <animate
                            attributeName="r"
                            values="6;8;6"
                            dur="3s"
                            repeatCount="indefinite"
                            begin={`${i * 0.5}s`}
                          />
                        </circle>
                        <text
                          x={x}
                          y={y - 15}
                          textAnchor="middle"
                          className="fill-emerald-400 text-xs font-light"
                        >
                          {value}
                        </text>
                      </g>
                    );
                  })}
                  
                  <defs>
                    <linearGradient id="exponential-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#059669" />
                      <stop offset="50%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#34d399" />
                    </linearGradient>
                    <linearGradient id="exponential-fill" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* Network Load Distribution */}
            <div className="bg-black/60 border border-gray-700 rounded-lg p-8">
              <h4 className="text-lg font-light text-gray-200 mb-6">Load Distribution</h4>
              <div className="space-y-4">
                {[
                  { label: "Processing", value: 85, color: "emerald" },
                  { label: "Communication", value: 72, color: "blue" },
                  { label: "Storage", value: 91, color: "purple" },
                  { label: "Analysis", value: 68, color: "orange" }
                ].map((metric, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400 font-extralight">{metric.label}</span>
                      <span className="text-gray-300 font-light">
                        {Math.floor(metric.value + Math.sin(animationProgress / 12 + i) * 8)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 bg-gradient-to-r ${
                          metric.color === 'emerald' ? 'from-emerald-600 to-emerald-400' :
                          metric.color === 'blue' ? 'from-blue-600 to-blue-400' :
                          metric.color === 'purple' ? 'from-purple-600 to-purple-400' :
                          'from-orange-600 to-orange-400'
                        }`}
                        style={{ 
                          width: `${metric.value + Math.sin(animationProgress / 12 + i) * 8}%`,
                          boxShadow: `0 0 10px ${
                            metric.color === 'emerald' ? '#10b981' :
                            metric.color === 'blue' ? '#3b82f6' :
                            metric.color === 'purple' ? '#8b5cf6' :
                            '#f59e0b'
                          }40`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center space-x-8">
            <div className="text-center">
              <Zap className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
              <span className="text-gray-400 text-sm">Speed</span>
            </div>
            <div className="text-emerald-600 text-2xl">×</div>
            <div className="text-center">
              <Globe className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
              <span className="text-gray-400 text-sm">Scale</span>
            </div>
            <div className="text-emerald-600 text-2xl">=</div>
            <div className="text-center">
              <Shield className="w-12 h-12 text-emerald-600 mx-auto mb-2" />
              <span className="text-gray-400 text-sm">Dominance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}