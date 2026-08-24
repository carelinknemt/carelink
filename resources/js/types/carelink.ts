export interface TransportService {
    id: number;
    slug: string;
    category: 'MEDICAL' | 'NON_MEDICAL' | 'SPECIALTY';
    title: string;
    short_description: string;
    full_description: string;
    benefits: string[];
    image: string;
    icon_name: string;
    suitable_for: string[];
    typical_destinations: string[];
    base_rate: string;
    mileage_rate: string;
}

export interface FleetVehicle {
    id: number;
    name: string;
    type: 'AMBULATORY' | 'WHEELCHAIR' | 'GURNEY' | 'TRANSIT_SHUTTLE';
    capacity: string;
    features: string[];
    description: string;
    image: string;
    accessibility_specs: string[];
    hourly_rate_est: string;
}

export interface TeamMember {
    id: number;
    name: string;
    role: string;
    title: string;
    bio: string;
    image: string | null;
    certifications: string[];
    experience_years: number;
}

export interface FaqItem {
    id: number;
    question: string;
    answer: string;
    category: string;
}

export interface BlogPost {
    id: number;
    title: string;
    slug: string;
    category: string;
    read_time: string;
    summary: string;
    excerpt: string | null;
    content: string;
    author: string;
    image: string;
    published_at: string;
}

export interface Career {
    id: number;
    title: string;
    location: string;
    employment_type: string;
    summary: string | null;
    requirements: string[];
    benefits?: string[] | null;
    created_at?: string;
}

export interface RideBooking {
    id: number;
    booking_number: string;
    passenger_name: string;
    phone: string;
    email: string | null;
    service_type: string;
    pickup_address: string;
    pickup_county: string;
    destination_address: string;
    destination_county: string;
    ride_date: string;
    ride_time: string;
    is_round_trip: boolean;
    wheelchair_needed: boolean;
    oxygen_needed: boolean;
    additional_notes: string | null;
    payment_method: string;
    estimated_cost: string | null;
    status: 'PENDING_DISPATCH' | 'BAMBI_DISPATCHED' | 'IN_TRANSIT' | 'COMPLETED';
    bambi_dispatch_ref: string | null;
    created_at: string;
}

export interface HeroSlide {
    id: string;
    title: string;
    subtitle: string;
    highlightText: string;
    features: {
        title: string;
        description: string;
        icon: string;
    }[];
    bgImage: string;
}

export interface BookingConfirmation {
    booking_number: string;
    passenger_name: string;
    service_type: string;
    pickup_address: string;
    pickup_county: string;
    destination_address: string;
    destination_county: string;
    ride_date: string;
    ride_time: string;
    estimated_cost: string | null;
    payment_method: string;
}

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Paginated<T> {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    first_page_url: string | null;
    from: number | null;
    last_page: number;
    last_page_url: string | null;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
}
