import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Eye, EyeOff, Mail, Phone, User, Wallet, Shield, Zap, Crown, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";
import { apiRequest } from "@/lib/queryClient";
import { signupUserSchema } from "@shared/schema";
import type { z } from "zod";
import Navigation from "@/components/navigation";

type SignupForm = z.infer<typeof signupUserSchema>;

const subscriptionPlans = [
  {
    id: "developer",
    name: "Developer",
    price: 0,
    originalPrice: null,
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
    gradient: "from-emerald-400 via-teal-500 to-blue-600",
    glowColor: "emerald-400",
    popular: false,
    cta: "Get started"
  },
  {
    id: "plus",
    name: "Plus", 
    price: 25,
    originalPrice: null,
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
    gradient: "from-purple-400 via-pink-500 to-orange-500",
    glowColor: "purple-400",
    popular: true,
    cta: "Get started"
  },
  {
    id: "nomad-fleet",
    name: "Nomad Fleet",
    price: 149,
    originalPrice: null,
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
    gradient: "from-yellow-400 via-orange-500 to-red-500",
    glowColor: "yellow-400",
    popular: false,
    cta: "Get started"
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: null,
    originalPrice: null,
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
    gradient: "from-gray-400 via-gray-500 to-gray-600",
    glowColor: "gray-400",
    popular: false,
    cta: "Contact us"
  }
];

export default function SignupPremium() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("plus");
  const { toast } = useToast();
  const { isConnected, address, connectWallet } = useWallet();

  const form = useForm<SignupForm>({
    resolver: zodResolver(signupUserSchema),
    defaultValues: {
      walletAddress: address || "",
      email: "",
      username: "",
      firstName: "",
      lastName: "",
      phoneNumber: "",
      dateOfBirth: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { register, handleSubmit, setValue, formState: { errors }, watch } = form;

  useEffect(() => {
    if (address) {
      setValue("walletAddress", address);
    }
  }, [address, setValue]);

  const signupMutation = useMutation({
    mutationFn: async (data: SignupForm) => {
      const response = await apiRequest("POST", "/api/auth/signup", {
        ...data,
        selectedPlan,
      });
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Welcome to AI Nomads!",
        description: "Your account has been created successfully. Starting your 3-day free trial...",
      });
      // Store token and redirect to dashboard
      localStorage.setItem("token", data.token);
      window.location.href = "/dashboard";
    },
    onError: (error: any) => {
      toast({
        title: "Sign up failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: SignupForm) => {
    signupMutation.mutate(data);
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      toast({
        title: "Wallet Connected",
        description: "MetaMask wallet connected successfully",
      });
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Failed to connect MetaMask wallet",
        variant: "destructive",
      });
    }
  };

  const selectedPlanData = subscriptionPlans.find(plan => plan.id === selectedPlan);

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(34,197,94,0.1)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]"></div>
        </div>

        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Tron Lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-emerald-400/50 to-transparent"></div>
        <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-purple-400/50 to-transparent"></div>
        <div className="absolute left-0 top-1/3 w-full h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
      </div>

      <Navigation />

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-6 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">Free Developer Plan Available • No Credit Card Required</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
              Join the
              <span className="block bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                AI Revolution
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
              Unlock the power of AI agents and automate your digital life. Start your journey to becoming an AI Nomad today.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Left: Subscription Plans */}
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl font-bold text-white mb-4">Choose Your Plan</h2>
                <p className="text-gray-400">Start with a 3-day free trial, then continue with your preferred plan</p>
              </div>

              <div className="space-y-4">
                {subscriptionPlans.map((plan) => (
                  <div
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative group cursor-pointer transition-all duration-300 ${
                      selectedPlan === plan.id
                        ? `ring-2 ring-${plan.glowColor} shadow-lg shadow-${plan.glowColor}/25`
                        : 'hover:ring-1 hover:ring-gray-600'
                    }`}
                  >
                    <Card className={`bg-black/40 border-gray-800 backdrop-blur-sm overflow-hidden ${
                      selectedPlan === plan.id ? 'border-' + plan.glowColor : ''
                    }`}>
                      <CardHeader className="relative">
                        {plan.popular && (
                          <Badge className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none">
                            <Crown className="w-3 h-3 mr-1" />
                            Most Popular
                          </Badge>
                        )}
                        
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                            <CardDescription className="text-gray-400 mt-1">{plan.description}</CardDescription>
                            <p className="text-gray-500 text-sm mt-2">{plan.longDescription}</p>
                          </div>
                          
                          <div className="text-right ml-4">
                            {plan.price === null ? (
                              <div className="text-2xl font-bold text-white">Custom</div>
                            ) : plan.price === 0 ? (
                              <div className="text-2xl font-bold text-emerald-400">Free</div>
                            ) : (
                              <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-white">${plan.price}</span>
                                <span className="text-gray-400">/month</span>
                              </div>
                            )}
                            <div className="text-xs text-gray-500 mt-1">{plan.pricing}</div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <ul className="space-y-3">
                          {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-3 text-gray-300">
                              <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                    
                    {/* Selection Indicator */}
                    {selectedPlan === plan.id && (
                      <div className={`absolute -inset-0.5 bg-gradient-to-r ${plan.gradient} rounded-lg blur opacity-30 -z-10 group-hover:opacity-40 transition-opacity`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Signup Form */}
            <div className="lg:pl-8">
              <Card className="bg-black/60 border-gray-800 backdrop-blur-xl shadow-2xl">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl text-white">Create Your Account</CardTitle>
                  <CardDescription className="text-gray-400">
                    Join thousands of AI Nomads building the future
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* MetaMask Connection */}
                    <div className="p-4 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Wallet className="w-5 h-5 text-orange-400" />
                          <div>
                            <p className="text-sm font-medium text-white">MetaMask Wallet</p>
                            <p className="text-xs text-gray-400">Secure Web3 authentication</p>
                          </div>
                        </div>
                        {isConnected ? (
                          <Badge variant="secondary" className="bg-emerald-900/20 text-emerald-400 border-emerald-700/50">
                            <Shield className="w-3 h-3 mr-1" />
                            Connected
                          </Badge>
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={handleConnectWallet}
                            className="border-orange-700/50 text-orange-400 hover:bg-orange-900/20"
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            Connect
                          </Button>
                        )}
                      </div>
                      {isConnected && address && (
                        <p className="text-xs text-gray-500 mt-2 font-mono bg-black/20 rounded px-2 py-1">
                          {address.slice(0, 8)}...{address.slice(-6)}
                        </p>
                      )}
                    </div>

                    {/* Personal Information */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName" className="text-gray-300 text-sm font-medium">First Name</Label>
                        <Input
                          id="firstName"
                          {...register("firstName")}
                          className="bg-gray-900/50 border-gray-700 text-white mt-1 focus:border-emerald-500 transition-colors"
                          placeholder="Alex"
                        />
                        {errors.firstName && (
                          <p className="text-red-400 text-xs mt-1">{errors.firstName.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName" className="text-gray-300 text-sm font-medium">Last Name</Label>
                        <Input
                          id="lastName"
                          {...register("lastName")}
                          className="bg-gray-900/50 border-gray-700 text-white mt-1 focus:border-emerald-500 transition-colors"
                          placeholder="Nomad"
                        />
                        {errors.lastName && (
                          <p className="text-red-400 text-xs mt-1">{errors.lastName.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Username */}
                    <div>
                      <Label htmlFor="username" className="text-gray-300 text-sm font-medium">Username</Label>
                      <div className="relative mt-1">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="username"
                          {...register("username")}
                          className="bg-gray-900/50 border-gray-700 text-white pl-10 focus:border-emerald-500 transition-colors"
                          placeholder="alexnomad"
                        />
                      </div>
                      {errors.username && (
                        <p className="text-red-400 text-xs mt-1">{errors.username.message}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email" className="text-gray-300 text-sm font-medium">Email Address</Label>
                      <div className="relative mt-1">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                          id="email"
                          type="email"
                          {...register("email")}
                          className="bg-gray-900/50 border-gray-700 text-white pl-10 focus:border-emerald-500 transition-colors"
                          placeholder="alex@example.com"
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Phone and Date of Birth */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phoneNumber" className="text-gray-300 text-sm font-medium">Phone Number</Label>
                        <div className="relative mt-1">
                          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            id="phoneNumber"
                            type="tel"
                            {...register("phoneNumber")}
                            className="bg-gray-900/50 border-gray-700 text-white pl-10 focus:border-emerald-500 transition-colors"
                            placeholder="+1234567890"
                          />
                        </div>
                        {errors.phoneNumber && (
                          <p className="text-red-400 text-xs mt-1">{errors.phoneNumber.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="dateOfBirth" className="text-gray-300 text-sm font-medium">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          {...register("dateOfBirth")}
                          className="bg-gray-900/50 border-gray-700 text-white mt-1 focus:border-emerald-500 transition-colors [color-scheme:dark]"
                        />
                        {errors.dateOfBirth && (
                          <p className="text-red-400 text-xs mt-1">{errors.dateOfBirth.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Password Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="password" className="text-gray-300 text-sm font-medium">Password</Label>
                        <div className="relative mt-1">
                          <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            {...register("password")}
                            className="bg-gray-900/50 border-gray-700 text-white pr-10 focus:border-emerald-500 transition-colors"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.password && (
                          <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="confirmPassword" className="text-gray-300 text-sm font-medium">Confirm Password</Label>
                        <div className="relative mt-1">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            {...register("confirmPassword")}
                            className="bg-gray-900/50 border-gray-700 text-white pr-10 focus:border-emerald-500 transition-colors"
                            placeholder="••••••••"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                          >
                            {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Selected Plan Summary */}
                    {selectedPlanData && (
                      <div className="p-4 bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">{selectedPlanData.name}</p>
                            <p className="text-gray-400 text-sm">
                              {selectedPlanData.price === null ? 'Custom pricing' : 
                               selectedPlanData.price === 0 ? 'Free forever' : 
                               `$${selectedPlanData.price}/month`}
                            </p>
                          </div>
                          <Badge variant="secondary" className="bg-emerald-900/20 text-emerald-400 border-emerald-700/50">
                            Selected
                          </Badge>
                        </div>
                      </div>
                    )}

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={signupMutation.isPending}
                      className="w-full bg-gradient-to-r from-emerald-500 to-blue-600 hover:from-emerald-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
                    >
                      {signupMutation.isPending ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating Account...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span>Start Free Trial</span>
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </Button>

                    {/* Terms */}
                    <p className="text-center text-xs text-gray-500">
                      By creating an account, you agree to our{" "}
                      <a href="/terms" className="text-emerald-400 hover:underline">Terms of Service</a>{" "}
                      and{" "}
                      <a href="/privacy" className="text-emerald-400 hover:underline">Privacy Policy</a>
                    </p>
                  </form>
                </CardContent>
              </Card>

              {/* Sign In Link */}
              <div className="text-center mt-6">
                <p className="text-gray-400">
                  Already have an account?{" "}
                  <Link href="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors">
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}