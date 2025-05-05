import { createContext } from 'react';

// Define User interface (or import if defined elsewhere)
interface User {
  id: number;
  name: string;
  email: string;
}

// Define and export AuthContextType
export interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, passwordConfirmation: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Define and export AuthContext
export const AuthContext = createContext<AuthContextType | null>(null);