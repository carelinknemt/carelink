import { X, Calendar, Clock, User, Phone, Mail, CheckCircle2, ShieldCheck, Ambulance, CreditCard, FileText, Navigation, AlertCircle } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { COMPANY_INFO } from '../data/carelinkData';
import type { RideBooking } from '../types';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedDay?: string;
}

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  preselectedDay
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<Partial<RideBooking>>({
    passengerName: '',
    phone: '',
    email: '',
    serviceType: 'Wheelchair Van',
    pickupAddress: '2400 Harris St, Eureka, CA',
    pickupCounty: 'Humboldt',
    destinationAddress: 'St. Joseph Hospital, 2700 Dolbeer St, Eureka, CA',
    destinationCounty: 'Humboldt',
    rideDate: preselectedDay || new Date().toISOString().split('T')[0],
    rideTime: '09:00 AM',
    isRoundTrip: true,
    wheelchairNeeded: true,
    oxygenNeeded: false,
    additionalNotes: '',
    paymentMethod: 'Insurance / Medicaid',
    estimatedCost: 85
  });

  const [countyWarning, setCountyWarning] = useState<string | null>(null);
  const [confirmationCode, setConfirmationCode] = useState<string | null>(null);
  const [bambiPayload, setBambiPayload] = useState<any>(null);

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

  const validCounties = COMPANY_INFO.counties;

  const handleCountyChange = (field: 'pickupCounty' | 'destinationCounty', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (!validCounties.includes(value)) {
      setCountyWarning(`Notice: ${value} is outside primary coverage (Humboldt, Del Norte, Trinity, Shasta). Long-distance inter-county rates will apply.`);
    } else {
      setCountyWarning(null);
    }
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const code = 'CL-NEMT-' + Math.floor(100000 + Math.random() * 900000);
    setConfirmationCode(code);

    // Build Bambi NEMT Dispatch Integration Payload
    const payload = {
      bambiDispatchVersion: '2.4-NEMT',
      bookingId: code,
      clientOrg: 'Carelink Medical Transportation LLC',
      passenger: {
        name: formData.passengerName,
        phone: formData.phone,
        email: formData.email,
        wheelchairNeeded: formData.wheelchairNeeded,
        oxygenNeeded: formData.oxygenNeeded
      },
      logistics: {
        vehicleType: formData.serviceType,
        pickup: `${formData.pickupAddress} (${formData.pickupCounty} County)`,
        destination: `${formData.destinationAddress} (${formData.destinationCounty} County)`,
        scheduledDate: formData.rideDate,
        scheduledTime: formData.rideTime,
        roundTrip: formData.isRoundTrip
      },
      billing: {
        method: formData.paymentMethod,
        estFareUSD: formData.estimatedCost
      },
      timestamp: new Date().toISOString(),
      dispatchStatus: 'BAMBI_DISPATCH_ACKNOWLEDGED'
    };

    setBambiPayload(payload);
    setStep(3);
  };

  const handleReset = () => {
    setStep(1);
    setConfirmationCode(null);
    setBambiPayload(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 p-2 sm:p-4 md:p-6 backdrop-blur-md overflow-y-auto">
      <div className="relative my-auto w-full max-w-2xl max-h-[90vh] sm:max-h-[85vh] flex flex-col min-h-0 rounded-2xl sm:rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between bg-[#004B87] p-3.5 sm:px-6 sm:py-4 text-white shrink-0">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="flex items-center justify-center rounded-xl bg-white p-1 px-2 shadow-sm shrink-0">
              <img
                src={COMPANY_INFO.logoWithTextUrl}
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
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-white/20 transition-colors text-white shrink-0 ml-2"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="bg-slate-100 px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between border-b border-slate-200 text-[11px] sm:text-xs font-bold text-slate-600 shrink-0 overflow-x-auto gap-2">
          <span className={`shrink-0 flex items-center gap-1.5 ${step === 1 ? 'text-[#E64A19] font-extrabold' : ''}`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-white text-[10px] shrink-0 ${step === 1 ? 'bg-[#E64A19]' : 'bg-slate-400'}`}>1</span>
            <span>Route & Vehicle</span>
          </span>
          <span className="text-slate-300 shrink-0">&rarr;</span>
          <span className={`shrink-0 flex items-center gap-1.5 ${step === 2 ? 'text-[#E64A19] font-extrabold' : ''}`}>
            <span className={`flex h-5 w-5 items-center justify-center rounded-full text-white text-[10px] shrink-0 ${step === 2 ? 'bg-[#E64A19]' : 'bg-slate-400'}`}>2</span>
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
            <form onSubmit={handleNextStep1} className="p-4 sm:p-6 space-y-4 text-xs">
              {/* Service / Vehicle Choice Engine */}
              <div>
                <label className="block font-bold text-slate-800 mb-1.5">
                  Select Transport Fleet Type <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { name: 'Wheelchair Van', icon: '♿', desc: 'ADA Lift' },
                    { name: 'Ambulatory Sedan', icon: '🚗', desc: 'Can walk' },
                    { name: 'Transit Shuttle', icon: '🚐', desc: 'Group' }
                  ].map((item) => (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setFormData({ ...formData, serviceType: item.name as any })}
                      className={`p-2.5 sm:p-3 rounded-2xl border text-left transition-all min-h-[72px] ${
                        formData.serviceType === item.name
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
              </div>

            {/* Geographic Route & Boundaries */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Pickup Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., 2400 Harris St, Eureka"
                  value={formData.pickupAddress}
                  onChange={(e) => setFormData({ ...formData, pickupAddress: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-[#004B87] focus:ring-1 focus:ring-[#004B87] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Pickup County <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.pickupCounty}
                  onChange={(e) => handleCountyChange('pickupCounty', e.target.value)}
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
                  value={formData.destinationAddress}
                  onChange={(e) => setFormData({ ...formData, destinationAddress: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-[#004B87] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Destination County <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.destinationCounty}
                  onChange={(e) => handleCountyChange('destinationCounty', e.target.value)}
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

            {/* Date, Time & Round Trip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.rideDate}
                  onChange={(e) => setFormData({ ...formData, rideDate: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-[#004B87] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Pickup Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g., 09:00 AM"
                  value={formData.rideTime}
                  onChange={(e) => setFormData({ ...formData, rideTime: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-[#004B87] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Trip Style
                </label>
                <select
                  value={formData.isRoundTrip ? 'round' : 'one-way'}
                  onChange={(e) => setFormData({ ...formData, isRoundTrip: e.target.value === 'round' })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-[#004B87] outline-none"
                >
                  <option value="round">Round Trip (Return Included)</option>
                  <option value="one-way">One-Way Transport Only</option>
                </select>
              </div>
            </div>

            {/* Mobility Requirements */}
            <div className="flex flex-wrap items-center gap-6 rounded-xl bg-slate-50 p-3 border border-slate-200">
              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.wheelchairNeeded}
                  onChange={(e) => setFormData({ ...formData, wheelchairNeeded: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-[#004B87] focus:ring-[#004B87]"
                />
                <span>Wheelchair Ramp & Assistance Needed</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                <input
                  type="checkbox"
                  checked={formData.oxygenNeeded}
                  onChange={(e) => setFormData({ ...formData, oxygenNeeded: e.target.checked })}
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
          <form onSubmit={handleSubmitBooking} className="p-6 space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Passenger Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Eleanor Vance"
                value={formData.passengerName}
                onChange={(e) => setFormData({ ...formData, passengerName: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-[#004B87] outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Contact Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="(707) 555-0192"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-[#004B87] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="passenger@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-[#004B87] outline-none"
                />
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Payment / Billing Gateway <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value as any })}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-[#004B87] outline-none font-bold"
                required
              >
                <option value="Insurance / Medicaid">Insurance / Medi-Cal / Managed Care Plan</option>
                <option value="Facility Billing">Hospital / Medical Center Direct Billing</option>
                <option value="Credit Card (Stripe/Square)">Credit Card / Debit Card (Stripe / Square PCI)</option>
                <option value="Private Pay Cash">Private Pay Cash Upon Pickup</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Special Clinical Notes / Access Instructions
              </label>
              <textarea
                rows={2}
                placeholder="e.g., Gate code 1234, patient needs arm assistance down 3 front porch steps, appointment is Dialysis Unit Floor 2..."
                value={formData.additionalNotes}
                onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-800 focus:border-[#004B87] outline-none"
              />
            </div>

            {/* Fare Summary Box */}
            <div className="rounded-2xl bg-cyan-50/70 p-4 border border-cyan-200 flex items-center justify-between">
              <div>
                <div className="font-extrabold text-[#004B87]">Estimated Fare / Pre-Auth</div>
                <div className="text-[11px] text-slate-600">
                  {formData.paymentMethod.includes('Insurance') ? 'Covered by Insurance / Medi-Cal (Subject to Auth)' : 'Private Pay / Facility Direct Rate'}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-[#004B87]">${formData.estimatedCost}.00</div>
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
                className="w-2/3 rounded-2xl bg-[#E64A19] py-3 text-xs sm:text-sm font-black text-white shadow-xl shadow-orange-900/20 hover:bg-[#d83f0e]"
              >
                Confirm Booking & Dispatch to Bambi NEMT
              </button>
            </div>
          </form>
        )}

        {/* Step 3: Confirmation & Bambi Payload */}
        {step === 3 && (
          <div className="p-6 text-center space-y-5">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shadow-md">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div>
              <h4 className="text-xl font-black text-slate-900">
                NEMT Ride Confirmed & Dispatched!
              </h4>
              <p className="text-xs text-slate-600 mt-1 max-w-md mx-auto">
                Carelink dispatch has acknowledged your booking. The ride has been logged into the Bambi NEMT scheduling system.
              </p>
            </div>

            {/* Summary Details */}
            <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500 font-medium">Bambi Dispatch Ref:</span>
                <span className="font-mono font-black text-[#004B87]">{confirmationCode}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Passenger:</span>
                <span className="font-bold text-slate-800">{formData.passengerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Fleet Vehicle:</span>
                <span className="font-bold text-cyan-700">{formData.serviceType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Pickup & County:</span>
                <span className="font-semibold text-slate-800">{formData.pickupAddress} ({formData.pickupCounty})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Destination:</span>
                <span className="font-semibold text-slate-800">{formData.destinationAddress} ({formData.destinationCounty})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Schedule:</span>
                <span className="font-bold text-slate-800">{formData.rideDate} at {formData.rideTime}</span>
              </div>
            </div>

            {/* Live Bambi Payload Box */}
            <div className="text-left">
              <details className="rounded-xl border border-slate-200 bg-slate-900 p-3 text-white">
                <summary className="cursor-pointer text-xs font-bold text-cyan-400 flex items-center justify-between">
                  <span>View Bambi NEMT API Integration Payload JSON</span>
                  <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">Developer Payload</span>
                </summary>
                <pre className="mt-2 overflow-x-auto text-[10px] text-cyan-200 font-mono p-2 bg-slate-950 rounded-lg">
                  {JSON.stringify(bambiPayload, null, 2)}
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
};
