'use client';

import { useAuth } from '../../context/AuthContext';
import { Briefcase, Building2, PlusCircle, Search, Settings, User as UserIcon, Calendar, MapPin, DollarSign, Clock } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Access Denied</h1>
                <p className="text-slate-500 mb-8">Please login to view your dashboard.</p>
                <Link href="/login" className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-bold">Login</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-12">
                <div className="flex items-center gap-4 mb-2">
                    <span className="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
                        {user.role.replace('_', ' ')}
                    </span>
                    <span className="text-slate-400 text-sm font-bold flex items-center gap-1">
                        System Access Verified <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    </span>
                </div>
                <h1 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
                    Welcome back, <span className="text-blue-600">{user.full_name.split(' ')[0]}</span>
                </h1>
                <p className="text-slate-500 mt-4 text-lg font-medium">Here's an overview of your activity today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Stats Cards */}
                {user.role === 'candidate' ? (
                    <>
                        <StatCard icon={<Briefcase className="w-6 h-6" />} label="Applications" value="12" sub="4 new this week" color="blue" />
                        <StatCard icon={<Calendar className="w-6 h-6" />} label="Interviews" value="3" sub="Next: Tomorrow, 2PM" color="indigo" />
                        <StatCard icon={<Search className="w-6 h-6" />} label="Job Matches" value="48" sub="Based on your profile" color="emerald" />
                    </>
                ) : user.role === 'recruiter' ? (
                    <>
                        <StatCard icon={<Building2 className="w-6 h-6" />} label="Active Postings" value="5" sub="2 expiring soon" color="blue" />
                        <StatCard icon={<UserIcon className="w-6 h-6" />} label="Total Applicants" value="156" sub="+24 new today" color="indigo" />
                        <StatCard icon={<PlusCircle className="w-6 h-6" />} label="Credits Left" value="8" sub="Premium account active" color="emerald" />
                    </>
                ) : (
                    <>
                        <StatCard icon={<UserIcon className="w-6 h-6" />} label="Total Users" value="2.4k" sub="+8% increase" color="blue" />
                        <StatCard icon={<Briefcase className="w-6 h-6" />} label="Total Jobs" value="850" sub="12 flag alerts" color="indigo" />
                        <StatCard icon={<Building2 className="w-6 h-6" />} label="Organizations" value="420" sub="8 pending review" color="emerald" />
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8 flex items-center justify-between">
                            {user.role === 'candidate' ? 'Recommended Jobs' : user.role === 'recruiter' ? 'Active Listings' : 'Recent System Activity'}
                            <Link href={user.role === 'candidate' ? "/jobs" : "#"} className="text-sm text-blue-600 font-bold hover:underline">View All</Link>
                        </h2>

                        <div className="space-y-4">
                            {/* Mock Data based on role */}
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="flex items-center gap-6 p-5 rounded-3xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700 group">
                                    <div className="w-14 h-14 bg-slate-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/20 transition-colors">
                                        <Briefcase className="text-slate-400 group-hover:text-blue-600 w-6 h-6 transition-colors" />
                                    </div>
                                    <div className="grow">
                                        <h3 className="font-black text-slate-900 dark:text-white text-lg">Senior UI/UX Designer</h3>
                                        <div className="flex flex-wrap items-center gap-4 text-slate-500 text-sm font-medium mt-1">
                                            <span className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-blue-500" /> MetaLab</span>
                                            <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-blue-500" /> Remote</span>
                                            <span className="flex items-center gap-1"><DollarSign className="w-3.5 h-3.5 text-blue-500" /> $120k - $160k</span>
                                        </div>
                                    </div>
                                    <button className="bg-white dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white px-5 py-2 rounded-2xl text-sm font-black hover:bg-slate-900 hover:text-white dark:hover:bg-white dark:hover:text-slate-900 transition-all">
                                        {user.role === 'candidate' ? 'Quick Apply' : 'Manage'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-slate-900 dark:bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-blue-500/20">
                        <h2 className="text-xl font-black mb-4">Complete your setup</h2>
                        <p className="text-slate-400 dark:text-blue-100 text-sm leading-relaxed mb-6 font-medium">Your profile is 85% complete. Add your latest project to increase visibility by 2x.</p>
                        <div className="w-full bg-white/10 dark:bg-black/10 rounded-full h-3 mb-8">
                            <div className="bg-blue-500 dark:bg-white h-3 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]" style={{ width: '85%' }}></div>
                        </div>
                        <button className="w-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-4 rounded-3xl font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all">
                            Enhance Profile
                        </button>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
                        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">Tools & Settings</h2>
                        <div className="space-y-3">
                            <SidebarLink icon={<Settings className="w-5 h-5" />} label="System Settings" />
                            <SidebarLink icon={<Clock className="w-5 h-5" />} label="Recent Activity" />
                            <SidebarLink icon={<Search className="w-5 h-5" />} label="Saved Searches" />
                            <SidebarLink icon={<UserIcon className="w-5 h-5" />} label="KYC Verification" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, sub, color }: { icon: React.ReactNode, label: string, value: string, sub: string, color: 'blue' | 'indigo' | 'emerald' }) {
    const colors = {
        blue: 'from-blue-500 to-blue-600 shadow-blue-500/20',
        indigo: 'from-indigo-500 to-indigo-600 shadow-indigo-500/20',
        emerald: 'from-emerald-500 to-emerald-600 shadow-emerald-500/20'
    };

    return (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none group hover:translate-y-[-4px] transition-all">
            <div className={`w-14 h-14 bg-linear-to-br ${colors[color]} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg`}>
                {icon}
            </div>
            <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] mb-1">{label}</p>
            <p className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">{value}</p>
            <p className="text-slate-400 text-xs font-bold">{sub}</p>
        </div>
    );
}

function SidebarLink({ icon, label }: { icon: React.ReactNode, label: string }) {
    return (
        <Link href="#" className="flex items-center gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-bold text-slate-600 dark:text-slate-400 text-sm group">
            <span className="text-slate-400 group-hover:text-blue-500 transition-colors">{icon}</span>
            {label}
        </Link>
    );
}
