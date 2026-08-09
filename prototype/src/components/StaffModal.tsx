import { X, Users, Calendar, Award, ShieldCheck, User } from 'lucide-react';
import React, { useEffect } from 'react';
import { TEAM_MEMBERS } from '../data/carelinkData';

interface StaffModalProps {
  selectedDoctor: any | null;
  isOpen: boolean;
  onClose: () => void;
  onBookDoctor: (memberId: string) => void;
}

export const StaffModal: React.FC<StaffModalProps> = ({
  selectedDoctor,
  isOpen,
  onClose,
  onBookDoctor
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

  const displayMembers = selectedDoctor ? [selectedDoctor] : TEAM_MEMBERS;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm overflow-y-auto">
      <div className="relative my-8 w-full max-w-3xl rounded-3xl bg-white shadow-2xl overflow-hidden border border-slate-200 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between bg-[#004B87] px-6 py-4 text-white shrink-0">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-orange-400" />
            <h3 className="text-lg font-black">
              {selectedDoctor ? selectedDoctor.name : 'Carelink Leadership & Staff'}
            </h3>
          </div>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-white/20 text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-8 divide-y divide-slate-100">
          {displayMembers.map((member) => (
            <div key={member.id} className="pt-6 first:pt-0 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              <div className="md:col-span-5 rounded-2xl border border-slate-200 bg-slate-50 h-64 flex flex-col items-center justify-center p-6 shrink-0">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-100 text-[#E64A19] shadow-inner">
                  <User className="h-12 w-12" />
                </div>
                <div className="mt-3 flex items-center gap-1 text-[10px] font-black text-slate-400 tracking-widest uppercase">
                  <span>Authorized Leader</span>
                </div>
              </div>

              <div className="md:col-span-7 space-y-3 text-xs">
                <div>
                  <h4 className="text-xl font-black text-[#004B87]">{member.name}</h4>
                  <span className="inline-block mt-1 bg-orange-100 text-[#E64A19] font-bold px-3 py-1 rounded-full text-xs border border-orange-200/60">
                    {member.role}
                  </span>
                </div>

                <p className="text-slate-700 leading-relaxed text-xs">
                  {member.bio}
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      onBookDoctor(member.id);
                      onClose();
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#E64A19] px-5 py-2.5 text-xs font-black text-white shadow-md shadow-orange-900/20 hover:bg-[#d83f0e] transition-all"
                  >
                    <span>Schedule NEMT Ride Intake</span>
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
