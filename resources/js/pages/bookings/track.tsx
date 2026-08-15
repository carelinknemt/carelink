import { usePoll } from '@inertiajs/react';
import {
    CalendarClock,
    CheckCircle2,
    Copy,
    ExternalLink,
    Loader2,
    Phone,
} from 'lucide-react';
import { useState } from 'react';
import AppHead from '@/components/app-head';
import PageHero from '@/components/carelink/page-hero';
import { Button } from '@/components/ui/button';
import { COMPANY_INFO } from '@/data/carelink';
import { book } from '@/routes';

interface BookingSummary {
    booking_number: string;
    passenger_name: string;
    trip_date: string;
    pickup_address: string;
    dropoff_address: string;
    input_price: string | number;
    status: string;
    payment_status: string;
    paid_at: string | null;
}

interface TrackPageProps {
    booking: BookingSummary;
    checkout_url: string | null;
}

const STATUS_LABELS: Record<string, string> = {
    PENDING_DISPATCH: 'Awaiting Dispatch',
    BAMBI_DISPATCHED: 'Dispatched',
    IN_TRANSIT: 'In Transit',
    COMPLETED: 'Completed',
};

const BOOKING_FEE = 30.0;

function PaymentWatcher() {
    usePoll(5000, { only: ['booking', 'checkout_url'] });

    return null;
}

export default function Track({ booking, checkout_url }: TrackPageProps) {
    const [copied, setCopied] = useState(false);
    const paymentPaid = booking.payment_status === 'PAID';

    const copyTrackLink = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };

    return (
        <div className="bg-slate-50">
            <AppHead
                title={`Track Booking ${booking.booking_number}`}
                description="Track your CareLink trip request status and booking fee payment."
                canonical={`/bookings/${booking.booking_number}`}
                type="website"
            />

            <PageHero
                badge="Booking Status"
                badgeIcon={CalendarClock}
                title="Track Your Booking"
                subtitle={`View the status of trip request ${booking.booking_number} and its booking fee payment.`}
            />

            <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-12">
                <div
                    className={`rounded-2xl border px-5 py-6 text-center ${
                        paymentPaid
                            ? 'border-emerald-200 bg-emerald-50'
                            : 'border-amber-200 bg-amber-50'
                    }`}
                >
                    {paymentPaid ? (
                        <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
                    ) : (
                        <Loader2 className="mx-auto h-12 w-12 animate-spin text-amber-500" />
                    )}
                    <h2 className="mt-3 text-xl font-black text-slate-900">
                        {paymentPaid
                            ? 'Booking Confirmed'
                            : 'Payment Pending'}
                    </h2>
                    <p className="mt-2 text-sm font-semibold text-slate-600">
                        {paymentPaid ? (
                            <>
                                Your booking request has been received. Your
                                confirmation number is{' '}
                                <span className="font-black text-[#004B87]">
                                    {booking.booking_number}
                                </span>
                                . Our dispatch team will review and confirm your
                                request. Thank you!
                            </>
                        ) : (
                            `The $${BOOKING_FEE.toFixed(2)} booking fee has not been received yet. Complete the payment to confirm your trip request.`
                        )}
                    </p>
                    {!paymentPaid && (
                        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                            {checkout_url && (
                                <Button
                                    type="button"
                                    onClick={() =>
                                        window.open(checkout_url, '_blank', 'noopener')
                                    }
                                >
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    Resume Payment
                                </Button>
                            )}
                            <Button
                                type="button"
                                variant="outline"
                                className="border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                onClick={copyTrackLink}
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                {copied ? 'Link Copied' : 'Copy Tracking Link'}
                            </Button>
                        </div>
                    )}
                </div>

                <div className="mt-8 rounded-2xl border border-slate-200 bg-white/60 px-6 py-4 text-sm">
                    <h3 className="py-2 text-xs font-black tracking-wide text-[#004B87] uppercase">
                        Trip Details
                    </h3>
                    <dl className="divide-y divide-slate-200">
                        <div className="flex items-center justify-between py-3">
                            <dt className="text-slate-500">Passenger</dt>
                            <dd className="font-semibold text-slate-800">
                                {booking.passenger_name}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <dt className="text-slate-500">Date</dt>
                            <dd className="font-semibold text-slate-800">
                                {booking.trip_date}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between gap-6 py-3">
                            <dt className="shrink-0 text-slate-500">Pickup</dt>
                            <dd className="text-right font-semibold text-slate-800">
                                {booking.pickup_address}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between gap-6 py-3">
                            <dt className="shrink-0 text-slate-500">Dropoff</dt>
                            <dd className="text-right font-semibold text-slate-800">
                                {booking.dropoff_address}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <dt className="text-slate-500">Price</dt>
                            <dd className="font-semibold text-slate-800">
                                Confirm with dispatch
                            </dd>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <dt className="text-slate-500">Trip Status</dt>
                            <dd className="font-bold text-[#004B87]">
                                {STATUS_LABELS[booking.status] ?? booking.status}
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
                                ${BOOKING_FEE.toFixed(2)} ·{' '}
                                {paymentPaid ? 'Paid' : 'Pending'}
                            </dd>
                        </div>
                    </dl>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                    <a
                        href={book.url()}
                        className="inline-flex h-10 items-center justify-center rounded-md bg-[#004B87] px-6 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#003d75]"
                    >
                        Book Another Ride
                    </a>
                    <a
                        href={`tel:${COMPANY_INFO.dispatchPhone.replace(/[^0-9+]/g, '')}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#004B87] hover:underline"
                    >
                        <Phone className="h-4 w-4 text-orange-500" />
                        {COMPANY_INFO.dispatchPhone}
                    </a>
                </div>

                <p className="mt-6 text-center text-xs text-slate-400">
                    Keep this link to check your booking later:{' '}
                    <span className="font-semibold text-slate-500">
                        {window.location.href}
                    </span>
                </p>
            </div>

            {!paymentPaid && <PaymentWatcher />}
        </div>
    );
}
