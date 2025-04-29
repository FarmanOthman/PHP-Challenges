import { useState, useEffect, ReactNode, useCallback } from 'react';
import { AuthAPI } from '../services/api';
import { AuthContext, User } from './AuthContextTypes';
import axios from 'axios';

// This file only exports the AuthProvider component, which is good for React Fast Refresh
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Use useCallback to prevent recreating this function unnecessarily
  const loadUserData = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await AuthAPI.getProfile();
      
      // Check if the response has the expected user data structure
      if (data && data.user) {
        setUser(data.user);
        console.log('User data loaded successfully:', data.user);
      } else {
        console.error('Invalid user data format:', data);
        // Don't clear token here - might be a temporary server issue
      }
    } catch (error: unknown) {
      console.error('Failed to load user data:', error);
      // Only remove the token if it's specifically an auth error (401)
      if (axios.isAxiosError(error) && error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Load user data on initial render if token exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      loadUserData();
    } else {
      setLoading(false);
    }
  }, [loadUserData]);

  const login = async (email: string, password: string) => {
    try {
      const response = await AuthAPI.login(email, password);
      
      console.log('Login response:', response.data);
      
      // Check if we got a valid token
      if (response?.data?.access_token) {
        localStorage.setItem('token', response.data.access_token);
        
        // The login response includes the user object directly
        if (response.data.user) {
          setUser(response.data.user);
          console.log('User set after login:', response.data.user);
        } else {
          // If for some reason user data is missing, fetch it
          await loadUserData();
        }
      } else {
        console.error('Login response missing token:', response);
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, password_confirmation: string) => {
    try {
      const response = await AuthAPI.register(name, email, password, password_confirmation);
      
      // Check if we got a valid token (might be access_token or token depending on your API)
      const token = response.data?.access_token || response.data?.token;
      
      if (token) {
        localStorage.setItem('token', token);
        
        // If user data came with registration response, use it
        if (response.data.user) {
          setUser(response.data.user);
        } else {
          // Otherwise fetch user data
          await loadUserData();
        }
      }
      
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AuthAPI.logout();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};