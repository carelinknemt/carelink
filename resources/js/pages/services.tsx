import { CheckCircle2 } from 'lucide-react';
import AppHead from '@/components/app-head';
import type { TransportService } from '@/types/carelink';

interface ServicesProps {
    services: TransportService[];
}

const SERVICES_DESCRIPTION =
    'Curb-to-curb wheelchair vans, ambulatory sedans, and group transit shuttles for dialysis, hospital discharges, and senior transport across Humboldt, Del Norte, Trinity, and Shasta counties. Book with CareLink NEMT today.';

export default function Services({ services }: ServicesProps) {
    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-12">
            <AppHead
                title="Medical & Non-Medical Transport Services"
                description={SERVICES_DESCRIPTION}
                keywords={[
                    'NEMT services',
                    'wheelchair van transport',
                    'dialysis transportation service',
                    'hospital discharge transportation',
                    'senior medical transport',
                    'ambulatory sedan service',
                    'group transit shuttle',
                    'medical transportation Humboldt County',
                ]}
                canonical="/services"
                jsonLd={{
                    '@context': 'https://schema.org',
                    '@type': 'ItemList',
                    name: 'CareLink Medical & Non-Medical Transport Services',
                    description: SERVICES_DESCRIPTION,
                    itemListElement: services.map((service, index) => ({
                        '@type': 'ListItem',
                        position: index + 1,
                        name: service.title,
                        description: service.short_description,
                    })),
                }}
            />

            <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
                {/* Header Banner */}
                <div className="relative overflow-hidden rounded-3xl bg-[#004B87] p-8 text-white shadow-2xl sm:p-12">
                    <div className="relative z-10 max-w-3xl space-y-4">
                        <h1 className="text-3xl leading-tight font-black tracking-tight sm:text-4xl lg:text-5xl">
                            Medical & Non-Medical Transport Services
                        </h1>
                        <p className="max-w-2xl text-sm leading-relaxed text-orange-100 sm:text-base">
                            Curb-to-curb wheelchair vans, group transit
                            shuttles, and ambulatory sedans serving Humboldt,
                            Del Norte, Trinity, and Shasta counties.
                        </p>
                    </div>
                </div>

                {/* NEMT Service Banner Image */}
                <div className="w-full overflow-hidden rounded-3xl shadow-lg">
                    <img
                        src="/images/non-emergency-medical-transportation.png"
                        alt="Non-Emergency Medical Transportation Services"
                        className="h-auto max-h-[480px] w-full rounded-3xl object-cover"
                        referrerPolicy="no-referrer"
                    />
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {services.map((service) => (
                        <div
                            key={service.id}
                            className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md transition-all duration-300 hover:shadow-2xl"
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

                                    <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-black tracking-wider text-[#004B87] uppercase shadow-sm backdrop-blur-md">
                                        {service.category.replace('_', ' ')}
                                    </span>
                                </div>

                                {/* Card Content */}
                                <div className="space-y-4 p-6">
                                    <h3 className="text-xl font-black text-slate-900 transition-colors group-hover:text-[#004B87]">
                                        {service.title}
                                    </h3>

                                    <p className="text-xs leading-relaxed text-slate-600">
                                        {service.full_description}
                                    </p>

                                    {/* Key Benefits List */}
                                    {service.benefits.length > 0 && (
                                        <div className="space-y-2 border-t border-slate-100 pt-2">
                                            <p className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
                                                Service Highlights
                                            </p>
                                            <ul className="grid grid-cols-1 gap-1.5 text-xs font-medium text-slate-700">
                                                {service.benefits.map(
                                                    (benefit, idx) => (
                                                        <li
                                                            key={idx}
                                                            className="flex items-start gap-2"
                                                        >
                                                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#E64A19]" />
                                                            <span>
                                                                {benefit}
                                                            </span>
                                                        </li>
                                                    ),
                                                )}
                                            </ul>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Dedicated Portals Section */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-md">
                        <h3 className="mb-2 text-xl font-black text-[#004B87]">
                            Dedicated Medical Transportation
                        </h3>
                        <p className="mb-4 text-xs leading-relaxed text-slate-600">
                            Designed specifically for recurring clinical
                            treatments like dialysis, radiation therapy,
                            physical rehab, and post-surgical hospital
                            discharges. Includes full curb-to-curb escort and
                            NEMT live tracking.
                        </p>
                    </div>

                    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-md">
                        <h3 className="mb-2 text-xl font-black text-[#004B87]">
                            Non-Medical & Community Transport
                        </h3>
                        <p className="mb-4 text-xs leading-relaxed text-slate-600">
                            Providing dignified, reliable rides for seniors and
                            disabled individuals attending family gatherings,
                            adult daycare centers, grocery errands, and social
                            events across Humboldt and Shasta counties.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
