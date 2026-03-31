'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Briefcase, MapPin, DollarSign, FileText, Send, Rocket, Globe, Building2, AlertCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { jobService } from '../../services/job.service';
import { Company } from '../../types';
import Link from 'next/link';

export default function PostJobPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [recruiterCompany, setRecruiterCompany] = useState<Company | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        company_id: '',
        location: '',
        salary_range: '',
        job_type: 'Full-time',
        experience_level: 'Mid Level',
        remote: false,
        description: '',
    });

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login?redirect=/post-job');
        } else if (user && user.role === 'candidate') {
            setError('Access Denied: Only recruiters and admins can post jobs.');
        }
    }, [isAuthenticated, authLoading, router, user]);

    useEffect(() => {
        if (isAuthenticated && user?.role === 'recruiter' && user.company_id) {
            setFormData(prev => ({ ...prev, company_id: user.company_id! }));
            setRecruiterCompany({
                id: user.company_id,
                name: user.company_name || '',
                industry: user.company_industry || '',
                location: user.company_location || '',
                description: '',
                website: '',
                logo_url: '',
                creator_id: user.id,
                created_at: ''
            });
        }
    }, [isAuthenticated, user]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.company_id) {
            setError('Please select a company or create one first.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await jobService.createJob(formData);
            setSuccess(true);
            setTimeout(() => router.push('/jobs'), 2000);
        } catch (err: any) {
            console.error('Failed to post job:', err);
            setError(err.response?.data?.detail || 'Failed to post job. Please check all fields.');
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
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Recruiter Only</h1>
                    <p className="text-slate-500 mb-8 font-medium">You are currently registered as a Job Seeker. You need a Recruiter account to post job openings.</p>
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
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-br from-blue-600 to-indigo-700 rounded-3xl mb-6 shadow-xl shadow-blue-500/20 rotate-3">
                        <Rocket className="text-white w-10 h-10" />
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tighter">Expand Your <span className="text-blue-600">Team</span></h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">Fill out the details below to broadcast your opportunity to our global network of top-tier talent.</p>
                </div>

                {success && (
                    <div className="mb-8 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 p-6 rounded-4xl flex items-center gap-4 animate-bounce">
                        <Rocket className="w-6 h-6 shrink-0" />
                        <span className="font-black text-lg">Mission Successful! Your job is being broadcasted...</span>
                    </div>
                )}

                {error && (
                    <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 p-6 rounded-4xl flex items-center gap-4">
                        <AlertCircle className="w-6 h-6 shrink-0" />
                        <span className="font-bold">{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-blue-500/5 border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="p-8 md:p-12 space-y-12">
                        {/* Company & Role */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/40 rounded-xl flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Organization & Title</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Associated Company</label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-6 top-1/2 -translate-y-1/2 text-blue-500 w-5 h-5" />
                                        <div className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-3xl pl-16 pr-6 py-4 font-bold text-slate-500 dark:text-slate-400">
                                            {recruiterCompany ? recruiterCompany.name : 'Attaching Identity...'}
                                        </div>
                                    </div>
                                    <p className="text-[10px] text-slate-400 pl-2 italic">Linked to your professional profile identity.</p>
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Job Title</label>
                                    <div className="relative group">
                                        <Briefcase className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                                        <input
                                            type="text"
                                            name="title"
                                            required
                                            placeholder="e.g. Lead Systems Architect"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl pl-16 pr-6 py-4 outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white"
                                            value={formData.title}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Logistics */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/40 rounded-xl flex items-center justify-center">
                                    <MapPin className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Logistics & Compensation</h2>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Primary Location</label>
                                    <div className="relative group">
                                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                                        <input
                                            type="text"
                                            name="location"
                                            required
                                            placeholder="e.g. Austin, TX (or Hybrid)"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl pl-16 pr-6 py-4 outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white"
                                            value={formData.location}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Salary Range (Annual)</label>
                                    <div className="relative group">
                                        <DollarSign className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-500 transition-colors w-5 h-5" />
                                        <input
                                            type="text"
                                            name="salary_range"
                                            placeholder="e.g. $140k – $180k"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl pl-16 pr-6 py-4 outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white"
                                            value={formData.salary_range}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Contract Type</label>
                                    <div className="relative group">
                                        <select
                                            name="job_type"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl px-6 py-4 outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white appearance-none cursor-pointer"
                                            value={formData.job_type}
                                            onChange={handleChange}
                                        >
                                            <option value="Full-time">Full-time</option>
                                            <option value="Part-time">Part-time</option>
                                            <option value="Contract">Contract</option>
                                            <option value="Internship">Internship</option>
                                        </select>
                                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Experience Priority</label>
                                    <div className="relative group">
                                        <select
                                            name="experience_level"
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-3xl px-6 py-4 outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white appearance-none cursor-pointer"
                                            value={formData.experience_level}
                                            onChange={handleChange}
                                        >
                                            <option value="Entry Level">Entry Level</option>
                                            <option value="Mid Level">Mid Level</option>
                                            <option value="Senior Level">Senior Level</option>
                                            <option value="Lead / Manager">Lead / Manager</option>
                                        </select>
                                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:rotate-180 transition-transform" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-6 bg-blue-50/50 dark:bg-blue-900/20 rounded-4xl border border-blue-100 dark:border-blue-800 transition-all hover:border-blue-300 dark:hover:border-blue-600 group">
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="remote"
                                        className="sr-only peer"
                                        checked={formData.remote}
                                        onChange={handleChange}
                                    />
                                    <div className="w-11 h-6 bg-slate-200 dark:bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                                <span className="text-sm font-black text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-blue-500 group-hover:animate-spin" /> This is a fully remote position (Worldwide)
                                </span>
                            </div>
                        </section>

                        {/* Description */}
                        <section className="space-y-8">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/40 rounded-xl flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Role Context</h2>
                            </div>

                            <div className="space-y-3">
                                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-widest pl-2">Detailed Description (Markdown Supported)</label>
                                <textarea
                                    name="description"
                                    required
                                    rows={10}
                                    placeholder="Outline the daily workflow, key requirements, and unique perks of joining your organization..."
                                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-4xl px-8 py-6 outline-none focus:ring-8 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-bold text-slate-900 dark:text-white resize-none leading-relaxed"
                                    value={formData.description}
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                        </section>
                    </div>

                    <div className="p-12 bg-slate-50/80 dark:bg-slate-950/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="text-slate-500 text-sm font-medium flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-blue-500" /> All transmissions are secured with 256-bit encryption.
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !recruiterCompany}
                            className="w-full md:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-12 py-6 rounded-4xl font-black shadow-2xl shadow-slate-900/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 text-sm uppercase tracking-widest disabled:opacity-50"
                        >
                            {loading ? 'Transmitting...' : (
                                <>Initiate Broadcast <Send className="w-5 h-5" /></>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
