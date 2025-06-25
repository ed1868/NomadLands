import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLocation } from "wouter";

export default function SimpleLogin() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-white">Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-white">Username</Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                className="mt-1"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-white">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="mt-1"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-4 space-y-2">
            <Button 
              type="button" 
              variant="outline" 
              className="w-full"
              onClick={handleTestLogin}
            >
              Fill Test Credentials
            </Button>
            <div className="text-sm text-gray-400 text-center">
              <p>Test credentials:</p>
              <p>Username: test | Password: testing</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}