
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrapType, Location } from '@/types';
import { useListings } from '@/contexts/listing-context';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import CategorySelection from './steps/category-selection';
import MaterialDetails from './steps/material-details';
import LocationStep from './steps/location-step';
import ReviewStep from './steps/review-step';

interface CreateListingWizardProps {
  onSubmit?: (listingData: any) => Promise<void>;
}

export default function CreateListingWizard({ onSubmit }: CreateListingWizardProps) {
  const navigate = useNavigate();
  const { addListing } = useListings();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    category: ScrapType.PAPER,
    title: '',
    description: '',
    estimatedKg: 1,
    images: [] as string[],
    location: {
      address: '',
      city: '',
      state: '',
      pincode: '',
      landmark: ''
    } as Location
  });

  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleNext = () => {
    setStep(prev => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => {
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // If external onSubmit prop is provided, use it
      if (onSubmit) {
        await onSubmit({
          title: formData.title,
          category: formData.category,
          estimatedKg: formData.estimatedKg,
          location: formData.location,
          images: formData.images,
          description: formData.description
        });
        return;
      }
      
      // Use default implementation if no external handler provided
      // Get category price
      // In a real app, this would come from a backend API or more sophisticated pricing
      let pricePerKg = 0;
      
      switch (formData.category) {
        case ScrapType.IRON:
          pricePerKg = 27;
          break;
        case ScrapType.COPPER:
          pricePerKg = 430;
          break;
        case ScrapType.ALUMINIUM:
          pricePerKg = 110;
          break;
        case ScrapType.BRASS:
          pricePerKg = 310;
          break;
        case ScrapType.STEEL:
          pricePerKg = 38;
          break;
        case ScrapType.PLASTIC_HDPE:
          pricePerKg = 18;
          break;
        case ScrapType.PLASTIC_PET:
          pricePerKg = 12;
          break;
        case ScrapType.PAPER:
          pricePerKg = 14;
          break;
        case ScrapType.CARDBOARD:
          pricePerKg = 10;
          break;
        case ScrapType.BOOKS:
          pricePerKg = 12;
          break;
        case ScrapType.E_WASTE:
          pricePerKg = 90;
          break;
        case ScrapType.GLASS:
          pricePerKg = 2;
          break;
        case ScrapType.MIXED_METALS:
          pricePerKg = 45;
          break;
      }
      
      // Create listing
      const listing = await addListing({
        title: formData.title,
        category: formData.category,
        estimatedKg: formData.estimatedKg,
        pricePerKg,
        location: formData.location,
        images: formData.images.length ? formData.images : [
          // Default image if none provided
          `https://source.unsplash.com/random/300x300?recycling=${formData.category}`
        ]
      });
      
      // Navigate to listings page
      navigate('/listings');
    } catch (error) {
      console.error('Failed to create listing:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <CategorySelection
            selectedCategory={formData.category}
            onCategorySelect={(category) => updateFormData({ category })}
            onNext={handleNext}
          />
        );
      case 2:
        return (
          <MaterialDetails
            data={{
              title: formData.title,
              description: formData.description,
              estimatedKg: formData.estimatedKg,
              images: formData.images
            }}
            category={formData.category}
            onUpdate={updateFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <LocationStep
            location={formData.location}
            onUpdate={(location) => updateFormData({ location })}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <ReviewStep
            data={formData}
            onSubmit={handleSubmit}
            onBack={handleBack}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Sell Your Scrap</CardTitle>
        <CardDescription>
          Tell us about the materials you want to sell. We'll pick it up and pay you!
        </CardDescription>
        <Progress value={progress} className="mt-2" />
      </CardHeader>
      
      <CardContent>
        {renderStepContent()}
      </CardContent>
    </Card>
  );
}
