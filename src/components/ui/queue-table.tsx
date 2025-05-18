
import { useState } from 'react';
import { Calendar, Clock, MapPin, Package, Scale, User } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Listing, ListingStatus } from '@/types';
import { formatDate, getStatusColor, formatPrice } from '@/lib/utils';
import ScheduleDrawer from './schedule-drawer';
import CollectDialog from './collect-dialog';
import { Link } from 'react-router-dom';

interface QueueTableProps {
  listings: Listing[];
  showActions?: boolean;
}

export default function QueueTable({ listings, showActions = true }: QueueTableProps) {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [collectOpen, setCollectOpen] = useState(false);
  
  const handleScheduleClick = (listing: Listing) => {
    setSelectedListing(listing);
    setScheduleOpen(true);
  };
  
  const handleCollectClick = (listing: Listing) => {
    setSelectedListing(listing);
    setCollectOpen(true);
  };

  return (
    <>
      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Listing</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Weight</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Seller</TableHead>
              <TableHead>Pickup</TableHead>
              {showActions && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {listings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={showActions ? 8 : 7} className="text-center py-8 text-muted-foreground">
                  No listings available
                </TableCell>
              </TableRow>
            ) : (
              listings.map((listing) => (
                <TableRow key={listing.id}>
                  <TableCell className="font-medium">
                    <Link to={`/dashboard/listings/${listing.id}`} className="hover:underline flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      <span className="line-clamp-1">{listing.title}</span>
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(listing.status)}>
                      {listing.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Scale className="h-4 w-4 text-muted-foreground" />
                      <span>{listing.actualKg || listing.estimatedKg} kg</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {formatPrice(listing.pricePerKg)}/kg
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 max-w-[120px]">
                      <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="line-clamp-1">
                        {listing.location.city}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 max-w-[120px]">
                      <User className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="line-clamp-1">
                        {listing.seller?.name || 'Unknown'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {listing.pickupAt ? (
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span>{formatDate(listing.pickupAt)}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">Not scheduled</span>
                    )}
                  </TableCell>
                  {showActions && (
                    <TableCell className="text-right">
                      {listing.status === ListingStatus.PENDING && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleScheduleClick(listing)}
                          className="text-xs h-8"
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          Schedule
                        </Button>
                      )}
                      {listing.status === ListingStatus.SCHEDULED && (
                        <Button 
                          size="sm"
                          onClick={() => handleCollectClick(listing)}
                          className="text-xs h-8"
                        >
                          <Scale className="h-3 w-3 mr-1" />
                          Collect
                        </Button>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <ScheduleDrawer 
        listing={selectedListing}
        isOpen={scheduleOpen}
        onClose={() => {
          setScheduleOpen(false);
          setSelectedListing(null);
        }}
      />
      
      <CollectDialog 
        listing={selectedListing}
        isOpen={collectOpen}
        onClose={() => {
          setCollectOpen(false);
          setSelectedListing(null);
        }}
      />
    </>
  );
}
