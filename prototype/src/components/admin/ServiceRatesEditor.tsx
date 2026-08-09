import { DollarSign, Save, CheckCircle2 } from 'lucide-react';
import React, { useState } from 'react';
import { TRANSPORT_SERVICES } from '../../data/carelinkData';

export const ServiceRatesEditor: React.FC = () => {
  const [services, setServices] = useState(TRANSPORT_SERVICES);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleRateChange = (id: string, field: 'baseRate' | 'mileageRate', val: number) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: val } : s))
    );
  };

  const handleSave = () => {
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-400" />
            <span>Transport Service Rates & Base Fee Matrix</span>
          </h3>
          <p className="text-xs text-slate-400">Manage base dispatch fees and per-mile charges for Humboldt County</p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#004B87] hover:bg-[#003866] text-white text-xs font-bold transition-all shadow-md"
        >
          <Save className="h-4 w-4 text-cyan-300" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedNotice && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Service rates updated successfully in live dispatch calculator!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((srv) => (
          <div key={srv.id} className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
            <h4 className="text-sm font-bold text-white">{srv.title}</h4>
            <p className="text-xs text-slate-400">{srv.description}</p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Base Fee ($)</label>
                <input
                  type="number"
                  value={srv.baseRate}
                  onChange={(e) => handleRateChange(srv.id, 'baseRate', Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-1.5 px-3 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Per Mile ($)</label>
                <input
                  type="number"
                  step="0.1"
                  value={srv.mileageRate}
                  onChange={(e) => handleRateChange(srv.id, 'mileageRate', Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900 py-1.5 px-3 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
