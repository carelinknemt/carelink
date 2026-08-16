import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { business } from '@/routes';

export default function BusinessCta() {
    return (
        <section
            id="for-businesses"
            className="relative overflow-hidden bg-[#004B87] py-16 sm:py-20"
        >
            <div className="absolute inset-0 opacity-20">
                <img
                    src="/images/Img-Carelink-hero.webp"
                    alt="Carelink fleet background"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[#004B87] mix-blend-multiply" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
                <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
                    <div className="max-w-2xl">
                        <h2 className="text-3xl leading-tight font-black tracking-tight text-white sm:text-4xl">
                            Partner with CareLink for Your Organizational Transportation Needs
                        </h2>
                        <p className="mt-4 max-w-xl text-sm leading-relaxed font-medium text-cyan-100 sm:text-base">
                            Hospitals, clinics, care facilities, and community
                            organizations across Humboldt, Del Norte, Trinity,
                            and Shasta counties rely on CareLink for dependable
                            non-emergency medical transportation. Let's build a
                            partnership that keeps your patients moving.
                        </p>
                    </div>

                    <Link
                        href={business.url()}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#E64A19] px-4 py-4 text-sm font-black whitespace-nowrap text-white shadow-lg shadow-orange-900/30 transition hover:bg-[#d83f0e] active:scale-95"
                    >
                        Start Working With Us
                    </Link>
                </div>
            </div>
        </section>
    );
}
