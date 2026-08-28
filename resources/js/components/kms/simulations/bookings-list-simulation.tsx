import {
    ArrowDown,
    ArrowUp,
    ArrowUpDown,
    Download,
    Search,
    SlidersHorizontal,
    X,
} from 'lucide-react';
import { useState } from 'react';
import SimulationShell from '@/components/kms/simulation-shell';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
    Sheet,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from '@/components/ui/sheet';
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

const STATUSES = [
    'PENDING_DISPATCH',
    'BAMBI_DISPATCHED',
    'IN_TRANSIT',
    'COMPLETED',
    'CANCELLED',
];

function SortHeaderButton({
    label,
    column,
    sort,
    direction,
}: {
    label: string;
    column: string;
    sort: string;
    direction: string;
}) {
    const active = sort === column;

    return (
        <span className="inline-flex items-center gap-1 font-medium">
            {label}
            {active ? (
                direction === 'desc' ? (
                    <ArrowDown className="size-3.5" />
                ) : (
                    <ArrowUp className="size-3.5" />
                )
            ) : (
                <ArrowUpDown className="size-3.5 opacity-50" />
            )}
        </span>
    );
}

export default function BookingsListSimulation() {
    const [statuses, setStatuses] = useState(ROWS.map((row) => row.status));
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [draftStatus, setDraftStatus] = useState('');
    const [activeStatus, setActiveStatus] = useState('');

    const activeFilterCount = activeStatus ? 1 : 0;

    const filteredRows = activeStatus
        ? ROWS.filter((row) => row.status === activeStatus)
        : ROWS;

    return (
        <SimulationShell
            page="Bookings"
            description="The trips list as it looks in the dashboard. Play with the status picker to see how a booking changes."
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                        <p className="text-lg font-semibold">Bookings</p>
                        <p className="text-sm text-muted-foreground">
                            Paid trip bookings. Sorted by trip date by default.
                        </p>
                    </div>
                    <Button
                        id="kms-demo-bk-filters"
                        type="button"
                        variant="outline"
                        onClick={() => setFiltersOpen(true)}
                    >
                        <SlidersHorizontal />
                        Filters
                        {activeFilterCount > 0 && (
                            <span className="ml-1 inline-flex size-5 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
                                {activeFilterCount}
                            </span>
                        )}
                    </Button>
                </div>

                <Card>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-end">
                            <div className="grid gap-1.5">
                                <Label htmlFor="kms-demo-bk-search">
                                    Search
                                </Label>
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="kms-demo-bk-search"
                                        type="search"
                                        placeholder="Booking number, passenger, phone, or email…"
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                            <div className="grid gap-1.5">
                                <Label>Per page</Label>
                                <Select defaultValue="15">
                                    <SelectTrigger className="w-full sm:w-20">
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
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="w-full sm:w-auto"
                                    >
                                        <Download />
                                        Export
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>
                                        <Download />
                                        Export current results (CSV)
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </CardContent>
                </Card>

                {activeStatus && (
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="secondary" className="gap-1.5">
                            Status: {statusLabel(activeStatus)}
                            <button
                                type="button"
                                onClick={() => setActiveStatus('')}
                                className="ml-0.5 rounded-full p-0.5 hover:bg-muted"
                            >
                                <X className="size-3" />
                            </button>
                        </Badge>
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base" id="kms-demo-bk-count">
                            Showing 1&ndash;{filteredRows.length} of{' '}
                            {filteredRows.length} bookings
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-hidden rounded-md border">
                            <div className="overflow-x-auto">
                                <Table id="kms-demo-bk-table">
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Booking #</TableHead>
                                            <TableHead>
                                                <SortHeaderButton
                                                    label="Passenger"
                                                    column="passenger_name"
                                                    sort=""
                                                    direction=""
                                                />
                                            </TableHead>
                                            <TableHead>
                                                <SortHeaderButton
                                                    label="Trip Date"
                                                    column="trip_date"
                                                    sort=""
                                                    direction=""
                                                />
                                            </TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">
                                                <SortHeaderButton
                                                    label="Trip Price"
                                                    column="input_price"
                                                    sort=""
                                                    direction=""
                                                />
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredRows.map((row, index) => (
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
                                                        onValueChange={(
                                                            value,
                                                        ) =>
                                                            setStatuses(
                                                                (current) =>
                                                                    current.map(
                                                                        (
                                                                            status,
                                                                            i,
                                                                        ) =>
                                                                            i ===
                                                                            index
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
                                                            {STATUSES.map(
                                                                (option) => (
                                                                    <SelectItem
                                                                        key={
                                                                            option
                                                                        }
                                                                        value={
                                                                            option
                                                                        }
                                                                    >
                                                                        {statusLabel(
                                                                            option,
                                                                        )}
                                                                    </SelectItem>
                                                                ),
                                                            )}
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
                        </div>
                        <div className="mt-4 flex items-center justify-end gap-3">
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

            <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
                <SheetContent className="sm:max-w-md">
                    <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-1.5">
                            <Label htmlFor="filter-status">Status</Label>
                            <Select
                                value={draftStatus}
                                onValueChange={setDraftStatus}
                            >
                                <SelectTrigger
                                    id="filter-status"
                                    className="w-full"
                                >
                                    <SelectValue placeholder="All statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="__all">
                                        All statuses
                                    </SelectItem>
                                    {STATUSES.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {statusLabel(option)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <SheetFooter className="flex-row gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setDraftStatus('');
                                setActiveStatus('');
                                setFiltersOpen(false);
                            }}
                        >
                            <X />
                            Clear filters
                        </Button>
                        <Button
                            type="button"
                            onClick={() => {
                                setActiveStatus(
                                    draftStatus === '__all' ? '' : draftStatus,
                                );
                                setFiltersOpen(false);
                            }}
                        >
                            Apply filters
                        </Button>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </SimulationShell>
    );
}
