
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-background/95">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="rounded-md bg-scrapy-500 p-1">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-scrapy-800">Scrapy</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground">
              India's premier scrap collection service. Sell your recyclable materials with ease and earn money.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Quick Links</h4>
            <div className="flex flex-col space-y-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
                Home
              </Link>
              <Link to="/listings" className="text-sm text-muted-foreground hover:text-foreground">
                My Listings
              </Link>
              <Link to="/listings/new" className="text-sm text-muted-foreground hover:text-foreground">
                Sell Scrap
              </Link>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Materials</h4>
            <div className="flex flex-col space-y-2">
              <Link to="/materials/metals" className="text-sm text-muted-foreground hover:text-foreground">
                Metals
              </Link>
              <Link to="/materials/paper" className="text-sm text-muted-foreground hover:text-foreground">
                Paper & Cardboard
              </Link>
              <Link to="/materials/plastic" className="text-sm text-muted-foreground hover:text-foreground">
                Plastics
              </Link>
              <Link to="/materials/e-waste" className="text-sm text-muted-foreground hover:text-foreground">
                E-Waste
              </Link>
            </div>
          </div>
          
          <div className="space-y-3">
            <h4 className="text-sm font-semibold">Contact</h4>
            <div className="flex flex-col space-y-2">
              <a href="tel:+911234567890" className="text-sm text-muted-foreground hover:text-foreground">
                +91 12345 67890
              </a>
              <a href="mailto:contact@scrapy.in" className="text-sm text-muted-foreground hover:text-foreground">
                contact@scrapy.in
              </a>
              <p className="text-sm text-muted-foreground">
                123 Green Avenue, Mumbai, Maharashtra 400001
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 border-t pt-6 flex flex-col md:flex-row justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Scrapy. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-foreground">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
