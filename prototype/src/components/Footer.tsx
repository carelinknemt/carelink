import { Phone, Mail, Globe, Facebook, Instagram, Send, ArrowUp, ShieldCheck } from 'lucide-react';
import React from 'react';
import amexImg from '../assets/images/payments/American-Express.png';
import applePayImg from '../assets/images/payments/Apple-Pay.png';
import discoverImg from '../assets/images/payments/Discover-Network.png';
import gpayImg from '../assets/images/payments/Gpay.png';
import mastercardImg from '../assets/images/payments/Mastercard.png';
import maestroImg from '../assets/images/payments/Mastero.png';
import paypalImg from '../assets/images/payments/PayPal.png';
import unionPayImg from '../assets/images/payments/UnionPay.png';
import visaImg from '../assets/images/payments/Visa.png';
import westernUnionImg from '../assets/images/payments/Western-Union.png';
import { COMPANY_INFO } from '../data/carelinkData';

interface FooterProps {
  onNavClick: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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

  return (
    <footer className="bg-slate-950 text-white pt-14 pb-8 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 pb-12 border-b border-slate-800">
          
          {/* Column 1: Carelink Info */}
          <div>
            <div className="inline-block rounded-2xl bg-white p-2.5 px-3.5 shadow-md border border-slate-200">
              <img
                src={COMPANY_INFO.logoWithTextUrl}
                alt={COMPANY_INFO.name}
                className="h-9 w-auto max-w-[200px] object-contain"
                referrerPolicy="no-referrer"
              />
            </div>
            
            <p className="mt-3 text-xs text-slate-300 leading-relaxed max-w-sm">
              {COMPANY_INFO.tagline} Headquarters in Eureka, California serving Humboldt, Del Norte, Trinity, and Shasta counties.
            </p>

            <div className="mt-5 space-y-2 text-xs text-slate-300 font-medium">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[#E64A19]" />
                <span>Dispatch: {COMPANY_INFO.dispatchPhone}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[#E64A19]" />
                <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-orange-300 transition-colors">
                  {COMPANY_INFO.email}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-[#E64A19]" />
                <span>{COMPANY_INFO.address}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-sm font-black text-[#E64A19] uppercase tracking-wider">Quick Navigation</h3>
            <ul className="mt-3 space-y-2 text-xs font-bold text-slate-300">
              <li><button onClick={() => onNavClick('home')} className="hover:text-orange-400 transition-colors">Home & Intake</button></li>
              <li><button onClick={() => onNavClick('services')} className="hover:text-orange-400 transition-colors">Our NEMT Services & Rates</button></li>
              <li><button onClick={() => onNavClick('fleet')} className="hover:text-orange-400 transition-colors">Wheelchair & Shuttle Fleet</button></li>
              <li><button onClick={() => onNavClick('about')} className="hover:text-orange-400 transition-colors">About Carelink & Leadership</button></li>
              <li><button onClick={() => onNavClick('blog')} className="hover:text-orange-400 transition-colors">Content Hub & Patient Advisories</button></li>
              <li><button onClick={() => onNavClick('careers')} className="hover:text-orange-400 transition-colors">Careers</button></li>
            </ul>
          </div>

        </div>

        {/* Payment Methods Infinite Marquee */}
        <div className="py-6 border-b border-slate-800/60 overflow-hidden relative">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest shrink-0">
              Accepted Methods
            </span>
            <div className="w-full overflow-hidden relative">
              <div className="animate-marquee flex gap-12 items-center">
                {/* Double the list to ensure a seamless infinite animation loop */}
                {[...paymentMethods, ...paymentMethods, ...paymentMethods].map((item, idx) => (
                  <div key={idx} className="shrink-0 transition-transform hover:scale-110">
                    <img
                      src={item.src}
                      alt={item.name}
                      className="h-7 sm:h-9 w-auto object-contain select-none opacity-100 filter brightness-90 invert-0"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-xs text-slate-400">
          <div className="space-y-1">
            <p>Copyright 2026 by <span className="font-bold text-white">{COMPANY_INFO.name}</span>. All rights reserved.</p>
            <p className="text-[11px] text-slate-400">
              Designed & Developed by{' '}
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#E64A19] hover:text-orange-300 underline underline-offset-2 transition-colors"
              >
                Pawlos Design Lab
              </a>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 font-bold text-xs text-slate-300">
            <button onClick={() => onNavClick('faq')} className="hover:text-orange-400 transition-colors">Contact & Legal</button>
            <span>&bull;</span>
            <button onClick={scrollToTop} className="inline-flex items-center gap-1 text-[#E64A19] hover:text-orange-300 transition-colors">
              <ArrowUp className="h-3.5 w-3.5" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
