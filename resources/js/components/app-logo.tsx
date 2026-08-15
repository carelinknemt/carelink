import { useContext } from 'react';
import { SidebarContext } from '@/components/ui/sidebar';
import { COMPANY_INFO } from '@/data/carelink';

export default function AppLogo() {
    const sidebar = useContext(SidebarContext);

    if (sidebar?.state === 'collapsed') {
        return (
            <span className="flex aspect-square size-8 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
                <img
                    src={COMPANY_INFO.logoUrl}
                    alt={COMPANY_INFO.name}
                    className="h-7 w-7 object-cover object-left"
                    referrerPolicy="no-referrer"
                />
            </span>
        );
    }

    return (
        <span className="flex w-full min-w-0 items-center">
            <img
                src={COMPANY_INFO.logoUrl}
                alt={COMPANY_INFO.name}
                className="h-auto w-full max-w-full rounded-md bg-white px-2 py-1.5 object-contain"
                referrerPolicy="no-referrer"
            />
        </span>
    );
}
