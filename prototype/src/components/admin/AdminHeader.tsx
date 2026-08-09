import { ShieldCheck, LogOut, ArrowLeft, RefreshCw } from 'lucide-react';
import React from 'react';
import { COMPANY_INFO } from '../../data/carelinkData';

interface AdminHeaderProps {
  activeTab: 'DISPATCH' | 'FLEET' | 'SERVICES';
  setActiveTab: (tab: 'DISPATCH' | 'FLEET' | 'SERVICES') => void;
  onBackToHome: () => void;
  onLogout?: () => void;
  onRefresh?: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTab,
  setActiveTab,
  onBackToHome,
  onLogout,
  onRefresh,
}) => {
  return (
    <div className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Brand & Back */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
            <button
              onClick={onBackToHome}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#E64A19] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Public Site</span>
            </button>

            <div className="h-4 w-px bg-slate-800 hidden md:block" />

            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white p-1.5 shadow-sm border border-slate-700">
                <img
                  src={COMPANY_INFO.logoWithTextUrl}
                  alt={COMPANY_INFO.name}
                  className="h-7 w-auto object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                  <span>Dispatch CMS</span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-500/10 text-orange-400 border border-orange-500/30">
                    <ShieldCheck className="h-3 w-3 text-[#E64A19]" /> Live Station
                  </span>
                </h1>
                <p className="text-[10px] text-slate-400">Bambi System Integrated Control</p>
              </div>
            </div>
          </div>

          {/* Center/Right: Tabs & Actions */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-1.5 bg-slate-800 p-1.5 rounded-2xl border border-slate-700">
              {[
                { id: 'DISPATCH', label: 'Live Rides' },
                { id: 'FLEET', label: 'Fleet Status' },
                { id: 'SERVICES', label: 'Rate Sheets' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                    activeTab === tab.id
                      ? 'bg-[#E64A19] text-white shadow shadow-orange-900/40'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {onRefresh && (
              <button
                onClick={onRefresh}
                className="p-2 rounded-xl bg-slate-800 text-slate-300 hover:text-[#E64A19] border border-slate-700 transition-colors"
                title="Refresh Dispatch Feed"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            )}

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/10 text-rose-300 border border-rose-500/30 text-xs font-bold hover:bg-rose-500/20 transition-all shrink-0"
                title="Log Out Station"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Log Out</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
