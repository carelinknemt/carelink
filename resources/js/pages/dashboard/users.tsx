import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Ban,
    CheckCircle2,
    Search,
    ShieldCheck,
    UserPlus,
    Users as UsersIcon,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/lib/bookings';
import { users as dashboardUsers } from '@/routes/dashboard';
import { banToggle, store as storeUser } from '@/routes/dashboard/users';
import type {
    PaginatedUsers,
    UserRecord,
    UsersFilters,
} from '@/types/dashboard';

type DashboardUsersProps = {
    users: PaginatedUsers;
    filters: UsersFilters;
    current_user_id: number;
};

export default function DashboardUsers({
    users,
    filters,
    current_user_id,
}: DashboardUsersProps) {
    const form = useForm({
        search: filters.search ?? '',
    });

    const inviteForm = useForm({
        name: '',
        email: '',
        is_admin: false,
    });

    const searchTimer = useRef<number | null>(null);

    const [inviteOpen, setInviteOpen] = useState(false);
    const [banTarget, setBanTarget] = useState<UserRecord | null>(null);

    function navigate() {
        form.get(dashboardUsers.url(), {
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

    function clearSearch() {
        if (searchTimer.current !== null) {
            window.clearTimeout(searchTimer.current);
            searchTimer.current = null;
        }

        form.setData('search', '');
        navigate();
    }

    function openInvite() {
        inviteForm.reset();
        setInviteOpen(true);
    }

    function submitInvite() {
        inviteForm.post(storeUser.url(), {
            preserveScroll: true,
            onSuccess: () => setInviteOpen(false),
        });
    }

    function confirmBan() {
        if (!banTarget) {
            return;
        }

        router.post(
            banToggle.url({ user: banTarget.id }),
            {},
            {
                preserveScroll: true,
                onSuccess: () => setBanTarget(null),
            },
        );
    }

    function toggleBanDirect(user: UserRecord) {
        router.post(
            banToggle.url({ user: user.id }),
            {},
            { preserveScroll: true },
        );
    }

    const searchActive = Boolean(filters.search);

    return (
        <>
            <Head title="Users">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Users
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Manage dashboard accounts. New users receive a
                            password reset link by email.
                        </p>
                    </div>
                    <Button type="button" onClick={openInvite}>
                        <UserPlus />
                        Add user
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Filters</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={submitSearch}
                            className="flex flex-col gap-4"
                        >
                            <div className="grid gap-1.5 sm:max-w-xl">
                                <Label htmlFor="user-search">
                                    Name or email
                                </Label>
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="user-search"
                                        type="search"
                                        placeholder="Search users…"
                                        className="pl-9"
                                        value={form.data.search}
                                        onChange={(event) =>
                                            changeSearch(event.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            {searchActive && (
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={clearSearch}
                                    >
                                        Clear search
                                    </Button>
                                    <span className="text-xs text-muted-foreground">
                                        {users.total} match
                                        {users.total === 1 ? '' : 'es'}
                                    </span>
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>

                <Card className="flex-1">
                    <CardContent className="pt-6">
                        {users.data.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-16 text-center">
                                <UsersIcon className="size-10 text-muted-foreground" />
                                <p className="font-medium">No users found</p>
                                <p className="text-sm text-muted-foreground">
                                    {searchActive
                                        ? 'Try a different name or email.'
                                        : 'Add the first user with the Add user button.'}
                                </p>
                            </div>
                        ) : (
                            <>
                                <ul className="flex flex-col gap-3 md:hidden">
                                    {users.data.map((user) => (
                                        <li
                                            key={user.id}
                                            className="rounded-lg border border-border p-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="flex items-center gap-2 font-medium">
                                                        {user.name}
                                                        {user.id ===
                                                            current_user_id && (
                                                            <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                                                                You
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {user.email}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end gap-1.5">
                                                    {user.is_admin && (
                                                        <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">
                                                            <ShieldCheck className="size-3" />
                                                            Admin
                                                        </span>
                                                    )}
                                                    {user.banned_at !==
                                                        null && (
                                                        <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700">
                                                            Banned
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-3 flex items-center justify-between gap-3">
                                                <span className="text-sm text-muted-foreground">
                                                    Joined{' '}
                                                    {formatDate(user.joined_at)}
                                                </span>
                                                {user.id !== current_user_id &&
                                                    (user.banned_at === null ? (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                setBanTarget(
                                                                    user,
                                                                )
                                                            }
                                                        >
                                                            <Ban />
                                                            Ban
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                toggleBanDirect(
                                                                    user,
                                                                )
                                                            }
                                                        >
                                                            <CheckCircle2 />
                                                            Unban
                                                        </Button>
                                                    ))}
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <div className="hidden md:block">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Name</TableHead>
                                                <TableHead>Email</TableHead>
                                                <TableHead>Role</TableHead>
                                                <TableHead>Status</TableHead>
                                                <TableHead>Joined</TableHead>
                                                <TableHead className="text-right">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {users.data.map((user) => (
                                                <TableRow key={user.id}>
                                                    <TableCell className="font-medium">
                                                        <span className="flex items-center gap-2">
                                                            {user.name}
                                                            {user.id ===
                                                                current_user_id && (
                                                                <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                                                                    You
                                                                </span>
                                                            )}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.email}
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.is_admin ? (
                                                            <span className="inline-flex items-center gap-1 rounded-full border border-violet-200 bg-violet-50 px-2 py-0.5 text-xs font-medium text-violet-700">
                                                                <ShieldCheck className="size-3" />
                                                                Admin
                                                            </span>
                                                        ) : (
                                                            <span className="text-sm text-muted-foreground">
                                                                Manager
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {user.banned_at !==
                                                        null ? (
                                                            <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700">
                                                                Banned
                                                            </span>
                                                        ) : (
                                                            <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                                                Active
                                                            </span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        {formatDate(
                                                            user.joined_at,
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        {user.id ===
                                                        current_user_id ? (
                                                            <span className="text-sm text-muted-foreground">
                                                                —
                                                            </span>
                                                        ) : user.banned_at ===
                                                          null ? (
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    setBanTarget(
                                                                        user,
                                                                    )
                                                                }
                                                            >
                                                                <Ban />
                                                                Ban
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() =>
                                                                    toggleBanDirect(
                                                                        user,
                                                                    )
                                                                }
                                                            >
                                                                <CheckCircle2 />
                                                                Unban
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </>
                        )}

                        {users.last_page > 1 && (
                            <div className="mt-6 hidden md:block">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            {users.prev_page_url ? (
                                                <PaginationPrevious asChild>
                                                    <Link
                                                        href={
                                                            users.prev_page_url
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
                                        {users.links.map((link) => {
                                            if (link.url === null) {
                                                return null;
                                            }

                                            const label =
                                                link.label ===
                                                '&laquo; Previous'
                                                    ? '…'
                                                    : link.label ===
                                                        '&raquo; Next'
                                                      ? '…'
                                                      : link.label;

                                            return (
                                                <PaginationItem
                                                    key={`${link.label}-${link.url}`}
                                                >
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
                                            {users.next_page_url ? (
                                                <PaginationNext asChild>
                                                    <Link
                                                        href={
                                                            users.next_page_url
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

                        {users.last_page > 1 && (
                            <div className="mt-6 flex justify-center md:hidden">
                                <Pagination>
                                    <PaginationContent>
                                        <PaginationItem>
                                            {users.prev_page_url ? (
                                                <PaginationPrevious asChild>
                                                    <Link
                                                        href={
                                                            users.prev_page_url
                                                        }
                                                        prefetch
                                                    />
                                                </PaginationPrevious>
                                            ) : (
                                                <PaginationPrevious
                                                    className="pointer-events-none opacity-50"
                                                    aria-disabled="true"
                                                />
                                            )}
                                        </PaginationItem>
                                        <PaginationItem>
                                            {users.next_page_url ? (
                                                <PaginationNext asChild>
                                                    <Link
                                                        href={
                                                            users.next_page_url
                                                        }
                                                        prefetch
                                                    />
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
                open={inviteOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setInviteOpen(false);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add a user</DialogTitle>
                        <DialogDescription>
                            The account is created without a password. The new
                            user receives a password reset link and a guide to
                            the Knowledge Base by email.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        className="grid gap-4"
                        onSubmit={(event) => {
                            event.preventDefault();
                            submitInvite();
                        }}
                    >
                        <div className="grid gap-1.5">
                            <Label htmlFor="invite-name">Full name</Label>
                            <Input
                                id="invite-name"
                                value={inviteForm.data.name}
                                onChange={(event) =>
                                    inviteForm.setData(
                                        'name',
                                        event.target.value,
                                    )
                                }
                                placeholder="Jane Doe"
                            />
                            {inviteForm.errors.name && (
                                <p className="text-xs text-destructive">
                                    {inviteForm.errors.name}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="invite-email">Email</Label>
                            <Input
                                id="invite-email"
                                type="email"
                                value={inviteForm.data.email}
                                onChange={(event) =>
                                    inviteForm.setData(
                                        'email',
                                        event.target.value,
                                    )
                                }
                                placeholder="jane@example.com"
                            />
                            {inviteForm.errors.email && (
                                <p className="text-xs text-destructive">
                                    {inviteForm.errors.email}
                                </p>
                            )}
                        </div>
                        <label className="flex items-center gap-2 text-sm font-medium">
                            <input
                                type="checkbox"
                                checked={inviteForm.data.is_admin}
                                onChange={(event) =>
                                    inviteForm.setData(
                                        'is_admin',
                                        event.target.checked,
                                    )
                                }
                                className="rounded border-slate-300"
                            />
                            Admin user (can manage users and payments)
                        </label>
                        {inviteForm.recentlySuccessful && (
                            <p className="text-xs text-muted-foreground">
                                User added and reset link sent.
                            </p>
                        )}
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={inviteForm.processing}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={inviteForm.processing}
                            >
                                {inviteForm.processing
                                    ? 'Adding…'
                                    : 'Add user and send links'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={banTarget !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setBanTarget(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Ban {banTarget?.name}?</DialogTitle>
                        <DialogDescription>
                            {banTarget?.name} ({banTarget?.email}) will be
                            signed out immediately and blocked from signing in
                            until the ban is lifted. Their existing bookings
                            stay active.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Keep them signed in
                            </Button>
                        </DialogClose>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={confirmBan}
                        >
                            <Ban />
                            Ban user
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
