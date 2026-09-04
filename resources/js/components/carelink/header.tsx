import { Link, usePage } from '@inertiajs/react';
import { Phone, Menu, X, Ambulance, ChevronDown, LogIn } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useCompanyInfo } from '@/lib/cms';
import { book, login } from '@/routes';

const navItems = [
    {
        id: 'home',
        label: 'Home',
        href: '/',
        subLinks: [] as { label: string; href: string }[],
    },
    {
        id: 'services',
        label: 'Services',
        href: '/services',
        subLinks: [] as { label: string; href: string }[],
    },
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
    {
        id: 'faq',
        label: 'Contact',
        href: '/faq',
        subLinks: [] as { label: string; href: string }[],
    },
    {
        id: 'careers',
        label: 'Careers',
        href: '/careers',
        subLinks: [] as { label: string; href: string }[],
    },
];

function pathToTab(path: string): string | null {
    if (path === '/') {
        return 'home';
    }

    const match = path.match(/^\/(services|fleet|about|blog|faq|careers)/);

    return match ? match[1] : null;
}

export default function Header() {
    const { url } = usePage();
    const company = useCompanyInfo();
    const dispatchPhone = company.dispatch_phone ?? company.phone ?? '';
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [hideDispatchBar, setHideDispatchBar] = useState(false);
    const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(
        null,
    );
    const [activeHoverItem, setActiveHoverItem] = useState<string | null>(null);

    const activeTab = pathToTab(url.split('?')[0]) ?? null;

    useEffect(() => {
        // Hysteresis: hide the dispatch bar only once the user has scrolled
        // down a good distance (120px) and bring it back only when they
        // return near the top (60px). Two different thresholds plus a
        // functional update mean the state flips exactly once per interval,
        // so the bar never flickers while scrolling.
        const handleScroll = () => {
            const scrollY = window.scrollY;

            setHideDispatchBar((hidden) => {
                if (!hidden && scrollY > 120) {
                    return true;
                }

                if (hidden && scrollY < 60) {
                    return false;
                }

                return hidden;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleResize = () => {
            const root = document.documentElement;
            const hasLargeFont =
                root.classList.contains('a11y-font-120') ||
                root.classList.contains('a11y-font-130') ||
                root.classList.contains('a11y-font-140') ||
                root.classList.contains('a11y-font-150');
            const collapseThreshold = hasLargeFont ? 1500 : 1200;

            if (window.innerWidth > collapseThreshold) {
                setMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleNavClick = () => {
        setActiveHoverItem(null);
        setMobileMenuOpen(false);
    };

    const activeHoverData = navItems.find(
        (item) => item.id === activeHoverItem,
    );

    const handleMobileParentClick = (item: (typeof navItems)[number]) => {
        if (item.subLinks.length === 0) {
            handleNavClick();
        } else {
            setExpandedMobileItem(
                expandedMobileItem === item.id ? null : item.id,
            );
        }
    };

    return (
        <header
            onMouseLeave={() => setActiveHoverItem(null)}
            className="sticky top-0 z-40 border-b border-gray-100 bg-white shadow-sm transition-all duration-200"
        >
            {/* Top Utility Bar */}
            <div
                className={`overflow-hidden border-gray-100 bg-[#E64A19] text-white transition-all duration-300 ease-in-out ${
                    hideDispatchBar
                        ? 'pointer-events-none max-h-0 border-none py-0 opacity-0'
                        : 'max-h-24 border-b px-4 py-1.5 opacity-100 sm:px-6 lg:px-12'
                }`}
            >
                <div className="mx-auto flex max-w-7xl items-center justify-center">
                    <a
                        href={`tel:${dispatchPhone.replace(/[^0-9+]/g, '')}`}
                        className="flex items-center gap-2 text-orange-50 transition-colors hover:text-white"
                    >
                        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-white">
                            <Phone className="h-2.5 w-2.5" />
                        </div>
                        <span className="text-[11px] font-bold text-white sm:text-xs">
                            {dispatchPhone}
                        </span>
                        <span className="hidden text-[9px] tracking-wider text-orange-200 uppercase sm:inline sm:text-[10px]">
                            Dependable Dispatch
                        </span>
                    </a>
                </div>
            </div>

            {/* Main Navigation Row */}
            <div className="mx-auto flex max-w-7xl items-center justify-between px-3 py-2 sm:px-6 sm:py-3 lg:px-12">
                {/* Company Logo Brand */}
                <Link
                    href="/"
                    onClick={handleNavClick}
                    className="group flex shrink-0 cursor-pointer items-center"
                >
                    <img
                        src={company.logo_url}
                        alt={company.name}
                        className="header-logo-desktop h-7 w-auto max-w-[115px] object-contain transition-transform group-hover:scale-105 min-[360px]:max-w-[135px] min-[380px]:h-8 min-[400px]:max-w-[170px] sm:h-11 sm:max-w-[280px]"
                        referrerPolicy="no-referrer"
                    />
                </Link>

                {/* Desktop Nav Links */}
                <nav className="header-desktop-nav items-center gap-3 xl:gap-5">
                    {navItems.map((item) => (
                        <div key={item.id} className="relative py-2">
                            <Link
                                href={item.href}
                                onClick={handleNavClick}
                                onMouseEnter={() => setActiveHoverItem(item.id)}
                                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all duration-150 xl:text-sm ${
                                    activeTab === item.id ||
                                    activeHoverItem === item.id
                                        ? 'bg-slate-100/80 font-extrabold text-[#004B87]'
                                        : 'text-[#004B87] hover:bg-slate-50 hover:text-[#E64A19]'
                                }`}
                            >
                                <span>{item.label}</span>
                                {item.subLinks.length > 0 && (
                                    <ChevronDown
                                        className={`h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 ${
                                            activeHoverItem === item.id
                                                ? 'rotate-180 text-[#E64A19]'
                                                : ''
                                        }`}
                                    />
                                )}
                                {activeTab === item.id && (
                                    <span className="absolute right-2.5 bottom-1 left-2.5 h-0.5 rounded-full bg-[#E64A19]" />
                                )}
                            </Link>
                        </div>
                    ))}
                </nav>

                {/* Action Controls */}
                <div className="flex items-center gap-1.5 sm:gap-3">
                    <Link
                        href={login()}
                        onClick={handleNavClick}
                        className="hidden min-h-[40px] items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-bold whitespace-nowrap text-[#004B87] transition-colors hover:bg-slate-50 hover:text-[#E64A19] sm:flex sm:gap-2 sm:px-3"
                    >
                        <LogIn className="h-4 w-4 shrink-0 text-slate-500 transition-colors group-hover:text-[#E64A19]" />
                        <span className="text-[11px] sm:text-xs">
                            Staff Login
                        </span>
                    </Link>

                    <Link
                        href={book.url()}
                        onClick={handleNavClick}
                        className="flex min-h-[40px] items-center gap-1.5 rounded-xl bg-[#E64A19] px-3 py-2 text-xs font-bold text-white shadow-md shadow-orange-900/20 transition-all hover:bg-[#d83f0e] active:scale-95 sm:gap-2 sm:px-4 sm:py-2.5"
                    >
                        <Ambulance className="h-4 w-4 shrink-0 text-orange-100" />
                        <span className="text-[11px] whitespace-nowrap sm:text-xs">
                            Book a Ride
                        </span>
                    </Link>

                    {/* Mobile menu toggle button */}
                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="header-mobile-toggle min-h-[40px] min-w-[40px] items-center justify-center rounded-xl p-2 text-gray-700 hover:bg-gray-100 active:bg-gray-200"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? (
                            <X className="h-6 w-6 text-[#004B87]" />
                        ) : (
                            <Menu className="h-6 w-6 text-gray-800" />
                        )}
                    </button>
                </div>
            </div>
            {/* Extended Navbar Sub-Links Bar - Integrated directly into header */}
            {activeHoverData && activeHoverData.subLinks.length > 0 && (
                <div
                    onMouseEnter={() => setActiveHoverItem(activeHoverData.id)}
                    className="header-desktop-subnav animate-in border-t border-slate-200/80 bg-slate-50/90 shadow-sm transition-all duration-150 fade-in"
                >
                    <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-2.5 lg:px-12">
                        <span className="shrink-0 border-r border-slate-300 pr-4 text-[11px] font-extrabold tracking-wider text-[#004B87] uppercase">
                            {activeHoverData.label}
                        </span>
                        <div className="flex flex-wrap items-center gap-1.5">
                            {activeHoverData.subLinks.map((sub, idx) => (
                                <Link
                                    key={idx}
                                    href={sub.href}
                                    onClick={handleNavClick}
                                    className="cursor-pointer rounded-lg border border-transparent px-3 py-1.5 text-xs font-semibold whitespace-nowrap text-slate-700 transition-all hover:border-slate-200 hover:bg-white hover:text-[#E64A19]"
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
                <div className="header-mobile-drawer max-h-[80vh] animate-in overflow-y-auto border-t border-gray-100 bg-white px-4 py-3 shadow-xl duration-200 slide-in-from-top-2">
                    <div className="flex flex-col space-y-2">
                        {navItems.map((item) => {
                            const itemClassName = `flex min-h-[44px] w-full items-center justify-between rounded-xl px-3.5 py-3 text-left text-xs font-bold transition-colors sm:text-sm ${
                                activeTab === item.id
                                    ? 'border border-cyan-200/60 bg-cyan-50 font-extrabold text-[#004B87]'
                                    : 'text-[#004B87] hover:bg-gray-50 active:bg-gray-100'
                            }`;

                            return (
                                <div key={item.id} className="flex flex-col">
                                    {item.subLinks.length === 0 ? (
                                        <Link
                                            href={item.href}
                                            onClick={handleNavClick}
                                            className={itemClassName}
                                        >
                                            <span>{item.label}</span>
                                        </Link>
                                    ) : (
                                        <button
                                            onClick={() =>
                                                handleMobileParentClick(item)
                                            }
                                            aria-expanded={
                                                expandedMobileItem === item.id
                                            }
                                            className={itemClassName}
                                        >
                                            <span>{item.label}</span>
                                            <ChevronDown
                                                className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
                                                    expandedMobileItem ===
                                                    item.id
                                                        ? 'rotate-180 text-[#004B87]'
                                                        : ''
                                                }`}
                                            />
                                        </button>
                                    )}

                                    {/* Collapsible Sublinks for Mobile */}
                                    {item.subLinks.length > 0 &&
                                        expandedMobileItem === item.id && (
                                            <div className="mt-1 space-y-0.5 rounded-xl border border-slate-200/80 bg-slate-50 py-1 pr-2 pl-3">
                                                {item.subLinks.map(
                                                    (sub, idx) => (
                                                        <Link
                                                            key={idx}
                                                            href={sub.href}
                                                            onClick={() => {
                                                                handleNavClick();
                                                                setMobileMenuOpen(
                                                                    false,
                                                                );
                                                            }}
                                                            className="flex min-h-[40px] w-full items-center rounded-lg px-3 py-2 text-left text-xs font-semibold text-[#004B87] transition-colors hover:bg-white hover:text-[#E64A19]"
                                                        >
                                                            {sub.label}
                                                        </Link>
                                                    ),
                                                )}
                                            </div>
                                        )}
                                </div>
                            );
                        })}

                        <div className="mt-2 border-t border-gray-100 pt-3">
                            <Link
                                href={login()}
                                onClick={() => {
                                    handleNavClick();
                                    setMobileMenuOpen(false);
                                }}
                                className="flex min-h-[44px] w-full items-center gap-2 rounded-xl px-3.5 py-3 text-left text-xs font-bold text-[#004B87] transition-colors hover:bg-gray-50 active:bg-gray-100 sm:text-sm"
                            >
                                <LogIn className="h-4 w-4 shrink-0 text-slate-500" />
                                Staff Login
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
}
