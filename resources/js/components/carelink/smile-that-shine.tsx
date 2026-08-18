import Autoplay from 'embla-carousel-autoplay';
import { ArrowLeft, ArrowRight, BadgeCheck, Quote, Star } from 'lucide-react';
import { useSyncExternalStore, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel';
import type { CarouselApi } from '@/components/ui/carousel';
import { useCms } from '@/lib/cms';
import type { PatientReview } from '@/lib/cms';
import { cn } from '@/lib/utils';

function useSelectedSnap(api: CarouselApi | undefined): number {
    return useSyncExternalStore(
        (onStoreChange) => {
            if (!api) {
                return () => {};
            }

            api.on('select', onStoreChange);
            api.on('reInit', onStoreChange);

            return () => {
                api.off('select', onStoreChange);
                api.off('reInit', onStoreChange);
            };
        },
        () => api?.selectedScrollSnap() ?? 0,
    );
}

export default function SmileThatShine() {
    const cms = useCms();
    const reviews = (cms.patient_reviews?.reviews ?? []) as PatientReview[];
    const ratingStats = cms.google_rating_stats ?? {};
    const [api, setApi] = useState<CarouselApi>();
    const [autoplay] = useState(() =>
        Autoplay({
            delay: 2600,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
        }),
    );

    const current = useSelectedSnap(api);
    const count = api?.scrollSnapList().length ?? 0;

    const scrollPrev = () => api?.scrollPrev();
    const scrollNext = () => api?.scrollNext();

    return (
        <section className="overflow-hidden border-y border-slate-200/80 bg-slate-50 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
                {/* Title & Google Badge Header */}
                <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <span className="text-xs font-black tracking-widest text-[#E64A19] uppercase">
                            Patient & Clinical Testimonials
                        </span>
                        <h2 className="mt-0.5 text-2xl font-black tracking-tight text-[#004B87] sm:text-3xl">
                            Google Patient Reviews
                        </h2>
                        <p className="mt-1 max-w-xl text-xs text-slate-500">
                            See what our patients and regional healthcare case
                            managers say about Carelink’s safe NEMT services.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                        {/* Google Star Rating Summary Widget */}
                        <div className="hidden items-center gap-4 rounded-2xl border border-orange-200/60 bg-white p-4 shadow-xs md:flex">
                            <img
                                src="/google.svg"
                                alt="Google"
                                className="h-11 w-11 shrink-0 object-contain"
                            />
                            <div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-lg leading-none font-black text-slate-900">
                                        {Number(
                                            ratingStats.rating ?? 4.9,
                                        ).toFixed(1)}
                                    </span>
                                    <div className="flex items-center text-orange-500">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`h-4 w-4 ${i < Math.round(Number(ratingStats.rating ?? 4.9)) ? 'fill-orange-400 text-orange-500' : 'fill-orange-400 text-orange-500 opacity-40'}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <p className="mt-0.5 text-[11px] font-medium text-slate-500">
                                    {ratingStats.badge_label ??
                                        `Based on ${Number(ratingStats.review_count ?? 11)}+ reviews on Google`}
                                </p>
                            </div>
                        </div>

                        {/* Carousel Controls */}
                        <div className="flex items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={scrollPrev}
                                aria-label="Previous reviews"
                                className="h-10 w-10 rounded-full border-slate-200 bg-white text-[#004B87] transition-colors hover:border-[#004B87] hover:bg-[#004B87] hover:text-white"
                            >
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={scrollNext}
                                aria-label="Next reviews"
                                className="h-10 w-10 rounded-full border-slate-200 bg-white text-[#004B87] transition-colors hover:border-[#004B87] hover:bg-[#004B87] hover:text-white"
                            >
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Auto-scrolling, wrapping carousel */}
                <Carousel
                    opts={{ align: 'start', loop: true }}
                    plugins={[autoplay]}
                    setApi={setApi}
                    aria-label="Patient reviews"
                    className="py-2"
                >
                    <CarouselContent className="-ml-6">
                        {reviews.map((review, index) => (
                            <CarouselItem
                                key={`${review.author}-${index}`}
                                className="basis-full pl-6 sm:basis-1/2 lg:basis-1/3"
                            >
                                <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#E64A19]/40 hover:shadow-xl">
                                    {/* Top gradient accent */}
                                    <span className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#004B87] via-[#06b6d4] to-[#E64A19] opacity-60 transition-opacity duration-300 group-hover:opacity-100" />

                                    {/* Stars & Date */}
                                    <div className="flex items-center justify-between gap-3">
                                        <div
                                            role="img"
                                            className="flex items-center gap-0.5 text-amber-400"
                                            aria-label={`${review.rating} out of 5 stars`}
                                        >
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={cn(
                                                        'h-4 w-4',
                                                        i < review.rating
                                                            ? 'fill-amber-400 text-amber-400'
                                                            : 'fill-slate-200 text-slate-200',
                                                    )}
                                                />
                                            ))}
                                        </div>
                                        <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                                            {review.date}
                                        </span>
                                    </div>

                                    {/* Review Text */}
                                    <div className="relative mt-5 flex-1">
                                        <Quote className="absolute -top-2 -left-2 h-9 w-9 text-[#E64A19]/10" />
                                        <p className="relative text-sm leading-relaxed text-slate-700 sm:text-[15px]">
                                            “{review.text}”
                                        </p>
                                    </div>

                                    {/* Author & Source Row */}
                                    <div className="mt-6 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-[#004B87]/10">
                                                {review.avatar ? (
                                                    <img
                                                        src={review.avatar}
                                                        alt={review.author}
                                                        className="h-full w-full object-cover"
                                                        referrerPolicy="no-referrer"
                                                    />
                                                ) : (
                                                    <div
                                                        className={`flex h-full w-full items-center justify-center text-xs font-bold ${review.avatar_bg}`}
                                                    >
                                                        {review.initials}
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-sm leading-tight font-bold text-slate-900">
                                                    {review.author}
                                                </h4>
                                                <p className="mt-0.5 flex items-center gap-1 text-[11px] font-medium text-slate-500">
                                                    <BadgeCheck className="h-3.5 w-3.5 text-emerald-500" />
                                                    {review.role ??
                                                        'Verified Google review'}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Google source badge */}
                                        <div
                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm"
                                            title="Posted on Google"
                                        >
                                            <img
                                                src="/google.svg"
                                                alt="Google"
                                                className="h-5 w-5 object-contain"
                                            />
                                        </div>
                                    </div>
                                </article>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>

                {/* Slide Dots */}
                {count > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-2">
                        {Array.from({ length: count }).map((_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => api?.scrollTo(i)}
                                aria-label={`Go to review ${i + 1}`}
                                aria-current={i === current ? 'true' : 'false'}
                                className={cn(
                                    'h-2 rounded-full transition-all duration-300',
                                    i === current
                                        ? 'w-6 bg-[#E64A19]'
                                        : 'w-2 bg-slate-300 hover:bg-slate-400',
                                )}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
