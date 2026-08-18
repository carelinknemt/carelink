import type { PageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

interface FlashToast {
    type: 'success' | 'error';
    message: string;
}

interface FlashToastsProps extends PageProps {
    flash?: { toast?: FlashToast };
}

/**
 * Renders the `flash.toast` shared by admin controllers (CMS, dashboard)
 * through sonner, which is mounted in app.tsx.
 */
export default function FlashToasts() {
    const { flash } = usePage<FlashToastsProps>().props;

    useEffect(() => {
        if (!flash?.toast?.message) {
            return;
        }

        if (flash.toast.type === 'error') {
            toast.error(flash.toast.message);
        } else {
            toast.success(flash.toast.message);
        }
    }, [flash]);

    return null;
}
