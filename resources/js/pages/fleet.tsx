import { Link } from '@inertiajs/react';
import { ShieldCheck, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import AppHead from '@/components/app-head';
import type { FleetVehicle } from '@/types/carelink';

interface FleetProps {
    fleet: FleetVehicle[];
}

export default function Fleet({ fleet }: FleetProps) {
    const [activeTab, setActiveTab] = useState<'ALL' | 'WHEELCHAIR' | 'AMBULATORY' | 'TRANSIT_SHUTTLE'>('ALL');

    const filteredFleet = fleet.filter((item) => activeTab === 'ALL' || item.type === activeTab);

    return (
        <div className="bg-slate-50 min-h-screen py-8 px-4 sm:px-6 lg:px-12">
            <AppHead title="Fleet" />

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

                {/* Page Hero Header */}
                <div className="relative overflow-hidden rounded-3xl bg-[#004B87] p-8 sm:p-12 text-white shadow-2xl">
                    <div className="relative z-10 max-w-3xl space-y-4">
                        <h1 className="text-3xl font-black sm:text-4xl lg:text-5xl tracking-tight leading-tight">Our Modern NEMT Fleet</h1>
                        <p className="text-sm sm:text-base text-orange-100 leading-relaxed max-w-2xl">
                            Inspect our BraunAbility wheelchair hydraulic lift vans, multi-passenger transit shuttles, and climate-controlled ambulatory cruisers maintained to strict clinical safety protocols.
                        </p>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none bg-white p-4 rounded-2xl border border-slate-200">
                    {[
                        { id: 'ALL', label: 'All Vehicles' },
                        { id: 'WHEELCHAIR', label: 'Wheelchair Vans' },
                        { id: 'AMBULATORY', label: 'Ambulatory Sedans' },
                        { id: 'TRANSIT_SHUTTLE', label: 'Transit Shuttles' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as typeof activeTab)}
                            className={`whitespace-nowrap rounded-xl px-4 py-2 text-xs font-black transition-all ${
                                activeTab === tab.id
                                    ? 'bg-[#E64A19] text-white shadow-md shadow-orange-900/20'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Fleet Vehicle Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {filteredFleet.map((vehicle) => (
                        <div key={vehicle.id} className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-lg flex flex-col justify-between">
                            <div>
                                <div className="relative h-64 w-full bg-slate-900 overflow-hidden">
                                    <img src={vehicle.image} alt={vehicle.name} className="h-full w-full object-cover" />
                                    <span className="absolute top-4 left-4 rounded-full bg-[#E64A19] text-white px-3 py-1 text-[10px] font-black uppercase tracking-wider shadow">
                                        {vehicle.type.replace('_', ' ')}
                                    </span>
                                    <span className="absolute bottom-4 right-4 rounded-full bg-slate-900/80 backdrop-blur-md text-orange-300 px-3 py-1 text-xs font-bold border border-orange-400/30">
                                        Est. ${vehicle.hourly_rate_est}/hr
                                    </span>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900">{vehicle.name}</h3>
                                            <p className="text-xs text-[#E64A19] font-bold mt-0.5">Capacity: {vehicle.capacity}</p>
                                        </div>
                                    </div>

                                    <p className="text-xs text-slate-600 leading-relaxed">{vehicle.description}</p>

                                    <div className="space-y-2 pt-2 border-t border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Features & ADA Equipment</p>
                                        <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-700">
                                            {vehicle.features.map((f, i) => (
                                                <div key={i} className="flex items-center gap-1.5">
                                                    <CheckCircle2 className="h-4 w-4 text-[#E64A19] shrink-0" />
                                                    <span>{f}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2 pt-2 border-t border-slate-100">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Accessibility Specifications</p>
                                        <ul className="text-xs text-slate-600 list-disc list-inside space-y-1">
                                            {vehicle.accessibility_specs.map((spec, i) => (
                                                <li key={i}>{spec}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Clinical Safety Protocols Box */}
                <div className="rounded-3xl bg-slate-900 text-white p-8 border border-slate-800 shadow-xl space-y-6">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-8 w-8 text-[#E64A19] shrink-0" />
                        <div>
                            <h3 className="text-xl font-black">Carelink Clinical Safety Protocols</h3>
                            <p className="text-xs text-slate-300">Rigorous 21-point vehicle inspections and safety compliance.</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs text-slate-300">
                        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                            <div className="font-extrabold text-orange-400 mb-1">Q’Straint Floor Locks</div>
                            <p className="text-[11px] leading-relaxed">
                                Automatic 4-point wheelchair floor restraints rated to exceed Federal Motor Vehicle Safety Standards (FMVSS).
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                            <div className="font-extrabold text-orange-400 mb-1">Sanitization Protocols</div>
                            <p className="text-[11px] leading-relaxed">
                                Hospital-grade interior UV light and disinfectant wipe-down after every single passenger transit.
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700">
                            <div className="font-extrabold text-orange-400 mb-1">GPS & Telemetry</div>
                            <p className="text-[11px] leading-relaxed">
                                Real-time Bambi NEMT GPS tracking and speed monitoring for passenger peace of mind.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
