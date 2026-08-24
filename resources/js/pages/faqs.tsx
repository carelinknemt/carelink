import { useForm } from '@inertiajs/react';
import {
    ChevronDown,
    Search,
    HelpCircle,
    Send,
    CheckCircle2,
    PhoneCall,
} from 'lucide-react';
import { useState } from 'react';
import AppHead from '@/components/app-head';
import PageHero from '@/components/carelink/page-hero';
import { useCompanyInfo, usePageHero } from '@/lib/cms';
import contact from '@/routes/contact';
import type { FaqItem } from '@/types/carelink';

interface FaqsProps {
    faqs: FaqItem[];
}

const FAQS_DESCRIPTION =
    'Answers about CareLink NEMT: Medi-Cal and insurance billing, wheelchair van reservations, dispatch hours, service areas in Humboldt, Del Norte, Trinity, and Shasta counties, and facility partnerships. Contact us at (707) 854-9350.';

export default function Faqs({ faqs }: FaqsProps) {
    const company = useCompanyInfo();
    const hero = usePageHero('faq');
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

    const form = useForm({
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const categories = [
        'ALL',
        'GENERAL',
        'INSURANCE & MEDI-CAL',
        'VEHICLES',
        'FACILITIES',
    ];

    const filteredFaqs = faqs.filter((faq) => {
        const matchesCategory =
            selectedCategory === 'ALL' ||
            faq.category.toUpperCase().includes(selectedCategory);
        const matchesSearch =
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    const handleAskSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        form.post(contact.store.url(), {
            onSuccess: () => {
                form.reset();
                setSearchQuery('');
            },
        });
    };

    const inputClass =
        'w-full rounded-xl border border-slate-300 bg-white p-3 text-xs outline-none transition-all focus:border-[#E64A19] focus:ring-2 focus:ring-orange-100';

    return (
        <div className="min-h-screen bg-slate-50 pb-16">
            <AppHead
                title="FAQs & Contact"
                description={FAQS_DESCRIPTION}
                keywords={[
                    'NEMT FAQ',
                    'Medi-Cal transportation',
                    'insurance medical transport',
                    'wheelchair van booking',
                    'CareLink dispatch hours',
                    'medical transportation cost',
                    'hospital discharge transport questions',
                ]}
                canonical="/faq"
                type="website"
                breadcrumbs={[
                    { name: 'Home', path: '/' },
                    { name: 'FAQs', path: '/faq' },
                ]}
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'FAQPage',
                    mainEntity: faqs.map((faq) => ({
                        '@type': 'Question',
                        name: faq.question,
                        acceptedAnswer: {
                            '@type': 'Answer',
                            text: faq.answer,
                        },
                    })),
                }}
            />

            <PageHero
                title={hero.title || 'Carelink Help & Advisory Center'}
                subtitle={
                    hero.subtitle ||
                    'Clear answers regarding Medi-Cal coverage, wheelchair ramp assistance, hospital discharge dispatch times, and group transit shuttle rides.'
                }
            />

            <div className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-12">
                {/* Search & Category Filter Bar */}
                <div className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="relative">
                        <Search className="absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search questions (e.g. Medi-Cal, wheelchair, shuttle, dispatch, cost)..."
                            className="w-full rounded-2xl border border-slate-300 bg-slate-50 py-3.5 pr-4 pl-12 text-xs text-slate-800 placeholder-slate-400 focus:border-[#E64A19] focus:bg-white focus:outline-none sm:text-sm"
                        />
                    </div>

                    <div className="flex scrollbar-none items-center gap-2 overflow-x-auto pb-1">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                                    selectedCategory === cat
                                        ? 'bg-[#E64A19] text-white shadow-md shadow-orange-900/20'
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {cat === 'ALL' ? 'All Questions' : cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Accordion Questions List */}
                <div className="space-y-4">
                    {filteredFaqs.length === 0 ? (
                        <div className="space-y-3 rounded-3xl border border-slate-200 bg-white p-12 text-center text-slate-500">
                            <HelpCircle className="mx-auto h-12 w-12 text-slate-300" />
                            <p className="text-sm font-semibold">
                                No matching questions found.
                            </p>
                        </div>
                    ) : (
                        filteredFaqs.map((faq, index) => {
                            const isOpen = openIndex === index;

                            return (
                                <div
                                    key={faq.id}
                                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200"
                                >
                                    <button
                                        onClick={() =>
                                            setOpenIndex(isOpen ? null : index)
                                        }
                                        className="flex w-full items-center justify-between p-5 text-left font-extrabold text-[#E64A19] transition-colors hover:text-[#E64A19]"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-orange-100 text-xs font-black text-[#E64A19]">
                                                Q
                                            </span>
                                            <span className="text-sm sm:text-base">
                                                {faq.question}
                                            </span>
                                        </div>
                                        <ChevronDown
                                            className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${
                                                isOpen
                                                    ? 'rotate-180 text-[#E64A19]'
                                                    : ''
                                            }`}
                                        />
                                    </button>

                                    {isOpen && (
                                        <div className="border-t border-slate-100 bg-slate-50 px-5 pt-1 pb-5 text-xs leading-relaxed text-slate-600 sm:text-sm">
                                            <div className="space-y-2 pl-10">
                                                <p>{faq.answer}</p>
                                                <span className="mt-2 inline-block rounded-full border border-orange-200/60 bg-orange-100 px-2.5 py-0.5 text-[10px] font-black text-[#E64A19] uppercase">
                                                    {faq.category}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Submit Custom Question Form */}
                <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-md">
                    <div className="flex items-center gap-3 text-[#E64A19]">
                        <HelpCircle className="h-6 w-6" />
                        <h3 className="text-xl font-black text-slate-900">
                            Have a specific dispatch or route question?
                        </h3>
                    </div>

                    {form.wasSuccessful ? (
                        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
                            <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-600" />
                            <div className="text-xs">
                                <p className="text-sm font-bold">
                                    Inquiry Sent!
                                </p>
                                <p>
                                    Carelink Dispatch will review your question
                                    and reply within 2 hours.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleAskSubmit} className="space-y-4">
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label className="mb-1 block text-xs font-bold text-slate-700">
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={form.data.name}
                                        onChange={(e) =>
                                            form.setData('name', e.target.value)
                                        }
                                        placeholder="Jane Smith"
                                        className={inputClass}
                                    />
                                    {form.errors.name && (
                                        <p className="mt-1 text-xs font-medium text-red-600">
                                            {form.errors.name}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="mb-1 block text-xs font-bold text-slate-700">
                                        Your Email *
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={form.data.email}
                                        onChange={(e) =>
                                            form.setData(
                                                'email',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="contact@example.com"
                                        className={inputClass}
                                    />
                                    {form.errors.email && (
                                        <p className="mt-1 text-xs font-medium text-red-600">
                                            {form.errors.email}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold text-slate-700">
                                    Phone (optional)
                                </label>
                                <input
                                    type="tel"
                                    value={form.data.phone}
                                    onChange={(e) =>
                                        form.setData('phone', e.target.value)
                                    }
                                    placeholder="(707) 555-0123"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-xs font-bold text-slate-700">
                                    Your Question / Trip Detail *
                                </label>
                                <textarea
                                    required
                                    rows={3}
                                    value={form.data.message}
                                    onChange={(e) =>
                                        form.setData('message', e.target.value)
                                    }
                                    placeholder="Describe passenger needs, wheel chair requirements, origin, destination..."
                                    className={inputClass}
                                />
                                {form.errors.message && (
                                    <p className="mt-1 text-xs font-medium text-red-600">
                                        {form.errors.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={form.processing}
                                    className="inline-flex items-center gap-2 rounded-xl bg-[#E64A19] px-6 py-3 text-xs font-black text-white shadow-md shadow-orange-900/20 transition-all hover:bg-[#d83f0e] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    <Send className="h-4 w-4 text-orange-200" />
                                    <span>
                                        {form.processing
                                            ? 'Sending…'
                                            : 'Send Advisory Question'}
                                    </span>
                                </button>
                            </div>
                        </form>
                    )}
                </div>

                {/* Dispatch Hotline Callout */}
                <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-[#004B87] p-8 text-white shadow-2xl sm:flex-row">
                    <div className="space-y-1 text-center sm:text-left">
                        <h3 className="text-xl font-black">
                            Need immediate ride dispatch?
                        </h3>
                        <p className="text-xs text-orange-100">
                            Speak directly with Carelink dispatch in Eureka, CA.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <a
                            href={`tel:${company.dispatch_phone ?? ''}`}
                            className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-xs font-black text-[#004B87] shadow transition-colors hover:bg-orange-50"
                        >
                            <PhoneCall className="h-4 w-4 text-[#E64A19]" />
                            <span>Call {company.dispatch_phone}</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
