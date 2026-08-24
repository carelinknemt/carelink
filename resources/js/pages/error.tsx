import { Phone } from 'lucide-react';
import AppHead from '@/components/app-head';
import { useCompanyInfo } from '@/lib/cms';
import { home } from '@/routes';

const ERROR_DETAILS: Record<number, { title: string; description: string }> = {
    403: {
        title: 'Access Denied',
        description:
            'Sorry, you are not allowed to view this page. If you believe this is a mistake, please contact our dispatch team for assistance.',
    },
    404: {
        title: 'Page Not Found',
        description:
            'Sorry, the page you are looking for could not be found. It may have been moved, renamed, or never existed. Use the link below to return to our home page and find what you need.',
    },
    500: {
        title: 'Server Error',
        description:
            'Whoops, something went wrong on our end. Please try again in a few minutes, or contact our dispatch team and we will help you directly.',
    },
    503: {
        title: 'Service Unavailable',
        description:
            'Sorry, we are doing some maintenance right now. Please check back soon, or call our dispatch team for immediate assistance.',
    },
};

const DEFAULT_DETAILS: { title: string; description: string } = {
    title: 'Something Went Wrong',
    description:
        'An unexpected error occurred. Please try again, or contact our dispatch team for help.',
};

export default function ErrorPage({ status }: { status: number }) {
    const { title, description } = ERROR_DETAILS[status] ?? DEFAULT_DETAILS;
    const company = useCompanyInfo();
    const dispatchPhone = company.dispatch_phone ?? company.phone ?? '';

    return (
        <div className="bg-slate-50">
            <AppHead title={title} description={description} type="website" />

            <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-16 text-center sm:py-24 lg:px-12">
                <span className="inline-flex items-center rounded-full border border-orange-200/60 bg-orange-100 px-3 py-1 text-[11px] font-black tracking-wider text-[#E64A19] uppercase">
                    Error {status}
                </span>

                <h1 className="mt-4 text-3xl leading-tight font-black tracking-tight text-slate-900 sm:text-4xl">
                    {title}
                </h1>

                <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                    {description}
                </p>

                <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
                    <a
                        href={home.url()}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-[#004B87] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#003d75] sm:w-auto"
                    >
                        Go Back to Home Page
                    </a>

                    {dispatchPhone && (
                        <a
                            href={`tel:${dispatchPhone.replace(/[^0-9+]/g, '')}`}
                            className="inline-flex w-full items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-[#004B87] transition-colors hover:bg-slate-100 sm:w-auto"
                        >
                            <Phone className="h-4 w-4" />
                            Call Dispatch
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
