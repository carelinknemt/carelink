export interface VehicleFleet {
  id: string;
  name: string;
  type: 'AMBULATORY' | 'WHEELCHAIR' | 'GURNEY' | 'TRANSIT_SHUTTLE';
  capacity: string;
  features: string[];
  description: string;
  image: string;
  accessibilitySpecs: string[];
  hourlyRateEst: number;
}

export interface TransportService {
  id: string;
  category: 'MEDICAL' | 'NON_MEDICAL' | 'SPECIALTY';
  title: string;
  shortDescription: string;
  fullDescription: string;
  benefits: string[];
  image: string;
  iconName: string;
  suitableFor: string[];
  typicalDestinations: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  title: string;
  bio: string;
  image: string;
  certifications: string[];
  experienceYears: number;
}

export interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  highlightText: string;
  features?: {
    title: string;
    description: string;
    icon: string;
  }[];
  bgImage: string;
}

export interface RideBooking {
  id: string;
  passengerName: string;
  phone: string;
  email: string;
  serviceType: 'Ambulatory Sedan' | 'Wheelchair Van' | 'Gurney Stretcher' | 'Transit Shuttle';
  pickupAddress: string;
  pickupCounty: 'Humboldt' | 'Del Norte' | 'Trinity' | 'Shasta' | string;
  destinationAddress: string;
  destinationCounty: 'Humboldt' | 'Del Norte' | 'Trinity' | 'Shasta' | string;
  rideDate: string;
  rideTime: string;
  isRoundTrip: boolean;
  wheelchairNeeded: boolean;
  oxygenNeeded: boolean;
  additionalNotes?: string;
  paymentMethod: 'Insurance / Medicaid' | 'Facility Billing' | 'Credit Card (Stripe/Square)' | 'Private Pay Cash';
  estimatedCost?: number;
  status: 'PENDING_DISPATCH' | 'BAMBI_DISPATCHED' | 'IN_TRANSIT' | 'COMPLETED';
  bambiDispatchRef?: string;
  createdAt: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface BlogPost {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  summary: string;
  excerpt?: string;
  author?: string;
  content?: string;
  image: string;
}

export interface B2BPartnerRequest {
  id: string;
  facilityName: string;
  facilityType: 'Hospital' | 'Dialysis Clinic' | 'Skilled Nursing' | 'Rehab Center' | 'Managed Care';
  contactPerson: string;
  email: string;
  phone: string;
  county: string;
  estimatedTripsPerMonth: string;
  notes?: string;
  status: 'NEW' | 'UNDER_REVIEW' | 'ONBOARDED';
  submittedAt: string;
}

export interface JobApplication {
  id: string;
  applicantName: string;
  position: 'NEMT Driver' | 'Dispatcher' | 'Fleet Maintenance' | 'Operations Assistant';
  email: string;
  phone: string;
  drivingExperienceYears: number;
  hasCleanRecord: boolean;
  certifications: string[];
  notes?: string;
  submittedAt: string;
}
