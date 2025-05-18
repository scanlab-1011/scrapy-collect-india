
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Package, 
  Scale, 
  User 
} from 'lucide-react';
import AppLayout from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { UserRole, ListingStatus } from '@/types';
import { 
  formatDate, 
  formatTime, 
  formatPrice, 
  getStatusColor, 
  getCategoryByType,
  calculatePayoutAmount
} from '@/lib/utils';
import { useListings } from '@/contexts/listing-context';

export default function ListingDetail() {
  const { id } = useParams<{ id: string }>();
  const { listings } = useListings();
  
  const listing = listings.find(l => l.id === id);
  
  if (!listing) {
    return (
      <AppLayout requireAuth={true} allowedRoles={[UserRole.SELLER]}>
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
  
  return (
    <AppLayout requireAuth={true} allowedRoles={[UserRole.SELLER]}>
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
                <div className="flex justify-between">
                  <div>
                    <CardTitle className="text-xl">{listing.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-2">
                      <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                      <span>{category.name}</span>
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(listing.status)}>
                    {listing.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Image */}
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex gap-2 items-center">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Scheduled On</p>
                              <p>
                                {formatDate(listing.pickupAt)} at {formatTime(listing.pickupAt)}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 items-center">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Assigned To</p>
                              <p>{listing.dispatcher?.name || "Not assigned"}</p>
                            </div>
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
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="flex gap-2 items-center">
                            <Scale className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Actual Weight</p>
                              <p>{listing.actualKg} kg</p>
                            </div>
                          </div>
                          <div className="flex gap-2 items-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">Total Payout</p>
                              <p className="font-medium text-scrapy-700">
                                {formatPrice(calculatePayoutAmount(listing))}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-4 bg-scrapy-50 p-3 rounded-md border border-scrapy-100">
                          <p className="text-sm">
                            <span className="font-medium">Transaction ID:</span> {listing.payoutTxnId}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Status and Timeline */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Status Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative pl-8">
                  {/* Vertical line */}
                  <div className="absolute left-3 top-0 bottom-0 w-px bg-scrapy-100"></div>
                  
                  {/* Created */}
                  <div className="mb-6 relative">
                    <div className="absolute left-[-8px] w-4 h-4 rounded-full bg-scrapy-500 border-2 border-white"></div>
                    <div>
                      <h4 className="font-medium">Created</h4>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(listing.createdAt)}
                      </p>
                      <p className="text-sm mt-1">Listing created successfully</p>
                    </div>
                  </div>
                  
                  {/* Scheduled */}
                  <div className={`mb-6 relative ${listing.status === ListingStatus.PENDING ? 'opacity-50' : ''}`}>
                    <div className={`absolute left-[-8px] w-4 h-4 rounded-full ${
                      listing.status !== ListingStatus.PENDING ? 'bg-scrapy-500' : 'bg-gray-300'
                    } border-2 border-white`}></div>
                    <div>
                      <h4 className="font-medium">Scheduled</h4>
                      {listing.status !== ListingStatus.PENDING ? (
                        <>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(listing.pickupAt)}
                          </p>
                          <p className="text-sm mt-1">
                            Pickup scheduled for {formatTime(listing.pickupAt)}
                          </p>
                        </>
                      ) : (
                        <p className="text-sm mt-1">Waiting for scheduling</p>
                      )}
                    </div>
                  </div>
                  
                  {/* Collected */}
                  <div className={`relative ${listing.status !== ListingStatus.COLLECTED ? 'opacity-50' : ''}`}>
                    <div className={`absolute left-[-8px] w-4 h-4 rounded-full ${
                      listing.status === ListingStatus.COLLECTED ? 'bg-scrapy-500' : 'bg-gray-300'
                    } border-2 border-white`}></div>
                    <div>
                      <h4 className="font-medium">Collected</h4>
                      {listing.status === ListingStatus.COLLECTED ? (
                        <>
                          <p className="text-sm text-muted-foreground">
                            {formatDate(listing.pickupAt)} {/* Assuming collection was on pickup date */}
                          </p>
                          <p className="text-sm mt-1">
                            {listing.actualKg} kg collected, {formatPrice(calculatePayoutAmount(listing))} paid
                          </p>
                        </>
                      ) : (
                        <p className="text-sm mt-1">Waiting for collection</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Help Info */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  If you have any questions or need to modify your listing, please contact our support team.
                </p>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start">
                    <Phone className="mr-2 h-4 w-4" />
                    Call Support
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Chat with Us
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

// Icons used in the component
function Phone(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MessageSquare(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}
