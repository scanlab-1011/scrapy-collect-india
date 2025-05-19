
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Package, Scale, User, Phone, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { UserRole, ListingStatus } from '@/types';
import { formatDate, formatTime, formatPrice, getStatusColor, getCategoryByType } from '@/lib/utils';
import { useListings } from '@/contexts/listing-context';
import { useCurrentUser } from '@/contexts/auth-context';
import AppLayout from '@/components/layout/app-layout';

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const { listings } = useListings();
  const currentUser = useCurrentUser();
  const [isOwner, setIsOwner] = useState(false);
  
  const listing = listings.find(l => l.id === id);
  
  useEffect(() => {
    if (listing && currentUser) {
      setIsOwner(listing.seller?.id === currentUser.id);
    }
  }, [listing, currentUser]);
  
  if (!listing) {
    return (
      <AppLayout>
        <div className="container py-16 text-center">
          <h1 className="text-xl font-medium mb-4">Listing not found</h1>
          <Button variant="outline" asChild>
            <Link to="/listings">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to listings
            </Link>
          </Button>
        </div>
      </AppLayout>
    );
  }
  
  const category = getCategoryByType(listing.category);
  
  // Check if listing belongs to current user
  const canEdit = isOwner && listing.status === ListingStatus.PENDING;
  
  return (
    <AppLayout>
      <div className="container py-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/listings">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to listings
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-xl">{listing.title}</CardTitle>
                      <Badge className={getStatusColor(listing.status)}>
                        {listing.status}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                      <span>{category.name}</span>
                    </CardDescription>
                  </div>
                  
                  {canEdit && (
                    <Button variant="outline" size="sm" asChild>
                      <Link to={`/listings/${id}/edit`}>
                        Edit
                      </Link>
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Material Image */}
                <div className="aspect-[16/9] relative rounded-md overflow-hidden">
                  {listing.images && listing.images.length > 0 ? (
                    <img 
                      src={listing.images[0]} 
                      alt={listing.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted flex items-center justify-center">
                      <Package className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>
                
                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Material Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex gap-2 items-center">
                        <Scale className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Estimated Weight</p>
                          <p>{listing.estimatedKg} kg</p>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <Package className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Price Per Kg</p>
                          <p>{formatPrice(listing.pricePerKg)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Location</h3>
                    <div className="flex gap-2">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p>{listing.location.address}</p>
                        <p>{listing.location.city}, {listing.location.state} {listing.location.pincode}</p>
                        {listing.location.landmark && (
                          <p className="text-sm text-muted-foreground">
                            Landmark: {listing.location.landmark}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {listing.status !== ListingStatus.PENDING && (
                    <>
                      <Separator />
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Pickup</h3>
                        <div className="flex gap-2 items-center">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">Scheduled On</p>
                            <p>
                              {formatDate(listing.pickupAt)} at {formatTime(listing.pickupAt)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {listing.status === ListingStatus.COLLECTED && (
                    <>
                      <Separator />
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Collection</h3>
                        <div className="space-y-2">
                          <div className="flex gap-2 items-center">
                            <Scale className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Actual Weight</p>
                              <p>{listing.actualKg} kg</p>
                            </div>
                          </div>
                          <div className="flex gap-2 items-center">
                            <CheckCircle className="h-5 w-5 text-green-500" />
                            <div>
                              <p className="text-sm font-medium">Payment Completed</p>
                              <p>{formatPrice(listing.pricePerKg * listing.actualKg)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Seller Info */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Seller</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2 items-center">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{listing.seller?.name}</p>
                      <p className="text-sm text-muted-foreground">Seller</p>
                    </div>
                  </div>
                  
                  {listing.seller?.phone && (
                    <div className="flex gap-2 items-center">
                      <Phone className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{listing.seller.phone}</p>
                        <p className="text-sm text-muted-foreground">Contact</p>
                      </div>
                    </div>
                  )}
                  
                  <Button className="w-full" disabled={isOwner}>
                    Contact Seller
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
