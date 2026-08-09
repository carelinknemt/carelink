import { Link, useForm } from '@inertiajs/react';
import { Head } from '@inertiajs/react';
import {
    ShieldCheck,
    Lock,
    Mail,
    ArrowLeft,
    KeyRound,
    AlertCircle,
    CheckCircle2,
} from 'lucide-react';
import { COMPANY_INFO } from '@/data/carelink';

export default function AdminLogin() {
    const { data, setData, post, processing, errors, setError } = useForm({
        email: '',
        password: '',
    });

    const handleDemoFill = () => {
        setData({ email: 'dispatch@carelink.com', password: 'carelink2026' });
        setError('email', '');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <div className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-slate-950 px-4 py-12 font-sans sm:px-6 lg:px-8">
            <Head title="Dispatch & Admin Login">
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-[#E64A19]/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-40 -bottom-40 h-96 w-96 rounded-full bg-[#004B87]/20 blur-3xl" />

            <div className="relative z-10 space-y-6 sm:mx-auto sm:w-full sm:max-w-md">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 transition-colors hover:text-[#E64A19]"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Public Website</span>
                </Link>

                <div className="space-y-3 text-center">
                    <div className="inline-block rounded-2xl border border-slate-800 bg-white p-3 shadow-xl">
                        <img
                            src={COMPANY_INFO.logoUrl}
                            alt={COMPANY_INFO.name}
                            className="h-10 w-auto object-contain"
                            referrerPolicy="no-referrer"
                        />
                    </div>
                    <h2 className="text-2xl font-black tracking-tight text-white">
                        Dispatch & Admin Portal
                    </h2>
                    <p className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
                        <ShieldCheck className="h-4 w-4 text-[#E64A19]" />
                        <span>
                            Encrypted Station • Route URL:{' '}
                            <code className="rounded border border-slate-800 bg-slate-900 px-1.5 py-0.5 text-orange-300">
                                /admin
                            </code>
                        </span>
                    </p>
                </div>

                <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-900 px-6 py-8 shadow-2xl">
                    {(errors.email || errors.password) && (
                        <div className="flex items-center gap-2.5 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
                            <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
                            <span>
                                {errors.email ||
                                    errors.password ||
                                    'Invalid dispatch credentials.'}
                            </span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="mb-1.5 block text-xs font-bold text-slate-300">
                                Admin Email / Dispatch ID
                            </label>
                            <div className="relative">
                                <Mail className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="email"
                                    required
                                    value={data.email}
                                    onChange={(e) =>
                                        setData('email', e.target.value)
                                    }
                                    placeholder="dispatch@carelink.com"
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pr-4 pl-10 text-xs text-white placeholder-slate-500 transition-all focus:border-[#E64A19] focus:ring-1 focus:ring-[#E64A19] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="mb-1.5 block text-xs font-bold text-slate-300">
                                Security Passcode
                            </label>
                            <div className="relative">
                                <Lock className="absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-500" />
                                <input
                                    type="password"
                                    required
                                    value={data.password}
                                    onChange={(e) =>
                                        setData('password', e.target.value)
                                    }
                                    placeholder="••••••••••••"
                                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-2.5 pr-4 pl-10 text-xs text-white placeholder-slate-500 transition-all focus:border-[#E64A19] focus:ring-1 focus:ring-[#E64A19] focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <label className="flex cursor-pointer items-center gap-2">
                                <input
                                    type="checkbox"
                                    defaultChecked
                                    className="rounded border-slate-700 bg-slate-950 text-[#E64A19] focus:ring-[#E64A19]"
                                />
                                <span>Keep dispatch session active</span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E64A19] py-3 text-xs font-black text-white shadow-lg shadow-orange-900/30 transition-all hover:bg-[#d83f0e] focus:outline-none active:scale-95 disabled:opacity-50"
                        >
                            {processing ? (
                                <span>Authenticating Station...</span>
                            ) : (
                                <>
                                    <KeyRound className="h-4 w-4 text-orange-200" />
                                    <span>Sign In to Bambi Dispatch</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="space-y-2 border-t border-slate-800 pt-4 text-center">
                        <span className="block text-[11px] text-slate-400">
                            Authorized Staff Preview Access:
                        </span>
                        <button
                            type="button"
                            onClick={handleDemoFill}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-orange-800/60 bg-orange-950/60 px-3 py-1.5 text-xs font-bold text-orange-400 transition-all hover:text-orange-300"
                        >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Auto-fill Demo Admin Credentials</span>
                        </button>
                    </div>
                </div>

                <p className="text-center text-[10px] text-slate-500">
                    Carelink Medical Transportation LLC • Secure Dispatch System
                    • Restricted Access
                </p>
            </div>
        </div>
    );
}
