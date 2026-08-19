import { useEffect } from 'react';
import { AppContent } from '@/components/app-content';
import { AppShell } from '@/components/app-shell';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import AccessibilityWidget from '@/components/carelink/accessibility-widget';
import { KmsSidebar } from '@/components/kms-sidebar';
import type { AppLayoutProps } from '@/types';

export default function KmsSidebarLayout({
    children,
    breadcrumbs = [],
}: AppLayoutProps) {
    useEffect(() => {
        document.documentElement.style.colorScheme = 'light';
    }, []);

    return (
        <AppShell variant="sidebar">
            <KmsSidebar />
            <AppContent variant="sidebar" className="overflow-x-hidden">
                <AppSidebarHeader breadcrumbs={breadcrumbs} />
                {children}
            </AppContent>
            <AccessibilityWidget />
        </AppShell>
    );
}
