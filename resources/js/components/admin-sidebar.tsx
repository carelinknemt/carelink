import { Link } from '@inertiajs/react';
import { Ambulance, Car, DollarSign, ExternalLink } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard, fleet, services } from '@/routes/admin';
import type { NavItem } from '@/types';

const adminNavItems: NavItem[] = [
    {
        title: 'Dispatch Overview',
        href: dashboard(),
        icon: Ambulance,
    },
    {
        title: 'Fleet Status',
        href: fleet(),
        icon: Car,
    },
    {
        title: 'Service Rates',
        href: services(),
        icon: DollarSign,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'View Public Site',
        href: '/',
        icon: ExternalLink,
    },
];

export function AdminSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={adminNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
