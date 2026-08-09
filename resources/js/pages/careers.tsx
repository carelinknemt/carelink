import { Briefcase, FileText, CheckCircle } from 'lucide-react';
import AppHead from '@/components/app-head';
import type { Career } from '@/types/carelink';

interface CareersProps {
    careers: Career[];
}

const CAREERS_DESCRIPTION =
    'Join CareLink Medical Transportation as a driver, dispatcher, or transport specialist. We are hiring compassionate, PASS-certified professionals across Humboldt, Del Norte, Trinity, and Shasta counties.';

export default function Careers({ careers }: CareersProps) {
    return (
        <div className="min-h-screen bg-slate-50 pb-16">
            <AppHead
                title="Careers — Join Our Team"
                description={CAREERS_DESCRIPTION}
                keywords={[
                    'NEMT jobs',
                    'medical transport driver jobs',
                    'CareLink careers',
                    'NEMT driver hiring Northern California',
                    'PASS certified driver jobs',
                    'Eureka CA transportation jobs',
                ]}
                canonical="/careers"
                type="article"
            />

            {/* Hero Header */}
            <div className="relative overflow-hidden border-b-8 border-[#E64A19] bg-[#004B87] py-16 sm:py-24">
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="/images/Img-Carelink-hero.webp"
                        alt="Carelink Fleet Background"
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#004B87] mix-blend-multiply" />
                </div>

                <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-12">
                    <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-black tracking-widest text-cyan-300 uppercase shadow-sm backdrop-blur-sm">
                        <Briefcase className="h-4 w-4" />
                        Join Our Team
                    </span>
                    <h1 className="mx-auto max-w-3xl text-4xl leading-tight font-black tracking-tight text-white sm:text-5xl">
                        Build a Career of Compassion and Purpose
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed font-medium text-cyan-100 sm:text-base">
                        Carelink Medical Transportation is looking for dedicated
                        individuals to join our Northern California team. Help
                        us bridge the healthcare gap in our community.
                    </p>
                </div>
            </div>

            <div className="mx-auto mt-12 max-w-4xl px-4 sm:px-6 lg:px-12">
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                    <div className="border-b border-slate-100 p-8 sm:p-12">
                        <h2 className="text-2xl font-black text-[#004B87]">
                            Available Positions
                        </h2>
                        <p className="mt-2 text-sm text-slate-500">
                            We are currently accepting applications for the
                            following roles:
                        </p>

                        <div className="mt-8 space-y-6">
                            {careers.map((career) => (
                                <div
                                    key={career.id}
                                    className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:flex-row sm:items-center"
                                >
                                    <div>
                                        <h3 className="text-lg font-black text-slate-900">
                                            {career.title}
                                        </h3>
                                        <p className="mt-1 text-xs text-slate-500">
                                            {career.employment_type} &bull;{' '}
                                            {career.location}
                                        </p>
                                        <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                                            {career.requirements.map(
                                                (req, idx) => (
                                                    <li
                                                        key={idx}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <CheckCircle className="h-4 w-4 text-[#E64A19]" />
                                                        {req}
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                    <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#004B87] px-6 py-3 text-sm font-bold whitespace-nowrap text-white shadow-md transition hover:bg-[#003865] active:scale-95">
                                        Apply Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-orange-50/50 p-8 sm:p-12">
                        <h2 className="flex items-center gap-2 text-xl font-black text-[#004B87]">
                            <FileText className="h-5 w-5 text-[#E64A19]" />
                            General Application
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-slate-600">
                            Don't see a position that matches your skills? We
                            are always looking for passionate people to join
                            Carelink. Submit a general application and we will
                            keep your resume on file.
                        </p>

                        <form
                            className="mt-6 space-y-4"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm transition-all outline-none focus:border-[#E64A19] focus:ring-2 focus:ring-orange-100"
                                        placeholder="Jane Doe"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm transition-all outline-none focus:border-[#E64A19] focus:ring-2 focus:ring-orange-100"
                                        placeholder="jane@example.com"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm transition-all outline-none focus:border-[#E64A19] focus:ring-2 focus:ring-orange-100"
                                    placeholder="(555) 123-4567"
                                    required
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-slate-700">
                                    Cover Letter / Interest
                                </label>
                                <textarea
                                    rows={4}
                                    className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm transition-all outline-none focus:border-[#E64A19] focus:ring-2 focus:ring-orange-100"
                                    placeholder="Tell us why you'd be a great fit for Carelink..."
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full rounded-xl bg-[#E64A19] py-3.5 text-sm font-black text-white shadow-lg shadow-orange-900/20 transition hover:bg-[#d83f0e] active:scale-95"
                            >
                                Submit Application
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
