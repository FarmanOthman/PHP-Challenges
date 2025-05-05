import { useContext } from 'react';
// Import from the new definition file
import { AuthContext, AuthContextType } from '../context/AuthContextDefinition'; 

export const useAuth = (): AuthContextType => {
  // Use the imported AuthContext
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};