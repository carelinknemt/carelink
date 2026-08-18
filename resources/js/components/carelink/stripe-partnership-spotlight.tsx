import { useEffect, useState } from 'react';
import { useCms } from '@/lib/cms';
import type { PaymentMethod } from '@/lib/cms';

export default function StripePartnershipSpotlight() {
    const cms = useCms();
    const paymentMethods = (cms.payment_methods?.methods ??
        []) as PaymentMethod[];
    const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            // lg: breakpoint in Tailwind is 1024px. Below 1024px is mobile & tablet viewports.
            setIsMobileOrTablet(window.innerWidth < 1024);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const bgImage = isMobileOrTablet
        ? "url('https://i.postimg.cc/CKcshzZ4/Mob-bg-pattern1.png')"
        : "url('https://i.postimg.cc/jS7qjtV9/bg-pattern.png')";

    const imageStyle: React.CSSProperties = isMobileOrTablet
        ? {
              position: 'absolute',
              right: '-37px',
              top: '168px',
              height: '45%',
              opacity: 0.5,
              zIndex: 12,
              width: 'auto',
              objectFit: 'contain',
          }
        : {
              position: 'absolute',
              right: '-19px',
              top: '200px',
              height: '71%',
              opacity: 1,
              zIndex: 12,
              width: 'auto',
              objectFit: 'contain',
          };

    return (
        <section
            id="stripe-partnership-spotlight"
            className="relative overflow-hidden bg-slate-100 bg-cover bg-center bg-no-repeat py-20"
            style={{
                backgroundImage: bgImage,
                backgroundSize: '100vw 100%',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        >
            {/* ATM background image on the right with custom Leva adjustments */}
            <img
                src="/images/atm.png"
                alt=""
                style={imageStyle}
                className="pointer-events-none select-none"
                referrerPolicy="no-referrer"
            />
            {/* Decorative background overlay and shapes */}
            <div className="absolute top-1/2 left-1/2 z-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-emerald-50/30 to-cyan-50/30 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Spotlight Box Container */}
                <div className="bg-transparent">
                    <div className="-mt-[90px] grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                        {/* Left/Main Side: Text and Trust Highlights */}
                        <div className="flex flex-col justify-between p-8 sm:p-12 lg:col-span-6 lg:p-16">
                            <div>
                                <h2 className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-3xl leading-tight font-black tracking-tight text-slate-900 sm:text-4xl">
                                    <span>Powered by</span>
                                    <img
                                        src="/images/payments/Stripe.png"
                                        alt="Stripe"
                                        className="inline-block h-[50px] w-auto object-contain align-middle sm:h-[60px]"
                                        referrerPolicy="no-referrer"
                                    />
                                </h2>

                                <p className="mt-4 text-sm leading-relaxed text-slate-700">
                                    Carelink utilizes Stripe to process over 10+
                                    major global payment networks and express
                                    wallets instantly and securely.
                                </p>
                            </div>
                        </div>

                        {/* Right Side: Visual Accepted Cards showcase using individual uploaded images */}
                        <div className="flex flex-col justify-center bg-transparent p-8 sm:p-12 lg:col-span-6">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="mb-1 text-sm font-black tracking-wider text-slate-900 uppercase">
                                        Accepted Networks & Express Wallets
                                    </h3>
                                    <p className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase sm:text-xs">
                                        Secure Payment Integrations
                                    </p>
                                </div>

                                {/* Clean display of imported logo files without card background/canvas wrappers */}
                                <div className="flex flex-wrap items-center gap-6 sm:gap-8">
                                    {paymentMethods.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="group relative transition-transform hover:scale-110"
                                            title={item.name}
                                        >
                                            <img
                                                src={item.src}
                                                alt={item.name}
                                                className="h-[32px] w-auto object-contain select-none sm:h-[44px] lg:h-[50px]"
                                                referrerPolicy="no-referrer"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
