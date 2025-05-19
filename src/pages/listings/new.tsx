
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import AppLayout from '@/components/layout/app-layout';
import CreateListingWizard from '@/components/listing/create-listing-wizard';
import { UserRole } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { isSupabaseConfigured } from '@/lib/supabase';
import { ApiClient, ApiError } from '@/lib/api-client';

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
      // Validate user is available
      if (!user?.id) {
        toast.error("Authentication error: User ID not found.");
        return;
      }
      
      // Create the listing using our API client
      const data = await ApiClient.createListing(
        {
          title: listingData.title,
          category: listingData.category,
          estimatedKg: listingData.estimatedKg,
          pricePerKg: listingData.pricePerKg,
          location: listingData.location,
        },
        user.id,
        listingData.images
      );
        
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
