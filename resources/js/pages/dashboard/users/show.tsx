import { Head, Link, router } from '@inertiajs/react';
import { Ban, CheckCircle2, FileText, ShieldCheck } from 'lucide-react';
import { CopyButton } from '@/components/carelink/copy-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { formatDate, formatDateTime, statusLabel } from '@/lib/bookings';
import { roleBadgeClass, roleLabel, ROLE_OPTIONS } from '@/lib/users';
import { dashboard } from '@/routes';
import { users as dashboardUsers } from '@/routes/dashboard';
import { resume as applicationResumeUrl } from '@/routes/dashboard/applications';
import { show as bookingShowUrl } from '@/routes/dashboard/bookings';
import { banToggle, updateRole } from '@/routes/dashboard/users';
import type {
    UserApplicationEntry,
    UserAuditEntry,
    UserDetail,
} from '@/types/dashboard';

type UserDetailProps = {
    user: UserDetail;
    current_user_id: number;
    applications: UserApplicationEntry[];
    audits: UserAuditEntry[];
};

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
}: UserDetailProps) {
    const isSelf = user.id === current_user_id;
    const isBanned = user.banned_at !== null;

    function changeUserRole(newRole: string) {
        router.patch(
            updateRole.url({ user: user.id }),
            { role: newRole },
            {
                preserveScroll: true,
                preserveState: true,
            },
        );
    }

    function toggleBan() {
        router.post(
            banToggle.url({ user: user.id }),
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
                </div>
            </div>
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
