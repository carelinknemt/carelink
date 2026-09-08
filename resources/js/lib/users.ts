import { ShieldCheck } from 'lucide-react';

export const ROLE_OPTIONS = [
    {
        value: 'admin',
        label: 'Admin',
        icon: ShieldCheck,
        color: 'border-violet-200 bg-violet-50 text-violet-700',
    },
    {
        value: 'manager',
        label: 'Manager',
        icon: ShieldCheck,
        color: 'border-sky-200 bg-sky-50 text-sky-700',
    },
    {
        value: 'dispatcher',
        label: 'Dispatcher',
        icon: null,
        color: 'border-slate-200 bg-slate-50 text-slate-700',
    },
] as const;

export function roleBadgeClass(role: string): string {
    return (
        ROLE_OPTIONS.find((r) => r.value === role)?.color ??
        'border-slate-200 bg-slate-50 text-slate-700'
    );
}

export function roleLabel(role: string): string {
    return ROLE_OPTIONS.find((r) => r.value === role)?.label ?? role;
}
