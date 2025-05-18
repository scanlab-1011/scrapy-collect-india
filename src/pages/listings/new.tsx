
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import AppLayout from '@/components/layout/app-layout';
import CreateListingWizard from '@/components/listing/create-listing-wizard';
import { UserRole } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export default function NewListing() {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  // Check if user is authenticated as a seller
  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        toast.error("You must be logged in to create listings");
        navigate('/login?redirect=/listings/new');
      } else if (user.role !== UserRole.SELLER) {
        toast.error("Only sellers can create listings");
        navigate('/');
      }
      
      // Check if Supabase is configured
      if (!isSupabaseConfigured()) {
        toast.error("Supabase is not properly configured. Please set environment variables.");
      }
    }
  }, [user, isLoading, navigate]);

  // Handler for form submission
  const handleCreateListing = async (listingData: any) => {
    try {
      // Validate Supabase configuration before attempting to use it
      if (!isSupabaseConfigured()) {
        toast.error("Cannot create listing: Supabase is not configured properly");
        return;
      }
      
      // Upload images to Supabase storage if provided
      const imageUrls = [];
      if (listingData.images && listingData.images.length > 0) {
        for (const image of listingData.images) {
          const fileExt = image.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          const filePath = `listings/${user?.id}/${fileName}`;
          
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
            seller_id: user?.id
          }
        ])
        .select()
        .single();
        
      if (error) throw error;
      
      toast.success("Listing created successfully!");
      navigate(`/listings/${data.id}`);
      
    } catch (error: any) {
      console.error("Error creating listing:", error);
      toast.error(error.message || "Failed to create listing");
    }
  };

  return (
    <AppLayout requireAuth={true} allowedRoles={[UserRole.SELLER]}>
      <div className="container py-8">
        <CreateListingWizard onSubmit={handleCreateListing} />
      </div>
    </AppLayout>
  );
}
