export const MAINTENANCE_TYPE_OPTIONS = [
    { value: 'oil_change', label: 'Oil change' },
    { value: 'tire_rotation', label: 'Tire rotation' },
    { value: 'brake_service', label: 'Brake service' },
    { value: 'fluid_check', label: 'Fluid check' },
    { value: 'battery', label: 'Battery service' },
    { value: 'inspection', label: 'Inspection' },
    { value: 'filter_replacement', label: 'Filter replacement' },
    { value: 'other', label: 'Other' },
] as const;

export function maintenanceTypeLabel(type: string): string {
    return (
        MAINTENANCE_TYPE_OPTIONS.find((option) => option.value === type)
            ?.label ?? type
    );
}

export const VEHICLE_TYPE_OPTIONS = [
    { value: 'AMBULATORY', label: 'Ambulatory Sedan' },
    { value: 'WHEELCHAIR', label: 'Wheelchair Van' },
    { value: 'GURNEY', label: 'Gurney Van' },
    { value: 'TRANSIT_SHUTTLE', label: 'Transit Shuttle' },
] as const;

export function vehicleTypeLabel(type: string): string {
    return (
        VEHICLE_TYPE_OPTIONS.find((option) => option.value === type)?.label ??
        type
    );
}

export function formatMileage(value: number | string | null | undefined): string {
    const amount = Number(value ?? 0);

    return Number.isFinite(amount)
        ? amount.toLocaleString('en-US')
        : '—';
}

export function formatFileSize(bytes: number | null | undefined): string {
    const size = Number(bytes ?? 0);

    if (!Number.isFinite(size) || size <= 0) {
        return '';
    }

    if (size < 1024) {
        return `${size} B`;
    }

    if (size < 1024 * 1024) {
        return `${Math.round(size / 1024)} KB`;
    }

    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}