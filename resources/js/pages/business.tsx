import { useForm } from '@inertiajs/react';
import { Building2, CheckCircle, Send } from 'lucide-react';
import AppHead from '@/components/app-head';
import { COMPANY_INFO } from '@/data/carelink';
import { store as submitBusinessRequest } from '@/routes/business';

interface BusinessProps {
    business_types: string[];
}

const BUSINESS_DESCRIPTION =
    'Partner with CareLink Medical Transportation for dependable non-emergency medical transportation. Hospitals, clinics, and care facilities across Humboldt, Del Norte, Trinity, and Shasta counties work with us for wheelchair vans, dialysis rides, and facility transfers.';

export default function Business({ business_types }: BusinessProps) {
    const form = useForm({
        company_name: '',
        contact_name: '',
        email: '',
        phone: '',
        business_type: '',
        estimated_monthly_trips: '',
        message: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        form.post(submitBusinessRequest.url(), {
            onSuccess: () => form.reset(),
        });
    };

    const inputClass =
        'w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm transition-all outline-none focus:border-[#E64A19] focus:ring-2 focus:ring-orange-100';

    return (
        <div className="min-h-screen bg-slate-50 pb-16">
            <AppHead
                title="For Businesses"
                description={BUSINESS_DESCRIPTION}
                keywords={[
                    'NEMT partnership',
                    'medical transportation for facilities',
                    'hospital transport partner',
                    'Medi-Cal transportation provider',
                    'CareLink business services',
                    'NEMT Northern California',
                ]}
                canonical="/for-businesses"
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
                    <h1 className="mx-auto max-w-3xl text-4xl leading-tight font-black tracking-tight text-white sm:text-5xl">
                        Let's Get Your Patients Moving Together
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed font-medium text-cyan-100 sm:text-base">
                        CareLink provides dependable non-emergency medical
                        transportation for hospitals, clinics, care facilities,
                        and community organizations across Northern California.
                        Tell us about your needs and our team will reach out.
                    </p>
                </div>
            </div>

            <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-12">
                {/* Inquiry Form */}
                <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                    <div className="border-b border-slate-100 p-8 sm:p-12">
                        <h2 className="flex items-center gap-2 text-xl font-black text-[#004B87]">
                            <Building2 className="h-5 w-5 text-[#E64A19]" />
                            Business Partnership Inquiry
                        </h2>
                        <p className="mt-3 text-sm leading-relaxed text-slate-600">
                            Share a few details about your organization and
                            we'll be in touch to design a transportation plan
                            that fits. You can also reach us directly at{' '}
                            <a
                                href={`tel:${COMPANY_INFO.dispatchPhone.replace(/[^0-9+]/g, '')}`}
                                className="font-bold text-[#004B87] hover:underline"
                            >
                                {COMPANY_INFO.dispatchPhone}
                            </a>
                            .
                        </p>

                        {form.wasSuccessful ? (
                            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                                <CheckCircle className="mx-auto h-10 w-10 text-emerald-600" />
                                <h3 className="mt-3 text-lg font-black text-emerald-800">
                                    Inquiry Submitted Successfully
                                </h3>
                                <p className="mt-1 text-sm text-emerald-700">
                                    Thank you for reaching out. Our team will
                                    review your inquiry and contact you soon.
                                </p>
                            </div>
                        ) : (
                            <form
                                className="mt-6 space-y-4"
                                onSubmit={handleSubmit}
                            >
                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700">
                                            Company / Organization Name
                                        </label>
                                        <input
                                            type="text"
                                            value={form.data.company_name}
                                            onChange={(e) =>
                                                form.setData(
                                                    'company_name',
                                                    e.target.value,
                                                )
                                            }
                                            className={inputClass}
                                            placeholder="Acme Medical Center"
                                            required
                                        />
                                        {form.errors.company_name && (
                                            <p className="text-xs font-semibold text-red-600">
                                                {form.errors.company_name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700">
                                            Contact Name
                                        </label>
                                        <input
                                            type="text"
                                            value={form.data.contact_name}
                                            onChange={(e) =>
                                                form.setData(
                                                    'contact_name',
                                                    e.target.value,
                                                )
                                            }
                                            className={inputClass}
                                            placeholder="Jane Doe"
                                            required
                                        />
                                        {form.errors.contact_name && (
                                            <p className="text-xs font-semibold text-red-600">
                                                {form.errors.contact_name}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700">
                                            Work Email Address
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
                                            placeholder="jane@acmemedical.org"
                                            required
                                        />
                                        {form.errors.email && (
                                            <p className="text-xs font-semibold text-red-600">
                                                {form.errors.email}
                                            </p>
                                        )}
                                    </div>
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
                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700">
                                            Organization Type
                                        </label>
                                        <select
                                            value={form.data.business_type}
                                            onChange={(e) =>
                                                form.setData(
                                                    'business_type',
                                                    e.target.value,
                                                )
                                            }
                                            className={inputClass}
                                            required
                                        >
                                            <option value="" disabled>
                                                Select an organization type…
                                            </option>
                                            {business_types.map((type) => (
                                                <option
                                                    key={type}
                                                    value={type}
                                                >
                                                    {type}
                                                </option>
                                            ))}
                                        </select>
                                        {form.errors.business_type && (
                                            <p className="text-xs font-semibold text-red-600">
                                                {form.errors.business_type}
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs font-bold text-slate-700">
                                            Estimated Monthly Trips{' '}
                                            <span className="font-medium text-slate-400">
                                                (optional)
                                            </span>
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            value={form.data.estimated_monthly_trips}
                                            onChange={(e) =>
                                                form.setData(
                                                    'estimated_monthly_trips',
                                                    e.target.value,
                                                )
                                            }
                                            className={inputClass}
                                            placeholder="e.g. 120"
                                        />
                                        {form.errors.estimated_monthly_trips && (
                                            <p className="text-xs font-semibold text-red-600">
                                                {form.errors.estimated_monthly_trips}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold text-slate-700">
                                        How Can We Help?{' '}
                                        <span className="font-medium text-slate-400">
                                            (optional)
                                        </span>
                                    </label>
                                    <textarea
                                        rows={4}
                                        value={form.data.message}
                                        onChange={(e) =>
                                            form.setData(
                                                'message',
                                                e.target.value,
                                            )
                                        }
                                        className={`${inputClass} resize-none py-3`}
                                        placeholder="Tell us about your facility, service areas, recurring ride needs, or billing preferences..."
                                    />
                                    {form.errors.message && (
                                        <p className="text-xs font-semibold text-red-600">
                                            {form.errors.message}
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
                                        : 'Submit Inquiry'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}