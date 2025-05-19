
import { Link } from "react-router-dom";
import { Package, Calendar, MapPin } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ListingStatus, type Listing } from "@/types";
import { formatDate, formatPrice, formatTime, getStatusColor } from "@/lib/utils";
import { useCurrentUser, useHasRole } from "@/contexts/auth-context";
import { UserRole } from "@/types";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const currentUser = useCurrentUser();
  const isStaffOrAdmin = useHasRole(UserRole.STAFF) || useHasRole(UserRole.ADMIN);
  
  // Determine card link based on user role
  const cardLink = isStaffOrAdmin ? `/dashboard/listings/${listing.id}` : `/listings/${listing.id}`;
  
  const isOwn = currentUser && listing.seller && currentUser.id === listing.seller.id;
  
  return (
    <Card className="overflow-hidden">
      <Link to={cardLink} className="h-full flex flex-col">
        {/* Image or placeholder */}
        <div className="aspect-[16/9] relative bg-muted">
          {listing.images && listing.images.length > 0 ? (
            <img 
              src={listing.images[0]} 
              alt={listing.title} 
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Package className="h-12 w-12 text-muted-foreground opacity-30" />
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-2 right-2">
            <Badge className={getStatusColor(listing.status)}>
              {listing.status}
            </Badge>
          </div>
          
          {/* Owner Badge */}
          {isOwn && (
            <div className="absolute top-2 left-2">
              <Badge variant="outline" className="bg-white bg-opacity-80">
                Your Listing
              </Badge>
            </div>
          )}
        </div>
        
        <CardHeader className="pb-2">
          <h3 className="font-semibold text-lg line-clamp-1">{listing.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-1">
            {listing.category}
          </p>
        </CardHeader>
        
        <CardContent className="pb-4 space-y-3">
          {/* Location */}
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-sm line-clamp-1">
              {listing.location.city}, {listing.location.state}
            </p>
          </div>
          
          {/* Weight and Price */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-muted-foreground">Est. weight</p>
              <p className="font-medium">{listing.estimatedKg} kg</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Price per kg</p>
              <p className="font-medium">{formatPrice(listing.pricePerKg)}</p>
            </div>
          </div>
          
          {/* Show pickup info for scheduled listings */}
          {listing.status === ListingStatus.SCHEDULED && (
            <>
              <Separator />
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="text-sm">
                  <p>Pickup on {formatDate(listing.pickupAt)}</p>
                  <p className="text-xs text-muted-foreground">at {formatTime(listing.pickupAt)}</p>
                </div>
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="pt-0 mt-auto">
          <div className="text-sm text-muted-foreground">
            {isStaffOrAdmin ? "View Details" : "Check Status"}
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
}
