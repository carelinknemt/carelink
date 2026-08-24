import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import BookAppointmentBanner from '@/components/carelink/book-appointment-banner';
import type { TransportService } from '@/types/carelink';

interface CommittedExcellenceProps {
    services: TransportService[];
    onSelectService: (service: TransportService) => void;
}

export default function CommittedExcellence({
    services,
    onSelectService,
}: CommittedExcellenceProps) {
    const featuredServices = services.slice(0, 6);

    return (
        <section
            id="services"
            className="relative z-20 bg-slate-50 pt-6 pb-20 text-slate-900"
        >
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
                {/* Book Appointment Banner */}
                <div className="relative z-30 -mt-20 mb-12 sm:-mt-28 sm:mb-16 lg:-mt-32">
                    <BookAppointmentBanner />
                </div>

                {/* Header row */}
                <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                    <div>
                        <span className="text-xs font-black tracking-widest text-[#E64A19] uppercase">
                            Reliable NEMT Care
                        </span>
                        <h2 className="mt-0.5 text-2xl font-black tracking-tight text-[#004B87] sm:text-3xl">
                            Our Core Services
                        </h2>
                    </div>

                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 self-start rounded-xl bg-[#E64A19] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-900/20 transition-all hover:bg-[#d83f0e] active:scale-95 sm:self-auto"
                    >
                        <span>All Services</span>
                        <ChevronRight className="h-4 w-4 text-orange-200" />
                    </Link>
                </div>

                {/* 6 Featured Services Cards Grid */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {featuredServices.map((service) => (
                        <div
                            key={service.id}
                            onClick={() => onSelectService(service)}
                            className="group flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:border-orange-300 hover:shadow-xl"
                        >
                            {/* Image Container */}
                            <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>

                            {/* Bottom Content Box */}
                            <div className="flex flex-1 flex-col justify-between bg-[#004B87] p-4 text-white">
                                <div>
                                    <span className="text-[10px] font-black tracking-wider text-orange-300 uppercase">
                                        {service.category === 'NON_MEDICAL'
                                            ? 'COMMUNITY'
                                            : service.category}
                                    </span>
                                    <h3 className="mt-0.5 text-sm leading-snug font-extrabold tracking-tight text-white sm:text-base">
                                        {service.title}
                                    </h3>
                                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-200">
                                        {service.short_description}
                                    </p>
                                </div>

                                <div className="mt-3.5 flex items-center text-xs font-bold text-orange-300 transition-colors group-hover:text-orange-200">
                                    <span>View Details</span>
                                    <ChevronRight className="ml-1 h-3.5 w-3.5 text-orange-300 transition-transform group-hover:translate-x-1" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
