
export enum UserRole {
  SELLER = "SELLER",
  STAFF = "STAFF",
  ADMIN = "ADMIN"
}

export enum ScrapType {
  IRON = "IRON",
  COPPER = "COPPER",
  ALUMINIUM = "ALUMINIUM",
  BRASS = "BRASS",
  STEEL = "STEEL",
  PLASTIC_HDPE = "PLASTIC_HDPE",
  PLASTIC_PET = "PLASTIC_PET",
  PAPER = "PAPER",
  CARDBOARD = "CARDBOARD",
  BOOKS = "BOOKS",
  E_WASTE = "E_WASTE",
  GLASS = "GLASS",
  MIXED_METALS = "MIXED_METALS"
}

export enum ListingStatus {
  PENDING = "PENDING",
  SCHEDULED = "SCHEDULED",
  COLLECTED = "COLLECTED",
  CANCELLED = "CANCELLED"
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  phone?: string;
  createdAt: Date;
}

export interface Location {
  address: string;
  city: string;
  state: string;
  pincode: string;
  landmark?: string;
  coordinates?: {
    lat: number;
    lng: number;
  }
}

export interface Listing {
  id: string;
  title: string;
  category: ScrapType;
  estimatedKg: number;
  pricePerKg: number;
  location: Location;
  images: string[];
  status: ListingStatus;
  pickupAt?: Date;
  actualKg?: number;
  payoutTxnId?: string;
  sellerId: string;
  seller?: User;
  dispatcherId?: string;
  dispatcher?: User;
  createdAt: Date;
}

export interface ScrapCategory {
  type: ScrapType;
  name: string;
  description: string;
  priceRange: string;
  icon: string;
  color: string;
}
