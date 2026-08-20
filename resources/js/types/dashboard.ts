import type { PaginatedBookings } from '@/types/ui';

export type DashboardStats = {
    total_paid: number;
    pending_dispatch: number;
    in_transit: number;
    completed: number;
};

export type BookingFilters = {
    search?: string | null;
    status?: string | null;
    date_from?: string | null;
    date_to?: string | null;
    service_type?: string | null;
    sort?: string | null;
    direction?: string | null;
    per_page?: string | null;
};

export type BusinessPartnerRequest = {
    id: number;
    company_name: string;
    contact_name: string;
    email: string;
    phone: string;
    business_type: string;
    estimated_monthly_trips: number | null;
    message: string | null;
    status: string;
    submitted_at: string;
};

export type PaginatedBusinessPartnerRequests = {
    data: BusinessPartnerRequest[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
};

export type ContactMessage = {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    message: string;
    status: string;
    read_at: string | null;
    submitted_at: string;
};

export type PaginatedContactMessages = {
    data: ContactMessage[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
};

export type PaginatedBookingsWithFilters = PaginatedBookings & {
    filters: BookingFilters;
};

export type AnalyticsSummary = {
    bookings: number;
    revenue: number;
    avg_trip_price: number;
    completed_rate: number;
};

export type AnalyticsDaily = {
    date: string;
    bookings: number;
    revenue: number;
};

export type AnalyticsLabelCount = {
    label: string;
    count: number;
};

export type RepeatPassenger = {
    name: string;
    trips: number;
};

export type AnalyticsPageProps = {
    days: number;
    range: { from: string; to: string };
    summary: AnalyticsSummary;
    daily: AnalyticsDaily[];
    statuses: AnalyticsLabelCount[];
    services: AnalyticsLabelCount[];
    repeat_passengers: RepeatPassenger[];
};

export type PaymentRecord = {
    id: number;
    booking_number: string;
    passenger_name: string;
    passenger_email: string | null;
    trip_date: string | null;
    input_price: string | null;
    payment_status: string;
    amount: number;
    paid_at: string | null;
    refunded_at: string | null;
    stripe_checkout_session_id: string | null;
};

export type PaymentsSummary = {
    total_payments: number;
    collected: number;
    pending: number;
    refunded: number;
};

export type PaymentsFilters = {
    search?: string | null;
    status?: string | null;
};

export type UserRecord = {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    banned_at: string | null;
    joined_at: string;
};

export type UsersFilters = {
    search?: string | null;
    role?: 'admin' | 'member' | null;
};

type PaginatedRecords<T> = {
    data: T[];
    current_page: number;
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
};

export type PaginatedPayments = PaginatedRecords<PaymentRecord>;

export type PaginatedUsers = PaginatedRecords<UserRecord>;

export type ApplicationRecord = {
    id: number;
    position: string | null;
    name: string;
    email: string;
    phone: string;
    cover_letter: string;
    resume_name: string | null;
    submitted_at: string;
};

export type ApplicationsFilters = {
    role?: number | null;
    search?: string | null;
};

export type PaginatedApplications = PaginatedRecords<ApplicationRecord>;

export type JobOpeningRecord = {
    id: number;
    title: string;
    location: string;
    employment_type: string;
    summary: string | null;
    requirements: string[];
    benefits?: string[] | null;
    sort_order: number;
    active: boolean;
    applications_count: number;
};

export type CmsServiceRecord = {
    id: number;
    slug: string;
    category: 'MEDICAL' | 'NON_MEDICAL' | 'SPECIALTY';
    title: string;
    short_description: string;
    full_description: string | null;
    benefits: string[];
    image: string | null;
    icon_name: string | null;
    suitable_for: string[];
    typical_destinations: string[];
    base_rate: string | null;
    mileage_rate: string | null;
    sort_order: number;
    active: boolean;
};

export type CmsFleetVehicleRecord = {
    id: number;
    name: string;
    type: 'AMBULATORY' | 'WHEELCHAIR' | 'GURNEY' | 'TRANSIT_SHUTTLE';
    capacity: string | null;
    features: string[];
    description: string | null;
    image: string | null;
    accessibility_specs: string[];
    hourly_rate_est: string | null;
    sort_order: number;
    active: boolean;
};

export type CmsTeamMemberRecord = {
    id: number;
    name: string;
    role: string | null;
    title: string | null;
    bio: string | null;
    image: string | null;
    certifications: string[];
    experience_years: number | null;
    sort_order: number;
    active: boolean;
};

export type CmsFaqRecord = {
    id: number;
    question: string;
    answer: string;
    category: string | null;
    sort_order: number;
    active: boolean;
};

export type CmsBlogPostRecord = {
    id: number;
    title: string;
    slug: string;
    category: string | null;
    read_time: string | null;
    summary: string | null;
    excerpt: string | null;
    content: string | null;
    author: string | null;
    image: string | null;
    published_at: string | null;
    active: boolean;
};
