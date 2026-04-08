'use client';

import Link from 'next/link';
import { Mail, Lock, User, ArrowLeft, ArrowRight, Briefcase, Building2, ShieldCheck, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '../../services/auth.service';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../../context/AuthContext';

export default function RegisterPage() {
    const [role, setRole] = useState<'candidate' | 'recruiter'>('candidate');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companyIndustry, setCompanyIndustry] = useState('');
    const [companyLocation, setCompanyLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { loginWithGoogle } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.register({
                full_name: fullName,
                email: email,
                password: password,
                role: role,
                company_name: role === 'recruiter' ? companyName : undefined,
                company_industry: role === 'recruiter' ? companyIndustry : undefined,
                company_location: role === 'recruiter' ? companyLocation : undefined,
            });
            router.push('/login?registered=true');
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.response?.data?.detail || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#fafafa] dark:bg-[#050505] flex items-center justify-center p-6 selection:bg-blue-100 dark:selection:bg-blue-900/30">
            {/* Background Mesh Gradient */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/5 blur-[120px] dark:bg-blue-500/10 transition-colors duration-1000"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/5 blur-[120px] dark:bg-indigo-500/10 transition-colors duration-1000"></div>
            </div>

            <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 gap-0 bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-100 dark:border-white/5 overflow-hidden z-10 transition-all duration-500">

                {/* Left Panel: Context & Features */}
                <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-50/50 dark:bg-white/5 border-r border-slate-100 dark:border-white/5">
                    <div>
                        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-300 group mb-12">
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span className="text-xs font-bold uppercase tracking-widest text-[10px]">Back to Ecosystem</span>
                        </Link>

                        <div className="space-y-6">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Sparkles className="text-white w-6 h-6" />
                            </div>
                            <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
                                Accelerate your <br />
                                <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">career journey.</span>
                            </h1>
                            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg max-w-[280px]">
                                Join thousands of professionals finding their next big opportunity.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-5">
                        {[
                            { title: "Advanced Matching", desc: "AI-driven role discovery" },
                            { title: "Verified Identity", desc: "Trust-first professional network" },
                            { title: "Instant Apply", desc: "One-click application protocol" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 group">
                                <div className="mt-1 w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                                    <CheckCircle2 className="w-3 h-3" />
                                </div>
                                <div>
                                    <h4 className="text-sm font-black text-slate-800 dark:text-slate-200">{item.title}</h4>
                                    <p className="text-xs text-slate-500 font-medium">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 pt-8 border-t border-slate-200/50 dark:border-white/5">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 overflow-hidden">
                                    <img src={`https://i.pravatar.cc/100?u=${i + 10}`} alt="User" className="w-full h-full object-cover" />
                                </div>
                            ))}
                        </div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Joined by 2k+ members this week
                        </span>
                    </div>
                </div>

                {/* Right Panel: Form */}
                <div className="p-8 md:p-12 lg:p-14 overflow-y-auto max-h-[90vh]">
                    <div className="flex items-center justify-between mb-10">
                        <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white uppercase">Identity Startup</h2>
                        <div className="lg:hidden">
                            <Link href="/" className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Minimalist Role Switcher */}
                    <div className="flex p-1.5 bg-slate-100/50 dark:bg-white/5 rounded-2xl mb-10 border border-slate-200/50 dark:border-white/5">
                        <button
                            type="button"
                            onClick={() => setRole('candidate')}
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider transition-all duration-300 rounded-xl ${role === 'candidate'
                                ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            Candidate
                        </button>
                        <button
                            type="button"
                            onClick={() => setRole('recruiter')}
                            className={`flex-1 py-3 text-[10px] font-black uppercase tracking-wider transition-all duration-300 rounded-xl ${role === 'recruiter'
                                ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-sm'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            Recruiter
                        </button>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 text-red-600 dark:text-red-400 text-xs font-bold animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-5">
                            <div className="relative group">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Personal Descriptor</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Full Name"
                                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-sm"
                                    />
                                </div>
                            </div>

                            <div className="relative group">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Verified Gateway (Email)</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="Email Address"
                                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-sm"
                                    />
                                </div>
                            </div>

                            <div className="relative group">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Access Credential (Password)</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-sm"
                                    />
                                </div>
                            </div>

                            {role === 'recruiter' && (
                                <div className="space-y-5 pt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="h-px bg-slate-100 dark:bg-white/5 w-full"></div>
                                    <div className="relative group">
                                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Organization Alias</label>
                                        <div className="relative">
                                            <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                            <input
                                                type="text"
                                                required
                                                value={companyName}
                                                onChange={(e) => setCompanyName(e.target.value)}
                                                placeholder="Company Name"
                                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl pl-12 pr-4 py-4 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="relative group">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Industry</label>
                                            <input
                                                type="text"
                                                required
                                                value={companyIndustry}
                                                onChange={(e) => setCompanyIndustry(e.target.value)}
                                                placeholder="e.g Tech"
                                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl px-4 py-4 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-sm"
                                            />
                                        </div>
                                        <div className="relative group">
                                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">HQ Location</label>
                                            <input
                                                type="text"
                                                required
                                                value={companyLocation}
                                                onChange={(e) => setCompanyLocation(e.target.value)}
                                                placeholder="e.g NYC"
                                                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl px-4 py-4 outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black dark:bg-white text-white dark:text-black py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed group flex items-center justify-center gap-3 mt-4"
                        >
                            {loading ? 'Initializing...' : (
                                <>
                                    Establish Account
                                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>

                        <div className="relative flex items-center justify-center py-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full h-px bg-slate-100 dark:bg-white/5"></div>
                            </div>
                            <span className="relative px-4 bg-white dark:bg-[#0a0a0a] text-[9px] font-black text-slate-400 uppercase tracking-widest">or integrate via</span>
                        </div>

                        <div className="flex flex-col items-center w-full transition-all duration-300 hover:scale-[1.01]">
                            <div className="w-full flex justify-center">
                                <GoogleLogin
                                    onSuccess={async (credentialResponse) => {
                                        if (credentialResponse.credential) {
                                            setLoading(true);
                                            try {
                                                await loginWithGoogle(credentialResponse.credential);
                                                router.push('/jobs');
                                            } catch (err: any) {
                                                setError('Google integration failed.');
                                            } finally {
                                                setLoading(false);
                                            }
                                        }
                                    }}
                                    onError={() => setError('Google integration failed.')}
                                    shape="pill"
                                    theme="outline"
                                    width="280"
                                />
                            </div>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-xs font-medium text-slate-400">
                        Existing member? {' '}
                        <Link href="/login" className="text-blue-600 font-bold hover:underline decoration-2 underline-offset-4">
                            Validate Access
                        </Link>
                    </p>
                </div>
            </div>

            <div className="fixed bottom-6 text-center z-10 hidden md:block">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
                    <ShieldCheck className="w-3 h-3 text-emerald-500" />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">End-to-end encrypted registration protocol</span>
                </div>
            </div>
        </div>
    );
}
