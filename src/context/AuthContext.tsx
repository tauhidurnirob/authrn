import React, { createContext, useState, useContext } from 'react';
import { AuthContextType, User } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
    setIsLoading(false);
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    setUser(null);
    await new Promise<void>(resolve => setTimeout(() => resolve(), 300));
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
