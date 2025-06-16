import { useState, useEffect } from "react";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface AuthState {
  isAuthenticated: boolean | null;
  isLoading: boolean;
  userId: number | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: null,
    isLoading: true,
    userId: null,
  });

  const checkAuthStatus = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      const response = await axios.get(`${backendUrl}/auth/me`, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setAuthState({
          isAuthenticated: response.data.loggedIn,
          isLoading: false,
          userId: response.data.userId || null,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          userId: null,
        });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        userId: null,
      });
    }
  };



  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  return {
    ...authState,
    checkAuthStatus,    
    refetch: checkAuthStatus,
  };
};
