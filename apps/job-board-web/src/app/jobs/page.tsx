'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Briefcase, MapPin, Building, DollarSign, Clock, ArrowRight, Search, Filter, Globe, Sparkles, CheckCircle2, X } from 'lucide-react';
import { jobService } from '../../services/job.service';
import { Job } from '../../types';

export default function JobsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const companyIdParam = searchParams.get('company_id');

    const [jobs, setJobs] = useState<Job[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        job_type: [] as string[],
        experience_level: '',
        remote: false,
    });
    // const [activeCompany, setActiveCompany] = useState<any>(null);

    // // Fetch company details if company_id is present
    // useEffect(() => {
    //     const fetchCompany = async () => {
    //         if (companyIdParam) {
    //             try {
    //                 const company = await jobService.getCompanyById(companyIdParam);
    //                 setActiveCompany(company);
    //             } catch (error) {
    //                 console.error('Failed to fetch company details:', error);
    //                 setActiveCompany(null);
    //             }
    //         } else {
    //             setActiveCompany(null);
    //         }
    //     };
    //     fetchCompany();
    // }, [companyIdParam]);

    const fetchJobs = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {
                search: search || undefined,
                job_type: filters.job_type.length > 0 ? filters.job_type[0] : undefined, // Backend currently takes one string, but UI has checkboxes. Let's send first for now or refine backend later.
                experience_level: filters.experience_level !== 'All Levels' ? filters.experience_level : undefined,
                remote: filters.remote || undefined,
                company_id: companyIdParam || undefined,
            };
            const response = await jobService.getJobs(params);
            setJobs(response.data);
            setTotal(response.total);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        } finally {
            setLoading(false);
        }
    }, [search, filters, companyIdParam]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchJobs();
        }, 300);
        return () => clearTimeout(timer);
    }, [fetchJobs]);

    const handleJobTypeChange = (type: string) => {
        setFilters(prev => ({
            ...prev,
            job_type: prev.job_type.includes(type)
                ? prev.job_type.filter(t => t !== type)
                : [type] // For now, only one at a time to match backend
        }));
    };

    const clearFilters = () => {
        setSearch('');
        setFilters({
            job_type: [],
            experience_level: 'All Levels',
            remote: false,
        });
        if (companyIdParam) {
            router.push('/jobs');
        }
    };

    const clearCompanyFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('company_id');
        router.push(`/jobs?${params.toString()}`);
    };

    return (
        <div className="bg-slate-50 dark:bg-slate-950 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16 animate-slide-up">
                    <div className="max-w-xl">
                        <h1 className="text-5xl font-black text-slate-900 dark:text-white leading-tight tracking-tighter">
                            Explore your <span className="text-blue-600">potential</span>.
                        </h1>
                        <p className="mt-4 text-lg text-slate-500 font-medium">
                            We found {total} active openings that match your passion.
                        </p>
                    </div>
                    <div className="flex flex-col gap-4 w-full md:w-[480px]">
                        <div className="flex bg-white dark:bg-slate-900 p-2 rounded-4xl shadow-2xl shadow-blue-500/5 ring-1 ring-slate-200 dark:ring-slate-800 group focus-within:ring-blue-500/50 transition-all">
                            <div className="flex items-center grow pl-4 pr-2">
                                <Search className="text-slate-400 w-5 h-5 shrink-0 group-focus-within:text-blue-600 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Job title, company, skills..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full px-4 py-3 outline-none text-slate-900 dark:text-white bg-transparent font-bold placeholder:text-slate-400"
                                />
                                {search && (
                                    <button onClick={() => setSearch('')} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg">
                                        <X className="w-4 h-4 text-slate-400" />
                                    </button>
                                )}
                            </div>
                        </div>
                        {/* {activeCompany && (
                            <div className="flex items-center gap-3 bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-2xl border border-blue-100 dark:border-blue-800/50 animate-in fade-in slide-in-from-left-4">
                                <Building className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                <span className="text-sm font-bold text-blue-800 dark:text-blue-300">
                                    Jobs at <span className="font-black underline decoration-blue-500/30 underline-offset-4">{activeCompany.name}</span>
                                </span>
                                <button
                                    onClick={clearCompanyFilter}
                                    className="ml-auto p-1 hover:bg-blue-100 dark:hover:bg-blue-800/50 rounded-lg transition-colors"
                                    title="Clear company filter"
                                >
                                    <X className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                </button>
                            </div>
                        )} */}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1 space-y-8 animate-slide-up [animation-delay:100ms]">
                        <div className="bg-white dark:bg-slate-900 p-8 rounded-4xl shadow-xl shadow-blue-500/5 border border-slate-100 dark:border-slate-800">
                            <h2 className="font-black text-slate-900 dark:text-white mb-8 text-xl flex items-center gap-3">
                                <Filter className="w-5 h-5 text-blue-600" /> Filters
                            </h2>

                            <div className="space-y-10">
                                <section>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-6 underline decoration-blue-600/30 decoration-4 underline-offset-8">Job Type</label>
                                    <div className="space-y-4">
                                        {['Full-time', 'Part-time', 'Contract', 'Internship'].map((type) => (
                                            <label key={type} className="flex items-center gap-4 cursor-pointer group">
                                                <div className="relative flex items-center justify-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={filters.job_type.includes(type)}
                                                        onChange={() => handleJobTypeChange(type)}
                                                        className="peer w-6 h-6 opacity-0 absolute cursor-pointer"
                                                    />
                                                    <div className="w-6 h-6 rounded-lg border-2 border-slate-200 dark:border-slate-700 peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all flex items-center justify-center">
                                                        <CheckCircle2 className={`w-4 h-4 text-white transition-opacity ${filters.job_type.includes(type) ? 'opacity-100' : 'opacity-0'}`} />
                                                    </div>
                                                </div>
                                                <span className={`text-sm font-bold transition-colors uppercase tracking-wide ${filters.job_type.includes(type) ? 'text-blue-600' : 'text-slate-600 dark:text-slate-400 group-hover:text-blue-600'}`}>
                                                    {type}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-6 underline decoration-blue-600/30 decoration-4 underline-offset-8">Experience</label>
                                    <div className="relative">
                                        <select
                                            value={filters.experience_level}
                                            onChange={(e) => setFilters(prev => ({ ...prev, experience_level: e.target.value }))}
                                            className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all appearance-none cursor-pointer"
                                        >
                                            <option>All Levels</option>
                                            <option>Entry Level</option>
                                            <option>Mid Level</option>
                                            <option>Senior Level</option>
                                        </select>
                                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                            <ArrowRight className="w-4 h-4 rotate-90" />
                                        </div>
                                    </div>
                                </section>

                                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                                    <label className="flex items-center gap-4 cursor-pointer group">
                                        <div className="relative flex items-center justify-center">
                                            <input
                                                type="checkbox"
                                                checked={filters.remote}
                                                onChange={() => setFilters(prev => ({ ...prev, remote: !prev.remote }))}
                                                className="peer w-6 h-6 opacity-0 absolute cursor-pointer"
                                            />
                                            <div className="w-6 h-6 rounded-lg border-2 border-slate-200 dark:border-slate-700 peer-checked:bg-emerald-600 peer-checked:border-emerald-600 transition-all flex items-center justify-center">
                                                <Globe className={`w-4 h-4 text-white transition-opacity ${filters.remote ? 'opacity-100' : 'opacity-0'}`} />
                                            </div>
                                        </div>
                                        <div>
                                            <span className={`text-sm font-black transition-colors block uppercase tracking-wide ${filters.remote ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-300'}`}>Remote Only</span>
                                            <span className="text-[10px] font-bold text-slate-400 uppercase">Worldwide ops</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-8 rounded-4xl text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden group">
                            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                            <Sparkles className="w-8 h-8 mb-4 text-blue-200" />
                            <h3 className="text-xl font-black mb-2 leading-tight">Post Your Job</h3>
                            <p className="text-blue-100 text-sm font-medium mb-6 leading-relaxed">Find the perfect talent for your team in minutes.</p>
                            <Link href="/post-job" className="w-full bg-white text-blue-600 py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors shadow-lg">
                                Get Started <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>

                    {/* Job Listings */}
                    <div className="lg:col-span-3 space-y-6 animate-slide-up [animation-delay:200ms]">
                        {loading ? (
                            Array(3).fill(0).map((_, i) => (
                                <div key={i} className="bg-white dark:bg-slate-900 p-8 rounded-4xl shadow-xl shadow-blue-500/5 border border-slate-100 dark:border-slate-800 animate-pulse">
                                    <div className="flex items-start gap-6">
                                        <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl"></div>
                                        <div className="space-y-4 grow">
                                            <div className="h-6 bg-slate-100 dark:bg-slate-800 rounded w-1/3"></div>
                                            <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-1/4"></div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : jobs.length === 0 ? (
                            <div className="bg-white dark:bg-slate-900 p-20 rounded-[3rem] shadow-2xl shadow-blue-500/5 text-center border-2 border-dashed border-slate-100 dark:border-slate-800">
                                <div className="w-24 h-24 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 text-5xl">🔭</div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Nothing found</h3>
                                <p className="text-slate-500 mt-4 text-lg font-medium max-w-xs mx-auto leading-relaxed">
                                    We couldn't find any jobs matching your criteria. Try adjusting your filters.
                                </p>
                                <button
                                    onClick={clearFilters}
                                    className="mt-10 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-10 py-4 rounded-2xl font-black hover:scale-[1.05] transition-all"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        ) : (
                            jobs.map((job: any) => (
                                <div key={job.id} className="bg-white dark:bg-slate-900 p-8 rounded-4xl shadow-xl shadow-blue-500/5 border border-slate-100 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-900/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all group relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-blue-50/50 dark:from-blue-900/10 to-transparent -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    <div className="flex flex-col sm:flex-row items-start justify-between gap-6">
                                        <div className="flex items-start gap-6">
                                            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800 group-hover:scale-110 transition-transform overflow-hidden shadow-sm shrink-0">
                                                {job.company.logo_url ? (
                                                    <img src={job.company.logo_url} alt={job.company.name} className="object-contain p-2" />
                                                ) : (
                                                    <Building className="w-8 h-8 text-slate-300" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    <span className="bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-blue-100 dark:border-blue-900/30">
                                                        {job.job_type}
                                                    </span>
                                                    {job.remote && (
                                                        <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border border-emerald-100 dark:border-emerald-900/30">
                                                            Remote
                                                        </span>
                                                    )}
                                                </div>
                                                <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors tracking-tighter leading-tight">
                                                    <Link href={`/jobs/${job.id}`}>{job.title}</Link>
                                                </h3>
                                                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                    <span className="flex items-center gap-2"><MapPin className="w-4 h-4 text-slate-300" /> {job.location}</span>
                                                    <span className="flex items-center gap-2 underline underline-offset-4 decoration-slate-200 dark:decoration-slate-800 decoration-2"><Building className="w-4 h-4 text-slate-300" /> {job.company.name}</span>
                                                    <span className="flex items-center gap-2 text-blue-600 dark:text-blue-400"><DollarSign className="w-4 h-4" /> {job.salary_range || 'Competitive'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end gap-3 self-end sm:self-start">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-tighter">Listed {new Date(job.created_at).toLocaleDateString()}</p>
                                            <Link
                                                href={`/jobs/${job.id}`}
                                                className="bg-slate-50 dark:bg-slate-800 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 p-4 rounded-2xl transition-all shadow-sm flex items-center justify-center group/btn"
                                            >
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </div>

                                    <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                                        <div className="flex flex-wrap gap-3">
                                            {job.tags.map((tag: any) => (
                                                <span key={tag.id} className="bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-50 hover:text-blue-600 transition-all cursor-default">
                                                    #{tag.name}
                                                </span>
                                            ))}
                                        </div>
                                        <Link href={`/jobs/${job.id}`} className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2 group/more">
                                            Details <div className="w-6 h-6 rounded-full bg-slate-900 dark:bg-white dark:text-slate-900 text-white flex items-center justify-center group-hover/more:bg-blue-600 group-hover/more:text-white transition-all"><ArrowRight className="w-3" /></div>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
