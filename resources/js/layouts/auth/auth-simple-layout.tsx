import { Link } from '@inertiajs/react';
import { useEffect } from 'react';
import AccessibilityWidget from '@/components/carelink/accessibility-widget';
import { COMPANY_INFO } from '@/data/carelink';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

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
                    </div>
                </div>
            </main>

            <AccessibilityWidget />
        </div>
    );
}