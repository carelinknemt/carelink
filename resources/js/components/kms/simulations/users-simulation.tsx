import { Ban, CheckCircle2, Search, ShieldCheck, UserPlus } from 'lucide-react';
import { useState } from 'react';
import SimulationShell from '@/components/kms/simulation-shell';
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

type DemoUser = {
    id: number;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'dispatcher';
    banned: boolean;
    joined: string;
};

const ROLE_OPTIONS = [
    {
        value: 'admin' as const,
        label: 'Admin',
        color: 'border-violet-200 bg-violet-50 text-violet-700',
    },
    {
        value: 'manager' as const,
        label: 'Manager',
        color: 'border-sky-200 bg-sky-50 text-sky-700',
    },
    {
        value: 'dispatcher' as const,
        label: 'Dispatcher',
        color: 'border-slate-200 bg-slate-50 text-slate-700',
    },
];

const INITIAL: DemoUser[] = [
    {
        id: 1,
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'admin',
        banned: false,
        joined: '2026-07-01',
    },
    {
        id: 2,
        name: 'John Smith',
        email: 'john@example.com',
        role: 'dispatcher',
        banned: false,
        joined: '2026-07-15',
    },
    {
        id: 3,
        name: 'Maria Lopez',
        email: 'maria@example.com',
        role: 'manager',
        banned: true,
        joined: '2026-06-10',
    },
];

function roleBadgeClass(role: string): string {
    return (
        ROLE_OPTIONS.find((r) => r.value === role)?.color ??
        'border-slate-200 bg-slate-50 text-slate-700'
    );
}

function roleLabel(role: string): string {
    return ROLE_OPTIONS.find((r) => r.value === role)?.label ?? role;
}

export default function UsersSimulation() {
    const [users, setUsers] = useState(INITIAL);
    const [inviteOpen, setInviteOpen] = useState(false);
    const [banTarget, setBanTarget] = useState<DemoUser | null>(null);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');

    const filtered = users.filter((user) => {
        const matchesSearch =
            !search ||
            user.name.toLowerCase().includes(search.toLowerCase()) ||
            user.email.toLowerCase().includes(search.toLowerCase());
        const matchesRole = !roleFilter || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    return (
        <SimulationShell
            page="Users"
            description="Manage dashboard accounts. Add a teammate or ban an account the same way you would in the real dashboard."
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                        <p className="text-lg font-semibold">Users</p>
                        <p className="text-sm text-muted-foreground">
                            New users receive a password reset link and a
                            Knowledge Base guide by email.
                        </p>
                    </div>
                    <Button
                        id="kms-demo-us-add"
                        type="button"
                        onClick={() => setInviteOpen(true)}
                    >
                        <UserPlus />
                        Add user
                    </Button>
                </div>

                <Card>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="kms-demo-us-role-filter">
                                    Role
                                </Label>
                                <Select
                                    value={roleFilter}
                                    onValueChange={setRoleFilter}
                                >
                                    <SelectTrigger
                                        id="kms-demo-us-role-filter"
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
                                <Label htmlFor="kms-demo-us-search">
                                    Name or email
                                </Label>
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="kms-demo-us-search"
                                        type="search"
                                        placeholder="Search users…"
                                        className="pl-9"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card id="kms-demo-us-table">
                    <CardContent className="pt-6">
                        <div className="overflow-x-auto">
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
                                    {filtered.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                {user.name}
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell id="kms-demo-us-role">
                                                <Select
                                                    value={user.role}
                                                    onValueChange={(
                                                        value,
                                                    ) => {
                                                        if (
                                                            value !==
                                                            user.role
                                                        ) {
                                                            setUsers(
                                                                (current) =>
                                                                    current.map(
                                                                        (
                                                                            row,
                                                                        ) =>
                                                                            row.id ===
                                                                            user.id
                                                                                ? {
                                                                                      ...row,
                                                                                      role: value as DemoUser['role'],
                                                                                  }
                                                                                : row,
                                                                    ),
                                                            );
                                                        }
                                                    }}
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
                                            </TableCell>
                                            <TableCell>
                                                {user.banned ? (
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
                                                {formatDate(user.joined)}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {user.banned ? (
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            setUsers(
                                                                (current) =>
                                                                    current.map(
                                                                        (
                                                                            row,
                                                                        ) =>
                                                                            row.id ===
                                                                            user.id
                                                                                ? {
                                                                                      ...row,
                                                                                      banned: false,
                                                                                  }
                                                                                : row,
                                                                    ),
                                                            )
                                                        }
                                                    >
                                                        <CheckCircle2 />
                                                        Unban
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        id="kms-demo-us-ban"
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() =>
                                                            setBanTarget(user)
                                                        }
                                                    >
                                                        <Ban />
                                                        Ban
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                <DialogContent id="kms-demo-us-invite-dialog">
                    <DialogHeader>
                        <DialogTitle>Add a user</DialogTitle>
                        <DialogDescription>
                            The account is created without a password. The new
                            user receives a password reset link and a guide to
                            the Knowledge Base by email.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-1.5">
                            <Label htmlFor="demo-invite-name">Full name</Label>
                            <Input
                                id="demo-invite-name"
                                placeholder="Jane Doe"
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="demo-invite-email">Email</Label>
                            <Input
                                id="demo-invite-email"
                                type="email"
                                placeholder="jane@example.com"
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="demo-invite-role">Role</Label>
                            <Select defaultValue="dispatcher">
                                <SelectTrigger
                                    id="demo-invite-role"
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
                    </div>
                    <DialogFooter className="mt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="button"
                            onClick={() => setInviteOpen(false)}
                        >
                            Add user and send links
                        </Button>
                    </DialogFooter>
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
                            onClick={() => {
                                if (banTarget) {
                                    setUsers((current) =>
                                        current.map((row) =>
                                            row.id === banTarget.id
                                                ? { ...row, banned: true }
                                                : row,
                                        ),
                                    );
                                }

                                setBanTarget(null);
                            }}
                        >
                            <Ban />
                            Ban user
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </SimulationShell>
    );
}
