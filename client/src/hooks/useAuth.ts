import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema-simple";
import { getQueryFn } from "@/lib/queryClient";

export function useAuth() {
  const token = localStorage.getItem('token');
  
  const { data: user, isLoading, error } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    enabled: !!token, // Only fetch if we have a token
  });

  // If there's an auth error, clear tokens and force re-login
  if (error && token) {
    console.log("Auth error detected, clearing tokens");
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  }

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !!token,
    logout,
  };
}