import { Head, Link, useForm } from '@inertiajs/react';
import { Pencil, Search, ShieldOff, ShieldCheck, Trash2 } from 'lucide-react';
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
import { IconAction } from '@/components/ui/icon-action';
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { formatDateTime } from '@/lib/bookings';
import { dashboard } from '@/routes';
import { blacklist as dashboardBlacklist } from '@/routes/dashboard';
import {
    destroy as blacklistDestroy,
    store as blacklistStore,
    update as blacklistUpdate,
} from '@/routes/dashboard/blacklist';

type BlacklistRecord = {
    id: number;
    name: string | null;
    email: string | null;
    phone_digits: string | null;
    reason: string;
    created_at: string;
    blacklister: { name: string } | null;
};

type BlacklistFilters = {
    search: string | null;
};

type DashboardBlacklistProps = {
    blacklist: {
        data: BlacklistRecord[];
        current_page: number;
        first_page_url: string;
        from: number | null;
        last_page: number;
        last_page_url: string;
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number | null;
        total: number;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
    filters: BlacklistFilters;
};

function formatPhone(digits: string): string {
    let national = digits;
    let prefix = '';

    if (digits.length === 11 && digits.startsWith('1')) {
        prefix = '+1 ';
        national = digits.slice(1);
    }

    const formatted = national.replace(/^(\d{3})(\d{3})(\d{4})$/, '($1) $2-$3');

    return `${prefix}${formatted}`;
}

export default function DashboardBlacklistPage({
    blacklist,
    filters,
}: DashboardBlacklistProps) {
    const form = useForm({
        search: filters.search ?? '',
    });

    const searchTimer = useRef<number | null>(null);

    const [addOpen, setAddOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<BlacklistRecord | null>(null);
    const [removeTarget, setRemoveTarget] = useState<BlacklistRecord | null>(
        null,
    );

    const addForm = useForm({
        name: '',
        email: '',
        phone: '',
        reason: '',
    });
    const editForm = useForm({
        name: '',
        email: '',
        phone: '',
        reason: '',
    });
    const removeForm = useForm({});

    function navigate() {
        form.get(dashboardBlacklist.url(), {
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

    function submitSearch(event: FormEvent) {
        event.preventDefault();

        if (searchTimer.current !== null) {
            window.clearTimeout(searchTimer.current);
            searchTimer.current = null;
        }

        navigate();
    }

    function submitAdd(event: FormEvent) {
        event.preventDefault();
        addForm.post(blacklistStore.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setAddOpen(false);
                addForm.reset();
            },
        });
    }

    function openEdit(entry: BlacklistRecord) {
        editForm.setData({
            name: entry.name ?? '',
            email: entry.email ?? '',
            phone: entry.phone_digits ? formatPhone(entry.phone_digits) : '',
            reason: entry.reason,
        });
        editForm.clearErrors();
        setEditTarget(entry);
    }

    function submitEdit() {
        if (!editTarget) {
            return;
        }

        editForm.put(blacklistUpdate.url({ blacklist: editTarget.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setEditTarget(null);
                editForm.reset();
            },
        });
    }

    function confirmRemove() {
        if (!removeTarget) {
            return;
        }

        removeForm.delete(
            blacklistDestroy.url({ blacklist: removeTarget.id }),
            {
                preserveScroll: true,
                onSuccess: () => setRemoveTarget(null),
            },
        );
    }

    const paginationLinks = blacklist.links;
    const hasEntries = blacklist.data.length > 0;

    return (
        <>
            <Head title="Blacklisted Passengers">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Blacklisted Passengers
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Passengers blacklisted by email or phone are flagged
                            on all matching bookings.
                        </p>
                    </div>
                    <Button onClick={() => setAddOpen(true)}>
                        <ShieldOff />
                        Blacklist passenger
                    </Button>
                </div>

                <Card>
                    <CardContent>
                        <form onSubmit={submitSearch} className="grid gap-1.5">
                            <Label htmlFor="blacklist-search">Search</Label>
                            <div className="relative">
                                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    id="blacklist-search"
                                    type="search"
                                    placeholder="Search by name, email, phone, or reason…"
                                    className="pl-9"
                                    value={form.data.search}
                                    onChange={(event) =>
                                        changeSearch(event.target.value)
                                    }
                                />
                            </div>
                        </form>
                    </CardContent>
                </Card>

                <Card className="flex-1">
                    <CardContent className="pt-6">
                        {!hasEntries ? (
                            <div className="flex flex-col items-center gap-2 py-16 text-center">
                                <ShieldCheck className="size-10 text-muted-foreground" />
                                <p className="font-medium">
                                    No blacklisted passengers
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {filters.search
                                        ? 'Try a different search term.'
                                        : 'No passengers have been blacklisted yet.'}
                                </p>
                            </div>
                        ) : (
                            <>
                                <ul className="flex flex-col gap-3 md:hidden">
                                    {blacklist.data.map((entry) => (
                                        <li
                                            key={entry.id}
                                            className="rounded-lg border border-border p-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="font-medium">
                                                        {entry.name ?? '—'}
                                                    </p>
                                                    {(entry.email ||
                                                        entry.phone_digits) && (
                                                        <p className="mt-0.5 text-sm text-muted-foreground">
                                                            {entry.email}
                                                            {entry.email &&
                                                                entry.phone_digits &&
                                                                ' · '}
                                                            {entry.phone_digits}
                                                        </p>
                                                    )}
                                                    <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
                                                        {entry.reason}
                                                    </p>
                                                </div>
                                                <div className="flex shrink-0 items-center gap-1">
                                                    <IconAction label="Edit entry">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-muted-foreground hover:text-foreground"
                                                            onClick={() =>
                                                                openEdit(entry)
                                                            }
                                                        >
                                                            <Pencil />
                                                        </Button>
                                                    </IconAction>
                                                    <IconAction label="Remove from blacklist">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="text-muted-foreground hover:text-rose-600"
                                                            onClick={() =>
                                                                setRemoveTarget(
                                                                    entry,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 />
                                                        </Button>
                                                    </IconAction>
                                                </div>
                                            </div>
                                            <p className="mt-2 text-xs text-muted-foreground">
                                                Added by{' '}
                                                {entry.blacklister?.name ??
                                                    'Unknown'}{' '}
                                                on{' '}
                                                {formatDateTime(
                                                    entry.created_at,
                                                )}
                                            </p>
                                        </li>
                                    ))}
                                </ul>

                                <div className="hidden md:block">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Contact</TableHead>
                                                <TableHead>Reason</TableHead>
                                                <TableHead>
                                                    Blacklisted by
                                                </TableHead>
                                                <TableHead>Date</TableHead>
                                                <TableHead className="text-right">
                                                    Action
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {blacklist.data.map((entry) => (
                                                <TableRow key={entry.id}>
                                                    <TableCell className="font-medium">
                                                        {entry.name ?? '—'}
                                                    </TableCell>
                                                    <TableCell>
                                                        {entry.email && (
                                                            <span className="block">
                                                                {entry.email}
                                                            </span>
                                                        )}
                                                        {entry.phone_digits && (
                                                            <span className="block text-sm text-muted-foreground">
                                                                {
                                                                    entry.phone_digits
                                                                }
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="max-w-xs">
                                                        <span className="line-clamp-2 text-sm">
                                                            {entry.reason}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell className="text-sm">
                                                        {entry.blacklister
                                                            ?.name ?? 'Unknown'}
                                                    </TableCell>
                                                    <TableCell className="text-sm text-muted-foreground">
                                                        {formatDateTime(
                                                            entry.created_at,
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex items-center justify-end gap-1">
                                                            <IconAction label="Edit entry">
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        openEdit(
                                                                            entry,
                                                                        )
                                                                    }
                                                                >
                                                                    <Pencil className="size-4" />
                                                                </Button>
                                                            </IconAction>
                                                            <IconAction label="Remove from blacklist">
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    className="text-muted-foreground hover:text-rose-600"
                                                                    onClick={() =>
                                                                        setRemoveTarget(
                                                                            entry,
                                                                        )
                                                                    }
                                                                >
                                                                    <Trash2 className="size-4" />
                                                                </Button>
                                                            </IconAction>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </>
                        )}

                        {blacklist.last_page > 1 && (
                            <div className="mt-6 hidden md:block">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            {blacklist.prev_page_url ? (
                                                <PaginationPrevious asChild>
                                                    <Link
                                                        href={
                                                            blacklist.prev_page_url
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
                                                        <PaginationLink>
                                                            …
                                                        </PaginationLink>
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
                                            {blacklist.next_page_url ? (
                                                <PaginationNext asChild>
                                                    <Link
                                                        href={
                                                            blacklist.next_page_url
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

            <Dialog open={addOpen} onOpenChange={setAddOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Blacklist a passenger</DialogTitle>
                        <DialogDescription>
                            All past and future bookings matching this email or
                            phone will be flagged blacklisted.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={submitAdd} className="grid gap-4">
                        <div className="grid gap-1.5">
                            <Label htmlFor="blacklist-name">
                                Name{' '}
                                <span className="text-muted-foreground">
                                    (optional)
                                </span>
                            </Label>
                            <Input
                                id="blacklist-name"
                                type="text"
                                placeholder="Passenger name"
                                value={addForm.data.name}
                                onChange={(event) =>
                                    addForm.setData('name', event.target.value)
                                }
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="blacklist-email">
                                Email{' '}
                                <span className="text-muted-foreground">
                                    (at least one of email or phone)
                                </span>
                            </Label>
                            <Input
                                id="blacklist-email"
                                type="email"
                                placeholder="passenger@example.com"
                                value={addForm.data.email}
                                onChange={(event) =>
                                    addForm.setData('email', event.target.value)
                                }
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="blacklist-phone">
                                Phone{' '}
                                <span className="text-muted-foreground">
                                    (at least one of email or phone)
                                </span>
                            </Label>
                            <Input
                                id="blacklist-phone"
                                type="tel"
                                placeholder="(555) 123-4567"
                                value={addForm.data.phone}
                                onChange={(event) =>
                                    addForm.setData('phone', event.target.value)
                                }
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="blacklist-reason">Reason</Label>
                            <Textarea
                                id="blacklist-reason"
                                rows={3}
                                placeholder="Explain why this passenger is being blacklisted…"
                                value={addForm.data.reason}
                                onChange={(event) =>
                                    addForm.setData(
                                        'reason',
                                        event.target.value,
                                    )
                                }
                                required
                                minLength={20}
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={addForm.processing}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={
                                    addForm.processing ||
                                    addForm.data.reason.length < 20
                                }
                            >
                                {addForm.processing
                                    ? 'Blacklisting…'
                                    : 'Blacklist passenger'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={editTarget !== null}
                onOpenChange={(open) => {
                    if (!open && !editForm.processing) {
                        setEditTarget(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit blacklisted passenger</DialogTitle>
                        <DialogDescription>
                            Update the flagged passenger's details. Matching
                            bookings are affected immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            submitEdit();
                        }}
                        className="grid gap-4"
                    >
                        <div className="grid gap-1.5">
                            <Label htmlFor="edit-blacklist-name">
                                Name{' '}
                                <span className="text-muted-foreground">
                                    (optional)
                                </span>
                            </Label>
                            <Input
                                id="edit-blacklist-name"
                                type="text"
                                placeholder="Passenger name"
                                value={editForm.data.name}
                                onChange={(event) =>
                                    editForm.setData('name', event.target.value)
                                }
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="edit-blacklist-email">
                                Email{' '}
                                <span className="text-muted-foreground">
                                    (at least one of email or phone)
                                </span>
                            </Label>
                            <Input
                                id="edit-blacklist-email"
                                type="email"
                                placeholder="passenger@example.com"
                                value={editForm.data.email}
                                onChange={(event) =>
                                    editForm.setData(
                                        'email',
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="edit-blacklist-phone">
                                Phone{' '}
                                <span className="text-muted-foreground">
                                    (at least one of email or phone)
                                </span>
                            </Label>
                            <Input
                                id="edit-blacklist-phone"
                                type="tel"
                                placeholder="(555) 123-4567"
                                value={editForm.data.phone}
                                onChange={(event) =>
                                    editForm.setData(
                                        'phone',
                                        event.target.value,
                                    )
                                }
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="edit-blacklist-reason">
                                Reason
                            </Label>
                            <Textarea
                                id="edit-blacklist-reason"
                                rows={3}
                                placeholder="Explain why this passenger is being blacklisted…"
                                value={editForm.data.reason}
                                onChange={(event) =>
                                    editForm.setData(
                                        'reason',
                                        event.target.value,
                                    )
                                }
                                required
                                minLength={20}
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={editForm.processing}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={
                                    editForm.processing ||
                                    editForm.data.reason.length < 20
                                }
                            >
                                {editForm.processing
                                    ? 'Saving…'
                                    : 'Save changes'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={removeTarget !== null}
                onOpenChange={(open) => {
                    if (!open && !removeForm.processing) {
                        setRemoveTarget(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remove from blacklist?</DialogTitle>
                        <DialogDescription>
                            {removeTarget && (
                                <>
                                    <span className="font-medium text-foreground">
                                        {removeTarget.email ??
                                            removeTarget.phone_digits}
                                    </span>{' '}
                                    will no longer be flagged on bookings.
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                variant="outline"
                                disabled={removeForm.processing}
                            >
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            onClick={confirmRemove}
                            disabled={removeForm.processing}
                        >
                            {removeForm.processing
                                ? 'Removing…'
                                : 'Remove from blacklist'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

DashboardBlacklistPage.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Blacklisted Passengers',
            href: dashboardBlacklist(),
        },
    ],
};
