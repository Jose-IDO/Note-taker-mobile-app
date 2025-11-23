import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { storageService } from '../services/storageService';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const currentUser = await storageService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const user = await storageService.loginUser(email, password);
      if (user) {
        setUser(user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (email: string, password: string, username: string): Promise<boolean> => {
    try {
      const success = await storageService.registerUser(email, password, username);
      if (success) {
        const user = await storageService.loginUser(email, password);
        if (user) {
          setUser(user);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await storageService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (email: string, username: string, password?: string): Promise<boolean> => {
    try {
      if (!user) return false;
      const success = await storageService.updateUser(user.id, email, username, password);
      if (success) {
        const updatedUser = await storageService.getCurrentUser();
        setUser(updatedUser);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Update user error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

