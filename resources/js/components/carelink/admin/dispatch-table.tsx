import { router } from '@inertiajs/react';
import { Calendar, Clock, DollarSign, MapPin, Phone, Search } from 'lucide-react';
import { useState } from 'react';
import Pagination from '@/components/carelink/admin/pagination';
import ViewToggle from '@/components/carelink/admin/view-toggle';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { getStatusBadgeColor } from '@/lib/formatters';
import { updateStatus } from '@/routes/admin/bookings';
import type { Paginated, RideBooking } from '@/types/carelink';

const STATUS_OPTIONS = ['PENDING_DISPATCH', 'BAMBI_DISPATCHED', 'IN_TRANSIT', 'COMPLETED'] as const;

interface DispatchTableProps {
    bookings: Paginated<RideBooking>;
}

function TripStatusSelect({ trip }: { trip: RideBooking }) {
    const handleStatusChange = (newStatus: string) => {
        router.patch(updateStatus(trip.id).url, { status: newStatus }, { preserveScroll: true });
    };

    return (
        <Select value={trip.status} onValueChange={handleStatusChange}>
            <SelectTrigger className={`h-8 w-44 rounded-md border text-xs font-semibold ${getStatusBadgeColor(trip.status)}`}>
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {STATUS_OPTIONS.map((status) => (
                    <SelectItem key={status} value={status}>
                        {status.replace('_', ' ')}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

function ListView({ trips }: { trips: RideBooking[] }) {
    return (
        <div className="overflow-x-auto rounded-xl border border-sidebar-border/70">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-sidebar-border/70 bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                        <th className="px-4 py-3 font-medium">Trip & Passenger</th>
                        <th className="px-4 py-3 font-medium">Schedule & Service</th>
                        <th className="px-4 py-3 font-medium">Pickup / Destination</th>
                        <th className="px-4 py-3 font-medium">Cost / Payment</th>
                        <th className="px-4 py-3 font-medium">Dispatch Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-sidebar-border/70">
                    {trips.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-4 py-10 text-center text-sm text-muted-foreground">
                                No medical transport records match your query.
                            </td>
                        </tr>
                    ) : (
                        trips.map((trip) => (
                            <tr key={trip.id} className="transition-colors hover:bg-muted/50">
                                <td className="px-4 py-3.5">
                                    <div className="flex items-center gap-2">
                                        <span className="font-mono text-xs font-semibold text-muted-foreground">{trip.booking_number}</span>
                                        <span className="font-medium">{trip.passenger_name}</span>
                                    </div>
                                    <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                                        <Phone className="h-3 w-3" />
                                        <span>{trip.phone}</span>
                                    </div>
                                </td>

                                <td className="px-4 py-3.5">
                                    <div className="flex items-center gap-1.5 text-sm">
                                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span>{trip.ride_date}</span>
                                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                        <span>{trip.ride_time}</span>
                                    </div>
                                    <div className="mt-1 text-xs text-muted-foreground">{trip.service_type}</div>
                                </td>

                                <td className="max-w-xs px-4 py-3.5">
                                    <div className="flex items-start gap-1.5 text-sm">
                                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                                        <span className="truncate">{trip.pickup_address}</span>
                                    </div>
                                    <div className="mt-1 flex items-start gap-1.5 text-sm text-muted-foreground">
                                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
                                        <span className="truncate">{trip.destination_address}</span>
                                    </div>
                                </td>

                                <td className="px-4 py-3.5">
                                    <div className="flex items-center gap-0.5 font-medium">
                                        <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                                        <span>{trip.estimated_cost ?? 0}</span>
                                        <span className="text-xs font-normal text-muted-foreground">
                                            ({trip.is_round_trip ? 'Round Trip' : 'One Way'})
                                        </span>
                                    </div>
                                    <div className="mt-0.5 text-xs text-muted-foreground">{trip.payment_method}</div>
                                </td>

                                <td className="px-4 py-3.5">
                                    <TripStatusSelect trip={trip} />
                                    {trip.bambi_dispatch_ref && (
                                        <div className="mt-1 truncate text-xs text-muted-foreground">{trip.bambi_dispatch_ref}</div>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}

function GridView({ trips }: { trips: RideBooking[] }) {
    if (trips.length === 0) {
        return (
            <div className="rounded-xl border border-dashed border-sidebar-border/70 py-10 text-center text-sm text-muted-foreground">
                No medical transport records match your query.
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {trips.map((trip) => (
                <Card key={trip.id} className="flex flex-col">
                    <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <p className="font-mono text-xs font-semibold text-muted-foreground">{trip.booking_number}</p>
                                <CardTitle className="mt-1 truncate text-base">{trip.passenger_name}</CardTitle>
                            </div>
                            <Badge variant="outline">{trip.service_type}</Badge>
                        </div>
                        <CardDescription className="flex items-center gap-1">
                            <Phone className="h-3 w-3" />
                            {trip.phone}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1 space-y-3 text-sm">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span className="font-medium text-foreground">{trip.ride_date}</span>
                            <Clock className="h-3.5 w-3.5" />
                            <span>{trip.ride_time}</span>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex items-start gap-1.5">
                                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" />
                                <span className="truncate">{trip.pickup_address}</span>
                            </div>
                            <div className="flex items-start gap-1.5 text-muted-foreground">
                                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-rose-500" />
                                <span className="truncate">{trip.destination_address}</span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between rounded-lg border border-sidebar-border/70 bg-muted/30 px-3 py-2">
                            <div>
                                <div className="flex items-center gap-0.5 font-semibold">
                                    <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                                    <span>${trip.estimated_cost ?? 0}</span>
                                    <span className="text-xs font-normal text-muted-foreground">
                                        ({trip.is_round_trip ? 'Round Trip' : 'One Way'})
                                    </span>
                                </div>
                                <div className="text-xs text-muted-foreground">{trip.payment_method}</div>
                            </div>
                            <TripStatusSelect trip={trip} />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

export default function DispatchTable({ bookings }: DispatchTableProps) {
    const [view, setView] = useState<'list' | 'grid'>('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('ALL');

    const filteredBookings = bookings.data.filter((b) => {
        const matchesSearch =
            b.passenger_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.booking_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.pickup_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.destination_address.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = statusFilter === 'ALL' || b.status === statusFilter;

        return matchesSearch && matchesFilter;
    });

    return (
        <Card>
            <CardHeader className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                <div className="space-y-1">
                    <CardTitle>Dispatch Requests</CardTitle>
                    <CardDescription>Search passengers or filter trips by dispatch status</CardDescription>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search passenger, ID, or route..."
                            className="pl-9"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Label htmlFor="status-filter" className="sr-only">
                            Filter by status
                        </Label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                            <SelectTrigger id="status-filter" className="w-44">
                                <SelectValue placeholder="Filter by status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ALL">All statuses</SelectItem>
                                {STATUS_OPTIONS.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status.replace('_', ' ')}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <ViewToggle view={view} onChange={setView} />
                    </div>
                </div>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
                {view === 'list' ? (
                    <ListView trips={filteredBookings} />
                ) : (
                    <GridView trips={filteredBookings} />
                )}

                <Pagination links={bookings.links} from={bookings.from} to={bookings.to} total={bookings.total} />
            </CardContent>
        </Card>
    );
}
