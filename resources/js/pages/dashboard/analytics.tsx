import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import {
    Activity,
    CalendarDays,
    DollarSign,
    Repeat,
    TicketPercent,
    TrendingUp,
} from 'lucide-react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/bookings';
import { analytics } from '@/routes/dashboard';
import type {
    AnalyticsLabelCount,
    AnalyticsPageProps,
} from '@/types/dashboard';

const DAY_OPTIONS = [7, 30, 90, 365];

const SERIES_COLORS = [
    '#004B87',
    '#E64A19',
    '#0e7490',
    '#7c3aed',
    '#d97706',
    '#059669',
];

function ChartCard({
    title,
    children,
    className,
}: {
    title: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-64">{children}</div>
            </CardContent>
        </Card>
    );
}

function SummaryCard({
    title,
    value,
    caption,
    icon,
}: {
    title: string;
    value: string;
    caption: string;
    icon: React.ReactNode;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <span className="flex size-8 items-center justify-center rounded-md bg-[#004b87]/10">
                    {icon}
                </span>
            </CardHeader>
            <CardContent>
                <p className="text-3xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{caption}</p>
            </CardContent>
        </Card>
    );
}

export default function DashboardAnalytics(props: AnalyticsPageProps) {
    const {
        days,
        date_from,
        date_to,
        range,
        summary,
        daily,
        statuses,
        services,
        repeat_passengers,
    } = props;

    const [customOpen, setCustomOpen] = useState(false);
    const [fromValue, setFromValue] = useState(date_from ?? '');
    const [toValue, setToValue] = useState(date_to ?? '');

    const isCustomRange = date_from !== null && date_to !== null;

    function changePeriod(value: number) {
        if (value === days) {
            return;
        }

        router.get(
            analytics.url({ query: { days: String(value) } }),
            {},
            { preserveState: true, preserveScroll: true },
        );
    }

    function applyCustomRange() {
        if (!fromValue || !toValue) {
            return;
        }

        router.get(
            analytics.url({
                query: { date_from: fromValue, date_to: toValue },
            }),
            {},
            { preserveState: true, preserveScroll: true },
        );

        setCustomOpen(false);
    }

    function openCustomDialog() {
        setFromValue(date_from ?? '');
        setToValue(date_to ?? '');
        setCustomOpen(true);
    }

    return (
        <>
            <Head title="Analytics">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Analytics
                            </h1>
                            <span className="rounded-full border bg-muted/50 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                                {isCustomRange
                                    ? `${formatDate(range.from)} – ${formatDate(range.to)}`
                                    : `Last ${days} days`}
                            </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {formatDate(range.from)} – {formatDate(range.to)}
                        </p>
                    </div>
                    <div className="flex items-center gap-1">
                        {DAY_OPTIONS.map((option) => (
                            <Button
                                key={option}
                                type="button"
                                size="sm"
                                variant={
                                    !isCustomRange && days === option
                                        ? 'default'
                                        : 'outline'
                                }
                                onClick={() => changePeriod(option)}
                            >
                                {option >= 365 ? '1 year' : `${option} days`}
                            </Button>
                        ))}
                        <Button
                            type="button"
                            size="sm"
                            variant={isCustomRange ? 'default' : 'outline'}
                            onClick={openCustomDialog}
                        >
                            Custom range
                        </Button>
                    </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                        title="Bookings"
                        value={String(summary.bookings)}
                        caption="Paid trips in period"
                        icon={
                            <CalendarDays className="size-4 text-[#004B87]" />
                        }
                    />
                    <SummaryCard
                        title="Booking Fee Revenue"
                        value={`$${summary.revenue.toFixed(2)}`}
                        caption="$30 fee per paid booking"
                        icon={
                            <DollarSign className="size-4 text-emerald-600" />
                        }
                    />
                    <SummaryCard
                        title="Avg Trip Price"
                        value={`$${summary.avg_trip_price.toFixed(2)}`}
                        caption="Across booked trips"
                        icon={
                            <TicketPercent className="size-4 text-[#E64A19]" />
                        }
                    />
                    <SummaryCard
                        title="Completion Rate"
                        value={`${summary.completed_rate.toFixed(1)}%`}
                        caption="Completed vs booked"
                        icon={<Activity className="size-4 text-[#0e7490]" />}
                    />
                </div>

                <div className="grid items-start gap-4 lg:grid-cols-2">
                    <ChartCard title="Bookings per Day">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={daily}
                                margin={{
                                    top: 5,
                                    right: 8,
                                    left: -20,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    className="stroke-slate-200"
                                />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 11 }}
                                    minTickGap={28}
                                    tickFormatter={(value: string) =>
                                        new Intl.DateTimeFormat('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                        }).format(new Date(value))
                                    }
                                />
                                <YAxis
                                    allowDecimals={false}
                                    tick={{ fontSize: 11 }}
                                />
                                <Tooltip
                                    labelFormatter={(label: string) =>
                                        formatDate(label)
                                    }
                                    formatter={(value) => [value, 'Bookings']}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="bookings"
                                    stroke="#004B87"
                                    fill="#004B87"
                                    fillOpacity={0.15}
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title="Booking Fee Revenue per Day">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={daily}
                                margin={{
                                    top: 5,
                                    right: 8,
                                    left: -20,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    className="stroke-slate-200"
                                />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 11 }}
                                    minTickGap={28}
                                    tickFormatter={(value: string) =>
                                        new Intl.DateTimeFormat('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                        }).format(new Date(value))
                                    }
                                />
                                <YAxis
                                    tick={{ fontSize: 11 }}
                                    tickFormatter={(value: number) =>
                                        `$${value}`
                                    }
                                />
                                <Tooltip
                                    labelFormatter={(label: string) =>
                                        formatDate(label)
                                    }
                                    formatter={(value) => [
                                        `$${Number(value).toFixed(2)}`,
                                        'Revenue',
                                    ]}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#059669"
                                    fill="#059669"
                                    fillOpacity={0.15}
                                    strokeWidth={2}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title="Status Distribution">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statuses}
                                    dataKey="count"
                                    nameKey="label"
                                    innerRadius={55}
                                    outerRadius={85}
                                    paddingAngle={2}
                                    strokeWidth={2}
                                    label={({
                                        payload,
                                    }: {
                                        payload?: AnalyticsLabelCount;
                                    }) =>
                                        formatShortLabel(payload?.label ?? '')
                                    }
                                >
                                    {statuses.map((entry, index) => (
                                        <Cell
                                            key={entry.label}
                                            fill={
                                                SERIES_COLORS[
                                                    index % SERIES_COLORS.length
                                                ]
                                            }
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    formatter={(value, name) => [value, name]}
                                />
                                <Legend
                                    formatter={(value: string) => (
                                        <span className="text-xs">
                                            {shortStatusLabel(value)}
                                        </span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </ChartCard>

                    <ChartCard title="Service Type Breakdown">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={services}
                                margin={{
                                    top: 5,
                                    right: 8,
                                    left: -20,
                                    bottom: 0,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    className="stroke-slate-200"
                                />
                                <XAxis
                                    dataKey="label"
                                    tick={{ fontSize: 11 }}
                                    interval={0}
                                    angle={-18}
                                    textAnchor="end"
                                    height={55}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    tick={{ fontSize: 11 }}
                                />
                                <Tooltip
                                    formatter={(value) => [value, 'Bookings']}
                                />
                                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                                    {services.map((entry, index) => (
                                        <Cell
                                            key={entry.label}
                                            fill={
                                                SERIES_COLORS[
                                                    index % SERIES_COLORS.length
                                                ]
                                            }
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </ChartCard>
                </div>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Repeat className="size-4 text-[#004B87]" />
                            Repeat Passengers
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {repeat_passengers.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-10 text-center">
                                <TrendingUp className="size-8 text-muted-foreground" />
                                <p className="font-medium">
                                    No repeat passengers yet
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Passengers with more than one booking in the
                                    selected period appear here.
                                </p>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Passenger</TableHead>
                                        <TableHead className="text-right">
                                            Trips in period
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {repeat_passengers.map((passenger) => (
                                        <TableRow key={passenger.name}>
                                            <TableCell className="font-medium">
                                                {passenger.name}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {passenger.trips}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={customOpen} onOpenChange={setCustomOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Custom Date Range</DialogTitle>
                        <DialogDescription>
                            Select a start and end date to filter analytics.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 sm:flex-row">
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="date_from"
                                className="text-sm font-medium"
                            >
                                From
                            </label>
                            <Input
                                id="date_from"
                                type="date"
                                value={fromValue}
                                onChange={(e) => setFromValue(e.target.value)}
                                max={toValue || undefined}
                            />
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label
                                htmlFor="date_to"
                                className="text-sm font-medium"
                            >
                                To
                            </label>
                            <Input
                                id="date_to"
                                type="date"
                                value={toValue}
                                onChange={(e) => setToValue(e.target.value)}
                                min={fromValue || undefined}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setCustomOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            onClick={applyCustomRange}
                            disabled={!fromValue || !toValue}
                        >
                            Apply
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

function formatShortLabel(label: string): string {
    return label
        .replaceAll('_', ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

function shortStatusLabel(label: string): string {
    switch (label) {
        case 'PENDING_DISPATCH':
            return 'Pending';
        case 'BAMBI_DISPATCHED':
            return 'Dispatched';
        case 'IN_TRANSIT':
            return 'In Transit';
        case 'COMPLETED':
            return 'Completed';
        default:
            return formatShortLabel(label);
    }
}

DashboardAnalytics.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: analytics(),
        },
        {
            title: 'Analytics',
            href: analytics(),
        },
    ],
};
