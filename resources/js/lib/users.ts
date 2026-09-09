import { ShieldCheck } from 'lucide-react';

export const ROLE_OPTIONS = [    {
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

export const DOCUMENT_TYPE_OPTIONS = [
    { value: 'license', label: 'License' },
    { value: 'cpr_certificate', label: 'CPR certificate' },
    { value: 'mvr', label: 'MVR' },
    { value: 'first_aid_certificate', label: 'First aid certificate' },
    { value: 'custom', label: 'Other' },
] as const;

export function documentTypeLabel(type: string): string {
    return (
        DOCUMENT_TYPE_OPTIONS.find((d) => d.value === type)?.label ?? 'Other'
    );
}
