import { useBookingFee, useCms, interpolateCmsText } from '@/lib/cms';
import type { BookingStep } from '@/lib/cms';

function StepCard({
    step,
    feePlaceholder,
}: {
    step: BookingStep;
    feePlaceholder: string;
}) {
    return (
        <div className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl backdrop-blur-sm">
            <span className="pointer-events-none absolute -top-3 right-3 text-7xl font-black text-white/5 select-none">
                {step.number}
            </span>

            <div>
                <span className="text-[10px] font-black tracking-widest text-orange-400 uppercase">
                    Step {step.number}
                </span>
                <h3 className="mt-1 text-lg font-black tracking-tight text-white">
                    {step.title}
                </h3>
                <p className="text-[11px] font-medium text-cyan-200/70">
                    {step.tagline}
                </p>
            </div>

            <ul className="mt-5 flex-1 space-y-3">
                {(step.points ?? []).map((point) => (
                    <li
                        key={point}
                        className="flex items-start gap-2.5 text-xs leading-relaxed text-slate-200/90"
                    >
                        <span className="mt-0.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-orange-400" />
                        <span>
                            {interpolateCmsText(point, { fee: feePlaceholder })}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function BookingSteps() {
    const cms = useCms();
    const fee = useBookingFee();
    const steps = (cms.booking_steps?.steps ?? []) as BookingStep[];

    if (steps.length === 0) {
        return null;
    }

    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#013a6b] via-[#004B87] to-[#013a6b] py-20 text-white">
            {/* Decorative glows */}
            <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-[#E64A19]/15 blur-3xl" />
            <div className="pointer-events-none absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
                {/* Header */}
                <div className="mb-16 text-center">
                    <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
                        Three Stops. One Smooth Ride.
                    </h2>
                    <p className="mx-auto mt-2 max-w-xl text-xs text-cyan-100/70 sm:text-sm">
                        From request to dispatch, a booking flow built on
                        predictability, transparency, and care.
                    </p>
                </div>

                <div className="relative hidden grid-cols-3 gap-10 lg:grid">
                    {steps.map((step) => (
                        <div
                            key={step.number}
                            className="relative flex flex-col pt-8"
                        >
                            <StepCard
                                step={step}
                                feePlaceholder={fee.dollars}
                            />
                        </div>
                    ))}
                </div>

                <div className="space-y-5 lg:hidden">
                    {steps.map((step) => (
                        <div key={step.number} className="relative flex gap-4">
                            <div className="flex-1">
                                <StepCard
                                    step={step}
                                    feePlaceholder={fee.dollars}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
