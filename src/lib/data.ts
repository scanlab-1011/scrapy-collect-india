
import { 
  Listing, 
  ListingStatus, 
  ScrapType, 
  User, 
  UserRole,
  Location
} from "@/types";
import { generateId, getRandomElement } from "./utils";

// Indian cities and states for sample data
const INDIAN_CITIES = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat"];
const INDIAN_STATES = ["Maharashtra", "Delhi", "Karnataka", "Telangana", "Tamil Nadu", "West Bengal", "Maharashtra", "Gujarat", "Rajasthan", "Gujarat"];
const INDIAN_PINCODES = ["400001", "110001", "560001", "500001", "600001", "700001", "411001", "380001", "302001", "395001"];

// Sample user data
export const USERS: User[] = [
  // Sellers
  {
    id: "user-1",
    email: "rahul@example.com",
    name: "Rahul Sharma",
    phone: "9876543210",
    role: UserRole.SELLER,
    createdAt: new Date("2023-01-15")
  },
  {
    id: "user-2",
    email: "priya@example.com",
    name: "Priya Patel",
    phone: "9876543211",
    role: UserRole.SELLER,
    createdAt: new Date("2023-02-21")
  },
  {
    id: "user-3",
    email: "amit@example.com",
    name: "Amit Kumar",
    phone: "9876543212",
    role: UserRole.SELLER,
    createdAt: new Date("2023-03-10")
  },
  {
    id: "user-4",
    email: "neha@example.com",
    name: "Neha Singh",
    phone: "9876543213",
    role: UserRole.SELLER,
    createdAt: new Date("2023-04-05")
  },
  {
    id: "user-5",
    email: "rajesh@example.com",
    name: "Rajesh Gupta",
    phone: "9876543214",
    role: UserRole.SELLER,
    createdAt: new Date("2023-05-12")
  },
  {
    id: "user-6",
    email: "ananya@example.com",
    name: "Ananya Reddy",
    phone: "9876543215",
    role: UserRole.SELLER,
    createdAt: new Date("2023-06-18")
  },
  {
    id: "user-7",
    email: "vivek@example.com",
    name: "Vivek Malhotra",
    phone: "9876543216",
    role: UserRole.SELLER,
    createdAt: new Date("2023-07-22")
  },
  {
    id: "user-8",
    email: "meera@example.com",
    name: "Meera Joshi",
    phone: "9876543217",
    role: UserRole.SELLER,
    createdAt: new Date("2023-08-14")
  },
  // Staff
  {
    id: "staff-1",
    email: "vikram@scrapy.in",
    name: "Vikram Desai",
    phone: "9876543218",
    role: UserRole.STAFF,
    createdAt: new Date("2022-11-01")
  },
  {
    id: "staff-2",
    email: "sunita@scrapy.in",
    name: "Sunita Rao",
    phone: "9876543219",
    role: UserRole.STAFF,
    createdAt: new Date("2022-12-05")
  },
  // Admin
  {
    id: "admin-1",
    email: "aditya@scrapy.in",
    name: "Aditya Mehta",
    phone: "9876543220",
    role: UserRole.ADMIN,
    createdAt: new Date("2022-10-01")
  }
];

// Function to generate random Indian address
function generateRandomLocation(index: number): Location {
  const cityIndex = index % INDIAN_CITIES.length;
  
  return {
    address: `${Math.floor(Math.random() * 100) + 1}, ${getRandomElement(["Green Park", "Shanti Nagar", "Vasant Vihar", "Model Town", "Gandhi Road", "MG Road", "Patel Nagar"])}`,
    city: INDIAN_CITIES[cityIndex],
    state: INDIAN_STATES[cityIndex],
    pincode: INDIAN_PINCODES[cityIndex],
    landmark: Math.random() > 0.5 ? `Near ${getRandomElement(["City Hospital", "Central Park", "Main Market", "Bus Stand", "Railway Station"])}` : undefined
  };
}

// Function to generate random scrap price per category
function getPricePerKg(category: ScrapType): number {
  switch (category) {
    case ScrapType.IRON:
      return Math.floor(Math.random() * 5) + 25;
    case ScrapType.COPPER:
      return Math.floor(Math.random() * 50) + 400;
    case ScrapType.ALUMINIUM:
      return Math.floor(Math.random() * 20) + 100;
    case ScrapType.BRASS:
      return Math.floor(Math.random() * 20) + 300;
    case ScrapType.STEEL:
      return Math.floor(Math.random() * 5) + 35;
    case ScrapType.PLASTIC_HDPE:
      return Math.floor(Math.random() * 5) + 15;
    case ScrapType.PLASTIC_PET:
      return Math.floor(Math.random() * 5) + 10;
    case ScrapType.PAPER:
      return Math.floor(Math.random() * 4) + 12;
    case ScrapType.CARDBOARD:
      return Math.floor(Math.random() * 4) + 8;
    case ScrapType.BOOKS:
      return Math.floor(Math.random() * 4) + 10;
    case ScrapType.E_WASTE:
      return Math.floor(Math.random() * 100) + 50;
    case ScrapType.GLASS:
      return Math.floor(Math.random() * 2) + 1;
    case ScrapType.MIXED_METALS:
      return Math.floor(Math.random() * 40) + 30;
    default:
      return 10;
  }
}

// Sample listing titles by category
function getListingTitle(category: ScrapType): string {
  switch (category) {
    case ScrapType.IRON:
      return getRandomElement([
        "Old iron gate for recycling",
        "Scrap iron rods and pipes",
        "Used iron furniture pieces",
        "Iron waste from renovation"
      ]);
    case ScrapType.COPPER:
      return getRandomElement([
        "Copper wires from electrical work",
        "Old copper pipes and fittings",
        "Scrap copper items for sale",
        "Copper electrical components"
      ]);
    case ScrapType.ALUMINIUM:
      return getRandomElement([
        "Aluminium window frames",
        "Old aluminium utensils",
        "Scrap aluminium sheets",
        "Aluminium waste materials"
      ]);
    case ScrapType.BRASS:
      return getRandomElement([
        "Antique brass items for scrap",
        "Old brass fixtures and fittings",
        "Used brass decor items",
        "Brass waste from workshop"
      ]);
    case ScrapType.STEEL:
      return getRandomElement([
        "Stainless steel kitchen waste",
        "Old steel furniture for recycling",
        "Steel scrap from construction",
        "Used steel appliance parts"
      ]);
    case ScrapType.PLASTIC_HDPE:
      return getRandomElement([
        "HDPE buckets and containers",
        "Plastic chairs for recycling",
        "Hard plastic waste items",
        "HDPE pipes and fittings"
      ]);
    case ScrapType.PLASTIC_PET:
      return getRandomElement([
        "Collection of PET bottles",
        "Plastic packaging waste",
        "Sorted PET containers",
        "Clean plastic bottle waste"
      ]);
    case ScrapType.PAPER:
      return getRandomElement([
        "Old newspapers collection",
        "Office paper waste",
        "Magazines and paper waste",
        "Paper waste from house clearing"
      ]);
    case ScrapType.CARDBOARD:
      return getRandomElement([
        "Moving boxes for recycling",
        "Cardboard packaging waste",
        "Flattened cardboard boxes",
        "Assorted cardboard scraps"
      ]);
    case ScrapType.BOOKS:
      return getRandomElement([
        "Old textbooks for recycling",
        "Unused books collection",
        "Academic books for paper waste",
        "Children's books for recycling"
      ]);
    case ScrapType.E_WASTE:
      return getRandomElement([
        "Old computer parts",
        "Broken electronics for recycling",
        "E-waste from office clearance",
        "Used electronic devices"
      ]);
    case ScrapType.GLASS:
      return getRandomElement([
        "Glass bottles collection",
        "Broken glass items for recycling",
        "Used glass containers",
        "Assorted glass waste"
      ]);
    case ScrapType.MIXED_METALS:
      return getRandomElement([
        "Mixed metal scraps from workshop",
        "Assorted metal items",
        "Various metal waste for recycling",
        "Metal components collection"
      ]);
    default:
      return "Scrap material for recycling";
  }
}

// Generate sample listings
export const LISTINGS: Listing[] = Array.from({ length: 15 }, (_, i) => {
  const category = Object.values(ScrapType)[Math.floor(Math.random() * Object.values(ScrapType).length)];
  const seller = USERS.filter(u => u.role === UserRole.SELLER)[i % 8];
  const isCollected = Math.random() > 0.7;
  const isScheduled = Math.random() > 0.5 || isCollected;
  let status = ListingStatus.PENDING;
  let pickupAt: Date | undefined = undefined;
  let dispatcherId: string | undefined = undefined;
  let actualKg: number | undefined = undefined;
  let payoutTxnId: string | undefined = undefined;
  
  if (isCollected) {
    status = ListingStatus.COLLECTED;
    pickupAt = new Date();
    pickupAt.setDate(pickupAt.getDate() - Math.floor(Math.random() * 7));
    dispatcherId = Math.random() > 0.5 ? "staff-1" : "staff-2";
    actualKg = parseFloat((Math.random() * 10 + 2).toFixed(1));
    payoutTxnId = `TXN${Math.floor(Math.random() * 1000000)}`;
  } else if (isScheduled) {
    status = ListingStatus.SCHEDULED;
    pickupAt = new Date();
    pickupAt.setDate(pickupAt.getDate() + Math.floor(Math.random() * 5) + 1);
    dispatcherId = Math.random() > 0.5 ? "staff-1" : "staff-2";
  }
  
  const createdAt = new Date();
  createdAt.setDate(createdAt.getDate() - Math.floor(Math.random() * 30));
  
  const estimatedKg = parseFloat((Math.random() * 15 + 1).toFixed(1));
  
  return {
    id: `listing-${i + 1}`,
    title: getListingTitle(category),
    category,
    estimatedKg,
    pricePerKg: getPricePerKg(category),
    location: generateRandomLocation(i),
    images: [`https://source.unsplash.com/random/300x300?recycling=${i + 1}`],
    status,
    pickupAt,
    actualKg,
    payoutTxnId,
    sellerId: seller.id,
    seller,
    dispatcherId,
    createdAt
  };
});

// Get current user (for mock auth)
let currentUser: User | null = USERS.find(u => u.role === UserRole.SELLER) || null;

export function getCurrentUser(): User | null {
  return currentUser;
}

export function setCurrentUser(user: User | null): void {
  currentUser = user;
}

// Mock API functions
export function getListings(): Listing[] {
  if (!currentUser) return [];
  
  // Filter listings based on user role
  if (currentUser.role === UserRole.SELLER) {
    return LISTINGS.filter(listing => listing.sellerId === currentUser?.id);
  }
  
  return LISTINGS;
}

export function getListingById(id: string): Listing | undefined {
  return LISTINGS.find(listing => listing.id === id);
}

export function createListing(listing: Omit<Listing, "id" | "status" | "createdAt" | "seller">): Listing {
  if (!currentUser) throw new Error("Not authenticated");
  
  const newListing: Listing = {
    ...listing,
    id: `listing-${LISTINGS.length + 1}`,
    status: ListingStatus.PENDING,
    sellerId: currentUser.id,
    seller: currentUser,
    createdAt: new Date()
  };
  
  LISTINGS.push(newListing);
  return newListing;
}

export function updateListing(id: string, updates: Partial<Listing>): Listing {
  const index = LISTINGS.findIndex(listing => listing.id === id);
  if (index === -1) throw new Error("Listing not found");
  
  const updatedListing = {
    ...LISTINGS[index],
    ...updates
  };
  
  LISTINGS[index] = updatedListing;
  return updatedListing;
}

export function scheduleListing(id: string, pickupAt: Date, dispatcherId: string): Listing {
  return updateListing(id, {
    status: ListingStatus.SCHEDULED,
    pickupAt,
    dispatcherId
  });
}

export function collectListing(id: string, actualKg: number): Listing {
  const listing = getListingById(id);
  if (!listing) throw new Error("Listing not found");
  
  const payoutTxnId = `TXN${Math.floor(Math.random() * 1000000)}`;
  
  return updateListing(id, {
    status: ListingStatus.COLLECTED,
    actualKg,
    payoutTxnId
  });
}

// Analytics data
export function getAnalytics() {
  const now = new Date();
  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  
  const currentMonthListings = LISTINGS.filter(
    listing => new Date(listing.createdAt) >= currentMonthStart
  );
  
  const collectedListings = currentMonthListings.filter(
    listing => listing.status === ListingStatus.COLLECTED
  );
  
  const totalCollectedKg = collectedListings.reduce(
    (sum, listing) => sum + (listing.actualKg || 0), 
    0
  );
  
  const totalPayout = collectedListings.reduce(
    (sum, listing) => sum + (listing.actualKg || 0) * listing.pricePerKg, 
    0
  );
  
  const categoryBreakdown = Object.values(ScrapType).map(category => {
    const categoryListings = collectedListings.filter(listing => listing.category === category);
    const categoryKg = categoryListings.reduce((sum, listing) => sum + (listing.actualKg || 0), 0);
    const categoryPayout = categoryListings.reduce(
      (sum, listing) => sum + (listing.actualKg || 0) * listing.pricePerKg, 
      0
    );
    
    return {
      category,
      totalKg: categoryKg,
      totalPayout: categoryPayout
    };
  }).filter(item => item.totalKg > 0);
  
  return {
    totalListings: currentMonthListings.length,
    pendingListings: currentMonthListings.filter(l => l.status === ListingStatus.PENDING).length,
    scheduledListings: currentMonthListings.filter(l => l.status === ListingStatus.SCHEDULED).length,
    collectedListings: collectedListings.length,
    totalCollectedKg,
    totalPayout,
    categoryBreakdown
  };
}

// Mock user authentication
export function loginUser(email: string): User {
  const user = USERS.find(u => u.email === email);
  if (!user) throw new Error("User not found");
  
  currentUser = user;
  return user;
}

export function logoutUser(): void {
  currentUser = null;
}
