import { formatDate, formatMoney } from '@/lib/bookings';
import type {
    VehicleMaintenanceRecord,
    VehicleOption,
} from '@/types/dashboard';

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

export function formatMileage(
    value: number | string | null | undefined,
): string {
    const amount = Number(value ?? 0);

    return Number.isFinite(amount) ? amount.toLocaleString('en-US') : '—';
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

type MaintenanceReportData = {
    vehicle: VehicleOption;
    start_date: string;
    end_date: string;
    items: VehicleMaintenanceRecord[];
};

function escapeHtml(value: string): string {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}

/**
 * Open a print window with the report rendered as a standalone document so the
 * admin can save it as a PDF. No PDF dependency is required.
 */
export function printMaintenanceReport(report: MaintenanceReportData): void {
    const period = `${report.start_date ? formatDate(report.start_date) : 'All time'}${
        report.end_date ? ` to ${formatDate(report.end_date)}` : ''
    }`;
    const total = report.items.reduce(
        (sum, item) => sum + Number(item.total_cost || 0),
        0,
    );
    const rows = report.items
        .map(
            (item) =>
                `<tr>` +
                [
                    formatDate(item.service_date),
                    maintenanceTypeLabel(item.maintenance_type),
                    formatMileage(item.vehicle_mileage),
                    item.service_provider ?? '',
                    formatMoney(item.total_cost),
                    formatDate(item.next_service_date),
                ]
                    .map((cell) => `<td>${escapeHtml(cell)}</td>`)
                    .join('') +
                `</tr>`,
        )
        .join('');

    const win = window.open('', '_blank', 'width=900,height=680');

    if (!win) {
        return;
    }

    win.document.write(`<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Vehicle maintenance report</title>
<style>
    * { box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #0f172a; margin: 32px; }
    h1 { font-size: 20px; margin: 0 0 4px; }
    .subtitle { color: #475569; font-size: 13px; margin: 0 0 24px; }
    table { width: 100%; border-collapse: collapse; font-size: 13px; }
    th, td { text-align: left; padding: 8px 10px; border-bottom: 1px solid #e2e8f0; }
    th { background: #f1f5f9; font-weight: 600; }
    tr:last-child td { border-bottom: none; }
    .total { display: flex; justify-content: flex-end; gap: 8px; margin-top: 16px; font-size: 14px; }
    .total strong { font-weight: 600; }
</style>
</head>
<body>
    <h1>Vehicle maintenance report</h1>
    <p class="subtitle">${escapeHtml(report.vehicle.name)} · ${escapeHtml(period)} · Generated ${escapeHtml(new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeStyle: 'short' }).format(new Date()))}</p>
    <table>
        <thead>
            <tr>
                <th>Service date</th>
                <th>Maintenance</th>
                <th>Mileage</th>
                <th>Provider</th>
                <th>Cost</th>
                <th>Next service</th>
            </tr>
        </thead>
        <tbody>${rows}</tbody>
    </table>
    <div class="total"><strong>Total:</strong> <span>${escapeHtml(formatMoney(total))}</span></div>
</body>
</html>`);

    win.document.close();
    win.focus();

    window.setTimeout(() => {
        if (win && !win.closed) {
            win.print();
        }
    }, 250);
}
