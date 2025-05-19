
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

// Create the Supabase client
export const supabase = createClient(
  supabaseUrl || 'https://placeholder-only-for-development.supabase.co',
  supabaseKey || 'placeholder-only-for-development'
);

// Helper function to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return !!(supabaseUrl && supabaseKey);
};

// Helper to get current session
export const getCurrentSession = async () => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase not configured, cannot get session');
    return null;
  }
  
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  
  return data.session;
};

// Helper to get current user
export const getCurrentUser = async () => {
  if (!isSupabaseConfigured()) {
    console.error('Supabase not configured, cannot get user');
    return null;
  }
  
  const { data, error } = await supabase.auth.getUser();
  
  if (error) {
    console.error('Error getting user:', error);
    return null;
  }
  
  return data.user;
};
