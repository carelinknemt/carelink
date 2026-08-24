import { useForm } from '@inertiajs/react';
import { CheckCircle, FileText, Send, Upload } from 'lucide-react';
import { useRef, useState } from 'react';
import AppHead from '@/components/app-head';
import PageHero from '@/components/carelink/page-hero';
import { usePageHero } from '@/lib/cms';
import { apply } from '@/routes/careers';
import type { Career } from '@/types/carelink';

interface CareersProps {
    careers: Career[];
}

const CAREERS_DESCRIPTION =
    'Join CareLink Medical Transportation as a driver, dispatcher, or transport specialist. We are hiring compassionate, PASS-certified professionals across Humboldt, Del Norte, Trinity, and Shasta counties.';

export default function Careers({ careers }: CareersProps) {
    const hero = usePageHero('careers');
    const [selectedPosition, setSelectedPosition] = useState<string | null>(
        null,
    );
    const resumeInputRef = useRef<HTMLInputElement>(null);
    const form = useForm({
        career_id: null as number | null,
        name: '',
        email: '',
        phone: '',
        cover_letter: '',
        resume: null as File | null,
    });

    const handleApplyNow = (career: Career) => {
        form.setData('career_id', career.id);
        setSelectedPosition(career.title);
        document
            .getElementById('career-application')
            ?.scrollIntoView({ behavior: 'smooth' });
    };

    const handlePositionChange = (value: string) => {
        const careerId = value === '' ? null : Number(value);
        const career = careers.find((c) => c.id === careerId);

        form.setData('career_id', careerId);
        setSelectedPosition(career ? career.title : null);
    };

    const handleResumeChange = (file: File | null) => {
        form.setData('resume', file);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(apply.url(), {
            onSuccess: () => {
                setSelectedPosition(null);
                form.reset();

                if (resumeInputRef.current) {
                    resumeInputRef.current.value = '';
                }
            },
        });
    };

    const inputClass =
        'w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm transition-all outline-none focus:border-[#E64A19] focus:ring-2 focus:ring-orange-100';

    return (
        <div className="min-h-screen bg-slate-50 pb-16">
            <AppHead
                title="Careers"
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
                breadcrumbs={[
                    { name: 'Home', path: '/' },
                    { name: 'Careers', path: '/careers' },
                ]}
                jsonLd={careers.map((career) => ({
                    '@context': 'https://schema.org',
                    '@type': 'JobPosting',
                    title: career.title,
                    description:
                        career.summary ||
                        `CareLink Medical Transportation is hiring a ${career.title} in ${career.location}.`,
                    datePosted: career.created_at,
                    employmentType: career.employment_type
                        .toUpperCase()
                        .replace(/[^A-Z]+/g, '_'),
                    hiringOrganization: {
                        '@type': 'Organization',
                        name: 'CareLink Medical Transportation',
                    },
                    jobLocation: {
                        '@type': 'Place',
                        address: {
                            '@type': 'PostalAddress',
                            addressLocality: career.location,
                            addressRegion: 'CA',
                            addressCountry: 'US',
                        },
                    },
                }))}
            />

            {/* Hero Header */}
            <PageHero
                title={hero.title || 'Build a Career of Compassion and Purpose'}
                subtitle={
                    hero.subtitle ||
                    'Carelink Medical Transportation is looking for dedicated individuals to join our Northern California team. Help us bridge the healthcare gap in our community.'
                }
            />

            <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-12">
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

                                        {career.benefits && career.benefits.length > 0 && (
                                            <>
                                                <p className="mt-4 text-xs font-black tracking-wide text-[#004B87] uppercase">
                                                    Benefits
                                                </p>
                                                <ul className="mt-2 space-y-1.5 text-sm text-slate-600">
                                                    {career.benefits.map(
                                                        (benefit, idx) => (
                                                            <li
                                                                key={idx}
                                                                className="flex items-center gap-2"
                                                            >
                                                                <CheckCircle className="h-4 w-4 text-emerald-500" />
                                                                {benefit}
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            </>
                                        )}
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleApplyNow(career)}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#004B87] px-6 py-3 text-sm font-bold whitespace-nowrap text-white shadow-md transition hover:bg-[#003865] active:scale-95"
                                    >
                                        Apply Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div
                        id="career-application"
                        className="bg-orange-50/50 p-8 sm:p-12"
                    >
                        <h2 className="flex items-center gap-2 text-xl font-black text-[#004B87]">
                            <FileText className="h-5 w-5 text-[#E64A19]" />
                            Employment Application
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-slate-600">
                            Pick the role you are applying for and attach your
                            resume or CV. Our hiring team reviews every
                            application.
                        </p>
                        <p className="mt-2 text-sm text-slate-500">
                            Our team will get in contact with you about your
                            application.
                        </p>

                        {form.wasSuccessful ? (
                            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                                <CheckCircle className="mx-auto h-10 w-10 text-emerald-600" />
                                <h3 className="mt-3 text-lg font-black text-emerald-800">
                                    Application Submitted Successfully
                                </h3>
                                <p className="mt-1 text-sm text-emerald-700">
                                    Thank you for your interest in joining
                                    Carelink. Our team will review your
                                    application and contact you soon.
                                </p>
                            </div>
                        ) : (
                            <form
                                className="mt-6 space-y-4"
                                onSubmit={handleSubmit}
                            >
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">
                                        Position
                                    </label>
                                    <select
                                        value={
                                            form.data.career_id === null
                                                ? ''
                                                : String(form.data.career_id)
                                        }
                                        onChange={(e) =>
                                            handlePositionChange(e.target.value)
                                        }
                                        className={inputClass}
                                        required
                                    >
                                        <option value="">
                                            Select a position
                                        </option>
                                        {careers.map((career) => (
                                            <option
                                                key={career.id}
                                                value={career.id}
                                            >
                                                {career.title}
                                            </option>
                                        ))}
                                    </select>
                                    {form.errors.career_id && (
                                        <p className="text-xs font-semibold text-red-600">
                                            {form.errors.career_id}
                                        </p>
                                    )}
                                </div>

                                {selectedPosition && (
                                    <div className="rounded-xl border border-[#004B87]/20 bg-[#004B87]/5 px-4 py-3 text-sm font-bold text-[#004B87]">
                                        Applying for:{' '}
                                        <span className="font-black">
                                            {selectedPosition}
                                        </span>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700">
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            value={form.data.name}
                                            onChange={(e) =>
                                                form.setData(
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                            className={inputClass}
                                            placeholder="Jane Doe"
                                            required
                                        />
                                        {form.errors.name && (
                                            <p className="text-xs font-semibold text-red-600">
                                                {form.errors.name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700">
                                            Email Address
                                        </label>
                                        <input
                                            type="email"
                                            value={form.data.email}
                                            onChange={(e) =>
                                                form.setData(
                                                    'email',
                                                    e.target.value,
                                                )
                                            }
                                            className={inputClass}
                                            placeholder="jane@example.com"
                                            required
                                        />
                                        {form.errors.email && (
                                            <p className="text-xs font-semibold text-red-600">
                                                {form.errors.email}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={form.data.phone}
                                            onChange={(e) =>
                                                form.setData(
                                                    'phone',
                                                    e.target.value,
                                                )
                                            }
                                            className={inputClass}
                                            placeholder="(555) 123-4567"
                                            required
                                        />
                                        {form.errors.phone && (
                                            <p className="text-xs font-semibold text-red-600">
                                                {form.errors.phone}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700">
                                            Resume / CV
                                        </label>
                                        <label className="flex h-full cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-3.5 transition-all hover:border-[#E64A19] hover:bg-orange-50/50">
                                            <Upload className="h-5 w-5 shrink-0 text-[#E64A19]" />
                                            <span className="min-w-0 flex-1">
                                                {form.data.resume ? (
                                                    <span className="block truncate text-sm font-bold text-slate-800">
                                                        {form.data.resume.name}
                                                    </span>
                                                ) : (
                                                    <span className="block text-sm text-slate-500">
                                                        PDF, DOC, or DOCX (max 5
                                                        MB)
                                                    </span>
                                                )}
                                            </span>
                                            <input
                                                ref={resumeInputRef}
                                                type="file"
                                                accept=".pdf,.doc,.docx"
                                                className="hidden"
                                                onChange={(e) =>
                                                    handleResumeChange(
                                                        e.target.files?.[0] ??
                                                            null,
                                                    )
                                                }
                                                required
                                            />
                                        </label>
                                        {form.errors.resume && (
                                            <p className="text-xs font-semibold text-red-600">
                                                {form.errors.resume}
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">
                                        Cover Letter / Interest
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={form.data.cover_letter}
                                        onChange={(e) =>
                                            form.setData(
                                                'cover_letter',
                                                e.target.value,
                                            )
                                        }
                                        className={`${inputClass} resize-none py-3`}
                                        placeholder="Tell us why you'd be a great fit for Carelink..."
                                        required
                                    />
                                    {form.errors.cover_letter && (
                                        <p className="text-xs font-semibold text-red-600">
                                            {form.errors.cover_letter}
                                        </p>
                                    )}
                                </div>
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#E64A19] py-3.5 text-sm font-black text-white shadow-lg shadow-orange-900/20 transition hover:bg-[#d83f0e] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Send className="h-4 w-4" />
                                    {form.processing
                                        ? 'Submitting...'
                                        : 'Submit Application'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
