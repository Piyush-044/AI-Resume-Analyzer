import { Navigate, Outlet } from 'react-router-dom';
import { FileText, Sun, Moon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

export default function AuthLayout() {
  const { isAuthenticated, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!loading && isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50/50 dark:bg-[#030712] p-4 transition-colors duration-300">
      {/* Glow mesh blobs behind content */}
      <div className="pointer-events-none absolute -left-20 -top-20 -z-10 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10 blur-[120px] dark:from-indigo-650/5 dark:to-purple-650/5 animate-pulse" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 -z-10 h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-fuchsia-500/10 to-indigo-500/10 blur-[150px] dark:from-purple-650/5 dark:to-indigo-650/5" />
      <div className="absolute inset-0 -z-10 bg-grid-pattern opacity-100" />

      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-200/50 dark:text-slate-350 dark:hover:bg-slate-850 transition-all duration-200"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <Moon className="h-5 w-5 text-indigo-500" /> : <Sun className="h-5 w-5 text-amber-500" />}
        </button>
      </div>
      <div className="w-full max-w-md animate-fadeIn">
        <div className="mb-8 flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-md shadow-indigo-500/20">
            <FileText className="h-6 w-6 text-white" />
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">ResumeAI</h1>
        </div>
        <div className="rounded-2xl border border-slate-200/50 bg-white/70 p-8 shadow-xl backdrop-blur-md dark:border-slate-800/40 dark:bg-slate-900/40 dark:backdrop-blur-lg">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
