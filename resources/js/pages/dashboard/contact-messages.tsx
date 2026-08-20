import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Eye,
    MailCheck,
    MessageSquareText,
    MoreHorizontal,
    Search,
    Trash2,
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
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatDateTime, statusBadgeClass } from '@/lib/bookings';
import { dashboard } from '@/routes';
import { contactMessages } from '@/routes/dashboard';
import {
    destroy as destroyMessage,
    read as readMessage,
} from '@/routes/dashboard/contact-messages';
import type { PaginatedContactMessages } from '@/types/dashboard';

type DashboardContactMessagesProps = {
    messages: PaginatedContactMessages;
    filters: { search?: string | null; status?: string | null };
    statuses: string[];
};

type ContactMessageItem = PaginatedContactMessages['data'][number];

function statusLabel(status: string): string {
    return status.replaceAll('_', ' ');
}

export default function DashboardContactMessages({
    messages,
    filters,
    statuses,
}: DashboardContactMessagesProps) {
    const form = useForm({
        search: filters.search ?? '',
        status: filters.status ?? 'PENDING',
    });
    const searchTimer = useRef<number | null>(null);

    const [detailsTarget, setDetailsTarget] = useState<ContactMessageItem | null>(
        null,
    );
    const [deleteTarget, setDeleteTarget] =
        useState<ContactMessageItem | null>(null);
    const [deleting, setDeleting] = useState(false);

    function navigate() {
        form.get(contactMessages.url(), {
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

    function markRead(message: ContactMessageItem) {
        router.post(
            readMessage.url({ contactMessage: message.id }),
            {},
            { preserveScroll: true },
        );
    }

    function confirmDelete() {
        if (!deleteTarget || deleting) {
            return;
        }

        setDeleting(true);

        router.delete(
            destroyMessage.url({ contactMessage: deleteTarget.id }),
            {
                preserveScroll: true,
                onFinish: () => {
                    setDeleteTarget(null);
                    setDeleting(false);
                },
            },
        );
    }

    const paginationLinks = messages.links;

    return (
        <>
            <Head title="Contact Messages">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        Contact Messages
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Inquiries sent from the FAQ contact form. Pending by
                        default; mark messages as read as you handle them.
                    </p>
                </div>

                <Card>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <form onSubmit={applySearch} className="grid gap-1.5">
                                <Label htmlFor="filter-search">Search</Label>
                                <div className="relative">
                                    <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                                    <Input
                                        id="filter-search"
                                        type="search"
                                        placeholder="Name, email, or message…"
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
                                            <SelectItem key={status} value={status}>
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
                        {messages.data.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-16 text-center">
                                <MessageSquareText className="text-muted-foreground size-10" />
                                <p className="font-medium">
                                    No messages found
                                </p>
                                <p className="text-muted-foreground text-sm">
                                    {filters.search
                                        ? 'Try adjusting your search.'
                                        : 'Inquiries appear here once visitors submit the contact form.'}
                                </p>
                            </div>
                        ) : (
                            <>
                                <ul className="flex flex-col gap-3 md:hidden">
                                    {messages.data.map((message) => (
                                        <li
                                            key={message.id}
                                            className="border-border rounded-lg border p-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="font-medium">
                                                        {message.name}
                                                    </p>
                                                    <p className="text-muted-foreground text-sm">
                                                        {message.email}
                                                    </p>
                                                </div>
                                                <span className="text-muted-foreground shrink-0 text-sm">
                                                    {formatDateTime(
                                                        message.submitted_at,
                                                    )}
                                                </span>
                                            </div>
                                            <p className="text-muted-foreground mt-2 line-clamp-2 text-sm">
                                                {message.message}
                                            </p>
                                            <div className="mt-3 flex items-center justify-between gap-3">
                                                <span
                                                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(message.status)}`}
                                                >
                                                    {statusLabel(message.status)}
                                                </span>
                                                <DropdownAction
                                                    message={message}
                                                    onDetails={setDetailsTarget}
                                                    onRead={markRead}
                                                    onDelete={setDeleteTarget}
                                                />
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <div className="hidden md:block">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>From</TableHead>
                                                <TableHead>Message</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Submitted</TableHead>
                                                <TableHead className="text-right">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {messages.data.map((message) => (
                                                <TableRow key={message.id}>
                                                    <TableCell>
                                                        <p className="font-medium">
                                                            {message.name}
                                                        </p>
                                                        <p className="text-muted-foreground text-xs">
                                                            {message.email}
                                                            {message.phone
                                                                ? ` · ${message.phone}`
                                                                : ''}
                                                        </p>
                                                    </TableCell>
                                                    <TableCell className="max-w-md">
                                                        <p className="line-clamp-2 text-sm">
                                                            {message.message}
                                                        </p>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span
                                                            className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(message.status)}`}
                                                        >
                                                            {statusLabel(
                                                                message.status,
                                                            )}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatDateTime(
                                                            message.submitted_at,
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownAction
                                                            message={message}
                                                            onDetails={
                                                                setDetailsTarget
                                                            }
                                                            onRead={markRead}
                                                            onDelete={
                                                                setDeleteTarget
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

                        {messages.last_page > 1 && (
                            <div className="mt-6 hidden md:block">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            {messages.prev_page_url ? (
                                                <PaginationPrevious asChild>
                                                    <Link
                                                        href={messages.prev_page_url}
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
                                            {messages.next_page_url ? (
                                                <PaginationNext asChild>
                                                    <Link
                                                        href={messages.next_page_url}
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
                        <DialogTitle>Message from {detailsTarget?.name}</DialogTitle>
                        <DialogDescription>
                            Contact form inquiry details
                        </DialogDescription>
                    </DialogHeader>
                    {detailsTarget && (
                        <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                            <div>
                                <dt className="text-muted-foreground text-xs">
                                    Name
                                </dt>
                                <dd className="font-medium">
                                    {detailsTarget.name}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground text-xs">
                                    Email
                                </dt>
                                <dd className="font-medium break-all">
                                    {detailsTarget.email}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground text-xs">
                                    Phone
                                </dt>
                                <dd className="font-medium">
                                    {detailsTarget.phone ?? 'Not provided'}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-muted-foreground text-xs">
                                    Submitted
                                </dt>
                                <dd className="font-medium">
                                    {formatDateTime(detailsTarget.submitted_at)}
                                </dd>
                            </div>
                            <div className="sm:col-span-2">
                                <dt className="text-muted-foreground text-xs">
                                    Message
                                </dt>
                                <dd className="border-border mt-1 rounded-lg border p-3 text-sm whitespace-pre-wrap">
                                    {detailsTarget.message}
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
                open={deleteTarget !== null}
                onOpenChange={(open) => {
                    if (!open && !deleting) {
                        setDeleteTarget(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete message</DialogTitle>
                        <DialogDescription>
                            {deleteTarget && (
                                <>
                                    Delete the message from{' '}
                                    <span className="text-foreground font-medium">
                                        {deleteTarget.name}
                                    </span>
                                    ? This cannot be undone.
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                disabled={deleting}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            onClick={confirmDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Deleting…' : 'Delete message'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

function DropdownAction({
    message,
    onDetails,
    onRead,
    onDelete,
}: {
    message: ContactMessageItem;
    onDetails: (message: ContactMessageItem) => void;
    onRead: (message: ContactMessageItem) => void;
    onDelete: (message: ContactMessageItem) => void;
}) {
    return (
        <Tooltip>
            <DropdownMenu>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" aria-label="Actions">
                            <MoreHorizontal className="size-4" />
                        </Button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onDetails(message)}>
                        <Eye />
                        Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => onRead(message)}
                        disabled={message.status === 'READ'}
                    >
                        <MailCheck />
                        Mark as read
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => onDelete(message)}
                        className="text-destructive focus:text-destructive"
                    >
                        <Trash2 />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <TooltipContent>Actions</TooltipContent>
        </Tooltip>
    );
}

DashboardContactMessages.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Contact Messages',
            href: contactMessages(),
        },
    ],
};