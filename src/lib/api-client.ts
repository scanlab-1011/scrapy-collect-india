import { supabase, isSupabaseConfigured } from './supabase';
import { toast } from '@/components/ui/sonner';

// Error class for API errors
export class ApiError extends Error {
  status: number;
  
  constructor(message: string, status = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// Base API client for handling API calls
export class ApiClient {
  private static checkSupabaseConfig() {
    if (!isSupabaseConfigured()) {
      throw new ApiError('Supabase is not properly configured. Please set environment variables.', 401);
    }
  }

  // Authentication methods
  static async login(email: string, password: string) {
    this.checkSupabaseConfig();
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Authentication error:', error);
        throw new ApiError(error.message, 401);
      }

      return data;
    } catch (error: any) {
      console.error('Login error details:', error);
      if (error?.message?.includes('JSON object requested') || 
          error?.code === 'PGRST116') {
        throw new ApiError('User profile not found. Please check your credentials or sign up.', 404);
      }
      throw error;
    }
  }

  static async signup(email: string, password: string, metadata?: any) {
    this.checkSupabaseConfig();
    
    try {
      console.log("API Client signup with metadata:", metadata);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });

      if (error) {
        console.error('Signup error:', error);
        throw new ApiError(error.message, 400);
      }

      // Explicitly set user role in the users table
      if (data.user) {
        const { error: userError } = await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            email: email,
            name: metadata?.name,
            phone: metadata?.phone,
            role: metadata?.role || 'SELLER'
          }]);
          
        if (userError) {
          console.error('Error creating user profile:', userError);
          throw new ApiError(userError.message, 500);
        }
      }

      return data;
    } catch (error: any) {
      console.error('Signup error details:', error);
      throw error;
    }
  }

  static async logout() {
    this.checkSupabaseConfig();
    
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      console.error('Logout error:', error);
      throw new ApiError(error.message, 500);
    }
    
    return true;
  }

  // Listings methods
  static async createListing(listingData: any, userId: string, images: File[] = []) {
    this.checkSupabaseConfig();
    
    try {
      // Upload images to Supabase storage if provided
      const imageUrls = [];
      if (images && images.length > 0) {
        for (const image of images) {
          const fileExt = image.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          const filePath = `listings/${userId}/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('scrap-images')
            .upload(filePath, image);
            
          if (uploadError) throw uploadError;
          
          const { data } = supabase.storage
            .from('scrap-images')
            .getPublicUrl(filePath);
            
          imageUrls.push(data.publicUrl);
        }
      }
      
      // Save listing to database
      const { data, error } = await supabase
        .from('listings')
        .insert([
          {
            title: listingData.title,
            category: listingData.category,
            estimated_kg: listingData.estimatedKg,
            price_per_kg: listingData.pricePerKg,
            location: listingData.location,
            images: imageUrls.length ? imageUrls : null,
            status: 'PENDING',
            seller_id: userId
          }
        ])
        .select()
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error("Error creating listing:", error);
      throw new ApiError(error.message || "Failed to create listing", 500);
    }
  }

  static async getListings(options: { userId?: string, status?: string } = {}) {
    this.checkSupabaseConfig();
    
    try {
      let query = supabase
        .from('listings')
        .select('*');
      
      if (options.userId) {
        query = query.eq('seller_id', options.userId);
      }
      
      if (options.status) {
        query = query.eq('status', options.status);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data || [];
    } catch (error: any) {
      console.error("Error fetching listings:", error);
      throw new ApiError(error.message || "Failed to fetch listings", 500);
    }
  }

  static async getListing(id: string) {
    this.checkSupabaseConfig();
    
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();
        
      if (error) throw error;
      
      return data;
    } catch (error: any) {
      console.error(`Error fetching listing ${id}:`, error);
      throw new ApiError(error.message || "Failed to fetch listing", 500);
    }
  }
}
