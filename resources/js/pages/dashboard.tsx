import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarCheck,
    CheckCircle2,
    Clock,
    DollarSign,
    Truck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { dashboard } from '@/routes';
import { bookings as dashboardBookings } from '@/routes/dashboard';
import { show as showBooking } from '@/routes/dashboard/bookings';
import type { PaidBooking } from '@/types';

type DashboardStats = {
    total_paid: number;
    pending_dispatch: number;
    in_transit: number;
    completed: number;
};

const statusBadgeClasses: Record<string, string> = {
    COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    BAMBI_DISPATCHED: 'bg-[#06b6d4]/10 text-[#0e7490] border-[#06b6d4]/30',
    IN_TRANSIT: 'bg-[#22d3ee]/10 text-[#0e7490] border-[#22d3ee]/40',
    PENDING_DISPATCH: 'bg-amber-50 text-amber-700 border-amber-200',
};

function formatDate(date: string | null): string {
    if (!date) {
        return '—';
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(date));
}

export default function Dashboard({
    stats,
    recent_bookings,
}: {
    stats: DashboardStats;
    recent_bookings: PaidBooking[];
}) {
    return (
        <>
            <Head title="Dashboard">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                    <p className="text-muted-foreground text-sm">
                        Overview of paid bookings for the dispatch team.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Paid Bookings
                            </CardTitle>
                            <span className="bg-[#004b87]/10 flex size-8 items-center justify-center rounded-md">
                                <CalendarCheck className="size-4 text-[#004b87]" />
                            </span>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.total_paid}</p>
                            <p className="text-muted-foreground text-xs">
                                $30 booking fee collected
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Pending Dispatch
                            </CardTitle>
                            <span className="bg-amber-500/10 flex size-8 items-center justify-center rounded-md">
                                <Clock className="size-4 text-amber-600" />
                            </span>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.pending_dispatch}</p>
                            <p className="text-muted-foreground text-xs">Awaiting assignment</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                In Transit
                            </CardTitle>
                            <span className="bg-[#06b6d4]/10 flex size-8 items-center justify-center rounded-md">
                                <Truck className="size-4 text-[#06b6d4]" />
                            </span>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.in_transit}</p>
                            <p className="text-muted-foreground text-xs">Active trips</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                Completed
                            </CardTitle>
                            <span className="bg-[#22d3ee]/10 flex size-8 items-center justify-center rounded-md">
                                <CheckCircle2 className="size-4 text-[#0e9cb3]" />
                            </span>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{stats.completed}</p>
                            <p className="text-muted-foreground text-xs">Finished trips</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="text-base">Recent Bookings</CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={dashboardBookings.url()} prefetch>
                                View all
                                <ArrowRight />
                            </Link>
                        </Button>
                    </CardHeader>
                        <CardContent>
                            {recent_bookings.length === 0 ? (                                <div className="flex flex-col items-center gap-2 py-10 text-center">
                                    <DollarSign className="text-muted-foreground size-8" />
                                    <p className="font-medium">No paid bookings yet</p>
                                    <p className="text-muted-foreground text-sm">
                                        Bookings appear here once the $30 booking fee has been paid.
                                    </p>
                                </div>
                            ) : (
                                <ul className="flex flex-col">
                                    {recent_bookings.map((booking, index) => (
                                        <li
                                            key={booking.id}
                                            className={
                                                index > 0
                                                    ? 'border-t py-3 first:pt-0 last:pb-0'
                                                    : 'pb-3'
                                            }
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex min-w-0 flex-col">
                                                    <Link
                                                        href={showBooking.url({
                                                            booking: booking.id,
                                                        })}
                                                        className="font-medium text-sm hover:underline"
                                                        prefetch
                                                    >
                                                        {booking.booking_number}
                                                    </Link>
                                                    <span className="text-muted-foreground truncate text-xs">
                                                        {booking.passenger_name} · {formatDate(booking.trip_date)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            statusBadgeClasses[booking.status] ??
                                                            'bg-slate-50 text-slate-600 border-slate-200'
                                                        }
                                                    >
                                                        {booking.status.replaceAll('_', ' ')}
                                                    </Badge>
                                                    <span className="text-sm font-medium whitespace-nowrap">
                                                        ${Number(booking.input_price).toFixed(2)}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
