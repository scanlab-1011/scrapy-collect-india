
import { Location } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MapPin } from 'lucide-react';

interface LocationStepProps {
  location: Location;
  onUpdate: (location: Location) => void;
  onNext: () => void;
  onBack: () => void;
}

// Indian states for dropdown
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
  "Chandigarh"
].sort();

export default function LocationStep({
  location,
  onUpdate,
  onNext,
  onBack
}: LocationStepProps) {
  const handleChange = (field: keyof Location, value: string) => {
    onUpdate({
      ...location,
      [field]: value
    });
  };

  const handleContinue = () => {
    // Simple validation
    if (!location.address.trim()) {
      alert("Please enter an address");
      return;
    }
    
    if (!location.city.trim()) {
      alert("Please enter a city");
      return;
    }
    
    if (!location.state.trim()) {
      alert("Please select a state");
      return;
    }
    
    if (!location.pincode.trim()) {
      alert("Please enter a pincode");
      return;
    }
    
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium flex items-center gap-2">
        <MapPin className="h-5 w-5" />
        3. Where should we pick up your scrap?
      </h2>
      
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            value={location.address}
            onChange={(e) => handleChange('address', e.target.value)}
            placeholder="House/Flat number, Building name, Street"
            rows={2}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={location.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="e.g., Mumbai"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="state">State</Label>
            <select
              id="state"
              value={location.state}
              onChange={(e) => handleChange('state', e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select State</option>
              {INDIAN_STATES.map(state => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pincode">Pincode</Label>
            <Input
              id="pincode"
              value={location.pincode}
              onChange={(e) => handleChange('pincode', e.target.value)}
              placeholder="e.g., 400001"
              maxLength={6}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="landmark">Landmark (optional)</Label>
            <Input
              id="landmark"
              value={location.landmark || ''}
              onChange={(e) => handleChange('landmark', e.target.value)}
              placeholder="e.g., Near Central Park"
            />
          </div>
        </div>
        
        <div className="bg-muted p-3 rounded-md mt-2">
          <p className="text-sm">
            <strong>Note:</strong> Our pickup team will call you before arriving at the location.
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
