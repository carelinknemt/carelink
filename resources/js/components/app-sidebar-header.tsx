import { usePage } from '@inertiajs/react';
import {
    SquareArrowUpRight,
    RadioTower,
    BriefcaseBusiness,
    ExternalLink,
    CalendarClock,
    Ambulance,
    MapPin,
    Fuel,
    PhoneCall,
    Banknote,
    Receipt,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType, SharedData } from '@/types';

type QuickLink = {
    label: string;
    url: string;
    icon: LucideIcon;
};

type QuickLinkGroup = {
    id: 'dispatch' | 'manager';
    label: string;
    icon: LucideIcon;
    headerClass: string;
    chipClass: string;
    iconClass: string;
    links: QuickLink[];
};

const QUICK_LINK_GROUPS: QuickLinkGroup[] = [
    {
        id: 'dispatch',
        label: 'Dispatch Links',
        icon: RadioTower,
        headerClass: 'bg-gradient-to-r from-teal-600 to-cyan-600',
        chipClass: 'bg-white/15 text-white',
        iconClass: 'text-teal-500',
        links: [
            {
                label: 'Kinetic Scheduler',
                url: 'https://scheduler.kinetik.care/login',
                icon: CalendarClock,
            },
            {
                label: 'Bambi Dispatch Login',
                url: 'https://www.hibambi.com',
                icon: Ambulance,
            },
            {
                label: 'GPS Tracking',
                url: 'https://login.us.vzconnect.com',
                icon: MapPin,
            },
            {
                label: 'Fuel Card',
                url: 'https://go.wexonline.com/login',
                icon: Fuel,
            },
            {
                label: 'Dialpad Calls',
                url: 'https://dialpad.com/start',
                icon: PhoneCall,
            },
        ],
    },
    {
        id: 'manager',
        label: 'Manager Links',
        icon: BriefcaseBusiness,
        headerClass: 'bg-gradient-to-r from-violet-600 to-indigo-600',
        chipClass: 'bg-white/15 text-white',
        iconClass: 'text-violet-500',
        links: [
            {
                label: 'Run ADP',
                url: 'https://online.adp.com/signin/v1/?APPID=RUN&productId=80e309c3-70c3-bae1-e053-3505430b5495&Action=Login&Stc=False&ssru=branded',
                icon: Banknote,
            },
            {
                label: 'Kinetic RCM',
                url: 'https://rcm.kinetik.care/login',
                icon: Receipt,
            },
        ],
    },
];

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const { auth } = usePage<SharedData>().props;
    const userRole = auth.user.role;

    const dispatchGroup = QUICK_LINK_GROUPS.find(
        (group) => group.id === 'dispatch',
    )!;
    const managerGroup = QUICK_LINK_GROUPS.find(
        (group) => group.id === 'manager',
    )!;

    const orderedGroups =
        userRole === 'manager'
            ? [managerGroup, dispatchGroup]
            : [dispatchGroup, managerGroup];

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            type="button"
                            variant="default"
                            size="sm"
                            className="ml-auto gap-1.5"
                        >
                            <span className="hidden sm:inline">Quicklinks</span>
                            <SquareArrowUpRight className="size-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-sm bg-white text-foreground">
                        <DialogHeader>
                            <DialogTitle>Quicklinks</DialogTitle>
                            <DialogDescription>
                                External tools and resources for daily
                                operations.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col gap-3">
                            {orderedGroups.map((group) => (
                                <div
                                    key={group.id}
                                    className="overflow-hidden rounded-xl border border-border/70 shadow-sm"
                                >
                                    <div
                                        className={`flex items-center gap-2 px-3.5 py-2.5 ${group.headerClass}`}
                                    >
                                        <span
                                            className={`flex size-6 shrink-0 items-center justify-center rounded-md ${group.chipClass}`}
                                        >
                                            <group.icon className="size-3.5" />
                                        </span>
                                        <p className="text-[11px] font-extrabold tracking-wider text-white uppercase">
                                            {group.label}
                                        </p>
                                    </div>
                                    <div className="flex flex-col bg-white">
                                        {group.links.map((link, index) => (
                                            <div key={link.url}>
                                                {index > 0 && (
                                                    <Separator className="bg-border" />
                                                )}
                                                <a
                                                    href={link.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group/link flex items-center justify-between px-3.5 py-2.5 text-sm transition-colors hover:bg-foreground/5"
                                                >
                                                    <span className="flex items-center gap-2.5 text-foreground/80">
                                                        <link.icon
                                                            className={`size-4 shrink-0 ${group.iconClass}`}
                                                        />
                                                        <span className="font-medium">
                                                            {link.label}
                                                        </span>
                                                    </span>
                                                    <ExternalLink className="size-3.5 text-foreground/40 transition-colors group-hover/link:text-foreground/70" />
                                                </a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>
            </header>
        </>
    );
}
