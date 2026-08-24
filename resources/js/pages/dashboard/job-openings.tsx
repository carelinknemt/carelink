import { Head, router, useForm } from '@inertiajs/react';
import { CircleDot, CircleCheck, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
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
import { IconAction } from '@/components/ui/icon-action';
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
import { dashboard } from '@/routes';
import { jobOpenings as dashboardJobOpenings } from '@/routes/dashboard';
import {
    destroy as destroyOpening,
    store as storeOpening,
    toggle as toggleOpening,
    update as updateOpening,
} from '@/routes/dashboard/job-openings';
import type { JobOpeningRecord } from '@/types/dashboard';

type DashboardJobOpeningsProps = {
    openings: JobOpeningRecord[];
};

type OpeningForm = {
    title: string;
    location: string;
    employment_type: string;
    summary: string;
    requirements: string;
    benefits: string;
    sort_order: string;
};

const EMPTY_FORM: OpeningForm = {
    title: '',
    location: '',
    employment_type: '',
    summary: '',
    requirements: '',
    benefits: '',
    sort_order: '0',
};

function toRequirementsText(requirements: string[]): string {
    return requirements.join('\n');
}

function toBenefitsText(benefits: string[] | null | undefined): string {
    return (benefits ?? []).join('\n');
}

export default function DashboardJobOpenings({
    openings,
}: DashboardJobOpeningsProps) {
    const form = useForm<OpeningForm>(EMPTY_FORM);
    const [postOpen, setPostOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<JobOpeningRecord | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<JobOpeningRecord | null>(
        null,
    );

    function openPost() {
        form.reset();
        form.clearErrors();
        setPostOpen(true);
    }

    function openEdit(opening: JobOpeningRecord) {
        form.setData({
            title: opening.title,
            location: opening.location,
            employment_type: opening.employment_type,
            summary: opening.summary ?? '',
            requirements: toRequirementsText(opening.requirements),
            benefits: toBenefitsText(opening.benefits),
            sort_order: String(opening.sort_order),
        });
        form.clearErrors();
        setEditTarget(opening);
    }

    function submitPost() {
        form.post(storeOpening.url(), {
            preserveScroll: true,
            onSuccess: () => {
                setPostOpen(false);
                form.reset();
            },
        });
    }

    function submitEdit() {
        if (!editTarget) {
            return;
        }

        form.put(updateOpening.url({ career: editTarget.id }), {
            preserveScroll: true,
            onSuccess: () => {
                setEditTarget(null);
                form.reset();
            },
        });
    }

    function confirmDelete() {
        if (!deleteTarget) {
            return;
        }

        router.delete(destroyOpening.url({ career: deleteTarget.id }), {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    }

    function toggleDirect(opening: JobOpeningRecord) {
        router.post(
            toggleOpening.url({ career: opening.id }),
            {},
            { preserveScroll: true },
        );
    }

    return (
        <>
            <Head title="Job Openings">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Job Openings
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Post, update, close, or delete the roles shown on
                            the public careers page.
                        </p>
                    </div>
                    <Button type="button" onClick={openPost}>
                        <Plus />
                        Post a job
                    </Button>
                </div>

                <Card>
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
                                        <TableHead className="w-32" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {openings.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="h-24 text-center"
                                            >
                                                <p className="text-sm text-muted-foreground">
                                                    No job openings yet. Post
                                                    your first one.
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        openings.map((opening) => (
                                            <TableRow key={opening.id}>
                                                <TableCell>
                                                    <span className="font-medium">
                                                        {opening.title}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    {opening.location}
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    {opening.employment_type}
                                                </TableCell>
                                                <TableCell>
                                                    {opening.applications_count}
                                                </TableCell>
                                                <TableCell>
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
                                                <TableCell className="w-32">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <IconAction label="Edit opening">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    openEdit(
                                                                        opening,
                                                                    )
                                                                }
                                                            >
                                                                <Pencil className="size-4" />
                                                            </Button>
                                                        </IconAction>
                                                        <IconAction
                                                            label={
                                                                opening.active
                                                                    ? 'Close opening'
                                                                    : 'Reopen opening'
                                                            }
                                                        >
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    toggleDirect(
                                                                        opening,
                                                                    )
                                                                }
                                                            >
                                                                {opening.active ? (
                                                                    <CircleCheck className="size-4" />
                                                                ) : (
                                                                    <CircleDot className="size-4" />
                                                                )}
                                                            </Button>
                                                        </IconAction>
                                                        <IconAction label="Delete opening">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    setDeleteTarget(
                                                                        opening,
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="size-4" />
                                                            </Button>
                                                        </IconAction>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Dialog
                open={postOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setPostOpen(false);
                    }
                }}
            >
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Post a job</DialogTitle>
                        <DialogDescription>
                            The role is live on the careers page immediately.
                        </DialogDescription>
                    </DialogHeader>
                    {form.wasSuccessful && (
                        <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
                            Opening posted successfully.
                        </p>
                    )}
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            submitPost();
                        }}
                        className="grid gap-4"
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="opening-title">Title</Label>
                                <Input
                                    id="opening-title"
                                    value={form.data.title}
                                    onChange={(event) =>
                                        form.setData(
                                            'title',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Medical Transport Driver"
                                    required
                                />
                                {form.errors.title && (
                                    <p className="text-xs text-destructive">
                                        {form.errors.title}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="opening-location">
                                    Location
                                </Label>
                                <Input
                                    id="opening-location"
                                    value={form.data.location}
                                    onChange={(event) =>
                                        form.setData(
                                            'location',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Eureka, CA"
                                    required
                                />
                                {form.errors.location && (
                                    <p className="text-xs text-destructive">
                                        {form.errors.location}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="opening-type">
                                    Employment type
                                </Label>
                                <Select
                                    value={form.data.employment_type}
                                    onValueChange={(value) =>
                                        form.setData('employment_type', value)
                                    }
                                >
                                    <SelectTrigger
                                        id="opening-type"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Select type" />
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
                                {form.errors.employment_type && (
                                    <p className="text-xs text-destructive">
                                        {form.errors.employment_type}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="opening-sort">
                                    Display order
                                </Label>
                                <Input
                                    id="opening-sort"
                                    type="number"
                                    min={0}
                                    value={form.data.sort_order}
                                    onChange={(event) =>
                                        form.setData(
                                            'sort_order',
                                            event.target.value,
                                        )
                                    }
                                />
                                {form.errors.sort_order && (
                                    <p className="text-xs text-destructive">
                                        {form.errors.sort_order}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="opening-summary">Summary</Label>
                            <textarea
                                id="opening-summary"
                                rows={3}
                                value={form.data.summary}
                                onChange={(event) =>
                                    form.setData('summary', event.target.value)
                                }
                                placeholder="Short description shown under the role title."
                                className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            {form.errors.summary && (
                                <p className="text-xs text-destructive">
                                    {form.errors.summary}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="opening-requirements">
                                Requirements (one per line)
                            </Label>
                            <textarea
                                id="opening-requirements"
                                rows={4}
                                value={form.data.requirements}
                                onChange={(event) =>
                                    form.setData(
                                        'requirements',
                                        event.target.value,
                                    )
                                }
                                placeholder={
                                    'PASS certification\nValid CA driver license'
                                }
                                className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            />
                            {form.errors.requirements && (
                                <p className="text-xs text-destructive">
                                    {form.errors.requirements}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="opening-benefits">
                                Benefits (one per line, optional)
                            </Label>
                            <textarea
                                id="opening-benefits"
                                rows={4}
                                value={form.data.benefits}
                                onChange={(event) =>
                                    form.setData('benefits', event.target.value)
                                }
                                placeholder={
                                    'Health insurance stipend\nPaid drive time\nFlexible scheduling'
                                }
                                className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            {form.errors.benefits && (
                                <p className="text-xs text-destructive">
                                    {form.errors.benefits}
                                </p>
                            )}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={form.processing}>
                                <Plus />
                                Post job
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={editTarget !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setEditTarget(null);
                        form.reset();
                    }
                }}
            >
                <DialogContent className="sm:max-w-xl">
                    <DialogHeader>
                        <DialogTitle>Edit {editTarget?.title}</DialogTitle>
                        <DialogDescription>
                            Changes apply to the public careers page
                            immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            submitEdit();
                        }}
                        className="grid gap-4"
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="edit-opening-title">
                                    Title
                                </Label>
                                <Input
                                    id="edit-opening-title"
                                    value={form.data.title}
                                    onChange={(event) =>
                                        form.setData(
                                            'title',
                                            event.target.value,
                                        )
                                    }
                                    required
                                />
                                {form.errors.title && (
                                    <p className="text-xs text-destructive">
                                        {form.errors.title}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="edit-opening-location">
                                    Location
                                </Label>
                                <Input
                                    id="edit-opening-location"
                                    value={form.data.location}
                                    onChange={(event) =>
                                        form.setData(
                                            'location',
                                            event.target.value,
                                        )
                                    }
                                    required
                                />
                                {form.errors.location && (
                                    <p className="text-xs text-destructive">
                                        {form.errors.location}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="edit-opening-type">
                                    Employment type
                                </Label>
                                <Select
                                    value={form.data.employment_type}
                                    onValueChange={(value) =>
                                        form.setData('employment_type', value)
                                    }
                                >
                                    <SelectTrigger
                                        id="edit-opening-type"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Select type" />
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
                                {form.errors.employment_type && (
                                    <p className="text-xs text-destructive">
                                        {form.errors.employment_type}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="edit-opening-sort">
                                    Display order
                                </Label>
                                <Input
                                    id="edit-opening-sort"
                                    type="number"
                                    min={0}
                                    value={form.data.sort_order}
                                    onChange={(event) =>
                                        form.setData(
                                            'sort_order',
                                            event.target.value,
                                        )
                                    }
                                />
                                {form.errors.sort_order && (
                                    <p className="text-xs text-destructive">
                                        {form.errors.sort_order}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="edit-opening-summary">
                                Summary
                            </Label>
                            <textarea
                                id="edit-opening-summary"
                                rows={3}
                                value={form.data.summary}
                                onChange={(event) =>
                                    form.setData('summary', event.target.value)
                                }
                                className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            {form.errors.summary && (
                                <p className="text-xs text-destructive">
                                    {form.errors.summary}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="edit-opening-requirements">
                                Requirements (one per line)
                            </Label>
                            <textarea
                                id="edit-opening-requirements"
                                rows={4}
                                value={form.data.requirements}
                                onChange={(event) =>
                                    form.setData(
                                        'requirements',
                                        event.target.value,
                                    )
                                }
                                className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                                required
                            />
                            {form.errors.requirements && (
                                <p className="text-xs text-destructive">
                                    {form.errors.requirements}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="edit-opening-benefits">
                                Benefits (one per line, optional)
                            </Label>
                            <textarea
                                id="edit-opening-benefits"
                                rows={4}
                                value={form.data.benefits}
                                onChange={(event) =>
                                    form.setData('benefits', event.target.value)
                                }
                                placeholder={
                                    'Health insurance stipend\nPaid drive time\nFlexible scheduling'
                                }
                                className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                            {form.errors.benefits && (
                                <p className="text-xs text-destructive">
                                    {form.errors.benefits}
                                </p>
                            )}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={form.processing}>
                                Save changes
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog
                open={deleteTarget !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteTarget(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete {deleteTarget?.title}?</DialogTitle>
                        <DialogDescription>
                            This permanently removes the job opening and all
                            applications submitted for it.
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
                            variant="destructive"
                            onClick={confirmDelete}
                        >
                            <Trash2 />
                            Delete opening
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

DashboardJobOpenings.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Job Openings',
            href: dashboardJobOpenings(),
        },
    ],
};
