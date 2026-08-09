import React, { useState, useEffect } from 'react';
import atmImg from '../assets/images/atm.png';
import amexImg from '../assets/images/payments/American-Express.png';
import applePayImg from '../assets/images/payments/Apple-Pay.png';
import discoverImg from '../assets/images/payments/Discover-Network.png';
import gpayImg from '../assets/images/payments/Gpay.png';
import mastercardImg from '../assets/images/payments/Mastercard.png';
import maestroImg from '../assets/images/payments/Mastero.png';
import paypalImg from '../assets/images/payments/PayPal.png';
import stripeImg from '../assets/images/payments/Stripe.png';
import unionPayImg from '../assets/images/payments/UnionPay.png';
import visaImg from '../assets/images/payments/Visa.png';
import westernUnionImg from '../assets/images/payments/Western-Union.png';

interface StripePartnershipSpotlightProps {
  onOpenBooking: () => void;
}

export const StripePartnershipSpotlight: React.FC<StripePartnershipSpotlightProps> = ({ onOpenBooking }) => {
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

  const paymentMethods = [
    { name: "Visa", src: visaImg },
    { name: "Mastercard", src: mastercardImg },
    { name: "American Express", src: amexImg },
    { name: "Discover Network", src: discoverImg },
    { name: "UnionPay", src: unionPayImg },
    { name: "Maestro", src: maestroImg },
    { name: "PayPal", src: paypalImg },
    { name: "Western Union", src: westernUnionImg },
    { name: "Apple Pay", src: applePayImg },
    { name: "Google Pay", src: gpayImg }
  ];

  // Hardcoded layout styles derived from Leva adjustments
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
      className="py-20 bg-slate-100 relative overflow-hidden bg-cover bg-no-repeat bg-center"
      style={{
        backgroundImage: bgImage,
        backgroundSize: "100vw 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
    {/* ATM background image on the right with custom Leva adjustments */}
      <img 
        src={atmImg} 
        alt="" 
        style={imageStyle}
        className="select-none pointer-events-none"
        referrerPolicy="no-referrer"
      />
      {/* Decorative background overlay and shapes */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-50/30 to-cyan-50/30 rounded-full blur-3xl z-0" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Spotlight Box Container */}
        <div className="bg-transparent ">
          <div className="-mt-[90px] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left/Main Side: Text and Trust Highlights */}
            <div className="lg:col-span-6 p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
              <div>

                <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
                  <span>Powered by</span>
                  <img 
                    src={stripeImg} 
                    alt="Stripe" 
                    className="h-[50px] sm:h-[60px] w-auto object-contain inline-block align-middle" 
                    referrerPolicy="no-referrer"
                  />
                </h2>

                <p className="mt-4 text-slate-700 text-sm leading-relaxed">
                  Carelink utilizes Stripe to process over 10+ major global payment networks and express wallets instantly and securely.
                </p>
              </div>
            </div>

            {/* Right Side: Visual Accepted Cards showcase using individual uploaded images */}
            <div className="lg:col-span-6 bg-transparent p-8 sm:p-12 flex flex-col justify-center">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-1">
                    Accepted Networks & Express Wallets
                  </h3>
                  <p className="text-[10px] sm:text-xs text-slate-500 uppercase tracking-wider font-extrabold">
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
                        className="h-[32px] sm:h-[44px] lg:h-[50px] w-auto object-contain select-none"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  ))}
                </div>

                {/* No safety seal footer */}
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
