
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/auth-context";
import { ListingProvider } from "@/contexts/listing-context";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/login";

// Listing routes
import ListingsIndex from "./pages/listings/index";
import NewListing from "./pages/listings/new";
import ListingDetail from "./pages/listings/[id]";

// Dashboard routes
import DashboardQueue from "./pages/dashboard/queue";
import DashboardListingDetail from "./pages/dashboard/listings/[id]";
import DashboardAnalytics from "./pages/dashboard/analytics";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <ListingProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              
              {/* Listing Routes */}
              <Route path="/listings" element={<ListingsIndex />} />
              <Route path="/listings/new" element={<NewListing />} />
              <Route path="/listings/:id" element={<ListingDetail />} />
              
              {/* Dashboard Routes */}
              <Route path="/dashboard/queue" element={<DashboardQueue />} />
              <Route path="/dashboard/listings/:id" element={<DashboardListingDetail />} />
              <Route path="/dashboard/analytics" element={<DashboardAnalytics />} />
              
              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </ListingProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
