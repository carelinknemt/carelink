import { Link } from '@inertiajs/react';
import { useState } from 'react';
import { ExternalLink, Link2 } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { SidebarTrigger } from '@/components/ui/sidebar';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

const QUICK_LINKS = [
    { label: 'HiBamBam', url: 'https://app.hibambi.com' },
    { label: 'Google Maps', url: 'https://maps.google.com' },
    { label: 'TripSpark', url: 'https://www.tripspark.com' },
    { label: 'RouteGenie', url: 'https://www.routegenie.com' },
    { label: 'Kaizen Health', url: 'https://www.kaizenhealth.com' },
];

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const [quickLinksOpen, setQuickLinksOpen] = useState(false);

    return (
        <>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
                <div className="flex items-center gap-2">
                    <SidebarTrigger className="-ml-1" />
                    <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
                <div className="ml-auto">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 text-muted-foreground"
                        onClick={() => setQuickLinksOpen(true)}
                    >
                        <Link2 className="size-4" />
                        <span className="hidden sm:inline">Quicklinks</span>
                    </Button>
                </div>
            </header>

            <Dialog open={quickLinksOpen} onOpenChange={setQuickLinksOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Quicklinks</DialogTitle>
                        <DialogDescription>
                            External tools and resources for daily operations.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-1">
                        {QUICK_LINKS.map((link) => (
                            <a
                                key={link.url}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted"
                            >
                                <span>{link.label}</span>
                                <ExternalLink className="size-3.5 text-muted-foreground" />
                            </a>
                        ))}
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
