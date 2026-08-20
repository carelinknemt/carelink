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

interface PrivacySection {
    icon: 'calendar' | 'card' | 'phone' | 'shield';
    title: string;
    body: string[];
}

const FALLBACK_PRIVACY_DESCRIPTION =
    'Privacy policy for Carelink Medical Transportation: what information we collect, how it is used and protected, and your rights for private pay trips across Humboldt, Del Norte, Trinity, and Shasta counties.';

const ICONS: Record<PrivacySection['icon'], typeof CalendarCheck> = {
    calendar: CalendarCheck,
    card: CreditCard,
    phone: PhoneCall,
    shield: ShieldCheck,
};

export default function Privacy() {
    const cms = useCms();
    const company = useCompanyInfo();
    const hero = usePageHero('privacy');
    const sections = (cms.privacy_sections?.sections ?? []) as PrivacySection[];
    const privacyDescription =
        (cms.privacy_sections?.description as string) ||
        FALLBACK_PRIVACY_DESCRIPTION;
    const lastUpdated =
        (cms.privacy_sections?.last_updated as string) || 'August 2026';
    const intro =
        (cms.privacy_sections?.intro as string) ||
        'Carelink Medical Transportation LLC ("{company}") respects your privacy. This policy explains what information we collect when you use our website or book a trip, how we use and protect it, and the choices you have. By submitting a trip request or contacting us, you agree to the practices described here.';
    const values = {
        company: company.name || 'Carelink Medical Transportation',
        phone: company.phone || '',
        email: company.email || '',
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-16">
            <AppHead
                title="Privacy Policy"
                description={privacyDescription}
                keywords={[
                    'CareLink privacy policy',
                    'NEMT data privacy',
                    'medical transport privacy',
                    'protected health information',
                    'CareLink data protection',
                ]}
                canonical="/privacy"
                type="website"
            />

            <PageHero
                title={hero.title || 'Privacy Policy'}
                subtitle={
                    hero.subtitle ||
                    'How Carelink Medical Transportation collects, uses, and protects your information.'
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
                        'Questions about this policy or the information we hold about you? Our dispatch team is available at {phone} or by email at {email}.',
                        values,
                    )}
                </div>
            </div>
        </div>
    );
}