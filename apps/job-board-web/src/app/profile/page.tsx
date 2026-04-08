'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth.service';
import { User, UserUpdateData } from '../../types';
import { User as UserIcon, Mail, Building2, Briefcase, MapPin, Save, AlertCircle, CheckCircle2, Lock, Camera, ArrowRight, Globe, AlignLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState<UserUpdateData>({
        full_name: '',
        email: '',
        password: '',
        company_name: '',
        company_industry: '',
        company_location: '',
        company_description: '',
        company_website: '',
    });

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login?redirect=/profile');
        } else if (user) {
            setFormData({
                full_name: user.full_name || '',
                email: user.email || '',
                password: '',
                company_name: user.company_name || '',
                company_industry: user.company_industry || '',
                company_location: user.company_location || '',
                company_description: user.company_description || '',
                company_website: user.company_website || '',
            });
        }
    }, [user, authLoading, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            // Clean up the data to only send non-empty fields
            const updateData: UserUpdateData = {};
            if (formData.full_name) updateData.full_name = formData.full_name;
            if (formData.email) updateData.email = formData.email;
            if (formData.password) updateData.password = formData.password;

            if (user?.role === 'recruiter') {
                if (formData.company_name) updateData.company_name = formData.company_name;
                if (formData.company_industry) updateData.company_industry = formData.company_industry;
                if (formData.company_location) updateData.company_location = formData.company_location;
                if (formData.company_description) updateData.company_description = formData.company_description;
                if (formData.company_website) updateData.company_website = formData.company_website;
            }

            await authService.updateMe(updateData);
            setSuccess('Profile updated effectively. Security protocols refreshed.');
            // Clear password after update
            setFormData(prev => ({ ...prev, password: '' }));
        } catch (err: any) {
            console.error('Update failed:', err);
            setError(err.response?.data?.detail || 'Failed to update profile. Verification error.');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-10 mb-12 animate-slide-up">
                    <div className="relative group">
                        <div className="w-32 h-32 bg-linear-to-br from-blue-600 to-indigo-700 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-500/30 group-hover:rotate-6 transition-all duration-500">
                            <UserIcon className="text-white w-14 h-14" />
                        </div>
                        <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-white dark:bg-slate-800 rounded-2xl shadow-xl flex items-center justify-center border-2 border-slate-50 dark:border-slate-700 hover:scale-110 transition-transform">
                            <Camera className="w-5 h-5 text-blue-600" />
                        </button>
                    </div>
                    <div className="text-center md:text-left">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                            <span className="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                                {user?.role.replace('_', ' ')}
                            </span>
                            <span className="text-slate-400 text-xs font-bold flex items-center gap-1">
                                Verified Hub Member <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            </span>
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
                            Profile <span className="text-blue-600">Architecture</span>
                        </h1>
                        <p className="text-slate-500 font-medium text-lg">Manage your digital presence and recruitment identity.</p>
                    </div>
                </div>

                {success && (
                    <div className="mb-8 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 p-6 rounded-3xl flex items-center gap-4 animate-bounce">
                        <CheckCircle2 className="w-6 h-6 shrink-0" />
                        <span className="font-black">{success}</span>
                    </div>
                )}

                {error && (
                    <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-6 rounded-3xl flex items-center gap-4">
                        <AlertCircle className="w-6 h-6 shrink-0" />
                        <span className="font-bold">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8 animate-slide-up [animation-delay:100ms]">
                    <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-8 md:p-12 space-y-12">
                            {/* Personal Details */}
                            <section className="space-y-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
                                        <Briefcase className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Core Identity</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Full Name</label>
                                        <div className="relative group">
                                            <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
                                            <input
                                                type="text"
                                                name="full_name"
                                                placeholder="Digital Signature"
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl pl-16 pr-6 py-4 outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white"
                                                value={formData.full_name}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Email Synchronizer</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors w-5 h-5" />
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="sync@digital.com"
                                                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl pl-16 pr-6 py-4 outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="space-y-8">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center">
                                        <Lock className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Security Access</h2>
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Update Access Link (Password)</label>
                                    <div className="relative group">
                                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors w-5 h-5" />
                                        <input
                                            type="password"
                                            name="password"
                                            placeholder="Leave vacant to maintain status quo"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl pl-16 pr-6 py-4 outline-none focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all font-bold text-slate-900 dark:text-white"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </section>

                            {/* Recruiter specific fields */}
                            {user?.role === 'recruiter' && (
                                <section className="space-y-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center">
                                            <Building2 className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Organization Identity</h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-3">
                                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Company Entity</label>
                                            <div className="relative group">
                                                <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
                                                <input
                                                    type="text"
                                                    name="company_name"
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl pl-16 pr-6 py-4 outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-bold text-slate-900 dark:text-white"
                                                    value={formData.company_name}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Industry Sector</label>
                                            <div className="relative group">
                                                <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
                                                <input
                                                    type="text"
                                                    name="company_industry"
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl pl-16 pr-6 py-4 outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-bold text-slate-900 dark:text-white"
                                                    value={formData.company_industry}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-3">
                                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Corporate Headquarters</label>
                                            <div className="relative group">
                                                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
                                                <input
                                                    type="text"
                                                    name="company_location"
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl pl-16 pr-6 py-4 outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-bold text-slate-900 dark:text-white"
                                                    value={formData.company_location}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-3">
                                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Corporate Narrative (Description)</label>
                                            <div className="relative group">
                                                <AlignLeft className="absolute left-6 top-6 text-slate-300 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
                                                <textarea
                                                    name="company_description"
                                                    rows={4}
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl pl-16 pr-6 py-4 outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-bold text-slate-900 dark:text-white resize-none"
                                                    value={formData.company_description}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-3">
                                            <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Digital Portal (Website)</label>
                                            <div className="relative group">
                                                <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-emerald-500 transition-colors w-5 h-5" />
                                                <input
                                                    type="url"
                                                    name="company_website"
                                                    placeholder="https://organization.com"
                                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl pl-16 pr-6 py-4 outline-none focus:ring-8 focus:ring-emerald-500/5 focus:border-emerald-500 transition-all font-bold text-slate-900 dark:text-white"
                                                    value={formData.company_website}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            )}
                        </div>

                        <div className="p-12 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div className="text-slate-500 text-sm font-medium flex items-center gap-3 max-w-sm">
                                <AlertCircle className="w-5 h-5 text-blue-500 shrink-0" />
                                Any adjustments to your identity will be reflected across all active broadcasts and applications in real-time.
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full md:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-12 py-6 rounded-4xl font-black shadow-2xl shadow-slate-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 text-sm uppercase tracking-widest disabled:opacity-50"
                            >
                                {loading ? 'Synchronizing...' : (
                                    <>Commit Adjustments <Save className="w-5 h-5" /></>
                                )}
                            </button>
                        </div>
                    </div>
                </form>

                <div className="mt-12 flex items-center justify-center gap-6 animate-slide-up [animation-delay:200ms]">
                    <button onClick={() => router.push('/dashboard')} className="text-slate-500 hover:text-slate-900 dark:hover:text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 transition-colors">
                        Return to Command Center <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
