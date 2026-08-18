import { Link } from '@inertiajs/react';
import { X, CheckCircle2, ChevronRight, Ambulance } from 'lucide-react';
import { useEffect } from 'react';
import { book } from '@/routes';
import type { TransportService } from '@/types/carelink';

interface ServicesModalProps {
    selectedService: TransportService | null;
    isOpen: boolean;
    onClose: () => void;
}

export default function ServicesModal({
    selectedService,
    isOpen,
    onClose,
}: ServicesModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!isOpen) {
        return null;
    }

    const displayServices = selectedService ? [selectedService] : [];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/80 p-4 backdrop-blur-sm">
            <div className="relative my-8 flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
                {/* Modal Header */}
                <div className="flex shrink-0 items-center justify-between bg-[#004B87] px-6 py-4 text-white">
                    <div className="flex items-center gap-2">
                        <Ambulance className="h-5 w-5 text-orange-400" />
                        <h3 className="text-lg font-black">
                            {selectedService
                                ? selectedService.title
                                : 'NEMT Transport Services'}
                        </h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-1 text-white hover:bg-white/20"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Modal Body */}
                <div className="space-y-8 divide-y divide-slate-100 overflow-y-auto p-6">
                    {displayServices.map((service) => (
                        <div
                            key={service.id}
                            className="grid grid-cols-1 items-start gap-6 pt-6 first:pt-0 md:grid-cols-12"
                        >
                            <div className="h-52 overflow-hidden rounded-2xl bg-slate-100 shadow-md md:col-span-5">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="space-y-3 text-xs md:col-span-7">
                                <div>
                                    <span className="rounded-full border border-orange-200 bg-orange-50 px-2.5 py-0.5 text-[10px] font-black tracking-wider text-[#E64A19] uppercase">
                                        {service.category.replace('_', ' ')}
                                    </span>
                                    <h4 className="mt-1 text-xl font-black text-[#004B87]">
                                        {service.title}
                                    </h4>
                                </div>

                                <p className="text-xs leading-relaxed text-slate-600">
                                    {service.full_description ||
                                        service.short_description}
                                </p>

                                {service.benefits.length > 0 && (
                                    <div>
                                        <h5 className="mb-1.5 font-bold text-slate-800">
                                            Service Specifications:
                                        </h5>
                                        <ul className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                                            {service.benefits.map((b, i) => (
                                                <li
                                                    key={i}
                                                    className="flex items-center gap-1.5 text-slate-700"
                                                >
                                                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-[#E64A19]" />
                                                    <span>{b}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                <div className="pt-2">
                                    <Link
                                        href={book.url()}
                                        onClick={onClose}
                                        className="inline-flex items-center gap-2 rounded-xl bg-[#E64A19] px-5 py-2.5 text-xs font-black text-white shadow-md shadow-orange-900/20 transition-all hover:bg-[#d83f0e]"
                                    >
                                        <span>
                                            Book Ride for {service.title}
                                        </span>
                                        <ChevronRight className="h-4 w-4 text-orange-200" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
