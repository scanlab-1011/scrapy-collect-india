
import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle 
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Listing } from '@/types';
import { getCategoryByType } from '@/lib/utils';
import { useListings } from '@/contexts/listing-context';

interface ScheduleDrawerProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
}

const formSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
  }),
  time: z.string({
    required_error: "Please select a time slot",
  }),
});

type FormValues = z.infer<typeof formSchema>;

// Time slot options (9 AM to 6 PM, 1-hour intervals)
const TIME_SLOTS = Array.from({ length: 10 }, (_, i) => {
  const hour = i + 9;
  return {
    value: `${hour}:00`,
    label: `${hour > 12 ? hour - 12 : hour}:00 ${hour >= 12 ? 'PM' : 'AM'}`
  };
});

export default function ScheduleDrawer({ listing, isOpen, onClose }: ScheduleDrawerProps) {
  const { schedulePickup } = useListings();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date(),
    },
  });

  async function onSubmit(data: FormValues) {
    if (!listing) return;
    
    setIsSubmitting(true);
    
    try {
      // Combine date and time
      const [hours, minutes] = data.time.split(':');
      const pickupAt = new Date(data.date);
      pickupAt.setHours(parseInt(hours, 10));
      pickupAt.setMinutes(parseInt(minutes, 10));
      
      await schedulePickup(listing.id, pickupAt);
      onClose();
    } catch (error) {
      console.error('Failed to schedule pickup:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!listing) return null;
  
  const category = getCategoryByType(listing.category);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Schedule Pickup</SheetTitle>
          <SheetDescription>
            Select a date and time for the scrap pickup
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6">
          <div className="mb-6 space-y-2">
            <h3 className="font-medium">{listing.title}</h3>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
              <p className="text-sm text-muted-foreground">{category.name}</p>
            </div>
            <p className="text-sm">Estimated: {listing.estimatedKg} kg</p>
            <p className="text-sm text-muted-foreground">
              {listing.location.address}, {listing.location.city}, {listing.location.state}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Pickup Date
                    </FormLabel>
                    <FormControl>
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => {
                          // Disable past dates and dates more than 30 days in the future
                          const now = new Date();
                          now.setHours(0, 0, 0, 0);
                          const thirtyDaysFromNow = new Date();
                          thirtyDaysFromNow.setDate(now.getDate() + 30);
                          return date < now || date > thirtyDaysFromNow;
                        }}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Time Slot
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a time slot" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {TIME_SLOTS.map((slot) => (
                          <SelectItem key={slot.value} value={slot.value}>
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Our pickup team will arrive within the selected hour
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-2">
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Scheduling...' : 'Schedule Pickup'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
