import './global.css';
import { AuthProvider } from '../context/AuthContext';
import Header from '../components/Header';
import Link from 'next/link';
import { Briefcase } from 'lucide-react';

export const metadata = {
  title: 'JobBoard | Find Your Dream Job',
  description: 'Premium job board platform for developers and companies.',
};

import { GoogleOAuthProvider } from '@react-oauth/google';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col selection:bg-blue-100">
        <GoogleOAuthProvider clientId="799840615635-m21c2hiti7oln1s6aucroaa90bsd17dt.apps.googleusercontent.com">
          <AuthProvider>
            <Header />
            <main className="grow">
              {children}
            </main>
          </AuthProvider>
        </GoogleOAuthProvider>

        <footer className="bg-gray-50 dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800">
          <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="col-span-2">
                <Link href="/" className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-sm">J</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">JobBoard</span>
                </Link>
                <p className="text-gray-500 text-sm max-w-xs">
                  Connecting the world's best developers with leading tech companies.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Product</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link href="/jobs" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">Find Jobs</Link></li>
                  <li><Link href="/post-job" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">Post a Job</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider">Support</h3>
                <ul className="mt-4 space-y-4">
                  <li><Link href="/about" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">About Us</Link></li>
                  <li><Link href="/contact" className="text-gray-500 hover:text-blue-600 transition-colors text-sm">Contact</Link></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 border-t border-gray-200 dark:border-zinc-800 pt-8 flex justify-between items-center">
              <p className="text-gray-400 text-sm">© 2026 JobBoard. All rights reserved.</p>
              <div className="flex space-x-6">
                {/* Social icons could go here */}
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
