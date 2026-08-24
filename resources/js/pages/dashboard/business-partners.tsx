import { Head, Link, useForm } from '@inertiajs/react';
import {
    Building2,
    Eye,
    MoreHorizontal,
    Search,
    ThumbsDown,
    ThumbsUp,
} from 'lucide-react';
import { useRef, useState } from 'react';
import type { FormEvent } from 'react';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
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
import { Textarea } from '@/components/ui/textarea';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatDateTime, statusBadgeClass } from '@/lib/bookings';
import { dashboard } from '@/routes';
import { businessPartners } from '@/routes/dashboard';
import {
    approve as approveRequest,
    reject as rejectRequest,
} from '@/routes/dashboard/business-partners';
import type { PaginatedBusinessPartnerRequests } from '@/types/dashboard';

type DashboardBusinessPartnersProps = {
    requests: PaginatedBusinessPartnerRequests;
    filters: { search?: string | null; status?: string | null };
    statuses: string[];
};

type BusinessRequestItem = PaginatedBusinessPartnerRequests['data'][number];

function statusLabel(status: string): string {
    return status.replaceAll('_', ' ');
}

export default function DashboardBusinessPartners({
    requests,
    filters,
    statuses,
}: DashboardBusinessPartnersProps) {
    const form = useForm({
        search: filters.search ?? '',
        status: filters.status ?? 'PENDING',
    });
    const searchTimer = useRef<number | null>(null);

    const [detailsTarget, setDetailsTarget] =
        useState<BusinessRequestItem | null>(null);
    const [approveTarget, setApproveTarget] =
        useState<BusinessRequestItem | null>(null);
    const [rejectTarget, setRejectTarget] =
        useState<BusinessRequestItem | null>(null);

    const approveForm = useForm({ email: '' });
    const rejectForm = useForm({ reason: '' });

    function navigate() {
        form.get(businessPartners.url(), {
            preserveState: true,
            preserveScroll: true,
        });
    }

    function applySearch(event: FormEvent) {
        event.preventDefault();

        if (searchTimer.current !== null) {
            window.clearTimeout(searchTimer.current);
            searchTimer.current = null;
        }

        navigate();
    }

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

    function openApprove(request: BusinessRequestItem) {
        approveForm.setData('email', request.email);
        setApproveTarget(request);
        setRejectTarget(null);
    }

    function openReject(request: BusinessRequestItem) {
        rejectForm.reset();
        setRejectTarget(request);
        setApproveTarget(null);
    }

    function confirmApprove() {
        if (!approveTarget) {
            return;
        }

        approveForm.post(
            approveRequest.url({ businessRequest: approveTarget.id }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    setApproveTarget(null);
                    approveForm.reset();
                },
            },
        );
    }

    function confirmReject() {
        if (!rejectTarget) {
            return;
        }

        rejectForm.post(
            rejectRequest.url({ businessRequest: rejectTarget.id }),
            {
                preserveScroll: true,
                onSuccess: () => {
                    setRejectTarget(null);
                    rejectForm.reset();
                },
            },
        );
    }

    const paginationLinks = requests.links;

    return (
        <>
            <Head title="Business Partners">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Business Partners
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Partnership inquiries. Pending by default; filter by
                        status to review approved and rejected requests.
                    </p>
                </div>

                <Card>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <form
                                onSubmit={applySearch}
                                className="grid gap-1.5"
                            >
                                <Label htmlFor="filter-search">Search</Label>
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="filter-search"
                                        type="search"
                                        placeholder="Company, contact, email, or organization type…"
                                        className="pl-9"
                                        value={form.data.search}
                                        onChange={(event) =>
                                            changeSearch(event.target.value)
                                        }
                                    />
                                </div>
                            </form>
                            <div className="grid gap-1.5">
                                <Label htmlFor="filter-status">Status</Label>
                                <Select
                                    value={form.data.status}
                                    onValueChange={changeStatus}
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
                                        {statuses.map((status) => (
                                            <SelectItem
                                                key={status}
                                                value={status}
                                            >
                                                {statusLabel(status)}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="flex-1">
                    <CardContent className="pt-6">
                        {requests.data.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-16 text-center">
                                <Building2 className="size-10 text-muted-foreground" />
                                <p className="font-medium">
                                    No business inquiries found
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {filters.search
                                        ? 'Try adjusting your search.'
                                        : 'Inquiries appear here once businesses submit the partnership form.'}
                                </p>
                            </div>
                        ) : (
                            <>
                                <ul className="flex flex-col gap-3 md:hidden">
                                    {requests.data.map((request) => (
                                        <li
                                            key={request.id}
                                            className="rounded-lg border border-border p-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="font-medium">
                                                        {request.company_name}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {request.contact_name}
                                                    </p>
                                                </div>
                                                <span className="shrink-0 text-sm text-muted-foreground">
                                                    {formatDateTime(
                                                        request.submitted_at,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="mt-2 space-y-0.5 text-sm text-muted-foreground">
                                                <p>{request.email}</p>
                                                <p>{request.phone}</p>
                                                <p>
                                                    {request.business_type}
                                                    {request.estimated_monthly_trips !==
                                                        null &&
                                                        ` · ~${request.estimated_monthly_trips} trips/mo`}
                                                </p>
                                            </div>
                                            <div className="mt-3 flex items-center justify-between gap-3">
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(request.status)}`}
                                                >
                                                    {statusLabel(
                                                        request.status,
                                                    )}
                                                </span>
                                                <DropdownAction
                                                    request={request}
                                                    onDetails={setDetailsTarget}
                                                    onApprove={openApprove}
                                                    onReject={openReject}
                                                />
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <div className="hidden md:block">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Company</TableHead>
                                                <TableHead>Contact</TableHead>
                                                <TableHead>Type</TableHead>
                                                <TableHead>
                                                    Est. monthly trips
                                                </TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Submitted</TableHead>
                                                <TableHead className="text-right">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {requests.data.map((request) => (
                                                <TableRow key={request.id}>
                                                    <TableCell>
                                                        <p className="font-medium">
                                                            {
                                                                request.company_name
                                                            }
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {request.email}
                                                        </p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <p>
                                                            {
                                                                request.contact_name
                                                            }
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {request.phone}
                                                        </p>
                                                    </TableCell>
                                                    <TableCell>
                                                        {request.business_type}
                                                    </TableCell>
                                                    <TableCell>
                                                        {request.estimated_monthly_trips ??
                                                            '—'}
                                                    </TableCell>
                                                    <TableCell>
                                                        <span
                                                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(request.status)}`}
                                                        >
                                                            {statusLabel(
                                                                request.status,
                                                            )}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatDateTime(
                                                            request.submitted_at,
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownAction
                                                            request={request}
                                                            onDetails={
                                                                setDetailsTarget
                                                            }
                                                            onApprove={
                                                                openApprove
                                                            }
                                                            onReject={
                                                                openReject
                                                            }
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </>
                        )}

                        {requests.last_page > 1 && (
                            <div className="mt-6 hidden md:block">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            {requests.prev_page_url ? (
                                                <PaginationPrevious asChild>
                                                    <Link
                                                        href={
                                                            requests.prev_page_url
                                                        }
                                                        prefetch
                                                    >
                                                        <span className="hidden sm:block">
                                                            Previous
                                                        </span>
                                                    </Link>
                                                </PaginationPrevious>
                                            ) : (
                                                <PaginationPrevious
                                                    className="pointer-events-none opacity-50"
                                                    aria-disabled="true"
                                                />
                                            )}
                                        </PaginationItem>

                                        {paginationLinks.map((link, index) => {
                                            if (!link.url) {
                                                return (
                                                    <PaginationItem key={index}>
                                                        <PaginationEllipsis />
                                                    </PaginationItem>
                                                );
                                            }

                                            const label = link.label
                                                .replaceAll('&laquo;', '«')
                                                .replaceAll('&raquo;', '»');

                                            return (
                                                <PaginationItem key={index}>
                                                    <PaginationLink
                                                        href={link.url}
                                                        isActive={link.active}
                                                        asChild
                                                    >
                                                        <Link
                                                            href={link.url}
                                                            prefetch
                                                        >
                                                            {label}
                                                        </Link>
                                                    </PaginationLink>
                                                </PaginationItem>
                                            );
                                        })}

                                        <PaginationItem>
                                            {requests.next_page_url ? (
                                                <PaginationNext asChild>
                                                    <Link
                                                        href={
                                                            requests.next_page_url
                                                        }
                                                        prefetch
                                                    >
                                                        <span className="hidden sm:block">
                                                            Next
                                                        </span>
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
                    </CardContent>
                </Card>
            </div>

            <Dialog
                open={detailsTarget !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setDetailsTarget(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{detailsTarget?.company_name}</DialogTitle>
                        <DialogDescription>
                            Partnership inquiry details
                        </DialogDescription>
                    </DialogHeader>
                    {detailsTarget && (
                        <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                            <div>
                                <dt className="text-xs text-muted-foreground">
                                    Contact
                                </dt>
                                <dd className="font-medium">
                                    {detailsTarget.contact_name}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs text-muted-foreground">
                                    Email
                                </dt>
                                <dd className="font-medium">
                                    {detailsTarget.email}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs text-muted-foreground">
                                    Phone
                                </dt>
                                <dd className="font-medium">
                                    {detailsTarget.phone}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs text-muted-foreground">
                                    Organization type
                                </dt>
                                <dd className="font-medium">
                                    {detailsTarget.business_type}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs text-muted-foreground">
                                    Est. monthly trips
                                </dt>
                                <dd className="font-medium">
                                    {detailsTarget.estimated_monthly_trips ??
                                        'N/A'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-xs text-muted-foreground">
                                    Submitted
                                </dt>
                                <dd className="font-medium">
                                    {formatDateTime(detailsTarget.submitted_at)}
                                </dd>
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="text-xs text-muted-foreground">
                                    Message
                                </dt>
                                <dd className="mt-1 rounded-lg border border-border p-3 text-sm">
                                    {detailsTarget.message ??
                                        'No message provided.'}
                                </dd>
                            </div>
                        </dl>
                    )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Close</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={approveTarget !== null}
                onOpenChange={(open) => {
                    if (!open && !approveForm.processing) {
                        setApproveTarget(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Approve partnership</DialogTitle>
                        <DialogDescription>
                            {approveTarget && (
                                <>
                                    Confirm{' '}
                                    <span className="font-medium text-foreground">
                                        {approveTarget.company_name}
                                    </span>{' '}
                                    as a transportation partner. Enter the
                                    company email that should receive the
                                    approval confirmation.
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-1.5">
                        <Label htmlFor="approve-email">Company email</Label>
                        <Input
                            id="approve-email"
                            type="email"
                            value={approveForm.data.email}
                            onChange={(event) =>
                                approveForm.setData('email', event.target.value)
                            }
                            placeholder="partnerships@company.com"
                        />
                        {approveForm.errors.email && (
                            <p className="text-xs font-medium text-destructive">
                                {approveForm.errors.email}
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                disabled={approveForm.processing}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            onClick={confirmApprove}
                            disabled={approveForm.processing}
                        >
                            {approveForm.processing
                                ? 'Approving…'
                                : 'Approve partnership'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={rejectTarget !== null}
                onOpenChange={(open) => {
                    if (!open && !rejectForm.processing) {
                        setRejectTarget(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject partnership</DialogTitle>
                        <DialogDescription>
                            {rejectTarget && (
                                <>
                                    Reject{' '}
                                    <span className="font-medium text-foreground">
                                        {rejectTarget.company_name}
                                    </span>{' '}
                                    and explain why. The reason will be emailed
                                    to {rejectTarget.email}.
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-1.5">
                        <Label htmlFor="reject-reason">Rejection reason</Label>
                        <Textarea
                            id="reject-reason"
                            rows={4}
                            value={rejectForm.data.reason}
                            onChange={(event) =>
                                rejectForm.setData('reason', event.target.value)
                            }
                            placeholder="Explain why this partnership cannot be approved…"
                        />
                        {rejectForm.errors.reason && (
                            <p className="text-xs font-medium text-destructive">
                                {rejectForm.errors.reason}
                            </p>
                        )}
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                disabled={rejectForm.processing}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            onClick={confirmReject}
                            disabled={rejectForm.processing}
                        >
                            {rejectForm.processing
                                ? 'Rejecting…'
                                : 'Reject partnership'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

function DropdownAction({
    request,
    onDetails,
    onApprove,
    onReject,
}: {
    request: BusinessRequestItem;
    onDetails: (request: BusinessRequestItem) => void;
    onApprove: (request: BusinessRequestItem) => void;
    onReject: (request: BusinessRequestItem) => void;
}) {
    return (
        <Tooltip>
            <DropdownMenu>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            aria-label="Actions"
                        >
                            <MoreHorizontal className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onDetails(request)}>
                        <Eye />
                        Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => onApprove(request)}
                        disabled={request.status !== 'PENDING'}
                    >
                        <ThumbsUp />
                        Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => onReject(request)}
                        disabled={request.status !== 'PENDING'}
                    >
                        <ThumbsDown />
                        Reject
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent>Actions</TooltipContent>
        </Tooltip>
    );
}

DashboardBusinessPartners.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Business Partners',
            href: businessPartners(),
        },
    ],
};
