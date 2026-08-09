import { Link } from '@inertiajs/react';
import { Award, ShieldCheck, Building2, ArrowLeft, User } from 'lucide-react';
import { COMPANY_INFO } from '@/data/carelink';
import type { TeamMember } from '@/types/carelink';

interface AboutProps {
    team: TeamMember[];
}

export default function About({ team }: AboutProps) {
    return (
        <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-12">
            <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
                {/* Navigation Back Button */}
                <div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:text-[#004B87] hover:bg-slate-100 transition-all border border-slate-200 shadow-sm hover:shadow"
                    >
                        <ArrowLeft className="h-4 w-4 text-[#E64A19]" />
                        <span>Back to Overview</span>
                    </Link>
                </div>

                {/* Page Hero Header */}
                <div className="relative overflow-hidden rounded-3xl bg-[#004B87] p-8 sm:p-12 text-white shadow-2xl">
                    <div className="relative z-10 max-w-3xl space-y-4">
                        <h1 className="text-3xl font-black sm:text-4xl lg:text-5xl tracking-tight leading-tight">
                            About Carelink Medical Transportation LLC
                        </h1>
                        <p className="text-sm sm:text-base text-orange-100 leading-relaxed max-w-2xl">
                            Headquartered in Eureka, California. Family Owned to provide dignified, compassionate, and punctual non-emergency medical transportation across Humboldt, Del Norte, Trinity, and Shasta counties.
                        </p>
                    </div>
                </div>

                {/* Story & Vision Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                    <div className="lg:col-span-6 space-y-6">
                        <div className="inline-flex items-center gap-2 text-xs font-bold text-[#E64A19] uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                            <Building2 className="h-4 w-4 text-[#E64A19]" />
                            <span>Our Mission</span>
                        </div>

                        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                            Connecting Patients to Health, Healing, & Community
                        </h2>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            Carelink Medical Transportation LLC was established to bridge critical transportation gaps in rural and suburban Northern California. We recognize that missing a doctor appointment or hospital discharge can severely jeopardize patients.
                        </p>

                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                            Every vehicle in our fleet is integrated with NEMT live dispatching, BraunAbility hydraulic lifts, and climate-controlled cabins, managed by PASS-certified transport specialists who treat every passenger like family.
                        </p>

                        {/* Key Pillars */}
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                                <div className="flex items-center gap-2 text-[#004B87] font-bold text-sm">
                                    <ShieldCheck className="h-5 w-5 text-[#E64A19]" />
                                    <span>100% PASS Certified</span>
                                </div>
                                <p className="text-[11px] text-slate-500">All drivers complete Passenger Assistance Safety and CPR training.</p>
                            </div>

                            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
                                <div className="flex items-center gap-2 text-[#004B87] font-bold text-sm">
                                    <Award className="h-5 w-5 text-[#E64A19]" />
                                    <span>Curb-to-Curb Help</span>
                                </div>
                                <p className="text-[11px] text-slate-500">Safe assistance at the driveway, helping passengers load and unload securely.</p>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-6 relative">
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                            <img
                                src="/images/carelink_driver_care_1785061489888.jpg"
                                alt="Carelink Vehicle and Driver"
                                className="w-full h-[400px] object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                                <p className="text-xs font-bold text-cyan-300">Carelink Headquarters & Fleet Garage</p>
                                <p className="text-lg font-black">{COMPANY_INFO.address}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Leadership & Staff */}
                <div className="space-y-8 pt-8 border-t border-slate-200">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <span className="text-xs font-bold text-[#E64A19] uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                                Leadership & Dispatch
                            </span>
                            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">Carelink Leadership Team</h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {team.map((member) => (
                            <div
                                key={member.id}
                                className="group flex flex-col justify-between rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-xl hover:border-orange-200 transition-all duration-300 overflow-hidden"
                            >
                                <div>
                                    <div className="relative h-64 w-full bg-slate-100 flex flex-col items-center justify-center border-b border-slate-200/50">
                                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 text-[#E64A19] shadow-inner transition-transform duration-500 group-hover:scale-110">
                                            <User className="h-12 w-12" />
                                        </div>
                                        <div className="mt-4 flex items-center gap-1.5 text-[10px] font-black text-slate-400 tracking-wider uppercase">
                                            <span>Authorized Leader</span>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-3">
                                        <h3 className="text-xl font-black text-slate-900 group-hover:text-[#004B87] transition-colors">
                                            {member.name}
                                        </h3>
                                        <p className="text-xs font-bold text-[#E64A19]">{member.role}</p>
                                        <p className="text-xs text-slate-600 leading-relaxed">{member.bio}</p>
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
