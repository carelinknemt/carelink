import { useState } from 'react';
import SimulationShell from '@/components/kms/simulation-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { statusLabel, formatDate, formatMoney } from '@/lib/bookings';

const ROWS = [
    {
        number: 'CL-2026-0018',
        passenger: 'Emma Johnson',
        date: '2026-08-20',
        status: 'PENDING_DISPATCH',
        price: 92,
    },
    {
        number: 'CL-2026-0021',
        passenger: 'Robert Miller',
        date: '2026-08-21',
        status: 'BAMBI_DISPATCHED',
        price: 78.5,
    },
    {
        number: 'CL-2026-0024',
        passenger: 'Sofia Garcia',
        date: '2026-08-22',
        status: 'IN_TRANSIT',
        price: 64,
    },
];

export default function BookingsListSimulation() {
    const [statuses, setStatuses] = useState(ROWS.map((row) => row.status));

    return (
        <SimulationShell
            page="Bookings"
            description="The trips list as it looks in the dashboard. Play with the status picker to see how a booking changes."
        >
            <div className="flex flex-col gap-4">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between text-base">
                            Filters
                            <Badge variant="secondary">0 active</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-1.5">
                            <Label htmlFor="kms-demo-bk-search">Search</Label>
                            <Input
                                id="kms-demo-bk-search"
                                type="search"
                                placeholder="Booking number, passenger, phone, or email…"
                            />
                            <p className="text-xs text-muted-foreground">
                                Results update as you type.
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">
                            Showing 1&ndash;3 of 3 bookings
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table id="kms-demo-bk-table">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Booking #</TableHead>
                                        <TableHead>Passenger</TableHead>
                                        <TableHead>Trip Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">
                                            Trip Price
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ROWS.map((row, index) => (
                                        <TableRow key={row.number}>
                                            <TableCell className="font-medium">
                                                {row.number}
                                            </TableCell>
                                            <TableCell className="font-medium">
                                                {row.passenger}
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(row.date)}
                                            </TableCell>
                                            <TableCell
                                                id={`kms-demo-bk-row-status-${index}`}
                                            >
                                                <Select
                                                    value={statuses[index]}
                                                    onValueChange={(value) =>
                                                        setStatuses((current) =>
                                                            current.map(
                                                                (status, i) =>
                                                                    i === index
                                                                        ? value
                                                                        : status,
                                                            ),
                                                        )
                                                    }
                                                >
                                                    <SelectTrigger
                                                        size="sm"
                                                        className="w-44"
                                                    >
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {[
                                                            'PENDING_DISPATCH',
                                                            'BAMBI_DISPATCHED',
                                                            'IN_TRANSIT',
                                                            'COMPLETED',
                                                            'CANCELLED',
                                                        ].map((option) => (
                                                            <SelectItem
                                                                key={option}
                                                                value={option}
                                                            >
                                                                {statusLabel(
                                                                    option,
                                                                )}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {formatMoney(row.price)}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                <Label className="text-xs">Per page</Label>
                                <Select defaultValue="15">
                                    <SelectTrigger size="sm" className="w-20">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {[15, 25, 50, 100].map((option) => (
                                            <SelectItem
                                                key={option}
                                                value={String(option)}
                                            >
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button
                                id="kms-demo-bk-export"
                                type="button"
                                variant="outline"
                                size="sm"
                            >
                                Export
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </SimulationShell>
    );
}
