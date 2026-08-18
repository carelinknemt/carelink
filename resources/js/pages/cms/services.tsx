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
import {
    destroy as destroyService,
    restore as restoreService,
    store as storeService,
    update as updateService,
} from '@/routes/cms/services';
import type { CmsServiceRecord } from '@/types/dashboard';

type ServiceForm = Record<string, string>;

const EMPTY_FORM: ServiceForm = {
    slug: '',
    category: 'MEDICAL',
    title: '',
    short_description: '',
    full_description: '',
    benefits: '',
    image: '',
    icon_name: '',
    suitable_for: '',
    typical_destinations: '',
    base_rate: '',
    mileage_rate: '',
    sort_order: '0',
    active: '1',
};

function toText(list: string[]): string {
    return list.join('\n');
}

function fromRecord(service: CmsServiceRecord): ServiceForm {
    return {
        slug: service.slug,
        category: service.category,
        title: service.title,
        short_description: service.short_description,
        full_description: service.full_description ?? '',
        benefits: toText(service.benefits),
        image: service.image ?? '',
        icon_name: service.icon_name ?? '',
        suitable_for: toText(service.suitable_for),
        typical_destinations: toText(service.typical_destinations),
        base_rate: service.base_rate ?? '',
        mileage_rate: service.mileage_rate ?? '',
        sort_order: String(service.sort_order),
        active: service.active ? '1' : '0',
    };
}

export default function CmsServices({
    services,
}: {
    services: CmsServiceRecord[];
}) {
    const form = useForm<ServiceForm>(EMPTY_FORM);
    const [postOpen, setPostOpen] = useState(false);
    const [restoreOpen, setRestoreOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<CmsServiceRecord | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<CmsServiceRecord | null>(
        null,
    );

    function openPost() {
        form.setData(EMPTY_FORM);
        form.clearErrors();
        setPostOpen(true);
    }

    function openEdit(service: CmsServiceRecord) {
        form.setData(fromRecord(service));
        form.clearErrors();
        setEditTarget(service);
    }

    function submitPost() {
        form.post(storeService.url(), {
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

        form.put(updateService.url({ service: editTarget.id }), {
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

        router.delete(destroyService.url({ service: deleteTarget.id }), {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    }

    return (
        <>
            <Head title="Services">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Services
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            The service catalog behind the services page and the
                            book form rates.
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
                            Add a service
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Services</CardTitle>
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
                                            Rates
                                        </TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-32" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {services.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="h-24 text-center"
                                            >
                                                <p className="text-sm text-muted-foreground">
                                                    No services yet.
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        services.map((service) => (
                                            <TableRow key={service.id}>
                                                <TableCell>
                                                    <span className="font-medium">
                                                        {service.title}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    {service.category}
                                                </TableCell>
                                                <TableCell className="hidden text-sm lg:table-cell">
                                                    $
                                                    {service.base_rate ??
                                                        '0.00'}{' '}
                                                    + $
                                                    {service.mileage_rate ??
                                                        '0.00'}
                                                    /mi
                                                </TableCell>
                                                <TableCell>
                                                    {service.active ? (
                                                        <Badge className="gap-1 bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                                                            <CircleDot className="size-3" />
                                                            Live
                                                        </Badge>
                                                    ) : (
                                                        <Badge
                                                            variant="secondary"
                                                            className="gap-1"
                                                        >
                                                            <CircleCheck className="size-3" />
                                                            Hidden
                                                        </Badge>
                                                    )}
                                                </TableCell>
                                                <TableCell className="w-32">
                                                    <div className="flex items-center justify-end gap-1">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                openEdit(
                                                                    service,
                                                                )
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
                                                                    service,
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
                        <DialogTitle>Add a service</DialogTitle>
                        <DialogDescription>
                            The service is live on the services page
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
                        <ServiceFields form={form} />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={form.processing}>
                                <Plus />
                                Add service
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
                            Changes apply to the public services page and book
                            form immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            submitEdit();
                        }}
                        className="grid gap-4"
                    >
                        <ServiceFields form={form} />
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
                            This permanently removes the service from the site.
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
                            Delete service
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            <CollectionRestoreDialog
                open={restoreOpen}
                onOpenChange={setRestoreOpen}
                label="Services"
                url={restoreService.url()}
            />
        </>
    );
}

function ServiceFields({
    form,
}: {
    form: ReturnType<typeof useForm<ServiceForm>>;
}) {
    const isActive = form.data.active === '1';
    const field = (
        key: keyof ServiceForm,
        label: string,
        placeholder?: string,
    ) => (
        <div className="grid gap-1.5">
            <Label htmlFor={`service-${key}`}>{label}</Label>
            <Input
                id={`service-${key}`}
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
                {field('title', 'Title', 'Wheelchair Transport')}
                {field('slug', 'Slug', 'wheelchair-transport')}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                    <Label>Category</Label>
                    <Select
                        value={form.data.category}
                        onValueChange={(value) =>
                            form.setData('category', value)
                        }
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="MEDICAL">Medical</SelectItem>
                            <SelectItem value="NON_MEDICAL">
                                Non-medical
                            </SelectItem>
                            <SelectItem value="SPECIALTY">Specialty</SelectItem>
                        </SelectContent>
                    </Select>
                    {form.errors.category && (
                        <p className="text-xs text-destructive">
                            {form.errors.category}
                        </p>
                    )}
                </div>
                {field('icon_name', 'Icon name', 'Wheelchair')}
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="service-short_description">
                    Short description
                </Label>
                <Textarea
                    id="service-short_description"
                    rows={2}
                    value={form.data.short_description}
                    onChange={(event) =>
                        form.setData('short_description', event.target.value)
                    }
                />
                {form.errors.short_description && (
                    <p className="text-xs text-destructive">
                        {form.errors.short_description}
                    </p>
                )}
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="service-full_description">
                    Full description
                </Label>
                <Textarea
                    id="service-full_description"
                    rows={4}
                    value={form.data.full_description}
                    onChange={(event) =>
                        form.setData('full_description', event.target.value)
                    }
                />
                {form.errors.full_description && (
                    <p className="text-xs text-destructive">
                        {form.errors.full_description}
                    </p>
                )}
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
                {field('base_rate', 'Base rate ($)', '45')}
                {field('mileage_rate', 'Mileage rate ($)', '3.5')}
                {field('sort_order', 'Display order', '1')}
            </div>
            <div className="grid gap-1.5">
                <CmsImageUploader
                    value={form.data.image}
                    onChange={(url) => form.setData('image', url)}
                    label="Service image"
                />
                {form.errors.image && (
                    <p className="text-xs text-destructive">
                        {form.errors.image}
                    </p>
                )}
            </div>
            {[
                ['benefits', 'Benefits (one per line)'],
                ['suitable_for', 'Suitable for (one per line)'],
                ['typical_destinations', 'Typical destinations (one per line)'],
            ].map(([key, label]) => (
                <div className="grid gap-1.5" key={key}>
                    <Label htmlFor={`service-${key}`}>{label}</Label>
                    <Textarea
                        id={`service-${key}`}
                        rows={3}
                        value={form.data[key]}
                        onChange={(event) =>
                            form.setData(
                                key as keyof ServiceForm,
                                event.target.value,
                            )
                        }
                    />
                    {form.errors[key] && (
                        <p className="text-xs text-destructive">
                            {form.errors[key]}
                        </p>
                    )}
                </div>
            ))}
            <div className="flex items-center gap-2">
                <Checkbox
                    id="service-active"
                    checked={form.data.active === '1'}
                    onCheckedChange={(checked) =>
                        form.setData('active', checked ? '1' : '0')
                    }
                />
                <Label htmlFor="service-active">
                    Visible on the public site ({isActive ? 'live' : 'hidden'})
                </Label>
            </div>
        </>
    );
}
