import { Building2, MoreHorizontal, Search, ThumbsDown, ThumbsUp } from 'lucide-react';
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
    DropdownMenuSeparator,
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
import { Textarea } from '@/components/ui/textarea';
import { formatDateTime, statusBadgeClass, statusLabel } from '@/lib/bookings';

type DemoRequest = {
    id: number;
    company: string;
    contact: string;
    phone: string;
    type: string;
    email: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
    submitted: string;
};

const INITIAL: DemoRequest[] = [
    {
        id: 1,
        company: 'North Coast Clinic',
        contact: 'Dr. Ana Reyes',
        phone: '(707) 555-0110',
        type: 'Clinic',
        email: 'partnerships@northcoastclinic.com',
        status: 'PENDING',
        submitted: '2026-08-18 14:22',
    },
    {
        id: 2,
        company: 'Humboldt Senior Center',
        contact: 'Paul Nguyen',
        phone: '(707) 555-0177',
        type: 'Senior Center',
        email: 'partnerships@humboldtseniorcenter.com',
        status: 'PENDING',
        submitted: '2026-08-17 09:05',
    },
    {
        id: 3,
        company: 'Redwood Dialysis LLC',
        contact: 'Kim Foster',
        phone: '(707) 555-0142',
        type: 'Dialysis Center',
        email: 'partnerships@redwooddialysis.com',
        status: 'APPROVED',
        submitted: '2026-08-10 11:40',
    },
];

export default function BusinessPartnersSimulation() {
    const [requests, setRequests] = useState(INITIAL);
    const [decision, setDecision] = useState<{
        request: DemoRequest;
        action: 'approve' | 'reject';
    } | null>(null);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('PENDING');

    const filtered = requests.filter((request) => {
        const matchesSearch =
            !search ||
            request.company.toLowerCase().includes(search.toLowerCase()) ||
            request.contact.toLowerCase().includes(search.toLowerCase()) ||
            request.email.toLowerCase().includes(search.toLowerCase());
        const matchesStatus =
            statusFilter === '__all' || request.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <SimulationShell
            page="Business Partners"
            description="Partnership inquiries from organizations. Pending requests can be approved or rejected."
        >
            <div className="flex flex-col gap-4">
                <Card>
                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="kms-demo-bp-search">
                                    Search
                                </Label>
                                <div className="relative">
                                    <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                                    <Input
                                        id="kms-demo-bp-search"
                                        type="search"
                                        placeholder="Company, contact, email, or organization type…"
                                        className="pl-9"
                                        value={search}
                                        onChange={(event) =>
                                            setSearch(event.target.value)
                                        }
                                    />
                                </div>
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="kms-demo-bp-status-filter">
                                    Status
                                </Label>
                                <Select
                                    value={statusFilter}
                                    onValueChange={setStatusFilter}
                                >
                                    <SelectTrigger
                                        id="kms-demo-bp-status-filter"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="All statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="__all">
                                            All statuses
                                        </SelectItem>
                                        <SelectItem value="PENDING">
                                            Pending
                                        </SelectItem>
                                        <SelectItem value="APPROVED">
                                            Approved
                                        </SelectItem>
                                        <SelectItem value="REJECTED">
                                            Rejected
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        {filtered.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-16 text-center">
                                <Building2 className="size-10 text-muted-foreground" />
                                <p className="font-medium">
                                    No business inquiries found
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {search
                                        ? 'Try adjusting your search.'
                                        : 'Inquiries appear here once businesses submit the partnership form.'}
                                </p>
                            </div>
                        ) : (
                            <>
                                <ul className="flex flex-col gap-3 md:hidden">
                                    {filtered.map((request) => (
                                        <li
                                            key={request.id}
                                            className="rounded-lg border border-border p-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <p className="font-medium">
                                                        {request.company}
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {request.contact}
                                                    </p>
                                                </div>
                                                <span
                                                    className={`shrink-0 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(request.status)}`}
                                                >
                                                    {statusLabel(
                                                        request.status,
                                                    )}
                                                </span>
                                            </div>
                                            <div className="mt-3 flex items-center justify-between gap-3">
                                                <span className="text-sm text-muted-foreground">
                                                    {request.type}
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    {formatDateTime(
                                                        request.submitted,
                                                    )}
                                                </span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                <div className="hidden md:block">
                                    <div className="overflow-hidden rounded-md border">
                                        <Table id="kms-demo-bp-table">
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>
                                                        Company
                                                    </TableHead>
                                                    <TableHead>
                                                        Contact
                                                    </TableHead>
                                                    <TableHead>
                                                        Type
                                                    </TableHead>
                                                    <TableHead>
                                                        Status
                                                    </TableHead>
                                                    <TableHead>
                                                        Submitted
                                                    </TableHead>
                                                    <TableHead className="text-right">
                                                        Actions
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {filtered.map((request) => (
                                                    <TableRow key={request.id}>
                                                        <TableCell>
                                                            <p className="font-medium">
                                                                {
                                                                    request.company
                                                                }
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {
                                                                    request.email
                                                                }
                                                            </p>
                                                        </TableCell>
                                                        <TableCell>
                                                            <p className="text-sm">
                                                                {
                                                                    request.contact
                                                                }
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {
                                                                    request.phone
                                                                }
                                                            </p>
                                                        </TableCell>
                                                        <TableCell>
                                                            {request.type}
                                                        </TableCell>
                                                        <TableCell id="kms-demo-bp-status">
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
                                                                request.submitted,
                                                            )}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div
                                                                id="kms-demo-bp-actions"
                                                                className="flex justify-end"
                                                            >
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
                                                                            disabled={
                                                                                request.status !==
                                                                                'PENDING'
                                                                            }
                                                                            onClick={() =>
                                                                                setDecision(
                                                                                    {
                                                                                        request,
                                                                                        action: 'approve',
                                                                                    },
                                                                                )
                                                                            }
                                                                        >
                                                                            <ThumbsUp />
                                                                            Approve
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem
                                                                            disabled={
                                                                                request.status !==
                                                                                'PENDING'
                                                                            }
                                                                            onClick={() =>
                                                                                setDecision(
                                                                                    {
                                                                                        request,
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
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

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
                            {decision?.action === 'approve'
                                ? 'Approve partnership'
                                : 'Reject partnership'}
                        </DialogTitle>
                        <DialogDescription>
                            {decision?.action === 'approve'
                                ? `Confirm ${decision?.request.company} as a transportation partner. Enter the company email that should receive the approval confirmation.`
                                : `Reject ${decision?.request.company} and explain why. The reason will be emailed to them.`}
                        </DialogDescription>
                    </DialogHeader>
                    {decision?.action === 'approve' ? (
                        <div className="grid gap-1.5">
                            <Label htmlFor="demo-partner-email">
                                Company email
                            </Label>
                            <Input
                                id="demo-partner-email"
                                type="email"
                                placeholder="partnerships@company.com"
                            />
                        </div>
                    ) : (
                        <div className="grid gap-1.5">
                            <Label htmlFor="demo-partner-reason">
                                Rejection reason
                            </Label>
                            <Textarea
                                id="demo-partner-reason"
                                rows={4}
                                placeholder="Explain why this partnership cannot be approved…"
                            />
                        </div>
                    )}
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
                            onClick={() => {
                                if (decision) {
                                    setRequests((current) =>
                                        current.map((row) =>
                                            row.id === decision.request.id
                                                ? {
                                                      ...row,
                                                      status:
                                                          decision.action ===
                                                          'approve'
                                                              ? 'APPROVED'
                                                              : 'REJECTED',
                                                  }
                                                : row,
                                        ),
                                    );
                                }

                                setDecision(null);
                            }}
                        >
                            {decision?.action === 'approve' ? (
                                <ThumbsUp />
                            ) : (
                                <ThumbsDown />
                            )}
                            {decision?.action === 'approve'
                                ? 'Approve partnership'
                                : 'Reject partnership'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </SimulationShell>
    );
}
