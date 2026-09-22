import { Link } from '@inertiajs/react';
import {
    CalendarCheck,
    CreditCard,
    PhoneCall,
    ShieldCheck,
} from 'lucide-react';
import AppHead from '@/components/app-head';
import PageHero from '@/components/carelink/page-hero';
import {
    interpolateCmsText,
    useBookingFee,
    useCms,
    useCompanyInfo,
    usePageHero,
} from '@/lib/cms';
import { book, terms } from '@/routes';

interface RefundSection {
    icon: 'calendar' | 'card' | 'phone' | 'shield';
    title: string;
    body: string[];
}

const FALLBACK_REFUND_DESCRIPTION =
    'Carelink Medical Transportation refund policy: when the booking fee is refundable, how refunds are issued, and what to do if a trip is cancelled by dispatch.';

const ICONS: Record<RefundSection['icon'], typeof CalendarCheck> = {
    calendar: CalendarCheck,
    card: CreditCard,
    phone: PhoneCall,
    shield: ShieldCheck,
};

export default function RefundPolicy() {
    const cms = useCms();
    const company = useCompanyInfo();
    const hero = usePageHero('refund-policy');
    const bookingFee = useBookingFee();
    const sections = (cms.refund_policy?.sections ?? []) as RefundSection[];
    const refundDescription =
        (cms.refund_policy?.description as string) ||
        FALLBACK_REFUND_DESCRIPTION;
    const lastUpdated =
        (cms.refund_policy?.last_updated as string) || 'September 2026';
    const intro =
        (cms.refund_policy?.intro as string) ||
        'A non-refundable booking fee of {fee} is charged at the time you submit a trip request. The booking fee is not applied toward the trip fare.';
    const values = {
        company: company.name || 'Carelink Medical Transportation',
        phone: company.phone || '',
        email: company.email || '',
        fee: bookingFee.dollars,
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-16">
            <AppHead
                title="Refund Policy"
                description={refundDescription}
                keywords={[
                    'CareLink refund policy',
                    'NEMT booking fee refund',
                    'medical transport cancellation refund',
                    'CareLink booking fee',
                ]}
                canonical="/refund-policy"
                type="website"
                breadcrumbs={[
                    { name: 'Home', path: '/' },
                    { name: 'Refund Policy', path: '/refund-policy' },
                ]}
            />

            <PageHero
                title={hero.title || 'Refund Policy'}
                subtitle={
                    hero.subtitle ||
                    'When the booking fee is refundable and how refunds are issued.'
                }
            />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-12">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <p className="text-xs font-bold tracking-wide text-slate-400 uppercase">
                        Last updated: {lastUpdated}
                    </p>

                    <div className="mt-4 max-w-3xl rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-600 sm:text-base">
                        {interpolateCmsText(intro, values)}
                    </div>

                    <div className="mt-6 space-y-4 text-sm leading-relaxed text-slate-600 sm:text-base">
                        <p className="max-w-3xl">
                            The short version: if <strong>you</strong> cancel,
                            the booking fee is non-refundable. If{' '}
                            <strong>we</strong> cancel your trip, the booking
                            fee is automatically refunded to your original
                            payment method.
                        </p>
                        <p className="max-w-3xl">
                            This policy is part of our{' '}
                            <Link
                                href={terms.url()}
                                className="font-bold text-[#004B87] underline decoration-dotted underline-offset-4 transition-colors hover:text-[#E64A19]"
                            >
                                Terms &amp; Conditions
                            </Link>
                            .
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {sections.map((section) => {
                        const Icon = ICONS[section.icon];

                        return (
                            <section
                                key={section.title}
                                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                            >
                                <h2 className="flex items-center gap-3 text-base font-black tracking-tight text-[#004B87] uppercase sm:text-lg">
                                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#004B87]/10">
                                        <Icon className="h-4.5 w-4.5 text-[#004B87]" />
                                    </span>
                                    {section.title}
                                </h2>
                                <ul className="mt-4 space-y-3">
                                    {(Array.isArray(section.body)
                                        ? section.body
                                        : []
                                    ).map((paragraph) => (
                                        <li
                                            key={paragraph}
                                            className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600"
                                        >
                                            <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#E64A19]" />
                                            {interpolateCmsText(
                                                paragraph,
                                                values,
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        );
                    })}
                </div>

                <div className="flex flex-col gap-4 rounded-3xl border border-amber-200 bg-amber-50 px-6 py-5 text-sm leading-relaxed text-amber-800 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                    <p>
                        {interpolateCmsText(
                            'Questions about a refund or a booking? Our dispatch team is available at {phone} to help.',
                            values,
                        )}
                    </p>
                    <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
                        <a
                            href={`tel:${values.phone.replace(/[^\d+]/g, '')}`}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#E64A19] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-900/20 transition-all hover:bg-[#d83f0e] active:scale-95"
                        >
                            <PhoneCall className="h-4 w-4 shrink-0 text-orange-100" />
                            Call Dispatch
                        </a>
                        <Link
                            href={book.url()}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#004B87] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-slate-900/20 transition-all hover:bg-[#003d75] active:scale-95"
                        >
                            Book a Ride
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}