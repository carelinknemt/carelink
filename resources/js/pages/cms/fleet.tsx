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
    destroy as destroyVehicle,
    store as storeVehicle,
    update as updateVehicle,
} from '@/routes/cms/fleet';
import type { CmsFleetVehicleRecord } from '@/types/dashboard';

type FleetForm = Record<string, string>;

const EMPTY_FORM: FleetForm = {
    name: '',
    type: 'WHEELCHAIR',
    capacity: '',
    features: '',
    description: '',
    image: '',
    accessibility_specs: '',
    hourly_rate_est: '',
    sort_order: '0',
    active: '1',
};

function toText(list: string[]): string {
    return list.join('\n');
}

function fromRecord(vehicle: CmsFleetVehicleRecord): FleetForm {
    return {
        name: vehicle.name,
        type: vehicle.type,
        capacity: vehicle.capacity ?? '',
        features: toText(vehicle.features),
        description: vehicle.description ?? '',
        image: vehicle.image ?? '',
        accessibility_specs: toText(vehicle.accessibility_specs),
        hourly_rate_est: vehicle.hourly_rate_est ?? '',
        sort_order: String(vehicle.sort_order),
        active: vehicle.active ? '1' : '0',
    };
}

export default function CmsFleet({
    vehicles,
}: {
    vehicles: CmsFleetVehicleRecord[];
}) {
    const form = useForm<FleetForm>(EMPTY_FORM);
    const [postOpen, setPostOpen] = useState(false);
    const [editTarget, setEditTarget] = useState<CmsFleetVehicleRecord | null>(
        null,
    );
    const [deleteTarget, setDeleteTarget] =
        useState<CmsFleetVehicleRecord | null>(null);

    function openPost() {
        form.setData(EMPTY_FORM);
        form.clearErrors();
        setPostOpen(true);
    }

    function openEdit(vehicle: CmsFleetVehicleRecord) {
        form.setData(fromRecord(vehicle));
        form.clearErrors();
        setEditTarget(vehicle);
    }

    function submitPost() {
        form.post(storeVehicle.url(), {
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

        form.put(updateVehicle.url({ vehicle: editTarget.id }), {
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

        router.delete(destroyVehicle.url({ vehicle: deleteTarget.id }), {
            preserveScroll: true,
            onSuccess: () => setDeleteTarget(null),
        });
    }

    return (
        <>
            <Head title="Fleet">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Fleet
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            The vehicles shown on the public fleet page.
                        </p>
                    </div>
                    <Button type="button" onClick={openPost}>
                        <Plus />
                        Add a vehicle
                    </Button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Vehicles</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-hidden rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead className="hidden md:table-cell">
                                            Type
                                        </TableHead>
                                        <TableHead className="hidden lg:table-cell">
                                            Hourly (est.)
                                        </TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-32" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {vehicles.length === 0 ? (
                                        <TableRow>
                                            <TableCell
                                                colSpan={5}
                                                className="h-24 text-center"
                                            >
                                                <p className="text-sm text-muted-foreground">
                                                    No vehicles yet.
                                                </p>
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        vehicles.map((vehicle) => (
                                            <TableRow key={vehicle.id}>
                                                <TableCell>
                                                    <span className="font-medium">
                                                        {vehicle.name}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="hidden md:table-cell">
                                                    {vehicle.type}
                                                </TableCell>
                                                <TableCell className="hidden lg:table-cell">
                                                    $
                                                    {vehicle.hourly_rate_est ??
                                                        '0.00'}
                                                </TableCell>
                                                <TableCell>
                                                    {vehicle.active ? (
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
                                                                    vehicle,
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
                                                                    vehicle,
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
                        <DialogTitle>Add a vehicle</DialogTitle>
                        <DialogDescription>
                            The vehicle is live on the fleet page immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            submitPost();
                        }}
                        className="grid gap-4"
                    >
                        <FleetFields form={form} />
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={form.processing}>
                                <Plus />
                                Add vehicle
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
                        <DialogTitle>Edit {editTarget?.name}</DialogTitle>
                        <DialogDescription>
                            Changes apply to the public fleet page immediately.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            submitEdit();
                        }}
                        className="grid gap-4"
                    >
                        <FleetFields form={form} />
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
                            This permanently removes the vehicle from the site.
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
                            Delete vehicle
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

function FleetFields({
    form,
}: {
    form: ReturnType<typeof useForm<FleetForm>>;
}) {
    const activeForm = form.data.active === '1';
    const field = (
        key: keyof FleetForm,
        label: string,
        placeholder?: string,
    ) => (
        <div className="grid gap-1.5">
            <Label htmlFor={`fleet-${key}`}>{label}</Label>
            <Input
                id={`fleet-${key}`}
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
            {field('name', 'Name', 'Carelink Transporter Max (Wheelchair Van)')}
            <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-1.5">
                    <Label>Vehicle type</Label>
                    <Select
                        value={form.data.type}
                        onValueChange={(value) => form.setData('type', value)}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="AMBULATORY">
                                Ambulatory
                            </SelectItem>
                            <SelectItem value="WHEELCHAIR">
                                Wheelchair
                            </SelectItem>
                            <SelectItem value="GURNEY">Gurney</SelectItem>
                            <SelectItem value="TRANSIT_SHUTTLE">
                                Transit shuttle
                            </SelectItem>
                        </SelectContent>
                    </Select>
                    {form.errors.type && (
                        <p className="text-xs text-destructive">
                            {form.errors.type}
                        </p>
                    )}
                </div>
                {field('capacity', 'Capacity', '1 Wheelchair + 3 Ambulatory')}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
                {field('hourly_rate_est', 'Hourly rate (est. $)', '75')}
                {field('sort_order', 'Display order', '1')}
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="fleet-description">Description</Label>
                <Textarea
                    id="fleet-description"
                    rows={3}
                    value={form.data.description}
                    onChange={(event) =>
                        form.setData('description', event.target.value)
                    }
                />
                {form.errors.description && (
                    <p className="text-xs text-destructive">
                        {form.errors.description}
                    </p>
                )}
            </div>
            <div className="grid gap-1.5">
                <Label htmlFor="fleet-image">
                    Image URL (paste a hosted image path)
                </Label>
                <Input
                    id="fleet-image"
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
            {[
                ['features', 'Features (one per line)'],
                ['accessibility_specs', 'Accessibility specs (one per line)'],
            ].map(([key, label]) => (
                <div className="grid gap-1.5" key={key}>
                    <Label htmlFor={`fleet-${key}`}>{label}</Label>
                    <Textarea
                        id={`fleet-${key}`}
                        rows={3}
                        value={form.data[key]}
                        onChange={(event) =>
                            form.setData(
                                key as keyof FleetForm,
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
                    id="fleet-active"
                    checked={activeForm}
                    onCheckedChange={(checked) =>
                        form.setData('active', checked ? '1' : '0')
                    }
                />
                <Label htmlFor="fleet-active">
                    Visible on the public site ({activeForm ? 'live' : 'hidden'}
                    )
                </Label>
            </div>
        </>
    );
}
