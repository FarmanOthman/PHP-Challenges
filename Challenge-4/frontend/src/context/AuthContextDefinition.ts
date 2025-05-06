import { createContext } from 'react';
import type { User } from '../types/chat';

// Define and export AuthContextType
export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => void;
}

// Define and export AuthContext
export const AuthContext = createContext<AuthContextType | null>(null);