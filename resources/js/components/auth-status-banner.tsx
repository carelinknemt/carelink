import { CircleCheckBig } from 'lucide-react';

export default function AuthStatusBanner({ message }: { message?: string }) {
    if (!message) {
        return null;
    }

    return (
        <div
            className="flex items-start gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
            role="status"
        >
            <CircleCheckBig className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
            <span>{message}</span>
        </div>
    );
}
