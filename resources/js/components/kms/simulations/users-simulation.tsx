import { Ban, CheckCircle2, ShieldCheck, UserPlus } from 'lucide-react';
import { useState } from 'react';
import SimulationShell from '@/components/kms/simulation-shell';
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
    admin: boolean;
    banned: boolean;
    joined: string;
};

const INITIAL: DemoUser[] = [
    {
        id: 1,
        name: 'Jane Doe',
        email: 'jane@example.com',
        admin: true,
        banned: false,
        joined: '2026-07-01',
    },
    {
        id: 2,
        name: 'John Smith',
        email: 'john@example.com',
        admin: false,
        banned: false,
        joined: '2026-07-15',
    },
    {
        id: 3,
        name: 'Maria Lopez',
        email: 'maria@example.com',
        admin: false,
        banned: true,
        joined: '2026-06-10',
    },
];

export default function UsersSimulation() {
    const [users, setUsers] = useState(INITIAL);
    const [inviteOpen, setInviteOpen] = useState(false);
    const [banTarget, setBanTarget] = useState<DemoUser | null>(null);

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

                <Card id="kms-demo-us-table">
                    <CardHeader>
                        <CardTitle className="text-base">
                            Showing 1&ndash;3 of 3 users
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
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
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">
                                                {user.name}
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell id="kms-demo-us-role">
                                                {user.admin ? (
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
                        <label className="flex items-center gap-2 text-sm font-medium">
                            <input
                                type="checkbox"
                                className="rounded border-slate-300"
                            />
                            Admin user (can manage users and payments)
                        </label>
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
