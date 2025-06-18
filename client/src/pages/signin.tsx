import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Eye, EyeOff, ArrowRight, Wallet, Sparkles } from "lucide-react";
import { useLocation, Link } from "wouter";
import { useWallet } from "@/hooks/use-wallet";
import Navigation from "@/components/navigation";

const signinSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type SigninForm = z.infer<typeof signinSchema>;

export default function Signin() {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { isConnected, address, connectWallet } = useWallet();

  const form = useForm<SigninForm>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const signinMutation = useMutation({
    mutationFn: async (data: SigninForm) => {
      const response = await apiRequest("POST", "/api/auth/signin", data);
      const result = await response.json();
      
      if (result.token) {
        localStorage.setItem("token", result.token);
      }
      
      return result;
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "You have been signed in successfully.",
      });
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error", 
        description: error.message || "Failed to sign in. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: SigninForm) => {
    signinMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects - Same as signup page */}
      <div className="absolute inset-0">
        {/* Main Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=2125&auto=format&fit=crop')",
          }}
        />
        
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900/95 to-black"></div>
        
        {/* Animated Background Particles */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-blue-400 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-2000"></div>
          <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-emerald-400 rounded-full animate-pulse delay-3000"></div>
          <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-blue-300 rounded-full animate-pulse delay-4000"></div>
          <div className="absolute bottom-1/3 right-1/2 w-1.5 h-1.5 bg-purple-300 rounded-full animate-pulse delay-5000"></div>
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

      <div className="relative z-10 container mx-auto px-6 py-12 pt-24">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-6 py-2 mb-6">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">Welcome Back</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
              <span className="block bg-gradient-to-r from-emerald-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                Sign In
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 max-w-md mx-auto leading-relaxed">
              Access your AI agent dashboard
            </p>
          </div>

          {/* Sign In Form */}
          <Card className="bg-gray-900/40 border-gray-700/50 backdrop-blur-sm shadow-2xl">
            <CardContent className="p-8">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-300 font-medium">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    {...form.register("username")}
                    className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-emerald-400 h-12"
                  />
                  {form.formState.errors.username && (
                    <p className="text-red-400 text-sm">{form.formState.errors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-300 font-medium">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...form.register("password")}
                      className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:border-emerald-400 pr-12 h-12"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                  {form.formState.errors.password && (
                    <p className="text-red-400 text-sm">{form.formState.errors.password.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 text-white font-medium py-3 h-12 rounded-lg transition-all duration-300"
                  disabled={signinMutation.isPending}
                >
                  {signinMutation.isPending ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Signing In...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <span>Sign In</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  )}
                </Button>

                {/* Connect Wallet Button */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-gray-600" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-900 px-2 text-gray-400">Or</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={connectWallet}
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white h-12 transition-all duration-300"
                >
                  <div className="flex items-center space-x-2">
                    <Wallet className="w-4 h-4" />
                    <span>
                      {isConnected 
                        ? `Connected: ${address?.slice(0, 6)}...${address?.slice(-4)}` 
                        : "Connect Wallet"
                      }
                    </span>
                  </div>
                </Button>

                <div className="text-center">
                  <p className="text-gray-400 text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
                      Sign up here
                    </Link>
                  </p>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}