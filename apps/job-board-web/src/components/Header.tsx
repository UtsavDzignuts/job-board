'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { Briefcase, Building2, PlusCircle, LogIn, UserPlus, LogOut, User as UserIcon, Settings, LayoutDashboard, Clock, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
    const { user, isAuthenticated, logout, loading } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 glass border-b border-slate-200/50 dark:border-slate-800/50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Left side: Logo and Desktop Nav */}
                    <div className="flex items-center gap-10">
                        <Link href="/" className="shrink-0 flex items-center gap-3 group">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/40 group-hover:rotate-6 transition-all duration-300">
                                <Briefcase className="text-white w-6 h-6 sm:w-7 sm:h-7" />
                            </div>
                            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                                Job<span className="text-blue-600">Board</span>
                            </span>
                        </Link>

                        <div className="hidden md:flex items-center space-x-1">
                            <Link href="/jobs" className="nav-link flex items-center gap-2">
                                <Briefcase className="w-4 h-4" /> Find Jobs
                            </Link>
                            <Link href="/companies" className="nav-link flex items-center gap-2">
                                <Building2 className="w-4 h-4" /> Companies
                            </Link>
                            {isAuthenticated && (
                                <Link href="/applications" className="nav-link flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-blue-500" /> Applications
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Right side: Actions */}
                    <div className="flex items-center gap-2 sm:gap-4">
                        {(user?.role === 'recruiter' || user?.role === 'admin') && (
                            <Link href="/post-job" className="hidden lg:flex text-blue-600 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-900/40 px-5 py-2.5 rounded-2xl text-sm font-bold transition-all items-center gap-2 border border-blue-100 dark:border-blue-900/50">
                                <PlusCircle className="w-4 h-4" /> Post a Job
                            </Link>
                        )}

                        <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 mx-2 hidden lg:block"></div>

                        {/* Desktop Auth */}
                        <div className="hidden md:flex items-center gap-4">
                            {!loading && (
                                isAuthenticated ? (
                                    <div className="relative">
                                        <button
                                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                                            className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                                        >
                                            <div className="flex flex-col items-end hidden sm:flex">
                                                <span className="text-sm font-bold text-slate-900 dark:text-white leading-none">
                                                    {user?.full_name}
                                                </span>
                                                <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 font-bold mt-1">
                                                    {user?.role.replace('_', ' ')}
                                                </span>
                                            </div>
                                            <div className="w-10 h-10 bg-linear-to-tr from-blue-100 to-indigo-100 dark:from-blue-900/40 dark:to-indigo-900/40 rounded-full flex items-center justify-center border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 shadow-sm">
                                                <UserIcon className="w-5 h-5" />
                                            </div>
                                        </button>

                                        {isProfileOpen && (
                                            <>
                                                <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)}></div>
                                                <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white dark:bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 py-2 z-20 animate-in fade-in zoom-in duration-200 origin-top-right">
                                                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 mb-1">
                                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Account</p>
                                                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user?.email}</p>
                                                    </div>
                                                    <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" onClick={() => setIsProfileOpen(false)}>
                                                        <LayoutDashboard className="w-4 h-4 text-blue-500" /> Dashboard
                                                    </Link>
                                                    <Link href="/profile" className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors" onClick={() => setIsProfileOpen(false)}>
                                                        <UserIcon className="w-4 h-4 text-indigo-500" /> My Profile
                                                    </Link>
                                                    <button
                                                        onClick={() => { logout(); setIsProfileOpen(false); }}
                                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
                                                    >
                                                        <LogOut className="w-4 h-4" /> Logout
                                                    </button>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3">
                                        <Link href="/login" className="text-slate-600 hover:text-blue-600 px-4 py-2.5 text-sm font-bold transition-colors flex items-center gap-2">
                                            <LogIn className="w-4 h-4" /> Login
                                        </Link>
                                        <Link href="/register" className="bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-7 py-3 rounded-2xl text-sm font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-slate-900/10 flex items-center gap-2">
                                            <UserPlus className="w-4 h-4" /> Sign Up
                                        </Link>
                                    </div>
                                )
                            )}
                        </div>

                        {/* Hamburger Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 animate-in slide-in-from-top-4 duration-300 pb-6">
                        <div className="px-4 py-6 space-y-4">
                            <Link href="/jobs" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold" onClick={() => setIsMenuOpen(false)}>
                                <Briefcase className="w-5 h-5 text-blue-500" /> Find Jobs
                            </Link>
                            <Link href="/companies" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold" onClick={() => setIsMenuOpen(false)}>
                                <Building2 className="w-5 h-5 text-indigo-500" /> Companies
                            </Link>

                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-4"></div>

                            {!loading && (
                                isAuthenticated ? (
                                    <div className="space-y-4">
                                        <div className="px-4 mb-2">
                                            <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">{user?.full_name}</p>
                                            <p className="text-xs text-slate-500 font-bold">{user?.email}</p>
                                        </div>
                                        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold" onClick={() => setIsMenuOpen(false)}>
                                            <LayoutDashboard className="w-5 h-5 text-blue-500" /> Dashboard
                                        </Link>
                                        <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold" onClick={() => setIsMenuOpen(false)}>
                                            <UserIcon className="w-5 h-5 text-indigo-500" /> Profile
                                        </Link>
                                        <button
                                            onClick={() => { logout(); setIsMenuOpen(false); }}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 font-bold text-left"
                                        >
                                            <LogOut className="w-5 h-5" /> Logout
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-3 px-2">
                                        <Link href="/login" className="flex items-center justify-center gap-2 py-4 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold" onClick={() => setIsMenuOpen(false)}>
                                            <LogIn className="w-4 h-4" /> Login
                                        </Link>
                                        <Link href="/register" className="flex items-center justify-center gap-2 py-4 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-500/20" onClick={() => setIsMenuOpen(false)}>
                                            <UserPlus className="w-4 h-4" /> Sign Up
                                        </Link>
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
