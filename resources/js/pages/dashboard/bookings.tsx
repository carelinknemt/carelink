import { Head, Link, useForm } from '@inertiajs/react';
import { CalendarDays, Download, Search, X } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { dashboard } from '@/routes';
import { bookings as dashboardBookings } from '@/routes/dashboard';
import {
    exportMethod as dashboardBookingsExport,
    show as showBooking,
    updateStatus as updateBookingStatus,
} from '@/routes/dashboard/bookings';
import type { PaidBooking, PaginatedBookings } from '@/types';

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

type DashboardBookingsProps = {
    bookings: PaginatedBookings;
    filters: {
        search?: string;
        status?: string;
        date?: string;
    };
    statuses: string[];
};

export default function DashboardBookings({
    bookings,
    filters,
    statuses,
}: DashboardBookingsProps) {
    const form = useForm({
        search: filters.search ?? '',
        status: filters.status ?? '',
        date: filters.date ?? '',
    });

    function applyFilters(event: FormEvent) {
        event.preventDefault();

        form.get(dashboardBookings.url(), {
            preserveState: true,
            preserveScroll: true,
        });
    }

    function changeStatus(value: string) {
        form.setData('status', value === '__all' ? '' : value);
        form.get(dashboardBookings.url(), {
            preserveState: true,
            preserveScroll: true,
        });
    }

    function changeDate(value: string) {
        form.setData('date', value);
        form.get(dashboardBookings.url(), {
            preserveState: true,
            preserveScroll: true,
        });
    }

    function clearFilters() {
        form.setData('search', '');
        form.setData('status', '');
        form.setData('date', '');
        form.get(dashboardBookings.url(), {
            preserveState: true,
            preserveScroll: true,
        });
    }

    const [statusTarget, setStatusTarget] = useState<{
        booking: PaidBooking;
        newStatus: string;
    } | null>(null);

    const statusForm = useForm({ status: '' });

    function confirmStatusChange() {
        if (!statusTarget) {
            return;
        }

        statusForm.setData('status', statusTarget.newStatus);
        statusForm.patch(updateBookingStatus.url({ booking: statusTarget.booking.id }), {
            preserveScroll: true,
            onSuccess: () => setStatusTarget(null),
        });
    }

    const hasFilters = Boolean(filters.search || filters.status || filters.date);
    const paginationLinks = bookings.links;

    return (
        <>
            <Head title="Bookings">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
                    <p className="text-muted-foreground text-sm">
                        Paid trip bookings, soonest trip date first.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={applyFilters} className="flex flex-col gap-4">
                            <div className="grid items-end gap-3 md:grid-cols-2 xl:grid-cols-4">
                                <div className="grid gap-1.5 xl:col-span-2">
                                    <Label htmlFor="filter-search">Search</Label>
                                    <div className="relative">
                                        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                                        <Input
                                            id="filter-search"
                                            type="search"
                                            placeholder="Booking number, passenger, phone, or email…"
                                            className="pl-9"
                                            value={form.data.search}
                                            onChange={(event) =>
                                                form.setData('search', event.target.value)
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="filter-status">Status</Label>
                                    <Select
                                        value={form.data.status}
                                        onValueChange={changeStatus}
                                    >
                                        <SelectTrigger id="filter-status" className="w-full">
                                            <SelectValue placeholder="All statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="__all">All statuses</SelectItem>
                                            {statuses.map((status) => (
                                                <SelectItem key={status} value={status}>
                                                    {status.replaceAll('_', ' ')}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="filter-date">Trip date</Label>
                                    <Input
                                        id="filter-date"
                                        type="date"
                                        className="w-full"
                                        value={form.data.date}
                                        onChange={(event) => changeDate(event.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button type="submit" disabled={form.processing}>
                                    {form.processing ? 'Searching…' : 'Search'}
                                </Button>

                                {hasFilters && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={clearFilters}
                                    >
                                        <X />
                                        Clear filters
                                    </Button>
                                )}
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card className="flex-1">
                    <div className="flex flex-col items-start justify-between gap-3 px-6 pt-6 sm:flex-row sm:items-center">
                        <p className="text-muted-foreground text-sm">
                            Showing {bookings.from ?? 0}–{bookings.to ?? 0} of {bookings.total} bookings
                        </p>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto" asChild>
                            <a
                                href={dashboardBookingsExport.url({
                                    query: {
                                        search: filters.search ?? '',
                                        status: filters.status ?? '',
                                        date: filters.date ?? '',
                                    },
                                })}
                            >
                                <Download />
                                Export CSV
                            </a>
                        </Button>
                    </div>

                    <CardContent className="pt-6">
                        {bookings.data.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-16 text-center">
                                <CalendarDays className="text-muted-foreground size-10" />
                                <p className="font-medium">No paid bookings found</p>
                                <p className="text-muted-foreground text-sm">
                                    {hasFilters
                                        ? 'Try adjusting your search, date, or status filter.'
                                        : 'Bookings appear here once the $30 booking fee has been paid.'}
                                </p>
                            </div>
                        ) : (
                            <>
                                <ul className="flex flex-col gap-3 md:hidden">
                                    {bookings.data.map((booking) => (
                                        <li
                                            key={booking.id}
                                            className="border-border rounded-lg border p-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <Link
                                                        href={showBooking.url({ booking: booking.id })}
                                                        className="font-medium hover:underline"
                                                        prefetch
                                                    >
                                                        {booking.booking_number}
                                                    </Link>
                                                    <p className="text-muted-foreground text-sm">
                                                        {booking.passenger_name}
                                                    </p>
                                                </div>
                                                <span className="shrink-0 font-medium">
                                                    ${Number(booking.input_price).toFixed(2)}
                                                </span>
                                            </div>
                                            <div className="mt-3 flex items-center justify-between gap-3">
                                                <span className="text-muted-foreground text-sm">
                                                    {formatDate(booking.trip_date)}
                                                </span>
                                                <Select
                                                    value={booking.status}
                                                    onValueChange={(value) =>
                                                        setStatusTarget({
                                                            booking,
                                                            newStatus: value,
                                                        })
                                                    }
                                                >
                                                    <SelectTrigger size="sm" className="w-44">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {statuses.map((status) => (
                                                            <SelectItem
                                                                key={status}
                                                                value={status}
                                                            >
                                                                {status.replaceAll('_', ' ')}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <div className="hidden md:block">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Booking #</TableHead>
                                                <TableHead>Passenger</TableHead>
                                                <TableHead>Trip Date</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Trip Price</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {bookings.data.map((booking) => (
                                                <TableRow key={booking.id}>
                                                    <TableCell>
                                                        <Link
                                                            href={showBooking.url({ booking: booking.id })}
                                                            className="font-medium hover:underline"
                                                            prefetch
                                                        >
                                                            {booking.booking_number}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell className="font-medium">
                                                        {booking.passenger_name}
                                                    </TableCell>
                                                    <TableCell>{formatDate(booking.trip_date)}</TableCell>
                                                    <TableCell>
                                                        <Select
                                                            value={booking.status}
                                                            onValueChange={(value) =>
                                                                setStatusTarget({
                                                                    booking,
                                                                    newStatus: value,
                                                                })
                                                            }
                                                        >
                                                            <SelectTrigger size="sm" className="w-44">
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {statuses.map((status) => (
                                                                    <SelectItem
                                                                        key={status}
                                                                        value={status}
                                                                    >
                                                                        {status.replaceAll('_', ' ')}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        ${Number(booking.input_price).toFixed(2)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </>
                        )}

                        {bookings.last_page > 1 && (
                            <div className="mt-6">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            {bookings.prev_page_url ? (
                                                <PaginationPrevious asChild>
                                                    <Link href={bookings.prev_page_url} prefetch>
                                                        <span className="hidden sm:block">Previous</span>
                                                    </Link>
                                                </PaginationPrevious>
                                            ) : (
                                                <PaginationPrevious
                                                    className="pointer-events-none opacity-50"
                                                    aria-disabled="true"
                                                />
                                            )}
                                        </PaginationItem>

                                        {paginationLinks.map((link, index) => {
                                            if (!link.url) {
                                                return (
                                                    <PaginationItem key={index}>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                );
                                            }

                                            const label = link.label
                                                .replaceAll('&laquo;', '«')
                                                .replaceAll('&raquo;', '»');

                                            return (
                                                <PaginationItem key={index}>
                                                    <PaginationLink
                                                        href={link.url}
                                                        isActive={link.active}
                                                        asChild
                                                    >
                                                        <Link href={link.url} prefetch>
                                                            {label}
                                                        </Link>
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        })}

                                        <PaginationItem>
                                            {bookings.next_page_url ? (
                                                <PaginationNext asChild>
                                                    <Link href={bookings.next_page_url} prefetch>
                                                        <span className="hidden sm:block">Next</span>
                                                    </Link>
                                                </PaginationNext>
                                            ) : (
                                                <PaginationNext
                                                    className="pointer-events-none opacity-50"
                                                    aria-disabled="true"
                                                />
                                            )}
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog
                open={statusTarget !== null}
                onOpenChange={(open) => {
                    if (!open && !statusForm.processing) {
                        setStatusTarget(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Change booking status?</DialogTitle>
                        <DialogDescription>
                            {statusTarget && (
                                <>
                                    You are about to change{' '}
                                    <span className="text-foreground font-medium">
                                        {statusTarget.booking.booking_number}
                                    </span>{' '}
                                    from{' '}
                                    <span className="text-foreground font-medium">
                                        {statusTarget.booking.status.replaceAll('_', ' ')}
                                    </span>{' '}
                                    to{' '}
                                    <span className="text-foreground font-medium">
                                        {statusTarget.newStatus.replaceAll('_', ' ')}
                                    </span>
                                    . This will be visible to the dispatch team.
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                disabled={statusForm.processing}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            onClick={confirmStatusChange}
                            disabled={statusForm.processing}
                        >
                            {statusForm.processing ? 'Updating…' : 'Confirm change'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

DashboardBookings.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Bookings',
            href: dashboardBookings(),
        },
    ],
};
