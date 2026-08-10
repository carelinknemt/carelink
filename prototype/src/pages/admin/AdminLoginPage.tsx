import { ShieldCheck, Lock, Mail, ArrowLeft, KeyRound, AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import { COMPANY_INFO } from '../../data/carelinkData';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onBackToHome }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (email.trim() !== '' && password.trim() !== '') {
        if (password.length >= 4) {
          setIsLoading(false);
          onLoginSuccess();

          return;
        }
      }

      setIsLoading(false);
      setError('Invalid dispatch credentials. Please contact your station administrator.');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#E64A19]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#004B87]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 space-y-6">
        <button
          onClick={onBackToHome}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-[#E64A19] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Public Website</span>
        </button>

        <div className="text-center space-y-3">
          <div className="inline-block rounded-2xl bg-white p-3 shadow-xl border border-slate-800">
            <img
              src={COMPANY_INFO.logoWithTextUrl}
              alt={COMPANY_INFO.name}
              className="h-10 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">
            Dispatch & Admin Portal
          </h2>
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-[#E64A19]" />
            <span>Encrypted Station • Route URL: <code className="bg-slate-900 text-orange-300 px-1.5 py-0.5 rounded border border-slate-800">/#admin</code></span>
          </p>
        </div>

        <div className="bg-slate-900 py-8 px-6 shadow-2xl rounded-3xl border border-slate-800 space-y-6">
          {error && (
            <div className="rounded-2xl bg-rose-500/10 border border-rose-500/30 p-4 text-xs text-rose-300 flex items-center gap-2.5">
              <AlertCircle className="h-5 w-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Admin Email / Dispatch ID
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dispatch@carelinknemt.com"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-[#E64A19] focus:outline-none focus:ring-1 focus:ring-[#E64A19] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                Security Passcode
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 focus:border-[#E64A19] focus:outline-none focus:ring-1 focus:ring-[#E64A19] transition-all"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-slate-700 bg-slate-950 text-[#E64A19] focus:ring-[#E64A19]" />
                <span>Keep dispatch session active</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 rounded-xl bg-[#E64A19] py-3 text-xs font-black text-white shadow-lg shadow-orange-900/30 hover:bg-[#d83f0e] focus:outline-none active:scale-95 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span>Authenticating Station...</span>
              ) : (
                <>
                  <KeyRound className="h-4 w-4 text-orange-200" />
                  <span>Sign In to Bambi Dispatch</span>
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center space-y-2">
            <span className="text-[11px] text-slate-400 block">Authorized Staff Preview Access</span>
          </div>
        </div>

        <p className="text-center text-[10px] text-slate-500">
          Carelink Medical Transportation LLC • Secure Dispatch System • Restricted Access
        </p>
      </div>
    </div>
  );
};
