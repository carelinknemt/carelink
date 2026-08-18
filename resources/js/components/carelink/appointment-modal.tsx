import { X, Ambulance, Phone } from 'lucide-react';
import { useBooking } from '@/context/booking-context';
import { useCompanyInfo } from '@/lib/cms';

function BookingModalContent() {
    const { closeBooking } = useBooking();
    const company = useCompanyInfo();
    const phone = company.phone ?? '';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md">
            <div className="relative my-auto w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl sm:rounded-3xl">
                <div className="flex items-center justify-between bg-[#004B87] px-5 py-4 text-white sm:px-6">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                            <Ambulance className="h-5 w-5 text-orange-400" />
                        </div>
                        <h3 className="text-sm font-black tracking-tight sm:text-base">
                            Book a Ride
                        </h3>
                    </div>
                    <button
                        onClick={closeBooking}
                        className="rounded-full p-1.5 text-white transition-colors hover:bg-white/20"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4 p-6 text-center sm:p-8">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-orange-200 bg-orange-50">
                        <Ambulance className="h-7 w-7 text-[#E64A19]" />
                    </div>
                    <h4 className="text-xl font-black text-slate-900">
                        Book by Phone
                    </h4>
                    <p className="mx-auto max-w-xs text-xs text-slate-600 sm:text-sm">
                        Call our dispatch team to schedule your non-emergency
                        medical ride.
                    </p>
                    <a
                        href={`tel:${phone.replace(/[^0-9+]/g, '')}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#004B87] px-5 py-2.5 text-xs font-black text-white shadow-lg transition-all hover:bg-[#003866] active:scale-95"
                    >
                        <Phone className="h-4 w-4 shrink-0" />
                        {phone}
                    </a>
                    <button
                        onClick={closeBooking}
                        className="w-full rounded-2xl bg-[#E64A19] py-3 text-xs font-black text-white shadow-xl shadow-orange-900/20 transition-all hover:bg-[#d83f0e] active:scale-95"
                    >
                        Got It
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AppointmentModal() {
    const { isBookingOpen } = useBooking();

    return isBookingOpen ? <BookingModalContent /> : null;
}
