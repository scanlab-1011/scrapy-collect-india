
import { useState } from 'react';
import { Scale } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Listing } from '@/types';
import { formatPrice, getCategoryByType } from '@/lib/utils';
import { useListings } from '@/contexts/listing-context';

interface CollectDialogProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  actualKg: z
    .number({ required_error: "Weight is required" })
    .positive("Weight must be positive")
    .min(0.1, "Weight must be at least 0.1 kg")
});

type FormValues = z.infer<typeof formSchema>;

export default function CollectDialog({ listing, isOpen, onClose }: CollectDialogProps) {
  const { markCollected } = useListings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      actualKg: listing?.estimatedKg || 0,
    },
  });

  async function onSubmit(data: FormValues) {
    if (!listing) return;
    
    setIsSubmitting(true);
    
    try {
      await markCollected(listing.id, data.actualKg);
      onClose();
    } catch (error) {
      console.error('Failed to mark collection:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  // Update form values when listing changes
  useState(() => {
    if (listing) {
      form.setValue('actualKg', listing.estimatedKg);
    }
  });

  if (!listing) return null;
  
  const category = getCategoryByType(listing.category);

  // Calculate payout amount based on form values
  const actualKg = form.watch('actualKg') || 0;
  const payoutAmount = actualKg * listing.pricePerKg;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Mark Collection</DialogTitle>
          <DialogDescription>
            Enter the actual weight of the collected scrap materials
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-2">
          <h3 className="font-medium">{listing.title}</h3>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
            <p className="text-sm text-muted-foreground">{category.name}</p>
          </div>
          <p className="text-sm">Estimated: {listing.estimatedKg} kg</p>
          <p className="text-sm">Price per kg: {formatPrice(listing.pricePerKg)}</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="actualKg"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Scale className="h-4 w-4" />
                    Actual Weight (kg)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.1" 
                      min="0.1" 
                      {...field} 
                      onChange={e => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-6 p-4 bg-muted rounded-md">
              <div className="flex justify-between items-center">
                <span className="font-medium">Payout Amount</span>
                <span className="text-lg font-bold text-scrapy-700">
                  {formatPrice(payoutAmount)}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                This amount will be transferred to the seller's account
              </p>
            </div>

            <DialogFooter className="mt-6">
              <Button 
                variant="outline" 
                type="button" 
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting || actualKg <= 0}
              >
                {isSubmitting ? 'Processing...' : 'Confirm & Pay'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
