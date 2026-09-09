import { Head, Link, router, useForm } from '@inertiajs/react';
import {
    Ban,
    CheckCircle2,
    Download,
    Edit3,
    FileText,
    ShieldCheck,
    Trash2,
    Upload,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { CopyButton } from '@/components/carelink/copy-button';
import DatePicker from '@/components/carelink/date-picker';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { formatDate, formatDateTime, statusLabel } from '@/lib/bookings';
import {
    DOCUMENT_TYPE_OPTIONS,
    roleBadgeClass,
    roleLabel,
    ROLE_OPTIONS,
} from '@/lib/users';
import { dashboard } from '@/routes';
import { users as dashboardUsers } from '@/routes/dashboard';
import { resume as applicationResumeUrl } from '@/routes/dashboard/applications';
import { show as bookingShowUrl } from '@/routes/dashboard/bookings';
import users from '@/routes/dashboard/users';
import type {
    UserApplicationEntry,
    UserAuditEntry,
    UserDetail,
    UserDocumentRecord,
} from '@/types/dashboard';

type UserDetailProps = {
    user: UserDetail;
    current_user_id: number;
    applications: UserApplicationEntry[];
    audits: UserAuditEntry[];
    documents: UserDocumentRecord[];
};

function formatFileSize(bytes: number | null): string {
    if (bytes === null) {
        return '';
    }

    if (bytes < 1024) {
        return `${bytes} B`;
    }

    if (bytes < 1024 * 1024) {
        return `${(bytes / 1024).toFixed(0)} KB`;
    }

    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function auditActionLabel(audit: UserAuditEntry): string {
    if (audit.action === 'cancelled') {
        return 'Cancelled booking';
    }

    if (audit.action === 'status_changed') {
        return `Status changed: ${statusLabel(
            audit.from_value ?? 'Unknown',
        )} → ${statusLabel(audit.to_value ?? 'Unknown')}`;
    }

    return 'Booking details updated';
}

export default function UserDetail({
    user,
    current_user_id,
    applications,
    audits,
    documents,
}: UserDetailProps) {
    const isSelf = user.id === current_user_id;
    const isBanned = user.banned_at !== null;

    const [editOpen, setEditOpen] = useState(false);
    const [uploadOpen, setUploadOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const editForm = useForm({
        first_name: user.first_name ?? '',
        last_name: user.last_name ?? '',
        email: user.email,
        date_of_birth: user.date_of_birth ?? '',
        hired_date: user.hired_date ?? '',
        driver_license_number: user.driver_license_number ?? '',
        license_expiration_date: user.license_expiration_date ?? '',
    });

    const uploadForm = useForm({
        file: null as File | null,
        type: 'license',
        label: '',
    });

    function startEdit() {
        editForm.clearErrors();
        editForm.setData({
            first_name: user.first_name ?? '',
            last_name: user.last_name ?? '',
            email: user.email,
            date_of_birth: user.date_of_birth ?? '',
            hired_date: user.hired_date ?? '',
            driver_license_number: user.driver_license_number ?? '',
            license_expiration_date: user.license_expiration_date ?? '',
        });
        setEditOpen(true);
    }

    function submitEdit() {
        editForm.put(users.update.url({ user: user.id }), {
            preserveScroll: true,
            onSuccess: () => setEditOpen(false),
        });
    }

    function startUpload() {
        uploadForm.reset();
        setSelectedFile(null);
        setUploadOpen(true);
    }

    function submitUpload() {
        uploadForm.post(users.documents.store.url({ user: user.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setUploadOpen(false);
                setSelectedFile(null);
            },
        });
    }

    function removeDocument(document: UserDocumentRecord) {
        if (!window.confirm(`Remove ${document.file_name}?`)) {
            return;
        }

        router.delete(
            users.documents.destroy.url({
                user: user.id,
                document: document.id,
            }),
            { preserveScroll: true },
        );
    }

    function changeUserRole(newRole: string) {
        router.patch(
            users.updateRole.url({ user: user.id }),
            { role: newRole },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    }

    function toggleBan() {
        router.post(
            users.banToggle.url({ user: user.id }),
            {},
            { preserveScroll: true },
        );
    }

    return (
        <>
            <Head title={user.name}>
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 flex-col gap-1">
                        <h1 className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
                            {user.name}
                            {isSelf && (
                                <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                                    You
                                </span>
                            )}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            {user.email} · joined {formatDate(user.joined_at)}
                        </p>
                    </div>
                    {!isSelf && (
                        <Button
                            type="button"
                            variant={isBanned ? 'outline' : 'destructive'}
                            size="sm"
                            onClick={toggleBan}
                        >
                            {isBanned ? (
                                <>
                                    <CheckCircle2 />
                                    Unban
                                </>
                            ) : (
                                <>
                                    <Ban />
                                    Ban user
                                </>
                            )}
                        </Button>
                    )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <span
                        className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${roleBadgeClass(user.role)}`}
                    >
                        {user.role === 'admin' && (
                            <ShieldCheck className="size-3" />
                        )}
                        {roleLabel(user.role)}
                    </span>
                    {isBanned ? (
                        <span className="inline-flex items-center rounded-full border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700">
                            Banned
                        </span>
                    ) : (
                        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            Active
                        </span>
                    )}
                    {user.email_verified_at !== null ? (
                        <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            Email verified
                        </span>
                    ) : (
                        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
                            Email unverified
                        </span>
                    )}
                </div>

                <div className="grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <Card className="min-w-0">
                        <CardHeader>
                            <CardTitle className="text-base">Account</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="flex flex-col">
                                <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                    <dt className="min-w-0 text-sm text-muted-foreground">
                                        Role
                                    </dt>
                                    <dd className="sm:min-w-0 sm:text-right">
                                        {isSelf ? (
                                            <span
                                                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${roleBadgeClass(user.role)}`}
                                            >
                                                {roleLabel(user.role)}
                                            </span>
                                        ) : (
                                            <Select
                                                value={user.role}
                                                onValueChange={changeUserRole}
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
                                                                key={role.value}
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
                                        )}
                                    </dd>
                                </div>
                                <Separator />
                                <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                    <dt className="min-w-0 text-sm text-muted-foreground">
                                        Email
                                    </dt>
                                    <dd className="flex items-center gap-1.5 text-sm font-medium break-all sm:min-w-0 sm:justify-end sm:text-right">
                                        {user.email}
                                        <CopyButton value={user.email} />
                                    </dd>
                                </div>
                                <Separator />
                                <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                    <dt className="min-w-0 text-sm text-muted-foreground">
                                        Joined
                                    </dt>
                                    <dd className="text-sm font-medium sm:min-w-0 sm:text-right">
                                        {formatDate(user.joined_at)}
                                    </dd>
                                </div>
                                <Separator />
                                <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                    <dt className="min-w-0 text-sm text-muted-foreground">
                                        Last updated
                                    </dt>
                                    <dd className="text-sm font-medium sm:min-w-0 sm:text-right">
                                        {formatDateTime(user.updated_at)}
                                    </dd>
                                </div>
                                <Separator />
                                <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                    <dt className="min-w-0 text-sm text-muted-foreground">
                                        Two-factor auth
                                    </dt>
                                    <dd className="text-sm font-medium sm:min-w-0 sm:text-right">
                                        {user.two_factor_enabled
                                            ? 'Enabled'
                                            : 'Not enabled'}
                                    </dd>
                                </div>
                                <Separator />
                                <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                    <dt className="min-w-0 text-sm text-muted-foreground">
                                        Active sessions
                                    </dt>
                                    <dd className="text-sm font-medium sm:min-w-0 sm:text-right">
                                        {user.sessions_count}{' '}
                                        {user.sessions_count === 1
                                            ? 'device'
                                            : 'devices'}
                                    </dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>

                    <Card className="min-w-0">
                        <CardHeader>
                            <CardTitle className="text-base">
                                Job applications
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {applications.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No applications submitted while signed in.
                                </p>
                            ) : (
                                <ol className="flex flex-col">
                                    {applications.map((application, index) => (
                                        <li key={application.id}>
                                            {index > 0 && <Separator />}
                                            <div className="flex flex-col gap-0.5 py-2.5">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <p className="text-sm font-medium">
                                                        {application.position ??
                                                            'General application'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDate(
                                                            application.submitted_at,
                                                        )}
                                                    </p>
                                                </div>
                                                {application.resume_name && (
                                                    <a
                                                        href={applicationResumeUrl.url(
                                                            {
                                                                application:
                                                                    application.id,
                                                            },
                                                        )}
                                                        className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                                                    >
                                                        <FileText className="size-3" />
                                                        {
                                                            application.resume_name
                                                        }
                                                    </a>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="min-w-0">
                        <CardHeader>
                            <CardTitle className="text-base">
                                Activity
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {audits.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No booking changes recorded for this user
                                    yet.
                                </p>
                            ) : (
                                <ol className="flex flex-col">
                                    {audits.map((audit, index) => (
                                        <li key={audit.id}>
                                            {index > 0 && <Separator />}
                                            <div className="flex flex-col gap-0.5 py-2.5">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <p className="text-sm font-medium">
                                                        {auditActionLabel(
                                                            audit,
                                                        )}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatDateTime(
                                                            audit.created_at,
                                                        )}
                                                    </p>
                                                </div>
                                                {audit.booking_number && (
                                                    <Link
                                                        href={bookingShowUrl.url(
                                                            {
                                                                booking:
                                                                    audit.trip_request_id,
                                                            },
                                                        )}
                                                        className="text-xs font-semibold text-primary hover:underline"
                                                    >
                                                        {audit.booking_number}
                                                    </Link>
                                                )}
                                                {audit.reason && (
                                                    <p className="text-xs text-muted-foreground italic">
                                                        {audit.reason}
                                                    </p>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="min-w-0">
                        <CardHeader className="flex-row items-center justify-between gap-2">
                            <CardTitle className="text-base">
                                Employee details
                            </CardTitle>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={startEdit}
                            >
                                <Edit3 />
                                Edit
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <dl className="flex flex-col">
                                <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                    <dt className="min-w-0 text-sm text-muted-foreground">
                                        First name
                                    </dt>
                                    <dd className="text-sm font-medium sm:min-w-0 sm:text-right">
                                        {user.first_name || '—'}
                                    </dd>
                                </div>
                                <Separator />
                                <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                    <dt className="min-w-0 text-sm text-muted-foreground">
                                        Last name
                                    </dt>
                                    <dd className="text-sm font-medium sm:min-w-0 sm:text-right">
                                        {user.last_name || '—'}
                                    </dd>
                                </div>
                                <Separator />
                                <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                    <dt className="min-w-0 text-sm text-muted-foreground">
                                        Date of birth
                                    </dt>
                                    <dd className="text-sm font-medium sm:min-w-0 sm:text-right">
                                        {user.date_of_birth
                                            ? formatDate(user.date_of_birth)
                                            : '—'}
                                    </dd>
                                </div>
                                <Separator />
                                <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                    <dt className="min-w-0 text-sm text-muted-foreground">
                                        Hired date
                                    </dt>
                                    <dd className="text-sm font-medium sm:min-w-0 sm:text-right">
                                        {user.hired_date
                                            ? formatDate(user.hired_date)
                                            : '—'}
                                    </dd>
                                </div>
                                <Separator />
                                <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                    <dt className="min-w-0 text-sm text-muted-foreground">
                                        Driver license number
                                    </dt>
                                    <dd className="text-sm font-medium sm:min-w-0 sm:text-right">
                                        {user.driver_license_number || '—'}
                                    </dd>
                                </div>
                                <Separator />
                                <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                                    <dt className="min-w-0 text-sm text-muted-foreground">
                                        License expiration date
                                    </dt>
                                    <dd className="text-sm font-medium sm:min-w-0 sm:text-right">
                                        {user.license_expiration_date
                                            ? formatDate(
                                                  user.license_expiration_date,
                                              )
                                            : '—'}
                                    </dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>

                    <Card className="min-w-0">
                        <CardHeader className="flex-row items-center justify-between gap-2">
                            <CardTitle className="text-base">
                                Documents
                            </CardTitle>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={startUpload}
                            >
                                <Upload />
                                Add file
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {documents.length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                    No documents attached yet.
                                </p>
                            ) : (
                                <ul className="flex flex-col">
                                    {documents.map((document, index) => (
                                        <li key={document.id}>
                                            {index > 0 && <Separator />}
                                            <div className="flex items-center justify-between gap-3 py-2.5">
                                                <div className="flex min-w-0 flex-col gap-0.5">
                                                    <p className="flex items-center gap-1.5 text-sm font-medium">
                                                        <FileText className="size-3.5 shrink-0 text-muted-foreground" />
                                                        <span className="min-w-0 truncate">
                                                            {document.file_name}
                                                        </span>
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {document.label}
                                                        {formatFileSize(
                                                            document.file_size,
                                                        )
                                                            ? ` · ${formatFileSize(document.file_size)}`
                                                            : ''}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        asChild
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <a
                                                            href={users.documents.show.url(
                                                                {
                                                                    user: user.id,
                                                                    document:
                                                                        document.id,
                                                                },
                                                            )}
                                                            aria-label="Download document"
                                                        >
                                                            <Download />
                                                        </a>
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        aria-label="Remove document"
                                                        onClick={() =>
                                                            removeDocument(
                                                                document,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 />
                                                    </Button>
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog
                open={editOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditOpen(false);
                    }
                }}
            >
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Edit employee details</DialogTitle>
                        <DialogDescription>
                            Update {user.name}&apos;s employee information.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        className="grid gap-4"
                        onSubmit={(event) => {
                            event.preventDefault();
                            submitEdit();
                        }}
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="edit-first-name">
                                    First name
                                </Label>
                                <Input
                                    id="edit-first-name"
                                    value={editForm.data.first_name}
                                    onChange={(event) =>
                                        editForm.setData(
                                            'first_name',
                                            event.target.value,
                                        )
                                    }
                                />
                                {editForm.errors.first_name && (
                                    <p className="text-xs text-destructive">
                                        {editForm.errors.first_name}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="edit-last-name">
                                    Last name
                                </Label>
                                <Input
                                    id="edit-last-name"
                                    value={editForm.data.last_name}
                                    onChange={(event) =>
                                        editForm.setData(
                                            'last_name',
                                            event.target.value,
                                        )
                                    }
                                />
                                {editForm.errors.last_name && (
                                    <p className="text-xs text-destructive">
                                        {editForm.errors.last_name}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="edit-email">Email</Label>
                            <Input
                                id="edit-email"
                                type="email"
                                value={editForm.data.email}
                                onChange={(event) =>
                                    editForm.setData(
                                        'email',
                                        event.target.value,
                                    )
                                }
                            />
                            {editForm.errors.email && (
                                <p className="text-xs text-destructive">
                                    {editForm.errors.email}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="edit-dob">Date of birth</Label>
                                <DatePicker
                                    id="edit-dob"
                                    value={editForm.data.date_of_birth}
                                    onChange={(value) =>
                                        editForm.setData('date_of_birth', value)
                                    }
                                    placeholder="mm/dd/yyyy"
                                />
                                {editForm.errors.date_of_birth && (
                                    <p className="text-xs text-destructive">
                                        {editForm.errors.date_of_birth}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="edit-hired">Hired date</Label>
                                <DatePicker
                                    id="edit-hired"
                                    value={editForm.data.hired_date}
                                    onChange={(value) =>
                                        editForm.setData('hired_date', value)
                                    }
                                    placeholder="mm/dd/yyyy"
                                />
                                {editForm.errors.hired_date && (
                                    <p className="text-xs text-destructive">
                                        {editForm.errors.hired_date}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="edit-license-number">
                                    Driver license number
                                </Label>
                                <Input
                                    id="edit-license-number"
                                    value={editForm.data.driver_license_number}
                                    onChange={(event) =>
                                        editForm.setData(
                                            'driver_license_number',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="e.g. C8472931"
                                />
                                {editForm.errors.driver_license_number && (
                                    <p className="text-xs text-destructive">
                                        {editForm.errors.driver_license_number}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="edit-license-exp">
                                    License expiration date
                                </Label>
                                <DatePicker
                                    id="edit-license-exp"
                                    value={
                                        editForm.data.license_expiration_date
                                    }
                                    onChange={(value) =>
                                        editForm.setData(
                                            'license_expiration_date',
                                            value,
                                        )
                                    }
                                    placeholder="mm/dd/yyyy"
                                />
                                {editForm.errors.license_expiration_date && (
                                    <p className="text-xs text-destructive">
                                        {
                                            editForm.errors
                                                .license_expiration_date
                                        }
                                    </p>
                                )}
                            </div>
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
                                disabled={editForm.processing}
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
                open={uploadOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setUploadOpen(false);
                    }
                }}
            >
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Add a document</DialogTitle>
                        <DialogDescription>
                            Attach a license, certification, MVR, or other
                            employee record.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        className="grid gap-4"
                        encType="multipart/form-data"
                        onSubmit={(event) => {
                            event.preventDefault();
                            submitUpload();
                        }}
                    >
                        <div className="grid gap-1.5">
                            <Label htmlFor="upload-file">File</Label>
                            <label className="flex min-w-0 cursor-pointer items-center gap-2 rounded-md border border-dashed px-3 py-3">
                                <Upload className="size-4 shrink-0 text-muted-foreground" />
                                <span className="min-w-0 flex-1 truncate text-sm">
                                    {selectedFile
                                        ? selectedFile.name
                                        : 'Drop files here or choose files'}
                                </span>
                                <input
                                    ref={fileInputRef}
                                    id="upload-file"
                                    type="file"
                                    className="hidden"
                                    onChange={(event) => {
                                        const file =
                                            event.target.files?.[0] ?? null;
                                        setSelectedFile(file);
                                        uploadForm.setData('file', file);
                                    }}
                                />
                            </label>
                            {uploadForm.errors.file && (
                                <p className="text-xs text-destructive">
                                    {uploadForm.errors.file}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="upload-type">Document type</Label>
                            <Select
                                value={uploadForm.data.type}
                                onValueChange={(value) =>
                                    uploadForm.setData('type', value)
                                }
                            >
                                <SelectTrigger
                                    id="upload-type"
                                    className="w-full"
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {DOCUMENT_TYPE_OPTIONS.map((option) => (
                                        <SelectItem
                                            key={option.value}
                                            value={option.value}
                                        >
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {uploadForm.data.type === 'custom' && (
                            <div className="grid gap-1.5">
                                <Label htmlFor="upload-label">
                                    Document name
                                </Label>
                                <Input
                                    id="upload-label"
                                    value={uploadForm.data.label}
                                    onChange={(event) =>
                                        uploadForm.setData(
                                            'label',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="e.g. Background check"
                                />
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                            License, certifications, MVR, or other employee
                            records. Max 10 MB per file.
                        </p>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={uploadForm.processing}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={
                                    uploadForm.processing ||
                                    uploadForm.data.file === null
                                }
                            >
                                {uploadForm.processing
                                    ? 'Uploading…'
                                    : 'Add document'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
}

UserDetail.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Users',
            href: dashboardUsers(),
        },
        {
            title: 'User detail',
            href: dashboardUsers(),
        },
    ],
};
