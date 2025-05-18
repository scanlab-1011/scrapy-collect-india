
import { MapPin, Package, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Listing, ScrapType, Location } from '@/types';
import { getCategoryByType } from '@/lib/utils';

interface ReviewStepProps {
  data: {
    category: ScrapType;
    title: string;
    description?: string;
    estimatedKg: number;
    images: string[];
    location: Location;
  };
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function ReviewStep({
  data,
  onSubmit,
  onBack,
  isSubmitting
}: ReviewStepProps) {
  const categoryInfo = getCategoryByType(data.category);
  
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">4. Review Your Listing</h2>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-md font-medium mb-2">Material Details</h3>
          <div className="bg-muted/50 rounded-md p-4 space-y-3">
            <div>
              <span className="text-sm font-medium">Title:</span>
              <p>{data.title}</p>
            </div>
            
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${categoryInfo.color}`}></div>
              <span className="font-medium">{categoryInfo.name}</span>
            </div>
            
            {data.description && (
              <div>
                <span className="text-sm font-medium">Description:</span>
                <p className="text-sm">{data.description}</p>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <Scale className="h-4 w-4 text-muted-foreground" />
              <span>Estimated weight: {data.estimatedKg} kg</span>
            </div>
            
            {data.images.length > 0 && (
              <div>
                <span className="text-sm font-medium">Photos:</span>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {data.images.map((image, index) => (
                    <div key={index} className="rounded-md overflow-hidden aspect-square">
                      <img 
                        src={image} 
                        alt={`Material ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-md font-medium mb-2">Pickup Location</h3>
          <div className="bg-muted/50 rounded-md p-4 space-y-1">
            <div className="flex items-start gap-1">
              <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
              <div>
                <p>{data.location.address}</p>
                <p>
                  {data.location.city}, {data.location.state} {data.location.pincode}
                </p>
                {data.location.landmark && (
                  <p className="text-sm text-muted-foreground">
                    Landmark: {data.location.landmark}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-accent p-4 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <Package className="h-5 w-5 text-scrapy-700" />
            <h3 className="font-medium">What happens next?</h3>
          </div>
          <ol className="text-sm space-y-2 ml-6 list-decimal">
            <li>Our team will review your listing and contact you to confirm details.</li>
            <li>We'll schedule a pickup at your location.</li>
            <li>Our team will weigh the materials on-site and pay you based on actual weight.</li>
          </ol>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack} disabled={isSubmitting}>Back</Button>
        <Button onClick={onSubmit} disabled={isSubmitting}>
          {isSubmitting ? 'Creating listing...' : 'Submit Listing'}
        </Button>
      </div>
    </div>
  );
}
