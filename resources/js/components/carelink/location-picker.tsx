import { Loader2, MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
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
    placeholder?: string;
    onValueChange: (value: string) => void;
    onSelect: (address: string, latitude: number, longitude: number) => void;
}

const PHOTON_ENDPOINT = 'https://photon.komoot.io/api/';

const MAPBOX_ENDPOINT = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const CALIFORNIA_BBOX = '-124.482,32.528,-114.131,42.010';

const MIN_QUERY_LENGTH = 3;

function isInCalifornia(
    feature: Pick<GeocodingFeature, 'geometry'>,
): boolean {
    const [longitude, latitude] = feature.geometry.coordinates;

    return (
        latitude >= 32.528 &&
        latitude <= 42.01 &&
        longitude >= -124.482 &&
        longitude <= -114.131
    );
}

function formatFeature(feature: GeocodingFeature): {
    primary: string;
    secondary: string;
} {
    const { properties } = feature;
    const primaryParts = [properties.name, properties.street].filter(
        (part) => part !== undefined && part.trim() !== '',
    );
    const city = [properties.postcode, properties.city, properties.state]
        .filter((part) => part !== undefined && part.trim() !== '')
        .join(' ');

    return {
        primary: primaryParts.join(', ') || city || 'Selected location',
        secondary: city,
    };
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

    return (data.features ?? []).filter(isInCalifornia).slice(0, 5);
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

    return (data.features ?? [])
        .filter(isInCalifornia)
        .map(mapboxFeatureToGeocodingFeature)
        .slice(0, 5);
}

type SearchStatus = 'idle' | 'searching' | 'ok' | 'empty' | 'error';

export default function LocationPicker({
    id,
    value,
    placeholder,
    onValueChange,
    onSelect,
}: LocationPickerProps) {
    const [results, setResults] = useState<GeocodingFeature[]>([]);
    const [status, setStatus] = useState<SearchStatus>('idle');
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const query = value.trim();

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
        const { primary } = formatFeature(feature);
        const [longitude, latitude] = feature.geometry.coordinates;

        onSelect(primary, latitude, longitude);
        setResults([]);
        setStatus('idle');
        setOpen(false);
    };

    return (
        <div ref={containerRef} className="relative">
            <MapPin className="pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
                id={id}
                value={value}
                placeholder={placeholder}
                autoComplete="off"
                className="bg-white pl-9 dark:border-slate-300 dark:bg-white dark:text-slate-900 dark:placeholder:text-slate-400"
                onChange={(event) => onValueChange(event.target.value)}
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
                            const { primary, secondary } =
                                formatFeature(feature);

                            return (
                                <button
                                    key={`${feature.geometry.coordinates[0]}-${feature.geometry.coordinates[1]}-${primary}`}
                                    type="button"
                                    className={cn(
                                        'flex w-full items-start gap-2.5 px-4 py-2.5 text-left transition',
                                        'hover:bg-slate-50 focus:bg-slate-50 focus:outline-none',
                                    )}
                                    onClick={() => handleSelect(feature)}
                                >
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E64A19]" />
                                    <span className="min-w-0">
                                        <span className="block truncate text-sm font-semibold text-slate-800">
                                            {primary}
                                        </span>
                                        {secondary !== primary && (
                                            <span className="block truncate text-xs text-slate-500">
                                                {secondary}
                                            </span>
                                        )}
                                    </span>
                                </button>
                            );
                        })}
                </div>
            )}
        </div>
    );
}
