import { Ambulance, CheckCircle2, Clock, ShieldCheck, Car, DollarSign } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { DispatchTable } from '../../components/admin/DispatchTable';
import { FleetStatusCard } from '../../components/admin/FleetStatusCard';
import { ServiceRatesEditor } from '../../components/admin/ServiceRatesEditor';
import { DispatchService } from '../../services/dispatchService';
import type { RideBooking } from '../../types';

interface CMSPageProps {
  onBackToHome: () => void;
  onLogout?: () => void;
}

export const CMSPage: React.FC<CMSPageProps> = ({ onBackToHome, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'DISPATCH' | 'FLEET' | 'SERVICES'>('DISPATCH');
  const [bookings, setBookings] = useState<RideBooking[]>([]);

  useEffect(() => {
    setBookings(DispatchService.getBookings());
  }, []);

  const handleStatusChange = (id: string, newStatus: RideBooking['status']) => {
    const updated = DispatchService.updateBookingStatus(id, newStatus);
    setBookings(updated);
  };

  const handleRefresh = () => {
    setBookings(DispatchService.getBookings());
  };

  const activeRidesCount = bookings.filter((b) => b.status === 'IN ROUTE' || b.status === 'CONFIRMED').length;
  const pendingRidesCount = bookings.filter((b) => b.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-100 flex flex-col">
      <AdminHeader
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onBackToHome={onBackToHome}
        onLogout={onLogout}
        onRefresh={handleRefresh}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-[#E64A19] border border-orange-500/20">
              <Ambulance className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400">Active Scheduled Trips</p>
              <h3 className="text-xl font-black text-white">{activeRidesCount} Rides</h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400">Pending Review</p>
              <h3 className="text-xl font-black text-white">{pendingRidesCount} Requests</h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Car className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400">Active Humboldt Fleet</p>
              <h3 className="text-xl font-black text-white">4 Wheelchair Units</h3>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 text-[#E64A19] border border-orange-500/20">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-slate-400">Bambi Dispatch Integration</p>
              <h3 className="text-xl font-black text-white">Connected</h3>
            </div>
          </div>
        </div>

        {/* Tab View Content */}
        {activeTab === 'DISPATCH' && (
          <DispatchTable bookings={bookings} onStatusChange={handleStatusChange} />
        )}

        {activeTab === 'FLEET' && <FleetStatusCard />}

        {activeTab === 'SERVICES' && <ServiceRatesEditor />}
      </main>
    </div>
  );
};
