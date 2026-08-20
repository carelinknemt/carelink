import { Link } from '@inertiajs/react';
import {
    ArrowUp,
    Facebook,
    Globe,
    Instagram,
    Linkedin,
    Mail,
    Phone,
    Twitter,
    Youtube,
} from 'lucide-react';
import { useCms, useCompanyInfo } from '@/lib/cms';
import type { PaymentMethod } from '@/lib/cms';

const socialLinks = [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'LinkedIn', href: '#', icon: Linkedin },
    { name: 'Twitter', href: '#', icon: Twitter },
    { name: 'YouTube', href: '#', icon: Youtube },
];

export default function Footer() {
    const cms = useCms();
    const company = useCompanyInfo();
    const paymentMethods = (cms.payment_methods?.methods ??
        []) as PaymentMethod[];
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="border-t border-slate-800 bg-slate-950 pt-14 pb-8 text-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-12">
                {/* Main Footer Columns */}
                <div className="grid grid-cols-1 gap-10 border-b border-slate-800 pb-12 md:grid-cols-3">
                    {/* Column 1: Carelink Info */}
                    <div>
                        <div className="inline-block rounded-2xl border border-slate-200 bg-white p-2.5 px-3.5 shadow-md">
                            <img
                                src={company.logo_url}
                                alt={company.name}
                                className="h-9 w-auto max-w-[200px] object-contain"
                                referrerPolicy="no-referrer"
                            />
                        </div>

                        <p className="mt-3 max-w-sm text-xs leading-relaxed text-slate-300">
                            Medical transportation across Humboldt, Del Norte,
                            Trinity & Shasta counties.
                        </p>

                        <div className="mt-5 space-y-2 text-xs font-medium text-slate-300">
                            <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4 text-[#E64A19]" />
                                <a
                                    href={`tel:${(company.dispatch_phone ?? company.phone ?? '').replace(/[^0-9+]/g, '')}`}
                                    className="transition-colors hover:text-orange-300"
                                >
                                    {company.dispatch_phone ?? company.phone}
                                </a>
                            </div>

                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-[#E64A19]" />
                                <a
                                    href={`mailto:${company.email}`}
                                    className="transition-colors hover:text-orange-300"
                                >
                                    {company.email}
                                </a>
                            </div>

                            <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4 text-[#E64A19]" />
                                <span>{company.address}</span>
                            </div>
                        </div>

                        <div className="mt-5 flex items-center gap-2.5">
                            {socialLinks.map(({ name, href, icon: Icon }) => (
                                <a
                                    key={name}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={name}
                                    title={name}
                                    className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-slate-300 transition-colors hover:border-[#E64A19] hover:bg-[#E64A19] hover:text-white"
                                >
                                    <Icon className="h-4 w-4" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-sm font-black tracking-wider text-[#E64A19] uppercase">
                            Quick Links
                        </h3>
                        <ul className="mt-3 space-y-2 text-xs font-bold text-slate-300">
                            <li>
                                <Link
                                    href="/"
                                    className="transition-colors hover:text-orange-400"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/services"
                                    className="transition-colors hover:text-orange-400"
                                >
                                    Services & Rates
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/fleet"
                                    className="transition-colors hover:text-orange-400"
                                >
                                    Our Fleet
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className="transition-colors hover:text-orange-400"
                                >
                                    About Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Column 3: Resources */}
                    <div>
                        <h3 className="text-sm font-black tracking-wider text-[#E64A19] uppercase">
                            Resources
                        </h3>
                        <ul className="mt-3 space-y-2 text-xs font-bold text-slate-300">
                            <li>
                                <Link
                                    href="/blog"
                                    className="transition-colors hover:text-orange-400"
                                >
                                    Blog & Updates
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/careers"
                                    className="transition-colors hover:text-orange-400"
                                >
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/faq"
                                    className="transition-colors hover:text-orange-400"
                                >
                                    FAQs & Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Payment Methods Infinite Marquee */}
                <div className="relative overflow-hidden border-b border-slate-800/60 py-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center">
                        <span className="shrink-0 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                            Accepted Methods
                        </span>
                        <div className="relative w-full overflow-hidden">
                            <div className="animate-marquee flex items-center gap-12">
                                {[
                                    ...paymentMethods,
                                    ...paymentMethods,
                                    ...paymentMethods,
                                ].map((item, idx) => (
                                    <div
                                        key={idx}
                                        className="shrink-0 transition-transform hover:scale-110"
                                    >
                                        <img
                                            src={item.src}
                                            alt={item.name}
                                            className="h-7 w-auto object-contain opacity-100 brightness-90 invert-0 filter select-none sm:h-9"
                                            referrerPolicy="no-referrer"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Sub-footer */}
                <div className="flex flex-col gap-4 pt-8 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                    <div className="space-y-1">
                        <p>
                            Copyright 2026 by{' '}
                            <span className="font-bold text-white">
                                {company.name}
                            </span>
                            . All rights reserved.
                        </p>
                        <p className="text-[11px] text-slate-400">
                            Designed & Developed by{' '}
                            <a
                                href="#"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-[#E64A19] underline underline-offset-2 transition-colors hover:text-orange-300"
                            >
                                Pawlos Design Lab
                            </a>
                        </p>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-bold text-slate-300">
                        <Link
                            href="/terms"
                            className="transition-colors hover:text-orange-400"
                        >
                            Terms & Conditions
                        </Link>
                        <span className="text-slate-600">•</span>
                        <Link
                            href="/privacy"
                            className="transition-colors hover:text-orange-400"
                        >
                            Privacy Policy
                        </Link>
                        <span className="text-slate-600">•</span>
                        <button
                            onClick={scrollToTop}
                            className="inline-flex items-center gap-1 text-[#E64A19] transition-colors hover:text-orange-300"
                        >
                            <ArrowUp className="h-3.5 w-3.5" />
                            <span>Back to Top</span>
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
}
