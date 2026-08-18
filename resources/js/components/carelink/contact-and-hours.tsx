import { MapPin, Clock } from 'lucide-react';
import { useState } from 'react';
import { useCms, useCompanyInfo } from '@/lib/cms';

interface DispatchDay {
    day: string;
    hours: string;
}

export default function ContactAndHours() {
    const cms = useCms();
    const company = useCompanyInfo();
    const dispatchDays = (cms.dispatch_hours?.days ?? []) as DispatchDay[];
    const [mapActive, setMapActive] = useState(false);

    return (
        <section
            id="contact"
            className="relative overflow-hidden border-t border-slate-200/20 py-16 transition-colors duration-500"
            style={{ backgroundColor: '#214587' }}
        >
            <div className="relative z-10 mx-auto max-w-7xl px-0 sm:px-6 lg:px-12">
                {/* Title */}
                <div className="mx-auto mb-12 max-w-2xl px-4 text-center sm:px-0">
                    <span className="text-xs font-black tracking-widest text-orange-300 uppercase">
                        Northern California Dispatch & HQ
                    </span>
                    <h2 className="mt-1 text-3xl font-black tracking-tight text-white sm:text-4xl">
                        Contact Carelink Medical Transportation
                    </h2>
                    <p className="mt-3 text-sm text-cyan-100/90">
                        Headquartered in Eureka, CA. Providing dependable NEMT
                        dispatch across Humboldt, Del Norte, Trinity, and Shasta
                        counties.
                    </p>
                </div>

                {/* Integrated Map & Working Hours Container */}
                <div className="relative flex w-full flex-col overflow-hidden rounded-none border-y border-slate-200/80 bg-white shadow-2xl sm:rounded-3xl sm:border lg:block">
                    <div className="relative flex w-full flex-col bg-slate-100 lg:min-h-[580px]">
                        {/* Map Section: Eureka HQ */}
                        <div
                            className="group/map relative h-[340px] w-full overflow-hidden bg-slate-200 sm:h-[400px] lg:absolute lg:inset-0 lg:h-full"
                            onMouseLeave={() => setMapActive(false)}
                        >
                            <iframe
                                title="Carelink Medical Transportation Eureka HQ Map"
                                src="https://maps.google.com/maps?q=3857+Walnut+Drive,+Eureka,+CA+95503&t=&z=14&ie=UTF8&iwloc=&output=embed"
                                className={`absolute inset-0 h-full w-full border-0 transition-all duration-300 ${
                                    mapActive
                                        ? 'pointer-events-auto scale-100'
                                        : 'pointer-events-none scale-[1.01] blur-[0.5px]'
                                }`}
                                loading="lazy"
                            />

                            {/* Click-to-activate overlay */}
                            {!mapActive && (
                                <div
                                    onClick={() => setMapActive(true)}
                                    className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-slate-900/10 transition-all duration-300 hover:bg-slate-900/20"
                                >
                                    <div className="flex scale-95 transform items-center gap-2 rounded-full border border-white/10 bg-slate-900/80 px-4 py-2.5 text-xs font-bold text-white shadow-lg backdrop-blur-md transition-all duration-300 group-hover/map:scale-100">
                                        <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                                        <span>Click to Interact with Map</span>
                                    </div>
                                </div>
                            )}

                            {/* Overlay Address Badge */}
                            <div className="absolute top-4 left-4 z-10 max-w-[280px] rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-xl backdrop-blur-md sm:max-w-xs">
                                <div className="flex items-center gap-1.5 text-xs font-black text-[#004B87]">
                                    <MapPin className="h-4 w-4 text-cyan-600" />
                                    <span>{company.name}</span>
                                </div>
                                <div className="mt-1 text-[11px] font-semibold text-slate-700">
                                    {company.address}
                                </div>
                                <div className="mt-1 text-[10px] font-bold text-cyan-700">
                                    Primary Region: Humboldt, Del Norte, Trinity
                                    & Shasta
                                </div>
                            </div>
                        </div>

                        {/* Working & Dispatch Hours Panel */}
                        <div className="relative z-20 flex flex-col overflow-y-auto border-t border-cyan-400/30 bg-[#004B87] p-6 text-white shadow-2xl lg:absolute lg:top-6 lg:right-6 lg:bottom-6 lg:w-[400px] lg:border lg:bg-[#004B87]/95 lg:backdrop-blur-md">
                            <div className="mb-3 border-b border-cyan-400/30 pb-3">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-cyan-300" />
                                    <h3 className="text-lg font-black text-white">
                                        NEMT Dispatch Hours
                                    </h3>
                                </div>
                                <p className="mt-1 text-[11px] text-cyan-100">
                                    Dependable hospital discharge & emergency
                                    ride dispatching.
                                </p>
                            </div>

                            {/* Days list */}
                            <div className="flex-1 space-y-2 overflow-y-auto pr-0.5 text-xs">
                                {dispatchDays.map((schedule) => (
                                    <div
                                        key={schedule.day}
                                        className="flex items-center justify-between rounded-xl border border-cyan-400/20 bg-slate-900/60 px-3.5 py-2"
                                    >
                                        <span className="w-24 font-bold text-white">
                                            {schedule.day}
                                        </span>
                                        <span className="text-[11px] text-cyan-200">
                                            {schedule.hours}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Contact Direct Box */}
                            <div className="mt-4 space-y-1.5 border-t border-cyan-400/30 pt-3 text-xs">
                                <div className="flex items-center justify-between text-cyan-100">
                                    <span>Dispatch Line:</span>
                                    <a
                                        href={`tel:${(company.dispatch_phone ?? company.phone ?? '').replace(/[^0-9+]/g, '')}`}
                                        className="font-bold text-white hover:underline"
                                    >
                                        {company.dispatch_phone ??
                                            company.phone}
                                    </a>
                                </div>
                                <div className="flex items-center justify-between text-cyan-100">
                                    <span>Email:</span>
                                    <a
                                        href={`mailto:${company.email}`}
                                        className="font-bold text-cyan-200 hover:underline"
                                    >
                                        {company.email}
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
