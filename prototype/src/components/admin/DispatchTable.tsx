import { Search, Filter, Phone, MapPin, Calendar, Clock, DollarSign, ShieldCheck } from 'lucide-react';
import React, { useState } from 'react';
import type { RideBooking } from '../../types';
import { getStatusBadgeColor } from '../../utils/formatters';

interface DispatchTableProps {
  bookings: RideBooking[];
  onStatusChange: (id: string, newStatus: RideBooking['status']) => void;
}

export const DispatchTable: React.FC<DispatchTableProps> = ({ bookings, onStatusChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.destinationAddress.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = statusFilter === 'ALL' || b.status === statusFilter;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 space-y-6 shadow-2xl">
      {/* Search & Filters Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search passenger, ID, or route..."
            className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="h-4 w-4 text-slate-500 shrink-0" />
          {['ALL', 'PENDING_DISPATCH', 'BAMBI_DISPATCHED', 'IN_TRANSIT', 'COMPLETED'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold shrink-0 transition-all ${
                statusFilter === status
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-800">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider font-extrabold border-b border-slate-800">
            <tr>
              <th className="py-3.5 px-4">Trip ID & Passenger</th>
              <th className="py-3.5 px-4">Schedule & Service</th>
              <th className="py-3.5 px-4">Pickup / Destination</th>
              <th className="py-3.5 px-4">Cost / Payment</th>
              <th className="py-3.5 px-4">Dispatch Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 bg-slate-900/50">
            {filteredBookings.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-slate-500 text-xs">
                  No medical transport records match your query.
                </td>
              </tr>
            ) : (
              filteredBookings.map((trip) => (
                <tr key={trip.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-4 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-cyan-400 text-[11px]">{trip.id}</span>
                      <span className="text-white font-bold">{trip.passengerName}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                      <Phone className="h-3 w-3" />
                      <span>{trip.phone}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1.5 text-slate-200 font-semibold">
                      <Calendar className="h-3.5 w-3.5 text-cyan-400" />
                      <span>{trip.rideDate}</span>
                      <Clock className="h-3.5 w-3.5 text-cyan-400 ml-1" />
                      <span>{trip.rideTime}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-400 font-medium">
                      <ShieldCheck className="h-3 w-3" />
                      <span>{trip.serviceType}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4 max-w-xs">
                    <div className="flex items-start gap-1.5 text-slate-300">
                      <MapPin className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="truncate">{trip.pickupAddress}</span>
                    </div>
                    <div className="flex items-start gap-1.5 text-slate-400 mt-1">
                      <MapPin className="h-3.5 w-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span className="truncate">{trip.destinationAddress}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <div className="font-bold text-white flex items-center gap-0.5">
                      <DollarSign className="h-3.5 w-3.5 text-emerald-400" />
                      <span>{trip.estimatedCost || 0}</span>
                      <span className="text-[10px] text-slate-400 font-normal">({trip.isRoundTrip ? 'Round Trip' : 'One Way'})</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{trip.paymentMethod}</div>
                  </td>

                  <td className="py-4 px-4">
                    <select
                      value={trip.status}
                      onChange={(e) => onStatusChange(trip.id, e.target.value as any)}
                      className={`rounded-lg px-2.5 py-1 text-[11px] font-bold border focus:outline-none transition-colors ${getStatusBadgeColor(
                        trip.status
                      )}`}
                    >
                      <option value="PENDING_DISPATCH" className="bg-slate-900 text-white">PENDING DISPATCH</option>
                      <option value="BAMBI_DISPATCHED" className="bg-slate-900 text-white">BAMBI DISPATCHED</option>
                      <option value="IN_TRANSIT" className="bg-slate-900 text-white">IN TRANSIT</option>
                      <option value="COMPLETED" className="bg-slate-900 text-white">COMPLETED</option>
                    </select>
                    {trip.bambiDispatchRef && (
                      <div className="text-[10px] text-slate-400 mt-1 truncate">
                        {trip.bambiDispatchRef}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
