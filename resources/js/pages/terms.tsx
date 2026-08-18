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
    useCms,
    useCompanyInfo,
    usePageHero,
} from '@/lib/cms';

interface TermsSection {
    icon: 'calendar' | 'card' | 'phone' | 'shield';
    title: string;
    body: string[];
}

const FALLBACK_TERMS_DESCRIPTION =
    'Terms and conditions for Carelink Medical Transportation services: booking fees, payment, cancellations, passenger conduct, liability, and privacy for private pay trips across Humboldt, Del Norte, Trinity, and Shasta counties.';

const ICONS: Record<TermsSection['icon'], typeof CalendarCheck> = {
    calendar: CalendarCheck,
    card: CreditCard,
    phone: PhoneCall,
    shield: ShieldCheck,
};

export default function Terms() {
    const cms = useCms();
    const company = useCompanyInfo();
    const hero = usePageHero('terms');
    const sections = (cms.term_sections?.sections ?? []) as TermsSection[];
    const termsDescription =
        (cms.term_sections?.description as string) ||
        FALLBACK_TERMS_DESCRIPTION;
    const lastUpdated =
        (cms.term_sections?.last_updated as string) || 'August 2026';
    const intro =
        (cms.term_sections?.intro as string) ||
        'These terms and conditions govern the use of {company} online booking service and the provision of medical transportation services. By submitting a trip request, including when you agree to the booking fee at checkout, you accept these terms.';
    const values = {
        company: company.name || 'Carelink Medical Transportation',
        phone: company.phone || '',
        email: company.email || '',
        fee: '$30',
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-16">
            <AppHead
                title="Terms & Conditions"
                description={termsDescription}
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
                title={hero.title || 'Terms & Conditions'}
                subtitle={
                    hero.subtitle ||
                    'Please review the rules that apply to booking and riding with Carelink Medical Transportation.'
                }
            />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-12">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <p className="text-xs font-bold tracking-wide text-slate-400 uppercase">
                        Last updated: {lastUpdated}
                    </p>

                    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
                        {interpolateCmsText(intro, values)}
                    </p>
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
                                    {section.body.map((paragraph) => (
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

                <div className="rounded-3xl border border-amber-200 bg-amber-50 px-6 py-5 text-sm leading-relaxed text-amber-800 sm:px-8">
                    {interpolateCmsText(
                        'Questions about these terms or a trip in progress? Our dispatch team is available at {phone} to help.',
                        values,
                    )}
                </div>
            </div>
        </div>
    );
}
