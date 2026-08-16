import { Link } from '@inertiajs/react';
import { ArrowLeft, Clock3, MapPin, ShieldCheck, Phone } from 'lucide-react';
import { useEffect } from 'react';
import AccessibilityWidget from '@/components/carelink/accessibility-widget';
import { COMPANY_INFO } from '@/data/carelink';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

const TRUST_POINTS = [
    {
        icon: Clock3,
        label: '24/7 dispatch support',
    },
    {
        icon: MapPin,
        label: 'Northern California & surrounding counties',
    },
    {
        icon: ShieldCheck,
        label: 'ADA-compliant, insured transportation',
    },
];

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    useEffect(() => {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
    }, []);

    return (
        <div className="flex min-h-svh flex-col bg-slate-50">
            <div className="h-2 bg-[#E64A19]" />

            <main className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6 lg:px-12">
                <div className="w-full max-w-md">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col items-center gap-4">
                            <Link
                                href={home()}
                                className="flex flex-col items-center gap-2"
                            >
                                <img
                                    src={COMPANY_INFO.logoUrl}
                                    alt={COMPANY_INFO.name}
                                    className="h-12 w-auto max-w-[200px] object-contain"
                                    referrerPolicy="no-referrer"
                                />
                            </Link>

                            <div className="space-y-2 text-center">
                                <h1 className="text-2xl font-black tracking-tight text-[#004B87]">
                                    {title}
                                </h1>
                                <p className="text-sm text-balance text-slate-500">
                                    {description}
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                            {children}
                        </div>

                        <div className="flex flex-col items-center gap-3">
                            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                                {TRUST_POINTS.map((point) => {
                                    const Icon = point.icon;

                                    return (
                                        <span
                                            key={point.label}
                                            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500"
                                        >
                                            <Icon className="h-3.5 w-3.5 text-[#004B87]" />
                                            {point.label}
                                        </span>
                                    );
                                })}
                            </div>

                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                                <Phone className="h-3.5 w-3.5 text-[#004B87]" />
                                Call dispatch:{' '}
                                <a
                                    href="tel:17078549350"
                                    className="text-[#004B87] hover:underline"
                                >
                                    {COMPANY_INFO.phone}
                                </a>
                            </span>

                            <Link
                                href={home()}
                                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 transition-colors hover:text-[#004B87]"
                            >
                                <ArrowLeft className="h-3.5 w-3.5" />
                                Back to {COMPANY_INFO.name}
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <AccessibilityWidget />
        </div>
    );
}