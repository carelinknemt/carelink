import { useContext } from 'react';
import { SidebarContext } from '@/components/ui/sidebar';
import { useCompanyInfo } from '@/lib/cms';

export default function AppLogo() {
    const sidebar = useContext(SidebarContext);
    const company = useCompanyInfo();

    if (sidebar?.state === 'collapsed') {
        return (
            <span className="flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
                <img
                    src={company.logo_url}
                    alt={company.name}
                    className="h-7 w-7 object-cover object-left"
                    referrerPolicy="no-referrer"
                />
            </span>
        );
    }

    return (
        <span className="flex w-full min-w-0 items-center">
            <img
                src={company.logo_url}
                alt={company.name}
                className="h-auto w-full max-w-full rounded-md bg-white object-contain px-2 py-1.5"
                referrerPolicy="no-referrer"
            />
        </span>
    );
}
