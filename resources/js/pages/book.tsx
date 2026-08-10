import { Phone } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import AppHead from '@/components/app-head';
import { COMPANY_INFO } from '@/data/carelink';

const TRIP_REQUEST_EMBED_URL =
    'https://api.hibambi.com/public/trips/embed/trip-request/?access_token=Fy2Kas-0ost6iYRt6qnu16H1-JugTz4gaegPqSQHM8I';

const BAMBI_ORIGIN = 'https://api.hibambi.com';

const FALLBACK_IFRAME_HEIGHT = 2600;

const BOOK_DESCRIPTION =
    'Book your Carelink Medical Transportation ride online. Request a wheelchair van, ambulatory sedan, or transit shuttle trip across Humboldt, Del Norte, Trinity, and Shasta counties.';

export default function Book() {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const [iframeHeight, setIframeHeight] = useState(FALLBACK_IFRAME_HEIGHT);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const handleMessage = (event: MessageEvent) => {
            if (event.origin !== BAMBI_ORIGIN) {
                return;
            }

            const height = Number(event.data);

            if (Number.isFinite(height) && height > 0) {
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
            <div className="px-3 py-6 sm:px-6 lg:px-12">
                <div className="relative mx-auto w-full max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
                    {isLoading && (
                        <div className="flex min-h-[480px] items-center justify-center">
                            <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#004B87]/20 border-t-[#004B87]" />
                        </div>
                    )}
                    <iframe
                        ref={iframeRef}
                        title="Trip Request Form"
                        src={TRIP_REQUEST_EMBED_URL}
                        scrolling="no"
                        className="w-full border-0"
                        style={{ height: iframeHeight }}
                        onLoad={() => setIsLoading(false)}
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    );
}
