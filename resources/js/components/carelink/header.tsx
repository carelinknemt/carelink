import { Link, usePage } from '@inertiajs/react';
import { Phone, Menu, X, Ambulance, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useBooking } from '@/context/booking-context';
import { COMPANY_INFO } from '@/data/carelink';

const navItems = [
    { id: 'home', label: 'Home', href: '/', subLinks: [] as { label: string; href: string }[] },
    { id: 'services', label: 'Services', href: '/services', subLinks: [] as { label: string; href: string }[] },
    {
        id: 'fleet',
        label: 'Fleet',
        href: '/fleet',
        subLinks: [
            { label: 'BraunAbility Lift Vans', href: '/fleet' },
            { label: 'Group Transit Vans', href: '/fleet' },
            { label: 'Ambulatory Cruisers', href: '/fleet' },
        ],
    },
    {
        id: 'about',
        label: 'About',
        href: '/about',
        subLinks: [
            { label: 'NEMT Standards', href: '/about' },
            { label: 'Regional Coverage', href: '/about' },
            { label: 'Specialized Staff', href: '/about' },
        ],
    },
    {
        id: 'blog',
        label: 'Blog',
        href: '/blog',
        subLinks: [
            { label: 'Resource Center', href: '/blog' },
            { label: 'Safety Guidelines', href: '/blog' },
        ],
    },
    { id: 'faq', label: 'Contact', href: '/faq', subLinks: [] as { label: string; href: string }[] },
    { id: 'careers', label: 'Careers', href: '/careers', subLinks: [] as { label: string; href: string }[] },
];

function pathToTab(path: string): string | null {
    if (path === '/') {
        return 'home';
    }

    const match = path.match(/^\/(services|fleet|about|blog|faq|careers)/);

    return match ? match[1] : null;
}

export default function Header() {
    const { openBooking } = useBooking();
    const { url } = usePage();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);
    const [activeHoverItem, setActiveHoverItem] = useState<string | null>(null);

    const activeTab = pathToTab(url.split('?')[0]) ?? null;

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = () => {
        setActiveHoverItem(null);
        setMobileMenuOpen(false);
    };

    const activeHoverData = navItems.find((item) => item.id === activeHoverItem);

    const handleMobileParentClick = (item: (typeof navItems)[number]) => {
        if (item.subLinks.length === 0) {
            handleNavClick();
        } else {
            setExpandedMobileItem(expandedMobileItem === item.id ? null : item.id);
        }
    };

    return (
        <header
            onMouseLeave={() => setActiveHoverItem(null)}
            className="sticky top-0 z-40 bg-white shadow-sm transition-all duration-200 border-b border-gray-100"
        >
            {/* Top Utility Bar */}
            <div
                className={`border-gray-100 bg-[#E64A19] text-white transition-all duration-300 ease-in-out overflow-hidden ${
                    isScrolled
                        ? 'max-h-0 opacity-0 py-0 border-none pointer-events-none'
                        : 'max-h-24 opacity-100 py-1.5 px-4 sm:px-6 lg:px-12 border-b'
                }`}
            >
                <div className="mx-auto flex max-w-7xl items-center justify-center">
                    <a
                        href={`tel:${COMPANY_INFO.dispatchPhone.replace(/[^0-9+]/g, '')}`}
                        className="flex items-center gap-2 text-orange-50 hover:text-white transition-colors"
                    >
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white">
                            <Phone className="h-2.5 w-2.5" />
                        </div>
                        <span className="text-[11px] sm:text-xs font-bold text-white">{COMPANY_INFO.dispatchPhone}</span>
                        <span className="hidden sm:inline text-[9px] sm:text-[10px] text-orange-200 uppercase tracking-wider">
                            Dependable Dispatch
                        </span>
                    </a>
                </div>
            </div>

            {/* Main Navigation Row */}
            <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-12 py-2 sm:py-3">
                {/* Company Logo Brand */}
                <Link href="/" onClick={handleNavClick} className="flex cursor-pointer items-center group shrink-0">
                    <img
                        src={COMPANY_INFO.logoUrl}
                        alt={COMPANY_INFO.name}
                        className="h-7 min-[380px]:h-8 sm:h-11 w-auto max-w-[115px] min-[360px]:max-w-[135px] min-[400px]:max-w-[170px] sm:max-w-[280px] object-contain transition-transform group-hover:scale-105 lg:-ml-[40px] lg:mr-[80px]"
                        referrerPolicy="no-referrer"
                    />
                </Link>

                {/* Desktop Nav Links */}
                <nav className="hidden items-center gap-3 xl:gap-5 lg:flex">
                    {navItems.map((item) => (
                        <div key={item.id} className="relative py-2">
                            <Link
                                href={item.href}
                                onClick={handleNavClick}
                                onMouseEnter={() => setActiveHoverItem(item.id)}
                                className={`text-xs xl:text-sm font-bold transition-all duration-150 flex items-center gap-1.5 py-1.5 px-2.5 rounded-lg ${
                                    activeTab === item.id || activeHoverItem === item.id
                                        ? 'text-[#004B87] font-extrabold bg-slate-100/80'
                                        : 'text-gray-600 hover:text-[#E64A19] hover:bg-slate-50'
                                }`}
                            >
                                <span>{item.label}</span>
                                {item.subLinks.length > 0 && (
                                    <ChevronDown
                                        className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
                                            activeHoverItem === item.id ? 'rotate-180 text-[#E64A19]' : ''
                                        }`}
                                    />
                                )}
                                {activeTab === item.id && (
                                    <span className="absolute bottom-1 left-2.5 right-2.5 h-0.5 bg-[#E64A19] rounded-full" />
                                )}
                            </Link>
                        </div>
                    ))}
                </nav>

                {/* Action Controls */}
                <div className="flex items-center gap-1.5 sm:gap-3">
                    <button
                        onClick={openBooking}
                        className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-[#E64A19] px-3 sm:px-4 py-2 sm:py-2.5 text-xs font-bold text-white shadow-md shadow-orange-900/20 transition-all hover:bg-[#d83f0e] active:scale-95 min-h-[40px]"
                    >
                        <Ambulance className="h-4 w-4 text-orange-100 shrink-0" />
                        <span className="text-[11px] sm:text-xs whitespace-nowrap">Book a Ride</span>
                    </button>

                    {/* Mobile menu toggle button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="rounded-xl p-2 text-gray-700 hover:bg-gray-100 active:bg-gray-200 lg:hidden min-h-[40px] min-w-[40px] flex items-center justify-center"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6 text-[#004B87]" /> : <Menu className="h-6 w-6 text-gray-800" />}
                    </button>
                </div>
            </div>

            {/* Extended Navbar Sub-Links Bar - Integrated directly into header */}
            {activeHoverData && activeHoverData.subLinks.length > 0 && (
                <div
                    onMouseEnter={() => setActiveHoverItem(activeHoverData.id)}
                    className="hidden lg:block border-t border-slate-200/80 bg-slate-50/90 shadow-sm transition-all duration-150 animate-in fade-in"
                >
                    <div className="mx-auto max-w-7xl px-6 lg:px-12 py-2.5 flex items-center gap-4">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#004B87] shrink-0 border-r border-slate-300 pr-4">
                            {activeHoverData.label}
                        </span>
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {activeHoverData.subLinks.map((sub, idx) => (
                                <Link
                                    key={idx}
                                    href={sub.href}
                                    onClick={handleNavClick}
                                    className="text-xs font-semibold text-slate-700 hover:text-[#E64A19] hover:bg-white px-3 py-1.5 rounded-lg border border-transparent hover:border-slate-200 transition-all whitespace-nowrap cursor-pointer"
                                >
                                    {sub.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Nav Drawer with Accordions */}
            {mobileMenuOpen && (
                <div className="border-t border-gray-100 bg-white px-4 py-3 lg:hidden shadow-xl animate-in slide-in-from-top-2 duration-200 max-h-[80vh] overflow-y-auto">
                    <div className="flex flex-col space-y-2">
                        {navItems.map((item) => (
                            <div key={item.id} className="flex flex-col">
                                <button
                                    onClick={() => handleMobileParentClick(item)}
                                    className={`w-full text-left text-xs sm:text-sm font-bold py-3 px-3.5 rounded-xl transition-colors min-h-[44px] flex items-center justify-between ${
                                        activeTab === item.id
                                            ? 'bg-cyan-50 text-[#004B87] font-extrabold border border-cyan-200/60'
                                            : 'text-gray-700 hover:bg-gray-50 active:bg-gray-100'
                                    }`}
                                >
                                    <span>{item.label}</span>
                                    {item.subLinks.length > 0 && (
                                        <ChevronDown
                                            className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                                                expandedMobileItem === item.id ? 'rotate-180 text-[#004B87]' : ''
                                            }`}
                                        />
                                    )}
                                </button>

                                {/* Collapsible Sublinks for Mobile */}
                                {item.subLinks.length > 0 && expandedMobileItem === item.id && (
                                    <div className="pl-3 pr-2 py-1 space-y-0.5 bg-slate-50 rounded-xl border border-slate-200/80 mt-1">
                                        {item.subLinks.map((sub, idx) => (
                                            <Link
                                                key={idx}
                                                href={sub.href}
                                                onClick={() => {
                                                    handleNavClick();
                                                    setMobileMenuOpen(false);
                                                }}
                                                className="w-full text-left py-2 px-3 rounded-lg hover:bg-white text-xs font-semibold text-[#004B87] hover:text-[#E64A19] transition-colors min-h-[40px] flex items-center"
                                            >
                                                {sub.label}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </header>
    );
}
