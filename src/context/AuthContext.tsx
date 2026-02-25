import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContextType, User } from '../types';
import { isValidEmail, isValidPassword, isNonEmpty } from '../utils/validation';
import { findUserByEmail, addUser, loadUsers } from '../utils/mockDb';

const SESSION_KEY = '@auth_user';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        await loadUsers();
        const raw = await AsyncStorage.getItem(SESSION_KEY);
        if (raw) setUser(JSON.parse(raw));
      } catch {
        // session unreadable — stay logged out
      } finally {
        setIsRestoring(false);
      }
    };
    restoreSession();
  }, []);

  const persistUser = async (u: User) => {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(u));
    setUser(u);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      if (!isValidEmail(email)) throw new Error('Invalid email format');
      if (!isValidPassword(password)) throw new Error('Password must be at least 6 characters');

      await new Promise<void>(resolve => setTimeout(() => resolve(), 400));

      const existing = findUserByEmail(email);
      if (!existing || existing.password !== password) throw new Error('Incorrect email or password');

      await persistUser({ id: existing.id, name: existing.name, email: existing.email });
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      if (!isNonEmpty(name)) throw new Error('Name is required');
      if (!isValidEmail(email)) throw new Error('Invalid email format');
      if (!isValidPassword(password)) throw new Error('Password must be at least 6 characters');

      await new Promise<void>(resolve => setTimeout(() => resolve(), 400));

      if (findUserByEmail(email)) throw new Error('Email already in use');

      const created = await addUser(name, email, password);
      await persistUser({ id: created.id, name: created.name, email: created.email });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await AsyncStorage.removeItem(SESSION_KEY);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isRestoring, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
