import { Link } from '@inertiajs/react';
import { CheckCircle2, ArrowLeft } from 'lucide-react';
import AppHead from '@/components/app-head';
import type { TransportService } from '@/types/carelink';

interface ServicesProps {
    services: TransportService[];
}

export default function Services({ services }: ServicesProps) {
    return (
        <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-12">
            <AppHead title="Services" />

            <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
                {/* Navigation Back Button */}
                <div>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:text-[#004B87] hover:bg-slate-100 transition-all border border-slate-200 shadow-sm hover:shadow"
                    >
                        <ArrowLeft className="h-4 w-4 text-[#E64A19]" />
                        <span>Back to Overview</span>
                    </Link>
                </div>

                {/* Header Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-[#004B87] p-8 sm:p-12 text-white shadow-2xl">
                    <div className="relative z-10 max-w-3xl space-y-4">
                        <h1 className="text-3xl font-black sm:text-4xl lg:text-5xl tracking-tight leading-tight">
                            Medical & Non-Medical Transport Services
                        </h1>
                        <p className="text-sm sm:text-base text-orange-100 leading-relaxed max-w-2xl">
                            Curb-to-curb wheelchair vans, group transit shuttles, and ambulatory sedans serving Humboldt, Del Norte, Trinity, and Shasta counties.
                        </p>
                    </div>
                </div>

                {/* NEMT Service Banner Image */}
                <div className="w-full overflow-hidden rounded-3xl shadow-lg">
                    <img
                        src="/images/non-emergency-medical-transportation.png"
                        alt="Non-Emergency Medical Transportation Services"
                        className="w-full h-auto max-h-[480px] object-cover rounded-3xl"
                        referrerPolicy="no-referrer"
                    />
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="group flex flex-col justify-between rounded-3xl bg-white border border-slate-200 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
                        >
                            <div>
                                {/* Card Image */}
                                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                                    <img
                                        src={service.image}
                                        alt={service.title}
                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                                    <span className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-[10px] font-black text-[#004B87] shadow-sm uppercase tracking-wider">
                                        {service.category.replace('_', ' ')}
                                    </span>
                                </div>

                                {/* Card Content */}
                                <div className="p-6 space-y-4">
                                    <h3 className="text-xl font-black text-slate-900 group-hover:text-[#004B87] transition-colors">
                                        {service.title}
                                    </h3>

                                    <p className="text-xs text-slate-600 leading-relaxed">{service.full_description}</p>

                                    {/* Key Benefits List */}
                                    {service.benefits.length > 0 && (
                                        <div className="pt-2 border-t border-slate-100 space-y-2">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Service Highlights</p>
                                            <ul className="grid grid-cols-1 gap-1.5 text-xs text-slate-700 font-medium">
                                                {service.benefits.map((benefit, idx) => (
                                                    <li key={idx} className="flex items-start gap-2">
                                                        <CheckCircle2 className="h-4 w-4 shrink-0 text-[#E64A19] mt-0.5" />
                                                        <span>{benefit}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dedicated Portals Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="rounded-3xl bg-white p-8 border border-slate-200 shadow-md">
                        <h3 className="text-xl font-black text-[#004B87] mb-2">Dedicated Medical Transportation</h3>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">
                            Designed specifically for recurring clinical treatments like dialysis, radiation therapy, physical rehab, and post-surgical hospital discharges. Includes full curb-to-curb escort and NEMT live tracking.
                        </p>
                    </div>

                    <div className="rounded-3xl bg-white p-8 border border-slate-200 shadow-md">
                        <h3 className="text-xl font-black text-[#004B87] mb-2">Non-Medical & Community Transport</h3>
                        <p className="text-xs text-slate-600 leading-relaxed mb-4">
                            Providing dignified, reliable rides for seniors and disabled individuals attending family gatherings, adult daycare centers, grocery errands, and social events across Humboldt and Shasta counties.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
