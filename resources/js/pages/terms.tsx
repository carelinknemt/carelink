import { CalendarCheck, CreditCard, PhoneCall, ShieldCheck } from 'lucide-react';
import AppHead from '@/components/app-head';
import PageHero from '@/components/carelink/page-hero';
import { COMPANY_INFO } from '@/data/carelink';

interface TermsSection {
    icon: 'calendar' | 'card' | 'phone' | 'shield';
    title: string;
    body: string[];
}

const TERMS_DESCRIPTION =
    'Terms and conditions for Carelink Medical Transportation services: booking fees, payment, cancellations, passenger conduct, liability, and privacy for private pay trips across Humboldt, Del Norte, Trinity, and Shasta counties.';

const SECTIONS: TermsSection[] = [
    {
        icon: 'calendar',
        title: 'Booking and Scheduling',
        body: [
            'All trip requests are subject to driver availability and dispatch confirmation. A request submitted through our website is not confirmed until our dispatch team reviews and confirms it.',
            'Bookings are scheduled for the date and pickup time you provide. We ask that you be ready at your pickup location at least 10 minutes before the scheduled time. If you need more than 15 minutes of waiting time at pickup, please let dispatch know when you book.',
            'Same-day and will call trips are dispatched on demand and may experience longer wait times during peak hours.',
        ],
    },
    {
        icon: 'card',
        title: 'Pricing and Payment',
        body: [
            'Bookings are private pay only. Carelink does not currently bill Medi-Cal, Medicare, or insurance providers for trips booked through this website.',
            'Trip pricing is estimated from the driving distance between your pickup and dropoff locations. Wheelchair service charges a $45 base fare, which includes the first five miles, plus $3.50 for each additional mile. Ambulatory (taxi) service charges a $20 base fare, which includes the first five miles, plus $2.50 for each additional mile.',
            'The estimated price is confirmed by our dispatch team before your trip. The final fare may differ from the estimate if the route or trip details change.',
            'A non-refundable booking fee of $30 is charged at the time you submit a trip request. This fee reserves your trip and is charged through a secure payment page. The booking fee is not applied toward the trip fare.',
        ],
    },
    {
        icon: 'phone',
        title: 'Cancellations and Refunds',
        body: [
            `Call our dispatch team at ${COMPANY_INFO.phone} as soon as possible to cancel or change a trip. Cancellations made at least two hours before the scheduled pickup time are free.`,
            'The $30 booking fee is non-refundable. Trip fares are paid directly to the driver at the completion of the trip unless alternative arrangements were made with dispatch in advance.',
            'Canceled or missed trips remain subject to our dispatch team review. Repeated no-shows may affect your ability to book future trips.',
        ],
    },
    {
        icon: 'shield',
        title: 'Passenger Conduct and Liability',
        body: [
            'Passengers must not smoke, eat, or consume alcohol inside our vehicles. Service animals are welcome, and we request that you tell dispatch about any animal accompanying your trip when you book.',
            'Wheelchair passengers must use the vehicle restraint systems provided by our drivers for their safety. Our drivers may require additional assistance at pickup or dropoff when needed.',
            'Carelink is not responsible for lost or damaged personal items left in our vehicles. Please check your seating area before leaving the vehicle.',
            `If you need to reach us about a trip or a question about these terms, call ${COMPANY_INFO.phone} or email ${COMPANY_INFO.email}.`,
        ],
    },
];

const ICONS: Record<TermsSection['icon'], typeof CalendarCheck> = {
    calendar: CalendarCheck,
    card: CreditCard,
    phone: PhoneCall,
    shield: ShieldCheck,
};

export default function Terms() {
    return (
        <div className="min-h-screen bg-slate-50 pb-16">
            <AppHead
                title="Terms & Conditions"
                description={TERMS_DESCRIPTION}
                keywords={[
                    'CareLink terms and conditions',
                    'NEMT booking terms',
                    'private pay transport rules',
                    'medical transport cancellation policy',
                    'CareLink booking fee',
                ]}
                canonical="/terms"
                type="website"
            />

            <PageHero
                title="Terms & Conditions"
                subtitle="Please review the rules that apply to booking and riding with Carelink Medical Transportation."
            />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-12">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <p className="text-xs font-bold tracking-wide text-slate-400 uppercase">
                        Last updated: August 2026
                    </p>

                    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
                        These terms and conditions govern the use of{' '}
                        {COMPANY_INFO.name}
                        {' '}
                        online booking service and the provision of medical
                        transportation services. By submitting a trip request,
                        including when you agree to the booking fee at
                        checkout, you accept these terms.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                    {SECTIONS.map((section) => {
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
                                    {section.body.map((paragraph) => (
                                        <li
                                            key={paragraph}
                                            className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-600"
                                        >
                                            <span className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#E64A19]" />
                                            {paragraph}
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        );
                    })}
                </div>

                <div className="rounded-3xl border border-amber-200 bg-amber-50 px-6 py-5 text-sm leading-relaxed text-amber-800 sm:px-8">
                    Questions about these terms or a trip in progress? Our
                    dispatch team is available at{' '}
                    <span className="font-bold">{COMPANY_INFO.phone}</span>{' '}
                    to help.
                </div>
            </div>
        </div>
    );
}