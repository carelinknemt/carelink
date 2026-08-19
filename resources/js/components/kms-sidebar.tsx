import { BookOpen, Building2, Home } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import AppLogo from '@/components/app-logo';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { kmsCategories } from '@/data/kms-docs';
import { KMS_CATEGORY_ICONS } from '@/data/kms-icons';
import { dashboard, kms } from '@/routes';

function parseHash(hash: string): [string | null, string | null] {
    const [category, article] = hash.replace(/^#\/?/, '').split('/');

    return [category || null, article || null];
}

function SidebarLink({
    href,
    children,
}: {
    href: string;
    children: ReactNode;
}) {
    return (
        <a
            href={href}
            className="flex min-h-8 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground transition-colors"
        >
            {children}
        </a>
    );
}

export function KmsSidebar() {
    const [routeHash, setRouteHash] = useState(() => window.location.hash);
    const [hashCategorySlug, hashArticleSlug] = parseHash(routeHash);

    useEffect(() => {
        const onHashChange = () => setRouteHash(window.location.hash);

        window.addEventListener('hashchange', onHashChange);

        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild className="p-1.5">
                            <a href={kms().url}>
                                <AppLogo />
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent className="overflow-y-auto">
                <SidebarGroup>
                    <SidebarGroupLabel>Knowledge Base</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                isActive={!hashCategorySlug}
                            >
                                <a href={kms().url}>
                                    <Home />
                                    <span>All topics</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>

                {kmsCategories.map((category) => {
                    const Icon = KMS_CATEGORY_ICONS[category.slug] ?? BookOpen;
                    const active = category.slug === hashCategorySlug;

                    return (
                        <SidebarGroup key={category.slug}>
                            <SidebarGroupLabel>
                                <Icon className="size-3.5" />
                                {category.title}
                            </SidebarGroupLabel>
                            <SidebarMenu>
                                {category.articles.map((article) => {
                                    const activeArticle =
                                        active &&
                                        article.slug === hashArticleSlug;

                                    return (
                                        <SidebarMenuItem key={article.slug}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={activeArticle}
                                            >
                                                <SidebarLink
                                                    href={`#/${category.slug}/${article.slug}`}
                                                >
                                                    <span className="min-w-0 truncate">
                                                        {article.title}
                                                    </span>
                                                </SidebarLink>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroup>
                    );
                })}

                <SidebarGroup>
                    <SidebarGroupLabel>Dispatch</SidebarGroupLabel>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild>
                                <a href={dashboard().url}>
                                    <Building2 />
                                    <span>Go to Dashboard</span>
                                </a>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
