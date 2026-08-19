import SimulationShell from '@/components/kms/simulation-shell';
import { Card, CardContent } from '@/components/ui/card';
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
import { formatDate, formatMoney } from '@/lib/bookings';

const SUMMARY = [
    { label: 'Total payments', value: '128', accent: false },
    { label: 'Collected', value: '$3,712.00', accent: true },
    { label: 'Pending', value: '$240.00', accent: false },
    { label: 'Refunded', value: '$90.00', accent: false },
];

const PAYMENT_BADGES: Record<string, { label: string; classes: string }> = {
    PAID: {
        label: 'Paid',
        classes: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    },
    PENDING: {
        label: 'Pending',
        classes: 'border-amber-200 bg-amber-50 text-amber-700',
    },
    REFUNDED: {
        label: 'Refunded',
        classes: 'border-rose-200 bg-rose-50 text-rose-700',
    },
};

const ROWS = [
    {
        number: 'CL-2026-0018',
        passenger: 'Emma Johnson',
        email: 'emma@example.com',
        date: '2026-08-19',
        status: 'PAID',
        fee: 30,
    },
    {
        number: 'CL-2026-0017',
        passenger: 'Robert Miller',
        email: 'robert@example.com',
        date: '2026-08-18',
        status: 'REFUNDED',
        fee: 30,
    },
    {
        number: 'CL-2026-0016',
        passenger: 'Sofia Garcia',
        email: 'sofia@example.com',
        date: '2026-08-17',
        status: 'PENDING',
        fee: 30,
    },
];

export default function PaymentsSimulation() {
    return (
        <SimulationShell
            page="Payments"
            description="The payments record: what was collected, what is pending, and what was refunded."
        >
            <div className="flex flex-col gap-4">
                <div
                    className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                    id="kms-demo-pm-summary"
                >
                    {SUMMARY.map((item) => (
                        <Card
                            key={item.label}
                            className={
                                item.accent
                                    ? 'bg-primary text-primary-foreground'
                                    : ''
                            }
                        >
                            <CardContent className="p-5">
                                <p
                                    className={
                                        item.accent
                                            ? 'text-sm font-medium text-primary-foreground/80'
                                            : 'text-sm font-medium text-muted-foreground'
                                    }
                                >
                                    {item.label}
                                </p>
                                <p className="mt-1 text-2xl font-bold tracking-tight">
                                    {item.value}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Card>
                    <CardContent className="flex flex-col gap-4 pt-6">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <p className="text-sm text-muted-foreground">
                                Showing 1&ndash;3 of 3 payments
                            </p>
                            <div id="kms-demo-pm-status-filter">
                                <Select defaultValue="__all">
                                    <SelectTrigger
                                        size="sm"
                                        className="w-full sm:w-48"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all">
                                            All payments
                                        </SelectItem>
                                        <SelectItem value="PAID">
                                            Paid
                                        </SelectItem>
                                        <SelectItem value="PENDING">
                                            Pending
                                        </SelectItem>
                                        <SelectItem value="refunded">
                                            Refunded
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="overflow-x-auto" id="kms-demo-pm-table">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Booking #</TableHead>
                                        <TableHead>Passenger</TableHead>
                                        <TableHead>Trip Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">
                                            Fee
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ROWS.map((row) => {
                                        const badge =
                                            PAYMENT_BADGES[row.status];

                                        return (
                                            <TableRow key={row.number}>
                                                <TableCell className="font-medium">
                                                    {row.number}
                                                </TableCell>
                                                <TableCell>
                                                    <p className="font-medium">
                                                        {row.passenger}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {row.email}
                                                    </p>
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(row.date)}
                                                </TableCell>
                                                <TableCell>
                                                    <span
                                                        id={`kms-demo-pm-badge-${row.status}`}
                                                        className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${badge.classes}`}
                                                    >
                                                        {badge.label}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {formatMoney(row.fee)}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </SimulationShell>
    );
}
