import { Check, Copy, Download } from 'lucide-react';
import { toCanvas } from 'qrcode';
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

interface JobShareDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    url: string;
}

const QR_SIZE = 480;
const LOGO_PATH = '/images/qrlogo.jpeg';

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => reject(new Error(`Could not load ${src}`));
        image.src = src;
    });
}

function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: number,
): void {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
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

    useEffect(() => {
        if (!open || !url) {
            return;
        }

        let cancelled = false;

        async function render() {
            const canvas = document.createElement('canvas');

            await toCanvas(canvas, url, {
                width: QR_SIZE,
                margin: 2,
                errorCorrectionLevel: 'H',
            });

            const ctx = canvas.getContext('2d');

            if (!ctx) {
                throw new Error('2D canvas context unavailable');
            }

            try {
                const logo = await loadImage(LOGO_PATH);
                const box = QR_SIZE * 0.22;
                const boxX = (QR_SIZE - box) / 2;
                const boxY = (QR_SIZE - box) / 2;

                ctx.fillStyle = '#ffffff';
                roundRect(ctx, boxX, boxY, box, box, 12);
                ctx.fill();

                const logoMax = box * 0.72;
                const scale = Math.min(
                    logoMax / logo.width,
                    logoMax / logo.height,
                );
                const logoWidth = logo.width * scale;
                const logoHeight = logo.height * scale;
                ctx.drawImage(
                    logo,
                    (QR_SIZE - logoWidth) / 2,
                    (QR_SIZE - logoHeight) / 2,
                    logoWidth,
                    logoHeight,
                );
            } catch {
                // A plain QR without the logo is still valid.
            }

            if (!cancelled) {
                setDataUrl(canvas.toDataURL('image/png'));
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
    }, [open, url]);

    const fileName = `${
        title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '') || 'job'
    }-qr.png`;

    async function copyLink() {
        try {
            await navigator.clipboard.writeText(url);
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
                        value={url}
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
                        className={
                            dataUrl ? '' : 'pointer-events-none opacity-50'
                        }
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
