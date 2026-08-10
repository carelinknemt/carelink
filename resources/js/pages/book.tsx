import { useForm, usePage } from '@inertiajs/react';
import { ArrowLeft, ArrowRight, CheckCircle2, Phone, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppHead from '@/components/app-head';
import InputError from '@/components/input-error';
import DatePicker, { formatIsoDate } from '@/components/carelink/date-picker';
import LocationPicker from '@/components/carelink/location-picker';
import MapPreview, { type MapPoint } from '@/components/carelink/map-preview';
import TimePicker from '@/components/carelink/time-picker';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { book } from '@/routes';
import { store } from '@/routes/bookings';
import { COMPANY_INFO } from '@/data/carelink';

interface TripRequestFormData {
    passenger_first_name: string;
    passenger_last_name: string;
    passenger_phone_number: string;
    passenger_email: string;
    passenger_dob: string;
    passenger_is_bariatric: boolean;
    passenger_notes: string;
    oxygen_required: boolean;
    oxygen_liters_per_min: string;
    must_provide_wheelchair: boolean;
    has_infectious_disease: boolean;
    trip_date: string;
    pickup_time: string;
    appointment_time: string;
    pickup_address: string;
    pickup_address_details: string;
    pickup_latitude: string;
    pickup_longitude: string;
    pickup_stairs: boolean;
    dropoff_address: string;
    dropoff_address_details: string;
    dropoff_latitude: string;
    dropoff_longitude: string;
    dropoff_stairs: boolean;
    payer: string;
    transport_type: string;
    service_type: string;
    will_call: string;
    input_price: string;
}

type Errors = Record<string, string>;

const STEPS = [
    { id: 0, label: 'Passenger', title: 'Passenger Information' },
    { id: 1, label: 'Trip', title: 'Trip Details' },
    { id: 2, label: 'Service', title: 'Service & Payment' },
    { id: 3, label: 'Review', title: 'Review & Submit' },
] as const;

const STEP_REQUIRED: Record<number, (keyof TripRequestFormData)[]> = {
    0: ['passenger_first_name', 'passenger_last_name'],
    1: ['trip_date', 'pickup_time', 'pickup_address', 'dropoff_address'],
    2: ['payer', 'transport_type', 'service_type', 'will_call', 'input_price'],
    3: [],
};

const STEP_FIELDS: Record<number, (keyof TripRequestFormData)[]> = {
    0: [
        'passenger_first_name',
        'passenger_last_name',
        'passenger_phone_number',
        'passenger_email',
        'passenger_dob',
        'passenger_is_bariatric',
        'passenger_notes',
        'oxygen_required',
        'oxygen_liters_per_min',
        'must_provide_wheelchair',
        'has_infectious_disease',
    ],
    1: [
        'trip_date',
        'pickup_time',
        'appointment_time',
        'pickup_address',
        'pickup_address_details',
        'pickup_latitude',
        'pickup_longitude',
        'pickup_stairs',
        'dropoff_address',
        'dropoff_address_details',
        'dropoff_latitude',
        'dropoff_longitude',
        'dropoff_stairs',
    ],
    2: ['payer', 'transport_type', 'service_type', 'will_call', 'input_price'],
    3: [],
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELD_BG =
    'bg-white dark:bg-white dark:text-slate-900 dark:border-slate-300 dark:placeholder:text-slate-400';

const TODAY = (() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    return date;
})();

const PAYER_OPTIONS = [
    'Insurance / Medicaid',
    'Private Pay',
    'Facility Billing',
    "Worker's Compensation",
];

const TRANSPORT_TYPE_OPTIONS = [
    'Wheelchair Van',
    'Ambulatory Sedan',
    'Transit Shuttle',
    'Gurney Van',
];

const SERVICE_TYPE_OPTIONS = [
    'Wheelchair Transport',
    'Ambulatory Sedan',
    'Group Transit Shuttle',
    'Hospital Discharge',
    'Community Ride',
    'Long-Distance Trip',
];

const WILL_CALL_OPTIONS = ['YES', 'NO'];

const BOOK_DESCRIPTION =
    'Book your Carelink Medical Transportation ride online. Request a wheelchair van, ambulatory sedan, or transit shuttle trip across Humboldt, Del Norte, Trinity, and Shasta counties.';

const initialForm: TripRequestFormData = {
    passenger_first_name: '',
    passenger_last_name: '',
    passenger_phone_number: '',
    passenger_email: '',
    passenger_dob: '',
    passenger_is_bariatric: false,
    passenger_notes: '',
    oxygen_required: false,
    oxygen_liters_per_min: '',
    must_provide_wheelchair: false,
    has_infectious_disease: false,
    trip_date: '',
    pickup_time: '',
    appointment_time: '',
    pickup_address: '',
    pickup_address_details: '',
    pickup_latitude: '',
    pickup_longitude: '',
    pickup_stairs: false,
    dropoff_address: '',
    dropoff_address_details: '',
    dropoff_latitude: '',
    dropoff_longitude: '',
    dropoff_stairs: false,
    payer: '',
    transport_type: '',
    service_type: '',
    will_call: '',
    input_price: '',
};

export default function Book() {
    const [step, setStep] = useState(0);
    const [stepErrors, setStepErrors] = useState<Errors>({});
    const booking = usePage<{ booking?: Record<string, unknown> }>().props
        .booking;
    const form = useForm<TripRequestFormData>(initialForm);

    useEffect(() => {
        if (Object.keys(form.errors).length === 0) {
            return;
        }

        const firstErroredStep = STEPS.find((s) =>
            Object.keys(form.errors).some((field) =>
                STEP_FIELDS[s.id].includes(field as keyof TripRequestFormData),
            ),
        );

        if (firstErroredStep) {
            setStep(firstErroredStep.id);
        }
    }, [form.errors]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [step]);

    const fieldError = (field: keyof TripRequestFormData): string | undefined =>
        stepErrors[field] ?? form.errors[field];

    const inputClass = (field: keyof TripRequestFormData): string =>
        `${FIELD_BG} ${fieldError(field) ? 'border-red-500/80 focus-visible:border-red-500' : ''}`;

    const set = (key: keyof TripRequestFormData, value: string | boolean) => {
        form.setData(key as never, value as never);
        setStepErrors((prev) => {
            const next = { ...prev };
            delete next[key];

            return next;
        });
    };

    const handlePickupTextChange = (address: string) => {
        set('pickup_address', address);
        set('pickup_latitude', '');
        set('pickup_longitude', '');
    };

    const handlePickupSelect = (
        address: string,
        latitude: number,
        longitude: number,
    ) => {
        set('pickup_address', address);
        set('pickup_latitude', String(latitude));
        set('pickup_longitude', String(longitude));
    };

    const handleDropoffTextChange = (address: string) => {
        set('dropoff_address', address);
        set('dropoff_latitude', '');
        set('dropoff_longitude', '');
    };

    const handleDropoffSelect = (
        address: string,
        latitude: number,
        longitude: number,
    ) => {
        set('dropoff_address', address);
        set('dropoff_latitude', String(latitude));
        set('dropoff_longitude', String(longitude));
    };

    const mapPoints: MapPoint[] = [];

    if (form.data.pickup_latitude && form.data.pickup_longitude) {
        mapPoints.push({
            label: form.data.pickup_address || 'Pickup location',
            latitude: Number(form.data.pickup_latitude),
            longitude: Number(form.data.pickup_longitude),
            kind: 'pickup',
        });
    }

    if (form.data.dropoff_latitude && form.data.dropoff_longitude) {
        mapPoints.push({
            label: form.data.dropoff_address || 'Dropoff location',
            latitude: Number(form.data.dropoff_latitude),
            longitude: Number(form.data.dropoff_longitude),
            kind: 'dropoff',
        });
    }

    const validateStep = (stepId: number): boolean => {
        const errors: Errors = {};

        for (const field of STEP_REQUIRED[stepId]) {
            if (!String(form.data[field]).trim()) {
                errors[field] = 'This field is required.';
            }
        }

        if (stepId === 0 && form.data.passenger_email.trim() !== '') {
            if (!EMAIL_REGEX.test(form.data.passenger_email.trim())) {
                errors.passenger_email = 'Please enter a valid email address.';
            }
        }

        if (stepId === 2) {
            const price = Number(form.data.input_price);

            if (
                form.data.input_price.trim() === '' ||
                Number.isNaN(price) ||
                price < 0
            ) {
                errors.input_price = 'Please enter a valid trip price.';
            }
        }

        setStepErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(step)) {
            setStep((prev) => Math.min(prev + 1, STEPS.length - 1));
        }
    };

    const handleBack = () => {
        setStepErrors({});
        setStep((prev) => Math.max(prev - 1, 0));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (form.processing) {
            return;
        }

        if (step < STEPS.length - 1) {
            handleNext();

            return;
        }

        for (const s of STEPS) {
            if (!validateStep(s.id)) {
                setStep(s.id);

                return;
            }
        }

        form.post(store.url(), {
            onSuccess: () => {
                setStep(0);
                setStepErrors({});
                form.reset();
            },
        });
    };

    if (form.wasSuccessful && booking) {
        return (
            <div className="bg-slate-50 px-4 py-16 sm:px-6 lg:px-12">
                <div className="mx-auto max-w-2xl text-center">
                    <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-600" />
                    <h1 className="mt-4 text-2xl font-black text-slate-900 sm:text-3xl">
                        Trip Request Submitted
                    </h1>
                    <p className="mt-3 text-sm text-slate-600 sm:text-base">
                        Your booking{' '}
                        <span className="font-black text-[#004B87]">
                            {String(booking.booking_number)}
                        </span>{' '}
                        has been received. Our dispatch team will confirm your
                        ride shortly.
                    </p>
                    <dl className="mx-auto mt-8 max-w-xl divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white/60 px-6 py-2 text-left text-sm">
                        <div className="flex items-center justify-between py-3">
                            <dt className="text-slate-500">Passenger</dt>
                            <dd className="font-semibold text-slate-800">
                                {String(booking.passenger_name)}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <dt className="text-slate-500">Date</dt>
                            <dd className="font-semibold text-slate-800">
                                {String(booking.trip_date)}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between gap-6 py-3">
                            <dt className="shrink-0 text-slate-500">Pickup</dt>
                            <dd className="text-right font-semibold text-slate-800">
                                {String(booking.pickup_address)}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between gap-6 py-3">
                            <dt className="shrink-0 text-slate-500">Dropoff</dt>
                            <dd className="text-right font-semibold text-slate-800">
                                {String(booking.dropoff_address)}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <dt className="text-slate-500">Price</dt>
                            <dd className="font-semibold text-slate-800">
                                ${String(booking.input_price)}
                            </dd>
                        </div>
                    </dl>
                    <a
                        href={book.url()}
                        className="mt-8 inline-flex h-10 items-center justify-center rounded-md bg-[#004B87] px-6 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#003d75]"
                    >
                        Book Another Ride
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50">
            <AppHead
                title="Book a Ride — Online Trip Request"
                description={BOOK_DESCRIPTION}
                keywords={[
                    'book NEMT ride online',
                    'CareLink trip request',
                    'schedule medical transportation',
                    'wheelchair van booking',
                    'dialysis ride booking',
                    'CareLink Medical Transportation Eureka CA',
                ]}
                canonical="/book"
                type="website"
            />

            {/* Page Header */}
            <div className="bg-[#004B87] px-4 py-8 text-center sm:px-6 lg:px-12">
                <h1 className="text-2xl font-black text-white sm:text-3xl">
                    Book Your Ride Online
                </h1>
                <p className="mx-auto mt-2 max-w-2xl text-sm text-cyan-100">
                    Complete the trip request form below and our dispatch team
                    will confirm your ride.
                </p>
                <a
                    href={`tel:${COMPANY_INFO.dispatchPhone.replace(/[^0-9+]/g, '')}`}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20"
                >
                    <Phone className="h-3.5 w-3.5 text-orange-300" />
                    Prefer to call? {COMPANY_INFO.dispatchPhone}
                </a>
            </div>

            <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-12">
                {/* Current Phase */}
                <div className="mb-8">
                    <p className="text-xs font-black tracking-widest text-[#E64A19] uppercase">
                        Step {step + 1} of {STEPS.length} — {STEPS[step].label}
                    </p>
                    <h2 className="mt-1 text-2xl font-black text-slate-900 sm:text-3xl">
                        {STEPS[step].title}
                    </h2>
                    <div className="mt-4 h-1.5 w-full rounded-full bg-slate-200">
                        <div
                            className="h-full rounded-full bg-[#E64A19] transition-all duration-300"
                            style={{
                                width: `${(step / (STEPS.length - 1)) * 100}%`,
                            }}
                        />
                    </div>
                </div>

                {Object.keys(form.errors).length > 0 && (
                    <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                        Please fix the highlighted fields below before
                        submitting.
                    </div>
                )}

                <form onSubmit={handleSubmit} noValidate className="space-y-10">
                    {step === 0 && (
                        <>
                            <div className="space-y-6">
                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="passenger_first_name">
                                            First Name{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="passenger_first_name"
                                            autoFocus
                                            value={
                                                form.data.passenger_first_name
                                            }
                                            onChange={(e) =>
                                                set(
                                                    'passenger_first_name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Jane"
                                            aria-invalid={Boolean(
                                                fieldError(
                                                    'passenger_first_name',
                                                ),
                                            )}
                                            className={inputClass(
                                                'passenger_first_name',
                                            )}
                                        />
                                        <InputError
                                            message={fieldError(
                                                'passenger_first_name',
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="passenger_last_name">
                                            Last Name{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="passenger_last_name"
                                            value={
                                                form.data.passenger_last_name
                                            }
                                            onChange={(e) =>
                                                set(
                                                    'passenger_last_name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Doe"
                                            aria-invalid={Boolean(
                                                fieldError(
                                                    'passenger_last_name',
                                                ),
                                            )}
                                            className={inputClass(
                                                'passenger_last_name',
                                            )}
                                        />
                                        <InputError
                                            message={fieldError(
                                                'passenger_last_name',
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="passenger_phone_number">
                                            Phone Number
                                        </Label>
                                        <Input
                                            id="passenger_phone_number"
                                            type="tel"
                                            value={
                                                form.data.passenger_phone_number
                                            }
                                            onChange={(e) =>
                                                set(
                                                    'passenger_phone_number',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="(707) 555-0192"
                                            aria-invalid={Boolean(
                                                fieldError(
                                                    'passenger_phone_number',
                                                ),
                                            )}
                                            className={inputClass(
                                                'passenger_phone_number',
                                            )}
                                        />
                                        <InputError
                                            message={fieldError(
                                                'passenger_phone_number',
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="passenger_email">
                                            Email Address
                                        </Label>
                                        <Input
                                            id="passenger_email"
                                            type="email"
                                            value={form.data.passenger_email}
                                            onChange={(e) =>
                                                set(
                                                    'passenger_email',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="jane@example.com"
                                            aria-invalid={Boolean(
                                                fieldError('passenger_email'),
                                            )}
                                            className={inputClass(
                                                'passenger_email',
                                            )}
                                        />
                                        <InputError
                                            message={fieldError(
                                                'passenger_email',
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="passenger_dob">
                                            Date of Birth
                                        </Label>
                                        <DatePicker
                                            id="passenger_dob"
                                            value={form.data.passenger_dob}
                                            onChange={(value) =>
                                                set('passenger_dob', value)
                                            }
                                            placeholder="Select date of birth"
                                            captionLayout="dropdown"
                                            disabled={(date) => date > TODAY}
                                            error={Boolean(
                                                fieldError('passenger_dob'),
                                            )}
                                        />
                                        <InputError
                                            message={fieldError(
                                                'passenger_dob',
                                            )}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-3 rounded-xl border border-slate-200 bg-white/60 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
                                    <div className="flex items-center gap-2.5">
                                        <Checkbox
                                            id="must_provide_wheelchair"
                                            checked={
                                                form.data
                                                    .must_provide_wheelchair
                                            }
                                            onCheckedChange={(v) =>
                                                set(
                                                    'must_provide_wheelchair',
                                                    Boolean(v),
                                                )
                                            }
                                        />
                                        <Label htmlFor="must_provide_wheelchair">
                                            Uses a wheelchair
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <Checkbox
                                            id="passenger_is_bariatric"
                                            checked={
                                                form.data.passenger_is_bariatric
                                            }
                                            onCheckedChange={(v) =>
                                                set(
                                                    'passenger_is_bariatric',
                                                    Boolean(v),
                                                )
                                            }
                                        />
                                        <Label htmlFor="passenger_is_bariatric">
                                            Bariatric passenger
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <Checkbox
                                            id="oxygen_required"
                                            checked={form.data.oxygen_required}
                                            onCheckedChange={(v) =>
                                                set(
                                                    'oxygen_required',
                                                    Boolean(v),
                                                )
                                            }
                                        />
                                        <Label htmlFor="oxygen_required">
                                            Requires oxygen
                                        </Label>
                                    </div>
                                    <div className="flex items-center gap-2.5">
                                        <Checkbox
                                            id="has_infectious_disease"
                                            checked={
                                                form.data.has_infectious_disease
                                            }
                                            onCheckedChange={(v) =>
                                                set(
                                                    'has_infectious_disease',
                                                    Boolean(v),
                                                )
                                            }
                                        />
                                        <Label htmlFor="has_infectious_disease">
                                            Infectious disease precautions
                                        </Label>
                                    </div>
                                    {form.data.oxygen_required && (
                                        <div className="grid gap-2 sm:col-span-2 lg:col-span-4">
                                            <Label htmlFor="oxygen_liters_per_min">
                                                Oxygen flow (liters / min)
                                            </Label>
                                            <Input
                                                id="oxygen_liters_per_min"
                                                type="number"
                                                min={1}
                                                value={
                                                    form.data
                                                        .oxygen_liters_per_min
                                                }
                                                onChange={(e) =>
                                                    set(
                                                        'oxygen_liters_per_min',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="3"
                                                className={`max-w-[200px] ${FIELD_BG}`}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="passenger_notes">
                                        Passenger Notes
                                    </Label>
                                    <Textarea
                                        id="passenger_notes"
                                        rows={3}
                                        value={form.data.passenger_notes}
                                        onChange={(e) =>
                                            set(
                                                'passenger_notes',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Mobility aids, medications, or anything our driver should know..."
                                        className={FIELD_BG}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {step === 1 && (
                        <>
                            <div className="space-y-6">
                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    <div className="grid gap-2">
                                        <Label htmlFor="trip_date">
                                            Trip Date{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <DatePicker
                                            id="trip_date"
                                            value={form.data.trip_date}
                                            onChange={(value) =>
                                                set('trip_date', value)
                                            }
                                            placeholder="Select trip date"
                                            disabled={(date) => date < TODAY}
                                            error={Boolean(
                                                fieldError('trip_date'),
                                            )}
                                        />
                                        <InputError
                                            message={fieldError('trip_date')}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="pickup_time">
                                            Pickup Time{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <TimePicker
                                            id="pickup_time"
                                            value={form.data.pickup_time}
                                            onChange={(value) =>
                                                set('pickup_time', value)
                                            }
                                            placeholder="Select pickup time"
                                            error={Boolean(
                                                fieldError('pickup_time'),
                                            )}
                                        />
                                        <InputError
                                            message={fieldError('pickup_time')}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="appointment_time">
                                            Appointment Time
                                        </Label>
                                        <TimePicker
                                            id="appointment_time"
                                            value={form.data.appointment_time}
                                            onChange={(value) =>
                                                set('appointment_time', value)
                                            }
                                            placeholder="Select appointment time"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-5 lg:grid-cols-2">
                                    <div className="space-y-3 rounded-xl border border-slate-200 bg-white/60 p-5">
                                        <h3 className="text-sm font-black tracking-wide text-[#004B87] uppercase">
                                            Pickup Location
                                        </h3>
                                        <div className="grid gap-2">
                                            <Label htmlFor="pickup_address">
                                                Pickup Address{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <LocationPicker
                                                id="pickup_address"
                                                value={form.data.pickup_address}
                                                placeholder="Search and select, e.g. 1420 Harrison Ave, Eureka, CA"
                                                onValueChange={
                                                    handlePickupTextChange
                                                }
                                                onSelect={handlePickupSelect}
                                            />
                                            {form.data.pickup_latitude && (
                                                <p className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    Location verified on map
                                                </p>
                                            )}
                                            <InputError
                                                message={fieldError(
                                                    'pickup_address',
                                                )}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="pickup_address_details">
                                                Address Details (unit, gate,
                                                etc.)
                                            </Label>
                                            <Input
                                                id="pickup_address_details"
                                                value={
                                                    form.data
                                                        .pickup_address_details
                                                }
                                                onChange={(e) =>
                                                    set(
                                                        'pickup_address_details',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Gate code 1234, Apt 2B"
                                                className={FIELD_BG}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <Checkbox
                                                id="pickup_stairs"
                                                checked={
                                                    form.data.pickup_stairs
                                                }
                                                onCheckedChange={(v) =>
                                                    set(
                                                        'pickup_stairs',
                                                        Boolean(v),
                                                    )
                                                }
                                            />
                                            <Label htmlFor="pickup_stairs">
                                                Stairs at pickup
                                            </Label>
                                        </div>
                                    </div>

                                    <div className="space-y-3 rounded-xl border border-slate-200 bg-white/60 p-5">
                                        <h3 className="text-sm font-black tracking-wide text-[#004B87] uppercase">
                                            Dropoff Location
                                        </h3>
                                        <div className="grid gap-2">
                                            <Label htmlFor="dropoff_address">
                                                Dropoff Address{' '}
                                                <span className="text-red-500">
                                                    *
                                                </span>
                                            </Label>
                                            <LocationPicker
                                                id="dropoff_address"
                                                value={
                                                    form.data.dropoff_address
                                                }
                                                placeholder="Search and select, e.g. St. Joseph Hospital, Eureka, CA"
                                                onValueChange={
                                                    handleDropoffTextChange
                                                }
                                                onSelect={handleDropoffSelect}
                                            />
                                            {form.data.dropoff_latitude && (
                                                <p className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                                    Location verified on map
                                                </p>
                                            )}
                                            <InputError
                                                message={fieldError(
                                                    'dropoff_address',
                                                )}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="dropoff_address_details">
                                                Address Details (floor,
                                                entrance, etc.)
                                            </Label>
                                            <Input
                                                id="dropoff_address_details"
                                                value={
                                                    form.data
                                                        .dropoff_address_details
                                                }
                                                onChange={(e) =>
                                                    set(
                                                        'dropoff_address_details',
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Main entrance, 3rd floor"
                                                className={FIELD_BG}
                                            />
                                        </div>
                                        <div className="flex items-center gap-2.5">
                                            <Checkbox
                                                id="dropoff_stairs"
                                                checked={
                                                    form.data.dropoff_stairs
                                                }
                                                onCheckedChange={(v) =>
                                                    set(
                                                        'dropoff_stairs',
                                                        Boolean(v),
                                                    )
                                                }
                                            />
                                            <Label htmlFor="dropoff_stairs">
                                                Stairs at dropoff
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="space-y-6">
                                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                    <div className="grid gap-2">
                                        <Label>
                                            Payer{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={form.data.payer}
                                            onValueChange={(v) =>
                                                set('payer', v)
                                            }
                                        >
                                            <SelectTrigger
                                                className={`w-full ${inputClass('payer')}`}
                                                aria-invalid={Boolean(
                                                    fieldError('payer'),
                                                )}
                                            >
                                                <SelectValue placeholder="Select payer" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {PAYER_OPTIONS.map((option) => (
                                                    <SelectItem
                                                        key={option}
                                                        value={option}
                                                    >
                                                        {option}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={fieldError('payer')}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>
                                            Transport Type{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={form.data.transport_type}
                                            onValueChange={(v) =>
                                                set('transport_type', v)
                                            }
                                        >
                                            <SelectTrigger
                                                className={`w-full ${inputClass(
                                                    'transport_type',
                                                )}`}
                                                aria-invalid={Boolean(
                                                    fieldError(
                                                        'transport_type',
                                                    ),
                                                )}
                                            >
                                                <SelectValue placeholder="Select transport type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {TRANSPORT_TYPE_OPTIONS.map(
                                                    (option) => (
                                                        <SelectItem
                                                            key={option}
                                                            value={option}
                                                        >
                                                            {option}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={fieldError(
                                                'transport_type',
                                            )}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>
                                            Service Type{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={form.data.service_type}
                                            onValueChange={(v) =>
                                                set('service_type', v)
                                            }
                                        >
                                            <SelectTrigger
                                                className={`w-full ${inputClass(
                                                    'service_type',
                                                )}`}
                                                aria-invalid={Boolean(
                                                    fieldError('service_type'),
                                                )}
                                            >
                                                <SelectValue placeholder="Select service type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {SERVICE_TYPE_OPTIONS.map(
                                                    (option) => (
                                                        <SelectItem
                                                            key={option}
                                                            value={option}
                                                        >
                                                            {option}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={fieldError('service_type')}
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="will_call">
                                            Will Call?{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={form.data.will_call}
                                            onValueChange={(v) =>
                                                set('will_call', v)
                                            }
                                        >
                                            <SelectTrigger
                                                className={`w-full ${inputClass(
                                                    'will_call',
                                                )}`}
                                                aria-invalid={Boolean(
                                                    fieldError('will_call'),
                                                )}
                                            >
                                                <SelectValue placeholder="Select an option" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {WILL_CALL_OPTIONS.map(
                                                    (option) => (
                                                        <SelectItem
                                                            key={option}
                                                            value={option}
                                                        >
                                                            {option === 'YES'
                                                                ? 'Yes'
                                                                : 'No'}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <InputError
                                            message={fieldError('will_call')}
                                        />
                                        <p className="text-xs text-slate-400">
                                            A "will call" trip is dispatched on
                                            demand at pickup time rather than
                                            pre-scheduled.
                                        </p>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="input_price">
                                            Trip Price ($){' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            id="input_price"
                                            type="number"
                                            min={0}
                                            step="0.01"
                                            value={form.data.input_price}
                                            onChange={(e) =>
                                                set(
                                                    'input_price',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="85.00"
                                            aria-invalid={Boolean(
                                                fieldError('input_price'),
                                            )}
                                            className={inputClass(
                                                'input_price',
                                            )}
                                        />
                                        <InputError
                                            message={fieldError('input_price')}
                                        />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {step === 3 && (
                        <>
                            <div className="rounded-xl border border-slate-200 bg-white/60 p-5 sm:p-6">
                                <h3 className="mb-4 text-sm font-black tracking-wide text-[#004B87] uppercase">
                                    Review Your Booking
                                </h3>
                                <dl className="grid grid-cols-1 gap-x-8 gap-y-4 text-sm sm:grid-cols-2">
                                    <div>
                                        <dt className="text-xs font-bold text-slate-400 uppercase">
                                            Passenger
                                        </dt>
                                        <dd className="font-semibold text-slate-800">
                                            {form.data.passenger_first_name}{' '}
                                            {form.data.passenger_last_name}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-bold text-slate-400 uppercase">
                                            Date & Time
                                        </dt>
                                        <dd className="font-semibold text-slate-800">
                                            {formatIsoDate(form.data.trip_date)}{' '}
                                            at {form.data.pickup_time || '—'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-bold text-slate-400 uppercase">
                                            Pickup
                                        </dt>
                                        <dd className="font-semibold text-slate-800">
                                            {form.data.pickup_address || '—'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-bold text-slate-400 uppercase">
                                            Dropoff
                                        </dt>
                                        <dd className="font-semibold text-slate-800">
                                            {form.data.dropoff_address || '—'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-bold text-slate-400 uppercase">
                                            Service
                                        </dt>
                                        <dd className="font-semibold text-slate-800">
                                            {form.data.service_type || '—'} (
                                            {form.data.transport_type || '—'})
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-bold text-slate-400 uppercase">
                                            Payer & Price
                                        </dt>
                                        <dd className="font-semibold text-slate-800">
                                            {form.data.payer || '—'} — $
                                            {form.data.input_price || '—'}
                                        </dd>
                                    </div>
                                </dl>
                                {mapPoints.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="mb-2 text-xs font-black tracking-wide text-[#004B87] uppercase">
                                            Route Preview
                                        </h4>
                                        <MapPreview points={mapPoints} />
                                        <p className="mt-2 text-xs text-slate-400">
                                            <span className="font-bold text-[#004B87]">
                                                Blue
                                            </span>{' '}
                                            pickup ·{' '}
                                            <span className="font-bold text-[#E64A19]">
                                                orange
                                            </span>{' '}
                                            dropoff
                                        </p>
                                    </div>
                                )}
                            </div>
                        </>
                    )}

                    {/* Footer Navigation */}
                    <div className="flex items-center justify-between border-t border-slate-200 pt-6">
                        <Button
                            type="button"
                            variant="outline"
                            className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-300 dark:bg-white dark:text-slate-700 dark:hover:bg-slate-100"
                            onClick={handleBack}
                            disabled={step === 0}
                        >
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                        </Button>
                        {step < STEPS.length - 1 ? (
                            <Button type="button" onClick={handleNext}>
                                Next
                                <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                className="bg-[#E64A19] text-white hover:bg-[#d84315]"
                                disabled={form.processing}
                            >
                                <Send className="mr-2 h-4 w-4" />
                                {form.processing
                                    ? 'Submitting...'
                                    : 'Submit Trip Request'}
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
