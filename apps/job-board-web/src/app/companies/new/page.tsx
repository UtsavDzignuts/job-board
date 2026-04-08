'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Globe, FileText, Send, MapPin, Briefcase, AlertCircle, Camera } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { jobService } from '../../../services/job.service';
import Link from 'next/link';

export default function NewCompanyPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        website: '',
        logo_url: '',
        industry: '',
        location: '',
    });

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login?redirect=/companies/new');
        } else if (user && user.role === 'candidate') {
            setError('Access Denied: Only recruiters and admins can create companies.');
        }
    }, [isAuthenticated, authLoading, router, user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await jobService.createCompany(formData);
            setSuccess(true);
            // After successful creation, redirect to post-job
            setTimeout(() => router.push('/post-job'), 2000);
        } catch (err: any) {
            console.error('Failed to create company:', err);
            setError(err.response?.data?.detail || 'Failed to create company. Please check all fields.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (user && user.role === 'candidate') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6 text-center">
                <div className="max-w-md bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800">
                    <div className="w-20 h-20 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-10 h-10 text-red-600" />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Unauthorized</h1>
                    <p className="text-slate-500 mb-8 font-medium">Companies can only be established by recruiters or administrators.</p>
                    <Link href="/dashboard" className="inline-block bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest">
                        Return to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto animate-slide-up">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-indigo-600 to-blue-700 rounded-3xl mb-6 shadow-xl shadow-indigo-500/20 -rotate-3">
                        <Building2 className="text-white w-10 h-10" />
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">Register Your <span className="text-indigo-600">Company</span></h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">Establish your brand identity in our ecosystem to start attracting global talent.</p>
                </div>

                {success && (
                    <div className="mb-8 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 p-6 rounded-4xl flex items-center gap-4 animate-bounce">
                        <Building2 className="w-6 h-6 shrink-0" />
                        <span className="font-black text-lg">Identity Established! Redirecting to recruitment center...</span>
                    </div>
                )}

                {error && (
                    <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-6 rounded-4xl flex items-center gap-4">
                        <AlertCircle className="w-6 h-6 shrink-0" />
                        <span className="font-bold">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-indigo-500/5 border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="p-8 md:p-12 space-y-12">
                        {/* Identity section */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center">
                                    <Briefcase className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Brand Identity</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Company Name</label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors w-5 h-5" />
                                        <input
                                            type="text"
                                            name="name"
                                            required
                                            placeholder="e.g. Acme Corporation"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl pl-16 pr-6 py-4 outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-slate-900 dark:text-white"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Industry Sector</label>
                                    <div className="relative group">
                                        <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-500 transition-colors w-5 h-5" />
                                        <input
                                            type="text"
                                            name="industry"
                                            placeholder="e.g. Fintech / AI / SaaS"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl pl-16 pr-6 py-4 outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-slate-900 dark:text-white"
                                            value={formData.industry}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Presence section */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
                                    <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Global Presence</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Headquarters Location</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                                        <input
                                            type="text"
                                            name="location"
                                            required
                                            placeholder="e.g. London, UK"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl pl-16 pr-6 py-4 outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white"
                                            value={formData.location}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Official Website (URL)</label>
                                    <div className="relative group">
                                        <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                                        <input
                                            type="url"
                                            name="website"
                                            placeholder="https://acme.org"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl pl-16 pr-6 py-4 outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white"
                                            value={formData.website}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Logo Resource (URL)</label>
                                <div className="relative group">
                                    <Camera className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                                    <input
                                        type="url"
                                        name="logo_url"
                                        placeholder="https://acme.org/logo.png"
                                        className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl pl-16 pr-6 py-4 outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white"
                                        value={formData.logo_url}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </section>

                        {/* Bio section */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Mission & Context</h2>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Company Overview</label>
                                <textarea
                                    name="description"
                                    required
                                    rows={6}
                                    placeholder="Describe your company's mission, values, and why talent should join your organization..."
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-4xl px-8 py-6 outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-bold text-slate-900 dark:text-white resize-none leading-relaxed"
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </section>
                    </div>

                    <div className="p-12 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-slate-500 text-sm font-medium flex items-center gap-2 max-w-sm">
                            <AlertCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                            Registering your company will allow you to associate it with future job broadcasts.
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-12 py-6 rounded-4xl font-black shadow-2xl shadow-slate-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 text-sm uppercase tracking-widest disabled:opacity-50"
                        >
                            {loading ? 'Processing...' : (
                                <>Verify & Establish <Send className="w-5 h-5" /></>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
