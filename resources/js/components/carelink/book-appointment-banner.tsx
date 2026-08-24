export default function BookAppointmentBanner() {
    return (
        <div className="relative z-40 w-full drop-shadow-2xl">
            <div className="grid grid-cols-1 overflow-hidden rounded-2xl border border-white/20 bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] ring-1 ring-black/10 sm:rounded-3xl lg:grid-cols-12">
                {/* Left Dark Blue Welcome Banner */}
                <div className="animate-hero-reveal flex flex-col justify-center bg-[#004B87] p-5 text-white sm:p-7 lg:col-span-7 lg:p-9">
                    <h2 className="text-lg leading-snug font-bold sm:text-xl lg:text-2xl">
                        Welcome to{' '}
                        <span className="text-cyan-100">
                            Carelink Medical Transportation LLC.
                        </span>
                    </h2>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed font-normal text-cyan-100/75 sm:text-base">
                        Connecting patients across Humboldt, Del Norte, Trinity,
                        and Shasta counties with compassionate, punctual
                        wheelchair and group transit.
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium text-orange-100 sm:gap-3">
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] backdrop-blur-sm">
                            &bull; Curb-to-Curb Service
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-2.5 py-1 text-[11px] backdrop-blur-sm">
                            &bull; Bambi NEMT Integrated
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full border border-orange-400/30 bg-[#E64A19] px-2.5 py-1 text-[11px] font-extrabold text-white shadow-sm">
                            &bull; Dependable Dispatch
                        </span>
                    </div>
                </div>

                {/* Right White Ride Intake Graphic & Button Card */}
                <div className="flex flex-col items-center justify-center border-t border-slate-200 bg-slate-50 p-5 text-center sm:p-7 lg:col-span-5 lg:border-t-0 lg:border-l lg:p-9">
                    <div className="mb-1 flex items-center gap-1.5">
                        <h2 className="mb-2 flex items-center gap-2 text-lg font-extrabold text-[#004B87] sm:text-xl">
                            <span>Live GPS Dispatch</span>
                            <span className="rounded-md border border-[#E64A19]/20 bg-[#E64A19]/10 px-2 py-0.5 text-xs font-black text-[#E64A19] uppercase">
                                Active
                            </span>
                        </h2>
                    </div>

                    {/* Fast Riding SUV Vehicle Container with Motion Streaks */}
                    <div className="relative my-2 flex h-28 w-44 items-center justify-center overflow-hidden sm:h-28 sm:w-48">
                        {/* Speed Motion Lines */}
                        <div className="pointer-events-none absolute inset-0 z-0 flex flex-col justify-around py-2 opacity-80">
                            <div
                                className="animate-road-streak h-[2px] w-16 bg-gradient-to-r from-transparent via-orange-400 to-transparent"
                                style={{ animationDelay: '0.6s' }}
                            />
                            <div
                                className="animate-road-streak-fast h-[1.5px] w-20 bg-gradient-to-r from-transparent via-orange-500 to-transparent"
                                style={{ animationDelay: '0.92s' }}
                            />
                            <div
                                className="animate-road-streak h-[2px] w-12 bg-gradient-to-r from-transparent via-amber-400 to-transparent"
                                style={{ animationDelay: '0.16s' }}
                            />
                            <div
                                className="animate-road-streak-fast h-[2.5px] w-24 bg-gradient-to-r from-transparent via-[#E64A19]/30 to-transparent"
                                style={{ animationDelay: '0.86s' }}
                            />
                        </div>

                        {/* Fast Riding SUV Car Image */}
                        <div className="animate-fast-ride relative z-10 flex h-full w-full items-center justify-center">
                            <img
                                src="/images/tracking123.png"
                                alt="Fast transit SUV vehicle tracking"
                                className="h-full w-full object-contain drop-shadow-md filter"
                                referrerPolicy="no-referrer"
                            />
                        </div>

                        {/* Fast ground motion reflection line */}
                        <div className="absolute right-2 bottom-1.5 left-2 h-1 animate-pulse rounded-full bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
                    </div>
                </div>
            </div>
        </div>
    );
}
