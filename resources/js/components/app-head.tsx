import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

interface AppHeadProps {
    title?: string;
    children?: ReactNode;
}

export default function AppHead({ title, children }: AppHeadProps) {
    return (
        <Head title={title}>
            {children}
        </Head>
    );
}
