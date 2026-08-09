import { X, CheckCircle2, ChevronRight, Ambulance } from 'lucide-react';
import React, { useEffect } from 'react';
import { TRANSPORT_SERVICES } from '../data/carelinkData';

interface ServicesModalProps {
  selectedService: any | null;
  isOpen: boolean;
  onClose: () => void;
  onBookService: (serviceName: string) => void;
}

export const ServicesModal: React.FC<ServicesModalProps> = ({
  selectedService,
  isOpen,
  onClose,
  onBookService
}) => {
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

  const displayServices = selectedService ? [selectedService] : TRANSPORT_SERVICES;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative my-8 w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200 max-h-[85vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between bg-[#004B87] px-6 py-4 text-white shrink-0">
          <div className="flex items-center gap-2">
            <Ambulance className="h-5 w-5 text-orange-400" />
            <h3 className="text-lg font-black">
              {selectedService ? selectedService.title : 'NEMT Transport Services'}
            </h3>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-white/20 text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-8 divide-y divide-slate-100">
          {displayServices.map((service) => (
            <div key={service.id} className="pt-6 first:pt-0 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-5 rounded-2xl overflow-hidden shadow-md h-52 bg-slate-100">
                <img src={service.image} alt={service.title} className="h-full w-full object-cover" />
              </div>

              <div className="md:col-span-7 space-y-3 text-xs">
                <div>
                  <span className="text-[10px] font-black text-[#E64A19] tracking-wider uppercase bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                    {service.category.replace('_', ' ')}
                  </span>
                  <h4 className="text-xl font-black text-[#004B87] mt-1">{service.title}</h4>
                </div>

                <p className="text-slate-600 leading-relaxed text-xs">
                  {service.fullDescription || service.shortDescription}
                </p>

                {service.benefits && (
                  <div>
                    <h5 className="font-bold text-slate-800 mb-1.5">Service Specifications:</h5>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                      {service.benefits.map((b: string, i: number) => (
                        <li key={i} className="flex items-center gap-1.5 text-slate-700">
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#E64A19] shrink-0" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => {
                      onBookService(service.title);
                      onClose();
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#E64A19] px-5 py-2.5 text-xs font-black text-white shadow-md shadow-orange-900/20 hover:bg-[#d83f0e] transition-all"
                  >
                    <span>Book Ride for {service.title}</span>
                    <ChevronRight className="h-4 w-4 text-orange-200" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
