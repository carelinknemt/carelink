import { Head, useForm } from '@inertiajs/react';
import { Download, Pencil } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
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
import { dashboard } from '@/routes';
import { bookings as dashboardBookings } from '@/routes/dashboard';
import {
    showExport as showBookingExport,
    update as updateBooking,
    updateStatus as updateBookingStatus,
} from '@/routes/dashboard/bookings';

type BookingDetail = Record<string, string | number | boolean | null>;

type DetailField = {
    key: string;
    label: string;
    type?: 'bool' | 'date' | 'datetime' | 'money' | 'number' | 'phone' | 'textarea';
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
            { key: 'passenger_is_bariatric', label: 'Bariatric passenger', type: 'bool' },
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
            { key: 'pickup_contact_phone_number', label: 'Contact phone', type: 'phone' },
            { key: 'pickup_stairs', label: 'Stairs', type: 'bool' },
            { key: 'pickup_stair_equipment', label: 'Stair equipment' },
            { key: 'pickup_driver_notes', label: 'Driver notes', type: 'textarea' },
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
            { key: 'dropoff_contact_phone_number', label: 'Contact phone', type: 'phone' },
            { key: 'dropoff_stairs', label: 'Stairs', type: 'number' },
            { key: 'dropoff_stair_equipment', label: 'Stair equipment' },
            { key: 'dropoff_driver_notes', label: 'Driver notes', type: 'textarea' },
            { key: 'dropoff_latitude', label: 'Latitude', type: 'number' },
            { key: 'dropoff_longitude', label: 'Longitude', type: 'number' },
        ],
    },
    {
        title: 'Medical & Accessibility',
        editable: true,
        fields: [
            { key: 'oxygen_required', label: 'Oxygen required', type: 'bool' },
            { key: 'oxygen_liters_per_min', label: 'Oxygen (L/min)', type: 'number' },
            { key: 'attendants_needed', label: 'Attendants needed', type: 'number' },
            { key: 'additional_passengers', label: 'Additional passengers', type: 'number' },
            { key: 'must_provide_wheelchair', label: 'Must provide wheelchair', type: 'bool' },
            { key: 'has_infectious_disease', label: 'Infectious disease', type: 'bool' },
            { key: 'requested_by_name', label: 'Requested by' },
            { key: 'requested_by_phone_number', label: 'Requested by phone', type: 'phone' },
            { key: 'dispatcher_notes', label: 'Dispatcher notes', type: 'textarea' },
        ],
    },
    {
        title: 'Payment & Dispatch',
        fields: [
            { key: 'booking_number', label: 'Booking number' },
            { key: 'payment_status', label: 'Payment status' },
            { key: 'paid_at', label: 'Paid at', type: 'datetime' },
            { key: 'stripe_checkout_session_id', label: 'Stripe session' },
            { key: 'trip_request_csv_path', label: 'CSV file' },
            { key: 'created_at', label: 'Booked at', type: 'datetime' },
        ],
    },
];

function formatDate(date: string): string {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(date));
}

function formatDateTime(date: string): string {
    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(date));
}

function formatValue(value: string | number | boolean | null, type?: string): string {
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

function toFormValue(value: string | number | boolean | null, type?: string): string | boolean {
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
        section.fields.map((field) => [field.key, toFormValue(booking[field.key], field.type)]),
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
                    <DialogTitle>Edit {section.title.toLowerCase()}</DialogTitle>
                    <DialogDescription>
                        Update the {section.title.toLowerCase()} details for {booking.booking_number}.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
                    {section.fields.map((field) => {
                        const error = form.errors[field.key];
                        const spanAll = field.type === 'textarea' || field.type === 'bool';

                        return (
                            <div
                                key={field.key}
                                className={spanAll ? 'sm:col-span-2' : undefined}
                            >
                                {field.type === 'bool' ? (
                                    <label className="flex items-center gap-2 text-sm font-medium">
                                        <Checkbox
                                            checked={Boolean(form.data[field.key])}
                                            onCheckedChange={(checked) =>
                                                form.setData(field.key, Boolean(checked))
                                            }
                                        />
                                        {field.label}
                                    </label>
                                ) : (
                                    <div className="grid gap-2">
                                        <Label htmlFor={`edit-${field.key}`}>{field.label}</Label>
                                        {field.type === 'textarea' ? (
                                            <Textarea
                                                id={`edit-${field.key}`}
                                                value={String(form.data[field.key] ?? '')}
                                                onChange={(event) =>
                                                    form.setData(field.key, event.target.value)
                                                }
                                            />
                                        ) : field.type === 'phone' ? (
                                            <PhoneInput
                                                id={`edit-${field.key}`}
                                                value={String(form.data[field.key] ?? '')}
                                                onChange={(value) =>
                                                    form.setData(field.key, value)
                                                }
                                            />
                                        ) : (
                                            <Input
                                                id={`edit-${field.key}`}
                                                type={
                                                    field.type === 'date'
                                                        ? 'date'
                                                        : field.type === 'number' ||
                                                            field.type === 'money'
                                                          ? 'number'
                                                          : 'text'
                                                }
                                                step={
                                                    field.type === 'money' ? '0.01' : undefined
                                                }
                                                value={String(form.data[field.key] ?? '')}
                                                onChange={(event) =>
                                                    form.setData(field.key, event.target.value)
                                                }
                                            />
                                        )}
                                    </div>
                                )}
                                {error && <p className="text-destructive mt-1 text-xs">{error}</p>}
                                {field.type === 'phone' &&
                                    !error &&
                                    String(form.data[field.key] ?? '').trim() !== '' &&
                                    !isUsPhoneNumber(String(form.data[field.key])) && (
                                        <p className="text-destructive mt-1 text-xs">
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
}: {
    booking: BookingDetail;
    statuses: string[];
}) {
    const [statusTarget, setStatusTarget] = useState<string | null>(null);
    const [editSection, setEditSection] = useState<DetailSection | null>(null);

    const statusForm = useForm({ status: '' });

    function confirmStatusChange() {
        if (!statusTarget) {
            return;
        }

        statusForm.setData('status', statusTarget);
        statusForm.patch(updateBookingStatus.url({ booking: Number(booking.id) }), {
            preserveScroll: true,
            onSuccess: () => setStatusTarget(null),
        });
    }

    return (
        <>
            <Head title={`Booking ${booking.booking_number}`}>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                {booking.booking_number}
                            </h1>
                            <Select
                                value={String(booking.status)}
                                onValueChange={setStatusTarget}
                            >
                                <SelectTrigger
                                    size="sm"
                                    className="w-44"
                                    style={{ borderColor: 'transparent' }}
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {statuses.map((status) => (
                                        <SelectItem key={status} value={status}>
                                            {status.replaceAll('_', ' ')}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                {booking.payment_status} · $30 fee paid
                            </Badge>
                        </div>
                        <Button variant="outline" size="sm" asChild>
                            <a href={showBookingExport.url({ booking: Number(booking.id) })}>
                                <Download />
                                Export CSV
                            </a>
                        </Button>
                    </div>
                    <p className="text-muted-foreground text-sm">
                        {String(booking.passenger_first_name)} {String(booking.passenger_last_name)} · booked{' '}
                        {formatDateTime(String(booking.created_at))}
                    </p>
                </div>

                <div className="grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {detailSections.map((section) => (
                        <Card key={section.title}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-base">{section.title}</CardTitle>
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
                                                <dt className="text-muted-foreground min-w-0 text-sm">
                                                    {field.label}
                                                </dt>
                                                <dd className="text-sm font-medium break-words sm:min-w-0 sm:text-right">
                                                    {formatValue(booking[field.key], field.type)}
                                                </dd>
                                            </div>
                                        </div>
                                    ))}
                                </dl>
                            </CardContent>
                        </Card>
                    ))}
                </div>
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
                            You are about to change{' '}
                            <span className="text-foreground font-medium">
                                {booking.booking_number}
                            </span>{' '}
                            from{' '}
                            <span className="text-foreground font-medium">
                                {String(booking.status).replaceAll('_', ' ')}
                            </span>{' '}
                            to{' '}
                            <span className="text-foreground font-medium">
                                {statusTarget?.replaceAll('_', ' ')}
                            </span>
                            . This will be visible to the dispatch team.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setStatusTarget(null)} disabled={statusForm.processing}>
                            Cancel
                        </Button>
                        <Button
                            onClick={confirmStatusChange}
                            disabled={statusForm.processing}
                        >
                            {statusForm.processing ? 'Updating…' : 'Confirm change'}
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
