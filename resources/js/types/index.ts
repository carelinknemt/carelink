export type * from './auth';
export type * from './navigation';
export type * from './ui';

import type { Auth } from './auth';

export type SharedData = {
    name: string;
    auth: Auth;
    sidebarOpen: boolean;
    flash: {
        toast: {
            type: 'success' | 'info' | 'warning' | 'error';
            message: string;
        } | null;
    };
    [key: string]: unknown;
};
