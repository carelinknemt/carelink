import type { ReactNode } from 'react';
import type { BreadcrumbItem } from '@/types/navigation';

export type AppLayoutProps = {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
};

export type AppVariant = 'header' | 'sidebar';

export type FlashToast = {
    type: 'success' | 'info' | 'warning' | 'error';
    message: string;
};

export type AuthLayoutProps = {
    children?: ReactNode;
    name?: string;
    title?: string;
    description?: string;
};

export type BlacklistEntry = {
    id: number;
    reason: string;
    by: string;
    at: string;
};

export type PaidBooking = {
    id: number;
    booking_number: string;
    passenger_name: string;
    phone: string | null;
    email: string | null;
    service_type: string | null;
    trip_date: string | null;
    pickup_time: string | null;
    pickup_address: string | null;
    dropoff_address: string | null;
    input_price: string;
    status: string;
    paid_at: string | null;
    booked_at: string;
    blacklist: BlacklistEntry | null;
};

export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

export type PaginatedBookings = {
    data: PaidBooking[];
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
    links: PaginationLink[];
};
