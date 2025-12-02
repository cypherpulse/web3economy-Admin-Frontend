import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, Admin } from '@/lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  admin: Admin | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = api.token.getToken();
      if (token) {
        try {
          const response = await api.admin.getProfile();
          if (response.success && response.data) {
            setIsAuthenticated(true);
            setAdmin(response.data);
          } else {
            api.token.clearToken();
          }
        } catch (error) {
          api.token.clearToken();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.admin.login(email, password);
      if (response.success && response.data) {
        api.token.setToken(response.data.token);
        setIsAuthenticated(true);
        setAdmin(response.data.admin);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    api.token.clearToken();
    setIsAuthenticated(false);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, admin, isLoading, login, logout }}>
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
