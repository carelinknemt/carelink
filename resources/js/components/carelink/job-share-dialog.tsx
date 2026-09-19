import { Check, Copy, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { qrFileName, renderQrCode } from '@/lib/qr-code';

interface JobShareDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    url: string;
}

export function JobShareDialog({
    open,
    onOpenChange,
    title,
    url,
}: JobShareDialogProps) {
    const [dataUrl, setDataUrl] = useState<string | null>(null);
    const [renderError, setRenderError] = useState(false);
    const [copied, setCopied] = useState(false);

    const absoluteUrl =
        typeof window === 'undefined'
            ? url
            : new URL(url, window.location.origin).toString();

    useEffect(() => {
        if (!open || !url) {
            return;
        }

        let cancelled = false;

        async function render() {
            const dataUrl = await renderQrCode(absoluteUrl);

            if (!cancelled) {
                setDataUrl(dataUrl);
            }
        }

        render().catch(() => {
            if (!cancelled) {
                setRenderError(true);
            }
        });

        return () => {
            cancelled = true;
        };
    }, [open, url, absoluteUrl]);

    const fileName = qrFileName(title, 'job');

    async function copyLink() {
        try {
            await navigator.clipboard.writeText(absoluteUrl);
            setCopied(true);
            toast.success('Link copied to clipboard.');
            window.setTimeout(() => setCopied(false), 1500);
        } catch {
            toast.error('Could not copy the link.');
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        Scan the QR code or copy the link to open this job
                        opening's application form.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex justify-center">
                    <div className="rounded-xl border p-3">
                        {dataUrl ? (
                            <img
                                src={dataUrl}
                                alt={`QR code for ${title}`}
                                className="size-[240px]"
                            />
                        ) : (
                            <div className="size-[240px] animate-pulse rounded-md bg-slate-100" />
                        )}
                    </div>
                </div>

                {renderError && (
                    <p className="text-center text-xs font-semibold text-destructive">
                        Could not generate the QR code. Try the copy link option
                        instead.
                    </p>
                )}

                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        readOnly
                        value={absoluteUrl}
                        aria-label="Shareable link"
                        className="h-9 min-w-0 flex-1 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => void copyLink()}
                        aria-label="Copy link"
                    >
                        {copied ? (
                            <Check className="text-emerald-600" />
                        ) : (
                            <Copy />
                        )}
                    </Button>
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="ghost">
                            Close
                        </Button>
                    </DialogClose>
                    <Button
                        asChild
                        className={`bg-[#004B87] text-white shadow-md hover:bg-[#003865] ${
                            dataUrl ? '' : 'pointer-events-none opacity-50'
                        }`}
                    >
                        <a
                            href={dataUrl ?? '#'}
                            download={fileName}
                            aria-disabled={!dataUrl}
                            onClick={(event) => {
                                if (!dataUrl) {
                                    event.preventDefault();
                                }
                            }}
                        >
                            <Download />
                            Download QR code
                        </a>
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
