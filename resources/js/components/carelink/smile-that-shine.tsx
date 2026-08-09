import { Star, Quote } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { PATIENT_REVIEWS } from '@/data/carelink';

export default function SmileThatShine() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const pausedRef = useRef(false);

    useEffect(() => {
        const interval = setInterval(() => {
            const el = scrollRef.current;

            if (!el || pausedRef.current) {
                return;
            }

            const cardWidth = window.innerWidth < 640 ? 280 : 350;
            const step = cardWidth + 24;
            const maxScroll = el.scrollWidth - el.clientWidth;

            if (el.scrollLeft >= maxScroll - 10) {
                el.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                el.scrollBy({ left: step, behavior: 'smooth' });
            }
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <section className="py-16 bg-slate-50 border-t border-b border-slate-200/80 overflow-hidden">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
                {/* Title & Google Badge Header */}
                <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                    <div>
                        <span className="text-xs font-black tracking-widest text-[#E64A19] uppercase">Patient & Clinical Testimonials</span>
                        <h2 className="text-2xl sm:text-3xl font-black text-[#004B87] tracking-tight mt-0.5">Google Patient Reviews</h2>
                        <p className="mt-1 text-xs text-slate-500 max-w-xl">
                            See what our patients and regional healthcare case managers say about Carelink’s safe NEMT services.
                        </p>
                    </div>

                    {/* Google Star Rating Summary Widget */}
                    <div className="hidden md:flex items-center gap-4 bg-white p-4 rounded-2xl border border-orange-200/60 shadow-xs shrink-0">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-50 text-xl font-black select-none border border-orange-200/40">
                            <span className="text-[#E64A19]">G</span>
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="text-lg font-black text-slate-900 leading-none">4.9</span>
                                <div className="flex items-center text-orange-500">
                                    <Star className="h-4 w-4 fill-orange-400 text-orange-500" />
                                    <Star className="h-4 w-4 fill-orange-400 text-orange-500" />
                                    <Star className="h-4 w-4 fill-orange-400 text-orange-500" />
                                    <Star className="h-4 w-4 fill-orange-400 text-orange-500" />
                                    <Star className="h-4 w-4 fill-orange-400 text-orange-500 opacity-90" />
                                </div>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium mt-0.5">Based on 11+ reviews on Google</p>
                        </div>
                    </div>
                </div>

                {/* Scrollable Slider Container */}
                <div className="relative w-full overflow-hidden py-2">
                    <div
                        ref={scrollRef}
                        onMouseEnter={() => {
                            pausedRef.current = true;
                        }}
                        onMouseLeave={() => {
                            pausedRef.current = false;
                        }}
                        className="flex gap-6 overflow-x-auto scroll-smooth py-4 px-1 no-scrollbar scroll-snap-x [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                    >
                        {PATIENT_REVIEWS.map((review) => (
                            <div
                                key={review.id}
                                className="relative w-[280px] sm:w-[350px] shrink-0 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:border-slate-300 scroll-snap-align-start"
                            >
                                <div>
                                    {/* Stars and Date Row */}
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-0.5 text-orange-500">
                                            {[...Array(review.rating)].map((_, i) => (
                                                <Star key={i} className="h-4 w-4 fill-orange-400 text-orange-500" />
                                            ))}
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-medium">{review.date}</span>
                                    </div>

                                    {/* Review Text */}
                                    <div className="relative mb-5 text-slate-800 leading-relaxed text-sm sm:text-base font-medium">
                                        <Quote className="absolute -top-2.5 -left-1 h-7 w-7 text-slate-100 -z-0 opacity-80" />
                                        <p className="relative z-10">{review.text}</p>
                                    </div>
                                </div>

                                {/* Author & Source Row */}
                                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                                    <div className="flex items-center gap-3">
                                        <div className="h-9 w-9 shrink-0 rounded-full overflow-hidden shadow-inner border border-slate-100/40">
                                            {review.avatar ? (
                                                <img src={review.avatar} alt={review.author} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                                            ) : (
                                                <div className={`flex h-full w-full items-center justify-center font-bold text-xs ${review.avatarBg}`}>
                                                    {review.initials}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-extrabold text-slate-900 leading-none">{review.author}</h4>
                                            <span className="text-[10px] text-slate-500 font-medium mt-0.5 block">{review.role}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
