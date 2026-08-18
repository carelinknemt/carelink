import { Link } from '@inertiajs/react';
import {
    BookOpen,
    Building2,
    FileQuestion,
    LayoutGrid,
    Users,
    Car,
    Ambulance,
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
import cmsRoutes from '@/routes/cms';
import type { NavGroup } from '@/types';

const navGroups: NavGroup[] = [
    {
        label: 'Website Content',
        items: [
            {
                title: 'Content Sections',
                href: cmsRoutes.index(),
                icon: LayoutGrid,
            },
        ],
    },
    {
        label: 'Collections',
        items: [
            {
                title: 'Services',
                href: cmsRoutes.services.index(),
                icon: Ambulance,
            },
            {
                title: 'Fleet',
                href: cmsRoutes.fleet.index(),
                icon: Car,
            },
            {
                title: 'Team',
                href: cmsRoutes.team.index(),
                icon: Users,
            },
            {
                title: 'FAQs',
                href: cmsRoutes.faqs.index(),
                icon: FileQuestion,
            },
            {
                title: 'Blog',
                href: cmsRoutes.blog.index(),
                icon: BookOpen,
            },
        ],
    },
    {
        label: 'Dispatch',
        items: [
            {
                title: 'Go to Dashboard',
                href: dashboard(),
                icon: Building2,
            },
        ],
    },
];

export function CmsSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="p-1.5">
                            <Link href={cmsRoutes.index()} prefetch>
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
