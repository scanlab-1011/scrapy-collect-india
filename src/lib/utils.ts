
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { 
  Listing, 
  ListingStatus, 
  Location, 
  ScrapType, 
  User, 
  UserRole, 
  ScrapCategory
} from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format price in Indian Rupees
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
}

// Format date in Indian style (DD/MM/YYYY)
export function formatDate(date: Date | undefined): string {
  if (!date) return "Not scheduled";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

// Format time in 12-hour format with AM/PM
export function formatTime(date: Date | undefined): string {
  if (!date) return "";
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
}

// Get random element from array
export function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 10);
}

// Get status badge color
export function getStatusColor(status: ListingStatus): string {
  switch (status) {
    case ListingStatus.PENDING:
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case ListingStatus.SCHEDULED:
      return "bg-blue-100 text-blue-800 border-blue-200";
    case ListingStatus.COLLECTED:
      return "bg-green-100 text-green-800 border-green-200";
    case ListingStatus.CANCELLED:
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
}

// Get human readable category name
export function getCategoryName(category: ScrapType): string {
  return category.replace("_", " ").replace(/_/g, "-").split(" ")
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

// Get category info including icon and color
export const SCRAP_CATEGORIES: ScrapCategory[] = [
  {
    type: ScrapType.IRON,
    name: "Iron",
    description: "Old iron items, gates, grills, and furniture",
    priceRange: "₹25-30/kg",
    icon: "package",
    color: "bg-gray-200"
  },
  {
    type: ScrapType.COPPER,
    name: "Copper",
    description: "Wires, pipes, and other copper items",
    priceRange: "₹400-450/kg",
    icon: "package",
    color: "bg-amber-200"
  },
  {
    type: ScrapType.ALUMINIUM,
    name: "Aluminium",
    description: "Utensils, frames, and other aluminium items",
    priceRange: "₹100-120/kg",
    icon: "package",
    color: "bg-slate-200"
  },
  {
    type: ScrapType.BRASS,
    name: "Brass",
    description: "Utensils, decorative items, and fixtures",
    priceRange: "₹300-320/kg",
    icon: "package",
    color: "bg-yellow-200"
  },
  {
    type: ScrapType.STEEL,
    name: "Steel",
    description: "Utensils, appliances, and other steel items",
    priceRange: "₹35-40/kg",
    icon: "package",
    color: "bg-blue-200"
  },
  {
    type: ScrapType.PLASTIC_HDPE,
    name: "Plastic (HDPE)",
    description: "Hard plastic items like buckets and pipes",
    priceRange: "₹15-20/kg",
    icon: "package",
    color: "bg-blue-100"
  },
  {
    type: ScrapType.PLASTIC_PET,
    name: "Plastic (PET)",
    description: "Bottles and containers",
    priceRange: "₹10-15/kg",
    icon: "package",
    color: "bg-sky-100"
  },
  {
    type: ScrapType.PAPER,
    name: "Paper",
    description: "Newspapers, magazines, and office paper",
    priceRange: "₹12-16/kg",
    icon: "file",
    color: "bg-yellow-50"
  },
  {
    type: ScrapType.CARDBOARD,
    name: "Cardboard",
    description: "Boxes and packaging material",
    priceRange: "₹8-12/kg",
    icon: "package",
    color: "bg-amber-100"
  },
  {
    type: ScrapType.BOOKS,
    name: "Books",
    description: "Old books and textbooks",
    priceRange: "₹10-14/kg",
    icon: "book",
    color: "bg-orange-100"
  },
  {
    type: ScrapType.E_WASTE,
    name: "E-Waste",
    description: "Electronic waste and appliances",
    priceRange: "₹40-150/kg",
    icon: "tv",
    color: "bg-emerald-100"
  },
  {
    type: ScrapType.GLASS,
    name: "Glass",
    description: "Bottles, jars, and glassware",
    priceRange: "₹1-3/kg",
    icon: "package",
    color: "bg-cyan-100"
  },
  {
    type: ScrapType.MIXED_METALS,
    name: "Mixed Metals",
    description: "Assorted metal scraps",
    priceRange: "₹30-70/kg",
    icon: "package",
    color: "bg-zinc-200"
  },
];

// Get category by type
export function getCategoryByType(type: ScrapType): ScrapCategory {
  return SCRAP_CATEGORIES.find(cat => cat.type === type) || SCRAP_CATEGORIES[0];
}

// Calculate total payout amount
export function calculatePayoutAmount(listing: Listing): number {
  if (!listing.actualKg) return 0;
  return listing.actualKg * listing.pricePerKg;
}
