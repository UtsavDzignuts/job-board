import Link from 'next/link';
import { Sparkles, MapPin, Building, DollarSign, Clock, ArrowRight, CheckCircle2, Search, Briefcase } from 'lucide-react';

export default function Index() {
  return (
    <div className="relative isolate flex flex-col min-h-screen overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.08),transparent_70%)]"></div>

      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-24 sm:pt-32 lg:flex lg:items-center lg:gap-x-10 lg:px-8 lg:pt-40">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:flex-auto animate-slide-up">
          <div className="flex items-center gap-x-2 rounded-full px-4 py-1 text-sm font-bold leading-6 text-blue-600 ring-1 ring-inset ring-blue-600/10 bg-blue-50/50 dark:bg-blue-900/20 w-fit mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Join 5,000+ companies hiring today</span>
          </div>
          <h1 className="text-5xl font-[900] tracking-tight text-slate-900 sm:text-7xl dark:text-white leading-[1.1]">
            Your next <span className="gradient-text">career milestone</span> starts right here.
          </h1>
          <p className="mt-8 text-lg leading-8 text-slate-600 dark:text-slate-400 max-w-xl">
            Connecting passionate professionals with innovative companies. Browse thousands of curated listings and build your future with confidence.
          </p>
          <div className="mt-12 flex items-center gap-x-6">
            <Link
              href="/jobs"
              className="button-primary px-10 py-4 text-base shadow-2xl shadow-blue-500/40 flex items-center gap-3 transition-transform hover:-translate-y-1"
            >
              Get started <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/about" className="text-sm font-bold leading-6 text-slate-900 dark:text-white flex items-center gap-2 group hover:text-blue-600 transition-colors">
              How it works <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
          <div className="mt-12 flex items-center gap-8 border-t border-slate-200 dark:border-slate-800 pt-10">
            <div>
              <p className="text-3xl font-[900] text-slate-900 dark:text-white">12k+</p>
              <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">Active Jobs</p>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-slate-800"></div>
            <div>
              <p className="text-3xl font-[900] text-slate-900 dark:text-white">500+</p>
              <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">Companies</p>
            </div>
            <div className="w-px h-10 bg-slate-200 dark:bg-slate-800"></div>
            <div>
              <p className="text-3xl font-[900] text-slate-900 dark:text-white">24/7</p>
              <p className="text-sm font-medium text-slate-500 mt-1 uppercase tracking-wider">Expert Support</p>
            </div>
          </div>
        </div>

        <div className="mt-16 sm:mt-24 lg:mt-0 lg:flex-shrink-0 lg:flex-grow animate-fade-in [animation-delay:200ms]">
          <div className="glass-card p-2 sm:-m-4 lg:-m-2 max-w-[500px] mx-auto overflow-hidden">
            <div className="bg-white dark:bg-slate-950 rounded-2xl shadow-inner border border-slate-100 dark:border-slate-900">
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-900">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="text-blue-600 w-5 h-5" /> Featured Talent
                  </h2>
                  <span className="text-blue-600 text-xs font-black uppercase tracking-widest">New Openings</span>
                </div>

                {[
                  { title: 'Senior Frontend Lead', company: 'Plexus AI', location: 'Remote', salary: '$140k - $190k', color: 'bg-blue-50 text-blue-600' },
                  { title: 'UX Strategy Director', company: 'Creative Labs', location: 'New York', salary: '$130k - $170k', color: 'bg-indigo-50 text-indigo-600' },
                  { title: 'Staff Systems Engineer', company: 'Nova Systems', location: 'London', salary: '£90k - £120k', color: 'bg-emerald-50 text-emerald-600' },
                ].map((job, idx) => (
                  <div key={idx} className="group p-5 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl hover:bg-blue-50/50 border border-transparent hover:border-blue-100 transition-all cursor-pointer">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-slate-200/50 dark:border-slate-800 group-hover:scale-110 transition-transform ${job.color}`}>
                        <Building className="w-6 h-6" />
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-extrabold text-slate-900 dark:text-white leading-tight">{job.title}</h3>
                        <div className="flex gap-4 mt-1 text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {job.location}</span>
                          <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {job.salary}</span>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center group-hover:bg-blue-600 group-hover:border-blue-600 transition-all">
                        <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <div className="bg-white dark:bg-slate-950 border-y border-slate-100 dark:border-slate-900 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-center text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-10">Trusted by industry leaders</p>
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-8 opacity-40 grayscale contrast-125 dark:invert">
            <span className="text-2xl font-black italic">Google</span>
            <span className="text-2xl font-black italic">Netflix</span>
            <span className="text-2xl font-black italic">Stripe</span>
            <span className="text-2xl font-black italic">Airbnb</span>
            <span className="text-2xl font-black italic">Vercel</span>
          </div>
        </div>
      </div>
    </div>
  );
}
