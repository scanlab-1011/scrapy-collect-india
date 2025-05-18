
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Listing, ListingStatus } from '@/types';
import { getListings, createListing, updateListing, scheduleListing, collectListing } from '@/lib/data';
import { useAuth } from '@/contexts/auth-context';
import { toast } from '@/components/ui/sonner';
import { notifyListingScheduled, notifyListingCollected } from '@/lib/notify';
import { formatDate, formatTime, calculatePayoutAmount } from '@/lib/utils';
import { processPayout } from '@/lib/payout';

interface ListingContextType {
  listings: Listing[];
  pendingListings: Listing[];
  scheduledListings: Listing[];
  collectedListings: Listing[];
  isLoading: boolean;
  refresh: () => void;
  addListing: (listing: Omit<Listing, 'id' | 'status' | 'createdAt' | 'seller' | 'sellerId'>) => Promise<Listing>;
  schedulePickup: (listingId: string, pickupAt: Date) => Promise<Listing>;
  markCollected: (listingId: string, actualKg: number) => Promise<Listing>;
}

const ListingContext = createContext<ListingContextType>({
  listings: [],
  pendingListings: [],
  scheduledListings: [],
  collectedListings: [],
  isLoading: false,
  refresh: () => {},
  addListing: async () => {
    throw new Error('Not implemented');
  },
  schedulePickup: async () => {
    throw new Error('Not implemented');
  },
  markCollected: async () => {
    throw new Error('Not implemented');
  },
});

export const ListingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  const loadListings = () => {
    if (!user) {
      setListings([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const fetchedListings = getListings();
      setListings(fetchedListings);
    } catch (error) {
      toast.error("Failed to load listings");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, [user]);

  const pendingListings = listings.filter(listing => listing.status === ListingStatus.PENDING);
  const scheduledListings = listings.filter(listing => listing.status === ListingStatus.SCHEDULED);
  const collectedListings = listings.filter(listing => listing.status === ListingStatus.COLLECTED);

  const addListing = async (listing: Omit<Listing, 'id' | 'status' | 'createdAt' | 'seller' | 'sellerId'>): Promise<Listing> => {
    if (!user) throw new Error("You must be logged in");
    
    try {
      const newListing = createListing({
        ...listing,
        sellerId: user.id
      });
      
      loadListings();
      toast.success("Listing created successfully");
      return newListing;
    } catch (error) {
      toast.error("Failed to create listing");
      throw error;
    }
  };

  const schedulePickup = async (listingId: string, pickupAt: Date): Promise<Listing> => {
    if (!user) throw new Error("You must be logged in");
    if (user.role !== 'STAFF' && user.role !== 'ADMIN') throw new Error("Unauthorized");
    
    try {
      const listing = listings.find(l => l.id === listingId);
      if (!listing) throw new Error("Listing not found");
      
      const updatedListing = scheduleListing(listingId, pickupAt, user.id);
      
      // Notify seller
      const seller = updatedListing.seller;
      if (seller?.phone) {
        await notifyListingScheduled(
          seller.phone,
          formatDate(pickupAt),
          formatTime(pickupAt)
        );
      }
      
      loadListings();
      toast.success("Pickup scheduled successfully");
      return updatedListing;
    } catch (error) {
      toast.error("Failed to schedule pickup");
      throw error;
    }
  };

  const markCollected = async (listingId: string, actualKg: number): Promise<Listing> => {
    if (!user) throw new Error("You must be logged in");
    if (user.role !== 'STAFF' && user.role !== 'ADMIN') throw new Error("Unauthorized");
    
    try {
      const listing = listings.find(l => l.id === listingId);
      if (!listing) throw new Error("Listing not found");
      
      // Process payout
      const amount = actualKg * listing.pricePerKg;
      const payoutResult = await processPayout({
        sellerId: listing.sellerId,
        amount,
        listingId: listing.id
      });
      
      if (!payoutResult.success) {
        throw new Error("Payout failed");
      }
      
      const updatedListing = collectListing(listingId, actualKg);
      
      // Notify seller
      const seller = updatedListing.seller;
      if (seller?.phone) {
        await notifyListingCollected(seller.phone, amount);
      }
      
      loadListings();
      toast.success(`Collection marked. Paid ₹${amount} to seller.`);
      return updatedListing;
    } catch (error) {
      toast.error("Failed to mark collection");
      throw error;
    }
  };

  return (
    <ListingContext.Provider
      value={{
        listings,
        pendingListings,
        scheduledListings,
        collectedListings,
        isLoading,
        refresh: loadListings,
        addListing,
        schedulePickup,
        markCollected
      }}
    >
      {children}
    </ListingContext.Provider>
  );
};

export const useListings = () => useContext(ListingContext);
