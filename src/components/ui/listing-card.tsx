
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Package, Scale } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Listing, ListingStatus, UserRole } from '@/types';
import { 
  formatDate, 
  formatPrice, 
  getStatusColor, 
  getCategoryByType 
} from '@/lib/utils';
import { useAuth } from '@/contexts/auth-context';

interface ListingCardProps {
  listing: Listing;
  showActions?: boolean;
  onScheduleClick?: (id: string) => void;
  onCollectClick?: (id: string) => void;
}

export default function ListingCard({ 
  listing, 
  showActions = false,
  onScheduleClick,
  onCollectClick
}: ListingCardProps) {
  const { user } = useAuth();
  const category = getCategoryByType(listing.category);
  const isStaff = user?.role === UserRole.STAFF || user?.role === UserRole.ADMIN;
  
  // Determine card link based on user role
  const cardLink = isStaff 
    ? `/dashboard/listings/${listing.id}` 
    : `/listings/${listing.id}`;

  return (
    <Card className="h-full overflow-hidden flex flex-col">
      <div className="aspect-[16/9] relative overflow-hidden">
        {listing.images && listing.images.length > 0 ? (
          <img 
            src={listing.images[0]} 
            alt={listing.title}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <Package className="h-10 w-10 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge className={getStatusColor(listing.status)}>
            {listing.status}
          </Badge>
        </div>
      </div>

      <CardHeader className="p-4 pb-2">
        <Link to={cardLink}>
          <CardTitle className="text-lg line-clamp-1 hover:underline">
            {listing.title}
          </CardTitle>
        </Link>
        <div className="flex items-center gap-1 mt-1">
          <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
          <CardDescription className="text-xs">
            {category.name}
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 flex-grow">
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex gap-2 items-center">
            <Scale className="h-4 w-4 text-muted-foreground" />
            <span>
              Est. {listing.estimatedKg} kg · {formatPrice(listing.pricePerKg)}/kg
            </span>
          </div>
          {listing.location && (
            <div className="flex gap-2 items-center">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="line-clamp-1">
                {listing.location.city}, {listing.location.state}
              </span>
            </div>
          )}
          {listing.pickupAt && (
            <div className="flex gap-2 items-center">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>Pickup: {formatDate(listing.pickupAt)}</span>
            </div>
          )}
        </div>
      </CardContent>

      {showActions && isStaff && (
        <CardFooter className="p-4 pt-0 flex justify-end gap-2">
          {listing.status === ListingStatus.PENDING && onScheduleClick && (
            <Button 
              variant="outline" 
              onClick={() => onScheduleClick(listing.id)}
              className="text-xs h-8"
            >
              Schedule Pickup
            </Button>
          )}
          {listing.status === ListingStatus.SCHEDULED && onCollectClick && (
            <Button 
              onClick={() => onCollectClick(listing.id)}
              className="text-xs h-8"
            >
              Mark Collected
            </Button>
          )}
        </CardFooter>
      )}
    </Card>
  );
}
