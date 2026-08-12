import { Banknote, Car, CreditCard, Flag, Headset, MapPin, Radar, Receipt, Repeat, RotateCcw, Route, ShieldCheck } from 'lucide-react';

interface BookingStep {
    number: number;
    title: string;
    tagline: string;
    icon: typeof MapPin;
    points: { icon: typeof MapPin; text: string }[];
}
const BOOKING_STEPS: BookingStep[] = [
    {
        number: 1,
        title: 'Request Pickup',
        tagline: 'Tell us where, when, and who.',
        icon: MapPin,
        points: [
            { icon: Repeat, text: 'Round-trip by default; return leg removable anytime.' },
            { icon: Car, text: 'Wheelchair van or sedan — matched to mobility needs.' },
            { icon: CreditCard, text: 'Passenger, payer & institutional billing details up front.' },
        ],
    },
    {
        number: 2,
        title: 'Confirm',
        tagline: 'We lock the slot before you pay.',
        icon: ShieldCheck,
        points: [
            { icon: Radar, text: 'Live availability check: available, full, or uncertain.' },
            { icon: Headset, text: 'Uncertain? Dispatch confirms manually — never blocked.' },
            { icon: Banknote, text: '$30 fee locks the ride; waived & invoiced for B2B clients.' },
        ],
    },
    {
        number: 3,
        title: 'Complete the Ride',
        tagline: 'Ride out. Pay for what was driven.',
        icon: Flag,
        points: [
            { icon: Receipt, text: 'Final charge: base fare + actual billable mileage.' },
            { icon: Route, text: 'Only the $30 fee up front — the ride is billed after.' },
            { icon: RotateCcw, text: 'Cancel 24+ hrs: full refund · later: $30 · dispatch cancels: auto-refund.' },
        ],
    },
];

function StepMarker({ step }: { step: BookingStep }) {
    const Icon = step.icon;

    return (
        <div className="relative flex h-10 w-10 lg:h-16 lg:w-16 rotate-45 items-center justify-center rounded-lg lg:rounded-2xl bg-gradient-to-br from-[#E64A19] to-[#b83710] shadow-lg shadow-orange-950/50 ring-2 lg:ring-4 ring-orange-400/20">
            <div className="-rotate-45">
                <Icon className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
            </div>
        </div>
    );
}

function StepCard({ step }: { step: BookingStep }) {
    return (
        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm shadow-xl">
            <span className="pointer-events-none absolute -top-3 right-3 text-7xl font-black text-white/5 select-none">{step.number}</span>

            <div>
                <span className="text-[10px] font-black tracking-widest text-orange-400 uppercase">Step {step.number}</span>
                <h3 className="mt-1 text-lg font-black text-white tracking-tight">{step.title}</h3>
                <p className="text-[11px] text-cyan-200/70 font-medium">{step.tagline}</p>
            </div>

            <ul className="mt-5 flex-1 space-y-3">
                {step.points.map((point) => {
                    const PointIcon = point.icon;

                    return (
                        <li key={point.text} className="flex items-start gap-2.5 text-xs text-slate-200/90 leading-relaxed">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-orange-400/15 text-orange-400 border border-orange-400/20">
                                <PointIcon className="h-3.5 w-3.5" />
                            </span>
                            <span>{point.text}</span>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default function BookingSteps() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#013a6b] via-[#004B87] to-[#013a6b] py-20 text-white">
            {/* Decorative glows */}
            <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#E64A19]/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
                {/* Header */}
                <div className="mb-16 text-center">
                    <h2 className="text-3xl sm:text-4xl font-black tracking-tight">Three Stops. One Smooth Ride.</h2>
                    <p className="mx-auto mt-2 text-xs sm:text-sm text-cyan-100/70 max-w-xl">
                        From request to dispatch, a booking flow built on predictability, transparency, and care.
                    </p>
                </div>

                {/* Desktop: horizontal route */}
                <div className="relative hidden lg:grid grid-cols-3 gap-10">
                    <span className="route-rail animate-route-rail absolute top-0 right-[16.5%] left-[16.5%] h-1 rounded-full opacity-70" />
                    {BOOKING_STEPS.map((step) => (
                        <div key={step.number} className="relative flex flex-col pt-20">
                            <div className="absolute top-0 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
                                <StepMarker step={step} />
                            </div>
                            <StepCard step={step} />
                        </div>
                    ))}
                </div>

                {/* Mobile/Tablet: vertical route */}
                <div className="lg:hidden space-y-10">
                    {BOOKING_STEPS.map((step, i) => (
                        <div key={step.number} className="relative flex gap-4">
                            <div className="flex shrink-0 flex-col items-center">
                                <StepMarker step={step} />
                                {i < BOOKING_STEPS.length - 1 && (
                                    <span className="route-rail-vertical animate-route-rail-vertical my-2 w-1 flex-1 rounded-full opacity-70" />
                                )}
                            </div>
                            <div className="flex-1">
                                <StepCard step={step} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
