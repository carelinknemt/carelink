import { Head } from '@inertiajs/react';
import ServiceRatesEditor from '@/components/carelink/admin/service-rates-editor';
import { services as servicesUrl } from '@/routes/admin';
import type { TransportService } from '@/types/carelink';

interface ServicesProps {
    services: TransportService[];
}

export default function Services({ services }: ServicesProps) {
    return (
        <>
            <Head title="Service Rates">
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="flex flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight">
                        Service Rates
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Manage base dispatch fees and per-mile charges for
                        Humboldt County
                    </p>
                </div>

                <ServiceRatesEditor services={services} />
            </div>
        </>
    );
}

Services.layout = {
    breadcrumbs: [
        {
            title: 'Service Rates',
            href: servicesUrl(),
        },
    ],
};
