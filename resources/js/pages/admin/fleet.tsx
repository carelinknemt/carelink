import { Head } from '@inertiajs/react';
import FleetStatusCard from '@/components/carelink/admin/fleet-status-card';
import { fleet as fleetUrl } from '@/routes/admin';
import type { FleetVehicle } from '@/types/carelink';

interface FleetProps {
    fleet: FleetVehicle[];
}

export default function Fleet({ fleet }: FleetProps) {
    return (
        <>
            <Head title="Fleet Status" />

            <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">Fleet Status</h2>
                    <p className="text-sm text-muted-foreground">Real-time ADA and wheelchair lift readiness across the Humboldt fleet</p>
                </div>

                <FleetStatusCard fleet={fleet} />
            </div>
        </>
    );
}

Fleet.layout = {
    breadcrumbs: [
        {
            title: 'Fleet Status',
            href: fleetUrl(),
        },
    ],
};
