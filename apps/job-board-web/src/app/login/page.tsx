'use client';

import Link from 'next/link';
import { Mail, Lock, LogIn, ArrowRight, Briefcase, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
    const { login, loginWithGoogle } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login({ email, password });
            router.push('/jobs');
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col md:flex-row items-stretch overflow-hidden">
            {/* Visual Side */}
            <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center p-20 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-blue-600/30 to-indigo-900/50"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] -mr-64 -mt-64"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -ml-48 -mb-48"></div>

                <div className="relative z-10 max-w-lg space-y-12 animate-slide-up">
                    <div className="space-y-6">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl shadow-white/10 group group-hover:rotate-12 transition-transform cursor-pointer">
                            <Briefcase className="text-blue-600 w-8 h-8" />
                        </div>
                        <h1 className="text-5xl font-black mb-6 tracking-tighter">Enter the <span className="text-blue-200">Interface</span></h1>
                        <p className="text-xl text-slate-400 font-medium leading-relaxed">Join thousands of companies and millions of developers worldwide building the future.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8 pt-12 border-t border-white/10">
                        <div className="space-y-2">
                            <p className="text-3xl font-black text-white">12k+</p>
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Active roles</p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-3xl font-black text-white">99%</p>
                            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Success rate</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 lg:p-24 relative">
                <div className="w-full max-w-md animate-slide-up">
                    <div className="mb-12">
                        <Link href="/" className="lg:hidden inline-flex items-center gap-2 mb-8">
                            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-xl shadow-blue-500/40">
                                <Briefcase className="text-white w-6 h-6" />
                            </div>
                        </Link>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Welcome Back</h2>
                        <p className="text-lg text-slate-500 font-medium flex items-center gap-2">
                            Welcome back to <span className="text-blue-600 font-black">JobBoard</span>.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {error && (
                            <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-4 rounded-4xl flex items-center gap-3">
                                {error}
                            </div>
                        )}

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors w-5 h-5 pointer-events-none" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@work-email.com"
                                        className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-4xl pl-16 pr-6 py-5 outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold placeholder:text-slate-300 shadow-sm"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Password</label>
                                    <Link href="#" className="text-[11px] font-black text-blue-600 uppercase tracking-widest hover:underline">
                                        Reset Password
                                    </Link>
                                </div>
                                <div className="relative group">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors w-5 h-5 pointer-events-none" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-4xl pl-16 pr-6 py-5 outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold placeholder:text-slate-300 shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 p-1">
                            <input type="checkbox" id="remember" className="w-5 h-5 rounded-lg border-2 border-slate-200 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer" />
                            <label htmlFor="remember" className="text-sm font-bold text-slate-500 cursor-pointer">Keep me logged in for 30 days</label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-6 rounded-4xl font-black shadow-2xl shadow-slate-900/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] text-xs disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : (
                                <>Enter Interface <LogIn className="w-5 h-5" /></>
                            )}
                        </button>

                        <div className="relative flex items-center gap-4 py-2">
                            <div className="grow h-px bg-slate-100 dark:bg-slate-800"></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">or continue with</span>
                            <div className="grow h-px bg-slate-100 dark:bg-slate-800"></div>
                        </div>

                        <div className="flex justify-center">
                            <GoogleLogin
                                onSuccess={async (credentialResponse) => {
                                    if (credentialResponse.credential) {
                                        setLoading(true);
                                        try {
                                            await loginWithGoogle(credentialResponse.credential);
                                            router.push('/jobs');
                                        } catch (err: any) {
                                            setError('Google login failed. Please try again.');
                                        } finally {
                                            setLoading(false);
                                        }
                                    }
                                }}
                                onError={() => {
                                    setError('Google login failed.');
                                }}
                                useOneTap={false}
                                shape="pill"
                                theme="filled_black"
                                width="100%"
                            />
                        </div>
                    </form>

                    <div className="mt-16 pt-10 border-t border-slate-100 dark:border-slate-800 text-center">
                        <p className="text-slate-500 font-bold mb-4">
                            New to our environment?
                        </p>
                        <Link href="/register" className="button-primary inline-flex items-center gap-3 bg-blue-50 text-blue-600 hover:bg-blue-100 border-none shadow-none py-4 px-10">
                            Create New Account <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                <div className="absolute bottom-10 flex items-center gap-4 text-slate-300 font-bold text-[10px] uppercase tracking-widest">
                    <ShieldCheck className="w-4 h-4" /> Secure Auth v2.0
                </div>
            </div>
        </div>
    );
}
