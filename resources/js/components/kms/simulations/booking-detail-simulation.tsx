import { useState } from 'react';
import SimulationShell from '@/components/kms/simulation-shell';
import { Badge } from '@/components/ui/badge';
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { formatMoney, formatDateTime, statusLabel } from '@/lib/bookings';

const STATUSES = [
    'PENDING_DISPATCH',
    'BAMBI_DISPATCHED',
    'IN_TRANSIT',
    'COMPLETED',
    'CANCELLED',
];

function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="text-right text-sm font-medium">{value}</dd>
        </div>
    );
}

export default function BookingDetailSimulation() {
    const [status, setStatus] = useState('BAMBI_DISPATCHED');
    const [cancelOpen, setCancelOpen] = useState(false);
    const cancelled = status === 'CANCELLED';

    return (
        <SimulationShell
            page="Booking detail · CL-2026-0018"
            description="The booking detail page. Change the status or cancel the booking to see how the real page behaves."
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div
                        className="flex flex-wrap items-center gap-2"
                        id="kms-demo-bd-title"
                    >
                        <p className="text-lg font-semibold">CL-2026-0018</p>
                        <Badge
                            className={
                                cancelled
                                    ? 'border-rose-200 bg-rose-50 text-rose-700'
                                    : 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            }
                        >
                            {cancelled
                                ? 'CANCELLED · $30 fee refunded'
                                : 'PAID · $30 fee paid'}
                        </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div id="kms-demo-bd-status">
                            <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger size="sm" className="w-44">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {STATUSES.map((option) => (
                                        <SelectItem key={option} value={option}>
                                            {statusLabel(option)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {!cancelled && (
                            <Button
                                id="kms-demo-bd-cancel"
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => setCancelOpen(true)}
                                disabled={status === 'COMPLETED'}
                            >
                                Cancel booking
                            </Button>
                        )}
                        <Button
                            id="kms-demo-bd-export"
                            type="button"
                            variant="outline"
                            size="sm"
                        >
                            Export CSV
                        </Button>
                    </div>
                </div>

                <div className="grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <Card id="kms-demo-bd-passenger">
                        <CardHeader>
                            <CardTitle className="text-base">
                                Passenger
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="flex flex-col divide-y">
                                <DetailRow label="First name" value="Emma" />
                                <DetailRow label="Last name" value="Johnson" />
                                <DetailRow
                                    label="Phone"
                                    value="(707) 555-0134"
                                />
                                <DetailRow
                                    label="Email"
                                    value="emma@example.com"
                                />
                            </dl>
                        </CardContent>
                    </Card>

                    <Card id="kms-demo-bd-trip">
                        <CardHeader>
                            <CardTitle className="text-base">
                                Trip &amp; Billing
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="flex flex-col divide-y">
                                <DetailRow
                                    label="Trip date"
                                    value="Aug 20, 2026"
                                />
                                <DetailRow
                                    label="Pickup time"
                                    value="9:30 AM"
                                />
                                <DetailRow
                                    label="Transport type"
                                    value="Wheelchair"
                                />
                                <DetailRow
                                    label="Trip price"
                                    value={formatMoney(92)}
                                />
                            </dl>
                        </CardContent>
                    </Card>

                    <Card id="kms-demo-bd-payment">
                        <CardHeader>
                            <CardTitle className="text-base">
                                Payment &amp; Dispatch
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="flex flex-col divide-y">
                                <DetailRow
                                    label="Booking number"
                                    value="CL-2026-0018"
                                />
                                <DetailRow
                                    label="Payment status"
                                    value="PAID"
                                />
                                <DetailRow
                                    label="Paid at"
                                    value={formatDateTime('2026-08-19 10:12')}
                                />
                                <DetailRow
                                    label="Booked at"
                                    value="Aug 19, 2026, 10:02 AM"
                                />
                            </dl>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Dialog open={cancelOpen} onOpenChange={setCancelOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Cancel booking and refund?</DialogTitle>
                        <DialogDescription>
                            You are about to cancel CL-2026-0018. The paid
                            booking fee of $30.00 will be refunded to the
                            customer. This cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="outline">
                                Keep booking
                            </Button>
                        </DialogClose>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                                setStatus('CANCELLED');
                                setCancelOpen(false);
                            }}
                        >
                            Cancel booking &amp; refund
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </SimulationShell>
    );
}
