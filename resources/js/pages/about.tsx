import { Link } from '@inertiajs/react';
import { Award, ShieldCheck, Building2, ArrowLeft, User } from 'lucide-react';
import AppHead from '@/components/app-head';
import { COMPANY_INFO } from '@/data/carelink';
import type { TeamMember } from '@/types/carelink';

interface AboutProps {
    team: TeamMember[];
}

const ABOUT_DESCRIPTION =
    'CareLink Medical Transportation LLC is a family-owned NEMT provider headquartered in Eureka, California, delivering dignified, compassionate, and punctual non-emergency medical transportation across Humboldt, Del Norte, Trinity, and Shasta counties.';

export default function About({ team }: AboutProps) {
    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-12">
            <AppHead
                title="About Carelink Medical Transportation"
                description={ABOUT_DESCRIPTION}
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
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'Organization',
                    name: COMPANY_INFO.name,
                    description: ABOUT_DESCRIPTION,
                    url: window.location.origin,
                    telephone: COMPANY_INFO.phone,
                    email: COMPANY_INFO.email,
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

            <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
                {/* Navigation Back Button */}
                <div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all hover:bg-slate-100 hover:text-[#004B87] hover:shadow"
                    >
                        <ArrowLeft className="h-4 w-4 text-[#E64A19]" />
                        <span>Back to Overview</span>
                    </Link>
                </div>

                {/* Page Hero Header */}
                <div className="relative overflow-hidden rounded-3xl bg-[#004B87] p-8 text-white shadow-2xl sm:p-12">
                    <div className="relative z-10 max-w-3xl space-y-4">
                        <h1 className="text-3xl leading-tight font-black tracking-tight sm:text-4xl lg:text-5xl">
                            About Carelink Medical Transportation LLC
                        </h1>
                        <p className="max-w-2xl text-sm leading-relaxed text-orange-100 sm:text-base">
                            Headquartered in Eureka, California. Family Owned to
                            provide dignified, compassionate, and punctual
                            non-emergency medical transportation across
                            Humboldt, Del Norte, Trinity, and Shasta counties.
                        </p>
                    </div>
                </div>

                {/* Story & Vision Section */}
                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                    <div className="space-y-6 lg:col-span-6">
                        <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold tracking-widest text-[#E64A19] uppercase">
                            <Building2 className="h-4 w-4 text-[#E64A19]" />
                            <span>Our Mission</span>
                        </div>

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

                        {/* Key Pillars */}
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="space-y-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="flex items-center gap-2 text-sm font-bold text-[#004B87]">
                                    <ShieldCheck className="h-5 w-5 text-[#E64A19]" />
                                    <span>100% PASS Certified</span>
                                </div>
                                <p className="text-[11px] text-slate-500">
                                    All drivers complete Passenger Assistance
                                    Safety and CPR training.
                                </p>
                            </div>

                            <div className="space-y-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="flex items-center gap-2 text-sm font-bold text-[#004B87]">
                                    <Award className="h-5 w-5 text-[#E64A19]" />
                                    <span>Curb-to-Curb Help</span>
                                </div>
                                <p className="text-[11px] text-slate-500">
                                    Safe assistance at the driveway, helping
                                    passengers load and unload securely.
                                </p>
                            </div>
                        </div>
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
                                    {COMPANY_INFO.address}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leadership & Staff */}
                <div className="space-y-8 border-t border-slate-200 pt-8">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <span className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-bold tracking-widest text-[#E64A19] uppercase">
                                Leadership & Dispatch
                            </span>
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
                                        <h3 className="text-xl font-black text-slate-900 transition-colors group-hover:text-[#004B87]">
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
