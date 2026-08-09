import { MapPin, Clock } from 'lucide-react';
import { useState } from 'react';
import { COMPANY_INFO, DISPATCH_HOURS } from '@/data/carelink';

export default function ContactAndHours() {
    const [mapActive, setMapActive] = useState(false);

    return (
        <section
            id="contact"
            className="py-16 border-t border-slate-200/20 overflow-hidden relative transition-colors duration-500"
            style={{ backgroundColor: '#214587' }}
        >
            <div className="mx-auto max-w-7xl px-0 sm:px-6 lg:px-12 relative z-10">
                {/* Title */}
                <div className="text-center max-w-2xl mx-auto mb-12 px-4 sm:px-0">
                    <span className="text-xs font-black tracking-widest text-orange-300 uppercase">Northern California Dispatch & HQ</span>
                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mt-1">Contact Carelink Medical Transportation</h2>
                    <p className="mt-3 text-sm text-cyan-100/90">
                        Headquartered in Eureka, CA. Providing dependable NEMT dispatch across Humboldt, Del Norte, Trinity, and Shasta counties.
                    </p>
                </div>

                {/* Integrated Map & Working Hours Container */}
                <div className="relative overflow-hidden rounded-none sm:rounded-3xl bg-white border-y sm:border border-slate-200/80 shadow-2xl flex flex-col lg:block w-full">
                    <div className="relative w-full bg-slate-100 flex flex-col lg:min-h-[580px]">
                        {/* Map Section: Eureka HQ */}
                        <div
                            className="relative h-[340px] sm:h-[400px] lg:absolute lg:inset-0 lg:h-full w-full overflow-hidden bg-slate-200 group/map"
                            onMouseLeave={() => setMapActive(false)}
                        >
                            <iframe
                                title="Carelink Medical Transportation Eureka HQ Map"
                                src="https://maps.google.com/maps?q=3857+Walnut+Drive,+Eureka,+CA+95503&t=&z=14&ie=UTF8&iwloc=&output=embed"
                                className={`absolute inset-0 h-full w-full border-0 transition-all duration-300 ${
                                    mapActive ? 'pointer-events-auto scale-100' : 'pointer-events-none scale-[1.01] blur-[0.5px]'
                                }`}
                                loading="lazy"
                            />

                            {/* Click-to-activate overlay */}
                            {!mapActive && (
                                <div
                                    onClick={() => setMapActive(true)}
                                    className="absolute inset-0 bg-slate-900/10 hover:bg-slate-900/20 cursor-pointer flex items-center justify-center transition-all duration-300 z-10"
                                >
                                    <div className="bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-lg border border-white/10 flex items-center gap-2 transform transition-all duration-300 scale-95 group-hover/map:scale-100">
                                        <MapPin className="h-3.5 w-3.5 text-cyan-400" />
                                        <span>Click to Interact with Map</span>
                                    </div>
                                </div>
                            )}

                            {/* Overlay Address Badge */}
                            <div className="absolute top-4 left-4 z-10 max-w-[280px] sm:max-w-xs rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur-md border border-slate-200">
                                <div className="font-black text-xs text-[#004B87] flex items-center gap-1.5">
                                    <MapPin className="h-4 w-4 text-cyan-600" />
                                    <span>{COMPANY_INFO.name}</span>
                                </div>
                                <div className="text-[11px] text-slate-700 mt-1 font-semibold">{COMPANY_INFO.address}</div>
                                <div className="text-[10px] text-cyan-700 font-bold mt-1">Primary Region: Humboldt, Del Norte, Trinity & Shasta</div>
                            </div>
                        </div>

                        {/* Working & Dispatch Hours Panel */}
                        <div className="relative lg:absolute lg:top-6 lg:right-6 lg:bottom-6 lg:w-[400px] z-20 flex flex-col bg-[#004B87] lg:bg-[#004B87]/95 lg:backdrop-blur-md p-6 text-white shadow-2xl border-t lg:border border-cyan-400/30 overflow-y-auto">
                            <div className="mb-3 pb-3 border-b border-cyan-400/30">
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-cyan-300" />
                                    <h3 className="text-lg font-black text-white">NEMT Dispatch Hours</h3>
                                </div>
                                <p className="text-[11px] text-cyan-100 mt-1">Dependable hospital discharge & emergency ride dispatching.</p>
                            </div>

                            {/* Days list */}
                            <div className="flex-1 space-y-2 text-xs overflow-y-auto pr-0.5">
                                {DISPATCH_HOURS.map((schedule) => (
                                    <div
                                        key={schedule.day}
                                        className="flex items-center justify-between rounded-xl bg-slate-900/60 px-3.5 py-2 border border-cyan-400/20"
                                    >
                                        <span className="font-bold text-white w-24">{schedule.day}</span>
                                        <span className="text-cyan-200 text-[11px]">{schedule.hours}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Contact Direct Box */}
                            <div className="mt-4 pt-3 border-t border-cyan-400/30 text-xs space-y-1.5">
                                <div className="flex items-center justify-between text-cyan-100">
                                    <span>Dispatch Line:</span>
                                    <a href={`tel:${COMPANY_INFO.dispatchPhone}`} className="font-bold text-white hover:underline">
                                        {COMPANY_INFO.dispatchPhone}
                                    </a>
                                </div>
                                <div className="flex items-center justify-between text-cyan-100">
                                    <span>Email:</span>
                                    <a href={`mailto:${COMPANY_INFO.email}`} className="font-bold text-cyan-200 hover:underline">
                                        {COMPANY_INFO.email}
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
