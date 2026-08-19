import {
    BookOpen,
    Briefcase,
    CalendarCheck,
    CreditCard,
    Handshake,
    LayoutGrid,
    Rocket,
    Users,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const KMS_CATEGORY_ICONS: Record<string, LucideIcon> = {
    'getting-started': Rocket,
    'trips-bookings': CalendarCheck,
    payments: CreditCard,
    recruitment: Briefcase,
    'business-partners': Handshake,
    users: Users,
    'website-content': LayoutGrid,
    'knowledge-base': BookOpen,
};
