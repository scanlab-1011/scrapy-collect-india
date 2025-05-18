
import { useRef } from 'react';
import { ScrapType } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getCategoryByType } from '@/lib/utils';
import { Camera, Image, Scale } from 'lucide-react';

interface MaterialDetailsData {
  title: string;
  description: string;
  estimatedKg: number;
  images: string[];
}

interface MaterialDetailsProps {
  data: MaterialDetailsData;
  category: ScrapType;
  onUpdate: (data: Partial<{ 
    title: string; 
    description: string; 
    estimatedKg: number; 
    images: string[];
  }>) => void;
  onNext: () => void;
  onBack: () => void;
}

export default function MaterialDetails({
  data,
  category,
  onUpdate,
  onNext,
  onBack
}: MaterialDetailsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const categoryInfo = getCategoryByType(category);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    // In a real app, this would upload to storage
    // For this demo, we're using the FileReader API to get a base64 string
    const reader = new FileReader();
    reader.onloadend = () => {
      onUpdate({ 
        images: [...data.images, reader.result as string] 
      });
    };
    reader.readAsDataURL(files[0]);
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...data.images];
    newImages.splice(index, 1);
    onUpdate({ images: newImages });
  };

  const handleContinue = () => {
    // Simple validation
    if (!data.title.trim()) {
      alert("Please enter a title for your listing");
      return;
    }
    
    if (data.estimatedKg <= 0) {
      alert("Please enter a valid weight");
      return;
    }
    
    onNext();
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium">2. Tell us about your {categoryInfo.name}</h2>
      
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={data.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder={`e.g., Old ${categoryInfo.name} items for recycling`}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            value={data.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            placeholder="Describe the material in more detail..."
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="estimatedKg" className="flex items-center gap-1">
            <Scale className="h-4 w-4" />
            Estimated Weight (kg)
          </Label>
          <Input
            id="estimatedKg"
            type="number"
            step="0.5"
            min="0.5"
            value={data.estimatedKg}
            onChange={(e) => onUpdate({ estimatedKg: parseFloat(e.target.value) || 0 })}
          />
          <p className="text-xs text-muted-foreground">
            Don't worry if you're not sure, our team will weigh it during pickup
          </p>
        </div>
        
        <div className="space-y-2">
          <Label className="flex items-center gap-1">
            <Image className="h-4 w-4" />
            Photos (optional)
          </Label>
          
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
            {data.images.map((image, index) => (
              <Card key={index} className="relative overflow-hidden aspect-square">
                <img 
                  src={image} 
                  alt={`Scrap material ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-1 right-1 h-6 w-6"
                  onClick={() => handleRemoveImage(index)}
                >
                  ×
                </Button>
              </Card>
            ))}
            
            {data.images.length < 4 && (
              <Card 
                className="flex items-center justify-center cursor-pointer aspect-square"
                onClick={() => fileInputRef.current?.click()}
              >
                <CardContent className="flex flex-col items-center justify-center p-2">
                  <Camera className="h-8 w-8 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground mt-1">Add Photo</span>
                </CardContent>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </Card>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Photos help us prepare for pickup and verify material type
          </p>
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <Button variant="outline" onClick={onBack}>Back</Button>
        <Button onClick={handleContinue}>Continue</Button>
      </div>
    </div>
  );
}
