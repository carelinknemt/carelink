import { Link } from '@inertiajs/react';
import { COMPANY_INFO } from '@/data/carelink';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
            <div className="w-full max-w-sm">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link href={home()} className="flex flex-col items-center gap-2">
                            <img
                                src={COMPANY_INFO.logoUrl}
                                alt={COMPANY_INFO.name}
                                className="h-10 w-auto max-w-[180px] object-contain"
                                referrerPolicy="no-referrer"
                            />
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-2xl font-semibold tracking-tight text-[#004b87]">
                                {title}
                            </h1>
                            <p className="text-sm text-balance text-muted-foreground">
                                {description}
                            </p>
                        </div>
                    </div>

                    <div className="rounded-xl border border-[#dbe7f1] bg-white p-6 shadow-sm">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
