import { Head, Link, router, useForm } from '@inertiajs/react';
import { Download, FileText, Search, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
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
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
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
import { applications as dashboardApplications } from '@/routes/dashboard';
import { destroy as destroyApplication, resume as applicationResume } from '@/routes/dashboard/applications';
import type { ApplicationRecord, ApplicationsFilters, PaginatedApplications } from '@/types/dashboard';

type DashboardApplicationsProps = {
    applications: PaginatedApplications;
    roles: { id: number; title: string }[];
    filters: ApplicationsFilters;
};

export default function DashboardApplications({
    applications,
    roles,
    filters,
}: DashboardApplicationsProps) {
    const form = useForm({
        search: filters.search ?? '',
        role: filters.role ? String(filters.role) : '',
    });

    const searchTimer = useRef<number | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<ApplicationRecord | null>(
        null,
    );

    function navigate() {
        form.get(dashboardApplications.url(), {
            preserveState: true,
            preserveScroll: true,
        });
    }

    useEffect(() => {
        return () => {
            if (searchTimer.current !== null) {
                window.clearTimeout(searchTimer.current);
            }
        };
    }, []);

    function changeSearch(value: string) {
        form.setData('search', value);

        if (searchTimer.current !== null) {
            window.clearTimeout(searchTimer.current);
        }

        searchTimer.current = window.setTimeout(navigate, 350);
    }

    function submitSearch(event: FormEvent) {
        event.preventDefault();

        if (searchTimer.current !== null) {
            window.clearTimeout(searchTimer.current);
            searchTimer.current = null;
        }

        navigate();
    }

    function clearSearch() {
        if (searchTimer.current !== null) {
            window.clearTimeout(searchTimer.current);
            searchTimer.current = null;
        }

        form.setData('search', '');
        navigate();
    }

    function changeRole(value: string) {
        form.setData('role', value);

        if (searchTimer.current !== null) {
            window.clearTimeout(searchTimer.current);
            searchTimer.current = null;
        }

        navigate();
    }

    function confirmDelete() {
        if (!deleteTarget) {
            return;
        }

        router.delete(
            destroyApplication.url({ application: deleteTarget.id }),
            {
                preserveScroll: true,
                onSuccess: () => setDeleteTarget(null),
            },
        );
    }

    const searchActive = Boolean(filters.search);

    return (
        <>
            <Head title="Applications">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Applications
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Review employment applications submitted for each
                            posted role.
                        </p>
                    </div>
                </div>

                <Card>
                    <CardContent className="flex flex-col gap-4 pt-6">
                        <form
                            onSubmit={submitSearch}
                            className="flex flex-col gap-4"
                        >
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="application-role">
                                        Role
                                    </Label>
                                    <Select
                                        value={form.data.role}
                                        onValueChange={changeRole}
                                    >
                                        <SelectTrigger id="application-role">
                                            <SelectValue placeholder="All roles" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="">
                                                All roles
                                            </SelectItem>
                                            {roles.map((r) => (
                                                <SelectItem
                                                    key={r.id}
                                                    value={String(r.id)}
                                                >
                                                    {r.title}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="grid gap-1.5">
                                    <Label htmlFor="application-search">
                                        Name or email
                                    </Label>
                                    <div className="relative">
                                        <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                                        <Input
                                            id="application-search"
                                            type="search"
                                            placeholder="Search applicants..."
                                            className="pl-9"
                                            value={form.data.search}
                                            onChange={(event) =>
                                                changeSearch(
                                                    event.target.value,
                                                )
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            {searchActive && (
                                <div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={clearSearch}
                                    >
                                        Clear search
                                    </Button>
                                </div>
                            )}
                        </form>

                        <div className="overflow-hidden rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Applicant</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Contact
                                        </TableHead>
                                        <TableHead className="hidden lg:table-cell">
                                            Submitted
                                        </TableHead>
                                        <TableHead>Resume</TableHead>
                                        <TableHead className="w-10" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {applications.data.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={6}
                                                className="h-24 text-center"
                                            >
                                                <p className="text-muted-foreground text-sm">
                                                    No applications match your
                                                    filters.
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        applications.data.map((application) => (
                                            <TableRow key={application.id}>
                                                <TableCell>
                                                    <div className="flex flex-col gap-0.5">
                                                        <span className="font-medium">
                                                            {application.name}
                                                        </span>
                                                        <span className="text-muted-foreground flex items-center gap-1.5 text-xs">
                                                            <FileText className="size-3.5" />
                                                            <span className="max-w-56 truncate">
                                                                {
                                                                    application.cover_letter
                                                                }
                                                            </span>
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    {application.position ??
                                                        'Position'}
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    <div className="flex flex-col gap-0.5 text-sm">
                                                        <span>
                                                            {application.email}
                                                        </span>
                                                        <span className="text-muted-foreground text-xs">
                                                            {application.phone}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="hidden whitespace-nowrap lg:table-cell">
                                                    {formatDate(
                                                        application.submitted_at,
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {application.resume_name ? (
                                                        <Link
                                                            href={applicationResume.url(
                                                                {
                                                                    application:
                                                                        application.id,
                                                                },
                                                            )}
                                                            className="inline-flex items-center gap-1.5 text-sm font-medium text-[#004B87] hover:underline"
                                                        >
                                                            <Download className="size-4" />
                                                            {application.resume_name}
                                                        </Link>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">
                                                            None
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() =>
                                                            setDeleteTarget(
                                                                application,
                                                            )
                                                        }
                                                    >
                                                        <Trash2 className="size-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {applications.last_page > 1 && (
                            <Pagination>
                                <PaginationContent>
                                    <PaginationItem>
                                        {applications.prev_page_url ? (
                                            <PaginationPrevious asChild>
                                                <Link
                                                    href={
                                                        applications.prev_page_url
                                                    }
                                                    prefetch
                                                >
                                                    <span className="hidden sm:block">
                                                        Previous
                                                    </span>
                                                </Link>
                                            </PaginationPrevious>
                                        ) : (
                                            <PaginationPrevious
                                                className="pointer-events-none opacity-50"
                                                aria-disabled="true"
                                            />
                                        )}
                                    </PaginationItem>
                                    {applications.links.map((link) => {
                                        if (link.url === null) {
                                            return null;
                                        }

                                        const label =
                                            link.label === '&laquo; Previous'
                                                ? '…'
                                                : link.label === '&raquo; Next'
                                                  ? '…'
                                                  : link.label;

                                        return (
                                            <PaginationItem
                                                key={`${link.label}-${link.url}`}
                                            >
                                                <PaginationLink
                                                    href={link.url}
                                                    isActive={link.active}
                                                >
                                                    {label}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    })}
                                    <PaginationItem>
                                        {applications.next_page_url ? (
                                            <PaginationNext asChild>
                                                <Link
                                                    href={
                                                        applications.next_page_url
                                                    }
                                                    prefetch
                                                >
                                                    <span className="hidden sm:block">
                                                        Next
                                                    </span>
                                                </Link>
                                            </PaginationNext>
                                        ) : (
                                            <PaginationNext
                                                className="pointer-events-none opacity-50"
                                                aria-disabled="true"
                                            />
                                        )}
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </CardContent>
                </Card>
            </div>

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
                        <DialogTitle>
                            Delete {deleteTarget?.name}'s application?
                        </DialogTitle>
                        <DialogDescription>
                            This permanently removes the application
                            {deleteTarget?.position
                                ? ` for ${deleteTarget.position}`
                                : ''}
                            , including its resume.
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
                            Delete application
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}