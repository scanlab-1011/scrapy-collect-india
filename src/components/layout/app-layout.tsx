
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/auth-context';
import { UserRole } from '@/types';
import Navbar from './navbar';
import Footer from './footer';

interface AppLayoutProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  allowedRoles?: UserRole[];
}

export default function AppLayout({ 
  children, 
  requireAuth = false,
  allowedRoles
}: AppLayoutProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  // Check if loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-scrapy-500"></div>
      </div>
    );
  }

  // Check authentication requirements
  if (requireAuth && !user) {
    // Redirect to login with return URL
    return <Navigate to={`/login?redirect=${encodeURIComponent(location.pathname)}`} replace />;
  }

  // Check role requirements
  if (user && allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirect to appropriate page based on role
    if (user.role === UserRole.SELLER) {
      return <Navigate to="/listings" replace />;
    } else {
      return <Navigate to="/dashboard/queue" replace />;
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  );
}
