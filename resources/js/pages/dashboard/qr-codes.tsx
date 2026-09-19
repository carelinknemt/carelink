import { Head } from '@inertiajs/react';
import { Download, Loader2, QrCode, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { qrFileName, renderQrCode } from '@/lib/qr-code';
import { dashboard } from '@/routes';
import { qrCodes as qrCodesRoute } from '@/routes/dashboard';

type GeneratedCode = {
    id: number;
    label: string;
    link: string;
    fileName: string;
    dataUrl: string;
};

function normalizeLink(value: string): string | null {
    const trimmed = value.trim();

    if (!trimmed) {
        return null;
    }

    try {
        const url = new URL(
            trimmed.includes('://') ? trimmed : `https://${trimmed}`,
        );

        if (url.protocol !== 'http:' && url.protocol !== 'https:') {
            return null;
        }

        return url.toString();
    } catch {
        return null;
    }
}

export default function DashboardQrCodes() {
    const [label, setLabel] = useState('');
    const [link, setLink] = useState('');
    const [linkError, setLinkError] = useState<string | null>(null);
    const [generating, setGenerating] = useState(false);
    const [codes, setCodes] = useState<GeneratedCode[]>([]);

    async function handleGenerate(event: FormEvent) {
        event.preventDefault();

        const normalized = normalizeLink(link);

        if (normalized === null) {
            setLinkError(
                'Enter a valid link, for example https://carelink.com',
            );

            return;
        }

        setLinkError(null);
        setGenerating(true);

        try {
            const dataUrl = await renderQrCode(normalized);
            const fallback = new URL(normalized).hostname;

            setCodes((current) => [
                {
                    id: Date.now(),
                    label: label.trim() || fallback,
                    link: normalized,
                    fileName: qrFileName(label, fallback),
                    dataUrl,
                },
                ...current,
            ]);

            setLabel('');
            setLink('');
            toast.success('QR code generated.');
        } catch {
            toast.error('Could not generate the QR code.');
        } finally {
            setGenerating(false);
        }
    }

    function removeCode(id: number) {
        setCodes((current) => current.filter((code) => code.id !== id));
    }

    return (
        <>
            <Head title="QR Codes">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-1 flex-col gap-4 p-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        QR Codes
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Generate branded QR codes for any link and download them
                        as PNG images.
                    </p>
                </div>

                <Card>
                    <CardContent className="p-4">
                        <form onSubmit={handleGenerate} className="grid gap-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="grid gap-1.5">
                                    <Label htmlFor="qr-label">
                                        Label (optional)
                                    </Label>
                                    <Input
                                        id="qr-label"
                                        type="text"
                                        placeholder="e.g. Google Play listing"
                                        value={label}
                                        onChange={(event) =>
                                            setLabel(event.target.value)
                                        }
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Used as the download file name.
                                    </p>
                                </div>

                                <div className="grid gap-1.5">
                                    <Label htmlFor="qr-link">Link</Label>
                                    <Input
                                        id="qr-link"
                                        type="text"
                                        placeholder="https://example.com/page"
                                        required
                                        value={link}
                                        onChange={(event) => {
                                            setLink(event.target.value);

                                            if (linkError !== null) {
                                                setLinkError(null);
                                            }
                                        }}
                                        aria-invalid={linkError !== null}
                                    />
                                    {linkError !== null && (
                                        <p className="text-xs font-medium text-destructive">
                                            {linkError}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div>
                                <Button
                                    type="submit"
                                    className="bg-[#004B87] text-white shadow-md hover:bg-[#003865]"
                                    disabled={generating}
                                >
                                    {generating && (
                                        <Loader2 className="animate-spin" />
                                    )}
                                    {!generating && <QrCode />}
                                    {generating
                                        ? 'Generating…'
                                        : 'Generate QR code'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {codes.length === 0 ? (
                    <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
                        Generated QR codes will appear here so you can download
                        them.
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {codes.map((code) => (
                            <Card key={code.id}>
                                <CardContent className="grid gap-3 p-4">
                                    <div className="flex justify-center rounded-xl border p-3">
                                        <img
                                            src={code.dataUrl}
                                            alt={`QR code for ${code.label}`}
                                            className="size-[220px]"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold">
                                            {code.label}
                                        </p>
                                        <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                            {code.link}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            asChild
                                            className="flex-1 bg-[#004B87] text-white shadow-md hover:bg-[#003865]"
                                        >
                                            <a
                                                href={code.dataUrl}
                                                download={code.fileName}
                                            >
                                                <Download />
                                                Download
                                            </a>
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="icon"
                                            onClick={() => removeCode(code.id)}
                                            aria-label={`Remove ${code.label}`}
                                        >
                                            <Trash2 />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

DashboardQrCodes.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
        {
            title: 'QR Codes',
            href: qrCodesRoute(),
        },
    ],
};
