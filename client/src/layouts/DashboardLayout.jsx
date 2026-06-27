import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/layout/Sidebar';
import Header from '../components/layout/Header';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import AuroraBackground from '../components/ui/AuroraBackground';
import SpotlightCursor from '../components/ui/SpotlightCursor';

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
      <div className="relative flex h-screen overflow-hidden bg-[#030712] p-3 gap-3 transition-all duration-300">
        {/* Aurora Background */}
        <AuroraBackground className="-z-10" />
        <SpotlightCursor />

        {/* Dot grid overlay */}
        <div className="absolute inset-0 -z-10 dot-grid opacity-20 pointer-events-none" />

        {/* Mobile overlay */}
        <div
          className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden ${sidebarOpen ? '' : 'hidden'}`}
          onClick={() => setSidebarOpen(false)}
        />

        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 lg:static lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <Sidebar onNavigate={() => setSidebarOpen(false)} />
        </div>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden gap-3">
          <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
          <main className="flex-1 overflow-y-auto rounded-2xl border border-white/[0.06] bg-white/[0.02] p-4 lg:p-7 backdrop-blur-xl shadow-[0_4px_40px_rgba(0,0,0,0.4)]">
            <Outlet />
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
