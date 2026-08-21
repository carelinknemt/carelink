import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    CalendarCheck,
    CheckCircle2,
    Clock,
    DollarSign,
    Sunrise,
    Truck,
} from 'lucide-react';
import { BookingStatusBadge } from '@/components/carelink/booking-status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatMoney } from '@/lib/bookings';
import { dashboard } from '@/routes';
import { bookings as dashboardBookings } from '@/routes/dashboard';
import { show as showBooking } from '@/routes/dashboard/bookings';
import type { PaidBooking } from '@/types';
import type { DashboardStats } from '@/types/dashboard';

function StatCard({
    title,
    value,
    caption,
    href,
    icon,
}: {
    title: string;
    value: number;
    caption: string;
    href: string;
    icon: React.ReactNode;
}) {
    return (
        <Link href={href} prefetch className="block">
            <Card className="transition-colors hover:border-slate-300 hover:shadow-sm">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        {title}
                    </CardTitle>
                    {icon}
                </CardHeader>
                <CardContent>
                    <p className="text-3xl font-bold">{value}</p>
                    <p className="text-muted-foreground text-xs">{caption}</p>
                </CardContent>
            </Card>
        </Link>
    );
}

export default function Dashboard({
    stats,
    today_trips,
    recent_bookings,
}: {
    stats: DashboardStats;
    today_trips: PaidBooking[];
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
                    <StatCard
                        title="Paid Bookings"
                        value={stats.total_paid}
                        caption="$30 booking fee collected"                        href={dashboardBookings.url()}
                        icon={
                            <span className="bg-[#004b87]/10 flex size-8 items-center justify-center rounded-md">
                                <CalendarCheck className="size-4 text-[#004b87]" />
                            </span>
                        }
                    />

                    <StatCard
                        title="Pending Dispatch"
                        value={stats.pending_dispatch}
                        caption="Awaiting assignment"                        href={dashboardBookings.url({
                            query: { status: 'PENDING_DISPATCH' },
                        })}
                        icon={
                            <span className="bg-amber-500/10 flex size-8 items-center justify-center rounded-md">
                                <Clock className="size-4 text-amber-600" />
                            </span>
                        }
                    />

                    <StatCard
                        title="In Transit"
                        value={stats.in_transit}
                        caption="Active trips"                        href={dashboardBookings.url({
                            query: { status: 'IN_TRANSIT' },
                        })}
                        icon={
                            <span className="bg-[#06b6d4]/10 flex size-8 items-center justify-center rounded-md">
                                <Truck className="size-4 text-[#06b6d4]" />
                            </span>
                        }
                    />

                    <StatCard
                        title="Completed"
                        value={stats.completed}
                        caption="Finished trips"                        href={dashboardBookings.url({
                            query: { status: 'COMPLETED' },
                        })}
                        icon={
                            <span className="bg-[#22d3ee]/10 flex size-8 items-center justify-center rounded-md">
                                <CheckCircle2 className="size-4 text-[#0e9cb3]" />
                            </span>
                        }
                    />
                </div>

                <div className="flex flex-col gap-4 sm:flex-row xl:grid-cols-2 items-stretch">
                    <Card className="flex-1">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Sunrise className="text-[#E64A19] size-4" />
                                Today's Trips
                            </CardTitle>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={dashboardBookings.url()} prefetch>
                                    View all
                                    <ArrowRight />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {today_trips.length === 0 ? (
                                <div className="flex flex-col items-center gap-2 py-10 text-center">
                                    <Sunrise className="text-muted-foreground size-8" />
                                    <p className="font-medium">No trips scheduled today</p>
                                    <p className="text-muted-foreground text-sm">
                                        Paid bookings with a trip date of today appear here.
                                    </p>
                                </div>
                            ) : (
                                <ul className="flex flex-col">
                                    {today_trips.map((booking, index) => (
                                        <li
                                            key={booking.id}
                                            className={
                                                index > 0
                                                    ? 'border-t py-3 first:pt-0 last:pb-0'
                                                    : 'pb-3'
                                            }
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex min-w-0 items-center gap-3">
                                                    <span className="text-muted-foreground w-14 shrink-0 text-xs font-bold whitespace-nowrap tabular-nums">
                                                        {booking.pickup_time || '—'}
                                                    </span>
                                                    <div className="flex min-w-0 flex-col">
                                                        <Link
                                                            href={showBooking.url({
                                                                booking: booking.id,
                                                            })}
                                                            className="text-sm font-medium hover:underline"
                                                            prefetch
                                                        >
                                                            {booking.booking_number}
                                                        </Link>
                                                        <span className="text-muted-foreground truncate text-xs">
                                                            {booking.passenger_name}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <BookingStatusBadge status={booking.status} />
                                                    <span className="text-sm font-medium whitespace-nowrap">
                                                        {formatMoney(booking.input_price)}
                                                    </span>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="flex-1">
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
                            {recent_bookings.length === 0 ? (
                                <div className="flex flex-col items-center gap-2 py-10 text-center">
                                    <DollarSign className="text-muted-foreground size-8" />
                                    <p className="font-medium">No paid bookings yet</p>
                                    <p className="text-muted-foreground text-sm">
                                        Bookings appear here once the $30 booking fee has been paid.
                                    </p>
                                </div>
                            ) : (
                                <ul className="flex flex-col gap-3">
                                    {recent_bookings.map((booking) => (
                                        <li
                                            key={booking.id}
                                            className="border-border rounded-lg border p-3"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <Link
                                                        href={showBooking.url({
                                                            booking: booking.id,
                                                        })}
                                                        className="text-sm font-medium hover:underline"
                                                        prefetch
                                                    >
                                                        {booking.booking_number}
                                                    </Link>
                                                    <p className="text-muted-foreground truncate text-xs">
                                                        {booking.passenger_name}
                                                    </p>
                                                </div>
                                                <span className="shrink-0 text-sm font-medium whitespace-nowrap">
                                                    {formatMoney(booking.input_price)}
                                                </span>
                                            </div>
                                            <div className="mt-2 flex items-center justify-between gap-3">
                                                <span className="text-muted-foreground truncate text-xs">
                                                    {formatDate(booking.trip_date)}
                                                </span>
                                                <BookingStatusBadge
                                                    status={booking.status}
                                                />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>
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