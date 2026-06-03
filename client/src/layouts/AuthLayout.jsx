import { Navigate, Outlet } from 'react-router-dom';
import { FileText, Sun, Moon } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

export default function AuthLayout() {
  const { isAuthenticated, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  if (!loading && isAuthenticated) return <Navigate to="/dashboard" replace />;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 p-4 transition-colors duration-200 relative">
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="rounded-lg p-2 text-slate-600 hover:bg-slate-200/50 dark:text-slate-300 dark:hover:bg-slate-800 transition"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </button>
      </div>
      <div className="w-full max-w-md animate-fadeIn">
        <div className="mb-8 flex flex-col items-center">
          <FileText className="h-12 w-12 text-primary-600" />
          <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">ResumeAI</h1>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-lg dark:border-slate-800 dark:bg-slate-900">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
