import AppHead from '@/components/app-head';
import { home } from '@/routes';

const ERROR_DETAILS: Record<number, { title: string; description: string }> = {
    403: {
        title: '403: Access Denied',
        description:
            'Sorry, you are not allowed to view this page. If you believe this is a mistake, please contact our dispatch team for assistance.',
    },
    404: {
        title: '404: Page Not Found',
        description:
            'Sorry, the page you are looking for could not be found. It may have been moved, renamed, or never existed. Use the link below to return to our home page and find what you need.',
    },
    500: {
        title: '500: Server Error',
        description:
            'Whoops, something went wrong on our end. Please try again in a few minutes, or contact our dispatch team and we will help you directly.',
    },
    503: {
        title: '503: Service Unavailable',
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

    return (
        <div className="min-h-screen bg-slate-50 pb-16">
            <AppHead
                title={title}
                description={description}
                type="website"
            />

            <div className="mx-auto flex max-w-7xl flex-col items-center px-4 py-20 text-center sm:px-6 lg:px-12 lg:py-28">
                <p className="text-xs font-black tracking-widest text-[#E64A19] uppercase">
                    Error {status}
                </p>

                <h1 className="mt-2 text-3xl leading-tight font-black tracking-tight text-slate-900 sm:text-4xl">
                    {title}
                </h1>

                <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
                    {description}
                </p>

                <a
                    href={home.url()}
                    className="mt-8 inline-flex items-center gap-2 rounded-md bg-[#004B87] px-6 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-[#003d75]"
                >
                    Go Back to Home Page
                </a>
            </div>
        </div>
    );
}