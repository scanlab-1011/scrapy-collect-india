
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { setupSupabaseTables } from '@/lib/supabase-setup';
import { toast } from '@/components/ui/sonner';

export function SetupDatabaseButton() {
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSetup = async () => {
    try {
      setIsLoading(true);
      await setupSupabaseTables();
      toast.success('Database setup completed successfully!');
    } catch (error: any) {
      console.error('Setup failed:', error);
      toast.error(error.message || 'Database setup failed');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      onClick={handleSetup} 
      disabled={isLoading}
      variant="outline"
    >
      {isLoading ? 'Setting up...' : 'Setup Database Tables'}
    </Button>
  );
}
