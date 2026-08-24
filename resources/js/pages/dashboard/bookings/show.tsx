import { Head, useForm } from '@inertiajs/react';
import { Ban, Download, Loader2, MapPinned, Pencil } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useState } from 'react';
import { CopyButton } from '@/components/carelink/copy-button';
import MapPreview from '@/components/carelink/map-preview';
import type { MapPoint } from '@/components/carelink/map-preview';
import PhoneInput, { isUsPhoneNumber } from '@/components/carelink/phone-input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { formatDate, formatDateTime, statusLabel } from '@/lib/bookings';
import { dashboard } from '@/routes';
import { bookings as dashboardBookings } from '@/routes/dashboard';
import {
    cancel as cancelBooking,
    showExport as showBookingExport,
    update as updateBooking,
    updateStatus as updateBookingStatus,
} from '@/routes/dashboard/bookings';

type BookingDetail = Record<string, string | number | boolean | null>;

interface RouteInfo {
    coordinates: [number, number][];
    distanceMiles: number;
}

interface OsrmRouteResponse {
    code: string;
    routes?: Array<{
        distance: number;
        geometry: { coordinates: [number, number][] };
    }>;
}

const OSRM_ENDPOINT = 'https://router.project-osrm.org/route/v1/driving';

const MILES_PER_METER = 0.000621371;

type DetailField = {
    key: string;
    label: string;
    type?:
        | 'bool'
        | 'date'
        | 'datetime'
        | 'money'
        | 'number'
        | 'phone'
        | 'textarea';
};

type DetailSection = {
    title: string;
    editable?: boolean;
    fields: DetailField[];
};

const detailSections: DetailSection[] = [
    {
        title: 'Passenger',
        editable: true,
        fields: [
            { key: 'passenger_first_name', label: 'First name' },
            { key: 'passenger_last_name', label: 'Last name' },
            { key: 'passenger_phone_number', label: 'Phone', type: 'phone' },
            { key: 'passenger_email', label: 'Email' },
            { key: 'passenger_dob', label: 'Date of birth', type: 'date' },
            { key: 'passenger_gender', label: 'Gender' },
            { key: 'passenger_weight', label: 'Weight (lbs)', type: 'number' },
            {
                key: 'passenger_is_bariatric',
                label: 'Bariatric passenger',
                type: 'bool',
            },
            { key: 'passenger_notes', label: 'Notes', type: 'textarea' },
        ],
    },
    {
        title: 'Trip & Billing',
        editable: true,
        fields: [
            { key: 'payer', label: 'Payer' },
            { key: 'transport_type', label: 'Transport type' },
            { key: 'service_type', label: 'Service type' },
            { key: 'will_call', label: 'Will call', type: 'bool' },
            { key: 'trip_date', label: 'Trip date', type: 'date' },
            { key: 'pickup_time', label: 'Pickup time' },
            { key: 'appointment_time', label: 'Appointment time' },
            { key: 'load_time', label: 'Load time' },
            { key: 'unload_time', label: 'Unload time' },
            { key: 'input_price', label: 'Trip price', type: 'money' },
            { key: 'tag_list', label: 'Tags' },
        ],
    },
    {
        title: 'Pickup',
        editable: true,
        fields: [
            { key: 'pickup_address', label: 'Address' },
            { key: 'pickup_address_details', label: 'Address details' },
            { key: 'pickup_contact_name', label: 'Contact name' },
            {
                key: 'pickup_contact_phone_number',
                label: 'Contact phone',
                type: 'phone',
            },
            { key: 'pickup_stairs', label: 'Stairs', type: 'bool' },
            { key: 'pickup_stair_equipment', label: 'Stair equipment' },
            {
                key: 'pickup_driver_notes',
                label: 'Driver notes',
                type: 'textarea',
            },
            { key: 'pickup_latitude', label: 'Latitude', type: 'number' },
            { key: 'pickup_longitude', label: 'Longitude', type: 'number' },
        ],
    },
    {
        title: 'Dropoff',
        editable: true,
        fields: [
            { key: 'dropoff_address', label: 'Address' },
            { key: 'dropoff_address_details', label: 'Address details' },
            { key: 'dropoff_contact_name', label: 'Contact name' },
            {
                key: 'dropoff_contact_phone_number',
                label: 'Contact phone',
                type: 'phone',
            },
            { key: 'dropoff_stairs', label: 'Stairs', type: 'number' },
            { key: 'dropoff_stair_equipment', label: 'Stair equipment' },
            {
                key: 'dropoff_driver_notes',
                label: 'Driver notes',
                type: 'textarea',
            },
            { key: 'dropoff_latitude', label: 'Latitude', type: 'number' },
            { key: 'dropoff_longitude', label: 'Longitude', type: 'number' },
        ],
    },
    {
        title: 'Medical & Accessibility',
        editable: true,
        fields: [
            { key: 'oxygen_required', label: 'Oxygen required', type: 'bool' },
            {
                key: 'oxygen_liters_per_min',
                label: 'Oxygen (L/min)',
                type: 'number',
            },
            {
                key: 'attendants_needed',
                label: 'Attendants needed',
                type: 'number',
            },
            {
                key: 'additional_passengers',
                label: 'Additional passengers',
                type: 'number',
            },
            {
                key: 'must_provide_wheelchair',
                label: 'Must provide wheelchair',
                type: 'bool',
            },
            {
                key: 'has_infectious_disease',
                label: 'Infectious disease',
                type: 'bool',
            },
            { key: 'requested_by_name', label: 'Requested by' },
            {
                key: 'requested_by_phone_number',
                label: 'Requested by phone',
                type: 'phone',
            },
            {
                key: 'dispatcher_notes',
                label: 'Dispatcher notes',
                type: 'textarea',
            },
        ],
    },
    {
        title: 'Payment & Dispatch',
        fields: [
            { key: 'booking_number', label: 'Booking number' },
            { key: 'payment_status', label: 'Payment status' },
            { key: 'paid_at', label: 'Paid at', type: 'datetime' },
            { key: 'refunded_at', label: 'Refunded at', type: 'datetime' },
            { key: 'stripe_checkout_session_id', label: 'Stripe session' },
            { key: 'trip_request_csv_path', label: 'CSV file' },
            { key: 'created_at', label: 'Booked at', type: 'datetime' },
        ],
    },
];

function formatValue(
    value: string | number | boolean | null,
    type?: string,
): string {
    if (value === null || value === undefined || value === '') {
        return '—';
    }

    switch (type) {
        case 'bool':
            return value ? 'Yes' : 'No';
        case 'date':
            return formatDate(String(value));
        case 'datetime':
            return formatDateTime(String(value));
        case 'money':
            return `$${Number(value).toFixed(2)}`;
        default:
            return String(value);
    }
}

function toFormValue(
    value: string | number | boolean | null,
    type?: string,
): string | boolean {
    if (type === 'bool') {
        return Boolean(value);
    }

    if (value === null || value === undefined) {
        return '';
    }

    if (type === 'date') {
        return String(value).slice(0, 10);
    }

    return String(value);
}

function SectionEditDialog({
    section,
    booking,
    onClose,
}: {
    section: DetailSection;
    booking: BookingDetail;
    onClose: () => void;
}) {
    const defaults = Object.fromEntries(
        section.fields.map((field) => [
            field.key,
            toFormValue(booking[field.key], field.type),
        ]),
    );

    const form = useForm<Record<string, string | boolean>>(defaults);

    function submit(event: FormEvent) {
        event.preventDefault();

        form.put(updateBooking.url({ booking: Number(booking.id) }), {
            preserveScroll: true,
            onSuccess: onClose,
        });
    }

    return (
        <Dialog open onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>
                        Edit {section.title.toLowerCase()}
                    </DialogTitle>
                    <DialogDescription>
                        Update the {section.title.toLowerCase()} details for{' '}
                        {booking.booking_number}.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                    {section.fields.map((field) => {
                        const error = form.errors[field.key];
                        const spanAll =
                            field.type === 'textarea' || field.type === 'bool';

                        return (
                            <div
                                key={field.key}
                                className={
                                    spanAll ? 'sm:col-span-2' : undefined
                                }
                            >
                                {field.type === 'bool' ? (
                                    <label className="flex items-center gap-2 text-sm font-medium">
                                        <Checkbox
                                            checked={Boolean(
                                                form.data[field.key],
                                            )}
                                            onCheckedChange={(checked) =>
                                                form.setData(
                                                    field.key,
                                                    Boolean(checked),
                                                )
                                            }
                                        />
                                        {field.label}
                                    </label>
                                ) : (
                                    <div className="grid gap-2">
                                        <Label htmlFor={`edit-${field.key}`}>
                                            {field.label}
                                        </Label>
                                        {field.type === 'textarea' ? (
                                            <Textarea
                                                id={`edit-${field.key}`}
                                                value={String(
                                                    form.data[field.key] ?? '',
                                                )}
                                                onChange={(event) =>
                                                    form.setData(
                                                        field.key,
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                        ) : field.type === 'phone' ? (
                                            <PhoneInput
                                                id={`edit-${field.key}`}
                                                value={String(
                                                    form.data[field.key] ?? '',
                                                )}
                                                onChange={(value) =>
                                                    form.setData(
                                                        field.key,
                                                        value,
                                                    )
                                                }
                                            />
                                        ) : (
                                            <Input
                                                id={`edit-${field.key}`}
                                                type={
                                                    field.type === 'date'
                                                        ? 'date'
                                                        : field.type ===
                                                                'number' ||
                                                            field.type ===
                                                                'money'
                                                          ? 'number'
                                                          : 'text'
                                                }
                                                step={
                                                    field.type === 'money'
                                                        ? '0.01'
                                                        : undefined
                                                }
                                                value={String(
                                                    form.data[field.key] ?? '',
                                                )}
                                                onChange={(event) =>
                                                    form.setData(
                                                        field.key,
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                        )}
                                    </div>
                                )}
                                {error && (
                                    <p className="mt-1 text-xs text-destructive">
                                        {error}
                                    </p>
                                )}
                                {field.type === 'phone' &&
                                    !error &&
                                    String(
                                        form.data[field.key] ?? '',
                                    ).trim() !== '' &&
                                    !isUsPhoneNumber(
                                        String(form.data[field.key]),
                                    ) && (
                                        <p className="mt-1 text-xs text-destructive">
                                            Enter a valid US phone number.
                                        </p>
                                    )}
                            </div>
                        );
                    })}

                    <DialogFooter className="sm:col-span-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={form.processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={form.processing}>
                            {form.processing ? 'Saving…' : 'Save changes'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function BookingDetail({
    booking,
    statuses,
    booking_fee,
}: {
    booking: BookingDetail;
    statuses: string[];
    booking_fee: string;
}) {
    const [statusTarget, setStatusTarget] = useState<string | null>(null);
    const [editSection, setEditSection] = useState<DetailSection | null>(null);
    const [cancelOpen, setCancelOpen] = useState(false);
    const [route, setRoute] = useState<RouteInfo | null>(null);
    const [routeFailed, setRouteFailed] = useState(false);

    const hasRouteCoords = Boolean(
        booking.pickup_latitude &&
        booking.pickup_longitude &&
        booking.dropoff_latitude &&
        booking.dropoff_longitude,
    );
    const routeLoading = hasRouteCoords && !routeFailed && route === null;

    const statusForm = useForm({ status: '' });
    const cancelForm = useForm({});

    function confirmStatusChange() {
        if (!statusTarget) {
            return;
        }

        statusForm.setData('status', statusTarget);
        statusForm.patch(
            updateBookingStatus.url({ booking: Number(booking.id) }),
            {
                preserveScroll: true,
                onSuccess: () => setStatusTarget(null),
            },
        );
    }

    function confirmCancellation() {
        cancelForm.post(cancelBooking.url({ booking: Number(booking.id) }), {
            preserveScroll: true,
            onSuccess: () => setCancelOpen(false),
        });
    }

    const isCancelled = booking.status === 'CANCELLED';
    const isCompleted = booking.status === 'COMPLETED';
    const canCancel = !isCancelled && !isCompleted;

    const mapPoints: MapPoint[] = [];

    if (booking.pickup_latitude && booking.pickup_longitude) {
        mapPoints.push({
            label: String(booking.pickup_address || 'Pickup location'),
            latitude: Number(booking.pickup_latitude),
            longitude: Number(booking.pickup_longitude),
            kind: 'pickup',
        });
    }

    if (booking.dropoff_latitude && booking.dropoff_longitude) {
        mapPoints.push({
            label: String(booking.dropoff_address || 'Dropoff location'),
            latitude: Number(booking.dropoff_latitude),
            longitude: Number(booking.dropoff_longitude),
            kind: 'dropoff',
        });
    }

    useEffect(() => {
        const pickupLatitude = booking.pickup_latitude;
        const pickupLongitude = booking.pickup_longitude;
        const dropoffLatitude = booking.dropoff_latitude;
        const dropoffLongitude = booking.dropoff_longitude;

        if (
            !pickupLatitude ||
            !pickupLongitude ||
            !dropoffLatitude ||
            !dropoffLongitude
        ) {
            return undefined;
        }

        const controller = new AbortController();
        let cancelled = false;

        const url =
            `${OSRM_ENDPOINT}/${pickupLongitude},${pickupLatitude};` +
            `${dropoffLongitude},${dropoffLatitude}?overview=full&geometries=geojson`;

        fetch(url, { signal: controller.signal })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Route request failed: ${response.status}`);
                }

                return response.json();
            })
            .then((data: OsrmRouteResponse) => {
                if (cancelled) {
                    return;
                }

                const result = data?.routes?.[0];

                if (data.code !== 'Ok' || !result) {
                    throw new Error('No route found');
                }

                const coordinates = result.geometry.coordinates.map(
                    ([longitude, latitude]) =>
                        [latitude, longitude] as [number, number],
                );

                setRoute({
                    coordinates,
                    distanceMiles: result.distance * MILES_PER_METER,
                });
            })
            .catch((error: unknown) => {
                if (cancelled || (error as Error).name === 'AbortError') {
                    return;
                }

                setRoute(null);
                setRouteFailed(true);
            });

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [
        booking.pickup_latitude,
        booking.pickup_longitude,
        booking.dropoff_latitude,
        booking.dropoff_longitude,
    ]);

    return (
        <>
            <Head title={`Booking ${booking.booking_number}`}>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex min-w-0 flex-col gap-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex min-w-0 flex-col gap-1">
                            <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                                <span className="break-all">
                                    {booking.booking_number}
                                </span>
                                <CopyButton
                                    value={String(booking.booking_number)}
                                    label={String(booking.booking_number)}
                                />
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                {String(booking.passenger_first_name)}{' '}
                                {String(booking.passenger_last_name)} · booked{' '}
                                {formatDateTime(String(booking.created_at))}
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {canCancel && (
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => setCancelOpen(true)}
                                >
                                    <Ban />
                                    Cancel booking
                                </Button>
                            )}
                            {isCancelled ? (
                                <Button variant="outline" size="sm" disabled>
                                    <Download />
                                    Export CSV
                                </Button>
                            ) : (
                                <Button variant="outline" size="sm" asChild>
                                    <a
                                        href={showBookingExport.url({
                                            booking: Number(booking.id),
                                        })}
                                    >
                                        <Download />
                                        Export CSV
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <Select
                            value={String(booking.status)}
                            onValueChange={setStatusTarget}
                        >
                            <SelectTrigger
                                size="sm"
                                className="w-full sm:w-44"
                                style={{ borderColor: 'transparent' }}
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {statuses.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {statusLabel(status)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Badge
                            variant="outline"
                            className={
                                isCancelled
                                    ? 'border-rose-200 bg-rose-50 text-rose-700'
                                    : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            }
                        >
                            {isCancelled
                                ? `$${booking_fee} refunded`
                                : `$${booking_fee} fee paid`}
                        </Badge>
                    </div>
                </div>

                <div className="grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {detailSections.map((section) => (
                        <Card key={section.title} className="min-w-0">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-base">
                                    {section.title}
                                </CardTitle>
                                {section.editable && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="gap-1.5"
                                        onClick={() => setEditSection(section)}
                                    >
                                        <Pencil />
                                        Edit
                                    </Button>
                                )}
                            </CardHeader>
                            <CardContent>
                                <dl className="flex flex-col">
                                    {section.fields.map((field, index) => (
                                        <div key={field.key}>
                                            {index > 0 && <Separator />}
                                            <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                                <dt className="min-w-0 text-sm text-muted-foreground">
                                                    {field.label}
                                                </dt>
                                                <dd className="text-sm font-medium break-words sm:min-w-0 sm:text-right">
                                                    {field.type === 'phone' &&
                                                    booking[field.key] ? (
                                                        <span className="inline-flex items-center gap-1.5">
                                                            {String(
                                                                booking[
                                                                    field.key
                                                                ],
                                                            )}
                                                            <CopyButton
                                                                value={String(
                                                                    booking[
                                                                        field
                                                                            .key
                                                                    ],
                                                                )}
                                                            />
                                                        </span>
                                                    ) : (
                                                        formatValue(
                                                            booking[field.key],
                                                            field.type,
                                                        )
                                                    )}
                                                </dd>
                                            </div>
                                        </div>
                                    ))}
                                </dl>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {mapPoints.length > 0 && (
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="flex items-center gap-2 text-base">
                                <MapPinned className="size-4 text-[#E64A19]" />
                                Route Map
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {routeLoading && (
                                <p className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    Calculating the driving route...
                                </p>
                            )}
                            <MapPreview
                                points={mapPoints}
                                route={route?.coordinates}
                                height={360}
                            />
                            <p className="mt-2 text-xs text-muted-foreground">
                                <span className="font-bold text-[#004B87]">
                                    Blue
                                </span>{' '}
                                pickup
                                {' · '}
                                <span className="font-bold text-[#E64A19]">
                                    orange
                                </span>{' '}
                                dropoff
                                {' · '}
                                <span className="font-bold text-[#004B87]">
                                    blue line
                                </span>{' '}
                                driving route
                                {route &&
                                    ` · ${route.distanceMiles.toFixed(1)} miles`}
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>

            <Dialog
                open={cancelOpen}
                onOpenChange={(open) => {
                    if (!open && !cancelForm.processing) {
                        setCancelOpen(false);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancel booking and refund?</DialogTitle>
                        <DialogDescription>
                            You are about to cancel{' '}
                            <span className="font-medium text-foreground">
                                {booking.booking_number}
                            </span>
                            . The paid booking fee of{' '}
                            <span className="font-medium text-foreground">
                                ${booking_fee}
                            </span>{' '}
                            will be refunded to the customer. This cannot be
                            undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setCancelOpen(false)}
                            disabled={cancelForm.processing}
                        >
                            Keep booking
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={confirmCancellation}
                            disabled={cancelForm.processing}
                        >
                            {cancelForm.processing
                                ? 'Cancelling…'
                                : 'Cancel booking & refund'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

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
                            You are about to change{' '}
                            <span className="font-medium text-foreground">
                                {booking.booking_number}
                            </span>{' '}
                            from{' '}
                            <span className="font-medium text-foreground">
                                {statusLabel(String(booking.status))}
                            </span>{' '}
                            to{' '}
                            <span className="font-medium text-foreground">
                                {statusLabel(statusTarget ?? '')}
                            </span>
                            . This will be visible to the dispatch team.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setStatusTarget(null)}
                            disabled={statusForm.processing}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmStatusChange}
                            disabled={statusForm.processing}
                        >
                            {statusForm.processing
                                ? 'Updating…'
                                : 'Confirm change'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {editSection && (
                <SectionEditDialog
                    section={editSection}
                    booking={booking}
                    onClose={() => setEditSection(null)}
                />
            )}
        </>
    );
}

BookingDetail.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Bookings',
            href: dashboardBookings(),
        },
        {
            title: 'Booking Detail',
            href: dashboardBookings(),
        },
    ],
};
