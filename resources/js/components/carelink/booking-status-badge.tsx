import { Badge } from '@/components/ui/badge';
import { statusBadgeClass, statusLabel } from '@/lib/bookings';

export function BookingStatusBadge({ status }: { status: string }) {
    return (
        <Badge variant="outline" className={statusBadgeClass(status)}>
            {statusLabel(status)}
        </Badge>
    );
}
