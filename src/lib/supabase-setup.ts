
import { supabase } from './supabase';
import { ScrapType, UserRole, ListingStatus } from '@/types';

// This function can be run once to set up the necessary tables and RLS policies
// You can run it from a component or during development
export async function setupSupabaseTables() {
  try {
    console.log('Setting up Supabase tables...');
    
    // Create users table
    const { error: usersTableError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'users',
      definition: `
        id uuid references auth.users not null primary key,
        email text not null unique,
        name text,
        phone text,
        role text not null default 'SELLER' check (role in ('SELLER', 'STAFF', 'ADMIN')),
        created_at timestamp with time zone default timezone('utc'::text, now()) not null
      `
    });
    
    if (usersTableError) throw usersTableError;
    
    // Create listings table
    const { error: listingsTableError } = await supabase.rpc('create_table_if_not_exists', {
      table_name: 'listings',
      definition: `
        id uuid default uuid_generate_v4() primary key,
        title text not null,
        category text not null check (category in ('IRON', 'COPPER', 'ALUMINIUM', 'BRASS', 'STEEL', 'PLASTIC_HDPE', 'PLASTIC_PET', 'PAPER', 'CARDBOARD', 'BOOKS', 'E_WASTE', 'GLASS', 'MIXED_METALS')),
        estimated_kg numeric not null,
        price_per_kg integer not null,
        location jsonb not null,
        images text[],
        status text not null default 'PENDING' check (status in ('PENDING', 'SCHEDULED', 'COLLECTED', 'CANCELLED')),
        pickup_at timestamp with time zone,
        actual_kg numeric,
        payout_txn_id text,
        seller_id uuid references users(id) not null,
        dispatcher_id uuid references users(id),
        created_at timestamp with time zone default timezone('utc'::text, now()) not null
      `
    });
    
    if (listingsTableError) throw listingsTableError;
    
    // Create storage bucket for scrap images
    const { error: bucketError } = await supabase.storage.createBucket('scrap-images', {
      public: true
    });
    
    if (bucketError && bucketError.message !== 'Bucket already exists') {
      throw bucketError;
    }
    
    // Set up RLS policies
    
    // Users table policies
    await supabase.rpc('create_policy_if_not_exists', {
      table_name: 'users',
      policy_name: 'Users can read their own profile',
      definition: `
        FOR SELECT USING (auth.uid() = id)
      `
    });
    
    await supabase.rpc('create_policy_if_not_exists', {
      table_name: 'users',
      policy_name: 'Staff can read all profiles',
      definition: `
        FOR SELECT USING (
          (SELECT role FROM users WHERE id = auth.uid()) IN ('STAFF', 'ADMIN')
        )
      `
    });
    
    // Listings table policies
    await supabase.rpc('create_policy_if_not_exists', {
      table_name: 'listings',
      policy_name: 'Sellers can create their own listings',
      definition: `
        FOR INSERT WITH CHECK (
          auth.uid() = seller_id AND 
          (SELECT role FROM users WHERE id = auth.uid()) = 'SELLER'
        )
      `
    });
    
    await supabase.rpc('create_policy_if_not_exists', {
      table_name: 'listings',
      policy_name: 'Sellers can read their own listings',
      definition: `
        FOR SELECT USING (
          auth.uid() = seller_id OR
          (SELECT role FROM users WHERE id = auth.uid()) IN ('STAFF', 'ADMIN')
        )
      `
    });
    
    await supabase.rpc('create_policy_if_not_exists', {
      table_name: 'listings',
      policy_name: 'Sellers can update their own pending listings',
      definition: `
        FOR UPDATE USING (
          auth.uid() = seller_id AND 
          status = 'PENDING' AND
          (SELECT role FROM users WHERE id = auth.uid()) = 'SELLER'
        )
      `
    });
    
    await supabase.rpc('create_policy_if_not_exists', {
      table_name: 'listings',
      policy_name: 'Staff can update any listing',
      definition: `
        FOR UPDATE USING (
          (SELECT role FROM users WHERE id = auth.uid()) IN ('STAFF', 'ADMIN')
        )
      `
    });
    
    // Storage policies for scrap-images bucket
    await supabase.rpc('create_storage_policy_if_not_exists', {
      bucket_name: 'scrap-images',
      policy_name: 'Avatar images are publicly accessible',
      definition: `
        FOR SELECT USING (true)
      `
    });
    
    await supabase.rpc('create_storage_policy_if_not_exists', {
      bucket_name: 'scrap-images',
      policy_name: 'Users can upload their own images',
      definition: `
        FOR INSERT WITH CHECK (
          (storage.foldername(name))[1] = auth.uid()::text
        )
      `
    });
    
    console.log('Supabase setup completed successfully!');
  } catch (error) {
    console.error('Error setting up Supabase:', error);
    throw error;
  }
}
