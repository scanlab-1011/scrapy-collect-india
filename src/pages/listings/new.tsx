
import AppLayout from '@/components/layout/app-layout';
import CreateListingWizard from '@/components/listing/create-listing-wizard';
import { UserRole } from '@/types';

export default function NewListing() {
  return (
    <AppLayout requireAuth={true} allowedRoles={[UserRole.SELLER]}>
      <div className="container py-8">
        <CreateListingWizard />
      </div>
    </AppLayout>
  );
}
