import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";

export function useAuth() {
  const token = localStorage.getItem('auth_token');
  
  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    retry: false,
    enabled: !!token, // Only fetch if we have a token
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !!token,
  };
}