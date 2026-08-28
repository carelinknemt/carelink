import { useState, useEffect } from 'react';
import { useCms, cmsText } from '@/lib/cms';
import type { HeroSlide } from '@/lib/cms';

export default function Hero() {
    const cms = useCms();
    const slides = (cms.hero_slides?.slides ?? []) as HeroSlide[];
    const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

    useEffect(() => {
        if (slides.length === 0) {
            return;
        }

        const timer = setInterval(() => {
            setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
        }, 7000);

        return () => clearInterval(timer);
    }, [slides.length]);

    if (slides.length === 0) {
        return null;
    }

    const slide = slides[currentSlideIndex];

    return (
        <section className="relative flex h-[calc(100dvh-120px)] min-h-[460px] items-center overflow-hidden bg-slate-950 text-white sm:h-auto sm:min-h-[580px] lg:min-h-[640px]">
            {/* Background Image Carousel with Overlay */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                    key={slide.id}
                    src={slide.bg_image}
                    alt={slide.title}
                    className="h-full w-full object-cover object-center transition-all duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/75 to-slate-900/40" />
            </div>

            {/* Hero Content Area */}
            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pt-6 pb-8 sm:px-6 sm:pt-16 sm:pb-32 lg:px-12 lg:pb-36">
                <div className="max-w-3xl">
                    {/* Main Titles clipped in overflow-hidden mask frames */}
                    <div className="overflow-hidden py-1">
                        <h1
                            key={`title-${slide.id}`}
                            className="animate-hero-reveal block transform-gpu text-2xl leading-tight font-black tracking-tight text-cyan-400 min-[400px]:text-3xl sm:text-4xl lg:text-5xl"
                        >
                            {slide.title}
                        </h1>
                    </div>

                    <div className="overflow-hidden py-1">
                        <p
                            key={`highlight-${slide.id}`}
                            className="animate-hero-reveal-delay mt-1 block transform-gpu text-xl leading-tight font-extrabold tracking-tight text-white min-[400px]:text-2xl sm:text-3xl lg:text-4xl"
                        >
                            {slide.highlight_text}
                        </p>
                    </div>

                    <p className="mt-2 max-w-2xl text-xs leading-relaxed font-medium text-slate-300 min-[400px]:text-sm sm:mt-3 sm:text-base">
                        {cmsText(slide.subtitle)}
                    </p>
                </div>
            </div>

            {/* Vertical Slider Indicator Dots on Right */}
            <div className="absolute top-1/2 right-4 z-20 flex -translate-y-1/2 flex-col gap-3 sm:right-8">
                {slides.map((s, idx) => (
                    <button
                        key={s.id}
                        onClick={() => setCurrentSlideIndex(idx)}
                        className={`h-3 w-3 rounded-full transition-all duration-300 ${
                            currentSlideIndex === idx
                                ? 'scale-125 bg-[#E64A19] shadow-md ring-2 shadow-orange-500/50 ring-white'
                                : 'bg-white/40 hover:bg-white/80'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}
