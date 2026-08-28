import { Link, usePage } from '@inertiajs/react';
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useIsMobile } from '@/hooks/use-mobile';
import type { NavGroup } from '@/types';
import type { SharedData } from '@/types';

const MOBILE_TITLES = ['Dashboard', 'Job Openings'];

export function NavMain({ groups = [] }: { groups: NavGroup[] }) {
    const { isCurrentUrl } = useCurrentUrl();
    const { auth } = usePage<SharedData>().props;
    const userRole = auth.user.role;
    const isMobile = useIsMobile();

    const filteredGroups = isMobile
        ? [
              {
                  label: '',
                  items: groups
                      .flatMap((g) => g.items)
                      .filter(
                          (item) =>
                              MOBILE_TITLES.includes(item.title) &&
                              (!item.roles || item.roles.includes(userRole)),
                      ),
              },
          ]
        : groups;

    return (
        <>
            {filteredGroups.map((group) => {
                const visibleItems = isMobile
                    ? group.items
                    : group.items.filter(
                          (item) =>
                              !item.roles || item.roles.includes(userRole),
                      );

                if (visibleItems.length === 0) {
                    return null;
                }

                return (
                    <SidebarGroup key={group.label} className="px-2 py-0">
                        {group.label && (
                            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
                        )}
                        <SidebarMenu>
                            {visibleItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={isCurrentUrl(item.href)}
                                        tooltip={{ children: item.title }}
                                    >
                                        <Link href={item.href} prefetch>
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                );
            })}
        </>
    );
}
