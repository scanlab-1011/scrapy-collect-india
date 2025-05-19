
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
  supabaseUrl || 'https://placeholder-only-for-development.supabase.co',
  supabaseKey || 'placeholder-only-for-development',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
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
