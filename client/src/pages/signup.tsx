import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("growth");
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: ""
  });

  const plans = [
    {
      id: "developer",
      name: "Developer",
      monthlyPrice: 0,
      yearlyPrice: 0,
      description: "Get started in your own environment with self-hosted deployment.",
      longDescription: "Designed for startups and hobbyists with low volume usage to explore agent development.",
      pricing: "Includes up to 100k nodes executed per month",
      features: [
        "Horizontally scalable task queues and servers",
        "APIs for retrieving & updating state and conversational history", 
        "APIs for retrieving & updating long-term memory",
        "Real-time streaming",
        "Assistants API"
      ],
      gradient: "emerald-knight",
      cta: "Get started"
    },
    {
      id: "plus",
      name: "Plus", 
      monthlyPrice: 25,
      yearlyPrice: 20,
      description: "Self-serve with Cloud SaaS deployment.",
      longDescription: "Designed for teams to quickly deploy agentic apps, accessible from anywhere.",
      pricing: "$0.001/node executed + standby charges",
      pricingDetails: "Requires LangSmith Plus ($25/user/month). Includes 1 free Dev deployment with usage included. Then, pay per node executed + per minute of standby.",
      features: [
        "All features in Developer tier",
        "Cron scheduling",
        "Auth to call LangGraph APIs",
        "Smart caching"
      ],
      gradient: "obsidian-gradient",
      popular: true,
      cta: "Get started"
    },
    {
      id: "nomad-fleet",
      name: "Nomad Fleet",
      monthlyPrice: 149,
      yearlyPrice: 119,
      description: "Enterprise-scale AI agent orchestration and fleet management.",
      longDescription: "Designed for organizations deploying multiple agent teams with advanced coordination and monitoring.",
      pricing: "$0.0008/node executed + fleet management",
      pricingDetails: "Includes advanced fleet coordination, cross-team communication, and enterprise monitoring dashboards.",
      features: [
        "All features in Plus tier",
        "Multi-agent fleet coordination",
        "Advanced team collaboration",
        "Enterprise monitoring dashboards",
        "Cross-department synchronization",
        "Fleet performance analytics",
        "Priority technical support"
      ],
      gradient: "knight-text",
      cta: "Get started"
    },
    {
      id: "enterprise",
      name: "Enterprise",
      monthlyPrice: null,
      yearlyPrice: null,
      description: "Deployed where you need it - fully Self-Hosted, Hybrid, or Cloud SaaS options.",
      longDescription: "Designed for teams with more security, deployment, and support needs.",
      pricing: "Custom",
      features: [
        "All features in Plus tier",
        "Enterprise deployment options, including full self-hosted and hybrid",
        "SLA for managed offerings", 
        "Team trainings",
        "Shared Slack channel",
        "Architectural guidance",
        "Dedicated customer success engineer"
      ],
      gradient: "shadow-gradient",
      cta: "Contact us",
      isCustom: true
    }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log("Signup data:", { ...formData, plan: selectedPlan });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-emerald-950/10">
      <Navigation />
      <div className="max-w-6xl mx-auto px-6 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-extralight mb-8 text-gray-200 tracking-wide fade-in-luxury">
            Join the Shadows
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-4xl mx-auto font-extralight leading-relaxed">
            Begin your journey into AI-powered automation.
            <br className="hidden md:block" />
            <span className="knight-text font-light">Choose your path to digital dominance.</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Signup Form */}
          <div className="order-2 lg:order-1">
            <div className="bg-black/40 border border-gray-800 rounded-lg p-8 backdrop-blur-sm">
              <h2 className="text-2xl font-light text-gray-200 mb-8">Create Your Account</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name */}
                <div>
                  <label className="block text-gray-400 text-sm font-extralight mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <Input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="pl-10 bg-black/60 border-gray-700 text-gray-300 placeholder-gray-500 focus:border-emerald-600"
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-gray-400 text-sm font-extralight mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <Input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email"
                      className="pl-10 bg-black/60 border-gray-700 text-gray-300 placeholder-gray-500 focus:border-emerald-600"
                      required
                    />
                  </div>
                </div>

                {/* Company */}
                <div>
                  <label className="block text-gray-400 text-sm font-extralight mb-2">
                    Company (Optional)
                  </label>
                  <Input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleInputChange}
                    placeholder="Your company name"
                    className="bg-black/60 border-gray-700 text-gray-300 placeholder-gray-500 focus:border-emerald-600"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-gray-400 text-sm font-extralight mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Create a secure password"
                      className="pl-10 pr-10 bg-black/60 border-gray-700 text-gray-300 placeholder-gray-500 focus:border-emerald-600"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-400"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Terms */}
                <div className="text-sm text-gray-500 font-extralight">
                  By creating an account, you agree to our{" "}
                  <a href="#" className="text-emerald-400 hover:text-emerald-300">Terms of Service</a>
                  {" "}and{" "}
                  <a href="#" className="text-emerald-400 hover:text-emerald-300">Privacy Policy</a>.
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full obsidian-gradient py-3 rounded font-light hover:shadow-xl hover:shadow-gray-900/50 transition-all duration-700 text-gray-300 border border-gray-700 hover:border-gray-600 backdrop-blur-sm"
                >
                  Deploy Account
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </form>

              <div className="mt-8 text-center">
                <p className="text-gray-500 font-extralight">
                  Already have an account?{" "}
                  <a href="#" className="text-emerald-400 hover:text-emerald-300 font-light">
                    Sign in
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Plan Selection */}
          <div className="order-1 lg:order-2">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-light text-gray-200">Choose Your Plan</h3>
              
              {/* Billing Toggle */}
              <div className="flex items-center space-x-3">
                <span className={`text-sm font-extralight ${billingCycle === 'monthly' ? 'text-gray-200' : 'text-gray-500'}`}>
                  Monthly
                </span>
                <button
                  onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                  className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                    billingCycle === 'yearly' ? 'bg-emerald-600' : 'bg-gray-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${
                      billingCycle === 'yearly' ? 'transform translate-x-7' : 'transform translate-x-1'
                    }`}
                  />
                </button>
                <span className={`text-sm font-extralight ${billingCycle === 'yearly' ? 'text-gray-200' : 'text-gray-500'}`}>
                  Yearly
                </span>
                {billingCycle === 'yearly' && (
                  <Badge className="bg-emerald-900/40 text-emerald-400 text-xs px-2 py-1">
                    Save 20%
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {plans.map((plan) => {
                const currentPrice = plan.isCustom ? null : (billingCycle === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice);
                const savings = billingCycle === 'yearly' && plan.monthlyPrice !== null && plan.yearlyPrice !== null ? plan.monthlyPrice - plan.yearlyPrice : 0;
                
                return (
                  <div
                    key={plan.id}
                    className={`relative bg-black/40 border rounded-lg p-6 cursor-pointer transition-all duration-500 backdrop-blur-sm ${
                      selectedPlan === plan.id
                        ? "border-emerald-700 shadow-lg shadow-emerald-900/20"
                        : "border-gray-800 hover:border-gray-700"
                    }`}
                    onClick={() => setSelectedPlan(plan.id)}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-2 left-4 bg-emerald-900/60 text-emerald-400 text-xs px-3 py-1">
                        Most Popular
                      </Badge>
                    )}
                    
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h4 className="text-lg font-light text-gray-200 mb-2">{plan.name}</h4>
                          <p className="text-gray-400 text-sm font-extralight mb-2">{plan.description}</p>
                          <p className="text-gray-500 text-xs font-extralight mb-3">{plan.longDescription}</p>
                          
                          {/* Pricing Display */}
                          <div className="mb-4">
                            <div className="text-lg font-light knight-text mb-1">{plan.pricing}</div>
                            {plan.pricingDetails && (
                              <div className="text-gray-500 text-xs font-extralight leading-relaxed">
                                {plan.pricingDetails}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {!plan.isCustom && (
                          <div className="text-right ml-4">
                            <div className="flex items-baseline">
                              <span className="text-2xl font-extralight knight-text">
                                {currentPrice === 0 ? 'Free' : currentPrice ? `$${currentPrice}` : 'Custom'}
                              </span>
                              {currentPrice !== null && currentPrice !== 0 && (
                                <span className="text-gray-500 text-sm font-extralight ml-1">
                                  /month
                                </span>
                              )}
                            </div>
                            {billingCycle === 'yearly' && savings > 0 && (
                              <div className="text-emerald-400 text-xs font-extralight">
                                Save ${savings}/month
                              </div>
                            )}
                            {billingCycle === 'yearly' && currentPrice && currentPrice > 0 && (
                              <div className="text-gray-600 text-xs font-extralight">
                                Billed ${currentPrice * 12} yearly
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Key Features */}
                      <div className="mb-6">
                        <div className="text-sm font-light text-gray-300 mb-3">Key features:</div>
                        <div className="space-y-2">
                          {plan.features.map((feature, index) => (
                            <div key={index} className="flex items-start text-gray-400 text-sm">
                              <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                              <span className="font-extralight">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button
                        className={`w-full py-3 rounded font-light hover:shadow-xl hover:shadow-gray-900/50 transition-all duration-700 ${
                          plan.isCustom 
                            ? 'bg-transparent text-gray-300 border border-gray-700 hover:border-gray-600 backdrop-blur-sm'
                            : 'bg-gradient-to-r from-emerald-900/80 to-emerald-800/80 text-gray-200 border border-emerald-700/50 hover:border-emerald-600/70 backdrop-blur-sm hover:from-emerald-800/90 hover:to-emerald-700/90'
                        }`}
                        variant={plan.isCustom ? "outline" : "default"}
                      >
                        {plan.cta}
                      </Button>
                    </div>

                    <div className={`w-4 h-4 rounded-full border-2 absolute top-6 right-6 ${
                      selectedPlan === plan.id
                        ? "border-emerald-600 bg-emerald-600"
                        : "border-gray-600"
                    }`}>
                      {selectedPlan === plan.id && (
                        <div className="w-2 h-2 bg-white rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 bg-emerald-950/20 border border-emerald-800/30 rounded-lg p-6">
              <h4 className="text-emerald-400 font-light mb-2">Enterprise Need More?</h4>
              <p className="text-gray-400 text-sm font-extralight mb-4">
                Custom solutions for organizations requiring specialized AI deployments.
              </p>
              <Button className="bg-transparent border-emerald-700 text-emerald-400 hover:bg-emerald-900/20 px-4 py-2 rounded text-sm font-light">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}