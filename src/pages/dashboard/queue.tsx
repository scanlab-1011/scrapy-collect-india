
import { useState } from 'react';
import AppLayout from '@/components/layout/app-layout';
import QueueTable from '@/components/ui/queue-table';
import ScheduleDrawer from '@/components/ui/schedule-drawer';
import CollectDialog from '@/components/ui/collect-dialog';
import { Button } from '@/components/ui/button';
import { UserRole, ListingStatus } from '@/types';
import { useListings } from '@/contexts/listing-context';

export default function Queue() {
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
    CANCELLED: listings.filter(l => l.status === ListingStatus.CANCELLED).length,
  };

  return (
    <AppLayout requireAuth={true} allowedRoles={[UserRole.STAFF, UserRole.ADMIN]}>
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Queue Management</h1>
          <p className="text-muted-foreground">Manage and process scrap material pickups</p>
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
            <h3 className="mt-4 text-lg font-medium">No listings found</h3>
            <p className="text-muted-foreground">
              There are no {filterStatus === 'ALL' ? '' : filterStatus.toLowerCase()} listings to display.
            </p>
          </div>
        ) : (
          <QueueTable listings={filteredListings} />
        )}
      </div>
    </AppLayout>
  );
}
