import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';
import BookAppointmentBanner from '@/components/carelink/book-appointment-banner';
import type { TransportService } from '@/types/carelink';

interface CommittedExcellenceProps {
    services: TransportService[];
    onSelectService: (service: TransportService) => void;
}

export default function CommittedExcellence({ services, onSelectService }: CommittedExcellenceProps) {
    const featuredServices = services.slice(0, 6);

    return (
        <section id="services" className="relative z-20 pt-6 pb-20 bg-slate-50 text-slate-900">
            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
                {/* Book Appointment Banner */}
                <div className="-mt-20 sm:-mt-28 lg:-mt-32 mb-12 sm:mb-16 relative z-30">
                    <BookAppointmentBanner />
                </div>

                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
                    <div>
                        <span className="text-xs font-black tracking-widest text-[#E64A19] uppercase">Reliable NEMT Care</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-[#004B87] tracking-tight mt-0.5">Our Core Services</h2>
                    </div>

                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 self-start sm:self-auto rounded-xl bg-[#E64A19] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-orange-900/20 transition-all hover:bg-[#d83f0e] active:scale-95"
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
                            className="group cursor-pointer overflow-hidden rounded-2xl bg-white shadow-md border border-slate-200/80 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-orange-300 flex flex-col"
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
                            <div className="flex flex-col flex-1 justify-between bg-[#004B87] p-4 text-white">
                                <div>
                                    <span className="text-[10px] font-black tracking-wider uppercase text-orange-300">
                                        {service.category === 'NON_MEDICAL' ? 'COMMUNITY' : service.category}
                                    </span>
                                    <h3 className="text-sm sm:text-base font-extrabold tracking-tight mt-0.5 text-white leading-snug">
                                        {service.title}
                                    </h3>
                                    <p className="mt-1.5 text-xs text-slate-200 leading-relaxed line-clamp-2">{service.short_description}</p>
                                </div>

                                <div className="mt-3.5 flex items-center text-xs font-bold text-orange-300 group-hover:text-orange-200 transition-colors">
                                    <span>View Details</span>
                                    <ChevronRight className="h-3.5 w-3.5 ml-1 transition-transform group-hover:translate-x-1 text-orange-300" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
