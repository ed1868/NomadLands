import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("growth");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: ""
  });

  const plans = [
    {
      id: "startup",
      name: "Startup",
      price: 99,
      description: "Perfect for individual professionals",
      features: ["3 AI Agents", "Basic Support", "API Access", "Community Forum"],
      gradient: "emerald-knight"
    },
    {
      id: "growth",
      name: "Growth",
      price: 299,
      description: "For growing teams and businesses",
      features: ["10 AI Agents", "Priority Support", "Advanced Analytics", "Team Collaboration"],
      gradient: "obsidian-gradient",
      popular: true
    },
    {
      id: "enterprise",
      name: "Enterprise",
      price: 999,
      description: "For large organizations",
      features: ["Unlimited Agents", "24/7 Support", "Custom Integrations", "Dedicated Manager"],
      gradient: "shadow-gradient"
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
            <h3 className="text-xl font-light text-gray-200 mb-8">Choose Your Arsenal</h3>
            <div className="space-y-4">
              {plans.map((plan) => (
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
                  
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-light text-gray-200">{plan.name}</h4>
                      <p className="text-gray-500 text-sm font-extralight">{plan.description}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-extralight knight-text">${plan.price}</span>
                      <span className="text-gray-500 text-sm font-extralight block">/month</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-gray-400 text-sm">
                        <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full mr-3"></div>
                        {feature}
                      </div>
                    ))}
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
              ))}
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