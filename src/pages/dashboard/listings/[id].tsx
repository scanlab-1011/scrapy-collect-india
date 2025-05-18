
import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Package, 
  Scale, 
  User, 
  Phone,
  Clipboard,
  CheckCircle
} from 'lucide-react';
import AppLayout from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter } from '@/components/ui/alert-dialog';
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
import ScheduleDrawer from '@/components/ui/schedule-drawer';
import CollectDialog from '@/components/ui/collect-dialog';

export default function StaffListingDetail() {
  const { id } = useParams<{ id: string }>();
  const { listings } = useListings();
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [collectOpen, setCollectOpen] = useState(false);
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  
  const listing = listings.find(l => l.id === id);
  
  if (!listing) {
    return (
      <AppLayout requireAuth={true} allowedRoles={[UserRole.STAFF, UserRole.ADMIN]}>
        <div className="container py-16 text-center">
          <h1 className="text-xl font-medium mb-4">Listing not found</h1>
          <Button variant="outline" asChild>
            <Link to="/dashboard/queue">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to queue
            </Link>
          </Button>
        </div>
      </AppLayout>
    );
  }
  
  const category = getCategoryByType(listing.category);

  const handleScheduleClick = () => {
    setScheduleOpen(true);
  };
  
  const handleCollectClick = () => {
    setCollectOpen(true);
  };
  
  const handleCallSeller = () => {
    if (listing.seller?.phone) {
      setConfirmationMessage(`Calling seller at ${listing.seller.phone}`);
      setConfirmationOpen(true);
    }
  };
  
  return (
    <AppLayout requireAuth={true} allowedRoles={[UserRole.STAFF, UserRole.ADMIN]}>
      <div className="container py-8">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard/queue">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to queue
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
                  
                  <Separator />
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Seller Information</h3>
                    <div className="flex gap-2 items-center">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p>{listing.seller?.name || "Unknown"}</p>
                        <p className="text-sm text-muted-foreground">{listing.seller?.phone || "No phone number"}</p>
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
          
          {/* Actions and Status */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {listing.status === ListingStatus.PENDING && (
                  <Button className="w-full" onClick={handleScheduleClick}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule Pickup
                  </Button>
                )}
                
                {listing.status === ListingStatus.SCHEDULED && (
                  <Button className="w-full" onClick={handleCollectClick}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Collected
                  </Button>
                )}
                
                <Button variant="outline" className="w-full" onClick={handleCallSeller}>
                  <Phone className="mr-2 h-4 w-4" />
                  Call Seller
                </Button>
                
                {listing.status === ListingStatus.PENDING || listing.status === ListingStatus.SCHEDULED ? (
                  <Button variant="outline" className="w-full">
                    <Clipboard className="mr-2 h-4 w-4" />
                    Create Notes
                  </Button>
                ) : null}
              </CardContent>
            </Card>
            
            {/* Status Timeline */}
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
                      <p className="text-sm mt-1">Listing created by seller</p>
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
                        <p className="text-sm mt-1">Waiting to be scheduled</p>
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
                            {formatDate(listing.pickupAt)}
                          </p>
                          <p className="text-sm mt-1">
                            {listing.actualKg} kg collected, {formatPrice(calculatePayoutAmount(listing))} paid
                          </p>
                        </>
                      ) : (
                        <p className="text-sm mt-1">Pending collection</p>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Schedule Drawer */}
      <ScheduleDrawer
        listing={listing}
        isOpen={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
      />
      
      {/* Collect Dialog */}
      <CollectDialog
        listing={listing}
        isOpen={collectOpen}
        onClose={() => setCollectOpen(false)}
      />
      
      {/* Confirmation Dialog */}
      <AlertDialog open={confirmationOpen} onOpenChange={setConfirmationOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Action Confirmation</AlertDialogTitle>
            <AlertDialogDescription>
              {confirmationMessage}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => setConfirmationOpen(false)}>OK</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
