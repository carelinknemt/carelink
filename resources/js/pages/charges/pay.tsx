import { usePoll } from '@inertiajs/react';
import { CheckCircle2, ExternalLink, Loader2, Phone } from 'lucide-react';
import AppHead from '@/components/app-head';
import PageHero from '@/components/carelink/page-hero';
import { Button } from '@/components/ui/button';
import { useCompanyInfo } from '@/lib/cms';
import { book } from '@/routes';

interface ChargeSummary {
    token: string;
    status: 'PENDING' | 'PAID';
    amount_dollars: string;
    amount_cents: number;
    note: string | null;
    paid_at: string | null;
    booking_number: string;
    passenger_first_name: string;
    passenger_last_name: string;
}

interface ChargePayPageProps {
    charge: ChargeSummary;
    checkout_url: string | null;
}

function PaymentWatcher() {
    usePoll(5000, { only: ['charge', 'checkout_url'] });

    return null;
}

export default function ChargePay({ charge, checkout_url }: ChargePayPageProps) {
    const company = useCompanyInfo();
    const paymentPaid = charge.status === 'PAID';

    return (
        <div className="bg-slate-50">
            <AppHead
                title={`Pay Balance - ${charge.booking_number}`}
                description="Complete your CareLink balance payment online."
                robots="noindex, nofollow"
            />

            <PageHero
                title="Complete Your Payment"
                subtitle={`Pay the remaining balance for trip request ${charge.booking_number}.`}
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
                        {paymentPaid ? 'Payment Received' : 'Payment Pending'}
                    </h2>
                    <p className="mt-2 text-sm font-semibold text-slate-600">
                        {paymentPaid ? (
                            <>
                                Your payment has been received. Thank you!
                            </>
                        ) : (
                            <>A payment of {charge.amount_dollars} is due for trip {charge.booking_number}. Complete the payment to settle your balance.</>
                        )}
                    </p>
                    {!paymentPaid && checkout_url && (
                        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                            <Button
                                type="button"
                                onClick={() =>
                                    window.open(
                                        checkout_url,
                                        '_blank',
                                        'noopener',
                                    )
                                }
                            >
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Pay Now
                            </Button>
                        </div>
                    )}
                </div>

                <div className="mt-8 rounded-2xl border border-slate-200 bg-white/60 px-6 py-4 text-sm">
                    <h3 className="py-2 text-xs font-black tracking-wide text-[#004B87] uppercase">
                        Payment Details
                    </h3>
                    <dl className="divide-y divide-slate-200">
                        <div className="flex items-center justify-between py-3">
                            <dt className="text-slate-500">Booking Number</dt>
                            <dd className="font-semibold text-slate-800">
                                {charge.booking_number}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <dt className="text-slate-500">Passenger</dt>
                            <dd className="font-semibold text-slate-800">
                                {charge.passenger_first_name}{' '}
                                {charge.passenger_last_name}
                            </dd>
                        </div>
                        <div className="flex items-center justify-between py-3">
                            <dt className="text-slate-500">Amount Due</dt>
                            <dd
                                className={`font-bold ${
                                    paymentPaid
                                        ? 'text-emerald-600'
                                        : 'text-amber-600'
                                }`}
                            >
                                {charge.amount_dollars} ·{' '}
                                {paymentPaid ? 'Paid' : 'Pending'}
                            </dd>
                        </div>
                        {charge.note && (
                            <div className="flex items-center justify-between gap-6 py-3">
                                <dt className="shrink-0 text-slate-500">Note</dt>
                                <dd className="text-right font-semibold text-slate-800">
                                    {charge.note}
                                </dd>
                            </div>
                        )}
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
                        href={`tel:${(company.dispatch_phone ?? '').replace(/[^0-9+]/g, '')}`}
                        className="inline-flex items-center gap-2 text-sm font-bold text-[#004B87] hover:underline"
                    >
                        <Phone className="h-4 w-4 text-orange-500" />
                        {company.dispatch_phone}
                    </a>
                </div>
            </div>

            {!paymentPaid && <PaymentWatcher />}
        </div>
    );
}