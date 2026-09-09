import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Ban,
    CheckCircle2,
    ChevronLeftIcon,
    ChevronRightIcon,
    Eye,
    Plus,
    Search,
    ShieldCheck,
    Trash2,
    Upload,
    UserPlus,
    Users as UsersIcon,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import DatePicker from '@/components/carelink/date-picker';
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
import { PaginationLink } from '@/components/ui/pagination';
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
import { formatDate } from '@/lib/bookings';
import {
    DOCUMENT_TYPE_OPTIONS,
    roleBadgeClass,
    roleLabel,
    ROLE_OPTIONS,
} from '@/lib/users';
import { dashboard } from '@/routes';
import { users as dashboardUsers } from '@/routes/dashboard';
import {
    banToggle,
    show as showUser,
    store as storeUser,
    updateRole,
} from '@/routes/dashboard/users';
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

type PendingDocument = {
    file: File;
    type: string;
    label: string;
};

type InviteFormData = {
    name: string;
    first_name: string;
    last_name: string;
    email: string;
    role: string;
    date_of_birth: string;
    hired_date: string;
    driver_license_number: string;
    license_expiration_date: string;
    documents: PendingDocument[];
};

export default function DashboardUsers({
    users,
    filters,
    current_user_id,
}: DashboardUsersProps) {
    const form = useForm({
        search: filters.search ?? '',
        role: filters.role ?? '',
    });

    const inviteForm = useForm<InviteFormData>({
        name: '',
        first_name: '',
        last_name: '',
        email: '',
        role: 'dispatcher',
        date_of_birth: '',
        hired_date: '',
        driver_license_number: '',
        license_expiration_date: '',
        documents: [],
    });

    const [pendingDocuments, setPendingDocuments] = useState<PendingDocument[]>(
        [],
    );

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

    function changeRoleFilter(value: string) {
        form.setData('role', value);

        if (searchTimer.current !== null) {
            window.clearTimeout(searchTimer.current);
            searchTimer.current = null;
        }

        navigate();
    }

    function openInvite() {
        inviteForm.reset();
        inviteForm.setData('role', 'dispatcher');
        setPendingDocuments([]);
        setInviteOpen(true);
    }

    function submitInvite() {
        const name =
            [inviteForm.data.first_name, inviteForm.data.last_name]
                .filter(Boolean)
                .join(' ') || inviteForm.data.name;

        inviteForm.setData('name', name);

        inviteForm.post(storeUser.url(), {
            preserveScroll: true,
            onSuccess: () => setInviteOpen(false),
        });
    }

    function syncDocuments(next: PendingDocument[]) {
        setPendingDocuments(next);

        inviteForm.setData(
            'documents',
            next
                .filter((doc) => doc.file.size > 0)
                .map((doc) => ({
                    file: doc.file,
                    type: doc.type,
                    label: doc.label,
                })),
        );
    }

    function addDocument() {
        syncDocuments([
            ...pendingDocuments,
            { file: new File([], ''), type: 'license', label: '' },
        ]);
    }

    function removeDocument(index: number) {
        syncDocuments(pendingDocuments.filter((_, i) => i !== index));
    }

    function updateDocumentFile(index: number, file: File | null) {
        if (!file) {
            return;
        }

        syncDocuments(
            pendingDocuments.map((doc, i) =>
                i === index ? { ...doc, file } : doc,
            ),
        );
    }

    function updateDocumentType(index: number, type: string) {
        syncDocuments(
            pendingDocuments.map((doc, i) =>
                i === index ? { ...doc, type } : doc,
            ),
        );
    }

    function updateDocumentLabel(index: number, label: string) {
        syncDocuments(
            pendingDocuments.map((doc, i) =>
                i === index ? { ...doc, label } : doc,
            ),
        );
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

    function changeUserRole(user: UserRecord, newRole: string) {
        router.patch(
            updateRole.url({ user: user.id }),
            { role: newRole },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    }

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
                    <CardContent>
                        <form
                            onSubmit={submitSearch}
                            className="grid gap-4 sm:grid-cols-2"
                        >
                            <div className="grid gap-1.5">
                                <Label htmlFor="user-role">Role</Label>
                                <Select
                                    value={form.data.role}
                                    onValueChange={changeRoleFilter}
                                >
                                    <SelectTrigger
                                        id="user-role"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="All roles" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all">
                                            All roles
                                        </SelectItem>
                                        {ROLE_OPTIONS.map((role) => (
                                            <SelectItem
                                                key={role.value}
                                                value={role.value}
                                            >
                                                {role.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-1.5">
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
                                    Try a different name or email.
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
                                                        <Link
                                                            href={showUser.url({
                                                                user: user.id,
                                                            })}
                                                            className="min-w-0 truncate hover:underline"
                                                        >
                                                            {user.name}
                                                        </Link>
                                                        {user.id ===
                                                            current_user_id && (
                                                            <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                                                                You
                                                            </span>
                                                        )}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        <Link
                                                            href={showUser.url({
                                                                user: user.id,
                                                            })}
                                                            className="break-all hover:underline"
                                                        >
                                                            {user.email}
                                                        </Link>
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end gap-1.5">
                                                    {user.banned_at !==
                                                        null && (
                                                        <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700">
                                                            Banned
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="mt-3 flex items-center justify-between gap-3">
                                                <Select
                                                    value={user.role}
                                                    onValueChange={(value) =>
                                                        changeUserRole(
                                                            user,
                                                            value,
                                                        )
                                                    }
                                                    disabled={
                                                        user.id ===
                                                        current_user_id
                                                    }
                                                >
                                                    <SelectTrigger
                                                        size="sm"
                                                        className="w-32"
                                                    >
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {ROLE_OPTIONS.map(
                                                            (role) => (
                                                                <SelectItem
                                                                    key={
                                                                        role.value
                                                                    }
                                                                    value={
                                                                        role.value
                                                                    }
                                                                >
                                                                    {role.label}
                                                                </SelectItem>
                                                            ),
                                                        )}
                                                    </SelectContent>
                                                </Select>
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
                                                            <Link
                                                                href={showUser.url(
                                                                    {
                                                                        user: user.id,
                                                                    },
                                                                )}
                                                                className="min-w-0 truncate hover:underline"
                                                            >
                                                                {user.name}
                                                            </Link>
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
                                                        {user.id ===
                                                        current_user_id ? (
                                                            <span
                                                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${roleBadgeClass(user.role)}`}
                                                            >
                                                                {user.role ===
                                                                    'admin' && (
                                                                    <ShieldCheck className="size-3" />
                                                                )}
                                                                {roleLabel(
                                                                    user.role,
                                                                )}
                                                            </span>
                                                        ) : (
                                                            <Select
                                                                value={
                                                                    user.role
                                                                }
                                                                onValueChange={(
                                                                    value,
                                                                ) =>
                                                                    changeUserRole(
                                                                        user,
                                                                        value,
                                                                    )
                                                                }
                                                            >
                                                                <SelectTrigger
                                                                    size="sm"
                                                                    className="w-32"
                                                                >
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    {ROLE_OPTIONS.map(
                                                                        (
                                                                            role,
                                                                        ) => (
                                                                            <SelectItem
                                                                                key={
                                                                                    role.value
                                                                                }
                                                                                value={
                                                                                    role.value
                                                                                }
                                                                            >
                                                                                {
                                                                                    role.label
                                                                                }
                                                                            </SelectItem>
                                                                        ),
                                                                    )}
                                                                </SelectContent>
                                                            </Select>
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
                                                        <div className="flex items-center justify-end gap-1">
                                                            <IconAction label="View details">
                                                                <Button
                                                                    asChild
                                                                    variant="ghost"
                                                                    size="icon"
                                                                >
                                                                    <Link
                                                                        href={showUser.url(
                                                                            {
                                                                                user: user.id,
                                                                            },
                                                                        )}
                                                                    >
                                                                        <Eye />
                                                                    </Link>
                                                                </Button>
                                                            </IconAction>
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
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            </>
                        )}

                        {users.last_page > 1 && (
                            <div className="mt-6 flex items-center justify-center gap-4">
                                {users.prev_page_url ? (
                                    <PaginationLink href={users.prev_page_url}>
                                        <ChevronLeftIcon />
                                        <span>Previous</span>
                                    </PaginationLink>
                                ) : (
                                    <span className="inline-flex h-9 items-center gap-1 rounded-md px-2.5 text-sm opacity-50">
                                        <ChevronLeftIcon />
                                        Previous
                                    </span>
                                )}
                                <span className="text-sm text-muted-foreground">
                                    Page {users.current_page} of{' '}
                                    {users.last_page}
                                </span>
                                {users.next_page_url ? (
                                    <PaginationLink href={users.next_page_url}>
                                        <span>Next</span>
                                        <ChevronRightIcon />
                                    </PaginationLink>
                                ) : (
                                    <span className="inline-flex h-9 items-center gap-1 rounded-md px-2.5 text-sm opacity-50">
                                        Next
                                        <ChevronRightIcon />
                                    </span>
                                )}
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
                <DialogContent className="sm:max-w-2xl">
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
                        encType="multipart/form-data"
                        onSubmit={(event) => {
                            event.preventDefault();
                            submitInvite();
                        }}
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="invite-first-name">
                                    First name
                                </Label>
                                <Input
                                    id="invite-first-name"
                                    value={inviteForm.data.first_name}
                                    onChange={(event) =>
                                        inviteForm.setData(
                                            'first_name',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Jane"
                                />
                                {inviteForm.errors.first_name && (
                                    <p className="text-xs text-destructive">
                                        {inviteForm.errors.first_name}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="invite-last-name">
                                    Last name
                                </Label>
                                <Input
                                    id="invite-last-name"
                                    value={inviteForm.data.last_name}
                                    onChange={(event) =>
                                        inviteForm.setData(
                                            'last_name',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Doe"
                                />
                                {inviteForm.errors.last_name && (
                                    <p className="text-xs text-destructive">
                                        {inviteForm.errors.last_name}
                                    </p>
                                )}
                            </div>
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
                        <div className="grid gap-1.5">
                            <Label htmlFor="invite-role">Role</Label>
                            <Select
                                value={inviteForm.data.role}
                                onValueChange={(value) =>
                                    inviteForm.setData('role', value)
                                }
                            >
                                <SelectTrigger
                                    id="invite-role"
                                    className="w-full"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {ROLE_OPTIONS.map((role) => (
                                        <SelectItem
                                            key={role.value}
                                            value={role.value}
                                        >
                                            {role.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="invite-dob">
                                    Date of birth
                                </Label>
                                <DatePicker
                                    id="invite-dob"
                                    value={inviteForm.data.date_of_birth}
                                    onChange={(value) =>
                                        inviteForm.setData(
                                            'date_of_birth',
                                            value,
                                        )
                                    }
                                    placeholder="mm/dd/yyyy"
                                />
                                {inviteForm.errors.date_of_birth && (
                                    <p className="text-xs text-destructive">
                                        {inviteForm.errors.date_of_birth}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="invite-hired">Hired date</Label>
                                <DatePicker
                                    id="invite-hired"
                                    value={inviteForm.data.hired_date}
                                    onChange={(value) =>
                                        inviteForm.setData('hired_date', value)
                                    }
                                    placeholder="mm/dd/yyyy"
                                />
                                {inviteForm.errors.hired_date && (
                                    <p className="text-xs text-destructive">
                                        {inviteForm.errors.hired_date}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="invite-license-number">
                                    Driver license number
                                </Label>
                                <Input
                                    id="invite-license-number"
                                    value={
                                        inviteForm.data.driver_license_number
                                    }
                                    onChange={(event) =>
                                        inviteForm.setData(
                                            'driver_license_number',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="e.g. C8472931"
                                />
                                {inviteForm.errors.driver_license_number && (
                                    <p className="text-xs text-destructive">
                                        {
                                            inviteForm.errors
                                                .driver_license_number
                                        }
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="invite-license-exp">
                                    License expiration date
                                </Label>
                                <DatePicker
                                    id="invite-license-exp"
                                    value={
                                        inviteForm.data.license_expiration_date
                                    }
                                    onChange={(value) =>
                                        inviteForm.setData(
                                            'license_expiration_date',
                                            value,
                                        )
                                    }
                                    placeholder="mm/dd/yyyy"
                                />
                                {inviteForm.errors.license_expiration_date && (
                                    <p className="text-xs text-destructive">
                                        {
                                            inviteForm.errors
                                                .license_expiration_date
                                        }
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-1.5">
                            <Label>Attached files</Label>
                            <div className="flex flex-col gap-2">
                                {pendingDocuments.map((doc, index) => (
                                    <div
                                        key={index}
                                        className="rounded-md border border-border p-3"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Select
                                                value={doc.type}
                                                onValueChange={(value) =>
                                                    updateDocumentType(
                                                        index,
                                                        value,
                                                    )
                                                }
                                            >
                                                <SelectTrigger className="w-full sm:w-44">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {DOCUMENT_TYPE_OPTIONS.map(
                                                        (option) => (
                                                            <SelectItem
                                                                key={
                                                                    option.value
                                                                }
                                                                value={
                                                                    option.value
                                                                }
                                                            >
                                                                {option.label}
                                                            </SelectItem>
                                                        ),
                                                    )}
                                                </SelectContent>
                                            </Select>
                                            <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-2 rounded-md border border-dashed px-3 py-2">
                                                <Upload className="size-4 shrink-0 text-muted-foreground" />
                                                <span className="min-w-0 flex-1 truncate text-sm">
                                                    {doc.file.size > 0
                                                        ? doc.file.name
                                                        : 'Choose file'}
                                                </span>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    onChange={(event) =>
                                                        updateDocumentFile(
                                                            index,
                                                            event.target
                                                                .files?.[0] ??
                                                                null,
                                                        )
                                                    }
                                                />
                                            </label>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() =>
                                                    removeDocument(index)
                                                }
                                                aria-label="Remove document"
                                            >
                                                <Trash2 />
                                            </Button>
                                        </div>
                                        {doc.type === 'custom' && (
                                            <div className="mt-2 grid gap-1.5">
                                                <Input
                                                    value={doc.label}
                                                    onChange={(event) =>
                                                        updateDocumentLabel(
                                                            index,
                                                            event.target.value,
                                                        )
                                                    }
                                                    placeholder="Document name"
                                                />
                                            </div>
                                        )}
                                    </div>
                                ))}
                                <div className="flex items-center gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={addDocument}
                                    >
                                        <Plus />
                                        Add file
                                    </Button>
                                </div>
                            </div>
                            <p className="text-xs text-muted-foreground">
                                License, certifications, MVR, or other employee
                                records.
                            </p>
                        </div>
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

DashboardUsers.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Users',
            href: dashboardUsers(),
        },
    ],
};
