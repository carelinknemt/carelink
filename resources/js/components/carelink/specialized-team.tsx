import { useEffect, useRef, useState } from 'react';

export default function SpecializedTeam() {
    const containerRef = useRef<HTMLElement>(null);
    const bgRef = useRef<HTMLDivElement>(null);
    const [isMobile, setIsMobile] = useState(() =>
        typeof window !== 'undefined'
            ? window.matchMedia('(max-width: 767px)').matches
            : false,
    );

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
                const centerOffset =
                    rect.top + rect.height / 2 - windowHeight / 2;
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
            className="relative flex flex-col justify-center overflow-hidden border-y border-slate-100 bg-slate-100"
            style={{
                minHeight: '100dvh',
                paddingTop: currentSectionPy,
                paddingBottom: currentSectionPy,
            }}
        >
            {/* Hardware-accelerated smooth parallax background container */}
            <div
                ref={bgRef}
                className="pointer-events-none absolute inset-x-0 -top-[25%] -bottom-[25%] z-0 h-[150%] w-full bg-cover bg-center will-change-transform"
                style={{
                    backgroundImage: isMobile
                        ? "url('/images/covers/cover.png')"
                        : "url('/images/covers/Img-Carelink.png')",
                }}
            />

            <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-12">
                <div
                    className={`relative flex max-w-full flex-col items-start justify-end rounded-3xl border border-slate-200/40 bg-white/95 p-4 text-left shadow-xl backdrop-blur-md transition-all duration-150 sm:p-8 ${currentCardAlign}`}
                    style={{
                        width: currentCardWidth,
                        height: currentCardHeight,
                        transform: `translateY(${currentCardYOffset}px)`,
                    }}
                >
                    {/* Card background gradient for depth under the transparent image */}
                    <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-cyan-50/50 to-[#004B87]/5" />

                    {/* Out-of-bounds image container: clips on bottom, left, and right, but extends above the top edge */}
                    <div
                        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 overflow-hidden rounded-b-3xl"
                        style={{ top: currentImageTopOverflow }}
                    >
                        <img
                            src="/images/A-women-sharing-joy-with-caregiver1.png"
                            alt="A woman sharing joy with caregiver"
                            className="absolute bottom-0 left-1/2 h-auto object-cover transition-all duration-75 select-none"
                            style={{
                                width: currentImageWidth,
                                transform: `translateX(-50%) scale(${currentImageScale})`,
                                transformOrigin: 'bottom center',
                            }}
                            referrerPolicy="no-referrer"
                        />
                    </div>

                    {/* Minimal overlay with only Transit Support text */}
                    <div className="relative z-20 mt-auto rounded-xl border border-orange-200/60 bg-white/90 px-2.5 py-1 shadow-sm backdrop-blur-xs sm:px-3.5 sm:py-1.5">
                        <span className="block text-[9px] font-black tracking-widest text-[#E64A19] uppercase sm:text-[10px]">
                            Transit Support
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}
