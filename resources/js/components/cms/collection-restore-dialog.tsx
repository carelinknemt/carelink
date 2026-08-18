import { router } from '@inertiajs/react';
import { useState } from 'react';
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

interface CollectionRestoreDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    label: string;
    url: string;
}

/**
 * Confirm dialog for resetting a CMS collection back to its default rows.
 * Posts to the passed restore URL and lets the admin layout toast the
 * flash message.
 */
export default function CollectionRestoreDialog({
    open,
    onOpenChange,
    label,
    url,
}: CollectionRestoreDialogProps) {
    const [processing, setProcessing] = useState(false);

    const confirm = () => {
        setProcessing(true);

        router.post(
            url,
            {},
            {
                preserveScroll: true,
                onSuccess: () => onOpenChange(false),
                onFinish: () => setProcessing(false),
            },
        );
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (!next) {
                    onOpenChange(false);
                }
            }}
        >
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Restore {label}?</DialogTitle>
                    <DialogDescription>
                        Replace the current {label.toLowerCase()} with the
                        default version. Any added or edited items will be
                        removed. This cannot be undone.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="button"
                        variant="destructive"
                        disabled={processing}
                        onClick={confirm}
                    >
                        Restore defaults
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
