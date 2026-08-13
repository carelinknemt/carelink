import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { formatDate, formatMoney, statusLabel } from '@/lib/bookings';
import { dashboard } from '@/routes';
import { dispatch as dashboardDispatch } from '@/routes/dashboard';
import { show as showBooking, updateStatus as updateBookingStatus } from '@/routes/dashboard/bookings';
import type { DispatchPageProps } from '@/types/dashboard';

const COLUMN_META: Record<string, { title: string; dot: string }> = {
    PENDING_DISPATCH: { title: 'Pending Dispatch', dot: 'bg-amber-500' },
    BAMBI_DISPATCHED: { title: 'Bambi Dispatched', dot: 'bg-violet-500' },
    IN_TRANSIT: { title: 'In Transit', dot: 'bg-cyan-500' },
    COMPLETED: { title: 'Completed', dot: 'bg-emerald-500' },
};

export default function DashboardDispatch({ columns, statuses }: DispatchPageProps) {
    const [movingId, setMovingId] = useState<number | null>(null);
    const statusForm = useForm({ status: '' });

    function moveBooking(bookingId: number, newStatus: string) {
        if (statusForm.processing || movingId !== null) {
            return;
        }

        setMovingId(bookingId);
        statusForm.setData('status', newStatus);
        statusForm.patch(updateBookingStatus.url({ booking: bookingId }), {
            preserveScroll: true,
            onFinish: () => setMovingId(null),
        });
    }

    return (
        <>
            <Head title="Dispatch">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Dispatch Board</h1>
                    <p className="text-muted-foreground text-sm">
                        Move bookings between statuses to keep the dispatch team in sync.
                    </p>
                </div>

                <div className="overflow-x-auto pb-2">
                    <div className="grid min-w-[1100px] grid-cols-4 items-start gap-4">
                        {statuses.map((status) => {
                            const meta = COLUMN_META[status] ?? {
                                title: statusLabel(status),
                                dot: 'bg-slate-400',
                            };
                            const trips = columns[status] ?? [];

                            return (
                                <div key={status} className="flex min-w-0 flex-col gap-3">
                                    <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`size-2.5 rounded-full ${meta.dot}`} />
                                            <h2 className="text-sm font-semibold tracking-tight">
                                                {meta.title}
                                            </h2>
                                        </div>
                                        <span className="bg-muted text-muted-foreground inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2 text-xs font-bold">
                                            {trips.length}
                                        </span>
                                    </div>

                                    {trips.length === 0 ? (
                                        <div className="border-border flex min-h-24 items-center justify-center rounded-lg border border-dashed p-4 text-center">
                                            <p className="text-muted-foreground text-xs">
                                                No bookings here yet
                                            </p>
                                        </div>
                                    ) : (
                                        trips.map((booking) => (
                                            <Card key={booking.id} className="p-4">
                                                <div className="flex items-start justify-between gap-2">
                                                    <Link
                                                        href={showBooking.url({
                                                            booking: booking.id,
                                                        })}
                                                        className="text-sm font-semibold hover:underline"
                                                        prefetch
                                                    >
                                                        {booking.booking_number}
                                                    </Link>
                                                    <span className="text-sm font-medium whitespace-nowrap">
                                                        {formatMoney(booking.input_price)}
                                                    </span>
                                                </div>

                                                <p className="mt-1 truncate text-sm font-medium">
                                                    {booking.passenger_name}
                                                </p>

                                                <div className="text-muted-foreground mt-2 flex flex-col gap-1 text-xs">
                                                    <span className="flex items-center gap-1.5 truncate">
                                                        <MapPin className="size-3.5 shrink-0 text-[#004B87]" />
                                                        <span className="truncate">
                                                            {booking.pickup_address || '—'}
                                                        </span>
                                                    </span>
                                                    <span className="flex items-center gap-1.5 truncate">
                                                        <MapPin className="size-3.5 shrink-0 text-[#E64A19]" />
                                                        <span className="truncate">
                                                            {booking.dropoff_address || '—'}
                                                        </span>
                                                    </span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Clock className="size-3.5 shrink-0" />
                                                        {formatDate(booking.trip_date)} ·{' '}
                                                        {booking.pickup_time || '—'}
                                                    </span>
                                                </div>

                                                <div className="mt-3">
                                                    <Select
                                                        value={booking.status}
                                                        onValueChange={(value) =>
                                                            moveBooking(booking.id, value)
                                                        }
                                                        disabled={
                                                            statusForm.processing &&
                                                            movingId === booking.id
                                                        }
                                                    >
                                                        <SelectTrigger size="sm" className="w-full">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {statuses.map((option) => (
                                                                <SelectItem
                                                                    key={option}
                                                                    value={option}
                                                                >
                                                                    {statusLabel(option)}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                {statusForm.processing && movingId === booking.id && (
                                                    <p className="mt-2 text-xs text-muted-foreground">
                                                        Updating status…
                                                    </p>
                                                )}
                                            </Card>
                                        ))
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button variant="outline" size="sm" asChild>
                        <Link href={dashboard()}>
                            Back to dashboard
                            <ArrowRight />
                        </Link>
                    </Button>
                </div>
            </div>
        </>
    );
}

DashboardDispatch.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Dispatch',
            href: dashboardDispatch(),
        },
    ],
};