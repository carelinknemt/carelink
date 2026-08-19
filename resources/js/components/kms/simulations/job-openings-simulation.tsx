import { CircleCheck, CircleDot, Pencil, Plus, Trash2 } from 'lucide-react';
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

type DemoOpening = {
    id: number;
    title: string;
    location: string;
    type: string;
    applications: number;
    active: boolean;
};

const INITIAL: DemoOpening[] = [
    {
        id: 1,
        title: 'Medical Transport Driver',
        location: 'Eureka, CA',
        type: 'Full-Time',
        applications: 4,
        active: true,
    },
    {
        id: 2,
        title: 'Dispatcher',
        location: 'Arcata, CA',
        type: 'Part-Time',
        applications: 2,
        active: true,
    },
    {
        id: 3,
        title: 'Billing Specialist',
        location: 'Eureka, CA',
        type: 'On-Call',
        applications: 0,
        active: false,
    },
];

export default function JobOpeningsSimulation() {
    const [openings, setOpenings] = useState(INITIAL);
    const [postOpen, setPostOpen] = useState(false);

    return (
        <SimulationShell
            page="Job Openings"
            description="Post, close, and remove the roles shown on the public careers page."
        >
            <div className="flex flex-col gap-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                        <p className="text-lg font-semibold">Job Openings</p>
                        <p className="text-sm text-muted-foreground">
                            Post, update, close, or delete the roles shown on
                            the public careers page.
                        </p>
                    </div>
                    <Button
                        id="kms-demo-jo-post"
                        type="button"
                        onClick={() => setPostOpen(true)}
                    >
                        <Plus />
                        Post a job
                    </Button>
                </div>

                <Card id="kms-demo-jo-table">
                    <CardHeader>
                        <CardTitle className="text-base">Openings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-hidden rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Location
                                        </TableHead>
                                        <TableHead className="hidden lg:table-cell">
                                            Type
                                        </TableHead>
                                        <TableHead>Applications</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-32 text-right">
                                            <span className="sr-only">
                                                Actions
                                            </span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {openings.map((opening) => (
                                        <TableRow key={opening.id}>
                                            <TableCell className="font-medium">
                                                {opening.title}
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell">
                                                {opening.location}
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell">
                                                {opening.type}
                                            </TableCell>
                                            <TableCell>
                                                {opening.applications}
                                            </TableCell>
                                            <TableCell id="kms-demo-jo-status">
                                                {opening.active ? (
                                                    <Badge className="gap-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                                                        <CircleDot className="size-3" />
                                                        Open
                                                    </Badge>
                                                ) : (
                                                    <Badge
                                                        variant="secondary"
                                                        className="gap-1"
                                                    >
                                                        <CircleCheck className="size-3" />
                                                        Closed
                                                    </Badge>
                                                )}
                                            </TableCell>
                                            <TableCell id="kms-demo-jo-actions">
                                                <div className="flex items-center justify-end gap-1">
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        aria-label={`Edit ${opening.title}`}
                                                    >
                                                        <Pencil />
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        aria-label={`Toggle ${opening.title}`}
                                                        onClick={() =>
                                                            setOpenings(
                                                                (current) =>
                                                                    current.map(
                                                                        (
                                                                            row,
                                                                        ) =>
                                                                            row.id ===
                                                                            opening.id
                                                                                ? {
                                                                                      ...row,
                                                                                      active: !row.active,
                                                                                  }
                                                                                : row,
                                                                    ),
                                                            )
                                                        }
                                                    >
                                                        {opening.active ? (
                                                            <CircleCheck />
                                                        ) : (
                                                            <CircleDot />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        aria-label={`Delete ${opening.title}`}
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

            <Dialog open={postOpen} onOpenChange={setPostOpen}>
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Post a job</DialogTitle>
                        <DialogDescription>
                            The role is live on the careers page immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="demo-opening-title">
                                    Title
                                </Label>
                                <Input
                                    id="demo-opening-title"
                                    placeholder="Medical Transport Driver"
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="demo-opening-location">
                                    Location
                                </Label>
                                <Input
                                    id="demo-opening-location"
                                    placeholder="Eureka, CA"
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="demo-opening-type">
                                    Employment type
                                </Label>
                                <Select defaultValue="Full-Time">
                                    <SelectTrigger
                                        id="demo-opening-type"
                                        className="w-full"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Full-Time">
                                            Full-Time
                                        </SelectItem>
                                        <SelectItem value="Part-Time">
                                            Part-Time
                                        </SelectItem>
                                        <SelectItem value="On-Call">
                                            On-Call
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="demo-opening-order">
                                    Display order
                                </Label>
                                <Input
                                    id="demo-opening-order"
                                    type="number"
                                    min={0}
                                    defaultValue={0}
                                />
                            </div>
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="demo-opening-summary">
                                Summary
                            </Label>
                            <Textarea
                                id="demo-opening-summary"
                                rows={3}
                                placeholder="Short description shown under the role title."
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="demo-opening-requirements">
                                Requirements (one per line)
                            </Label>
                            <Textarea
                                id="demo-opening-requirements"
                                rows={4}
                                placeholder={
                                    'PASS certification\nValid CA driver license'
                                }
                            />
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
                            onClick={() => setPostOpen(false)}
                        >
                            <Plus />
                            Post job
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </SimulationShell>
    );
}
