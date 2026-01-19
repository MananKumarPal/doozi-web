'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name?: string;
  fullName?: string;
  username?: string;
  is_creator?: boolean;
  isCreator?: boolean;
  emailVerified?: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);
  const router = useRouter();

  const fetchUser = async () => {
    if (fetching) return;
    
    setFetching(true);
    try {
      const token = localStorage.getItem('auth-token');
      if (!token) {
        setUser(null);
        setLoading(false);
        setFetching(false);
        return;
      }

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        const userData = data.user || data.result?.user || data.data?.user;
        if (userData) {
          setUser({
            id: userData._id || userData.id || userData.user_id,
            email: userData.email,
            name: userData.full_name || userData.fullName || userData.name,
            fullName: userData.full_name || userData.fullName,
            username: userData.username,
            is_creator: userData.is_creator || userData.isCreator || false,
            isCreator: userData.is_creator || userData.isCreator || false,
            emailVerified: userData.email_verified || userData.emailVerified || false,
          });
        } else if (data.result) {
          setUser({
            id: data.result._id || data.result.id || data.result.user_id,
            email: data.result.email,
            name: data.result.full_name || data.result.fullName || data.result.name,
            fullName: data.result.full_name || data.result.fullName,
            username: data.result.username,
            is_creator: data.result.is_creator || data.result.isCreator || false,
            isCreator: data.result.is_creator || data.result.isCreator || false,
            emailVerified: data.result.email_verified || data.result.emailVerified || false,
          });
        }
      } else {
        localStorage.removeItem('auth-token');
        setUser(null);
      }
    } catch (error) {
      localStorage.removeItem('auth-token');
      setUser(null);
    } finally {
      setLoading(false);
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const refreshUser = async () => {
    await fetchUser();
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('auth-token');
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('auth-token');
      setUser(null);
      router.push('/');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, refreshUser, logout }}>
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
