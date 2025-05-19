
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { setupSupabaseTables } from '@/lib/supabase-setup';
import { toast } from '@/components/ui/sonner';
import { isSupabaseConfigured } from '@/lib/supabase';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export function SetupDatabaseButton() {
  const [isLoading, setIsLoading] = useState(false);
  const [showEnvHelp, setShowEnvHelp] = useState(false);
  
  const handleSetup = async () => {
    try {
      setIsLoading(true);
      
      // Check if environment variables are set using our helper
      if (!isSupabaseConfigured()) {
        setShowEnvHelp(true);
        return;
      }
      
      await setupSupabaseTables();
      toast.success('Database setup completed successfully!');
    } catch (error: any) {
      console.error('Setup failed:', error);
      
      // Display more specific error message
      if (error.message?.includes('authentication')) {
        toast.error('Authentication error: Please check your Supabase API keys');
      } else if (error.message?.includes('permission')) {
        toast.error('Permission denied: Please check your Supabase permissions');
      } else {
        toast.error(error.message || 'Database setup failed');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <Button 
        onClick={handleSetup} 
        disabled={isLoading}
        variant="outline"
      >
        {isLoading ? 'Setting up...' : 'Setup Database Tables'}
      </Button>
      
      <Dialog open={showEnvHelp} onOpenChange={setShowEnvHelp}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Environment Variables Required</DialogTitle>
            <DialogDescription>
              <p className="mb-4">
                Before setting up the database, you need to configure your Supabase environment variables.
              </p>
              <div className="bg-muted p-3 rounded-md mb-4">
                <p className="font-mono text-sm mb-2">
                  VITE_SUPABASE_URL=https://your-project-url.supabase.co
                </p>
                <p className="font-mono text-sm">
                  VITE_SUPABASE_ANON_KEY=your-anon-key
                </p>
              </div>
              <p className="mb-4">
                You can find these values in your Supabase project dashboard under Project Settings → API.
              </p>
              <p className="text-amber-500">
                Note: For production, these environment variables must be set on your hosting platform.
              </p>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowEnvHelp(false)}>
              I understand
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
