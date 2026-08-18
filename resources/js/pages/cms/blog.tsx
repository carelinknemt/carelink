import { Head, router, useForm } from '@inertiajs/react';
import { CircleCheck, CircleDot, Pencil, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';
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
import {
    destroy as destroyPost,
    store as storePost,
    update as updatePost,
} from '@/routes/cms/blog';
import type { CmsBlogPostRecord } from '@/types/dashboard';

type BlogForm = Record<string, string>;

const EMPTY_FORM: BlogForm = {
    title: '',
    slug: '',
    category: '',
    read_time: '',
    summary: '',
    excerpt: '',
    content: '',
    author: '',
    image: '',
    published_at: '',
    active: '1',
};

function fromRecord(post: CmsBlogPostRecord): BlogForm {
    return {
        title: post.title,
        slug: post.slug,
        category: post.category ?? '',
        read_time: post.read_time ?? '',
        summary: post.summary ?? '',
        excerpt: post.excerpt ?? '',
        content: post.content ?? '',
        author: post.author ?? '',
        image: post.image ?? '',
        published_at: post.published_at?.slice(0, 10) ?? '',
        active: post.active ? '1' : '0',
    };
}

export default function CmsBlog({ posts }: { posts: CmsBlogPostRecord[] }) {
    const form = useForm<BlogForm>(EMPTY_FORM);
    const [postOpen, setPostOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<CmsBlogPostRecord | null>(
        null,
    );
    const [deleteTarget, setDeleteTarget] = useState<CmsBlogPostRecord | null>(
        null,
    );

    function openPost() {
        form.setData(EMPTY_FORM);
        form.clearErrors();
        setPostOpen(true);
    }

    function openEdit(post: CmsBlogPostRecord) {
        form.setData(fromRecord(post));
        form.clearErrors();
        setEditTarget(post);
    }

    function submitPost() {
        form.post(storePost.url(), {
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

        form.put(updatePost.url({ post: editTarget.id }), {
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

        router.delete(destroyPost.url({ post: deleteTarget.id }), {
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
            <Head title="Blog">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Blog
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            The posts behind the public blog pages.
                        </p>
                    </div>
                    <Button type="button" onClick={openPost}>
                        <Plus />
                        Write a post
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Posts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-hidden rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Category
                                        </TableHead>
                                        <TableHead className="hidden lg:table-cell">
                                            Published
                                        </TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-32" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {posts.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="h-24 text-center"
                                            >
                                                <p className="text-sm text-muted-foreground">
                                                    No blog posts yet.
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        posts.map((post) => (
                                            <TableRow key={post.id}>
                                                <TableCell>
                                                    <span className="font-medium">
                                                        {post.title}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    {post.category}
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    {post.published_at?.slice(
                                                        0,
                                                        10,
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {statusBadge(post.active)}
                                                </TableCell>
                                                <TableCell className="w-32">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                openEdit(post)
                                                            }
                                                        >
                                                            <Pencil className="size-4" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                setDeleteTarget(
                                                                    post,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 className="size-4" />
                                                        </Button>
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
                        <DialogTitle>Write a post</DialogTitle>
                        <DialogDescription>
                            The post is live on the blog page immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            submitPost();
                        }}
                        className="grid gap-4"
                    >
                        <BlogFields form={form} />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={form.processing}>
                                <Plus />
                                Publish post
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
                        <DialogTitle>Edit {editTarget?.title}</DialogTitle>
                        <DialogDescription>
                            Changes apply to the public blog immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            submitEdit();
                        }}
                        className="grid gap-4"
                    >
                        <BlogFields form={form} />
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
                            This permanently removes the post from the site.
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
                            Delete post
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

function BlogFields({ form }: { form: ReturnType<typeof useForm<BlogForm>> }) {
    const activeForm = form.data.active === '1';
    const field = (
        key: keyof BlogForm,
        label: string,
        placeholder?: string,
    ) => (
        <div className="grid gap-1.5">
            <Label htmlFor={`blog-${key}`}>{label}</Label>
            <Input
                id={`blog-${key}`}
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
                {field(
                    'title',
                    'Title',
                    'Understanding NEMT in Northern California',
                )}
                {field(
                    'slug',
                    'Slug',
                    'understanding-nemt-northern-california',
                )}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
                {field('category', 'Category', 'PATIENT ADVISORY')}
                {field('read_time', 'Read time', '4 min read')}
                {field('author', 'Author', 'Abel Feyisa')}
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="blog-published_at">Publish date</Label>
                <Input
                    id="blog-published_at"
                    type="date"
                    value={form.data.published_at}
                    onChange={(event) =>
                        form.setData('published_at', event.target.value)
                    }
                />
                {form.errors.published_at && (
                    <p className="text-xs text-destructive">
                        {form.errors.published_at}
                    </p>
                )}
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="blog-summary">Summary</Label>
                <Textarea
                    id="blog-summary"
                    rows={2}
                    value={form.data.summary}
                    onChange={(event) =>
                        form.setData('summary', event.target.value)
                    }
                />
                {form.errors.summary && (
                    <p className="text-xs text-destructive">
                        {form.errors.summary}
                    </p>
                )}
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="blog-excerpt">Excerpt</Label>
                <Textarea
                    id="blog-excerpt"
                    rows={2}
                    value={form.data.excerpt}
                    onChange={(event) =>
                        form.setData('excerpt', event.target.value)
                    }
                />
                {form.errors.excerpt && (
                    <p className="text-xs text-destructive">
                        {form.errors.excerpt}
                    </p>
                )}
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="blog-content">Content</Label>
                <Textarea
                    id="blog-content"
                    rows={8}
                    value={form.data.content}
                    onChange={(event) =>
                        form.setData('content', event.target.value)
                    }
                />
                {form.errors.content && (
                    <p className="text-xs text-destructive">
                        {form.errors.content}
                    </p>
                )}
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="blog-image">
                    Image URL (paste a hosted image path)
                </Label>
                <Input
                    id="blog-image"
                    value={form.data.image}
                    onChange={(event) =>
                        form.setData('image', event.target.value)
                    }
                    placeholder="/images/carelink_hero_van_1785061463464.jpg"
                />
                {form.errors.image && (
                    <p className="text-xs text-destructive">
                        {form.errors.image}
                    </p>
                )}
            </div>
            <div className="flex items-center gap-2">
                <Checkbox
                    id="blog-active"
                    checked={activeForm}
                    onCheckedChange={(checked) =>
                        form.setData('active', checked ? '1' : '0')
                    }
                />
                <Label htmlFor="blog-active">
                    Visible on the public site ({activeForm ? 'live' : 'hidden'}
                    )
                </Label>
            </div>
        </>
    );
}
