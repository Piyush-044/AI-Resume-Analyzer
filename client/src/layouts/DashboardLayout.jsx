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
      <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-200">
        <div
          className={`fixed inset-0 z-40 bg-black/50 lg:hidden ${sidebarOpen ? '' : 'hidden'}`}
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={`fixed inset-y-0 left-0 z-50 transform transition lg:static lg:translate-x-0 ${
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
