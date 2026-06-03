import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Upload,
  FileSearch,
  Briefcase,
  PenLine,
  Mail,
  User,
  LogOut,
  FileText,
  Brain,
  Compass,
  Linkedin,
  Code,
  Edit,
  GitCompare,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const links = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/upload', icon: Upload, label: 'Upload Resume' },
  { to: '/analysis', icon: FileSearch, label: 'ATS Analysis' },
  { to: '/resume-compare', icon: GitCompare, label: 'Resume Compare' },
  { to: '/job-match', icon: Briefcase, label: 'Job Matching' },
  { to: '/jobs-board', icon: Briefcase, label: 'AI Jobs Board' },
  { to: '/rewriter', icon: PenLine, label: 'Resume Rewriter' },
  { to: '/resume-builder', icon: Edit, label: 'Resume Builder' },
  { to: '/cover-letter', icon: Mail, label: 'Cover Letter' },
  { to: '/interview-prep', icon: Brain, label: 'Interview Prep' },
  { to: '/career-roadmap', icon: Compass, label: 'Career Roadmap' },
  { to: '/linkedin-optimizer', icon: Linkedin, label: 'LinkedIn Optimize' },
  { to: '/portfolio-generator', icon: Code, label: 'Portfolio Builder' },
  { to: '/profile', icon: User, label: 'Profile' },
];

export default function Sidebar({ onNavigate }) {
  const { logout, user } = useAuth();

  return (
    <aside className="flex h-full w-64 flex-col border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 transition-colors duration-200">
      <div className="flex items-center gap-2 border-b border-slate-200 px-6 py-5 dark:border-slate-800">
        <FileText className="h-8 w-8 text-primary-600" />
        <span className="text-xl font-bold text-slate-900 dark:text-white">ResumeAI</span>
      </div>
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-primary-400'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
              }`
            }
          >
            <Icon className="h-5 w-5" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-slate-200 p-4 dark:border-slate-800">
        <p className="truncate px-3 text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
        <button
          onClick={logout}
          className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
