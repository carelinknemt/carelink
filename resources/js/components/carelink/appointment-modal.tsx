import { router, useForm } from '@inertiajs/react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useBooking } from '@/context/booking-context';
import { COMPANY_INFO } from '@/data/carelink';
import type { BookingConfirmation } from '@/types/carelink';

const SERVICE_TYPES = [
    { name: 'Wheelchair Van', icon: '♿', desc: 'ADA Lift' },
    { name: 'Ambulatory Sedan', icon: '🚗', desc: 'Can walk' },
    { name: 'Transit Shuttle', icon: '🚐', desc: 'Group' },
];

function BookingModalContent() {
    const { closeBooking } = useBooking();
    const [step, setStep] = useState<1 | 2 | 3>(1);
    const [countyWarning, setCountyWarning] = useState<string | null>(null);
    const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        passenger_name: '',
        phone: '',
        email: '',
        service_type: 'Wheelchair Van',
        pickup_address: '2400 Harris St, Eureka, CA',
        pickup_county: 'Humboldt',
        destination_address: 'St. Joseph Hospital, 2700 Dolbeer St, Eureka, CA',
        destination_county: 'Humboldt',
        ride_date: new Date().toISOString().split('T')[0],
        ride_time: '09:00 AM',
        is_round_trip: true,
        wheelchair_needed: true,
        oxygen_needed: false,
        additional_notes: '',
        payment_method: 'Insurance / Medicaid',
        estimated_cost: 85,
    });

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    useEffect(() => {
        const dispose = router.on('flash', (event) => {
            const booking = (event as CustomEvent).detail?.flash?.booking as BookingConfirmation | undefined;

            if (!booking) {
                return;
            }

            setConfirmation(booking);
            setStep(3);
        });

        return dispose;
    }, []);

    const validCounties = COMPANY_INFO.counties;
    const handleCountyChange = (field: 'pickup_county' | 'destination_county', value: string) => {
        setData(field as 'pickup_county', value);

        if (!validCounties.includes(value)) {
            setCountyWarning(
                `Notice: ${value} is outside primary coverage (Humboldt, Del Norte, Trinity, Shasta). Long-distance inter-county rates will apply.`
            );
        } else {
            setCountyWarning(null);
        }
    };

    const handleSubmitBooking = (e: React.FormEvent) => {
        e.preventDefault();
        post('/appointments', {
            preserveScroll: true,
            onError: () => setStep(2),
        });
    };

    const handleReset = () => {
        reset();
        setStep(1);
        setConfirmation(null);
        closeBooking();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-2 sm:p-4 md:p-6 backdrop-blur-md overflow-y-auto">
            <div className="relative my-auto w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col min-h-0 rounded-2xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
                {/* Modal Header */}
                <div className="flex items-center justify-between bg-[#004B87] p-3.5 sm:px-6 sm:py-4 text-white shrink-0">
                    <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                        <div className="flex items-center justify-center rounded-xl bg-white p-1 px-2 shadow-sm shrink-0">
                            <img
                                src={COMPANY_INFO.logoUrl}
                                alt="Carelink Logo"
                                className="h-7 sm:h-8 w-auto max-w-[110px] sm:max-w-[140px] object-contain"
                                referrerPolicy="no-referrer"
                            />
                        </div>
                        <div className="min-w-0">
                            <h3 className="text-sm sm:text-base md:text-lg font-black tracking-tight truncate">
                                {step === 1 && 'NEMT Ride Intake – Mobility & Route'}
                                {step === 2 && 'NEMT Ride Intake – Passenger & Billing'}
                                {step === 3 && 'Ride Intake Confirmed & Dispatched!'}
                            </h3>
                            <p className="text-[10px] sm:text-[11px] text-cyan-200 truncate">
                                Carelink Medical Transportation &bull; Bambi NEMT Direct Hook
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleReset}
                        className="rounded-full p-1.5 hover:bg-white/20 transition-colors text-white shrink-0 ml-2"
                        aria-label="Close modal"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Step Indicator Bar */}
                <div className="bg-slate-100 px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between border-b border-slate-200 text-[11px] sm:text-xs font-bold text-slate-600 shrink-0 overflow-x-auto gap-2">
                    <span className={`shrink-0 flex items-center gap-1.5 ${step === 1 ? 'text-[#E64A19] font-extrabold' : ''}`}>
                        <span className={`flex h-5 w-5 items-center justify-center rounded-full text-white text-[10px] shrink-0 ${step === 1 ? 'bg-[#E64A19]' : 'bg-slate-400'}`}>
                            1
                        </span>
                        <span>Route & Vehicle</span>
                    </span>
                    <span className="text-slate-300 shrink-0">&rarr;</span>
                    <span className={`shrink-0 flex items-center gap-1.5 ${step === 2 ? 'text-[#E64A19] font-extrabold' : ''}`}>
                        <span className={`flex h-5 w-5 items-center justify-center rounded-full text-white text-[10px] shrink-0 ${step === 2 ? 'bg-[#E64A19]' : 'bg-slate-400'}`}>
                            2
                        </span>
                        <span>Passenger & Payment</span>
                    </span>
                    <span className="text-slate-300 shrink-0">&rarr;</span>
                    <span className={`shrink-0 flex items-center gap-1.5 ${step === 3 ? 'text-emerald-700 font-extrabold' : ''}`}>
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-white text-[10px] shrink-0">3</span>
                        <span>Dispatch</span>
                    </span>
                </div>

                {/* Scrollable Form Container */}
                <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain">
                    {/* Form Body Step 1 */}
                    {step === 1 && (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setStep(2);
                            }}
                            className="p-4 sm:p-6 space-y-4 text-xs"
                        >
                            <div>
                                <label className="block font-bold text-slate-800 mb-1.5">
                                    Select Transport Fleet Type <span className="text-red-500">*</span>
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    {SERVICE_TYPES.map((item) => (
                                        <button
                                            key={item.name}
                                            type="button"
                                            onClick={() => setData('service_type', item.name)}
                                            className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all min-h-[72px] ${
                                                data.service_type === item.name
                                                    ? 'border-[#004B87] bg-cyan-50/60 ring-2 ring-[#004B87] font-extrabold text-[#004B87]'
                                                    : 'border-slate-200 bg-white hover:border-slate-300 text-slate-700'
                                            }`}
                                        >
                                            <div className="text-base sm:text-lg">{item.icon}</div>
                                            <div className="font-bold mt-0.5 text-xs">{item.name}</div>
                                            <div className="text-[10px] text-slate-500">{item.desc}</div>
                                        </button>
                                    ))}
                                </div>
                                {errors.service_type && <p className="mt-1 text-[11px] text-red-600">{errors.service_type}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold text-slate-800 mb-1">
                                        Pickup Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., 2400 Harris St, Eureka"
                                        value={data.pickup_address}
                                        onChange={(e) => setData('pickup_address', e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-[#004B87] focus:ring-1 focus:ring-[#004B87] outline-none"
                                        required
                                    />
                                    {errors.pickup_address && <p className="mt-1 text-[11px] text-red-600">{errors.pickup_address}</p>}
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-800 mb-1">
                                        Pickup County <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.pickup_county}
                                        onChange={(e) => handleCountyChange('pickup_county', e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-[#004B87] outline-none"
                                        required
                                    >
                                        <option value="Humboldt">Humboldt County</option>
                                        <option value="Del Norte">Del Norte County</option>
                                        <option value="Trinity">Trinity County</option>
                                        <option value="Shasta">Shasta County</option>
                                        <option value="Mendocino">Mendocino County (Extended)</option>
                                        <option value="Other">Other Region</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold text-slate-800 mb-1">
                                        Destination Medical Facility / Address <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., St. Joseph Hospital, Eureka"
                                        value={data.destination_address}
                                        onChange={(e) => setData('destination_address', e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-[#004B87] outline-none"
                                        required
                                    />
                                    {errors.destination_address && <p className="mt-1 text-[11px] text-red-600">{errors.destination_address}</p>}
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-800 mb-1">
                                        Destination County <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={data.destination_county}
                                        onChange={(e) => handleCountyChange('destination_county', e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-[#004B87] outline-none"
                                        required
                                    >
                                        <option value="Humboldt">Humboldt County</option>
                                        <option value="Del Norte">Del Norte County</option>
                                        <option value="Trinity">Trinity County</option>
                                        <option value="Shasta">Shasta County</option>
                                        <option value="San Francisco">San Francisco (Specialty)</option>
                                        <option value="Sacramento">Sacramento (Specialty)</option>
                                    </select>
                                </div>
                            </div>

                            {countyWarning && (
                                <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-3 border border-amber-200 text-amber-800 text-[11px]">
                                    <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                                    <span>{countyWarning}</span>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-800 mb-1">
                                        Date <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="date"
                                        min={new Date().toISOString().split('T')[0]}
                                        value={data.ride_date}
                                        onChange={(e) => setData('ride_date', e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-[#004B87] outline-none"
                                        required
                                    />
                                    {errors.ride_date && <p className="mt-1 text-[11px] text-red-600">{errors.ride_date}</p>}
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-800 mb-1">
                                        Pickup Time <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g., 09:00 AM"
                                        value={data.ride_time}
                                        onChange={(e) => setData('ride_time', e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-[#004B87] outline-none"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-800 mb-1">Trip Style</label>
                                    <select
                                        value={data.is_round_trip ? 'round' : 'one-way'}
                                        onChange={(e) => setData('is_round_trip', e.target.value === 'round')}
                                        className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-[#004B87] outline-none"
                                    >
                                        <option value="round">Round Trip (Return Included)</option>
                                        <option value="one-way">One-Way Transport Only</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-6 rounded-xl bg-slate-50 p-3 border border-slate-200">
                                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={data.wheelchair_needed}
                                        onChange={(e) => setData('wheelchair_needed', e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-[#004B87] focus:ring-[#004B87]"
                                    />
                                    <span>Wheelchair Ramp & Assistance Needed</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                                    <input
                                        type="checkbox"
                                        checked={data.oxygen_needed}
                                        onChange={(e) => setData('oxygen_needed', e.target.checked)}
                                        className="h-4 w-4 rounded border-slate-300 text-[#004B87] focus:ring-[#004B87]"
                                    />
                                    <span>Portable Oxygen Tank Accommodated</span>
                                </label>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    className="w-full rounded-2xl bg-[#E64A19] py-3.5 text-xs sm:text-sm font-black text-white shadow-xl shadow-orange-900/20 transition-all hover:bg-[#d83f0e] active:scale-95"
                                >
                                    Proceed to Passenger & Payment Details &rarr;
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Form Body Step 2 */}
                    {step === 2 && (
                        <form onSubmit={handleSubmitBooking} className="p-4 sm:p-6 space-y-4 text-xs">
                            <div>
                                <label className="block font-bold text-slate-800 mb-1">
                                    Passenger Full Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="e.g. Eleanor Vance"
                                    value={data.passenger_name}
                                    onChange={(e) => setData('passenger_name', e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-[#004B87] outline-none"
                                    required
                                />
                                {errors.passenger_name && <p className="mt-1 text-[11px] text-red-600">{errors.passenger_name}</p>}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-bold text-slate-800 mb-1">
                                        Contact Phone Number <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="(707) 555-0192"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-[#004B87] outline-none"
                                        required
                                    />
                                    {errors.phone && <p className="mt-1 text-[11px] text-red-600">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label className="block font-bold text-slate-800 mb-1">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="passenger@example.com"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-[#004B87] outline-none"
                                    />
                                    {errors.email && <p className="mt-1 text-[11px] text-red-600">{errors.email}</p>}
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-800 mb-1">
                                    Payment / Billing Gateway <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={data.payment_method}
                                    onChange={(e) => setData('payment_method', e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-[#004B87] outline-none font-bold"
                                    required
                                >
                                    <option value="Insurance / Medicaid">Insurance / Medi-Cal / Managed Care Plan</option>
                                    <option value="Facility Billing">Hospital / Medical Center Direct Billing</option>
                                    <option value="Credit Card (Stripe/Square)">Credit Card / Debit Card (Stripe / Square PCI)</option>
                                    <option value="Private Pay Cash">Private Pay Cash Upon Pickup</option>
                                </select>
                                {errors.payment_method && <p className="mt-1 text-[11px] text-red-600">{errors.payment_method}</p>}
                            </div>

                            <div>
                                <label className="block font-bold text-slate-800 mb-1">Special Clinical Notes / Access Instructions</label>
                                <textarea
                                    rows={2}
                                    placeholder="e.g., Gate code 1234, patient needs arm assistance down 3 front porch steps, appointment is Dialysis Unit Floor 2..."
                                    value={data.additional_notes}
                                    onChange={(e) => setData('additional_notes', e.target.value)}
                                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-[#004B87] outline-none"
                                />
                            </div>

                            <div className="rounded-2xl bg-cyan-50/70 p-4 border border-cyan-200 flex items-center justify-between">
                                <div>
                                    <div className="font-extrabold text-[#004B87]">Estimated Fare / Pre-Auth</div>
                                    <div className="text-[11px] text-slate-600">
                                        {data.payment_method.includes('Insurance')
                                            ? 'Covered by Insurance / Medi-Cal (Subject to Auth)'
                                            : 'Private Pay / Facility Direct Rate'}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xl font-black text-[#004B87]">${data.estimated_cost}.00</div>
                                    <div className="text-[10px] text-slate-500">Includes roundtrip & assistance</div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="w-1/3 rounded-2xl border border-slate-300 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100"
                                >
                                    &larr; Back
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-2/3 rounded-2xl bg-[#E64A19] py-3 text-xs sm:text-sm font-black text-white shadow-xl shadow-orange-900/20 hover:bg-[#d83f0e] disabled:opacity-60"
                                >
                                    {processing ? 'Dispatching...' : 'Confirm Booking & Dispatch to Bambi NEMT'}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Step 3: Confirmation & Bambi Payload */}
                    {step === 3 && confirmation && (
                        <div className="p-4 sm:p-6 text-center space-y-5">
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-md">
                                <CheckCircle2 className="h-10 w-10" />
                            </div>

                            <div>
                                <h4 className="text-xl font-black text-slate-900">NEMT Ride Confirmed & Dispatched!</h4>
                                <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                                    Carelink dispatch has acknowledged your booking. The ride has been logged into the Bambi NEMT scheduling system.
                                </p>
                            </div>

                            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 text-left space-y-2 text-xs">
                                <div className="flex justify-between border-b border-slate-200 pb-2">
                                    <span className="text-slate-500 font-medium">Bambi Dispatch Ref:</span>
                                    <span className="font-mono font-black text-[#004B87]">{confirmation.booking_number}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-medium">Passenger:</span>
                                    <span className="font-bold text-slate-800">{confirmation.passenger_name}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-medium">Fleet Vehicle:</span>
                                    <span className="font-bold text-cyan-700">{confirmation.service_type}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-medium">Pickup & County:</span>
                                    <span className="font-semibold text-slate-800">
                                        {confirmation.pickup_address} ({confirmation.pickup_county})
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-medium">Destination:</span>
                                    <span className="font-semibold text-slate-800">
                                        {confirmation.destination_address} ({confirmation.destination_county})
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-medium">Schedule:</span>
                                    <span className="font-bold text-slate-800">
                                        {confirmation.ride_date} at {confirmation.ride_time}
                                    </span>
                                </div>
                            </div>

                            <div className="text-left">
                                <details className="rounded-xl border border-slate-200 bg-slate-900 p-3 text-white">
                                    <summary className="cursor-pointer text-xs font-bold text-cyan-400 flex items-center justify-between">
                                        <span>View Bambi NEMT API Integration Payload JSON</span>
                                        <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">Developer Payload</span>
                                    </summary>
                                    <pre className="mt-2 overflow-x-auto text-[10px] text-cyan-200 font-mono p-2 bg-slate-950 rounded-lg">
                                        {JSON.stringify(
                                            {
                                                bambiDispatchVersion: '2.4-NEMT',
                                                bookingId: confirmation.booking_number,
                                                clientOrg: 'Carelink Medical Transportation LLC',
                                                passenger: {
                                                    name: confirmation.passenger_name,
                                                    wheelchairNeeded: data.wheelchair_needed,
                                                    oxygenNeeded: data.oxygen_needed,
                                                },
                                                logistics: {
                                                    vehicleType: confirmation.service_type,
                                                    pickup: `${confirmation.pickup_address} (${confirmation.pickup_county} County)`,
                                                    destination: `${confirmation.destination_address} (${confirmation.destination_county} County)`,
                                                    scheduledDate: confirmation.ride_date,
                                                    scheduledTime: confirmation.ride_time,
                                                    roundTrip: data.is_round_trip,
                                                },
                                                billing: {
                                                    method: data.payment_method,
                                                    estFareUSD: data.estimated_cost,
                                                },
                                                timestamp: new Date().toISOString(),
                                                dispatchStatus: 'BAMBI_DISPATCH_ACKNOWLEDGED',
                                            },
                                            null,
                                            2
                                        )}
                                    </pre>
                                </details>
                            </div>

                            <button
                                onClick={handleReset}
                                className="w-full rounded-2xl bg-[#004B87] py-3 text-xs font-bold text-white shadow-lg hover:bg-[#003866]"
                            >
                                Done & Return to Website
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function AppointmentModal() {
    const { isBookingOpen } = useBooking();

    return isBookingOpen ? <BookingModalContent /> : null;
}
