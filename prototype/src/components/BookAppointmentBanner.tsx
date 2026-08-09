import gsap from 'gsap';
import { ChevronRight } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import trackingImg from '../assets/images/tracking123.png';
import { COMPANY_INFO } from '../data/carelinkData';

interface BookAppointmentBannerProps {
  onOpenBooking: () => void;
}

export const BookAppointmentBanner: React.FC<BookAppointmentBannerProps> = ({ onOpenBooking }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (leftColRef.current && rightColRef.current && containerRef.current) {
        gsap.fromTo(
          leftColRef.current,
          { x: -50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
        );

        gsap.fromTo(
          rightColRef.current,
          { x: 50, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative z-40 w-full drop-shadow-2xl">
      <div className="grid grid-cols-1 overflow-hidden rounded-2xl sm:rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] lg:grid-cols-12 bg-white border border-white/20 ring-1 ring-black/10">
        
        {/* Left Dark Blue Welcome Banner */}
        <div ref={leftColRef} className="bg-[#004B87] p-5 sm:p-7 lg:p-9 text-white lg:col-span-7 flex flex-col justify-center">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold leading-snug sm:leading-snug">
            Welcome to Carelink Medical Transportation LLC. Connecting patients across Humboldt, Del Norte, Trinity, and Shasta counties with compassionate, punctual wheelchair and group transit.
          </h2>
          <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-medium text-orange-100">
            <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full text-[11px] backdrop-blur-sm border border-white/10">
              &bull; Curb-to-Curb Service
            </span>
            <span className="inline-flex items-center gap-1 bg-white/10 px-2.5 py-1 rounded-full text-[11px] backdrop-blur-sm border border-white/10">
              &bull; Bambi NEMT Integrated
            </span>
            <span className="inline-flex items-center gap-1 bg-[#E64A19] px-2.5 py-1 rounded-full text-[11px] font-extrabold text-white shadow-sm border border-orange-400/30">
              &bull; Dependable Dispatch
            </span>
          </div>
        </div>

        {/* Right White Ride Intake Graphic & Button Card */}
        <div ref={rightColRef} className="bg-slate-50 p-5 sm:p-7 lg:p-9 lg:col-span-5 flex flex-col items-center justify-center text-center border-t lg:border-t-0 lg:border-l border-slate-200">
          <div className="flex items-center gap-1.5 mb-1">
            <h2 className="text-lg sm:text-xl font-extrabold text-[#004B87] mb-2 flex items-center gap-2">
              <span>Live GPS Dispatch</span>
              <span className="text-xs bg-[#E64A19]/10 text-[#E64A19] px-2 py-0.5 rounded-md font-black border border-[#E64A19]/20 uppercase">Active</span>
            </h2>
          </div>

          

          {/* Fast Riding SUV Vehicle Container with Motion Streaks */}
          <div className="relative my-2 flex h-28 sm:h-28 w-44 sm:w-48 items-center justify-center overflow-hidden">
            
            {/* Speed Motion Lines */}
            <div className="absolute inset-0 pointer-events-none flex flex-col justify-around py-2 opacity-80 z-0">
              <div className="h-[2px] w-16 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-road-streak" style={{ animationDelay: '0.6s' }} />
              <div className="h-[1.5px] w-20 bg-gradient-to-r from-transparent via-orange-500 to-transparent animate-road-streak-fast" style={{ animationDelay: '0.92s' }} />
              <div className="h-[2px] w-12 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-road-streak" style={{ animationDelay: '0.16s' }} />
              <div className="h-[2.5px] w-24 bg-gradient-to-r from-transparent via-[#E64A19]/30 to-transparent animate-road-streak-fast" style={{ animationDelay: '0.86s' }} />
            </div>

            {/* Fast Riding SUV Car Image */}
            <div className="relative z-10 w-full h-full flex items-center justify-center animate-fast-ride">
              <img 
                src={trackingImg} 
                alt="Fast transit SUV vehicle tracking" 
                className="h-full w-full object-contain filter drop-shadow-md"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Fast ground motion reflection line */}
            <div className="absolute bottom-1.5 left-2 right-2 h-1 bg-gradient-to-r from-transparent via-orange-500/40 to-transparent rounded-full animate-pulse" />
          </div>

        </div>

      </div>
    </div>
  );
};
