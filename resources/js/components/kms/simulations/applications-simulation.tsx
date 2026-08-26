import {
    Eye,
    FileText,
    MoreHorizontal,
    Search,
    ThumbsDown,
    ThumbsUp,
    Trash2,
} from 'lucide-react';
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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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

type DemoApplication = {
    id: number;
    name: string;
    email: string;
    role: string;
    submitted: string;
    letter: string;
    resume: string;
};

const ROWS: DemoApplication[] = [
    {
        id: 1,
        name: 'Jane Doe',
        email: 'jane@example.com',
        role: 'Medical Transport Driver',
        submitted: '2026-08-15',
        letter: 'I have five years of NEMT experience and a PASS certification.',
        resume: 'jane-doe-resume.pdf',
    },
    {
        id: 2,
        name: 'John Smith',
        email: 'john@example.com',
        role: 'Dispatcher',
        submitted: '2026-08-14',
        letter: 'Detail-oriented dispatcher with scheduling experience.',
        resume: 'john-smith-resume.pdf',
    },
];

export default function ApplicationsSimulation() {
    const [details, setDetails] = useState<DemoApplication | null>(null);
    const [decision, setDecision] = useState<{
        application: DemoApplication;
        action: 'accept' | 'reject';
    } | null>(null);

    return (
        <SimulationShell
            page="Applications"
            description="Review employment applications for each posted role. Open the actions menu to see how decisions are made."
        >
            <div className="flex flex-col gap-4">
                <Card>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div
                                className="grid gap-1.5"
                                id="kms-demo-ap-filter"
                            >
                                <Label htmlFor="demo-apps-role">Role</Label>
                                <Select defaultValue="__all">
                                    <SelectTrigger
                                        id="demo-apps-role"
                                        className="w-full"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all">
                                            All roles
                                        </SelectItem>
                                        <SelectItem value="driver">
                                            Medical Transport Driver
                                        </SelectItem>
                                        <SelectItem value="dispatcher">
                                            Dispatcher
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="demo-apps-search">
                                    Name or email
                                </Label>
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="demo-apps-search"
                                        type="search"
                                        placeholder="Search applicants..."
                                        className="pl-9"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto" id="kms-demo-ap-table">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Applicant</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="hidden whitespace-nowrap lg:table-cell">
                                            Submitted
                                        </TableHead>
                                        <TableHead className="w-10">
                                            <span className="sr-only">
                                                Actions
                                            </span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {ROWS.map((application) => (
                                        <TableRow key={application.id}>
                                            <TableCell className="font-medium">
                                                {application.name}
                                                <p className="text-xs font-normal text-muted-foreground">
                                                    {application.email}
                                                </p>
                                            </TableCell>
                                            <TableCell className="text-sm text-muted-foreground">
                                                {application.role}
                                            </TableCell>
                                            <TableCell className="hidden whitespace-nowrap lg:table-cell">
                                                {formatDate(
                                                    application.submitted,
                                                )}
                                            </TableCell>
                                            <TableCell id="kms-demo-ap-actions">
                                                <div className="flex items-center justify-end gap-1">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger
                                                            asChild
                                                        >
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                size="icon"
                                                                aria-label="Actions"
                                                            >
                                                                <MoreHorizontal />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    setDetails(
                                                                        application,
                                                                    )
                                                                }
                                                            >
                                                                <Eye />
                                                                View Details
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    setDecision(
                                                                        {
                                                                            application,
                                                                            action: 'accept',
                                                                        },
                                                                    )
                                                                }
                                                            >
                                                                <ThumbsUp />
                                                                Accept
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() =>
                                                                    setDecision(
                                                                        {
                                                                            application,
                                                                            action: 'reject',
                                                                        },
                                                                    )
                                                                }
                                                            >
                                                                <ThumbsDown />
                                                                Reject
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        aria-label="Delete application"
                                                    >
                                                        <Trash2 />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog
                open={details !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setDetails(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{details?.name}</DialogTitle>
                        <DialogDescription>
                            {details?.role ?? 'Position'}
                        </DialogDescription>
                    </DialogHeader>
                    <dl className="grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
                        <div>
                            <dt className="text-xs text-muted-foreground">
                                Email
                            </dt>
                            <dd className="font-medium">{details?.email}</dd>
                        </div>
                        <div>
                            <dt className="text-xs text-muted-foreground">
                                Submitted
                            </dt>
                            <dd className="font-medium">
                                {details ? formatDate(details.submitted) : '—'}
                            </dd>
                        </div>
                        <div>
                            <dt className="text-xs text-muted-foreground">
                                Resume
                            </dt>
                            <dd className="flex items-center gap-1 font-medium">
                                <FileText className="size-3.5" />
                                {details?.resume}
                            </dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="flex items-center gap-1 text-xs text-muted-foreground">
                                <FileText className="size-3.5" />
                                Motivation / Cover letter
                            </dt>
                            <dd className="mt-1 rounded-lg border p-3 text-sm whitespace-pre-wrap">
                                {details?.letter}
                            </dd>
                        </div>
                    </dl>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Close
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog
                open={decision !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setDecision(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {decision?.action === 'accept'
                                ? 'Accept'
                                : 'Reject'}{' '}
                            {decision?.application.name}'s application?
                        </DialogTitle>
                        <DialogDescription>
                            {decision?.action === 'accept'
                                ? 'An acceptance email will be sent to the applicant.'
                                : 'A rejection email will be sent to the applicant.'}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="button"
                            variant={
                                decision?.action === 'reject'
                                    ? 'destructive'
                                    : 'default'
                            }
                            onClick={() => setDecision(null)}
                        >
                            {decision?.action === 'accept' ? (
                                <ThumbsUp />
                            ) : (
                                <ThumbsDown />
                            )}
                            {decision?.action === 'accept'
                                ? 'Accept application'
                                : 'Reject application'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </SimulationShell>
    );
}
