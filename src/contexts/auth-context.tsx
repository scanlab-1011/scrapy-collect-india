
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { supabase } from '@/lib/supabase';
import { toast } from '@/components/ui/sonner';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string, phone?: string, role?: UserRole) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  isLoading: true
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initial load and session subscription
  useEffect(() => {
    console.log('AuthProvider: Initial setup');
    setIsLoading(true);
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Auth initial session check:', session ? 'Session found' : 'No session');
      if (session) {
        fetchUserProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    // Set up auth subscription
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state change event:', event);
        if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED')) {
          console.log('Auth state change: User signed in or token refreshed');
          fetchUserProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          console.log('Auth state change: User signed out');
          setUser(null);
          setIsLoading(false);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    return () => {
      console.log('Auth subscription cleanup');
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user profile from Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching user profile for:", userId);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error('Error fetching user profile:', error);
        
        // If we can't find the user record, try to get basic auth user
        const { data: authUser } = await supabase.auth.getUser();
        if (authUser.user) {
          console.log('Using auth user data as fallback');
          setUser({
            id: authUser.user.id,
            email: authUser.user.email || '',
            name: authUser.user.user_metadata?.name || '',
            phone: authUser.user.user_metadata?.phone || '',
            role: (authUser.user.user_metadata?.role as UserRole) || UserRole.SELLER,
            createdAt: new Date()
          });
        } else {
          throw error;
        }
      } else if (data) {
        console.log("User profile retrieved:", data);
        
        setUser({
          id: data.id,
          email: data.email,
          name: data.name,
          phone: data.phone,
          role: data.role as UserRole,
          createdAt: new Date(data.created_at)
        });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting login for:', email);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      if (data.user) {
        console.log('Login successful for user:', data.user.id);
        // Explicitly fetch user profile after login
        await fetchUserProfile(data.user.id);
      }
      
      toast.success("Logged in successfully!");
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || "Login failed. Please check your credentials.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name?: string, phone?: string, role: UserRole = UserRole.SELLER) => {
    try {
      setIsLoading(true);
      console.log('Attempting signup with role:', role);
      
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone,
            role
          }
        }
      });
      
      if (authError) throw authError;
      if (!authData.user) throw new Error("Failed to create user");
      
      console.log("Auth signup successful, creating user profile with ID:", authData.user.id);
      
      // Create user profile in the users table with explicitly specified role
      const { error: profileError } = await supabase.from('users').insert([
        {
          id: authData.user.id,
          email,
          name,
          phone,
          role: role, // Use the role parameter with default value
        }
      ]);
      
      if (profileError) {
        console.error("Error creating user profile:", profileError);
        throw profileError;
      }
      
      console.log("User profile created successfully");
      
      // Explicitly fetch user profile after signup
      await fetchUserProfile(authData.user.id);
      
      toast.success("Account created successfully!");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || "Signup failed. Please try again.");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      console.log('Logging out user');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('Logout successful');
      setUser(null);
      toast.info("You've been logged out");
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(error.message || "Failed to log out");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
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
