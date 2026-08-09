import { router } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import { Ambulance, Car, Clock, LogOut, RefreshCw, ShieldCheck } from 'lucide-react';
import DispatchTable from '@/components/carelink/admin/dispatch-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useFlashToast } from '@/hooks/use-flash-toast';
import { dashboard as dashboardUrl, logout } from '@/routes/admin';
import type { FleetVehicle, Paginated, RideBooking } from '@/types/carelink';

interface DashboardProps {
    bookings: Paginated<RideBooking>;
    fleet: FleetVehicle[];
    activeRidesCount: number;
    pendingRidesCount: number;
}

export default function Dashboard({ bookings, fleet, activeRidesCount, pendingRidesCount }: DashboardProps) {
    useFlashToast();

    const handleRefresh = () => {
        router.reload({ only: ['bookings', 'fleet', 'services', 'activeRidesCount', 'pendingRidesCount'] });
    };

    const handleLogout = () => {
        router.post(logout().url);
    };

    return (
        <>
            <Head title="Dispatch Overview" />

            <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-xl font-semibold tracking-tight">Dispatch Overview</h2>
                        <p className="text-sm text-muted-foreground">Live transport requests, fleet readiness, and dispatch actions</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={handleRefresh}>
                            <RefreshCw className="mr-2 h-4 w-4" />
                            Refresh
                        </Button>
                        <Button variant="destructive" size="sm" onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </div>
                </div>

                <div className="grid auto-rows-min gap-4 md:grid-cols-2 xl:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Active Scheduled Trips</CardTitle>
                            <Ambulance className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{activeRidesCount}</div>
                            <CardDescription>Rides dispatched or in transit</CardDescription>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
                            <Clock className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{pendingRidesCount}</div>
                            <CardDescription>Requests awaiting dispatch</CardDescription>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Active Fleet</CardTitle>
                            <Car className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{fleet.length}</div>
                            <CardDescription>ADA-equipped transport units</CardDescription>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-sm font-medium">Bambi Integration</CardTitle>
                            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-emerald-600">Connected</div>
                            <CardDescription>Dispatch feed is live</CardDescription>
                        </CardContent>
                    </Card>
                </div>

                <DispatchTable bookings={bookings} />
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dispatch Overview',
            href: dashboardUrl(),
        },
    ],
};
