'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { jobService } from '../../services/job.service';
import { Briefcase, Building2, MapPin, Clock, CheckCircle2, XCircle, Loader2, ExternalLink, User } from 'lucide-react';
import Link from 'next/link';

export default function ApplicationsPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const [applications, setApplications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

    useEffect(() => {
        const fetchApplications = async () => {
            if (!isAuthenticated) return;
            setLoading(true);
            try {
                if (user?.role === 'recruiter') {
                    const data = await jobService.getRecruiterApplications();
                    setApplications(data);
                } else {
                    const data = await jobService.getMyApplications();
                    setApplications(data);
                }
            } catch (error) {
                console.error('Failed to fetch applications:', error);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading && isAuthenticated) {
            fetchApplications();
        }
    }, [isAuthenticated, authLoading, user]);

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        setUpdatingId(id);
        try {
            await jobService.updateApplicationStatus(id, newStatus);
            setApplications(prev => prev.map(app =>
                app.id === id ? { ...app, status: newStatus } : app
            ));
        } catch (error) {
            console.error('Failed to update status:', error);
        } finally {
            setUpdatingId(null);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Syncing Registry...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-center">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Identification Required</h1>
                <p className="text-slate-500 mb-8 font-medium">Please login to track your path in the ecosystem.</p>
                <Link href="/login" className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-xl shadow-blue-500/20">Establish Identity</Link>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-16 animate-slide-up">
                    <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
                        {user?.role === 'recruiter' ? 'Talent Pipeline' : 'My Applications'}
                    </h1>
                    <p className="text-lg text-slate-500 font-medium">
                        {user?.role === 'recruiter'
                            ? 'Manage candidates who have applied for your positions.'
                            : 'Track the status of your journey through the ecosystem.'}
                    </p>
                </header>

                <div className="space-y-6 animate-slide-up [animation-delay:100ms]">
                    {applications.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 p-20 rounded-[3rem] shadow-2xl shadow-blue-500/5 text-center border-2 border-dashed border-slate-100 dark:border-slate-800">
                            <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">📡</div>
                            <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">No transmissions found</h3>
                            <p className="text-slate-500 mt-4 text-lg font-medium max-w-xs mx-auto leading-relaxed">
                                {user?.role === 'recruiter'
                                    ? "No talent has entered your pipeline yet. Try promoting your job posts."
                                    : "You haven't applied to any positions yet. Start exploring the board!"}
                            </p>
                            {user?.role !== 'recruiter' && (
                                <Link href="/jobs" className="mt-10 inline-block bg-blue-600 text-white px-10 py-4 rounded-2xl font-black hover:scale-[1.05] transition-all">
                                    Explore Jobs
                                </Link>
                            )}
                        </div>
                    ) : (
                        applications.map((app) => (
                            <div key={app.id} className="bg-white dark:bg-slate-900 p-8 rounded-4xl shadow-xl shadow-blue-500/5 border border-slate-100 dark:border-slate-800 hover:shadow-2xl transition-all relative overflow-hidden group">
                                <div className={`absolute top-0 left-0 w-2 h-full ${app.status === 'accepted' ? 'bg-emerald-500' :
                                    app.status === 'rejected' ? 'bg-red-500' :
                                        app.status === 'reviewing' ? 'bg-blue-500' : 'bg-slate-300'
                                    }`}></div>

                                <div className="flex flex-col md:flex-row items-start justify-between gap-8">
                                    <div className="flex items-start gap-6 grow">
                                        <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800 shadow-sm">
                                            {user?.role === 'recruiter' ? (
                                                <User className="w-8 h-8 text-blue-500" />
                                            ) : (
                                                <Building2 className="w-8 h-8 text-slate-300" />
                                            )}
                                        </div>
                                        <div>
                                            {user?.role === 'recruiter' ? (
                                                <>
                                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                                                        {app.user.full_name}
                                                    </h3>
                                                    <p className="text-blue-600 font-bold uppercase tracking-widest text-[10px] mt-1">
                                                        Applying for: {app.job.title}
                                                    </p>
                                                </>
                                            ) : (
                                                <>
                                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                                                        {app.job.title}
                                                    </h3>
                                                    <p className="text-blue-600 font-bold uppercase tracking-widest text-[10px] mt-1">
                                                        Organization: {app.job.company.name}
                                                    </p>
                                                </>
                                            )}

                                            <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                                <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-300" /> {app.job.location}</span>
                                                <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-slate-300" /> {new Date(app.created_at).toLocaleDateString()}</span>
                                                {user?.role === 'recruiter' && (
                                                    <a href={`mailto:${app.user.email}`} className="flex items-center gap-2 text-blue-500 hover:underline">
                                                        <ExternalLink className="w-4 h-4" /> {app.user.email}
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col items-end gap-6 self-stretch md:self-auto border-t md:border-t-0 pt-6 md:pt-0">
                                        <div className="flex flex-col items-end gap-2">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Live Status</span>
                                            <div className={`px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-sm ${app.status === 'accepted' ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100' :
                                                app.status === 'rejected' ? 'bg-red-50 text-red-600 ring-1 ring-red-100' :
                                                    app.status === 'reviewing' ? 'bg-blue-50 text-blue-600 ring-1 ring-blue-100' :
                                                        'bg-slate-50 text-slate-600 ring-1 ring-slate-100'
                                                }`}>
                                                {app.status}
                                            </div>
                                        </div>

                                        {user?.role === 'recruiter' && app.status === 'applied' && (
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleStatusUpdate(app.id, 'reviewing')}
                                                    disabled={updatingId === app.id}
                                                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-blue-500/20 hover:scale-[1.05] transition-all disabled:opacity-50"
                                                >
                                                    Review
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(app.id, 'accepted')}
                                                    disabled={updatingId === app.id}
                                                    className="bg-emerald-500 text-white p-3 rounded-xl hover:scale-[1.1] transition-all"
                                                >
                                                    <CheckCircle2 className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(app.id, 'rejected')}
                                                    disabled={updatingId === app.id}
                                                    className="bg-red-500 text-white p-3 rounded-xl hover:scale-[1.1] transition-all"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}

                                        {user?.role === 'recruiter' && app.status === 'reviewing' && (
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => handleStatusUpdate(app.id, 'accepted')}
                                                    disabled={updatingId === app.id}
                                                    className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 hover:scale-[1.05] transition-all flex items-center gap-2"
                                                >
                                                    <CheckCircle2 className="w-4 h-4" /> Finalize
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(app.id, 'rejected')}
                                                    disabled={updatingId === app.id}
                                                    className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 p-3 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    <XCircle className="w-5 h-5" />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
