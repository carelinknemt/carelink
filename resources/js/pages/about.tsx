import { User } from 'lucide-react';
import AppHead from '@/components/app-head';
import PageHero from '@/components/carelink/page-hero';
import { useCompanyInfo, useCms, usePageHero } from '@/lib/cms';
import type { TeamMember } from '@/types/carelink';

interface AboutProps {
    team: TeamMember[];
}

const FALLBACK_ABOUT_DESCRIPTION =
    'CareLink Medical Transportation LLC is a family-owned NEMT provider headquartered in Eureka, California, delivering dignified, compassionate, and punctual non-emergency medical transportation across Humboldt, Del Norte, Trinity, and Shasta counties.';

export default function About({ team }: AboutProps) {
    const cms = useCms();
    const company = useCompanyInfo();
    const hero = usePageHero('about');
    const aboutDescription =
        (cms.company_info?.about_description as string) ||
        FALLBACK_ABOUT_DESCRIPTION;

    return (
        <div className="min-h-screen bg-slate-50 pb-16">
            <AppHead
                title="About Carelink Medical Transportation"
                description={aboutDescription}
                keywords={[
                    'about CareLink',
                    'CareLink Medical Transportation LLC',
                    'Eureka CA medical transport company',
                    'family owned NEMT',
                    'PASS certified drivers',
                    'Northern California medical transportation',
                ]}
                canonical="/about"
                type="article"
                breadcrumbs={[
                    { name: 'Home', path: '/' },
                    { name: 'About Us', path: '/about' },
                ]}
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'Organization',
                    name: company.name,
                    description: aboutDescription,
                    url: window.location.origin,
                    telephone: company.phone,
                    email: company.email,
                    address: {
                        '@type': 'PostalAddress',
                        streetAddress: '3857 Walnut Drive, Suite B',
                        addressLocality: 'Eureka',
                        addressRegion: 'CA',
                        postalCode: '95503',
                        addressCountry: 'US',
                    },
                }}
            />

            <PageHero
                title={
                    hero.title || 'About Carelink Medical Transportation LLC'
                }
                subtitle={
                    hero.subtitle ||
                    'Headquartered in Eureka, California. Family Owned to provide dignified, compassionate, and punctual non-emergency medical transportation across Humboldt, Del Norte, Trinity, and Shasta counties.'
                }
            />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-12">
                {/* Story & Vision Section */}
                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                    <div className="space-y-6 lg:col-span-6">
                        <h2 className="text-3xl leading-tight font-black tracking-tight text-slate-900">
                            Connecting Patients to Health, Healing, & Community
                        </h2>

                        <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                            Carelink Medical Transportation LLC was established
                            to bridge critical transportation gaps in rural and
                            suburban Northern California. We recognize that
                            missing a doctor appointment or hospital discharge
                            can severely jeopardize patients.
                        </p>

                        <p className="text-xs leading-relaxed text-slate-600 sm:text-sm">
                            Every vehicle in our fleet is integrated with NEMT
                            live dispatching, BraunAbility hydraulic lifts, and
                            climate-controlled cabins, managed by PASS-certified
                            transport specialists who treat every passenger like
                            family.
                        </p>
                    </div>

                    <div className="relative lg:col-span-6">
                        <div className="relative overflow-hidden rounded-3xl border-4 border-white shadow-2xl">
                            <img
                                src="/images/carelink_driver_care_1785061489888.jpg"
                                alt="Carelink Vehicle and Driver"
                                className="h-[400px] w-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                            <div className="absolute right-6 bottom-6 left-6 space-y-1 text-white">
                                <p className="text-xs font-bold text-cyan-300">
                                    Carelink Headquarters & Fleet Garage
                                </p>
                                <p className="text-lg font-black">
                                    {company.address}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leadership & Staff */}
                <div className="space-y-8 border-t border-slate-200 pt-8">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <h2 className="mt-2 text-2xl font-black text-slate-900 sm:text-3xl">
                                Carelink Leadership Team
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                        {team.map((member) => (
                            <div
                                key={member.id}
                                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md transition-all duration-300 hover:border-orange-200 hover:shadow-xl"
                            >
                                <div>
                                    <div className="relative flex h-64 w-full flex-col items-center justify-center border-b border-slate-200/50 bg-slate-100">
                                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 text-[#E64A19] shadow-inner transition-transform duration-500 group-hover:scale-110">
                                            <User className="h-12 w-12" />
                                        </div>
                                        <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black tracking-wider text-slate-400 uppercase">
                                            <span>Authorized Leader</span>
                                        </div>
                                    </div>

                                    <div className="space-y-3 p-6">
                                        <h3 className="text-xl font-black text-[#E64A19] transition-colors group-hover:text-[#004B87]">
                                            {member.name}
                                        </h3>
                                        <p className="text-xs font-bold text-[#E64A19]">
                                            {member.role}
                                        </p>
                                        <p className="text-xs leading-relaxed text-slate-600">
                                            {member.bio}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
