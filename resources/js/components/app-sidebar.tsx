import { Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Briefcase,
    Building2,
    CalendarCheck,
    CreditCard,
    LayoutGrid,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
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
import { dashboard } from '@/routes';
import {
    analytics,
    applications,
    bookings as dashboardBookings,
    businessPartners,
    jobOpenings,
    payments,
    users,
} from '@/routes/dashboard';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Bookings',
        href: dashboardBookings(),
        icon: CalendarCheck,
    },
    {
        title: 'Payments',
        href: payments(),
        icon: CreditCard,
    },
    {
        title: 'Users',
        href: users(),
        icon: Users,
    },
    {
        title: 'Applications',
        href: applications(),
        icon: Briefcase,
    },
    {
        title: 'Job Openings',
        href: jobOpenings(),
        icon: Building2,
    },
    {
        title: 'Business Partners',
        href: businessPartners(),
        icon: Building2,
    },
    {
        title: 'Analytics',
        href: analytics(),
        icon: BarChart3,
    },
];

export function AppSidebar() {
    const { auth } = usePage<{ auth: { user: { is_admin: boolean } | null } }>().props;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="p-1.5">
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain
                    items={mainNavItems.filter(
                        (item) =>
                            auth.user?.is_admin ||
                            !['Applications', 'Job Openings'].includes(
                                item.title,
                            ),
                    )}
                />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
