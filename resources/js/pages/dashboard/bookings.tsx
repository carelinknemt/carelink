import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    CalendarDays,
    Download,
    Search,
    SlidersHorizontal,
    X,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { toast } from 'sonner';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatDate, formatMoney, statusLabel } from '@/lib/bookings';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { bookings as dashboardBookings } from '@/routes/dashboard';
import {
    exportMethod as dashboardBookingsExport,
    show as showBooking,
    updateStatus as updateBookingStatus,
} from '@/routes/dashboard/bookings';
import type { PaidBooking, PaginatedBookings } from '@/types';
import type { BookingFilters } from '@/types/dashboard';

type DashboardBookingsProps = {
    bookings: PaginatedBookings;
    filters: BookingFilters;
    statuses: string[];
    service_types: string[];
};

const PER_PAGE_OPTIONS = [15, 25, 50, 100];

function SortHeaderButton({
    label,
    column,
    sort,
    direction,
    onSort,
}: {
    label: string;
    column: string;
    sort: string | null | undefined;
    direction: string | null | undefined;
    onSort: (column: string) => void;
}) {
    const active = sort === column;

    return (
        <button
            type="button"
            onClick={() => onSort(column)}
            className="inline-flex items-center gap-1 font-medium hover:underline"
        >
            {label}
            {active ? (
                direction === 'desc' ? (
                    <ArrowDown className="size-3.5" />
                ) : (
                    <ArrowUp className="size-3.5" />
                )
            ) : (
                <ArrowUpDown className="opacity-50 size-3.5" />
            )}
        </button>
    );
}

type FilterDraft = {
    status: string;
    service_type: string;
    date_from: string;
    date_to: string;
};

function FilterFields({
    draft,
    statuses,
    service_types,
    onChange,
}: {
    draft: FilterDraft;
    statuses: string[];
    service_types: string[];
    onChange: (patch: Partial<FilterDraft>) => void;
}) {
    return (
        <div className="grid gap-3 sm:grid-cols-2">
            <div className="grid gap-1.5">
                <Label htmlFor="filter-status">Status</Label>
                <Select
                    value={draft.status}
                    onValueChange={(value) => onChange({ status: value })}
                >
                    <SelectTrigger id="filter-status" className="w-full">
                        <SelectValue placeholder="All statuses" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="__all">All statuses</SelectItem>
                        {statuses.map((status) => (
                            <SelectItem key={status} value={status}>
                                {statusLabel(status)}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor="filter-service-type">Service type</Label>
                <Select
                    value={draft.service_type}
                    onValueChange={(value) =>
                        onChange({ service_type: value === '__all' ? '' : value })
                    }
                >
                    <SelectTrigger id="filter-service-type" className="w-full">
                        <SelectValue placeholder="All services" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="__all">All services</SelectItem>
                        {service_types.map((serviceType) => (
                            <SelectItem key={serviceType} value={serviceType}>
                                {serviceType}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor="filter-date-from">Trip date from</Label>
                <Input
                    id="filter-date-from"
                    type="date"
                    className="w-full"
                    value={draft.date_from}
                    onChange={(event) => onChange({ date_from: event.target.value })}
                />
            </div>

            <div className="grid gap-1.5">
                <Label htmlFor="filter-date-to">Trip date to</Label>
                <Input
                    id="filter-date-to"
                    type="date"
                    className="w-full"
                    value={draft.date_to}
                    onChange={(event) => onChange({ date_to: event.target.value })}
                />
            </div>
        </div>
    );
}

export default function DashboardBookings({
    bookings,
    filters,
    statuses,
    service_types,
}: DashboardBookingsProps) {
    const form = useForm({
        search: filters.search ?? '',
        status: filters.status ?? '',
        date_from: filters.date_from ?? '',
        date_to: filters.date_to ?? '',
        service_type: filters.service_type ?? '',
        sort: filters.sort ?? '',
        direction: filters.direction ?? '',
        per_page: filters.per_page ?? '15',
    });

    const searchTimer = useRef<number | null>(null);

    const [isDesktop, setIsDesktop] = useState(() =>
        typeof window !== 'undefined'
            ? window.matchMedia('(min-width: 768px)').matches
            : false,
    );

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 768px)');
        const handler = (event: MediaQueryListEvent) => {
            setIsDesktop(event.matches);
        };

        mediaQuery.addEventListener('change', handler);

        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    const [filtersOpen, setFiltersOpen] = useState(false);
    const [draft, setDraft] = useState<FilterDraft>({
        status: '',
        service_type: '',
        date_from: '',
        date_to: '',
    });

    function navigate() {
        form.get(dashboardBookings.url(), {
            preserveState: true,
            preserveScroll: true,
        });
    }

    function flushPendingSearch() {
        if (searchTimer.current !== null) {
            window.clearTimeout(searchTimer.current);
            searchTimer.current = null;
        }
    }

    function openFilters() {
        setDraft({
            status: form.data.status,
            service_type: form.data.service_type,
            date_from: form.data.date_from,
            date_to: form.data.date_to,
        });
        setFiltersOpen(true);
    }

    function applySearch(event: FormEvent) {
        event.preventDefault();
        flushPendingSearch();
        navigate();
    }

    function applyFilters() {
        flushPendingSearch();
        form.setData('status', draft.status);
        form.setData('service_type', draft.service_type);
        form.setData('date_from', draft.date_from);
        form.setData('date_to', draft.date_to);
        setFiltersOpen(false);
        navigate();
    }

    function clearFilters() {
        flushPendingSearch();
        setDraft({ status: '', service_type: '', date_from: '', date_to: '' });
        form.setData('search', '');
        form.setData('status', '');
        form.setData('service_type', '');
        form.setData('date_from', '');
        form.setData('date_to', '');
        form.setData('sort', '');
        form.setData('direction', '');
        setFiltersOpen(false);
        navigate();
    }

    function changeSearch(value: string) {
        form.setData('search', value);

        if (searchTimer.current !== null) {
            window.clearTimeout(searchTimer.current);
        }

        searchTimer.current = window.setTimeout(navigate, 350);
    }

    function changeSort(column: string) {
        const active = form.data.sort === column;
        const nextDirection =
            active && form.data.direction === 'asc' ? 'desc' : 'asc';

        form.setData('sort', column);
        form.setData('direction', nextDirection);
        navigate();
    }

    function changePerPage(value: string) {
        form.setData('per_page', value);
        navigate();
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

    const hasFilters = Boolean(
        filters.search ||
            filters.status ||
            filters.date_from ||
            filters.date_to ||
            filters.service_type,
    );
    const activeFilterCount = [
        filters.status,
        filters.service_type,
        filters.date_from,
        filters.date_to,
    ].filter(Boolean).length;
    const filterActions = (
        <>
            <Button type="button" variant="outline" onClick={clearFilters}>
                <X />
                Clear filters
            </Button>
            <Button type="button" onClick={applyFilters} disabled={form.processing}>
                {form.processing ? 'Applying…' : 'Apply filters'}
            </Button>
        </>
    );
    const paginationLinks = bookings.links;
    const exportQuery = {
        search: filters.search ?? '',
        status: filters.status ?? '',
        date_from: filters.date_from ?? '',
        date_to: filters.date_to ?? '',
        service_type: filters.service_type ?? '',
        sort: filters.sort ?? '',
        direction: filters.direction ?? '',
    };

    return (
        <>
            <Head title="Bookings">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Bookings</h1>
                    <p className="text-muted-foreground text-sm">
                        Paid trip bookings. Sorted by trip date by default.
                    </p>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between gap-3 space-y-0">
                        <CardTitle className="text-base">Filters</CardTitle>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={openFilters}
                        >
                            <SlidersHorizontal />
                            Filters
                            {activeFilterCount > 0 && (
                                <span className="bg-primary text-primary-foreground ml-1 inline-flex size-5 items-center justify-center rounded-full text-xs font-medium">
                                    {activeFilterCount}
                                </span>
                            )}
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={applySearch} className="flex flex-col gap-4">
                            <div className="grid gap-1.5 sm:max-w-xl">
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
                                            changeSearch(event.target.value)
                                        }
                                    />
                                </div>
                                <p className="text-muted-foreground text-xs">
                                    Results update as you type.
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card className="flex-1">
                    <div className="flex flex-col items-start justify-between gap-3 px-6 pt-6 sm:flex-row sm:items-center">
                        <p className="text-muted-foreground text-sm">
                            Showing {bookings.from ?? 0}–{bookings.to ?? 0} of {bookings.total}{' '}
                            bookings
                        </p>
                        <div className="flex w-full items-center gap-2 sm:w-auto">
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground text-xs">Per page</span>
                                <Select value={form.data.per_page} onValueChange={changePerPage}>
                                    <SelectTrigger size="sm" className="w-20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {PER_PAGE_OPTIONS.map((option) => (
                                            <SelectItem
                                                key={option}
                                                value={String(option)}
                                            >
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size={isDesktop ? 'sm' : 'lg'}
                                        className={cn(
                                            'w-full sm:w-auto',
                                            !isDesktop &&
                                                'h-11 border-transparent bg-[#E64A19] text-white hover:bg-[#E64A19]/90 hover:text-white',
                                        )}
                                    >
                                        <Download />
                                        Export
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem asChild>
                                        <a
                                            href={dashboardBookingsExport.url({
                                                query: exportQuery,
                                            })}
                                            onClick={() =>
                                                toast.info('Preparing CSV export…')
                                            }
                                        >
                                            <Download />
                                            Export current results (CSV)
                                        </a>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
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
                                                    {formatMoney(booking.input_price)}
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
                                                                {statusLabel(status)}
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
                                                <TableHead>
                                                    <SortHeaderButton
                                                        label="Passenger"
                                                        column="passenger_name"
                                                        sort={filters.sort}
                                                        direction={filters.direction}
                                                        onSort={changeSort}
                                                    />
                                                </TableHead>
                                                <TableHead>
                                                    <SortHeaderButton
                                                        label="Trip Date"
                                                        column="trip_date"
                                                        sort={filters.sort}
                                                        direction={filters.direction}
                                                        onSort={changeSort}
                                                    />
                                                </TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">
                                                    <SortHeaderButton
                                                        label="Trip Price"
                                                        column="input_price"
                                                        sort={filters.sort}
                                                        direction={filters.direction}
                                                        onSort={changeSort}
                                                    />
                                                </TableHead>
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
                                                    <TableCell>
                                                        {formatDate(booking.trip_date)}
                                                    </TableCell>
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
                                                            <SelectTrigger
                                                                size="sm"
                                                                className="w-44"
                                                            >
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {statuses.map((status) => (
                                                                    <SelectItem
                                                                        key={status}
                                                                        value={status}
                                                                    >
                                                                        {statusLabel(status)}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {formatMoney(booking.input_price)}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </>
                        )}

                        {bookings.last_page > 1 && (
                            <div className="mt-6 hidden md:block">
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

            {isDesktop ? (
                <Dialog open={filtersOpen} onOpenChange={setFiltersOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Filters</DialogTitle>
                            <DialogDescription>
                                Narrow the list by status, service type, or trip date
                                range.
                            </DialogDescription>
                        </DialogHeader>
                        <FilterFields
                            draft={draft}
                            statuses={statuses}
                            service_types={service_types}
                            onChange={(patch) =>
                                setDraft((current) => ({ ...current, ...patch }))
                            }
                        />
                        <DialogFooter>{filterActions}</DialogFooter>
                    </DialogContent>
                </Dialog>
            ) : (
                <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                    <SheetContent
                        side="bottom"
                        className="max-h-[85dvh] overflow-y-auto"
                    >
                        <SheetHeader>
                            <SheetTitle>Filters</SheetTitle>
                            <SheetDescription>
                                Narrow the list by status, service type, or trip date
                                range.
                            </SheetDescription>
                        </SheetHeader>
                        <div className="px-4">
                            <FilterFields
                                draft={draft}
                                statuses={statuses}
                                service_types={service_types}
                                onChange={(patch) =>
                                    setDraft((current) => ({ ...current, ...patch }))
                                }
                            />
                        </div>
                        <SheetFooter>{filterActions}</SheetFooter>
                    </SheetContent>
                </Sheet>
            )}

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
                                        {statusLabel(statusTarget.booking.status)}
                                    </span>{' '}
                                    to{' '}
                                    <span className="text-foreground font-medium">
                                        {statusLabel(statusTarget.newStatus)}
                                    </span>
                                    . This will be visible to the dispatch team.
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline" disabled={statusForm.processing}>
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button onClick={confirmStatusChange} disabled={statusForm.processing}>
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