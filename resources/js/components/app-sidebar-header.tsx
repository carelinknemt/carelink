import { SquareArrowUpRight } from 'lucide-react';
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
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

const QUICK_LINK_GROUPS = [
    {
        label: 'Dispatch Links',
        links: [
            {
                label: 'Kinetic Scheduler',
                url: 'https://scheduler.kinetik.care/login',
            },
            { label: 'Bambi Dispatch Login', url: 'https://www.hibambi.com' },
            { label: 'GPS Tracking', url: 'https://login.us.vzconnect.com' },
            { label: 'Fuel Card', url: 'https://go.wexonline.com/login' },
            { label: 'Dialpad Calls', url: 'https://dialpad.com/start' },
        ],
    },
    {
        label: 'Manager Links',
        links: [
            {
                label: 'Run ADP',
                url: 'https://online.adp.com/signin/v1/?APPID=RUN&productId=80e309c3-70c3-bae1-e053-3505430b5495&Action=Login&Stc=False&ssru=branded',
            },
            { label: 'Kinetic RCM', url: 'https://rcm.kinetik.care/login' },
        ],
    },
];

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
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
                    <DialogContent className="bg-white text-foreground">
                        <DialogHeader>
                            <DialogTitle>Quicklinks</DialogTitle>
                            <DialogDescription>
                                External tools and resources for daily
                                operations.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col">
                            {QUICK_LINK_GROUPS.map((group) => (
                                <div
                                    key={group.label}
                                    className="flex flex-col"
                                >
                                    <p className="px-3 pt-3 pb-1 text-xs font-semibold tracking-wide text-foreground/50 uppercase">
                                        {group.label}
                                    </p>
                                    {group.links.map((link) => (
                                        <a
                                            key={link.url}
                                            href={link.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-foreground/5"
                                        >
                                            <span>{link.label}</span>
                                            <SquareArrowUpRight className="size-4 text-foreground/50" />
                                        </a>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </DialogContent>
                </Dialog>
            </header>
        </>
    );
}
