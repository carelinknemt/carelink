export function formatDate(date: string | null | undefined): string {
    if (!date) {
        return '—';
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    }).format(new Date(date));
}

export function formatDateTime(date: string | null | undefined): string {
    if (!date) {
        return '—';
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(new Date(date));
}

export function formatMoney(value: string | number | null | undefined): string {
    const amount = Number(value ?? 0);

    return Number.isFinite(amount) ? `$${amount.toFixed(2)}` : '—';
}

export function statusLabel(status: string): string {
    return status.replaceAll('_', ' ');
}

export const STATUS_BADGE_CLASSES: Record<string, string> = {
    COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    BAMBI_DISPATCHED: 'bg-violet-50 text-violet-700 border-violet-200',
    IN_TRANSIT: 'bg-[#22d3ee]/10 text-[#0e7490] border-[#22d3ee]/40',
    PENDING_DISPATCH: 'bg-amber-50 text-amber-700 border-amber-200',
    CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200',
    APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
};

export function statusBadgeClass(status: string): string {
    return (
        STATUS_BADGE_CLASSES[status] ??
        'bg-slate-50 text-slate-600 border-slate-200'
    );
}
