'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { MapPin, Building, DollarSign, Clock, ArrowLeft, Globe, Briefcase, Share2, Bookmark, CheckCircle2, Sparkles, Send, AlertCircle } from 'lucide-react';
import { jobService } from '../../../services/job.service';
import { useAuth } from '../../../context/AuthContext';
import { Job } from '../../../types';

export default function JobDetailPage() {
    const { id } = useParams() as { id: string };
    const { isAuthenticated, user, loading: authLoading, refreshUser } = useAuth();
    const router = useRouter();

    const [job, setJob] = useState<Job | null>(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Check if user has already applied using the applied_job_ids from auth context
    const applied = user?.applied_job_ids?.includes(id) || false;

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const data = await jobService.getJobById(id);
                setJob(data);
            } catch (err) {
                console.error('Failed to fetch job:', err);
                setJob(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchJob();
        }
    }, [id]);

    const handleApply = async () => {
        if (!isAuthenticated) {
            router.push(`/register?redirect=/jobs/${id}`);
            return;
        }

        setApplying(true);
        setError(null);
        try {
            await jobService.applyToJob(id);
            // Refresh user data to update the applied_job_ids list
            await refreshUser();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to submit application. Please try again.');
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-32 px-4 text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-8"></div>
                <p className="text-slate-500 font-black uppercase tracking-widest text-xs animate-pulse">Syncing Opportunity...</p>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
                <div className="w-24 h-24 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-8 text-4xl font-black shadow-xl">!</div>
                <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">Job not found</h1>
                <p className="mt-6 text-xl text-slate-500 max-w-md mx-auto leading-relaxed font-medium">
                    The opportunity you're looking for might have expired or been moved to a new section.
                </p>
                <Link href="/jobs" className="mt-12 bg-blue-600 text-white px-12 py-4 rounded-2xl font-black shadow-2xl shadow-blue-500/40 hover:scale-[1.05] transition-all flex items-center gap-3">
                    <ArrowLeft className="w-5 h-5" /> Back to Explorations
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <nav className="mb-10 animate-slide-up">
                    <Link href="/jobs" className="text-slate-500 hover:text-blue-600 font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-3 group">
                        <div className="w-8 h-8 rounded-full border-2 border-slate-200 flex items-center justify-center group-hover:border-blue-600 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        Back to All Openings
                    </Link>
                </nav>

                <div className="bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl shadow-blue-500/5 border border-slate-100 dark:border-slate-800 overflow-hidden animate-slide-up [animation-delay:100ms]">
                    {/* Hero Header */}
                    <div className="p-10 border-b border-slate-50 dark:border-slate-800 bg-linear-to-br from-white to-blue-50/20 dark:from-slate-900 dark:to-blue-900/10">
                        <div className="flex flex-col md:flex-row gap-10 items-start">
                            <div className="w-24 h-24 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-none flex items-center justify-center border border-slate-100 dark:border-slate-800 shrink-0 animate-float">
                                {job.company.logo_url ? (
                                    <img src={job.company.logo_url} alt={job.company.name} className="object-contain p-3" />
                                ) : (
                                    <Building className="w-10 h-10 text-slate-300" />
                                )}
                            </div>
                            <div className="grow">
                                <div className="flex flex-wrap gap-3 mb-4">
                                    <span className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
                                        {job.job_type}
                                    </span>
                                    {job.remote && (
                                        <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/30">
                                            Remote
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tighter">{job.title}</h1>
                                <div className="flex flex-wrap gap-x-10 gap-y-4 text-xs font-black text-slate-400 uppercase tracking-widest">
                                    <span className="flex items-center gap-3 group cursor-default">
                                        <Building className="w-5 h-5 text-blue-600" /> <span className="underline underline-offset-8 decoration-blue-100 decoration-4">{job.company.name}</span>
                                    </span>
                                    <span className="flex items-center gap-3"><MapPin className="w-5 h-5 text-slate-300" /> {job.location}</span>
                                    <span className="flex items-center gap-3 text-blue-600 dark:text-blue-400"><DollarSign className="w-5 h-5" /> {job.salary_range || 'Competitive'}</span>
                                </div>
                            </div>
                            <div className="w-full md:w-auto flex flex-col gap-4">
                                {applied ? (
                                    <div className="bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-10 py-5 rounded-2xl font-black flex items-center justify-center gap-3 border border-emerald-100 dark:border-emerald-900/50 cursor-not-allowed">
                                        <CheckCircle2 className="w-5 h-5" /> Already Applied
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleApply}
                                        disabled={applying}
                                        className="w-full bg-blue-600 text-white px-10 py-5 rounded-2xl font-black shadow-2xl shadow-blue-500/40 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {applying ? (
                                            <>Submitting...</>
                                        ) : (
                                            <>Apply for this position <Send className="w-4 h-4" /></>
                                        )}
                                    </button>
                                )}
                                {error && (
                                    <div className="text-red-500 text-[10px] font-black uppercase flex items-center gap-2 bg-red-50 p-3 rounded-lg border border-red-100">
                                        <AlertCircle className="w-3 h-3" /> {error}
                                    </div>
                                )}
                                <div className="flex gap-3">
                                    <button className="flex-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 p-4 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest border border-slate-100 dark:border-slate-800">
                                        <Bookmark className="w-4 h-4" /> Save
                                    </button>
                                    <button className="flex-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 p-4 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition-all flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-widest border border-slate-100 dark:border-slate-800">
                                        <Share2 className="w-4 h-4" /> Share
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="p-10 grid grid-cols-1 md:grid-cols-3 gap-16">
                        {/* Main Content */}
                        <div className="md:col-span-2 space-y-12">
                            <section>
                                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-8 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    Role Definition
                                </h2>
                                <div className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg font-medium whitespace-pre-wrap selection:bg-blue-100">
                                    {job.description}
                                </div>
                            </section>

                            <section className="bg-slate-50 dark:bg-slate-800/50 p-10 rounded-4xl border border-slate-100 dark:border-slate-800">
                                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-8 uppercase tracking-widest text-[11px] underline decoration-blue-600 decoration-4 underline-offset-12">Checklist</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                    {[
                                        { label: 'Experience', value: job.experience_level },
                                        { label: 'Location', value: job.location },
                                        { label: 'Job Type', value: job.job_type },
                                        { label: 'Remote', value: job.remote ? 'Available' : 'On-site' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4">
                                            <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter mb-1">{item.label}</p>
                                                <p className="text-slate-900 dark:text-white font-black">{item.value}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="pt-10 border-t border-slate-100 dark:border-slate-800">
                                <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Related Ecosystem</h2>
                                <div className="flex flex-wrap gap-3">
                                    {job.tags.map((tag: any) => (
                                        <span key={tag.id} className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-transparent hover:border-blue-200 hover:text-blue-600 transition-all cursor-default">
                                            #{tag.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="space-y-10">
                            <div className="bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 shadow-xl shadow-blue-500/5">
                                <h3 className="font-black text-slate-900 dark:text-white mb-6 uppercase tracking-widest text-[11px] flex items-center gap-2">
                                    <Building className="w-4 h-4 text-blue-600" /> About Organization
                                </h3>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
                                    {job.company.description || "The organization hasn't provided a detailed description yet, but they are actively building amazing things."}
                                </p>
                                {job.company.website && (
                                    <a
                                        href={job.company.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-4 rounded-xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform"
                                    >
                                        Explore Website <Globe className="w-4 h-4" />
                                    </a>
                                )}
                            </div>

                            <div className="bg-linear-to-br from-indigo-900 to-slate-900 rounded-4xl p-10 text-white shadow-2xl shadow-blue-900/30 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>
                                <div className="relative z-10">
                                    <h3 className="text-2xl font-black mb-4 leading-tight">Ready to join the force?</h3>
                                    <p className="text-slate-400 text-sm font-medium mb-8 leading-relaxed">Secure your profile now to track this application and discover similar roles mapped to your skills.</p>
                                    <Link href="/register" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-sm flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/30">
                                        Join JobBoard <UserPlus className="w-5 h-5" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function UserPlus({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" />
        </svg>
    );
}
