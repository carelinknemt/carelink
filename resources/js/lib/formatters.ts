export const getStatusBadgeColor = (status: string): string => {
    switch (status.toUpperCase()) {
        case 'COMPLETED':
        case 'ACTIVE':
        case 'CONFIRMED':
            return 'bg-emerald-50 text-emerald-700 border-emerald-200';
        case 'BAMBI_DISPATCHED':
        case 'IN_TRANSIT':
        case 'IN ROUTE':
        case 'IN PROGRESS':
            return 'bg-cyan-50 text-cyan-700 border-cyan-200';
        case 'PENDING':
        case 'PENDING_DISPATCH':
        case 'SCHEDULED':
            return 'bg-amber-50 text-amber-700 border-amber-200';
        case 'MAINTENANCE':
        case 'CANCELLED':
            return 'bg-rose-50 text-rose-700 border-rose-200';
        default:
            return 'bg-slate-50 text-slate-600 border-slate-200';
    }
};
