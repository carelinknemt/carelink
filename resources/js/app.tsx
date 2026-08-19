import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme, setIsPublicPage } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import CarelinkLayout from '@/layouts/carelink-layout';
import CmsLayout from '@/layouts/cms-layout';
import KmsLayout from '@/layouts/kms-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    layout: (name) => {
        switch (true) {
            case [
                'home',
                'services',
                'fleet',
                'about',
                'faqs',
                'blog',
                'careers',
                'business',
                'book',
                'bookings/track',
                'terms',
                'error',
            ].includes(name):
                setIsPublicPage(true);

                return CarelinkLayout;
            case name === 'welcome':
                setIsPublicPage(true);

                return null;
            case name.startsWith('auth/'):
                setIsPublicPage(true);

                return AuthLayout;
            case name.startsWith('cms/'):
                setIsPublicPage(false);

                return CmsLayout;
            case name.startsWith('kms'):
                setIsPublicPage(false);

                return KmsLayout;
            case name.startsWith('settings/'):
                setIsPublicPage(false);

                return [AppLayout, SettingsLayout];
            default:
                setIsPublicPage(false);

                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
