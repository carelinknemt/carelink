import { X, Ambulance, Phone } from 'lucide-react';
import { useBooking } from '@/context/booking-context';
import { COMPANY_INFO } from '@/data/carelink';

function BookingModalContent() {
    const { closeBooking } = useBooking();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-md">
            <div className="relative my-auto w-full max-w-md rounded-2xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
                <div className="flex items-center justify-between bg-[#004B87] px-5 sm:px-6 py-4 text-white">
                    <div className="flex items-center gap-2.5">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
                            <Ambulance className="h-5 w-5 text-orange-400" />
                        </div>
                        <h3 className="text-sm sm:text-base font-black tracking-tight">Book a Ride</h3>
                    </div>
                    <button
                        onClick={closeBooking}
                        className="rounded-full p-1.5 hover:bg-white/20 transition-colors text-white"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 sm:p-8 text-center space-y-4">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 border border-orange-200">
                        <Ambulance className="h-7 w-7 text-[#E64A19]" />
                    </div>
                    <h4 className="text-xl font-black text-slate-900">Coming Soon</h4>
                    <p className="text-xs sm:text-sm text-slate-600 max-w-xs mx-auto">
                        Online ride booking is on its way. Please call us to schedule your ride in the meantime.
                    </p>
                    <a
                        href={`tel:${COMPANY_INFO.phone.replace(/[^0-9+]/g, '')}`}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#004B87] px-5 py-2.5 text-xs font-black text-white shadow-lg transition-all hover:bg-[#003866] active:scale-95"
                    >
                        <Phone className="h-4 w-4 shrink-0" />
                        {COMPANY_INFO.phone}
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
