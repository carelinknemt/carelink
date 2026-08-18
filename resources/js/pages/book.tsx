import type { PageProps } from '@inertiajs/core';
import { Link, router, useForm, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    ArrowRight,
    CheckCircle2,
    Loader2,
    Send,
} from 'lucide-react';
import { useEffect, useCallback, useState } from 'react';
import AppHead from '@/components/app-head';
import DatePicker, { formatIsoDate } from '@/components/carelink/date-picker';
import LocationPicker from '@/components/carelink/location-picker';
import MapPreview from '@/components/carelink/map-preview';
import type { MapPoint } from '@/components/carelink/map-preview';
import PageHero from '@/components/carelink/page-hero';
import PhoneInput, { isUsPhoneNumber } from '@/components/carelink/phone-input';
import TimePicker from '@/components/carelink/time-picker';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
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
import { Textarea } from '@/components/ui/textarea';
import { usePageHero } from '@/lib/cms';
import { book, terms } from '@/routes';
import { show, status, store } from '@/routes/bookings';

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
    dropoff_stairs: number;
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
    0: [
        'passenger_first_name',
        'passenger_last_name',
        'passenger_phone_number',
        'passenger_email',
    ],
    1: ['trip_date', 'pickup_time', 'pickup_address', 'dropoff_address'],
    2: ['transport_type', 'service_type', 'will_call'],
    3: [],
};

const STEP_FIELDS: Record<number, (keyof TripRequestFormData)[]> = {
    0: [
        'passenger_first_name',
        'passenger_last_name',
        'passenger_phone_number',
        'passenger_email',
        'passenger_dob',
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
    2: ['transport_type', 'service_type', 'will_call'],
    3: [],
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const FIELD_BG =
    'bg-white dark:bg-white dark:text-slate-900 dark:border-slate-300 dark:placeholder:text-slate-400/60';

const TODAY = (() => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);

    return date;
})();

const PRIVATE_PAY = 'Private Pay';

const TRANSPORT_TYPE_OPTIONS = [
    'ambulatory',
    'wheelchair',
    'wheelchair xl',
    'broda chair',
    'geri chair',
];

const SERVICE_TYPE_OPTIONS = [
    'curb-to-curb',
    'door-to-door',
    'door-through-door',
    'person-to-person',
];

const WILL_CALL_OPTIONS = ['YES', 'NO'];

const EARTH_RADIUS_MILES = 3958.8;

const toRadians = (degrees: number): number => (degrees * Math.PI) / 180;

const haversineMiles = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
): number => {
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);

    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) ** 2;

    return EARTH_RADIUS_MILES * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

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
    dropoff_stairs: 0,
    payer: PRIVATE_PAY,
    transport_type: '',
    service_type: '',
    will_call: '',
    input_price: '',
};

interface ServiceRates {
    base_rate: number;
    mileage_rate: number;
}

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

interface BookingFeeProp {
    amount_cents: number;
    amount_dollars: string;
    label: string;
    dollars: string;
}

interface BookPageProps extends PageProps {
    booking?: Record<string, unknown>;
    checkout?: { url: string; booking_number: string };
    services?: Record<string, ServiceRates>;
    booking_fee?: {
        standard?: BookingFeeProp;
        ambulatory?: BookingFeeProp;
    };
}

const MILES_PER_METER = 0.000621371;

const OSRM_ENDPOINT = 'https://router.project-osrm.org/route/v1/driving';

const PENDING_PAYMENT_KEY = 'carelink_pending_payment';

interface PendingPayment {
    booking_number: string;
    url: string;
}

export default function Book() {
    const [step, setStep] = useState(0);
    const [stepErrors, setStepErrors] = useState<Errors>({});
    const [reviewReady, setReviewReady] = useState(false);
    const [route, setRoute] = useState<RouteInfo | null>(null);
    const [routeLoading, setRouteLoading] = useState(false);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [agreedToFee, setAgreedToFee] = useState(false);
    const { booking, booking_fee } = usePage<BookPageProps>().props;
    const pageHero = usePageHero('book');
    const form = useForm<TripRequestFormData>(initialForm);
    const bookingFee =
        form.data.transport_type === 'ambulatory'
            ? booking_fee?.ambulatory
            : booking_fee?.standard;
    const bookingFeeDollars = bookingFee?.dollars ?? '$30.00';
    const [pendingPayment, setPendingPayment] = useState<PendingPayment | null>(
        () => {
            try {
                const raw = window.sessionStorage.getItem(PENDING_PAYMENT_KEY);

                return raw ? (JSON.parse(raw) as PendingPayment) : null;
            } catch {
                return null;
            }
        },
    );

    useEffect(() => {
        if (step === STEPS.length - 1) {
            const timer = window.setTimeout(() => setReviewReady(true), 800);

            return () => window.clearTimeout(timer);
        }

        setReviewReady(false);

        return undefined;
    }, [step]);

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

    useEffect(() => {
        const pickupLatitude = form.data.pickup_latitude;
        const pickupLongitude = form.data.pickup_longitude;
        const dropoffLatitude = form.data.dropoff_latitude;
        const dropoffLongitude = form.data.dropoff_longitude;

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

        setRouteLoading(true);

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
                setRouteLoading(false);
            })
            .catch((error: unknown) => {
                if (cancelled || (error as Error).name === 'AbortError') {
                    return;
                }

                setRoute(null);
                setRouteLoading(false);
            });

        return () => {
            cancelled = true;
            controller.abort();
        };
    }, [
        form.data.pickup_latitude,
        form.data.pickup_longitude,
        form.data.dropoff_latitude,
        form.data.dropoff_longitude,
    ]);

    const checkPaymentStatus = useCallback(async () => {
        if (!pendingPayment) {
            return;
        }

        try {
            const response = await fetch(
                status.url({ booking: pendingPayment.booking_number }),
            );

            if (!response.ok) {
                return;
            }

            const data = (await response.json()) as { payment_status: string };

            if (data.payment_status === 'PAID') {
                window.sessionStorage.removeItem(PENDING_PAYMENT_KEY);
                setPendingPayment(null);
                router.visit(
                    show.url({ booking: pendingPayment.booking_number }),
                );
            }
        } catch {
            // The request failed, keep polling on the next tick.
        }
    }, [pendingPayment]);

    useEffect(() => {
        if (!pendingPayment) {
            return undefined;
        }

        const interval = window.setInterval(
            () => void checkPaymentStatus(),
            3000,
        );

        return () => window.clearInterval(interval);
    }, [pendingPayment, checkPaymentStatus]);

    const clearPendingPayment = () => {
        window.sessionStorage.removeItem(PENDING_PAYMENT_KEY);
        setPendingPayment(null);
    };

    const fieldError = (field: keyof TripRequestFormData): string | undefined =>
        stepErrors[field] ?? form.errors[field];

    const inputClass = (field: keyof TripRequestFormData): string =>
        `${FIELD_BG} ${fieldError(field) ? 'border-red-500/80 focus-visible:border-red-500' : ''}`;

    const set = (
        key: keyof TripRequestFormData,
        value: string | boolean | number,
    ) => {
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

    const hasRouteCoordinates =
        form.data.pickup_latitude &&
        form.data.pickup_longitude &&
        form.data.dropoff_latitude &&
        form.data.dropoff_longitude;

    const straightLineMiles: number | null = hasRouteCoordinates
        ? haversineMiles(
              Number(form.data.pickup_latitude),
              Number(form.data.pickup_longitude),
              Number(form.data.dropoff_latitude),
              Number(form.data.dropoff_longitude),
          )
        : null;

    const distanceMiles: number | null =
        hasRouteCoordinates && route ? route.distanceMiles : straightLineMiles;

    const routeLoadingShown = hasRouteCoordinates && routeLoading;

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

        if (
            stepId === 0 &&
            form.data.passenger_phone_number.trim() !== '' &&
            !isUsPhoneNumber(form.data.passenger_phone_number)
        ) {
            errors.passenger_phone_number =
                'Please enter a valid US phone number.';
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

    const submitForm = () => {
        if (form.processing) {
            return;
        }

        if (step < STEPS.length - 1) {
            return;
        }

        if (!reviewReady) {
            return;
        }

        for (const s of STEPS) {
            if (!validateStep(s.id)) {
                setStep(s.id);

                return;
            }
        }

        form.post(store.url(), {
            onSuccess: (page) => {
                const pageProps = page.props as BookPageProps;

                if (pageProps.checkout) {
                    window.open(pageProps.checkout.url, '_blank', 'noopener');

                    const pending: PendingPayment = {
                        booking_number: pageProps.checkout.booking_number,
                        url: pageProps.checkout.url,
                    };

                    window.sessionStorage.setItem(
                        PENDING_PAYMENT_KEY,
                        JSON.stringify(pending),
                    );
                    setPendingPayment(pending);

                    return;
                }

                setStep(0);
                setStepErrors({});
                form.reset();
            },
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (step < STEPS.length - 1) {
            handleNext();

            return;
        }

        if (!reviewReady) {
            return;
        }

        setAgreedToFee(false);
        setConfirmOpen(true);
    };

    const handleConfirmSubmit = () => {
        if (!agreedToFee) {
            return;
        }

        setConfirmOpen(false);
        submitForm();
    };

    if (pendingPayment) {
        return (
            <div className="bg-slate-50 px-4 py-10 sm:px-6 lg:px-12">
                <div className="mx-auto w-full max-w-7xl">
                    <div className="mx-auto max-w-2xl text-center">
                        <Loader2 className="mx-auto h-16 w-16 animate-spin text-[#004B87]" />
                        <h1 className="mt-4 text-2xl font-black text-slate-900 sm:text-3xl">
                            Complete Your Payment
                        </h1>
                        <p className="mt-3 text-sm text-slate-600 sm:text-base">
                            We opened the secure payment page in a new tab.
                            Finish the{' '}
                            <span className="font-bold text-slate-800">
                                {bookingFeeDollars}
                            </span>{' '}
                            booking fee there. This page updates automatically
                            once the payment is received.
                        </p>
                        <div className="mx-auto mt-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
                            Waiting for payment for{' '}
                            <span className="font-black">
                                {pendingPayment.booking_number}
                            </span>
                        </div>
                        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                            <Button
                                type="button"
                                onClick={() =>
                                    window.open(
                                        pendingPayment.url,
                                        '_blank',
                                        'noopener',
                                    )
                                }
                            >
                                Open Payment Page Again
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                onClick={clearPendingPayment}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (booking) {
        const paymentPaid = booking.payment_status === 'PAID';
        const submittedBookingFee =
            booking.transport_type === 'ambulatory'
                ? booking_fee?.ambulatory
                : booking_fee?.standard;
        const submittedBookingFeeDollars =
            submittedBookingFee?.dollars ?? '$30.00';

        return (
            <div className="bg-slate-50 px-4 py-10 sm:px-6 lg:px-12">
                <div className="mx-auto w-full max-w-7xl">
                    <div className="mx-auto max-w-2xl text-center">
                        {paymentPaid ? (
                            <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-600" />
                        ) : (
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                                <span className="text-2xl">⏳</span>
                            </div>
                        )}
                        <h1 className="mt-4 text-2xl font-black text-slate-900 sm:text-3xl">
                            Trip Request Submitted
                        </h1>
                        <p className="mt-3 text-sm text-slate-600 sm:text-base">
                            Your booking request has been received. Your
                            confirmation number is{' '}
                            <span className="font-black text-[#004B87]">
                                {String(booking.booking_number)}
                            </span>
                            . Our dispatch team will review and confirm your
                            request. Thank you!
                        </p>
                        <div
                            className={`mx-auto mt-6 max-w-xl rounded-xl border px-4 py-3 text-sm font-semibold ${
                                paymentPaid
                                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                    : 'border-amber-200 bg-amber-50 text-amber-700'
                            }`}
                        >
                            {paymentPaid
                                ? `Booking fee of ${submittedBookingFeeDollars} paid via Stripe.`
                                : `Booking fee of ${submittedBookingFeeDollars} is pending. Our team will contact you to arrange payment.`}
                        </div>
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
                                <dt className="shrink-0 text-slate-500">
                                    Pickup
                                </dt>
                                <dd className="text-right font-semibold text-slate-800">
                                    {String(booking.pickup_address)}
                                </dd>
                            </div>
                            <div className="flex items-center justify-between gap-6 py-3">
                                <dt className="shrink-0 text-slate-500">
                                    Dropoff
                                </dt>
                                <dd className="text-right font-semibold text-slate-800">
                                    {String(booking.dropoff_address)}
                                </dd>
                            </div>
                            <div className="flex items-center justify-between py-3">
                                <dt className="text-slate-500">Booking Fee</dt>
                                <dd
                                    className={`font-semibold ${
                                        paymentPaid
                                            ? 'text-emerald-600'
                                            : 'text-amber-600'
                                    }`}
                                >
                                    {submittedBookingFeeDollars} ·{' '}
                                    {paymentPaid ? 'Paid' : 'Pending'}
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
            </div>
        );
    }

    return (
        <div className="bg-slate-50">
            <AppHead
                title="Book a Ride"
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
            <PageHero
                title={pageHero?.title || 'Book Your Ride Online'}
                subtitle={
                    pageHero?.subtitle ||
                    'Complete the trip request form below and our dispatch team will review and confirm your request.'
                }
            />

            <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-12">
                {/* Current Phase */}
                <div className="mb-8">
                    <p className="text-xs font-black tracking-widest text-[#E64A19] uppercase">
                        Step {step + 1} of {STEPS.length}: {STEPS[step].label}
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

                                <div className="grid gap-5 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="passenger_phone_number">
                                            Phone Number{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
                                        </Label>
                                        <PhoneInput
                                            id="passenger_phone_number"
                                            value={
                                                form.data.passenger_phone_number
                                            }
                                            onChange={(value) =>
                                                set(
                                                    'passenger_phone_number',
                                                    value,
                                                )
                                            }
                                            invalid={Boolean(
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
                                            Email Address{' '}
                                            <span className="text-red-500">
                                                *
                                            </span>
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
                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="passenger_dob">
                                            Date of Birth
                                        </Label>
                                        <DatePicker
                                            id="passenger_dob"
                                            value={form.data.passenger_dob}
                                            onChange={(value) =>
                                                set('passenger_dob', value)
                                            }
                                            placeholder=""
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

                                <div className="grid gap-3 rounded-xl border border-slate-200 bg-white/60 p-4 sm:grid-cols-2 sm:p-5">
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
                                        <div className="grid gap-2 sm:col-span-2">
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
                                        className={FIELD_BG}
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    {step === 1 && (
                        <>
                            <div className="space-y-6">
                                <div className="grid gap-5 sm:grid-cols-2">
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
                                            placeholder=""
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
                                            placeholder=""
                                            error={Boolean(
                                                fieldError('pickup_time'),
                                            )}
                                        />
                                        <InputError
                                            message={fieldError('pickup_time')}
                                        />
                                    </div>
                                    <div className="grid gap-2 sm:col-span-2">
                                        <Label htmlFor="appointment_time">
                                            Appointment Time
                                        </Label>
                                        <TimePicker
                                            id="appointment_time"
                                            value={form.data.appointment_time}
                                            onChange={(value) =>
                                                set('appointment_time', value)
                                            }
                                            placeholder=""
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
                                                className={FIELD_BG}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor="dropoff_stairs">
                                                Stairs at dropoff
                                            </Label>
                                            <Input
                                                id="dropoff_stairs"
                                                type="number"
                                                min={0}
                                                max={99}
                                                step={1}
                                                value={form.data.dropoff_stairs}
                                                onChange={(e) =>
                                                    set(
                                                        'dropoff_stairs',
                                                        Number(
                                                            e.target.value,
                                                        ) || 0,
                                                    )
                                                }
                                                className={`max-w-[120px] ${FIELD_BG}`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <div className="space-y-6">
                                <div className="grid gap-5 sm:grid-cols-2">
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
                                                <SelectValue aria-label="Transport type" />
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
                                                <SelectValue aria-label="Service type" />
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
                                        <Label>Will Call?</Label>
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
                                                <SelectValue aria-label="Will call" />
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
                                            Payer
                                        </dt>
                                        <dd className="font-semibold text-slate-800">
                                            {form.data.payer || '—'}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-xs font-bold text-slate-400 uppercase">
                                            Distance
                                        </dt>
                                        <dd className="font-semibold text-slate-800">
                                            {distanceMiles !== null
                                                ? `${distanceMiles.toFixed(1)} miles`
                                                : '—'}
                                        </dd>
                                    </div>
                                </dl>
                                {routeLoadingShown && (
                                    <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        Calculating the driving route and
                                        distance...
                                    </p>
                                )}
                                <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                                    A non-refundable booking fee of{' '}
                                    <span className="font-bold text-slate-800">
                                        {bookingFeeDollars}
                                    </span>{' '}
                                    is charged via Stripe when you submit. You
                                    will be redirected to a secure payment page
                                    to complete the charge.
                                </div>
                                {mapPoints.length > 0 && (
                                    <div className="mt-6">
                                        <h4 className="mb-2 text-xs font-black tracking-wide text-[#004B87] uppercase">
                                            Route Preview
                                        </h4>
                                        <MapPreview
                                            points={mapPoints}
                                            route={
                                                hasRouteCoordinates
                                                    ? route?.coordinates
                                                    : undefined
                                            }
                                        />
                                        <p className="mt-2 text-xs text-slate-400">
                                            <span className="font-bold text-[#004B87]">
                                                Blue
                                            </span>{' '}
                                            pickup ·{' '}
                                            <span className="font-bold text-[#E64A19]">
                                                orange
                                            </span>{' '}
                                            dropoff ·{' '}
                                            <span className="font-bold text-[#004B87]">
                                                blue line
                                            </span>{' '}
                                            driving route
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
                                type="button"
                                className="bg-[#E64A19] text-white hover:bg-[#d84315]"
                                onClick={handleSubmit}
                                disabled={form.processing || !reviewReady}
                            >
                                <Send className="mr-2 h-4 w-4" />
                                {form.processing
                                    ? 'Submitting...'
                                    : !reviewReady
                                      ? 'Confirming...'
                                      : 'Submit'}
                            </Button>
                        )}
                    </div>
                </form>

                <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Confirm Your Booking</DialogTitle>
                            <DialogDescription>
                                Review the charge before submitting your trip
                                request.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 text-sm text-slate-600">
                            <p>
                                By submitting this booking, you agree to pay a
                                non-refundable booking fee of{' '}
                                <span className="font-bold text-slate-800">
                                    {bookingFeeDollars}
                                </span>
                                . You will be redirected to a secure payment
                                page to complete the charge.
                            </p>
                            <div className="flex items-start gap-2.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                                <Checkbox
                                    id="agree_to_booking_fee"
                                    checked={agreedToFee}
                                    onCheckedChange={(checked) =>
                                        setAgreedToFee(Boolean(checked))
                                    }
                                />
                                <Label
                                    htmlFor="agree_to_booking_fee"
                                    className="leading-snug font-normal text-slate-600"
                                >
                                    By agreeing to pay the {bookingFeeDollars}{' '}
                                    booking fee, you are agreeing to our{' '}
                                    <Link
                                        href={terms.url()}
                                        target="_blank"
                                        className="font-semibold text-[#004B87] underline underline-offset-2 hover:text-[#003d75]"
                                    >
                                        terms and conditions
                                    </Link>
                                    .
                                </Label>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                onClick={() => setConfirmOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                className="bg-[#E64A19] text-white hover:bg-[#d84315]"
                                onClick={handleConfirmSubmit}
                                disabled={!agreedToFee || form.processing}
                            >
                                {form.processing
                                    ? 'Submitting...'
                                    : 'Agree & Submit'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
