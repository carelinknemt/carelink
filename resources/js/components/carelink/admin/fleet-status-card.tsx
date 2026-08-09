import { CheckCircle2, Car } from 'lucide-react';
import { useState } from 'react';
import ViewToggle from '@/components/carelink/admin/view-toggle';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { FleetVehicle } from '@/types/carelink';

interface FleetStatusCardProps {
    fleet: FleetVehicle[];
}

function GridView({ fleet }: { fleet: FleetVehicle[] }) {
    return (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {fleet.map((vehicle) => (
                <Card key={vehicle.id} className="flex flex-col">
                    <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <span className="font-mono text-xs font-semibold text-muted-foreground">UNIT #{vehicle.id}</span>
                                <CardTitle className="mt-1 flex items-center gap-2 text-base">
                                    <Car className="h-4 w-4 text-muted-foreground" />
                                    {vehicle.name}
                                </CardTitle>
                            </div>
                            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                                Active Duty
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-2 text-sm">
                        <p className="line-clamp-2 text-muted-foreground">{vehicle.description}</p>
                        <div className="space-y-1 text-sm">
                            <p>
                                <span className="text-muted-foreground">Capacity:</span> {vehicle.capacity}
                            </p>
                            <p>
                                <span className="text-muted-foreground">Key Features:</span> {vehicle.features.join(', ')}
                            </p>
                        </div>
                    </CardContent>
                    <div className="flex items-center justify-between border-t border-sidebar-border/70 px-6 py-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-medium text-emerald-700">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Wheelchair Lift Certified
                        </span>
                        <span>Sanitized</span>
                    </div>
                </Card>
            ))}
        </div>
    );
}

function ListView({ fleet }: { fleet: FleetVehicle[] }) {
    return (
        <div className="overflow-x-auto rounded-xl border border-sidebar-border/70">
            <table className="w-full text-left text-sm">
                <thead className="border-b border-sidebar-border/70 bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                    <tr>
                        <th className="px-4 py-3 font-medium">Unit</th>
                        <th className="px-4 py-3 font-medium">Vehicle</th>
                        <th className="px-4 py-3 font-medium">Capacity</th>
                        <th className="px-4 py-3 font-medium">Key Features</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-sidebar-border/70">
                    {fleet.map((vehicle) => (
                        <tr key={vehicle.id} className="transition-colors hover:bg-muted/50">
                            <td className="px-4 py-3.5 font-mono text-xs font-semibold text-muted-foreground">UNIT #{vehicle.id}</td>
                            <td className="px-4 py-3.5">
                                <div className="flex items-center gap-2 font-medium">
                                    <Car className="h-4 w-4 text-muted-foreground" />
                                    {vehicle.name}
                                </div>
                                <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{vehicle.description}</div>
                            </td>
                            <td className="px-4 py-3.5">{vehicle.capacity}</td>
                            <td className="max-w-md px-4 py-3.5">
                                <div className="flex flex-wrap gap-1">
                                    {vehicle.features.map((feature) => (
                                        <Badge key={feature} variant="secondary">
                                            {feature}
                                        </Badge>
                                    ))}
                                </div>
                            </td>
                            <td className="px-4 py-3.5">
                                <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                                    <CheckCircle2 className="mr-1 h-3 w-3" />
                                    Active Duty
                                </Badge>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function FleetStatusCard({ fleet }: FleetStatusCardProps) {
    const [view, setView] = useState<'list' | 'grid'>('grid');

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                    {fleet.length} units reporting <span className="font-medium text-emerald-700">Active Duty</span>
                </p>
                <ViewToggle view={view} onChange={setView} />
            </div>

            {view === 'grid' ? <GridView fleet={fleet} /> : <ListView fleet={fleet} />}
        </div>
    );
}
