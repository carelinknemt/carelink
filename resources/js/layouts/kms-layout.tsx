import FlashToasts from '@/components/flash-toasts';
import KmsSidebarLayoutTemplate from '@/layouts/kms/kms-sidebar-layout';
import type { BreadcrumbItem } from '@/types';

export default function KmsLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <KmsSidebarLayoutTemplate breadcrumbs={breadcrumbs}>
            {children}
            <FlashToasts />
        </KmsSidebarLayoutTemplate>
    );
}
