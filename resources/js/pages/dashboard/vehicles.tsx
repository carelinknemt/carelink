import { Head, router, useForm } from '@inertiajs/react';
import {
    Car,
    Eye,
    FileText,
    Pencil,
    Plus,
    Printer,
    Trash2,
    Upload,
    Wrench,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import DatePicker from '@/components/carelink/date-picker';
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
import { Textarea } from '@/components/ui/textarea';
import { formatDate, formatMoney } from '@/lib/bookings';
import {
    formatFileSize,
    formatMileage,
    MAINTENANCE_TYPE_OPTIONS,
    maintenanceTypeLabel,
    printMaintenanceReport,
    VEHICLE_TYPE_OPTIONS,
} from '@/lib/vehicles';
import { dashboard } from '@/routes';
import { vehicles as dashboardVehicles } from '@/routes/dashboard';
import vehiclesRoutes from '@/routes/dashboard/vehicles';
import type {
    MaintenanceDocumentRecord,
    VehicleMaintenanceRecord,
    VehicleOption,
    VehicleRecord,
} from '@/types/dashboard';

type DashboardVehiclesProps = {
    vehicles: VehicleRecord[];
    records: VehicleMaintenanceRecord[];
    vehicle_options: VehicleOption[];
};

type PendingDocument = {
    file: File;
};

type RecordFormData = {
    fleet_vehicle_id: string;
    maintenance_type: string;
    service_date: string;
    vehicle_mileage: string;
    service_provider: string;
    total_cost: string;
    next_service_date: string;
    next_service_mileage: string;
    notes: string;
    documents: PendingDocument[];
};

type VehicleFormData = {
    name: string;
    type: string;
    capacity: string;
    vin: string;
    plate: string;
    hourly_rate_est: string;
    description: string;
    active: boolean;
};

export default function DashboardVehicles({
    vehicles,
    records,
    vehicle_options,
}: DashboardVehiclesProps) {
    const [activeTab, setActiveTab] = useState<'maintenance' | 'vehicles'>(
        'maintenance',
    );
    const [recordOpen, setRecordOpen] = useState(false);
    const [editingRecord, setEditingRecord] =
        useState<VehicleMaintenanceRecord | null>(null);
    const [pendingDocuments, setPendingDocuments] = useState<PendingDocument[]>(
        [],
    );
    const [deleteRecordTarget, setDeleteRecordTarget] =
        useState<VehicleMaintenanceRecord | null>(null);
    const [detailsTarget, setDetailsTarget] =
        useState<VehicleMaintenanceRecord | null>(null);
    const [vehicleOpen, setVehicleOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<VehicleRecord | null>(
        null,
    );
    const [deleteVehicleTarget, setDeleteVehicleTarget] =
        useState<VehicleRecord | null>(null);
    const [reportOpen, setReportOpen] = useState(false);
    const [reportForm, setReportForm] = useState({
        fleet_vehicle_id: '',
        start_date: '',
        end_date: '',
    });
    const [report, setReport] = useState<{
        vehicle: VehicleOption;
        start_date: string;
        end_date: string;
        items: VehicleMaintenanceRecord[];
    } | null>(null);

    const recordForm = useForm<RecordFormData>({
        fleet_vehicle_id: '',
        maintenance_type: 'oil_change',
        service_date: '',
        vehicle_mileage: '',
        service_provider: '',
        total_cost: '0.00',
        next_service_date: '',
        next_service_mileage: '',
        notes: '',
        documents: [],
    });

    const vehicleForm = useForm<VehicleFormData>({
        name: '',
        type: 'AMBULATORY',
        capacity: '',
        vin: '',
        plate: '',
        hourly_rate_est: '',
        description: '',
        active: true,
    });

    function openCreateRecord() {
        recordForm.reset();
        recordForm.setData('maintenance_type', 'oil_change');
        recordForm.setData('total_cost', '0.00');
        setPendingDocuments([]);
        setEditingRecord(null);
        setRecordOpen(true);
    }

    function openEditRecord(record: VehicleMaintenanceRecord) {
        setEditingRecord(record);
        recordForm.reset();
        recordForm.setData(
            'fleet_vehicle_id',
            record.vehicle ? String(record.vehicle.id) : '',
        );
        recordForm.setData('maintenance_type', record.maintenance_type);
        recordForm.setData('service_date', record.service_date ?? '');
        recordForm.setData(
            'vehicle_mileage',
            record.vehicle_mileage != null
                ? String(record.vehicle_mileage)
                : '',
        );
        recordForm.setData('service_provider', record.service_provider ?? '');
        recordForm.setData('total_cost', record.total_cost ?? '0.00');
        recordForm.setData('next_service_date', record.next_service_date ?? '');
        recordForm.setData(
            'next_service_mileage',
            record.next_service_mileage != null
                ? String(record.next_service_mileage)
                : '',
        );
        recordForm.setData('notes', record.notes ?? '');
        setPendingDocuments([]);
        setRecordOpen(true);
    }

    function submitRecord() {
        if (editingRecord) {
            recordForm.put(
                vehiclesRoutes.maintenance.update.url({
                    record: editingRecord.id,
                }),
                {
                    preserveScroll: true,
                    onSuccess: () => setRecordOpen(false),
                },
            );

            return;
        }

        recordForm.post(vehiclesRoutes.maintenance.store.url(), {
            preserveScroll: true,
            onSuccess: () => setRecordOpen(false),
        });
    }

    function addPendingDocuments(files: FileList | null) {
        if (!files) {
            return;
        }

        const next = [
            ...pendingDocuments,
            ...Array.from(files).map((file) => ({ file })),
        ];

        setPendingDocuments(next);

        recordForm.setData(
            'documents',
            next
                .filter((doc) => doc.file.size > 0)
                .map((doc) => ({ file: doc.file })),
        );
    }

    function removePendingDocument(index: number) {
        const next = pendingDocuments.filter((_, i) => i !== index);

        setPendingDocuments(next);

        recordForm.setData(
            'documents',
            next
                .filter((doc) => doc.file.size > 0)
                .map((doc) => ({ file: doc.file })),
        );
    }

    function confirmDeleteRecord() {
        if (!deleteRecordTarget) {
            return;
        }

        router.delete(
            vehiclesRoutes.maintenance.destroy.url({
                record: deleteRecordTarget.id,
            }),
            {
                preserveScroll: true,
                onSuccess: () => setDeleteRecordTarget(null),
            },
        );
    }

    function removeStoredDocument(document: MaintenanceDocumentRecord) {
        if (!editingRecord) {
            return;
        }

        router.delete(
            vehiclesRoutes.maintenance.documents.destroy.url({
                record: editingRecord.id,
                document: document.id,
            }),
            { preserveScroll: true },
        );
    }

    function openCreateVehicle() {
        vehicleForm.reset();
        vehicleForm.setData('type', 'AMBULATORY');
        vehicleForm.setData('active', true);
        setEditingVehicle(null);
        setVehicleOpen(true);
    }

    function openEditVehicle(vehicle: VehicleRecord) {
        setEditingVehicle(vehicle);
        vehicleForm.reset();
        vehicleForm.setData('name', vehicle.name);
        vehicleForm.setData('type', vehicle.type);
        vehicleForm.setData('capacity', vehicle.capacity);
        vehicleForm.setData('vin', vehicle.vin ?? '');
        vehicleForm.setData('plate', vehicle.plate ?? '');
        vehicleForm.setData('hourly_rate_est', vehicle.hourly_rate_est ?? '');
        vehicleForm.setData('description', vehicle.description ?? '');
        vehicleForm.setData('active', vehicle.active);
        setVehicleOpen(true);
    }

    function submitVehicle() {
        if (editingVehicle) {
            vehicleForm.put(
                vehiclesRoutes.update.url({ vehicle: editingVehicle.id }),
                {
                    preserveScroll: true,
                    onSuccess: () => setVehicleOpen(false),
                },
            );

            return;
        }

        vehicleForm.post(vehiclesRoutes.store.url(), {
            preserveScroll: true,
            onSuccess: () => setVehicleOpen(false),
        });
    }

    function openReport() {
        setReportForm({ fleet_vehicle_id: '', start_date: '', end_date: '' });
        setReport(null);
        setReportOpen(true);
    }

    function generateReport() {
        const vehicle = vehicle_options.find(
            (option) => option.id === Number(reportForm.fleet_vehicle_id),
        );

        if (!vehicle) {
            return;
        }

        const items = records.filter((record) => {
            if (record.vehicle?.id !== vehicle.id) {
                return false;
            }

            if (
                reportForm.start_date &&
                (!record.service_date ||
                    record.service_date < reportForm.start_date)
            ) {
                return false;
            }

            if (
                reportForm.end_date &&
                (!record.service_date ||
                    record.service_date > reportForm.end_date)
            ) {
                return false;
            }

            return true;
        });

        setReport({
            vehicle,
            start_date: reportForm.start_date,
            end_date: reportForm.end_date,
            items,
        });
    }

    function confirmDeleteVehicle() {
        if (!deleteVehicleTarget) {
            return;
        }

        router.delete(
            vehiclesRoutes.destroy.url({ vehicle: deleteVehicleTarget.id }),
            {
                preserveScroll: true,
                onSuccess: () => setDeleteVehicleTarget(null),
            },
        );
    }

    function renderMaintenanceTable() {
        return (
            <>
                {records.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-16 text-center">
                        <Wrench className="size-10 text-muted-foreground" />
                        <p className="font-medium">
                            No maintenance records yet
                        </p>
                        <p className="text-sm text-muted-foreground">
                            Add a service record for any fleet vehicle.
                        </p>
                    </div>
                ) : (
                    <>
                        <ul className="flex flex-col gap-3 lg:hidden">
                            {records.map((record) => (
                                <li
                                    key={record.id}
                                    className="rounded-lg border border-border p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="font-medium">
                                                {record.vehicle?.name ?? '—'}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {maintenanceTypeLabel(
                                                    record.maintenance_type,
                                                )}
                                                {' · '}
                                                {formatDate(
                                                    record.service_date,
                                                )}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <IconAction label="View record details">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        setDetailsTarget(record)
                                                    }
                                                >
                                                    <Eye />
                                                </Button>
                                            </IconAction>
                                            <IconAction label="Edit record">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        openEditRecord(record)
                                                    }
                                                >
                                                    <Pencil />
                                                </Button>
                                            </IconAction>
                                            <IconAction label="Delete record">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        setDeleteRecordTarget(
                                                            record,
                                                        )
                                                    }
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </IconAction>
                                        </div>
                                    </div>
                                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">
                                                Cost
                                            </p>
                                            <p className="font-medium">
                                                {formatMoney(record.total_cost)}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">
                                                Mileage
                                            </p>
                                            <p className="font-medium">
                                                {formatMileage(
                                                    record.vehicle_mileage,
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">
                                                Receipts
                                            </p>
                                            <p className="font-medium">
                                                {record.documents.length}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="hidden lg:block">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Vehicle</TableHead>
                                        <TableHead>Maintenance</TableHead>
                                        <TableHead>Service date</TableHead>
                                        <TableHead>Mileage</TableHead>
                                        <TableHead>Provider</TableHead>
                                        <TableHead>Cost</TableHead>
                                        <TableHead>Receipts</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {records.map((record) => (
                                        <TableRow key={record.id}>
                                            <TableCell className="font-medium">
                                                {record.vehicle?.name ?? '—'}
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
                                                    {maintenanceTypeLabel(
                                                        record.maintenance_type,
                                                    )}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {formatDate(
                                                    record.service_date,
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {formatMileage(
                                                    record.vehicle_mileage,
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {record.service_provider ?? '—'}
                                            </TableCell>
                                            <TableCell>
                                                {formatMoney(record.total_cost)}
                                            </TableCell>
                                            <TableCell>
                                                {record.documents.length > 0
                                                    ? record.documents.length
                                                    : '—'}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <IconAction label="View record details">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                setDetailsTarget(
                                                                    record,
                                                                )
                                                            }
                                                        >
                                                            <Eye />
                                                        </Button>
                                                    </IconAction>
                                                    <IconAction label="Edit record">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                openEditRecord(
                                                                    record,
                                                                )
                                                            }
                                                        >
                                                            <Pencil />
                                                        </Button>
                                                    </IconAction>
                                                    <IconAction label="Delete record">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                setDeleteRecordTarget(
                                                                    record,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 />
                                                        </Button>
                                                    </IconAction>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </>
                )}
            </>
        );
    }

    function renderVehiclesTable() {
        return (
            <>
                {vehicles.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 py-16 text-center">
                        <Car className="size-10 text-muted-foreground" />
                        <p className="font-medium">No vehicles yet</p>
                        <p className="text-sm text-muted-foreground">
                            Add your first fleet vehicle.
                        </p>
                    </div>
                ) : (
                    <>
                        <ul className="flex flex-col gap-3 lg:hidden">
                            {vehicles.map((vehicle) => (
                                <li
                                    key={vehicle.id}
                                    className="rounded-lg border border-border p-4"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p className="flex flex-wrap items-center gap-2 font-medium">
                                                {vehicle.name}
                                                {vehicle.active ? (
                                                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
                                                        Inactive
                                                    </span>
                                                )}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {vehicle.type}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <IconAction label="Edit vehicle">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        openEditVehicle(vehicle)
                                                    }
                                                >
                                                    <Pencil />
                                                </Button>
                                            </IconAction>
                                            <IconAction label="Delete vehicle">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        setDeleteVehicleTarget(
                                                            vehicle,
                                                        )
                                                    }
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </IconAction>
                                        </div>
                                    </div>
                                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">
                                                Plate
                                            </p>
                                            <p className="font-medium">
                                                {vehicle.plate ?? '—'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">
                                                VIN
                                            </p>
                                            <p className="font-medium">
                                                {vehicle.vin ?? '—'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">
                                                Services
                                            </p>
                                            <p className="font-medium">
                                                {vehicle.records_count}
                                            </p>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="hidden lg:block">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Vehicle</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Plate</TableHead>
                                        <TableHead>VIN</TableHead>
                                        <TableHead>Services</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {vehicles.map((vehicle) => (
                                        <TableRow key={vehicle.id}>
                                            <TableCell className="font-medium">
                                                {vehicle.name}
                                            </TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
                                                    {vehicle.type}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                {vehicle.plate ?? '—'}
                                            </TableCell>
                                            <TableCell>
                                                {vehicle.vin ?? '—'}
                                            </TableCell>
                                            <TableCell>
                                                {vehicle.records_count}
                                            </TableCell>
                                            <TableCell>
                                                {vehicle.active ? (
                                                    <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs font-medium text-slate-700">
                                                        Inactive
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <IconAction label="Edit vehicle">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                openEditVehicle(
                                                                    vehicle,
                                                                )
                                                            }
                                                        >
                                                            <Pencil />
                                                        </Button>
                                                    </IconAction>
                                                    <IconAction label="Delete vehicle">
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() =>
                                                                setDeleteVehicleTarget(
                                                                    vehicle,
                                                                )
                                                            }
                                                        >
                                                            <Trash2 />
                                                        </Button>
                                                    </IconAction>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </>
                )}
            </>
        );
    }

    return (
        <>
            <Head title="Vehicle Maintenance">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Vehicle Maintenance
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Track service history and upcoming maintenance for
                            every fleet vehicle.
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex w-full items-center gap-1 rounded-lg border border-border bg-muted p-1 sm:inline-flex sm:w-auto">
                            {[
                                { id: 'maintenance', label: 'Maintenance' },
                                { id: 'vehicles', label: 'Vehicles' },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    type="button"
                                    onClick={() =>
                                        setActiveTab(
                                            tab.id as
                                                'maintenance' | 'vehicles',
                                        )
                                    }
                                    className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors sm:flex-none ${
                                        activeTab === tab.id
                                            ? 'bg-background text-foreground shadow-sm'
                                            : 'text-muted-foreground hover:text-foreground'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        {activeTab === 'maintenance' ? (
                            <>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={openReport}
                                >
                                    <FileText />
                                    Maintenance report
                                </Button>
                                <Button
                                    type="button"
                                    onClick={openCreateRecord}
                                >
                                    <Wrench />
                                    Add maintenance record
                                </Button>
                            </>
                        ) : (
                            <Button type="button" onClick={openCreateVehicle}>
                                <Plus />
                                Add vehicle
                            </Button>
                        )}
                    </div>
                </div>

                <Card className="flex-1">
                    <CardContent className="pt-6">
                        {activeTab === 'maintenance'
                            ? renderMaintenanceTable()
                            : renderVehiclesTable()}
                    </CardContent>
                </Card>
            </div>

            {/* Add / edit maintenance record */}
            <Dialog
                open={recordOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setRecordOpen(false);
                    }
                }}
            >
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            {editingRecord
                                ? 'Edit maintenance record'
                                : 'Add maintenance record'}
                        </DialogTitle>
                        <DialogDescription>
                            Log a service visit and attach its receipts.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        className="grid gap-4"
                        encType="multipart/form-data"
                        onSubmit={(event: FormEvent) => {
                            event.preventDefault();
                            submitRecord();
                        }}
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="record-vehicle">Vehicle</Label>
                                <Select
                                    value={recordForm.data.fleet_vehicle_id}
                                    onValueChange={(value) =>
                                        recordForm.setData(
                                            'fleet_vehicle_id',
                                            value,
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        id="record-vehicle"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Select a fleet vehicle" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {vehicle_options.map((option) => (
                                            <SelectItem
                                                key={option.id}
                                                value={String(option.id)}
                                            >
                                                {option.name}
                                                {option.plate
                                                    ? ` · ${option.plate}`
                                                    : ''}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {recordForm.errors.fleet_vehicle_id && (
                                    <p className="text-xs text-destructive">
                                        {recordForm.errors.fleet_vehicle_id}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="record-type">
                                    Maintenance type
                                </Label>
                                <Select
                                    value={recordForm.data.maintenance_type}
                                    onValueChange={(value) =>
                                        recordForm.setData(
                                            'maintenance_type',
                                            value,
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        id="record-type"
                                        className="w-full"
                                    >
                                        <SelectValue placeholder="Maintenance type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MAINTENANCE_TYPE_OPTIONS.map(
                                            (option) => (
                                                <SelectItem
                                                    key={option.value}
                                                    value={option.value}
                                                >
                                                    {option.label}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                                {recordForm.errors.maintenance_type && (
                                    <p className="text-xs text-destructive">
                                        {recordForm.errors.maintenance_type}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="record-service-date">
                                    Service date
                                </Label>
                                <DatePicker
                                    id="record-service-date"
                                    value={recordForm.data.service_date}
                                    onChange={(value) =>
                                        recordForm.setData(
                                            'service_date',
                                            value,
                                        )
                                    }
                                    placeholder="mm/dd/yyyy"
                                />
                                {recordForm.errors.service_date && (
                                    <p className="text-xs text-destructive">
                                        {recordForm.errors.service_date}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="record-mileage">
                                    Vehicle mileage
                                </Label>
                                <Input
                                    id="record-mileage"
                                    inputMode="numeric"
                                    value={recordForm.data.vehicle_mileage}
                                    onChange={(event) =>
                                        recordForm.setData(
                                            'vehicle_mileage',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="e.g. 34,210"
                                />
                                {recordForm.errors.vehicle_mileage && (
                                    <p className="text-xs text-destructive">
                                        {recordForm.errors.vehicle_mileage}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="record-provider">
                                    Service provider
                                </Label>
                                <Input
                                    id="record-provider"
                                    value={recordForm.data.service_provider}
                                    onChange={(event) =>
                                        recordForm.setData(
                                            'service_provider',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="Business or technician"
                                />
                                {recordForm.errors.service_provider && (
                                    <p className="text-xs text-destructive">
                                        {recordForm.errors.service_provider}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="record-cost">Total cost</Label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                                        $
                                    </span>
                                    <Input
                                        id="record-cost"
                                        inputMode="decimal"
                                        className="pl-7"
                                        value={recordForm.data.total_cost}
                                        onChange={(event) =>
                                            recordForm.setData(
                                                'total_cost',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="0.00"
                                    />
                                </div>
                                {recordForm.errors.total_cost && (
                                    <p className="text-xs text-destructive">
                                        {recordForm.errors.total_cost}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="record-next-date">
                                    Next service date
                                </Label>
                                <DatePicker
                                    id="record-next-date"
                                    value={recordForm.data.next_service_date}
                                    onChange={(value) =>
                                        recordForm.setData(
                                            'next_service_date',
                                            value,
                                        )
                                    }
                                    placeholder="mm/dd/yyyy"
                                />
                                {recordForm.errors.next_service_date && (
                                    <p className="text-xs text-destructive">
                                        {recordForm.errors.next_service_date}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="record-next-mileage">
                                    Next service mileage
                                </Label>
                                <Input
                                    id="record-next-mileage"
                                    inputMode="numeric"
                                    value={recordForm.data.next_service_mileage}
                                    onChange={(event) =>
                                        recordForm.setData(
                                            'next_service_mileage',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="e.g. 40,000"
                                />
                                {recordForm.errors.next_service_mileage && (
                                    <p className="text-xs text-destructive">
                                        {recordForm.errors.next_service_mileage}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="record-notes">
                                Work performed / notes
                            </Label>
                            <Textarea
                                id="record-notes"
                                rows={4}
                                value={recordForm.data.notes}
                                onChange={(event) =>
                                    recordForm.setData(
                                        'notes',
                                        event.target.value,
                                    )
                                }
                                placeholder="Describe parts replaced, repairs, or inspection results"
                            />
                            {recordForm.errors.notes && (
                                <p className="text-xs text-destructive">
                                    {recordForm.errors.notes}
                                </p>
                            )}
                        </div>

                        <div className="grid gap-1.5">
                            <Label>Receipt or service documents</Label>

                            {editingRecord &&
                                editingRecord.documents.length > 0 && (
                                    <ul className="flex flex-col gap-2">
                                        {editingRecord.documents.map((doc) => (
                                            <li
                                                key={doc.id}
                                                className="flex items-center gap-2 rounded-md border border-border p-3"
                                            >
                                                <FileText className="size-4 shrink-0 text-muted-foreground" />
                                                <div className="min-w-0 flex-1">
                                                    <p className="truncate text-sm">
                                                        <a
                                                            href={vehiclesRoutes.maintenance.documents.show.url(
                                                                {
                                                                    record: editingRecord.id,
                                                                    document:
                                                                        doc.id,
                                                                },
                                                            )}
                                                            className="hover:underline"
                                                        >
                                                            {doc.file_name}
                                                        </a>
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {formatFileSize(
                                                            doc.file_size,
                                                        )}
                                                    </p>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    aria-label="Remove receipt"
                                                    onClick={() =>
                                                        removeStoredDocument(
                                                            doc,
                                                        )
                                                    }
                                                >
                                                    <Trash2 />
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                            {pendingDocuments.length > 0 && (
                                <ul className="flex flex-col gap-2">
                                    {pendingDocuments.map((doc, index) => (
                                        <li
                                            key={`${doc.file.name}-${index}`}
                                            className="flex items-center gap-2 rounded-md border border-border p-3"
                                        >
                                            <FileText className="size-4 shrink-0 text-muted-foreground" />
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm">
                                                    {doc.file.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatFileSize(
                                                        doc.file.size,
                                                    )}
                                                </p>
                                            </div>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                aria-label="Remove receipt"
                                                onClick={() =>
                                                    removePendingDocument(index)
                                                }
                                            >
                                                <Trash2 />
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <label className="flex cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed border-border px-3 py-6 text-center">
                                <Upload className="size-5 text-muted-foreground" />
                                <span className="text-sm font-medium">
                                    Drop files here or choose files
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    PDF, JPG, or PNG
                                </span>
                                <input
                                    type="file"
                                    className="hidden"
                                    multiple
                                    accept="application/pdf,image/jpeg,image/png"
                                    onChange={(event) =>
                                        addPendingDocuments(event.target.files)
                                    }
                                />
                            </label>
                            {recordForm.errors.documents && (
                                <p className="text-xs text-destructive">
                                    {recordForm.errors.documents}
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={recordForm.processing}
                            >
                                <Wrench />
                                Save record
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Add / edit vehicle */}
            <Dialog
                open={vehicleOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setVehicleOpen(false);
                    }
                }}
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>
                            {editingVehicle ? 'Edit vehicle' : 'Add a vehicle'}
                        </DialogTitle>
                        <DialogDescription>
                            Add or update a fleet vehicle in the maintenance
                            log.
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        className="grid gap-4"
                        onSubmit={(event: FormEvent) => {
                            event.preventDefault();
                            submitVehicle();
                        }}
                    >
                        <div className="grid gap-1.5">
                            <Label htmlFor="vehicle-name">Vehicle name</Label>
                            <Input
                                id="vehicle-name"
                                value={vehicleForm.data.name}
                                onChange={(event) =>
                                    vehicleForm.setData(
                                        'name',
                                        event.target.value,
                                    )
                                }
                                placeholder="e.g. Van 01 - BraunAbility"
                            />
                            {vehicleForm.errors.name && (
                                <p className="text-xs text-destructive">
                                    {vehicleForm.errors.name}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="vehicle-type">Type</Label>
                                <Select
                                    value={vehicleForm.data.type}
                                    onValueChange={(value) =>
                                        vehicleForm.setData('type', value)
                                    }
                                >
                                    <SelectTrigger
                                        id="vehicle-type"
                                        className="w-full"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {VEHICLE_TYPE_OPTIONS.map((option) => (
                                            <SelectItem
                                                key={option.value}
                                                value={option.value}
                                            >
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {vehicleForm.errors.type && (
                                    <p className="text-xs text-destructive">
                                        {vehicleForm.errors.type}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="vehicle-capacity">
                                    Capacity
                                </Label>
                                <Input
                                    id="vehicle-capacity"
                                    value={vehicleForm.data.capacity}
                                    onChange={(event) =>
                                        vehicleForm.setData(
                                            'capacity',
                                            event.target.value,
                                        )
                                    }
                                    placeholder="e.g. 1 Wheelchair + 3 Passengers"
                                />
                                {vehicleForm.errors.capacity && (
                                    <p className="text-xs text-destructive">
                                        {vehicleForm.errors.capacity}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="vehicle-vin">VIN</Label>
                                <Input
                                    id="vehicle-vin"
                                    value={vehicleForm.data.vin}
                                    onChange={(event) =>
                                        vehicleForm.setData(
                                            'vin',
                                            event.target.value.toUpperCase(),
                                        )
                                    }
                                    placeholder="e.g. 5TDDKRFH8DS123456"
                                />
                                {vehicleForm.errors.vin && (
                                    <p className="text-xs text-destructive">
                                        {vehicleForm.errors.vin}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="vehicle-plate">
                                    License plate
                                </Label>
                                <Input
                                    id="vehicle-plate"
                                    value={vehicleForm.data.plate}
                                    onChange={(event) =>
                                        vehicleForm.setData(
                                            'plate',
                                            event.target.value.toUpperCase(),
                                        )
                                    }
                                    placeholder="e.g. 8ABC123"
                                />
                                {vehicleForm.errors.plate && (
                                    <p className="text-xs text-destructive">
                                        {vehicleForm.errors.plate}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-1.5">
                                <Label htmlFor="vehicle-rate">
                                    Hourly rate estimate
                                </Label>
                                <div className="relative">
                                    <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground">
                                        $
                                    </span>
                                    <Input
                                        id="vehicle-rate"
                                        inputMode="decimal"
                                        className="pl-7"
                                        value={vehicleForm.data.hourly_rate_est}
                                        onChange={(event) =>
                                            vehicleForm.setData(
                                                'hourly_rate_est',
                                                event.target.value,
                                            )
                                        }
                                        placeholder="0.00"
                                    />
                                </div>
                                {vehicleForm.errors.hourly_rate_est && (
                                    <p className="text-xs text-destructive">
                                        {vehicleForm.errors.hourly_rate_est}
                                    </p>
                                )}
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="vehicle-active">Status</Label>
                                <Select
                                    value={
                                        vehicleForm.data.active
                                            ? 'active'
                                            : 'inactive'
                                    }
                                    onValueChange={(value) =>
                                        vehicleForm.setData(
                                            'active',
                                            value === 'active',
                                        )
                                    }
                                >
                                    <SelectTrigger
                                        id="vehicle-active"
                                        className="w-full"
                                    >
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">
                                            Active
                                        </SelectItem>
                                        <SelectItem value="inactive">
                                            Inactive
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                {vehicleForm.errors.active && (
                                    <p className="text-xs text-destructive">
                                        {vehicleForm.errors.active}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div className="grid gap-1.5">
                            <Label htmlFor="vehicle-description">
                                Description
                            </Label>
                            <Textarea
                                id="vehicle-description"
                                rows={3}
                                value={vehicleForm.data.description}
                                onChange={(event) =>
                                    vehicleForm.setData(
                                        'description',
                                        event.target.value,
                                    )
                                }
                                placeholder="Short description of the vehicle"
                            />
                            {vehicleForm.errors.description && (
                                <p className="text-xs text-destructive">
                                    {vehicleForm.errors.description}
                                </p>
                            )}
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={vehicleForm.processing}
                            >
                                <Plus />
                                {editingVehicle
                                    ? 'Save changes'
                                    : 'Add vehicle'}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Vehicle maintenance report */}
            <Dialog
                open={reportOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        setReportOpen(false);
                    }
                }}
            >
                <DialogContent className="sm:max-w-3xl">
                    {report === null ? (
                        <>
                            <DialogHeader>
                                <DialogTitle>
                                    Generate vehicle maintenance report
                                </DialogTitle>
                                <DialogDescription>
                                    Choose a vehicle and period to summarize.
                                </DialogDescription>
                            </DialogHeader>
                            <form
                                className="grid gap-4"
                                onSubmit={(event: FormEvent) => {
                                    event.preventDefault();
                                    generateReport();
                                }}
                            >
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="report-vehicle">
                                            Vehicle
                                        </Label>
                                        <Select
                                            value={reportForm.fleet_vehicle_id}
                                            onValueChange={(value) =>
                                                setReportForm((state) => ({
                                                    ...state,
                                                    fleet_vehicle_id: value,
                                                }))
                                            }
                                        >
                                            <SelectTrigger
                                                id="report-vehicle"
                                                className="w-full"
                                            >
                                                <SelectValue placeholder="Select a vehicle" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {vehicle_options.map(
                                                    (option) => (
                                                        <SelectItem
                                                            key={option.id}
                                                            value={String(
                                                                option.id,
                                                            )}
                                                        >
                                                            {option.name}
                                                            {option.plate
                                                                ? ` · ${option.plate}`
                                                                : ''}
                                                        </SelectItem>
                                                    ),
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div />
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="report-start">
                                            Start date
                                        </Label>
                                        <DatePicker
                                            id="report-start"
                                            value={reportForm.start_date}
                                            onChange={(value) =>
                                                setReportForm((state) => ({
                                                    ...state,
                                                    start_date: value,
                                                }))
                                            }
                                            placeholder="mm/dd/yyyy"
                                        />
                                    </div>
                                    <div className="grid gap-1.5">
                                        <Label htmlFor="report-end">
                                            End date
                                        </Label>
                                        <DatePicker
                                            id="report-end"
                                            value={reportForm.end_date}
                                            onChange={(value) =>
                                                setReportForm((state) => ({
                                                    ...state,
                                                    end_date: value,
                                                }))
                                            }
                                            placeholder="mm/dd/yyyy"
                                        />
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    The report will include all recorded
                                    maintenance for the selected vehicle and
                                    period, including mileage, provider, cost,
                                    and next-service information.
                                </p>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button type="button" variant="outline">
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        type="submit"
                                        disabled={
                                            !reportForm.fleet_vehicle_id ||
                                            (reportForm.start_date !== '' &&
                                                reportForm.end_date !== '' &&
                                                reportForm.start_date >
                                                    reportForm.end_date)
                                        }
                                    >
                                        <FileText />
                                        Generate report
                                    </Button>
                                </DialogFooter>
                            </form>
                        </>
                    ) : (
                        <>
                            <DialogHeader>
                                <DialogTitle>
                                    Vehicle maintenance report
                                </DialogTitle>
                                <DialogDescription>
                                    {report.vehicle.name}
                                    {' · '}
                                    {report.start_date
                                        ? formatDate(report.start_date)
                                        : 'All time'}
                                    {report.end_date
                                        ? ` to ${formatDate(report.end_date)}`
                                        : ''}
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                    <p className="text-sm text-muted-foreground">
                                        {report.items.length}{' '}
                                        {report.items.length === 1
                                            ? 'service record'
                                            : 'service records'}
                                    </p>
                                    <p className="text-sm font-medium">
                                        Total:{' '}
                                        {formatMoney(
                                            report.items.reduce(
                                                (total, item) =>
                                                    total +
                                                    Number(
                                                        item.total_cost || 0,
                                                    ),
                                                0,
                                            ),
                                        )}
                                    </p>
                                </div>
                                {report.items.length === 0 ? (
                                    <div className="flex flex-col items-center gap-2 py-12 text-center">
                                        <Wrench className="size-8 text-muted-foreground" />
                                        <p className="font-medium">
                                            No maintenance records found
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Nothing was recorded for this
                                            vehicle and period.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto rounded-lg border border-border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>
                                                        Service date
                                                    </TableHead>
                                                    <TableHead>
                                                        Maintenance
                                                    </TableHead>
                                                    <TableHead>
                                                        Mileage
                                                    </TableHead>
                                                    <TableHead>
                                                        Provider
                                                    </TableHead>
                                                    <TableHead>Cost</TableHead>
                                                    <TableHead>
                                                        Next service
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {report.items.map((record) => (
                                                    <TableRow key={record.id}>
                                                        <TableCell>
                                                            {formatDate(
                                                                record.service_date,
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {maintenanceTypeLabel(
                                                                record.maintenance_type,
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {formatMileage(
                                                                record.vehicle_mileage,
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {record.service_provider ??
                                                                '—'}
                                                        </TableCell>
                                                        <TableCell>
                                                            {formatMoney(
                                                                record.total_cost,
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            {formatDate(
                                                                record.next_service_date,
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                                <DialogFooter>
                                    {report.items.length > 0 && (
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                printMaintenanceReport(report)
                                            }
                                        >
                                            <Printer />
                                            Export PDF
                                        </Button>
                                    )}
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setReport(null)}
                                    >
                                        New report
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setReportOpen(false)}
                                    >
                                        Close
                                    </Button>
                                </DialogFooter>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Maintenance record details */}
            <Dialog
                open={detailsTarget !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setDetailsTarget(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Maintenance details</DialogTitle>
                        <DialogDescription>
                            {detailsTarget?.vehicle?.name ?? 'Vehicle'}
                            {' · '}
                            {detailsTarget
                                ? maintenanceTypeLabel(
                                      detailsTarget.maintenance_type,
                                  )
                                : ''}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-muted-foreground">
                                    Service date
                                </p>
                                <p className="font-medium">
                                    {formatDate(
                                        detailsTarget?.service_date ?? null,
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">
                                    Maintenance type
                                </p>
                                <p className="font-medium">
                                    {detailsTarget
                                        ? maintenanceTypeLabel(
                                              detailsTarget.maintenance_type,
                                          )
                                        : '—'}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">
                                    Vehicle mileage
                                </p>
                                <p className="font-medium">
                                    {formatMileage(
                                        detailsTarget?.vehicle_mileage,
                                    )}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">
                                    Service provider
                                </p>
                                <p className="font-medium">
                                    {detailsTarget?.service_provider ?? '—'}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">
                                    Total cost
                                </p>
                                <p className="font-medium">
                                    {formatMoney(detailsTarget?.total_cost)}
                                </p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">
                                    Next service date
                                </p>
                                <p className="font-medium">
                                    {formatDate(
                                        detailsTarget?.next_service_date ??
                                            null,
                                    )}
                                </p>
                            </div>
                        </div>
                        {detailsTarget?.notes ? (
                            <div className="text-sm">
                                <p className="mb-1 text-muted-foreground">
                                    Notes
                                </p>
                                <p className="rounded-md border border-border bg-muted/50 p-3">
                                    {detailsTarget.notes}
                                </p>
                            </div>
                        ) : null}
                        {detailsTarget && detailsTarget.documents.length > 0 ? (
                            <div className="grid gap-2">
                                <p className="text-sm text-muted-foreground">
                                    Receipts
                                </p>
                                <ul className="flex flex-col gap-2">
                                    {detailsTarget.documents.map((doc) => (
                                        <li
                                            key={doc.id}
                                            className="flex items-center gap-2 rounded-md border border-border p-3"
                                        >
                                            <FileText className="size-4 shrink-0 text-muted-foreground" />
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm">
                                                    <a
                                                        href={vehiclesRoutes.maintenance.documents.show.url(
                                                            {
                                                                record: detailsTarget.id,
                                                                document:
                                                                    doc.id,
                                                            },
                                                        )}
                                                        className="hover:underline"
                                                    >
                                                        {doc.file_name}
                                                    </a>
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {formatFileSize(
                                                        doc.file_size,
                                                    )}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ) : null}
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    Close
                                </Button>
                            </DialogClose>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete record confirm */}
            <Dialog
                open={deleteRecordTarget !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteRecordTarget(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Remove maintenance record?</DialogTitle>
                        <DialogDescription>
                            The record and its stored receipts will be deleted.
                            This cannot be undone.
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
                            onClick={confirmDeleteRecord}
                        >
                            <Trash2 />
                            Remove record
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete vehicle confirm */}
            <Dialog
                open={deleteVehicleTarget !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteVehicleTarget(null);
                    }
                }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Delete this vehicle?</DialogTitle>
                        <DialogDescription>
                            All of {deleteVehicleTarget?.name ?? 'this vehicle'}{' '}
                            maintenance records will be removed too. This cannot
                            be undone.
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
                            onClick={confirmDeleteVehicle}
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

DashboardVehicles.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'Vehicle Maintenance',
            href: dashboardVehicles(),
        },
    ],
};
