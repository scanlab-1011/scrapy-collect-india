
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, User, Plus, Package, BarChart, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { UserRole } from '@/types';
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;
  const getInitials = (name: string) => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };

  const navLinks = [
    { href: "/", label: "Home", showWhen: "always" },
    { href: "/listings", label: "My Listings", showWhen: "seller" },
    { href: "/listings/new", label: "Sell Scrap", showWhen: "seller" },
    { href: "/dashboard/queue", label: "Queue", showWhen: "staff" },
    { href: "/dashboard/analytics", label: "Analytics", showWhen: "staff" },
  ];

  const filteredLinks = navLinks.filter(link => {
    if (link.showWhen === "always") return true;
    if (link.showWhen === "seller" && user?.role === UserRole.SELLER) return true;
    if (link.showWhen === "staff" && (user?.role === UserRole.STAFF || user?.role === UserRole.ADMIN)) return true;
    return false;
  });

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center gap-2">
            <div className="rounded-md bg-scrapy-500 p-1">
              <Package className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-scrapy-800">Scrapy</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {filteredLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={`text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* User Menu & Mobile Nav Trigger */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <div className="hidden md:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar>
                        <AvatarFallback className="bg-scrapy-100 text-scrapy-800">
                          {user.name ? getInitials(user.name) : "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    {user.role === UserRole.SELLER && (
                      <DropdownMenuItem asChild>
                        <Link to="/listings/new" className="cursor-pointer">
                          <Plus className="mr-2 h-4 w-4" />
                          New Listing
                        </Link>
                      </DropdownMenuItem>
                    )}
                    {(user.role === UserRole.STAFF || user.role === UserRole.ADMIN) && (
                      <DropdownMenuItem asChild>
                        <Link to="/dashboard/analytics" className="cursor-pointer">
                          <BarChart className="mr-2 h-4 w-4" />
                          Analytics
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile Menu */}
              <div className="md:hidden">
                <Sheet open={open} onOpenChange={setOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left">
                    <div className="flex flex-col h-full">
                      <div className="py-4 border-b">
                        <Link 
                          to="/" 
                          className="flex items-center gap-2"
                          onClick={() => setOpen(false)}
                        >
                          <div className="rounded-md bg-scrapy-500 p-1">
                            <Package className="h-5 w-5 text-white" />
                          </div>
                          <span className="text-lg font-bold text-scrapy-800">Scrapy</span>
                        </Link>
                      </div>

                      <div className="flex flex-col gap-1 py-4">
                        {filteredLinks.map((link) => (
                          <Link
                            key={link.href}
                            to={link.href}
                            className={`py-2 px-4 text-sm font-medium rounded-md ${
                              isActive(link.href)
                                ? "bg-accent text-accent-foreground"
                                : "hover:bg-accent hover:text-accent-foreground"
                            }`}
                            onClick={() => setOpen(false)}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>
                      
                      <div className="mt-auto border-t py-4">
                        <div className="px-4 py-2">
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start px-4" 
                          onClick={() => {
                            logout();
                            setOpen(false);
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </>
          ) : (
            <Button asChild variant="default">
              <Link to="/login">Login</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
