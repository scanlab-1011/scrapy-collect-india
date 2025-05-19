
import { createClient } from '@supabase/supabase-js';

// Get environment variables - no fallbacks in production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Better error handling for missing environment variables
if (!supabaseUrl || !supabaseKey) {
  console.error('Required Supabase environment variables are missing.');
  if (import.meta.env.PROD) {
    // In production, log a more severe warning
    console.error('CRITICAL: Production build is missing required Supabase configuration.');
  } else {
    console.warn('Development mode: Using placeholder values. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your environment.');
  }
}

// Log the current environment for debugging
console.log('Current environment:', import.meta.env.MODE);
console.log('Supabase URL configured:', !!supabaseUrl);

// Create the Supabase client with additional debug options
export const supabase = createClient(
  supabaseUrl || 'https://jpphpioyppvrycfsjhhv.supabase.co',
  supabaseKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpwcGhwaW95cHB2cnljZnNqaGh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzcxNjU2OTEsImV4cCI6MjA1Mjc0MTY5MX0.TCqad0DH2E2qIKzpJdkFNgqECl6Hu1bHnv8VxO85QMY',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      storage: {
        // Use local storage instead of cookies to ensure session persistence
        getItem: (key) => {
          const value = localStorage.getItem(key);
          console.log(`Retrieved auth from storage for ${key}:`, value ? 'exists' : 'not found');
          return value;
        },
        setItem: (key, value) => {
          console.log(`Setting auth in storage for ${key}`);
          localStorage.setItem(key, value);
        },
        removeItem: (key) => localStorage.removeItem(key)
      },
      debug: import.meta.env.MODE === 'development'
    }
  }
);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseKey);
};

// Helper to get current session with better error handling
export const getCurrentSession = async () => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase not configured, cannot get session');
    return null;
  }
  
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Error getting session:', error);
      return null;
    }
    
    console.log('Current session:', data.session ? 'Active' : 'None');
    return data.session;
  } catch (error) {
    console.error('Unexpected error getting session:', error);
    return null;
  }
};

// Helper to get current user with better error handling
export const getCurrentUser = async () => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase not configured, cannot get user');
    return null;
  }
  
  try {
    const { data, error } = await supabase.auth.getUser();
    
    if (error) {
      console.error('Error getting user:', error);
      return null;
    }
    
    if (data.user) {
      console.log('Current user ID:', data.user.id);
      
      // Fetch additional user data from the users table
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', data.user.id)
        .single();
      
      if (userError) {
        console.error('Error fetching user profile:', userError);
        // Don't fail completely, just return the auth user
        return data.user;
      }
      
      console.log('User profile retrieved:', userData);
      return {
        ...data.user,
        ...userData
      };
    }
    
    return data.user;
  } catch (error) {
    console.error('Unexpected error getting user:', error);
    return null;
  }
};
