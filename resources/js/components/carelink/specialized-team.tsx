import { useEffect, useRef, useState } from 'react';

export default function SpecializedTeam() {
    const containerRef = useRef<HTMLElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(() => (typeof window !== 'undefined' ? window.matchMedia('(max-width: 767px)').matches : false));

    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 767px)');

        const handler = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches);
        };

        mediaQuery.addEventListener('change', handler);

        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    const bgParallaxSpeed = 0.25;

    useEffect(() => {
        let animationFrameId: number;

        const updateParallax = () => {
            if (!containerRef.current || !bgRef.current) {
return;
}

            const rect = containerRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Only calculate when section is visible in viewport
            if (rect.bottom >= 0 && rect.top <= windowHeight) {
                const centerOffset = rect.top + rect.height / 2 - windowHeight / 2;
                const yOffset = centerOffset * bgParallaxSpeed;
                bgRef.current.style.transform = `translate3d(0, ${yOffset.toFixed(2)}px, 0)`;
            }
        };

        const onScroll = () => {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = requestAnimationFrame(updateParallax);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll, { passive: true });
        updateParallax();

        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isMobile]);

    const currentSectionPy = isMobile ? '48px' : '112px';
    const currentCardWidth = isMobile ? '355px' : '501px';
    const currentCardHeight = isMobile ? '240px' : '300px';
    const currentCardAlign = isMobile ? 'mx-auto' : 'mr-auto';
    const currentCardYOffset = isMobile ? -45 : 0;
    const currentImageTopOverflow = isMobile ? '-225px' : '-130px';
    const currentImageWidth = isMobile ? '131%' : '100%';
    const currentImageScale = isMobile ? 1.25 : 1.0;

    return (
        <section
            ref={containerRef}
            id="about"
            className="relative flex flex-col justify-center overflow-hidden bg-slate-100 border-y border-slate-100"
            style={{ minHeight: '100dvh', paddingTop: currentSectionPy, paddingBottom: currentSectionPy }}
        >
            {/* Hardware-accelerated smooth parallax background container */}
            <div
                ref={bgRef}
                className="absolute inset-x-0 -top-[25%] -bottom-[25%] h-[150%] w-full bg-cover bg-center pointer-events-none will-change-transform z-0"
                style={{
                    backgroundImage: isMobile
                        ? "url('/images/covers/cover.png')"
                        : "url('/images/covers/Img-Carelink.png')",
                }}
            />

            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12 relative z-10 w-full">
                <div
                    className={`relative flex flex-col items-start justify-end text-left p-4 sm:p-8 rounded-3xl bg-white/95 border border-slate-200/40 shadow-xl backdrop-blur-md max-w-full transition-all duration-150 ${currentCardAlign}`}
                    style={{
                        width: currentCardWidth,
                        height: currentCardHeight,
                        transform: `translateY(${currentCardYOffset}px)`,
                    }}
                >
                    {/* Card background gradient for depth under the transparent image */}
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-50/50 to-[#004B87]/5 pointer-events-none -z-10" />

                    {/* Out-of-bounds image container: clips on bottom, left, and right, but extends above the top edge */}
                    <div className="absolute inset-x-0 bottom-0 rounded-b-3xl overflow-hidden pointer-events-none z-10" style={{ top: currentImageTopOverflow }}>
                        <img
                            src="/images/A-women-sharing-joy-with-caregiver1.png"
                            alt="A woman sharing joy with caregiver"
                            className="absolute bottom-0 left-1/2 select-none h-auto object-cover transition-all duration-75"
                            style={{
                                width: currentImageWidth,
                                transform: `translateX(-50%) scale(${currentImageScale})`,
                                transformOrigin: 'bottom center',
                            }}
                            referrerPolicy="no-referrer"
                        />
                    </div>

                    {/* Minimal overlay with only Transit Support text */}
                    <div className="relative z-20 mt-auto bg-white/90 backdrop-blur-xs px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-xl border border-orange-200/60 shadow-sm">
                        <span className="text-[9px] sm:text-[10px] font-black text-[#E64A19] uppercase tracking-widest block">Transit Support</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
