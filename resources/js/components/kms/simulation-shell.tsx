import { MonitorPlay } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function SimulationShell({
    page,
    description,
    children,
}: {
    page: string;
    description: string;
    children: React.ReactNode;
}) {
    return (
        <div className="overflow-hidden rounded-xl border">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b bg-slate-100 px-4 py-3">
                <p className="flex items-center gap-2 text-sm font-semibold">
                    <MonitorPlay className="size-4 shrink-0 text-[#E64A19]" />
                    {page}
                </p>
                <Badge variant="secondary">Interactive demo</Badge>
            </div>
            <p className="border-b bg-white px-4 py-2 text-xs text-muted-foreground">
                {description}
            </p>
            <div className="bg-slate-50 p-4 sm:p-6">{children}</div>
        </div>
    );
}
