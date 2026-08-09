import { Briefcase, FileText, CheckCircle } from 'lucide-react';
import AppHead from '@/components/app-head';
import type { Career } from '@/types/carelink';

interface CareersProps {
    careers: Career[];
}

export default function Careers({ careers }: CareersProps) {
    return (
        <div className="bg-slate-50 min-h-screen pb-16">
            <AppHead title="Careers" />

            {/* Hero Header */}
            <div className="relative bg-[#004B87] py-16 sm:py-24 border-b-8 border-[#E64A19] overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img src="/images/Img-Carelink-hero.webp" alt="Carelink Fleet Background" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-[#004B87] mix-blend-multiply" />
                </div>

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 relative z-10 text-center">
                    <span className="text-xs font-black tracking-widest text-cyan-300 uppercase bg-white/10 px-4 py-1.5 rounded-full border border-white/20 backdrop-blur-sm shadow-sm inline-flex items-center gap-2 mb-6">
                        <Briefcase className="h-4 w-4" />
                        Join Our Team
                    </span>
                    <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
                        Build a Career of Compassion and Purpose
                    </h1>
                    <p className="mt-6 text-sm sm:text-base text-cyan-100 max-w-2xl mx-auto font-medium leading-relaxed">
                        Carelink Medical Transportation is looking for dedicated individuals to join our Northern California team. Help us bridge the healthcare gap in our community.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-12 mt-12">
                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className="p-8 sm:p-12 border-b border-slate-100">
                        <h2 className="text-2xl font-black text-[#004B87]">Available Positions</h2>
                        <p className="text-sm text-slate-500 mt-2">We are currently accepting applications for the following roles:</p>

                        <div className="mt-8 space-y-6">
                            {careers.map((career) => (
                                <div
                                    key={career.id}
                                    className="p-6 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                                >
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900">{career.title}</h3>
                                        <p className="text-xs text-slate-500 mt-1">
                                            {career.employment_type} &bull; {career.location}
                                        </p>
                                        <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                                            {career.requirements.map((req, idx) => (
                                                <li key={idx} className="flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4 text-[#E64A19]" />
                                                    {req}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <button className="whitespace-nowrap inline-flex items-center justify-center gap-2 rounded-xl bg-[#004B87] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#003865] active:scale-95 shadow-md">
                                        Apply Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="p-8 sm:p-12 bg-orange-50/50">
                        <h2 className="text-xl font-black text-[#004B87] flex items-center gap-2">
                            <FileText className="h-5 w-5 text-[#E64A19]" />
                            General Application
                        </h2>
                        <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                            Don't see a position that matches your skills? We are always looking for passionate people to join Carelink. Submit a general application and we will keep your resume on file.
                        </p>

                        <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Full Name</label>
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-[#E64A19] focus:ring-2 focus:ring-orange-100 bg-white"
                                        placeholder="Jane Doe"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">Email Address</label>
                                    <input
                                        type="email"
                                        className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-[#E64A19] focus:ring-2 focus:ring-orange-100 bg-white"
                                        placeholder="jane@example.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700">Phone Number</label>
                                <input
                                    type="tel"
                                    className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm outline-none transition-all focus:border-[#E64A19] focus:ring-2 focus:ring-orange-100 bg-white"
                                    placeholder="(555) 123-4567"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700">Cover Letter / Interest</label>
                                <textarea
                                    rows={4}
                                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition-all focus:border-[#E64A19] focus:ring-2 focus:ring-orange-100 bg-white resize-none"
                                    placeholder="Tell us why you'd be a great fit for Carelink..."
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full rounded-xl bg-[#E64A19] py-3.5 text-sm font-black text-white shadow-lg shadow-orange-900/20 transition hover:bg-[#d83f0e] active:scale-95">
                                Submit Application
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
