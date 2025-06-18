import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";
import PhoneVerification from "@/components/phone-verification";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Wallet, User, Shield, CheckCircle, Phone, Mail, Eye, EyeOff } from "lucide-react";
import { Link, useLocation } from "wouter";

const signupSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  username: z.string().min(3, "Username must be at least 3 characters").max(20, "Username must be less than 20 characters"),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phoneNumber: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  walletAddress: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupForm = z.infer<typeof signupSchema>;

export default function SignupNew() {
  const [, setLocation] = useLocation();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const { connectWallet, address, isConnected } = useWallet();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SignupForm>({
    resolver: zodResolver(signupSchema),
  });

  const signupMutation = useMutation({
    mutationFn: async (data: SignupForm & { walletAddress?: string }) => {
      return await apiRequest("POST", "/api/auth/signup", data);
    },
    onSuccess: (data: any) => {
      setUserId(data.user.id);
      setStep(2);
      toast({
        title: "Account created successfully!",
        description: "Please verify your phone number to continue.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Signup failed",
        description: error.message || "An error occurred during signup",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: SignupForm) => {
    console.log("Form submitted with data:", data);
    console.log("Form errors:", errors);
    
    // Log if form has validation errors
    if (Object.keys(errors).length > 0) {
      console.log("Form validation errors detected:", errors);
      return;
    }
    
    try {
      console.log("Calling signup mutation...");
      const result = await signupMutation.mutateAsync({
        ...data,
        walletAddress: isConnected && address ? address : undefined,
      });
      console.log("Signup result:", result);
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const handlePhoneVerified = () => {
    setIsPhoneVerified(true);
    setStep(3);
    toast({
      title: "Phone verified successfully!",
      description: "Your account is now complete. Welcome to AI Nomads!",
    });
    
    // Redirect to dashboard after successful signup
    setTimeout(() => {
      setLocation("/dashboard");
    }, 2000);
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
      toast({
        title: "Wallet connected",
        description: "Your MetaMask wallet has been connected successfully.",
      });
    } catch (error) {
      toast({
        title: "Wallet connection failed",
        description: "Please make sure MetaMask is installed and try again.",
        variant: "destructive",
      });
    }
  };

  if (step === 2 && userId) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_50%)]" />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <div className="w-full max-w-md">
            <PhoneVerification
              userId={userId}
              phoneNumber={watch("phoneNumber")}
              onVerified={handlePhoneVerified}
            />
          </div>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_50%)]" />
        </div>

        <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
          <Card className="w-full max-w-md bg-black/40 border-gray-800 backdrop-blur-sm">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 bg-emerald-900/20 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-emerald-400" />
              </div>
              <CardTitle className="text-2xl text-white">Welcome to AI Nomads!</CardTitle>
              <CardDescription className="text-gray-400">
                Your account has been created and verified successfully.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-sm text-gray-400 mb-4">
                  You'll be redirected to your dashboard shortly...
                </p>
                <Button asChild className="w-full bg-emerald-900/40 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/60">
                  <Link href="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.05),transparent_50%)]" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="w-full max-w-4xl grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Marketing content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl lg:text-5xl font-light text-white mb-4">
                Join the Future of
                <span className="block bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  AI Automation
                </span>
              </h1>
              <p className="text-gray-400 text-lg">
                Deploy intelligent agents, manage smart contracts, and scale your business with AI-powered automation.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-900/20 rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="text-gray-300">Secure Web3 integration with MetaMask</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-900/20 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-gray-300">Personalized dashboard with AI insights</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-900/20 rounded-full flex items-center justify-center">
                  <Phone className="w-4 h-4 text-purple-400" />
                </div>
                <span className="text-gray-300">SMS verification for enhanced security</span>
              </div>
            </div>

            <div className="p-6 bg-gray-900/40 border border-gray-700 rounded-lg backdrop-blur-sm">
              <h3 className="text-white font-medium mb-2">Already have an account?</h3>
              <p className="text-gray-400 text-sm mb-4">
                Sign in to access your agents, contracts, and dashboard.
              </p>
              <Button asChild variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>

          {/* Right side - Signup form */}
          <Card className="bg-black/40 border-gray-800 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Create Your Account</CardTitle>
              <CardDescription className="text-gray-400">
                Get started with AI Nomads in just a few steps
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {/* MetaMask Connection */}
                <div className="p-4 bg-gray-900/40 border border-gray-700 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Wallet className="w-5 h-5 text-orange-400" />
                      <div>
                        <p className="text-sm font-medium text-white">MetaMask Wallet</p>
                        <p className="text-xs text-gray-400">Optional but recommended</p>
                      </div>
                    </div>
                    {isConnected ? (
                      <Badge variant="secondary" className="bg-emerald-900/20 text-emerald-400 border-emerald-700/50">
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
                        Connect
                      </Button>
                    )}
                  </div>
                  {isConnected && address && (
                    <p className="text-xs text-gray-500 mt-2 font-mono">
                      {address.slice(0, 6)}...{address.slice(-4)}
                    </p>
                  )}
                </div>

                {/* Personal Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                    <Input
                      id="firstName"
                      {...register("firstName")}
                      className="bg-gray-900/40 border-gray-700 text-white"
                      placeholder="John"
                    />
                    {errors.firstName && (
                      <p className="text-red-400 text-sm mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                    <Input
                      id="lastName"
                      {...register("lastName")}
                      className="bg-gray-900/40 border-gray-700 text-white"
                      placeholder="Doe"
                    />
                    {errors.lastName && (
                      <p className="text-red-400 text-sm mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Account Details */}
                <div>
                  <Label htmlFor="username" className="text-gray-300">Username</Label>
                  <Input
                    id="username"
                    {...register("username")}
                    className="bg-gray-900/40 border-gray-700 text-white"
                    placeholder="johndoe"
                  />
                  {errors.username && (
                    <p className="text-red-400 text-sm mt-1">{errors.username.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      {...register("email")}
                      className="bg-gray-900/40 border-gray-700 text-white pl-10"
                      placeholder="john@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="phoneNumber" className="text-gray-300">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="phoneNumber"
                      type="tel"
                      {...register("phoneNumber")}
                      className="bg-gray-900/40 border-gray-700 text-white pl-10"
                      placeholder="+1234567890"
                    />
                  </div>
                  {errors.phoneNumber && (
                    <p className="text-red-400 text-sm mt-1">{errors.phoneNumber.message}</p>
                  )}
                </div>

                {/* Password Fields */}
                <div>
                  <Label htmlFor="password" className="text-gray-300">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      {...register("password")}
                      className="bg-gray-900/40 border-gray-700 text-white pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1">{errors.password.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      {...register("confirmPassword")}
                      className="bg-gray-900/40 border-gray-700 text-white pr-10"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-sm mt-1">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={signupMutation.isPending}
                  className="w-full bg-emerald-900/40 border border-emerald-700/50 text-emerald-300 hover:bg-emerald-900/60"
                >
                  {signupMutation.isPending ? "Creating Account..." : "Create Account"}
                </Button>

                <p className="text-center text-xs text-gray-500">
                  By creating an account, you agree to our Terms of Service and Privacy Policy.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}