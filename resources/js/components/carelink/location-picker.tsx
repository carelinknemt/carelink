import { CheckCircle2, Loader2, MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import MapPreview from '@/components/carelink/map-preview';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface GeocodingFeature {
    geometry: { coordinates: [number, number] };
    properties: {
        name?: string;
        street?: string;
        postcode?: string;
        city?: string;
        state?: string;
        country?: string;
    };
}

interface PhotonResponse {
    features: GeocodingFeature[];
}

interface MapboxFeature {
    geometry: { coordinates: [number, number] };
    place_type: string[];
    address?: string;
    text?: string;
    context?: Array<{ id?: string; text?: string }>;
    properties?: {
        name?: string;
        address?: string;
        context?: Record<string, { text?: string }>;
    };
}

interface MapboxResponse {
    features: MapboxFeature[];
}

interface LocationPickerProps {
    id: string;
    value: string;
    onValueChange: (value: string) => void;
    onSelect: (address: string, latitude: number, longitude: number) => void;
}

const PHOTON_ENDPOINT = 'https://photon.komoot.io/api/';

const MAPBOX_ENDPOINT = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const CALIFORNIA_BBOX = '-124.482,32.528,-114.131,42.010';

const MIN_QUERY_LENGTH = 3;

function isInCalifornia(feature: Pick<GeocodingFeature, 'geometry'>): boolean {
    const [longitude, latitude] = feature.geometry.coordinates;

    return (
        latitude >= 32.528 &&
        latitude <= 42.01 &&
        longitude >= -124.482 &&
        longitude <= -114.131
    );
}

function formatAddress(feature: GeocodingFeature): string {
    const { name, street, postcode, city, state, country } = feature.properties;
    const streetLine = [name, street]
        .filter((part) => part !== undefined && part.trim() !== '')
        .join(' ');
    const cityPart = city?.trim();
    const stateZip = [state, postcode]
        .filter((part) => part !== undefined && part.trim() !== '')
        .join(' ');
    const countryPart =
        country?.trim() === 'United States' ? 'USA' : country?.trim();

    return (
        [streetLine, cityPart, stateZip, countryPart]
            .filter((part) => part !== undefined && part !== '')
            .join(', ') || 'Selected location'
    );
}

function dedupeFeatures(features: GeocodingFeature[]): GeocodingFeature[] {
    const seenAddresses = new Set<string>();
    const seenCoordinates = new Set<string>();
    const unique: GeocodingFeature[] = [];

    for (const feature of features) {
        const addressKey = formatAddress(feature)
            .trim()
            .toLowerCase()
            .replace(/\s+/g, ' ');
        const [longitude, latitude] = feature.geometry.coordinates;
        const coordinateKey = `${latitude.toFixed(5)},${longitude.toFixed(5)}`;

        if (
            seenAddresses.has(addressKey) ||
            seenCoordinates.has(coordinateKey)
        ) {
            continue;
        }

        seenAddresses.add(addressKey);
        seenCoordinates.add(coordinateKey);
        unique.push(feature);
    }

    return unique;
}

function mapboxFeatureToGeocodingFeature(
    feature: MapboxFeature,
): GeocodingFeature {
    const isAddress = feature.place_type.includes('address');
    const contextEntries = Array.isArray(feature.context)
        ? feature.context
        : Object.entries(feature.properties?.context ?? {}).map(
              ([id, value]) => ({ id, text: value.text }),
          );

    const contextText = (idPrefix: string): string | undefined =>
        contextEntries.find((entry) => entry.id?.startsWith(idPrefix))?.text;

    const name = feature.properties?.name ?? feature.text;
    const addressNumber = feature.address ?? feature.properties?.address;

    return {
        geometry: { coordinates: feature.geometry.coordinates },
        properties: {
            name:
                isAddress && addressNumber && name
                    ? `${addressNumber} ${name}`.trim()
                    : name,
            postcode: contextText('postcode.'),
            city: contextText('place.') ?? contextText('locality.'),
            state: contextText('region.'),
            country: contextText('country.'),
        },
    };
}

async function searchPhoton(
    query: string,
    signal: AbortSignal,
): Promise<GeocodingFeature[]> {
    const response = await fetch(
        `${PHOTON_ENDPOINT}?q=${encodeURIComponent(query)}&bbox=${CALIFORNIA_BBOX}&limit=6&lang=en`,
        { signal },
    );

    if (!response.ok) {
        throw new Error(`Geocoding request failed: ${response.status}`);
    }

    const data: PhotonResponse = await response.json();

    return dedupeFeatures((data.features ?? []).filter(isInCalifornia)).slice(
        0,
        5,
    );
}

async function searchMapbox(
    query: string,
    signal: AbortSignal,
): Promise<GeocodingFeature[]> {
    if (!MAPBOX_TOKEN) {
        return [];
    }

    const response = await fetch(
        `${MAPBOX_ENDPOINT}/${encodeURIComponent(query)}.json?access_token=${MAPBOX_TOKEN}&bbox=${CALIFORNIA_BBOX}&limit=5&language=en`,
        { signal },
    );

    if (!response.ok) {
        throw new Error(`Mapbox request failed: ${response.status}`);
    }

    const data: MapboxResponse = await response.json();

    return dedupeFeatures(
        (data.features ?? [])
            .filter(isInCalifornia)
            .map(mapboxFeatureToGeocodingFeature),
    ).slice(0, 5);
}

type SearchStatus = 'idle' | 'searching' | 'ok' | 'empty' | 'error';

interface SelectedLocation {
    address: string;
    latitude: number;
    longitude: number;
}

export default function LocationPicker({
    id,
    value,
    onValueChange,
    onSelect,
}: LocationPickerProps) {
    const [results, setResults] = useState<GeocodingFeature[]>([]);
    const [status, setStatus] = useState<SearchStatus>('idle');
    const [open, setOpen] = useState(false);
    const [selectedLocation, setSelectedLocation] =
        useState<SelectedLocation | null>(null);
    const [checkOpen, setCheckOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const suppressSearchRef = useRef(false);

    useEffect(() => {
        const query = value.trim();

        if (suppressSearchRef.current) {
            return;
        }

        if (query.length < MIN_QUERY_LENGTH) {
            setResults([]);
            setStatus('idle');
            setOpen(false);

            return;
        }

        setStatus('searching');
        setOpen(true);

        const controller = new AbortController();
        const timer = window.setTimeout(async () => {
            try {
                const photonResults = await searchPhoton(
                    query,
                    controller.signal,
                );

                if (photonResults.length > 0) {
                    setResults(photonResults);
                    setStatus('ok');

                    return;
                }
            } catch (error: unknown) {
                if ((error as Error).name === 'AbortError') {
                    return;
                }
            }

            try {
                const mapboxResults = await searchMapbox(
                    query,
                    controller.signal,
                );

                if (mapboxResults.length > 0) {
                    setResults(mapboxResults);
                    setStatus('ok');

                    return;
                }

                setResults([]);
                setStatus('empty');
            } catch (error: unknown) {
                if ((error as Error).name === 'AbortError') {
                    return;
                }

                setStatus('error');
            }
        }, 350);

        return () => {
            window.clearTimeout(timer);
            controller.abort();
        };
    }, [value]);

    useEffect(() => {
        if (!open) {
            return;
        }

        const handlePointerDown = (event: MouseEvent) => {
            if (
                containerRef.current &&
                !containerRef.current.contains(event.target as Node)
            ) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handlePointerDown);

        return () =>
            document.removeEventListener('mousedown', handlePointerDown);
    }, [open]);

    const handleSelect = (feature: GeocodingFeature) => {
        const address = formatAddress(feature);
        const [longitude, latitude] = feature.geometry.coordinates;

        suppressSearchRef.current = true;
        onSelect(address, latitude, longitude);
        setSelectedLocation({ address, latitude, longitude });
        setResults([]);
        setStatus('idle');
        setOpen(false);
    };

    return (
        <div ref={containerRef} className="relative">
            <div className="relative">
                <MapPin className="pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                    id={id}
                    value={value}
                    autoComplete="off"
                    className="bg-white pl-9 dark:border-slate-300 dark:bg-white dark:text-slate-900 dark:placeholder:text-slate-400"
                    onChange={(event) => {
                        suppressSearchRef.current = false;
                        setSelectedLocation(null);
                        onValueChange(event.target.value);
                    }}
                    onFocus={() => {
                        if (status === 'ok' || status === 'searching') {
                            setOpen(true);
                        }
                    }}
                    onKeyDown={(event) => {
                        if (event.key === 'Escape') {
                            setOpen(false);
                        }
                    }}
                />

                {open && value.trim().length >= MIN_QUERY_LENGTH && (
                    <div className="absolute top-full right-0 left-0 z-20 mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                        {status === 'searching' && (
                            <div className="flex items-center gap-2 px-4 py-3 text-sm text-slate-500">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Searching locations...
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="px-4 py-3 text-sm text-red-600">
                                Location search is unavailable right now. Please
                                type the address manually.
                            </div>
                        )}

                        {status === 'empty' && (
                            <div className="px-4 py-3 text-sm text-slate-500">
                                No locations found in California. Try a more
                                specific address.
                            </div>
                        )}

                        {status === 'ok' &&
                            results.map((feature) => {
                                const address = formatAddress(feature);

                                return (
                                    <button
                                        key={`${feature.geometry.coordinates[0]}-${feature.geometry.coordinates[1]}-${address}`}
                                        type="button"
                                        className={cn(
                                            'flex w-full items-start gap-2.5 px-4 py-2.5 text-left transition',
                                            'hover:bg-slate-50 focus:bg-slate-50 focus:outline-none',
                                        )}
                                        onClick={() => handleSelect(feature)}
                                    >
                                        <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E64A19]" />
                                        <span className="min-w-0 truncate text-sm font-semibold text-slate-800">
                                            {address}
                                        </span>
                                    </button>
                                );
                            })}
                    </div>
                )}
            </div>

            {selectedLocation && value.trim() !== '' && (
                <>
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2 border-[#004B87]/25 bg-white text-[#004B87] hover:bg-slate-50 hover:text-[#003d75]"
                        onClick={() => setCheckOpen(true)}
                    >
                        <CheckCircle2 className="h-4 w-4" />
                        Check Location
                    </Button>

                    <Dialog open={checkOpen} onOpenChange={setCheckOpen}>
                        <DialogContent className="bg-white sm:max-w-lg dark:bg-white">
                            <DialogHeader>
                                <DialogTitle>Selected Location</DialogTitle>
                                <DialogDescription>
                                    The address selected for this field.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <div className="flex items-start gap-3">
                                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#E64A19]" />
                                    <p className="text-sm font-semibold text-slate-800">
                                        {selectedLocation.address}
                                    </p>
                                </div>
                                <p className="mt-3 text-xs text-slate-500">
                                    Latitude:{' '}
                                    {selectedLocation.latitude.toFixed(6)} ·
                                    Longitude:{' '}
                                    {selectedLocation.longitude.toFixed(6)}
                                </p>
                            </div>
                            <MapPreview
                                points={[
                                    {
                                        label: selectedLocation.address,
                                        latitude: selectedLocation.latitude,
                                        longitude: selectedLocation.longitude,
                                        kind: 'location',
                                    },
                                ]}
                                satellite
                                height={280}
                            />
                        </DialogContent>
                    </Dialog>
                </>
            )}
        </div>
    );
}
