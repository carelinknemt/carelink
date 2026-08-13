import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface CopyButtonProps {
    value: string;
    label?: string;
    className?: string;
}

export function CopyButton({ value, label, className }: CopyButtonProps) {
    const [copied, setCopied] = useState(false);

    async function copy() {
        try {
            await navigator.clipboard.writeText(value);
            setCopied(true);
            toast.success(`${label ?? value} copied to clipboard.`);
            window.setTimeout(() => setCopied(false), 1500);
        } catch {
            toast.error('Could not copy to clipboard.');
        }
    }

    return (
        <button
            type="button"
            onClick={() => void copy()}
            aria-label={`Copy ${label ?? value}`}
            className={`inline-flex size-5 shrink-0 items-center justify-center rounded text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 ${className ?? ''}`}
        >
            {copied ? (
                <Check className="size-3.5 text-emerald-600" />
            ) : (
                <Copy className="size-3.5" />
            )}
        </button>
    );
}