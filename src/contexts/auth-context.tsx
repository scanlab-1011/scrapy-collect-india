
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { getCurrentUser, setCurrentUser, loginUser, logoutUser } from '@/lib/data';
import { toast } from '@/components/ui/sonner';

interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  logout: () => {},
  isLoading: true
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string) => {
    try {
      setIsLoading(true);
      const user = loginUser(email);
      setUser(user);
      toast.success(`Welcome back, ${user.name || user.email}!`);
    } catch (error) {
      toast.error("Login failed. Please check your email.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    toast.info("You've been logged out");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// Hook to get current user (with proper typing)
export function useCurrentUser(): User | null {
  const { user } = useAuth();
  return user;
}

// Check if user has specific role
export function useHasRole(role: UserRole): boolean {
  const user = useCurrentUser();
  return user?.role === role;
}

// Check if user is staff or admin
export function useIsStaffOrAdmin(): boolean {
  const user = useCurrentUser();
  return user?.role === UserRole.STAFF || user?.role === UserRole.ADMIN;
}
