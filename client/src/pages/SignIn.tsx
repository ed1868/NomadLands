import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { Eye, EyeOff, Lock, User, Brain } from "lucide-react";

export default function SignIn() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/auth/signin", formData);
      const data = await response.json();

      if (data.user && data.token) {
        // Store the JWT token in localStorage
        localStorage.setItem('token', data.token);
        
        toast({
          title: "Welcome back",
          description: "Successfully signed in to AI Nomads",
        });
        
        // Invalidate auth queries to refresh state
        queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
        
        // Redirect to dashboard
        setLocation("/dashboard");
      } else {
        throw new Error(data.message || "Sign in failed");
      }
    } catch (error: any) {
      toast({
        title: "Sign in failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 via-black to-emerald-800/10" />
      
      {/* Neural network background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 border border-emerald-500/20 rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 border border-emerald-400/20 rounded-full animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-128 h-128 border border-emerald-600/10 rounded-full animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-4 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <Brain className="w-12 h-12 text-emerald-400" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Welcome Back</h1>
              <p className="text-gray-400">Sign in to your AI Nomads account</p>
            </div>
          </div>

          {/* Sign in form */}
          <Card className="bg-gray-900/50 border-gray-800 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl text-center text-white">Sign In</CardTitle>
              <CardDescription className="text-center text-gray-400">
                Enter your credentials to access your command center
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-200">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleInputChange}
                      className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="Enter your username"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-200">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10 bg-gray-800/50 border-gray-700 text-white placeholder-gray-500 focus:border-emerald-500 focus:ring-emerald-500"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              {/* Demo credentials info */}
              <div className="mt-6 p-4 bg-emerald-900/20 border border-emerald-500/20 rounded-lg">
                <p className="text-sm text-emerald-400 font-medium mb-2">Demo Credentials:</p>
                <p className="text-xs text-gray-300">Username: test</p>
                <p className="text-xs text-gray-300">Password: testing</p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-gray-400">
            <p>New to AI Nomads? <span className="text-emerald-400 hover:text-emerald-300 cursor-pointer">Create an account</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}