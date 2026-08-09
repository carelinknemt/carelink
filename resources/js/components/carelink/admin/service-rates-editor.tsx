import { router } from '@inertiajs/react';
import { Calculator, DollarSign, RotateCcw, Save } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { updateRates } from '@/routes/admin/services';
import type { TransportService } from '@/types/carelink';

interface ServiceRatesEditorProps {
    services: TransportService[];
}

type RateEdits = Record<number, { base_rate: string; mileage_rate: string }>;

const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

export default function ServiceRatesEditor({ services }: ServiceRatesEditorProps) {
    const [initialRates] = useState<RateEdits>(() =>
        Object.fromEntries(
            services.map((s) => [s.id, { base_rate: s.base_rate, mileage_rate: s.mileage_rate }])
        )
    );
    const [rateEdits, setRateEdits] = useState<RateEdits>(initialRates);
    const [estimateServiceId, setEstimateServiceId] = useState<string>(() => String(services[0]?.id ?? ''));
    const [estimateMiles, setEstimateMiles] = useState('12');
    const [isRoundTrip, setIsRoundTrip] = useState(true);

    const dirty = useMemo(() => {
        return services.some((s) => {
            const current = rateEdits[s.id];

            return current && (current.base_rate !== initialRates[s.id]?.base_rate || current.mileage_rate !== initialRates[s.id]?.mileage_rate);
        });
    }, [rateEdits, initialRates, services]);

    const invalid = useMemo(() => {
        return services.some((s) => {
            const current = rateEdits[s.id];

            return !current || Number.isNaN(Number(current.base_rate)) || Number(current.base_rate) < 0 || Number.isNaN(Number(current.mileage_rate)) || Number(current.mileage_rate) < 0;
        });
    }, [rateEdits, services]);

    const handleRateChange = (id: number, field: 'base_rate' | 'mileage_rate', val: string) => {
        setRateEdits((prev) => ({ ...prev, [id]: { ...prev[id], [field]: val } }));
    };

    const handleReset = () => {
        setRateEdits(initialRates);
    };

    const handleSave = () => {
        const payload = Object.entries(rateEdits).map(([id, rates]) => ({
            id: Number(id),
            base_rate: Number(rates.base_rate),
            mileage_rate: Number(rates.mileage_rate),
        }));

        router.put(
            updateRates().url,
            { services: payload },
            {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Service rates updated successfully in live dispatch calculator!');
                },
            }
        );
    };

    const estimateService = services.find((s) => String(s.id) === estimateServiceId) ?? services[0];
    const miles = Number(estimateMiles);
    const milesValid = !Number.isNaN(miles) && miles >= 0;

    const estimate = estimateService && milesValid
        ? {
              base: Number(rateEdits[estimateService.id]?.base_rate ?? estimateService.base_rate),
              perMile: Number(rateEdits[estimateService.id]?.mileage_rate ?? estimateService.mileage_rate),
              subtotal: Number(rateEdits[estimateService.id]?.base_rate ?? estimateService.base_rate) + Number(rateEdits[estimateService.id]?.mileage_rate ?? estimateService.mileage_rate) * miles,
          }
        : null;

    const estimateTotal = estimate && milesValid ? estimate.subtotal * (isRoundTrip ? 2 : 1) : null;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-semibold tracking-tight">
                        <DollarSign className="h-5 w-5 text-emerald-600" />
                        Base Fee & Per-Mile Matrix
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        These rates power the live dispatch pricing calculator on the public site
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={handleReset} disabled={!dirty}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Reset
                    </Button>
                    <Button onClick={handleSave} disabled={!dirty || invalid}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                    </Button>
                </div>
            </div>

            {invalid && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm font-medium text-destructive">
                    One or more rates are invalid. Enter non-negative numbers before saving.
                </div>
            )}

            <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
                <Card className="xl:col-span-2">
                    <CardHeader>
                        <CardTitle className="text-base">Rate Matrix</CardTitle>
                        <CardDescription>Edit base dispatch fees and per-mile charges per service</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto rounded-xl border border-sidebar-border/70">
                            <table className="w-full text-left text-sm">
                                <thead className="border-b border-sidebar-border/70 bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">Service</th>
                                        <th className="w-40 px-4 py-3 font-medium">Base Fee ($)</th>
                                        <th className="w-40 px-4 py-3 font-medium">Per Mile ($)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sidebar-border/70">
                                    {services.map((srv) => (
                                        <tr key={srv.id} className="transition-colors hover:bg-muted/30">
                                            <td className="px-4 py-3.5">
                                                <div className="font-medium">{srv.title}</div>
                                                <div className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{srv.short_description}</div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        aria-label={`Base fee for ${srv.title}`}
                                                        value={rateEdits[srv.id]?.base_rate ?? srv.base_rate}
                                                        onChange={(e) => handleRateChange(srv.id, 'base_rate', e.target.value)}
                                                        className="h-9 pl-8"
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-4 py-3.5">
                                                <div className="relative">
                                                    <DollarSign className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        step="0.01"
                                                        aria-label={`Per mile rate for ${srv.title}`}
                                                        value={rateEdits[srv.id]?.mileage_rate ?? srv.mileage_rate}
                                                        onChange={(e) => handleRateChange(srv.id, 'mileage_rate', e.target.value)}
                                                        className="h-9 pl-8"
                                                    />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <Card className="h-fit">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Calculator className="h-4 w-4 text-primary" />
                            Live Estimate Preview
                        </CardTitle>
                        <CardDescription>See what a ride would cost with the current rates</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid gap-1.5">
                            <Label htmlFor="estimate-service">Service</Label>
                            <Select value={estimateServiceId} onValueChange={setEstimateServiceId}>
                                <SelectTrigger id="estimate-service">
                                    <SelectValue placeholder="Select a service" />
                                </SelectTrigger>
                                <SelectContent>
                                    {services.map((srv) => (
                                        <SelectItem key={srv.id} value={String(srv.id)}>
                                            {srv.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-1.5">
                            <Label htmlFor="estimate-miles">Trip distance (miles)</Label>
                            <Input
                                id="estimate-miles"
                                type="number"
                                min="0"
                                step="1"
                                value={estimateMiles}
                                onChange={(e) => setEstimateMiles(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox id="estimate-round-trip" checked={isRoundTrip} onCheckedChange={(checked) => setIsRoundTrip(checked === true)} />
                            <Label htmlFor="estimate-round-trip" className="text-sm font-normal">
                                Round trip
                            </Label>
                        </div>

                        <Separator />

                        {estimate && estimateTotal !== null ? (
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Base fee</span>
                                    <span className="font-medium">{currency.format(estimate.base)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">
                                        {miles} mi × {currency.format(estimate.perMile)}
                                    </span>
                                    <span className="font-medium">{currency.format(estimate.perMile * miles)}</span>
                                </div>
                                {isRoundTrip && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">Round trip ×2</span>
                                        <span className="font-medium">{currency.format(estimate.subtotal)}</span>
                                    </div>
                                )}
                                <Separator />
                                <div className="flex items-center justify-between text-base font-semibold">
                                    <span>Estimated total</span>
                                    <span className="text-primary">{currency.format(estimateTotal)}</span>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground">Enter a valid distance to preview the estimated cost.</p>
                        )}

                        {dirty && (
                            <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700">
                                Preview reflects unsaved edits — save to publish them.
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
