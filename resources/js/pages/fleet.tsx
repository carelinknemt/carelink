import { ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';
import AppHead from '@/components/app-head';
import type { FleetVehicle } from '@/types/carelink';

interface FleetProps {
    fleet: FleetVehicle[];
}

const FLEET_DESCRIPTION =
    'Explore CareLink\u2019s modern NEMT fleet: BraunAbility wheelchair hydraulic lift vans, multi-passenger transit shuttles, and climate-controlled ambulatory sedans maintained to strict clinical safety protocols.';

export default function Fleet({ fleet }: FleetProps) {
    const [activeTab, setActiveTab] = useState<
        'ALL' | 'WHEELCHAIR' | 'AMBULATORY' | 'TRANSIT_SHUTTLE'
    >('ALL');

    const filteredFleet = fleet.filter(
        (item) => activeTab === 'ALL' || item.type === activeTab,
    );

    return (
        <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-12">
            <AppHead
                title="Our Modern NEMT Fleet"
                description={FLEET_DESCRIPTION}
                keywords={[
                    'NEMT fleet',
                    'wheelchair vans',
                    'BraunAbility lift vans',
                    'ambulatory sedans',
                    'transit shuttles',
                    'ADA accessible vehicles',
                    'medical transport vehicles',
                ]}
                canonical="/fleet"
                type="article"
            />

            <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
                {/* Page Hero Header */}
                <div className="relative overflow-hidden rounded-3xl bg-[#004B87] p-8 text-white shadow-2xl sm:p-12">
                    <div className="relative z-10 max-w-3xl space-y-4">
                        <h1 className="text-3xl leading-tight font-black tracking-tight sm:text-4xl lg:text-5xl">
                            Our Modern NEMT Fleet
                        </h1>
                        <p className="max-w-2xl text-sm leading-relaxed text-orange-100 sm:text-base">
                            Inspect our BraunAbility wheelchair hydraulic lift
                            vans, multi-passenger transit shuttles, and
                            climate-controlled ambulatory cruisers maintained to
                            strict clinical safety protocols.
                        </p>
                    </div>
                </div>

                {/* Filter Bar */}
                <div className="flex scrollbar-none items-center gap-3 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-4 pb-2">
                    {[
                        { id: 'ALL', label: 'All Vehicles' },
                        { id: 'WHEELCHAIR', label: 'Wheelchair Vans' },
                        { id: 'AMBULATORY', label: 'Ambulatory Sedans' },
                        { id: 'TRANSIT_SHUTTLE', label: 'Transit Shuttles' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() =>
                                setActiveTab(tab.id as typeof activeTab)
                            }
                            className={`rounded-xl px-4 py-2 text-xs font-black whitespace-nowrap transition-all ${
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
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                    {filteredFleet.map((vehicle) => (
                        <div
                            key={vehicle.id}
                            className="flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg"
                        >
                            <div>
                                <div className="relative h-64 w-full overflow-hidden bg-slate-900">
                                    <img
                                        src={vehicle.image}
                                        alt={vehicle.name}
                                        className="h-full w-full object-cover"
                                    />
                                    <span className="absolute top-4 left-4 rounded-full bg-[#E64A19] px-3 py-1 text-[10px] font-black tracking-wider text-white uppercase shadow">
                                        {vehicle.type.replace('_', ' ')}
                                    </span>
                                    <span className="absolute right-4 bottom-4 rounded-full border border-orange-400/30 bg-slate-900/80 px-3 py-1 text-xs font-bold text-orange-300 backdrop-blur-md">
                                        Est. ${vehicle.hourly_rate_est}/hr
                                    </span>
                                </div>

                                <div className="space-y-4 p-6">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900">
                                                {vehicle.name}
                                            </h3>
                                            <p className="mt-0.5 text-xs font-bold text-[#E64A19]">
                                                Capacity: {vehicle.capacity}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-xs leading-relaxed text-slate-600">
                                        {vehicle.description}
                                    </p>

                                    <div className="space-y-2 border-t border-slate-100 pt-2">
                                        <p className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
                                            Features & ADA Equipment
                                        </p>
                                        <div className="grid grid-cols-2 gap-2 text-xs font-medium text-slate-700">
                                            {vehicle.features.map((f, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-1.5"
                                                >
                                                    <CheckCircle2 className="h-4 w-4 shrink-0 text-[#E64A19]" />
                                                    <span>{f}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2 border-t border-slate-100 pt-2">
                                        <p className="text-[10px] font-black tracking-wider text-slate-400 uppercase">
                                            Accessibility Specifications
                                        </p>
                                        <ul className="list-inside list-disc space-y-1 text-xs text-slate-600">
                                            {vehicle.accessibility_specs.map(
                                                (spec, i) => (
                                                    <li key={i}>{spec}</li>
                                                ),
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Clinical Safety Protocols Box */}
                <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900 p-8 text-white shadow-xl">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="h-8 w-8 shrink-0 text-[#E64A19]" />
                        <div>
                            <h3 className="text-xl font-black">
                                Carelink Clinical Safety Protocols
                            </h3>
                            <p className="text-xs text-slate-300">
                                Rigorous 21-point vehicle inspections and safety
                                compliance.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 text-xs text-slate-300 sm:grid-cols-3">
                        <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
                            <div className="mb-1 font-extrabold text-orange-400">
                                Q’Straint Floor Locks
                            </div>
                            <p className="text-[11px] leading-relaxed">
                                Automatic 4-point wheelchair floor restraints
                                rated to exceed Federal Motor Vehicle Safety
                                Standards (FMVSS).
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
                            <div className="mb-1 font-extrabold text-orange-400">
                                Sanitization Protocols
                            </div>
                            <p className="text-[11px] leading-relaxed">
                                Hospital-grade interior UV light and
                                disinfectant wipe-down after every single
                                passenger transit.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-slate-700 bg-slate-800/80 p-4">
                            <div className="mb-1 font-extrabold text-orange-400">
                                GPS & Telemetry
                            </div>
                            <p className="text-[11px] leading-relaxed">
                                Real-time Bambi NEMT GPS tracking and speed
                                monitoring for passenger peace of mind.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
