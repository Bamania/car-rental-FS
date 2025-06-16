import { useState, useEffect } from 'react';
import axios from 'axios';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

interface AuthState {
  isAuthenticated: boolean | null;
  isLoading: boolean;
  user: any | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: null,
    isLoading: true,
    user: null
  });

  const checkAuthStatus = async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const response = await axios.get(`${backendUrl}/auth/me`, {
        withCredentials: true, 
      });

      if (response.status === 200) {
        setAuthState({
          isAuthenticated: response.data.loggedIn,
          isLoading: false,
          user: response.data.user || null
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null
        });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null
      });
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${backendUrl}/auth/logout`, {}, {
        withCredentials: true
      });
      
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Check auth status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  return {
    ...authState,
    checkAuthStatus,
    logout,
    refetch: checkAuthStatus 
  };
};