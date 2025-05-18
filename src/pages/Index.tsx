import { useNavigate } from 'react-router-dom';
import { ArrowRight, Check, MapPin, Package, Trash2, Scale } from 'lucide-react';
import AppLayout from '@/components/layout/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SCRAP_CATEGORIES } from '@/lib/utils';
import { ScrapType, UserRole } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { SetupDatabaseButton } from '@/components/ui/setup-database-button';

export default function Index() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const features = [
    {
      title: "Get Your Scrap Collected",
      description: "Schedule a pickup at your location - no need to transport heavy materials.",
      icon: Package
    },
    {
      title: "Best Prices Guaranteed",
      description: "We offer competitive rates for all types of recyclable materials.",
      icon: Scale
    },
    {
      title: "Seamless Experience",
      description: "Easy listing, scheduled pickups, and instant payments.",
      icon: Check
    }
  ];
  
  const howItWorks = [
    {
      title: "List Your Scrap",
      description: "Tell us what materials you have through our simple form.",
      icon: Package
    },
    {
      title: "Schedule Pickup",
      description: "Our team will contact you to arrange a convenient time.",
      icon: MapPin
    },
    {
      title: "Get Paid",
      description: "We'll weigh your scrap on-site and pay you instantly.",
      icon: Scale
    }
  ];
  
  // Materials to display on the landing page
  const featuredCategories = [
    ScrapType.PAPER,
    ScrapType.IRON,
    ScrapType.COPPER,
    ScrapType.ALUMINIUM,
    ScrapType.E_WASTE,
    ScrapType.PLASTIC_PET
  ];
  
  return (
    <AppLayout>
      {/* Hero Section */}
      <div className="bg-gradient-to-b from-scrapy-50 to-white">
        <div className="container py-12 md:py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-scrapy-800">
                Turn Your Scrap Into Cash
              </h1>
              <p className="text-lg text-gray-600">
                India's premier scrap collection service. We pick up, weigh and pay you on the spot for your recyclable materials.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" onClick={() => navigate('/listings/new')}>
                  Sell Your Scrap
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate('/login')}>
                  {user ? 'Dashboard' : 'Login'}
                </Button>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Trash2 className="h-4 w-4" />
                <span>Join the recycling revolution. Reduce waste, earn money.</span>
              </div>
              
              {/* Admin database setup section */}
              {user?.role === UserRole.ADMIN && (
                <div className="p-4 border rounded-md mt-4 bg-slate-50">
                  <h3 className="text-sm font-medium mb-2">Admin Tools</h3>
                  <p className="text-xs text-muted-foreground mb-3">
                    Set up the Supabase database tables and policies
                  </p>
                  <SetupDatabaseButton />
                </div>
              )}
            </div>
            <div className="hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=600&h=500"
                alt="Scrap Collection" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Materials Section */}
      <section className="py-12 bg-white">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Materials We Buy</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {featuredCategories.map(categoryType => {
              const category = SCRAP_CATEGORIES.find(c => c.type === categoryType);
              if (!category) return null;
              
              return (
                <Card 
                  key={category.type} 
                  className="flex flex-col items-center text-center p-4 hover:border-scrapy-300 transition-colors"
                >
                  <div className={`w-12 h-12 rounded-full ${category.color} flex items-center justify-center mb-3`}>
                    <Package className="h-6 w-6 text-scrapy-700" />
                  </div>
                  <CardContent className="p-0">
                    <h3 className="font-medium">{category.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{category.priceRange}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Button variant="outline" onClick={() => navigate('/listings/new')}>
              View All Materials
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-gray-50">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Why Choose Scrapy?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-none shadow-sm">
                <CardContent className="pt-6">
                  <div className="h-12 w-12 rounded-full bg-scrapy-100 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-scrapy-700" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 bg-white">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {howItWorks.map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-scrapy-500 text-white flex items-center justify-center mb-4 relative">
                  <span className="text-xl font-bold">{index + 1}</span>
                  {index < howItWorks.length - 1 && (
                    <div className="hidden md:block absolute left-full top-1/2 w-full h-0.5 bg-scrapy-200 -translate-y-1/2">
                      <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 text-scrapy-300" />
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Button size="lg" onClick={() => navigate('/listings/new')}>
              Sell Your Scrap Now
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-scrapy-500 text-white">
        <div className="container text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to turn your scrap into cash?</h2>
          <p className="text-lg mb-8 text-white/90">
            Join thousands of sellers who trust Scrapy for their recycling needs.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-scrapy-700 hover:bg-scrapy-50" 
            onClick={() => navigate('/listings/new')}
          >
            Get Started Now
          </Button>
        </div>
      </section>
    </AppLayout>
  );
}
