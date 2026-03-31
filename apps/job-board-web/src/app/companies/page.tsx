'use client';

import { useState, useEffect } from 'react';
import { Building2, Globe, MapPin, Briefcase, PlusCircle, Search, Rocket, ArrowRight } from 'lucide-react';
import { jobService } from '../../services/job.service';
import { Company } from '../../types';
import { useAuth } from '../../context/AuthContext';
import Link from 'next/link';

export default function CompaniesPage() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const data = await jobService.getCompanies();
                setCompanies(data);
            } catch (err) {
                console.error('Failed to fetch companies:', err);
                setError('Failed to load companies. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 animate-slide-up">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest mb-6">
                            <Rocket className="w-3.5 h-3.5" /> Featured Organizations
                        </div>
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 leading-tight">
                            Build your career with <span className="text-blue-600">Industry Leaders</span>
                        </h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed">
                            Discover innovative companies hiring top talent. From agile startups to global enterprises.
                        </p>
                    </div>

                    {user?.role === 'admin' && (
                        <Link
                            href="/companies/new"
                            className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black shadow-2xl shadow-slate-900/10 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-3 text-sm uppercase tracking-widest"
                        >
                            <PlusCircle className="w-5 h-5" /> Register Company
                        </Link>
                    )}
                </div>

                {error ? (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 p-8 rounded-[2.5rem] text-center font-bold">
                        {error}
                    </div>
                ) : companies.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 p-20 rounded-[3.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 text-center flex flex-col items-center animate-fade-in">
                        <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-8">
                            <Building2 className="w-12 h-12 text-slate-300" />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">No companies yet.</h2>
                        <p className="text-slate-500 max-w-md mx-auto mb-10 font-medium text-lg leading-relaxed">
                            Our network is currently expanding. Be the first to establish an organization and start broadcasting opportunities.
                        </p>
                        {(user?.role === 'recruiter' || user?.role === 'admin') ? (
                            <Link
                                href="/companies/new"
                                className="button-primary px-10 py-4 flex items-center gap-3"
                            >
                                <PlusCircle className="w-5 h-5" /> Register New Company
                            </Link>
                        ) : (
                            <Link href="/jobs" className="text-blue-600 font-black flex items-center gap-2 hover:underline">
                                Browse Available Jobs <ArrowRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {companies.map((company, idx) => (
                            <div
                                key={company.id}
                                className="group bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 hover:-translate-y-2 transition-all duration-300 animate-fade-in"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="flex justify-between items-start mb-8">
                                    <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-700 overflow-hidden group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                                        {company.logo_url ? (
                                            <img src={company.logo_url} alt={company.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Building2 className="w-8 h-8 text-slate-300 group-hover:text-blue-500 transition-colors" />
                                        )}
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 dark:bg-blue-900/40 px-3 py-1 rounded-full">
                                        {company.industry || 'Tech'}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 transition-colors tracking-tight">
                                    {company.name}
                                </h3>

                                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium line-clamp-3 mb-8 leading-relaxed">
                                    {company.description || 'Pioneering innovative solutions and building the future of the industry through excellence and creativity.'}
                                </p>

                                <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-slate-800">
                                    <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-400 font-bold">
                                        <MapPin className="w-4 h-4 text-blue-500" />
                                        {company.location || 'Global Headquarters'}
                                    </div>
                                    {company.website && (
                                        <Link
                                            href={company.website}
                                            target="_blank"
                                            className="flex items-center gap-3 text-sm text-blue-600 font-bold hover:underline"
                                        >
                                            <Globe className="w-4 h-4" />
                                            Visit Website
                                        </Link>
                                    )}
                                </div>

                                <Link
                                    href={`/jobs?company_id=${company.id}`}
                                    className="mt-8 w-full py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 group-hover:bg-slate-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-slate-900 transition-all"
                                >
                                    View Open Positions <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
