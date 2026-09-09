import {
    BookOpen,
    Briefcase,
    CalendarCheck,
    CreditCard,
    Handshake,
    LayoutGrid,
    MessageSquareText,
    Rocket,
    ShieldOff,
    Users,
    Wrench,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export const KMS_CATEGORY_ICONS: Record<string, LucideIcon> = {
    'getting-started': Rocket,
    'trips-bookings': CalendarCheck,
    'blacklisted-passengers': ShieldOff,
    payments: CreditCard,
    recruitment: Briefcase,
    'business-partners': Handshake,
    users: Users,
    'vehicle-maintenance': Wrench,
    'contact-messages': MessageSquareText,
    'website-content': LayoutGrid,
    'knowledge-base': BookOpen,
};
