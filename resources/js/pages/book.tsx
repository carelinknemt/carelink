import { Phone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AppHead from '@/components/app-head';
import { COMPANY_INFO } from '@/data/carelink';

const TRIP_REQUEST_EMBED_URL =
    'https://api.hibambi.com/public/trips/embed/trip-request/?access_token=Fy2Kas-0ost6iYRt6qnu16H1-JugTz4gaegPqSQHM8I';

const BAMBI_ORIGIN = 'https://api.hibambi.com';

const FALLBACK_IFRAME_HEIGHT = 500;

const BOOK_DESCRIPTION =
    'Book your Carelink Medical Transportation ride online. Request a wheelchair van, ambulatory sedan, or transit shuttle trip across Humboldt, Del Norte, Trinity, and Shasta counties.';

function extractHeight(payload: unknown): number | null {
    if (
        typeof payload === 'number' &&
        Number.isFinite(payload) &&
        payload > 0
    ) {
        return Math.round(payload);
    }

    if (typeof payload === 'string' && payload.trim() !== '') {
        const numeric = Number(payload);

        if (Number.isFinite(numeric) && numeric > 0) {
            return Math.round(numeric);
        }

        try {
            const parsed = JSON.parse(payload);

            return extractHeight(parsed);
        } catch {
            return null;
        }
    }

    if (payload && typeof payload === 'object') {
        const record = payload as Record<string, unknown>;
        const candidates = [
            record.height,
            record.iframeHeight,
            record.value,
            record.resize,
        ];

        for (const candidate of candidates) {
            const height = extractHeight(candidate);

            if (height !== null) {
                return height;
            }
        }
    }

    return null;
}

export default function Book() {
    const [iframeHeight, setIframeHeight] = useState(FALLBACK_IFRAME_HEIGHT);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== BAMBI_ORIGIN) {
                return;
            }

            const height = extractHeight(event.data);

            if (height !== null) {
                setIframeHeight(height);
            }
        };

        window.addEventListener('message', handleMessage);

        return () => window.removeEventListener('message', handleMessage);
    }, []);

    return (
        <div className="bg-slate-50">
            <AppHead
                title="Book a Ride — Online Trip Request"
                description={BOOK_DESCRIPTION}
                keywords={[
                    'book NEMT ride online',
                    'CareLink trip request',
                    'schedule medical transportation',
                    'wheelchair van booking',
                    'dialysis ride booking',
                    'CareLink Medical Transportation Eureka CA',
                ]}
                canonical="/book"
                type="website"
            />

            {/* Page Header */}
            <div className="bg-[#004B87] px-4 py-8 text-center sm:px-6 lg:px-12">
                <h1 className="text-2xl font-black text-white sm:text-3xl">
                    Book Your Ride Online
                </h1>
                <p className="mx-auto mt-2 max-w-2xl text-sm text-cyan-100">
                    Complete the trip request form below and our dispatch team
                    will confirm your ride.
                </p>
                <a
                    href={`tel:${COMPANY_INFO.dispatchPhone.replace(/[^0-9+]/g, '')}`}
                    className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white transition hover:bg-white/20"
                >
                    <Phone className="h-3.5 w-3.5 text-orange-300" />
                    Prefer to call? {COMPANY_INFO.dispatchPhone}
                </a>
            </div>

            {/* Bambi Trip Request Embed */}
            <div className="px-2 py-6 sm:px-4 lg:px-6">
                <div className="relative mx-auto w-full max-w-[1600px] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                    <iframe
                        title="Trip Request Form"
                        src={TRIP_REQUEST_EMBED_URL}
                        scrolling="no"
                        className="w-full border-0"
                        style={{ height: iframeHeight }}
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    );
}
