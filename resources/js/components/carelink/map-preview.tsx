import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';
import { useEffect } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet';

export interface MapPoint {
    label: string;
    latitude: number;
    longitude: number;
    kind: 'pickup' | 'dropoff';
}

interface MapPreviewProps {
    points: MapPoint[];
    height?: number;
}

const EUREKA: [number, number] = [40.8021, -124.1637];

const PICKUP_PIN =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="36" fill="#004B87"><path d="M12 0C7.6 0 4 3.6 4 8c0 6 8 16 8 16s8-10 8-16c0-4.4-3.6-8-8-8z"/><circle cx="12" cy="8" r="3.2" fill="#ffffff"/></svg>';

const DROPOFF_PIN =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="36" fill="#E64A19"><path d="M12 0C7.6 0 4 3.6 4 8c0 6 8 16 8 16s8-10 8-16c0-4.4-3.6-8-8-8z"/><circle cx="12" cy="8" r="3.2" fill="#ffffff"/></svg>';

const pickupIcon = L.divIcon({
    className: '',
    html: PICKUP_PIN,
    iconSize: [28, 36],
    iconAnchor: [14, 34],
    popupAnchor: [0, -30],
});

const dropoffIcon = L.divIcon({
    className: '',
    html: DROPOFF_PIN,
    iconSize: [28, 36],
    iconAnchor: [14, 34],
    popupAnchor: [0, -30],
});

function FitPoints({ points }: { points: MapPoint[] }) {
    const map = useMap();

    useEffect(() => {
        if (points.length === 0) {
            return;
        }

        if (points.length === 1) {
            map.setView([points[0].latitude, points[0].longitude], 14);

            return;
        }

        map.fitBounds(
            points.map((point) => [point.latitude, point.longitude]),
            { padding: [40, 40] },
        );
    }, [map, points]);

    return null;
}

export default function MapPreview({ points, height = 380 }: MapPreviewProps) {
    return (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <MapContainer
                center={EUREKA}
                zoom={8}
                style={{ height, width: '100%' }}
                scrollWheelZoom={false}
                attributionControl={true}
            >
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                <FitPoints points={points} />
                {points.map((point) => (
                    <Marker
                        key={`${point.kind}-${point.latitude}-${point.longitude}`}
                        position={[point.latitude, point.longitude]}
                        icon={
                            point.kind === 'pickup' ? pickupIcon : dropoffIcon
                        }
                        title={point.label}
                    >
                        <Popup>
                            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-800">
                                <MapPin
                                    className="h-3.5 w-3.5"
                                    style={{
                                        color:
                                            point.kind === 'pickup'
                                                ? '#004B87'
                                                : '#E64A19',
                                    }}
                                />
                                {point.kind === 'pickup' ? 'Pickup' : 'Dropoff'}
                            </span>
                            <span className="mt-1 block max-w-56 text-xs text-slate-600">
                                {point.label}
                            </span>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
}
