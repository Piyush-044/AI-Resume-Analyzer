import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import ProtectedRoute from '../components/layout/ProtectedRoute';

const titles = {
  '/dashboard': 'Dashboard',
  '/upload': 'Upload Resume',
  '/analysis': 'ATS Analysis',
  '/job-match': 'Job Matching',
  '/rewriter': 'Resume Rewriter',
  '/cover-letter': 'Cover Letter Generator',
  '/interview-prep': 'AI Interview Prep',
  '/career-roadmap': 'AI Career Roadmap',
  '/linkedin-optimizer': 'LinkedIn Optimizer',
  '/portfolio-generator': 'Portfolio Website Generator',
  '/resume-builder': 'Resume Builder',
  '/jobs-board': 'AI Jobs Board',
  '/resume-compare': 'Resume Compare',
  '/profile': 'Profile',
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const title = titles[pathname] || 'Dashboard';

  return (
    <ProtectedRoute>
      <div className="relative flex h-screen overflow-hidden bg-slate-50/30 dark:bg-[#030712] transition-colors duration-300">
        {/* Glow mesh blobs behind content */}
        <div className="pointer-events-none absolute -left-20 -top-20 -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10 blur-[120px] dark:from-indigo-600/5 dark:to-purple-600/5" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 -z-10 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-fuchsia-500/10 to-indigo-500/10 blur-[150px] dark:from-purple-600/5 dark:to-indigo-600/5" />
        <div className="pointer-events-none absolute left-[45%] top-[30%] -z-10 h-[400px] w-[400px] rounded-full bg-indigo-500/5 blur-[100px] dark:bg-indigo-500/5 animate-pulse" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-100" />

        <div
          className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden ${sidebarOpen ? '' : 'hidden'}`}
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </div>
        <div className="flex flex-1 flex-col overflow-hidden">
          <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
