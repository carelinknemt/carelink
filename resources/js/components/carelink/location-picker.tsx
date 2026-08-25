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

interface LocationResult {
    address: string;
    latitude: number;
    longitude: number;
}

interface GooglePlacesLocation {
    latitude: number;
    longitude: number;
}

interface GooglePlacesPlace {
    formattedAddress?: string;
    location?: GooglePlacesLocation;
}

interface GoogleTextSearchResponse {
    places?: GooglePlacesPlace[];
}

interface SelectedLocation {
    address: string;
    latitude: number;
    longitude: number;
}

interface LocationPickerProps {
    id: string;
    value: string;
    onValueChange: (value: string) => void;
    onSelect: (address: string, latitude: number, longitude: number) => void;
}

const GOOGLE_TEXT_SEARCH_ENDPOINT =
    'https://places.googleapis.com/v1/places:searchText';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const MAX_RESULTS = 5;

const MIN_QUERY_LENGTH = 3;

const SEARCH_DEBOUNCE_MS = 350;

const CALIFORNIA_RECTANGLE = {
    low: { latitude: 32.528, longitude: -124.482 },
    high: { latitude: 42.01, longitude: -114.131 },
};

async function searchGooglePlaces(
    query: string,
    signal: AbortSignal,
): Promise<LocationResult[] | null> {
    if (!GOOGLE_MAPS_API_KEY) {
        return null;
    }

    const response = await fetch(GOOGLE_TEXT_SEARCH_ENDPOINT, {
        method: 'POST',
        signal,
        headers: {
            'Content-Type': 'application/json',
            'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
            'X-Goog-FieldMask': 'places.formattedAddress,places.location',
        },
        body: JSON.stringify({
            textQuery: query,
            languageCode: 'en',
            maxResultCount: MAX_RESULTS,
            locationRestriction: { rectangle: CALIFORNIA_RECTANGLE },
        }),
    });

    if (!response.ok) {
        throw new Error(`Google Places request failed: ${response.status}`);
    }

    const data: GoogleTextSearchResponse = await response.json();

    const seenKeys = new Set<string>();
    const results: LocationResult[] = [];

    for (const place of data.places ?? []) {
        const address = place.formattedAddress?.trim();
        const location = place.location;

        if (!address || !location) {
            continue;
        }

        const dedupeKey = `${address.toLowerCase()}|${location.latitude.toFixed(5)},${location.longitude.toFixed(5)}`;

        if (seenKeys.has(dedupeKey)) {
            continue;
        }

        seenKeys.add(dedupeKey);
        results.push({
            address,
            latitude: location.latitude,
            longitude: location.longitude,
        });

        if (results.length >= MAX_RESULTS) {
            break;
        }
    }

    return results;
}

type SearchStatus = 'idle' | 'searching' | 'ok' | 'empty' | 'error';

export default function LocationPicker({
    id,
    value,
    onValueChange,
    onSelect,
}: LocationPickerProps) {
    const [results, setResults] = useState<LocationResult[]>([]);
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

        const controller = new AbortController();
        const timer = window.setTimeout(async () => {
            if (query.length < MIN_QUERY_LENGTH) {
                setResults([]);
                setStatus('idle');
                setOpen(false);

                return;
            }

            setStatus('searching');
            setOpen(true);

            try {
                const googleResults = await searchGooglePlaces(
                    query,
                    controller.signal,
                );

                if (googleResults === null) {
                    setResults([]);
                    setStatus('error');

                    return;
                }

                if (googleResults.length > 0) {
                    setResults(googleResults);
                    setStatus('ok');

                    return;
                }

                setResults([]);
                setStatus('empty');
            } catch (error: unknown) {
                if ((error as Error).name === 'AbortError') {
                    return;
                }

                setResults([]);
                setStatus('error');
            }
        }, SEARCH_DEBOUNCE_MS);

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

    const handleSelect = (result: LocationResult) => {
        suppressSearchRef.current = true;
        onSelect(result.address, result.latitude, result.longitude);
        setSelectedLocation({
            address: result.address,
            latitude: result.latitude,
            longitude: result.longitude,
        });
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
                            results.map((result) => (
                                <button
                                    key={`${result.latitude}-${result.longitude}-${result.address}`}
                                    type="button"
                                    className={cn(
                                        'flex w-full items-start gap-2.5 px-4 py-2.5 text-left transition',
                                        'hover:bg-slate-50 focus:bg-slate-50 focus:outline-none',
                                    )}
                                    onClick={() => handleSelect(result)}
                                >
                                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E64A19]" />
                                    <span className="min-w-0 truncate text-sm font-semibold text-slate-800">
                                        {result.address}
                                    </span>
                                </button>
                            ))}
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
