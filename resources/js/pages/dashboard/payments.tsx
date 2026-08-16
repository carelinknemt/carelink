import { Head, Link, router, useForm } from '@inertiajs/react';
import { BadgeDollarSign, Search, Undo2 } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
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
import { cn } from '@/lib/utils';
import { payments as dashboardPayments } from '@/routes/dashboard';
import { refund as refundPayment } from '@/routes/dashboard/payments';
import type { PaginatedPayments, PaymentRecord, PaymentsFilters, PaymentsSummary } from '@/types/dashboard';

type DashboardPaymentsProps = {
    payments: PaginatedPayments;
    summary: PaymentsSummary;
    filters: PaymentsFilters;
};

const PAYMENT_BADGES: Record<string, { label: string; className: string }> = {
    PAID: {
        label: 'Paid',
        className: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    PENDING: {
        label: 'Pending',
        className: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    REFUNDED: {
        label: 'Refunded',
        className: 'bg-rose-50 text-rose-700 border-rose-200',
    },
};

function paymentBadge(payment: PaymentRecord) {
    const key = payment.refunded_at !== null ? 'REFUNDED' : payment.payment_status;

    return PAYMENT_BADGES[key] ?? PAYMENT_BADGES.PENDING;
}

function paymentBadgeClasses(payment: PaymentRecord) {
    return paymentBadge(payment).className;
}

function paymentBadgeLabel(payment: PaymentRecord) {
    return paymentBadge(payment).label;
}

function SummaryCard({
    label,
    value,
    hint,
    accent,
}: {
    label: string;
    value: string;
    hint: string;
    accent?: boolean;
}) {
    return (
        <Card className={cn('relative overflow-hidden', accent && 'bg-primary text-primary-foreground')}>
            <CardContent className="p-5">
                <p className={cn('text-sm font-medium', accent ? 'text-primary-foreground/80' : 'text-muted-foreground')}>
                    {label}
                </p>
                <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
                <p className={cn('mt-1 text-xs', accent ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                    {hint}
                </p>
            </CardContent>
        </Card>
    );
}

export default function DashboardPayments({
    payments,
    summary,
    filters,
}: DashboardPaymentsProps) {
    const form = useForm({
        search: filters.search ?? '',
        status: filters.status ?? '',
    });

    const searchTimer = useRef<number | null>(null);

    const [refundTarget, setRefundTarget] = useState<PaymentRecord | null>(null);

    function navigate() {
        form.get(dashboardPayments.url(), {
            preserveState: true,
            preserveScroll: true,
        });
    }

    useEffect(() => {
        return () => {
            if (searchTimer.current !== null) {
                window.clearTimeout(searchTimer.current);
            }
        };
    }, []);

    function changeSearch(value: string) {
        form.setData('search', value);

        if (searchTimer.current !== null) {
            window.clearTimeout(searchTimer.current);
        }

        searchTimer.current = window.setTimeout(navigate, 350);
    }

    function changeStatus(value: string) {
        form.setData('status', value);
        navigate();
    }

    function submitSearch(event: FormEvent) {
        event.preventDefault();

        if (searchTimer.current !== null) {
            window.clearTimeout(searchTimer.current);
            searchTimer.current = null;
        }

        navigate();
    }

    function clearFilters() {
        if (searchTimer.current !== null) {
            window.clearTimeout(searchTimer.current);
            searchTimer.current = null;
        }

        form.setData('search', '');
        form.setData('status', '');
        navigate();
    }

    const hasFilters = Boolean(filters.search || filters.status);

    return (
        <>
            <Head title="Payments">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Payments</h1>
                    <p className="text-muted-foreground text-sm">
                        Booking fees processed through Stripe checkout, with refunds.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <SummaryCard
                        label="Total payments"
                        value={String(summary.total_payments)}
                        hint="Bookings that reached checkout"
                    />
                    <SummaryCard
                        label="Collected"
                        value={formatMoney(summary.collected)}
                        hint="Paid booking fees"
                        accent
                    />
                    <SummaryCard
                        label="Pending"
                        value={formatMoney(summary.pending)}
                        hint="Unpaid checkout sessions"
                    />
                    <SummaryCard
                        label="Refunded"
                        value={formatMoney(summary.refunded)}
                        hint="Fees refunded to passengers"
                    />
                </div>

                <Card className="flex-1">
                    <div className="flex flex-col items-start justify-between gap-3 px-6 pt-6 sm:flex-row sm:items-center">
                        <p className="text-muted-foreground text-sm">
                            Showing {payments.from ?? 0}–{payments.to ?? 0} of {payments.total}{' '}
                            payments
                        </p>
                        <div className="flex w-full items-center gap-2 sm:w-auto">
                            <Select
                                value={form.data.status}
                                onValueChange={changeStatus}
                            >
                                <SelectTrigger size="sm" className="w-full sm:w-48">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="__all">All payments</SelectItem>
                                    <SelectItem value="PAID">Paid</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="refunded">Refunded</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={clearFilters}
                                disabled={!hasFilters}
                            >
                                <Search className="size-4" />
                                Clear
                            </Button>
                        </div>
                    </div>

                    <CardContent className="pt-6">
                        <form onSubmit={submitSearch} className="mb-5 flex flex-col gap-1.5 sm:max-w-xl">
                            <Label htmlFor="payment-search">Search</Label>
                            <div className="relative">
                                <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                                <Input
                                    id="payment-search"
                                    type="search"
                                    placeholder="Booking number, passenger, or email…"
                                    className="pl-9"
                                    value={form.data.search}
                                    onChange={(event) => changeSearch(event.target.value)}
                                />
                            </div>
                            <p className="text-muted-foreground text-xs">
                                Results update as you type.
                            </p>
                        </form>

                        {payments.data.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-16 text-center">
                                <BadgeDollarSign className="text-muted-foreground size-10" />
                                <p className="font-medium">No payments found</p>
                                <p className="text-muted-foreground text-sm">
                                    {hasFilters
                                        ? 'Try adjusting your search or payment status filter.'
                                        : 'Payments appear here once a booking reaches the Stripe checkout.'}
                                </p>
                            </div>
                        ) : (
                            <>
                                <ul className="flex flex-col gap-3 md:hidden">
                                    {payments.data.map((payment) => (
                                        <li key={payment.id} className="border-border rounded-lg border p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="font-medium">
                                                        {payment.booking_number}
                                                    </p>
                                                    <p className="text-muted-foreground text-sm">
                                                        {payment.passenger_name}
                                                    </p>
                                                </div>
                                                <span className="shrink-0 font-medium">
                                                    {formatMoney(payment.amount)}
                                                </span>
                                            </div>
                                            <div className="mt-3 flex items-center justify-between gap-3">
                                                <span className="text-muted-foreground text-sm">
                                                    {formatDate(payment.trip_date)}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <span
                                                        className={cn(
                                                            'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
                                                            paymentBadgeClasses(payment),
                                                        )}
                                                    >
                                                        {paymentBadgeLabel(payment)}
                                                    </span>
                                                    {payment.payment_status === 'PAID' &&
                                                        payment.refunded_at === null && (
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    setRefundTarget(payment)
                                                                }
                                                            >
                                                                Refund
                                                            </Button>
                                                        )}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <div className="hidden md:block">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Booking #</TableHead>
                                                <TableHead>Passenger</TableHead>
                                                <TableHead>Trip Date</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead className="text-right">Fee</TableHead>
                                                <TableHead className="text-right">Actions</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {payments.data.map((payment) => (
                                                <TableRow key={payment.id}>
                                                    <TableCell className="font-medium">
                                                        {payment.booking_number}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="flex flex-col">
                                                            <span>{payment.passenger_name}</span>
                                                            {payment.passenger_email && (
                                                                <span className="text-muted-foreground text-xs">
                                                                    {payment.passenger_email}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatDate(payment.trip_date)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span
                                                            className={cn(
                                                                'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
                                                                paymentBadgeClasses(payment),
                                                            )}
                                                        >
                                                            {paymentBadgeLabel(payment)}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {formatMoney(payment.amount)}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {payment.payment_status === 'PAID' &&
                                                        payment.refunded_at === null ? (
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    setRefundTarget(payment)
                                                                }
                                                            >
                                                                <Undo2 />
                                                                Refund
                                                            </Button>
                                                        ) : (
                                                            <span className="text-muted-foreground text-sm">
                                                                —
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </>
                        )}

                        {payments.last_page > 1 && (
                            <div className="mt-6 hidden md:block">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            {payments.prev_page_url ? (
                                                <PaginationPrevious asChild>
                                                    <Link href={payments.prev_page_url} prefetch>
                                                        <span className="hidden sm:block">Previous</span>
                                                    </Link>
                                                </PaginationPrevious>
                                            ) : (
                                                <PaginationPrevious
                                                    className="pointer-events-none opacity-50"
                                                    aria-disabled="true"
                                                />
                                            )}
                                        </PaginationItem>
                                        {payments.links.map((link) => {
                                            if (link.url === null) {
                                                return null;
                                            }

                                            const label =
                                                link.label === '&laquo; Previous'
                                                    ? '…'
                                                    : link.label === '&raquo; Next'
                                                      ? '…'
                                                      : link.label;

                                            return (
                                                <PaginationItem key={`${link.label}-${link.url}`}>
                                                    <PaginationLink
                                                        href={link.url}
                                                        isActive={link.active}
                                                                                                            >
                                                        {label}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        })}
                                        <PaginationItem>
                                            {payments.next_page_url ? (
                                                <PaginationNext asChild>
                                                    <Link href={payments.next_page_url} prefetch>
                                                        <span className="hidden sm:block">Next</span>
                                                    </Link>
                                                </PaginationNext>
                                            ) : (
                                                <PaginationNext
                                                    className="pointer-events-none opacity-50"
                                                    aria-disabled="true"
                                                />
                                            )}
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}

                        {payments.last_page > 1 && (
                            <div className="mt-6 flex justify-center md:hidden">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            {payments.prev_page_url ? (
                                                <PaginationPrevious asChild>
                                                    <Link href={payments.prev_page_url} prefetch />
                                                </PaginationPrevious>
                                            ) : (
                                                <PaginationPrevious
                                                    className="pointer-events-none opacity-50"
                                                    aria-disabled="true"
                                                />
                                            )}
                                        </PaginationItem>
                                        <PaginationItem>
                                            {payments.next_page_url ? (
                                                <PaginationNext asChild>
                                                    <Link href={payments.next_page_url} prefetch />
                                                </PaginationNext>
                                            ) : (
                                                <PaginationNext
                                                    className="pointer-events-none opacity-50"
                                                    aria-disabled="true"
                                                />
                                            )}
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            <Dialog
                open={refundTarget !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setRefundTarget(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            Refund the {formatMoney(refundTarget?.amount)} booking fee?
                        </DialogTitle>
                        <DialogDescription>
                            Refund the fee paid for {refundTarget?.booking_number} (
                            {refundTarget?.passenger_name}). The booking itself stays active and
                            will not be cancelled or emailed.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Keep payment
                            </Button>
                        </DialogClose>
                        <Button
                            type="button"
                            onClick={() => {
                                if (!refundTarget) {
                                    return;
                                }

                                router.post(
                                    refundPayment.url({ booking: refundTarget.id }),
                                    {},
                                    {
                                        preserveScroll: true,
                                        onSuccess: () => setRefundTarget(null),
                                    },
                                );
                            }}
                        >
                            <Undo2 />
                            Refund fee
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}