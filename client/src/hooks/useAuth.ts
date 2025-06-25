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

  // If there's an error or no user but we have a token, clear the token
  if (error && token) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !!token,
  };
}