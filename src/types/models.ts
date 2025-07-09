export interface ArchitecturalWork {
  id: string;
  name: string;
  architect: string;
  year: number;
  location: {
    lat: number;
    lng: number;
    address: string;
    city: string;
    country: string;
  };
  description: string;
  overview: string;
  imageUrl: string;
  visitDuration: number; // minutes
  category: string;
}

export interface CostEstimate {
  budget: number;
  standard: number;
  premium: number;
  currency: string;
}

export interface RouteSegment {
  from: ArchitecturalWork;
  to: ArchitecturalWork;
  transportMode: 'flight' | 'train' | 'bus' | 'car';
  duration: number;
  cost: CostEstimate;
  distance: number;
}

export interface TravelRoute {
  works: ArchitecturalWork[];
  segments: RouteSegment[];
  totalDuration: number;
  totalCost: CostEstimate;
}
