import { Link } from '@inertiajs/react';
import {
    BarChart3,
    BookOpen,
    Briefcase,
    Building2,
    CalendarCheck,
    CreditCard,
    LayoutGrid,
    MessageSquareText,
    ShieldOff,
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
import { dashboard, kms } from '@/routes';
import cmsRoutes from '@/routes/cms';
import {
    analytics,
    applications,
    blacklist as dashboardBlacklist,
    bookings as dashboardBookings,
    businessPartners,
    contactMessages,
    jobOpenings,
    payments,
    users,
} from '@/routes/dashboard';
import type { NavGroup } from '@/types';

const navGroups: NavGroup[] = [
    {
        label: 'Overview',
        items: [
            {
                title: 'Dashboard',
                href: dashboard(),
                icon: LayoutGrid,
            },
            {
                title: 'Analytics',
                href: analytics(),
                icon: BarChart3,
                roles: ['manager', 'admin'],
            },
        ],
    },
    {
        label: 'Trips & Billing',
        items: [
            {
                title: 'Bookings',
                href: dashboardBookings(),
                icon: CalendarCheck,
                roles: ['dispatcher', 'admin'],
            },
            {
                title: 'Blacklisted Passengers',
                href: dashboardBlacklist(),
                icon: ShieldOff,
                roles: ['dispatcher', 'admin'],
            },
            {
                title: 'Payments',
                href: payments(),
                icon: CreditCard,
                roles: ['admin'],
            },
        ],
    },
    {
        label: 'Recruitment',
        items: [
            {
                title: 'Applications',
                href: applications(),
                icon: Briefcase,
                roles: ['manager', 'admin'],
            },
            {
                title: 'Job Openings',
                href: jobOpenings(),
                icon: Building2,
                roles: ['manager', 'admin'],
            },
        ],
    },
    {
        label: 'Resources',
        items: [
            {
                title: 'Knowledge Base',
                href: kms(),
                icon: BookOpen,
            },
        ],
    },
    {
        label: 'Administration',
        items: [
            {
                title: 'Users',
                href: users(),
                icon: Users,
                roles: ['admin'],
            },
            {
                title: 'Business Partners',
                href: businessPartners(),
                icon: Building2,
                roles: ['manager', 'admin'],
            },
            {
                title: 'Contact Messages',
                href: contactMessages(),
                icon: MessageSquareText,
                roles: ['dispatcher', 'manager', 'admin'],
            },
            {
                title: 'Website Content',
                href: cmsRoutes.index(),
                icon: LayoutGrid,
                roles: ['admin'],
            },
        ],
    },
];

export function AppSidebar() {
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
                <NavMain groups={navGroups} />
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
