import { Car, CheckCircle2 } from 'lucide-react';
import React from 'react';
import { VEHICLE_FLEET } from '../../data/carelinkData';

export const FleetStatusCard: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <Car className="h-5 w-5 text-cyan-400" />
            <span>Active Transport Fleet Status</span>
          </h3>
          <p className="text-xs text-slate-400">Real-time ADA & Wheelchair lift inspections</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {VEHICLE_FLEET.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 relative overflow-hidden shadow-lg"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  UNIT #{vehicle.id}
                </span>
                <h4 className="text-sm font-bold text-white mt-1">{vehicle.name}</h4>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                Active Duty
              </span>
            </div>

            <p className="text-xs text-slate-400 line-clamp-2">{vehicle.description}</p>

            <div className="text-xs text-slate-300 space-y-1">
              <p><span className="text-slate-500">Capacity:</span> {vehicle.capacity}</p>
              <p><span className="text-slate-500">Key Features:</span> {vehicle.features.join(', ')}</p>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" /> Wheelchair Lift Certified
              </span>
              <span>Sanitized</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
