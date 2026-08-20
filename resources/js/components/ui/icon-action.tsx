import type { ReactNode } from 'react';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export function IconAction({
    label,
    children,
    side = 'top',
}: {
    label: string;
    children: ReactNode;
    side?: 'top' | 'right' | 'bottom' | 'left';
}) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>{children}</TooltipTrigger>
            <TooltipContent side={side}>{label}</TooltipContent>
        </Tooltip>
    );
}