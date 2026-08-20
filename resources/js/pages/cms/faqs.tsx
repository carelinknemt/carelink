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
    destroy as destroyFaq,
    restore as restoreFaq,
    store as storeFaq,
    update as updateFaq,
} from '@/routes/cms/faqs';
import type { CmsFaqRecord } from '@/types/dashboard';

type FaqForm = Record<string, string>;

const EMPTY_FORM: FaqForm = {
    question: '',
    answer: '',
    category: '',
    sort_order: '0',
    active: '1',
};

function fromRecord(faq: CmsFaqRecord): FaqForm {
    return {
        question: faq.question,
        answer: faq.answer,
        category: faq.category ?? '',
        sort_order: String(faq.sort_order),
        active: faq.active ? '1' : '0',
    };
}

export default function CmsFaqs({ faqs }: { faqs: CmsFaqRecord[] }) {
    const form = useForm<FaqForm>(EMPTY_FORM);
    const [postOpen, setPostOpen] = useState(false);
    const [restoreOpen, setRestoreOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<CmsFaqRecord | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<CmsFaqRecord | null>(null);

    function openPost() {
        form.setData(EMPTY_FORM);
        form.clearErrors();
        setPostOpen(true);
    }

    function openEdit(faq: CmsFaqRecord) {
        form.setData(fromRecord(faq));
        form.clearErrors();
        setEditTarget(faq);
    }

    function submitPost() {
        form.post(storeFaq.url(), {
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

        form.put(updateFaq.url({ faq: editTarget.id }), {
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

        router.delete(destroyFaq.url({ faq: deleteTarget.id }), {
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
            <Head title="FAQs">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            FAQs
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            The questions and answers behind the public FAQ
                            page.
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
                            Add an FAQ
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Questions</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-hidden rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Question</TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Category
                                        </TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-32" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {faqs.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={4}
                                                className="h-24 text-center"
                                            >
                                                <p className="text-sm text-muted-foreground">
                                                    No FAQs yet.
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        faqs.map((faq) => (
                                            <TableRow key={faq.id}>
                                                <TableCell>
                                                    <span className="font-medium">
                                                        {faq.question}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    {faq.category}
                                                </TableCell>
                                                <TableCell>
                                                    {statusBadge(faq.active)}
                                                </TableCell>
                                                <TableCell className="w-32">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <IconAction
                                                            label="Edit FAQ"
                                                        >
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    openEdit(faq)
                                                                }
                                                            >
                                                                <Pencil className="size-4" />
                                                            </Button>
                                                        </IconAction>
                                                        <IconAction
                                                            label="Delete FAQ"
                                                        >
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    setDeleteTarget(
                                                                        faq,
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
                <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add an FAQ</DialogTitle>
                        <DialogDescription>
                            The question is live on the FAQ page immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            submitPost();
                        }}
                        className="grid gap-4"
                    >
                        <FaqFields form={form} />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={form.processing}>
                                <Plus />
                                Add FAQ
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
                <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Edit FAQ</DialogTitle>
                        <DialogDescription>
                            Changes apply to the public FAQ page immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            submitEdit();
                        }}
                        className="grid gap-4"
                    >
                        <FaqFields form={form} />
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
                        <DialogTitle>Delete this FAQ?</DialogTitle>
                        <DialogDescription>
                            This permanently removes the question from the site.
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
                            Delete FAQ
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <CollectionRestoreDialog
                open={restoreOpen}
                onOpenChange={setRestoreOpen}
                label="FAQs"
                url={restoreFaq.url()}
            />
        </>
    );
}

function FaqFields({ form }: { form: ReturnType<typeof useForm<FaqForm>> }) {
    const activeForm = form.data.active === '1';

    return (
        <>
            <div className="grid gap-1.5">
                <Label htmlFor="faq-question">Question</Label>
                <Input
                    id="faq-question"
                    value={form.data.question}
                    onChange={(event) =>
                        form.setData('question', event.target.value)
                    }
                    required
                />
                {form.errors.question && (
                    <p className="text-xs text-destructive">
                        {form.errors.question}
                    </p>
                )}
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="faq-answer">Answer</Label>
                <Textarea
                    id="faq-answer"
                    rows={4}
                    value={form.data.answer}
                    onChange={(event) =>
                        form.setData('answer', event.target.value)
                    }
                    required
                />
                {form.errors.answer && (
                    <p className="text-xs text-destructive">
                        {form.errors.answer}
                    </p>
                )}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                    <Label htmlFor="faq-category">Category</Label>
                    <Input
                        id="faq-category"
                        value={form.data.category}
                        onChange={(event) =>
                            form.setData('category', event.target.value)
                        }
                        placeholder="BOOKING & SERVICE"
                    />
                    {form.errors.category && (
                        <p className="text-xs text-destructive">
                            {form.errors.category}
                        </p>
                    )}
                </div>
                <div className="grid gap-1.5">
                    <Label htmlFor="faq-sort">Display order</Label>
                    <Input
                        id="faq-sort"
                        type="number"
                        min={0}
                        value={form.data.sort_order}
                        onChange={(event) =>
                            form.setData('sort_order', event.target.value)
                        }
                    />
                    {form.errors.sort_order && (
                        <p className="text-xs text-destructive">
                            {form.errors.sort_order}
                        </p>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Checkbox
                    id="faq-active"
                    checked={activeForm}
                    onCheckedChange={(checked) =>
                        form.setData('active', checked ? '1' : '0')
                    }
                />
                <Label htmlFor="faq-active">
                    Visible on the public site ({activeForm ? 'live' : 'hidden'}
                    )
                </Label>
            </div>
        </>
    );
}
CmsFaqs.layout = {
    breadcrumbs: [
        {
            title: 'Content Sections',
            href: cmsRoutes.index(),
        },
        {
            title: 'FAQs',
            href: cmsRoutes.faqs.index(),
        },
    ],
};
