import CmsSidebarLayoutTemplate from '@/layouts/cms/cms-sidebar-layout';
import type { BreadcrumbItem } from '@/types';

export default function CmsLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <CmsSidebarLayoutTemplate breadcrumbs={breadcrumbs}>
            {children}
        </CmsSidebarLayoutTemplate>
    );
}
