
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AppLayout from '@/components/layout/app-layout';
import ListingCard from '@/components/ui/listing-card';
import { Button } from '@/components/ui/button';
import { UserRole, ListingStatus } from '@/types';
import { useListings } from '@/contexts/listing-context';

export default function MyListings() {
  const { listings, isLoading } = useListings();
  const [filterStatus, setFilterStatus] = useState<ListingStatus | 'ALL'>('ALL');
  
  const filteredListings = filterStatus === 'ALL' 
    ? listings 
    : listings.filter(listing => listing.status === filterStatus);

  const statusCounts = {
    ALL: listings.length,
    PENDING: listings.filter(l => l.status === ListingStatus.PENDING).length,
    SCHEDULED: listings.filter(l => l.status === ListingStatus.SCHEDULED).length,
    COLLECTED: listings.filter(l => l.status === ListingStatus.COLLECTED).length,
  };
  
  return (
    <AppLayout requireAuth={true} allowedRoles={[UserRole.SELLER]}>
      <div className="container py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold">My Listings</h1>
            <p className="text-muted-foreground">Manage your scrap material listings</p>
          </div>
          <Button asChild>
            <Link to="/listings/new">
              <Plus className="mr-2 h-4 w-4" />
              New Listing
            </Link>
          </Button>
        </div>
        
        {/* Status Filter */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {(['ALL', ...Object.values(ListingStatus)] as const).map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className="whitespace-nowrap"
            >
              {status === 'ALL' ? 'All' : status}
              <span className="ml-1 text-xs bg-primary-foreground text-primary rounded-full px-2">
                {statusCounts[status]}
              </span>
            </Button>
          ))}
        </div>
        
        {isLoading ? (
          <div className="min-h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-scrapy-500"></div>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="py-12 text-center">
            <div className="bg-muted rounded-full h-16 w-16 flex items-center justify-center mx-auto">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No listings found</h3>
            <p className="text-muted-foreground">
              {filterStatus === 'ALL'
                ? "You haven't created any listings yet."
                : `You don't have any ${filterStatus.toLowerCase()} listings.`}
            </p>
            <Button className="mt-4" asChild>
              <Link to="/listings/new">Create a new listing</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredListings.map((listing) => (
              <Link to={`/listings/${listing.id}`} key={listing.id} className="block h-full">
                <ListingCard listing={listing} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
