import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useLocation } from "wouter";

export default function SimpleLogin() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Attempting login with:", formData);
      
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      console.log("Response status:", response.status);
      console.log("Response type:", typeof response);
      console.log("Response methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(response)));
      
      if (!response.ok) {
        let errorMessage = "Login failed";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (e) {
          console.error("Failed to parse error response:", e);
        }
        throw new Error(errorMessage);
      }

      let data;
      try {
        // Check if response has json method
        if (typeof response.json !== 'function') {
          console.error("Response object missing json method:", response);
          throw new Error("Invalid response object");
        }
        
        data = await response.json();
        console.log("Login response:", data);
      } catch (e) {
        console.error("Failed to parse response JSON:", e);
        console.error("Response object:", response);
        throw new Error("Invalid response format");
      }

      if (data.token && data.user) {
        // Clear any existing auth data first
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Set new auth data
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        
        console.log("Token stored:", localStorage.getItem("token"));
        
        // Force page redirect to dashboard
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 100);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = () => {
    setFormData({
      username: "test",
      password: "testing"
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250px_250px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-500/40 flex items-center justify-center">
              <div className="w-4 h-4 rounded-full bg-emerald-400"></div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
          <p className="text-gray-400">Sign in to your AI Nomads account</p>
        </div>

        {/* Login Card */}
        <Card className="bg-black/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-center text-white flex items-center justify-center gap-2">
              <LogIn className="h-5 w-5" />
              Sign In
            </CardTitle>
            <p className="text-center text-gray-400 text-sm">Enter your credentials to access your command center</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-300">Username</Label>
                <Input
                  id="username"
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="Enter your username"
                  className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Enter your password"
                    className="bg-gray-900/50 border-gray-700 text-white placeholder:text-gray-500 pr-10"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1 h-8 w-8 text-gray-400 hover:text-white"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded p-2">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            {/* Test Login Button */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black/50 px-2 text-gray-400">Quick Test</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={handleTestLogin}
              disabled={loading}
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
            >
              Login as Test User
            </Button>

            {/* Test Credentials Info */}
            <div className="text-center text-sm text-gray-500 space-y-1">
              <p>Demo Credentials:</p>
              <p>Username: test</p>
              <p>Password: testing</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            New to AI Nomads?{" "}
            <a href="/signup" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}