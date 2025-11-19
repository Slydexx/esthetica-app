
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  register: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  upgradeUser: (plan: 'single' | 'pro') => Promise<void>;
  updateCredits: (newCredits: number[]) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Auth init failed", error);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, pass: string) => {
    const user = await authService.signIn(email, pass);
    setUser(user);
  };

  const register = async (email: string, pass: string, name: string) => {
    const user = await authService.signUp(email, pass, name);
    setUser(user);
  };

  const logout = async () => {
    await authService.signOut();
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    await authService.resetPassword(email);
  };

  const upgradeUser = async (plan: 'single' | 'pro') => {
    if (!user) return;
    const updatedUser = await authService.updateToPremium(user.id, plan);
    setUser(updatedUser);
  };
  
  const updateCredits = (newCredits: number[]) => {
      if (user) {
          setUser({ ...user, regenCredits: newCredits });
      }
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, resetPassword, upgradeUser, updateCredits }}>
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
