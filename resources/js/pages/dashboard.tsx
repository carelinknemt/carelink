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
import { formatMoney } from '@/lib/bookings';
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
                    <p className="text-xs text-muted-foreground">{caption}</p>
                </CardContent>
            </Card>
        </Link>
    );
}

function SectionCount({ count }: { count: number }) {
    if (count === 0) {
        return null;
    }

    return (
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
            {count}
        </span>
    );
}

function splitTimeLabel(pickupTime: string | null): {
    primary: string;
    secondary?: string;
} {
    if (!pickupTime) {
        return { primary: '—' };
    }

    const match = pickupTime.match(/^(.+?)\s*([AP]M)$/i);

    return match
        ? {
              primary: match[1],
              secondary: match[2].toUpperCase(),
          }
        : { primary: pickupTime };
}

function splitDateLabel(tripDate: string | null): {
    primary: string;
    secondary?: string;
} {
    if (!tripDate) {
        return { primary: '—' };
    }

    const date = new Date(`${tripDate}T00:00:00Z`);

    if (Number.isNaN(date.getTime())) {
        return { primary: tripDate };
    }

    return {
        primary: String(date.getUTCDate()),
        secondary: new Intl.DateTimeFormat('en-US', {
            month: 'short',
            timeZone: 'UTC',
        })
            .format(date)
            .toUpperCase(),
    };
}

function BookingMiniCard({
    booking,
    chipPrimary,
    chipSecondary,
}: {
    booking: PaidBooking;
    chipPrimary: string;
    chipSecondary?: string;
}) {
    return (
        <li>
            <Link
                href={showBooking.url({ booking: booking.id })}
                prefetch
                className="group flex flex-col gap-2.5 rounded-lg border p-3 transition-colors hover:border-slate-300 hover:bg-muted/40 sm:flex-row sm:items-center sm:gap-3"
            >
                <span className="flex min-w-0 items-center gap-3">
                    <span className="flex w-14 shrink-0 flex-col items-center justify-center gap-1 rounded-md bg-[#004b87]/10 py-2">
                        <span className="text-sm leading-none font-bold text-[#004b87] tabular-nums">
                            {chipPrimary}
                        </span>
                        {chipSecondary && (
                            <span className="text-[10px] leading-none font-semibold tracking-wide text-muted-foreground">
                                {chipSecondary}
                            </span>
                        )}
                    </span>

                    <span className="flex min-w-0 flex-col gap-0.5">
                        <span className="truncate text-sm font-semibold group-hover:underline">
                            {booking.booking_number}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                            {booking.passenger_name}
                        </span>
                    </span>
                </span>

                <span className="flex items-center justify-between gap-2 border-t pt-2.5 sm:ml-auto sm:flex-col sm:items-end sm:gap-1 sm:border-t-0 sm:pt-0">
                    <BookingStatusBadge status={booking.status} />
                    <span className="text-sm font-semibold whitespace-nowrap tabular-nums">
                        {formatMoney(booking.input_price)}
                    </span>
                </span>
            </Link>
        </li>
    );
}

function BookingList({
    bookings,
    emptyIcon,
    emptyTitle,
    emptyDescription,
    chips,
}: {
    bookings: PaidBooking[];
    emptyIcon: React.ReactNode;
    emptyTitle: string;
    emptyDescription: string;
    chips: (booking: PaidBooking) => { primary: string; secondary?: string };
}) {
    if (bookings.length === 0) {
        return (
            <div className="flex flex-col items-center gap-2 py-10 text-center">
                {emptyIcon}
                <p className="font-medium">{emptyTitle}</p>
                <p className="text-sm text-muted-foreground">
                    {emptyDescription}
                </p>
            </div>
        );
    }

    return (
        <ul className="flex flex-col gap-2">
            {bookings.map((booking) => {
                const { primary, secondary } = chips(booking);

                return (
                    <BookingMiniCard
                        key={booking.id}
                        booking={booking}
                        chipPrimary={primary}
                        chipSecondary={secondary}
                    />
                );
            })}
        </ul>
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
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Dashboard
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Overview of paid bookings for the dispatch team.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        title="Paid Bookings"
                        value={stats.total_paid}
                        caption="$30 booking fee collected"
                        href={dashboardBookings.url()}
                        icon={
                            <span className="flex size-8 items-center justify-center rounded-md bg-[#004b87]/10">
                                <CalendarCheck className="size-4 text-[#004b87]" />
                            </span>
                        }
                    />

                    <StatCard
                        title="Pending Dispatch"
                        value={stats.pending_dispatch}
                        caption="Awaiting assignment"
                        href={dashboardBookings.url({
                            query: { status: 'PENDING_DISPATCH' },
                        })}
                        icon={
                            <span className="flex size-8 items-center justify-center rounded-md bg-amber-500/10">
                                <Clock className="size-4 text-amber-600" />
                            </span>
                        }
                    />

                    <StatCard
                        title="In Transit"
                        value={stats.in_transit}
                        caption="Active trips"
                        href={dashboardBookings.url({
                            query: { status: 'IN_TRANSIT' },
                        })}
                        icon={
                            <span className="flex size-8 items-center justify-center rounded-md bg-[#06b6d4]/10">
                                <Truck className="size-4 text-[#06b6d4]" />
                            </span>
                        }
                    />

                    <StatCard
                        title="Completed"
                        value={stats.completed}
                        caption="Finished trips"
                        href={dashboardBookings.url({
                            query: { status: 'COMPLETED' },
                        })}
                        icon={
                            <span className="flex size-8 items-center justify-center rounded-md bg-[#22d3ee]/10">
                                <CheckCircle2 className="size-4 text-[#0e9cb3]" />
                            </span>
                        }
                    />
                </div>

                <div className="grid gap-4 xl:grid-cols-2">
                    <Card className="h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <Sunrise className="size-4 text-[#E64A19]" />
                                Today's Trips
                                <SectionCount count={today_trips.length} />
                            </CardTitle>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={dashboardBookings.url()} prefetch>
                                    View all
                                    <ArrowRight />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <BookingList
                                bookings={today_trips}
                                emptyIcon={
                                    <Sunrise className="size-8 text-muted-foreground" />
                                }
                                emptyTitle="No trips scheduled today"
                                emptyDescription="Paid bookings with a trip date of today appear here."
                                chips={(booking) =>
                                    splitTimeLabel(booking.pickup_time)
                                }
                            />
                        </CardContent>
                    </Card>

                    <Card className="h-full">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="flex items-center gap-2 text-base">
                                Recent Bookings
                                <SectionCount count={recent_bookings.length} />
                            </CardTitle>
                            <Button variant="ghost" size="sm" asChild>
                                <Link href={dashboardBookings.url()} prefetch>
                                    View all
                                    <ArrowRight />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <BookingList
                                bookings={recent_bookings}
                                emptyIcon={
                                    <DollarSign className="size-8 text-muted-foreground" />
                                }
                                emptyTitle="No paid bookings yet"
                                emptyDescription="Bookings appear here once the booking fee has been paid."
                                chips={(booking) =>
                                    splitDateLabel(booking.trip_date)
                                }
                            />
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
