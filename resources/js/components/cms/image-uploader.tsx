import { Loader2, Upload, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { store as uploadImage } from '@/routes/cms/images';

interface CmsImageUploaderProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
    compact?: boolean;
}

/**
 * Upload an image for a CMS field: posts the file to cms.images.store and
 * puts the returned /storage URL into the field, while still allowing a URL
 * to be pasted directly as a fallback.
 */
export default function CmsImageUploader({
    value,
    onChange,
    label = 'Image',
    compact = false,
}: CmsImageUploaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFile = async (file: File | undefined | null) => {
        if (!file) {
            return;
        }

        setUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('image', file);

        const xsrfToken = document.cookie
            .split('; ')
            .find((cookie) => cookie.startsWith('XSRF-TOKEN='))
            ?.split('=')[1];

        try {
            const response = await fetch(uploadImage.url(), {
                method: 'POST',
                credentials: 'same-origin',
                headers: xsrfToken
                    ? { 'X-XSRF-TOKEN': decodeURIComponent(xsrfToken) }
                    : undefined,
                body: formData,
            });

            const payload = (await response.json()) as
                | {
                      url?: string;
                      errors?: { image?: string[] };
                  }
                | undefined;

            if (!response.ok || !payload?.url) {
                throw new Error(
                    payload?.errors?.image?.[0] ?? 'Upload failed.',
                );
            }

            onChange(payload.url);
            toast.success('Image uploaded.');
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Upload failed. Check the file type and size, then try again.',
            );
        } finally {
            setUploading(false);

            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className={cn('grid gap-1.5', compact && 'gap-1')}>
            {!compact && <Label>{label}</Label>}

            <div className="flex items-center gap-3">
                {value ? (
                    <img
                        src={value}
                        alt={label}
                        referrerPolicy="no-referrer"
                        className={cn(
                            'shrink-0 rounded-lg border border-slate-200 object-cover',
                            compact ? 'h-10 w-10' : 'h-14 w-20',
                        )}
                    />
                ) : (
                    <span
                        className={cn(
                            'flex shrink-0 items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 text-slate-400',
                            compact ? 'h-10 w-10' : 'h-14 w-20',
                        )}
                    >
                        <Upload className={compact ? 'h-4 w-4' : 'h-5 w-5'} />
                    </span>
                )}

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
                    className="hidden"
                    onChange={(event) =>
                        void handleFile(event.target.files?.[0])
                    }
                />

                <div className="flex flex-wrap items-center gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <Loader2 className="size-3.5 animate-spin" />
                        ) : (
                            <Upload className="size-3.5" />
                        )}
                        {uploading
                            ? 'Uploading...'
                            : value
                              ? 'Replace image'
                              : 'Upload image'}
                    </Button>

                    {value && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => onChange('')}
                            disabled={uploading}
                        >
                            <X className="size-3.5" />
                            Remove
                        </Button>
                    )}
                </div>
            </div>

            <Input
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="…or paste an image URL"
                className={cn('bg-white', compact && 'text-xs')}
            />

            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}
