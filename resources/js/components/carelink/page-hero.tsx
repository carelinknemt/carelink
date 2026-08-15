import type { LucideIcon } from 'lucide-react';

interface PageHeroProps {
    badge?: string;
    badgeIcon?: LucideIcon;
    title: string;
    subtitle: string;
}

export default function PageHero({
    badge,
    badgeIcon: BadgeIcon,
    title,
    subtitle,
}: PageHeroProps) {
    return (
        <div className="relative overflow-hidden border-b-8 border-[#E64A19] bg-[#004B87] py-16 sm:py-24">
            <div className="absolute inset-0 opacity-20">
                <img
                    src="/images/Img-Carelink-hero.webp"
                    alt="Carelink Fleet Background"
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[#004B87] mix-blend-multiply" />
            </div>

            <div className="relative z-10 mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-12">
                {badge && BadgeIcon && (
                    <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-black tracking-widest text-cyan-300 uppercase shadow-sm backdrop-blur-sm">
                        <BadgeIcon className="h-4 w-4" />
                        {badge}
                    </span>
                )}
                <h1 className="mx-auto max-w-3xl text-4xl leading-tight font-black tracking-tight text-white sm:text-5xl">
                    {title}
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed font-medium text-cyan-100 sm:text-base">
                    {subtitle}
                </p>
            </div>
        </div>
    );
}