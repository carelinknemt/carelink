import { MoreHorizontal, ThumbsDown, ThumbsUp } from 'lucide-react';
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
        status: 'PENDING',
        submitted: '2026-08-18 14:22',
    },
    {
        id: 2,
        company: 'Humboldt Senior Center',
        contact: 'Paul Nguyen',
        phone: '(707) 555-0177',
        type: 'Senior Center',
        status: 'PENDING',
        submitted: '2026-08-17 09:05',
    },
    {
        id: 3,
        company: 'Redwood Dialysis LLC',
        contact: 'Kim Foster',
        phone: '(707) 555-0142',
        type: 'Dialysis Center',
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

    return (
        <SimulationShell
            page="Business Partners"
            description="Partnership inquiries from organizations. Pending requests can be approved or rejected."
        >
            <div className="flex flex-col gap-4">
                <Card id="kms-demo-bp-table">
                    <CardHeader>
                        <CardTitle className="text-base">
                            Showing 1&ndash;3 of 3 inquiries
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Company</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Submitted</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {requests.map((request) => (
                                        <TableRow key={request.id}>
                                            <TableCell>
                                                <p className="font-medium">
                                                    {request.company}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    partners@
                                                    {request.company
                                                        .toLowerCase()
                                                        .replace(/\s+/g, '')}
                                                    .com
                                                </p>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-sm">
                                                    {request.contact}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {request.phone}
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
