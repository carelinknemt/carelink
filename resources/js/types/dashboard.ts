import type { PaginatedBookings } from '@/types/ui';

export type DashboardStats = {
    total_paid: number;
    pending_dispatch: number;
    in_transit: number;
    completed: number;
};

export type DashboardTrends = {
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