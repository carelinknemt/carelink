import gsap from 'gsap';
import { ChevronRight, Ambulance } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { HERO_SLIDES } from '../data/carelinkData';

interface HeroProps {
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenBooking }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const highlightRef = useRef<HTMLParagraphElement>(null);

  // Auto-slide carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlideIndex((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  // GSAP animation on slide change
  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        gsap.fromTo(
          titleRef.current,
          { yPercent: 110 },
          { yPercent: 0, duration: 0.9, ease: 'power4.out' }
        );
      }

      if (highlightRef.current) {
        gsap.fromTo(
          highlightRef.current,
          { yPercent: 110 },
          { yPercent: 0, duration: 1.0, delay: 0.1, ease: 'power4.out' }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [currentSlideIndex]);

  const slide = HERO_SLIDES[currentSlideIndex];

  return (
    <section ref={containerRef} className="relative overflow-hidden bg-slate-950 text-white h-[calc(100dvh-120px)] min-h-[460px] sm:h-auto sm:min-h-[580px] lg:min-h-[640px] flex items-center">
      {/* Background Image Carousel with Overlay */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={slide.bgImage}
          alt={slide.title}
          className="h-full w-full object-cover object-center transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/75 to-slate-900/40" />
      </div>

      {/* Hero Content Area */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 pt-6 pb-8 sm:px-6 sm:pt-16 sm:pb-32 lg:px-12 lg:pb-36 w-full">
        <div className="max-w-3xl">
          
          {/* Main Titles clipped in overflow-hidden mask frames */}
          <div className="overflow-hidden py-1">
            <h1 ref={titleRef} className="text-2xl min-[400px]:text-3xl font-black text-cyan-400 tracking-tight sm:text-4xl lg:text-5xl leading-tight block transform-gpu">
              {slide.title}
            </h1>
          </div>
          
          <div className="overflow-hidden py-1">
            <p ref={highlightRef} className="mt-1 text-xl min-[400px]:text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight block transform-gpu">
              {slide.highlightText}
            </p>
          </div>

          <p className="mt-2 sm:mt-3 text-xs min-[400px]:text-sm sm:text-base text-slate-300 font-medium leading-relaxed max-w-2xl">
            {slide.subtitle}
          </p>

          {/* Action CTA */}
          <div className="mt-6 sm:mt-10 flex flex-wrap gap-4 items-center">
          </div>
        </div>
      </div>

      {/* Vertical Slider Indicator Dots on Right */}
      <div className="absolute right-4 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-3 sm:right-8">
        {HERO_SLIDES.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setCurrentSlideIndex(idx)}
            className={`h-3 w-3 rounded-full transition-all duration-300 ${
              currentSlideIndex === idx
                ? 'bg-[#E64A19] scale-125 shadow-md shadow-orange-500/50 ring-2 ring-white'
                : 'bg-white/40 hover:bg-white/80'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};
