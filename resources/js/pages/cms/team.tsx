import { Head, router, useForm } from '@inertiajs/react';
import {
    CircleCheck,
    CircleDot,
    Pencil,
    Plus,
    RotateCcw,
    Trash2,
} from 'lucide-react';
import { useState } from 'react';
import CollectionRestoreDialog from '@/components/cms/collection-restore-dialog';
import CmsImageUploader from '@/components/cms/image-uploader';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
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
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import cmsRoutes from '@/routes/cms';
import {
    destroy as destroyMember,
    restore as restoreMember,
    store as storeMember,
    update as updateMember,
} from '@/routes/cms/team';
import type { CmsTeamMemberRecord } from '@/types/dashboard';

type TeamForm = Record<string, string>;

const EMPTY_FORM: TeamForm = {
    name: '',
    role: '',
    title: '',
    bio: '',
    image: '',
    certifications: '',
    experience_years: '',
    sort_order: '0',
    active: '1',
};

function toText(list: string[]): string {
    return list.join('\n');
}

function fromRecord(member: CmsTeamMemberRecord): TeamForm {
    return {
        name: member.name,
        role: member.role ?? '',
        title: member.title ?? '',
        bio: member.bio ?? '',
        image: member.image ?? '',
        certifications: toText(member.certifications),
        experience_years:
            member.experience_years !== null
                ? String(member.experience_years)
                : '',
        sort_order: String(member.sort_order),
        active: member.active ? '1' : '0',
    };
}

export default function CmsTeam({
    members,
}: {
    members: CmsTeamMemberRecord[];
}) {
    const form = useForm<TeamForm>(EMPTY_FORM);
    const [postOpen, setPostOpen] = useState(false);
    const [restoreOpen, setRestoreOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<CmsTeamMemberRecord | null>(
        null,
    );
    const [deleteTarget, setDeleteTarget] =
        useState<CmsTeamMemberRecord | null>(null);

    function openPost() {
        form.setData(EMPTY_FORM);
        form.clearErrors();
        setPostOpen(true);
    }

    function openEdit(member: CmsTeamMemberRecord) {
        form.setData(fromRecord(member));
        form.clearErrors();
        setEditTarget(member);
    }

    function submitPost() {
        form.post(storeMember.url(), {
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

        form.put(updateMember.url({ member: editTarget.id }), {
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

        router.delete(destroyMember.url({ member: deleteTarget.id }), {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    }

    const statusBadge = (active: boolean) =>
        active ? (
            <Badge className="gap-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                <CircleDot className="size-3" />
                Live
            </Badge>
        ) : (
            <Badge variant="secondary" className="gap-1">
                <CircleCheck className="size-3" />
                Hidden
            </Badge>
        );

    return (
        <>
            <Head title="Team">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Team
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            The leadership shown on the home and about pages.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            title="Reset this collection to its defaults"
                            onClick={() => setRestoreOpen(true)}
                        >
                            <RotateCcw className="size-3.5" />
                            Restore defaults
                        </Button>
                        <Button type="button" onClick={openPost}>
                            <Plus />
                            Add a member
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-hidden rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Role
                                        </TableHead>
                                        <TableHead className="hidden lg:table-cell">
                                            Years
                                        </TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-32" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {members.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="h-24 text-center"
                                            >
                                                <p className="text-sm text-muted-foreground">
                                                    No team members yet.
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        members.map((member) => (
                                            <TableRow key={member.id}>
                                                <TableCell>
                                                    <span className="font-medium">
                                                        {member.name}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    {member.role}
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    {member.experience_years !==
                                                    null
                                                        ? `${member.experience_years} yrs`
                                                        : 'N/A'}
                                                </TableCell>
                                                <TableCell>
                                                    {statusBadge(member.active)}
                                                </TableCell>
                                                <TableCell className="w-32">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <IconAction label="Edit member">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    openEdit(
                                                                        member,
                                                                    )
                                                                }
                                                            >
                                                                <Pencil className="size-4" />
                                                            </Button>
                                                        </IconAction>
                                                        <IconAction label="Delete member">
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    setDeleteTarget(
                                                                        member,
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
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add a team member</DialogTitle>
                        <DialogDescription>
                            The member is live on the home and about pages
                            immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            submitPost();
                        }}
                        className="grid gap-4"
                    >
                        <TeamFields form={form} />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={form.processing}>
                                <Plus />
                                Add member
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
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit {editTarget?.name}</DialogTitle>
                        <DialogDescription>
                            Changes apply to the public site immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            submitEdit();
                        }}
                        className="grid gap-4"
                    >
                        <TeamFields form={form} />
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
                        <DialogTitle>Delete {deleteTarget?.name}?</DialogTitle>
                        <DialogDescription>
                            This permanently removes the team member from the
                            site.
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
                            Delete member
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <CollectionRestoreDialog
                open={restoreOpen}
                onOpenChange={setRestoreOpen}
                label="Team members"
                url={restoreMember.url()}
            />
        </>
    );
}

function TeamFields({ form }: { form: ReturnType<typeof useForm<TeamForm>> }) {
    const activeForm = form.data.active === '1';
    const field = (
        key: keyof TeamForm,
        label: string,
        placeholder?: string,
    ) => (
        <div className="grid gap-1.5">
            <Label htmlFor={`team-${key}`}>{label}</Label>
            <Input
                id={`team-${key}`}
                value={form.data[key]}
                onChange={(event) => form.setData(key, event.target.value)}
                placeholder={placeholder}
            />
            {form.errors[key] && (
                <p className="text-xs text-destructive">{form.errors[key]}</p>
            )}
        </div>
    );

    return (
        <>
            <div className="grid gap-4 sm:grid-cols-2">
                {field('name', 'Name', 'Abel Feyisa')}
                {field('role', 'Role', 'Managing Director & Founder')}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                {field('title', 'Title', 'Carelink Executive Representative')}
                {field('experience_years', 'Experience (years)', '12')}
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="team-bio">Bio</Label>
                <Textarea
                    id="team-bio"
                    rows={4}
                    value={form.data.bio}
                    onChange={(event) =>
                        form.setData('bio', event.target.value)
                    }
                />
                {form.errors.bio && (
                    <p className="text-xs text-destructive">
                        {form.errors.bio}
                    </p>
                )}
            </div>
            <div className="grid gap-1.5">
                <CmsImageUploader
                    value={form.data.image}
                    onChange={(url) => form.setData('image', url)}
                    label="Team member photo"
                />
                {form.errors.image && (
                    <p className="text-xs text-destructive">
                        {form.errors.image}
                    </p>
                )}
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="team-certifications">
                    Certifications (one per line)
                </Label>
                <Textarea
                    id="team-certifications"
                    rows={3}
                    value={form.data.certifications}
                    onChange={(event) =>
                        form.setData('certifications', event.target.value)
                    }
                />
                {form.errors.certifications && (
                    <p className="text-xs text-destructive">
                        {form.errors.certifications}
                    </p>
                )}
            </div>
            {field('sort_order', 'Display order', '1')}
            <div className="flex items-center gap-2">
                <Checkbox
                    id="team-active"
                    checked={activeForm}
                    onCheckedChange={(checked) =>
                        form.setData('active', checked ? '1' : '0')
                    }
                />
                <Label htmlFor="team-active">
                    Visible on the public site ({activeForm ? 'live' : 'hidden'}
                    )
                </Label>
            </div>
        </>
    );
}
CmsTeam.layout = {
    breadcrumbs: [
        {
            title: 'Content Sections',
            href: cmsRoutes.index(),
        },
        {
            title: 'Team',
            href: cmsRoutes.team.index(),
        },
    ],
};
